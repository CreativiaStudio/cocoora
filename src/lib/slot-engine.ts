import { supabase } from "@/lib/supabase";

export type Slot = {
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

export type Room = {
  id: string | null;
  slug: string;
  name: string;
  specialty: string | null;
  floor: string | null;
};

/** Riga grezza della tabella public.clinic_rooms. */
export type ClinicRoomRow = {
  id: string;
  slug: string;
  name: string;
  floor: string | null;
};

/** Matrice ufficiale delle 5 sale del centro (ordine di esposizione). */
export const OFFICIAL_ROOMS: ReadonlyArray<{
  slug: string;
  name: string;
  specialty: string;
}> = [
  { slug: "studio-1", name: "Studio 1", specialty: "Odontoiatria" },
  { slug: "studio-2", name: "Studio 2", specialty: "Chirurgia Ambulatoriale" },
  { slug: "studio-3", name: "Studio 3", specialty: "Medicina Estetica e Laser" },
  { slug: "studio-4", name: "Studio 4", specialty: "Oculistica ed Ecografia" },
  { slug: "sala-opt", name: "Sala OPT", specialty: "Radiologia Digitale" },
];

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

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

export function firstEmbedded<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

/**
 * Unisce le sale presenti su clinic_rooms con la matrice ufficiale delle 5 stanze:
 * le stanze ufficiali sono sempre esposte (anche se non ancora inserite a DB) e
 * le eventuali sale extra già censite vengono accodate.
 */
export function mergeClinicRooms(rows: ClinicRoomRow[]): Room[] {
  const safeRows = Array.isArray(rows) ? rows : [];

  const official: Room[] = OFFICIAL_ROOMS.map((def) => {
    const row =
      safeRows.find((r) => r.slug === def.slug) ??
      safeRows.find((r) => normalizeText(r.name) === normalizeText(def.name)) ??
      null;

    return {
      id: row?.id ?? null,
      slug: def.slug,
      name: row?.name ?? def.name,
      specialty: def.specialty,
      floor: row?.floor ?? null,
    };
  });

  const extras: Room[] = safeRows
    .filter(
      (row) =>
        !OFFICIAL_ROOMS.some(
          (def) =>
            def.slug === row.slug || normalizeText(def.name) === normalizeText(row.name)
        )
    )
    .map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      specialty: null,
      floor: row.floor,
    }));

  return [...official, ...extras];
}

/**
 * Stanza predefinita in base alla specialità del medico.
 * Dr. Toro / ecografia / oculistica → Studio 4, Odontoiatria → Studio 1,
 * Chirurgia → Studio 2, Laser/Estetica → Studio 3.
 */
export function getDefaultRoomSlugForDoctor(input: {
  fullName?: string | null;
  specialtySlug?: string | null;
}): string {
  const text = normalizeText(`${input.fullName ?? ""} ${input.specialtySlug ?? ""}`);

  if (text.includes("toro")) return "studio-4";
  if (/(odonto|dental|dentist|ortodon|igien)/.test(text)) return "studio-1";
  if (/(chirurg)/.test(text)) return "studio-2";
  if (/(ecograf|oculist|radiolog|senolog)/.test(text)) return "studio-4";
  if (/(laser|estetic|dermat|criolipo|carbossi)/.test(text)) return "studio-3";

  return "studio-1";
}

/**
 * Risolve la sala effettiva di uno slot: prima l'eventuale sala associata alla
 * disponibilità, altrimenti la stanza predefinita calcolata dalla specialità.
 */
export function resolveRoomForDoctor(
  doctor: {
    fullName?: string | null;
    specialtySlug?: string | null;
    roomId?: string | null;
  },
  rooms: Room[]
): Room | null {
  const linked = doctor.roomId ? rooms.find((r) => r.id === doctor.roomId) : null;
  if (linked) return linked;

  const defaultSlug = getDefaultRoomSlugForDoctor(doctor);
  return (
    rooms.find((r) => r.slug === defaultSlug) ??
    rooms.find((r) => r.slug === "studio-1") ??
    rooms[0] ??
    null
  );
}

/** Carica le 5 sale ufficiali da clinic_rooms (con fallback statico). */
export async function loadClinicRooms(): Promise<Room[]> {
  const { data, error } = await supabase
    .from("clinic_rooms")
    .select("id, slug, name, floor")
    .order("slug");

  if (error) return mergeClinicRooms([]);
  return mergeClinicRooms((data ?? []) as ClinicRoomRow[]);
}

type AvailabilityEmbed = {
  id: string;
  slug: string;
  name: string;
  floor: string | null;
};

type AvailabilityDoctor = {
  id: string;
  full_name: string;
  title: string | null;
  is_active: boolean;
  specialty_slug: string | null;
};

type AvailabilityRow = {
  id: string;
  weekday: number;
  start_time: string;
  end_time: string;
  slot_minutes: number | null;
  doctor_id: string;
  room_id: string | null;
  doctors: AvailabilityDoctor | AvailabilityDoctor[] | null;
  clinic_rooms: AvailabilityEmbed | AvailabilityEmbed[] | null;
};

export type SlotsResult = {
  rooms: Room[];
  slots: Slot[];
};

const NOT_BLOCKING_STATUSES = new Set(["annullato", "disdetto", "cancelled", "canceled", "no_show"]);

/**
 * Motore slot: incrocia doctor_availability con clinic_rooms e gli appuntamenti
 * esistenti sulle 5 sale ufficiali.
 */
export async function computeAvailableSlotsWithRooms(
  date: string,
  doctorId?: string,
  roomId?: string
): Promise<SlotsResult> {
  const weekday = getWeekdayNumber(date);
  const rooms = await loadClinicRooms();

  // 1. Disponibilità dei medici per il giorno richiesto
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

  if (doctorId && doctorId !== "all") availQuery = availQuery.eq("doctor_id", doctorId);

  const { data: availabilities, error: availError } = await availQuery;
  if (availError || !availabilities) return { rooms, slots: [] };

  // 2. Appuntamenti già presenti nella giornata
  const startOfDay = `${date}T00:00:00Z`;
  const endOfDay = `${date}T23:59:59Z`;

  const { data: existingAppts } = await supabase
    .from("appointments")
    .select("id, doctor_id, room_id, starts_at, ends_at, status")
    .gte("starts_at", startOfDay)
    .lte("starts_at", endOfDay);

  const bookedList = (existingAppts || [])
    .filter((app) => !NOT_BLOCKING_STATUSES.has(String(app.status ?? "").toLowerCase()))
    .map((app) => ({
      doctorId: app.doctor_id as string | null,
      roomId: app.room_id as string | null,
      startMins: new Date(app.starts_at).getUTCHours() * 60 + new Date(app.starts_at).getUTCMinutes(),
      endMins: new Date(app.ends_at).getUTCHours() * 60 + new Date(app.ends_at).getUTCMinutes(),
    }));

  // 3. Generazione slot
  const slots: Slot[] = [];

  for (const avail of (availabilities as unknown as AvailabilityRow[]) ?? []) {
    const doctor = firstEmbedded<AvailabilityDoctor>(avail.doctors);
    if (!doctor || !doctor.is_active) continue;

    const slotRoom = resolveRoomForDoctor(
      {
        fullName: doctor.full_name,
        specialtySlug: doctor.specialty_slug,
        roomId: avail.room_id,
      },
      rooms
    );

    if (roomId && roomId !== "all" && slotRoom?.id !== roomId && slotRoom?.slug !== roomId) {
      continue;
    }

    const startMins = timeToMinutes(avail.start_time);
    const endMins = timeToMinutes(avail.end_time);
    const step = avail.slot_minutes || 30;

    for (let m = startMins; m + step <= endMins; m += step) {
      const slotEnd = m + step;
      const timeStr = minutesToTime(m);

      const hasDoctorConflict = bookedList.some(
        (b) => b.doctorId === doctor.id && Math.max(m, b.startMins) < Math.min(slotEnd, b.endMins)
      );

      const hasRoomConflict =
        slotRoom?.id != null &&
        bookedList.some(
          (b) => b.roomId === slotRoom.id && Math.max(m, b.startMins) < Math.min(slotEnd, b.endMins)
        );

      let conflictReason: string | undefined;
      if (hasDoctorConflict) conflictReason = "Medico occupato";
      else if (hasRoomConflict) conflictReason = "Stanza occupata";

      slots.push({
        date,
        time: timeStr,
        doctorId: doctor.id,
        doctorName: doctor.full_name,
        doctorTitle: doctor.title,
        roomId: slotRoom?.id ?? null,
        roomName: slotRoom?.name ?? "Stanza non assegnata",
        roomSlug: slotRoom?.slug ?? null,
        isAvailable: !hasDoctorConflict && !hasRoomConflict,
        conflictReason,
      });
    }
  }

  slots.sort((a, b) => a.time.localeCompare(b.time) || a.doctorName.localeCompare(b.doctorName));
  return { rooms, slots };
}

/** Compatibilità: restituisce solo la lista slot. */
export async function computeAvailableSlots(
  date: string,
  doctorId?: string,
  roomId?: string
): Promise<Slot[]> {
  const result = await computeAvailableSlotsWithRooms(date, doctorId, roomId);
  return result.slots;
}
