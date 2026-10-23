import { supabase } from "@/lib/supabase";

export type Slot = {
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

function getWeekdayNumber(dateStr: string): number {
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

export async function computeAvailableSlots(date: string, doctorId?: string, roomId?: string): Promise<Slot[]> {
  const weekday = getWeekdayNumber(date);

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

  if (doctorId && doctorId !== "all") availQuery = availQuery.eq("doctor_id", doctorId);
  if (roomId && roomId !== "all") availQuery = availQuery.eq("room_id", roomId);

  const { data: availabilities, error: availError } = await availQuery;
  if (availError || !availabilities) return [];

  // 2. Fetch existing appointments
  const startOfDay = `${date}T00:00:00Z`;
  const endOfDay = `${date}T23:59:59Z`;

  const { data: existingAppts } = await supabase
    .from("appointments")
    .select("id, doctor_id, room_id, starts_at, ends_at, status")
    .gte("starts_at", startOfDay)
    .lte("starts_at", endOfDay)
    .neq("status", "disdetto");

  const bookedList = (existingAppts || []).map((app) => ({
    doctorId: app.doctor_id,
    roomId: app.room_id,
    startMins: new Date(app.starts_at).getUTCHours() * 60 + new Date(app.starts_at).getUTCMinutes(),
    endMins: new Date(app.ends_at).getUTCHours() * 60 + new Date(app.ends_at).getUTCMinutes(),
  }));

  // 3. Generate slots
  const slots: Slot[] = [];

  for (const avail of availabilities as any[]) {
    if (!avail.doctors?.is_active) continue;

    const startMins = timeToMinutes(avail.start_time);
    const endMins = timeToMinutes(avail.end_time);
    const step = avail.slot_minutes || 30;

    for (let m = startMins; m + step <= endMins; m += step) {
      const slotEnd = m + step;
      const timeStr = minutesToTime(m);

      const hasDoctorConflict = bookedList.some(
        (b) => b.doctorId === avail.doctor_id && Math.max(m, b.startMins) < Math.min(slotEnd, b.endMins)
      );

      const hasRoomConflict =
        avail.room_id &&
        bookedList.some(
          (b) => b.roomId === avail.room_id && Math.max(m, b.startMins) < Math.min(slotEnd, b.endMins)
        );

      let conflictReason: string | undefined;
      if (hasDoctorConflict) conflictReason = "Medico occupato";
      else if (hasRoomConflict) conflictReason = "Stanza occupata";

      slots.push({
        date,
        time: timeStr,
        doctorId: avail.doctor_id,
        doctorName: avail.doctors.full_name,
        doctorTitle: avail.doctors.title,
        roomId: avail.room_id,
        roomName: avail.clinic_rooms?.name || "Stanza non assegnata",
        isAvailable: !hasDoctorConflict && !hasRoomConflict,
        conflictReason,
      });
    }
  }

  // Sort by time
  slots.sort((a, b) => a.time.localeCompare(b.time));
  return slots;
}
