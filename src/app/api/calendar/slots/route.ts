import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

function getWeekdayNumber(dateStr: string): number {
  // Returns 1 (Monday) to 7 (Sunday)
  const d = new Date(dateStr + "T00:00:00Z");
  const day = d.getUTCDay();
  return day === 0 ? 7 : day;
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60).toString().padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
    const doctorId = searchParams.get("doctorId");
    const roomId = searchParams.get("roomId");

    const weekday = getWeekdayNumber(date);
    const supabase = getServiceSupabase();

    // 1. Fetch doctor availability matching weekday
    let availQuery = supabase
      .from("doctor_availability")
      .select(`
        id,
        weekday,
        start_time,
        end_time,
        slot_minutes,
        doctor_id,
        room_id,
        doctors (
          id,
          full_name,
          title,
          is_active
        ),
        clinic_rooms (
          id,
          name,
          floor
        )
      `)
      .eq("weekday", weekday)
      .eq("is_active", true);

    if (doctorId) availQuery = availQuery.eq("doctor_id", doctorId);
    if (roomId) availQuery = availQuery.eq("room_id", roomId);

    const { data: availabilities, error: availError } = await availQuery;
    if (availError) throw availError;

    // 2. Fetch existing appointments for the requested date to detect conflicts
    const startOfDay = `${date}T00:00:00Z`;
    const endOfDay = `${date}T23:59:59Z`;

    const { data: existingAppts, error: apptError } = await supabase
      .from("appointments")
      .select("id, doctor_id, room_id, starts_at, ends_at, status")
      .gte("starts_at", startOfDay)
      .lte("starts_at", endOfDay)
      .neq("status", "annullato");

    if (apptError) throw apptError;

    // 3. Generate slots by slicing doctor presence into 30m slots
    type GeneratedSlot = {
      date: string;
      time: string;
      doctorId: string;
      doctorName: string;
      doctorTitle: string | null;
      roomId: string | null;
      roomName: string | null;
      isAvailable: boolean;
      conflictReason?: string;
    };

    const slots: GeneratedSlot[] = [];

    for (const av of availabilities || []) {
      const doc = av.doctors as unknown as { id: string; full_name: string; title: string | null; is_active: boolean } | null;
      if (!doc || !doc.is_active) continue;

      const room = av.clinic_rooms as unknown as { id: string; name: string } | null;
      const startMin = timeToMinutes(av.start_time);
      const endMin = timeToMinutes(av.end_time);
      const step = av.slot_minutes || 30;

      for (let m = startMin; m + step <= endMin; m += step) {
        const timeStr = minutesToTime(m);
        const slotStart = new Date(`${date}T${timeStr}:00Z`).getTime();
        const slotEnd = slotStart + step * 60 * 1000;

        // Check if doctor is already booked in this slot
        const doctorConflict = (existingAppts || []).some((a) => {
          if (a.doctor_id !== doc.id) return false;
          const aStart = new Date(a.starts_at).getTime();
          const aEnd = new Date(a.ends_at).getTime();
          return slotStart < aEnd && slotEnd > aStart;
        });

        // Check if room is already booked by another doctor in this slot
        const roomConflict = (existingAppts || []).some((a) => {
          if (!room || a.room_id !== room.id) return false;
          const aStart = new Date(a.starts_at).getTime();
          const aEnd = new Date(a.ends_at).getTime();
          return slotStart < aEnd && slotEnd > aStart;
        });

        const isAvailable = !doctorConflict && !roomConflict;

        slots.push({
          date,
          time: timeStr,
          doctorId: doc.id,
          doctorName: doc.full_name,
          doctorTitle: doc.title,
          roomId: room?.id || null,
          roomName: room?.name || "Stanza da assegnare",
          isAvailable,
          conflictReason: doctorConflict ? "Medico occupato" : roomConflict ? "Stanza occupata" : undefined,
        });
      }
    }

    return NextResponse.json({ date, weekday, totalSlots: slots.length, slots });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Errore generazione slot";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = getServiceSupabase();
    const body = await req.json();
    const { doctorId, roomId, date, time, durationMinutes = 30, patientName, patientPhone, patientEmail, notes } = body;

    if (!doctorId || !date || !time || !patientName || !patientPhone) {
      return NextResponse.json({ error: "Dati prenotazione incompleti" }, { status: 400 });
    }

    const startsAt = new Date(`${date}T${time}:00Z`).toISOString();
    const endsAt = new Date(new Date(startsAt).getTime() + durationMinutes * 60 * 1000).toISOString();

    // 1. Conflict Check: is doctor free?
    const { data: docConflicts } = await supabase
      .from("appointments")
      .select("id")
      .eq("doctor_id", doctorId)
      .neq("status", "annullato")
      .lt("starts_at", endsAt)
      .gt("ends_at", startsAt);

    if (docConflicts && docConflicts.length > 0) {
      return NextResponse.json({ error: "Il medico ha già una visita in questo orario." }, { status: 409 });
    }

    // 2. Conflict Check: is room free?
    if (roomId) {
      const { data: roomConflicts } = await supabase
        .from("appointments")
        .select("id")
        .eq("room_id", roomId)
        .neq("status", "annullato")
        .lt("starts_at", endsAt)
        .gt("ends_at", startsAt);

      if (roomConflicts && roomConflicts.length > 0) {
        return NextResponse.json({ error: "La stanza è già occupata da un altro specialista in questo orario." }, { status: 409 });
      }
    }

    // 3. Find or create patient profile
    const nameParts = patientName.trim().split(" ");
    const firstName = nameParts[0] || "Paziente";
    const lastName = nameParts.slice(1).join(" ") || "Cocoora";

    let patientId: string | null = null;
    const { data: existingPatient } = await supabase
      .from("patient_profiles")
      .select("id")
      .eq("phone", patientPhone)
      .single();

    if (existingPatient) {
      patientId = existingPatient.id;
    } else {
      const { data: newPatient, error: pError } = await supabase
        .from("patient_profiles")
        .insert({
          first_name: firstName,
          last_name: lastName,
          phone: patientPhone,
          email: patientEmail || null,
        })
        .select("id")
        .single();

      if (!pError && newPatient) {
        patientId = newPatient.id;
      }
    }

    // 4. Create appointment
    const { data: appointment, error: aError } = await supabase
      .from("appointments")
      .insert({
        doctor_id: doctorId,
        room_id: roomId || null,
        patient_id: patientId,
        starts_at: startsAt,
        ends_at: endsAt,
        status: "confermato",
        is_first_visit: true,
        notes: notes || `Prenotazione diretta per ${patientName} (${patientPhone})`,
      })
      .select("id, starts_at, ends_at, status")
      .single();

    if (aError) throw aError;

    return NextResponse.json({ success: true, appointment });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Errore creazione appuntamento";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
