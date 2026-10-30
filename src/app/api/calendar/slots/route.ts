import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import {
  firstEmbedded,
  mergeClinicRooms,
  resolveRoomForDoctor,
  type ClinicRoomRow,
  type Room,
} from "@/lib/slot-engine";

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

type SupabaseServiceClient = ReturnType<typeof getServiceSupabase>;

/** Verifica che la prestazione esista nei cataloghi del centro (nuovo motore o legacy). */
async function serviceExists(
  supabase: SupabaseServiceClient,
  serviceId: string
): Promise<boolean> {
  const legacy = await supabase
    .from("medical_services")
    .select("id")
    .eq("id", serviceId)
    .maybeSingle();

  if (!legacy.error && legacy.data) return true;

  const engine = await supabase
    .from("services")
    .select("id")
    .eq("id", serviceId)
    .maybeSingle();

  if (!engine.error && engine.data) return true;

  return false;
}

/** Carica le 5 sale ufficiali dal DB con fallback sulla matrice statica. */
async function loadRooms(supabase: SupabaseServiceClient): Promise<Room[]> {
  const { data, error } = await supabase
    .from("clinic_rooms")
    .select("id, slug, name, floor")
    .order("slug");

  if (error) return mergeClinicRooms([]);
  return mergeClinicRooms((data ?? []) as ClinicRoomRow[]);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
    const doctorId = searchParams.get("doctorId");
    const roomId = searchParams.get("roomId");

    const weekday = getWeekdayNumber(date);
    const supabase = getServiceSupabase();

    // 0. Carica le 5 sale ufficiali (matrice a 4 vie: medico, sala, prestazione, paziente)
    const rooms = await loadRooms(supabase);

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
          is_active,
          specialty_slug
        ),
        clinic_rooms (
          id,
          slug,
          name,
          floor
        )
      `)
      .eq("weekday", weekday)
      .eq("is_active", true);

    if (doctorId) availQuery = availQuery.eq("doctor_id", doctorId);

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
      roomSlug: string | null;
      isAvailable: boolean;
      conflictReason?: string;
    };

    type AvailabilityDoctor = {
      id: string;
      full_name: string;
      title: string | null;
      is_active: boolean;
      specialty_slug: string | null;
    };

    const slots: GeneratedSlot[] = [];

    for (const av of availabilities || []) {
      const doc = firstEmbedded<AvailabilityDoctor>(
        av.doctors as unknown as AvailabilityDoctor | AvailabilityDoctor[] | null
      );
      if (!doc || !doc.is_active) continue;

      // Sala effettiva: quella legata alla disponibilità, altrimenti la stanza
      // predefinita in base alla specialità del medico.
      const slotRoom = resolveRoomForDoctor(
        {
          fullName: doc.full_name,
          specialtySlug: doc.specialty_slug,
          roomId: av.room_id ?? null,
        },
        rooms
      );

      if (roomId && slotRoom?.id !== roomId && slotRoom?.slug !== roomId) continue;

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
          if (!slotRoom?.id || a.room_id !== slotRoom.id) return false;
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
          roomId: slotRoom?.id ?? null,
          roomName: slotRoom?.name ?? "Stanza da assegnare",
          roomSlug: slotRoom?.slug ?? null,
          isAvailable,
          conflictReason: doctorConflict ? "Medico occupato" : roomConflict ? "Stanza occupata" : undefined,
        });
      }
    }

    slots.sort((a, b) => a.time.localeCompare(b.time) || a.doctorName.localeCompare(b.doctorName));

    return NextResponse.json({ date, weekday, totalSlots: slots.length, slots, rooms });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Errore generazione slot";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = getServiceSupabase();
    const body = await req.json();
    const {
      doctorId,
      roomId,
      serviceId,
      date,
      time,
      durationMinutes = 30,
      patientName,
      patientPhone,
      patientEmail,
      notes,
    } = body;

    if (!doctorId || !date || !time || !patientName || !patientPhone) {
      return NextResponse.json({ error: "Dati prenotazione incompleti" }, { status: 400 });
    }

    // 0. Validazione prestazione (se fornita)
    let validServiceId: string | null = null;
    if (serviceId) {
      const valid = await serviceExists(supabase, serviceId);
      if (!valid) {
        return NextResponse.json({ error: "Prestazione non valida o non attiva." }, { status: 400 });
      }
      validServiceId = serviceId;
    }

    // Sala: se non indicata, assegna quella predefinita per la specialità del medico
    let resolvedRoomId: string | null = roomId || null;
    if (!resolvedRoomId) {
      const { data: doctor } = await supabase
        .from("doctors")
        .select("id, full_name, specialty_slug")
        .eq("id", doctorId)
        .maybeSingle();

      if (doctor) {
        const rooms = await loadRooms(supabase);
        const slotRoom = resolveRoomForDoctor(
          {
            fullName: doctor.full_name as string | null,
            specialtySlug: doctor.specialty_slug as string | null,
            roomId: null,
          },
          rooms
        );
        resolvedRoomId = slotRoom?.id ?? null;
      }
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
    if (resolvedRoomId) {
      const { data: roomConflicts } = await supabase
        .from("appointments")
        .select("id")
        .eq("room_id", resolvedRoomId)
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
        room_id: resolvedRoomId,
        service_id: validServiceId,
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

    return NextResponse.json({ success: true, appointmentId: appointment.id, appointment });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Errore creazione appuntamento";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
