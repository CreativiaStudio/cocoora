"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Calendar as CalendarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  DoorOpen,
  RefreshCw,
  Stethoscope,
  X,
} from "lucide-react";
import { Button } from "@/components/ui";
import { computeAvailableSlots, type Slot } from "@/lib/slot-engine";
import { supabase } from "@/lib/supabase";

type MedicalService = {
  id: string;
  code: string | null;
  name: string;
  category?: string | null;
  duration_minutes?: number | null;
};

type LiveAppointmentStatus =
  | "confermato"
  | "in_attesa"
  | "in_visita"
  | "completato"
  | "annullato"
  | "no_show";

type DayAppointment = {
  id: string;
  startsAt: string;
  endsAt: string;
  time: string;
  startMins: number;
  endMins: number;
  patientName: string;
  doctorId: string | null;
  doctorName: string;
  roomId: string | null;
  roomSlug: string | null;
  roomName: string;
  liveStatus: LiveAppointmentStatus;
  cleanNotes: string;
};

type RoomColumnConfig = {
  key: string;
  roomName: string;
  subtitle: string;
};

const DEFAULT_DURATION_MINUTES = 30;
const CLINIC_OPEN_MINS = 9 * 60; // 09:00
const CLINIC_MORNING_END_MINS = 14 * 60; // 14:00
const CLINIC_CLOSE_MINS = 19 * 60; // 19:00

const ROOM_COLUMNS: RoomColumnConfig[] = [
  {
    key: "studio-1",
    roomName: "Studio 1",
    subtitle: "Odontoiatria & Ortodonzia",
  },
  {
    key: "studio-2",
    roomName: "Studio 2",
    subtitle: "Medicina Estetica Corpo & Carbossiterapia",
  },
  {
    key: "studio-3",
    roomName: "Studio 3",
    subtitle: "Chirurgia Plastica, Laser & Medicina Estetica",
  },
  {
    key: "studio-4",
    roomName: "Studio 4",
    subtitle: "Diagnostica, Cardiologia, Ginecologia & Oculistica",
  },
  {
    key: "sala-opt",
    roomName: "Sala Radiologia / OPT",
    subtitle: "Ortopantomografo Digitale 3D CBCT",
  },
  {
    key: "sala-filtro",
    roomName: "Sala Filtro / Nutrizione",
    subtitle: "Consulenza Nutrizionale & Bioimpedenziometria",
  },
];

/** Roster ufficiale Cocoora di fallback (usato solo se DB/API non restituiscono turni nel feriale). */
const OFFICIAL_FALLBACK_ROSTER: ReadonlyArray<{
  id: string;
  fullName: string;
  title: string;
  roomKey: string;
  roomName: string;
  weekdays: number[];
  band: "morning" | "afternoon";
  requiresEcograph?: boolean;
}> = [
  {
    id: "fallback-elisa-russo",
    fullName: "Dott.ssa Elisa Russo",
    title: "Direttrice Sanitaria · Odontoiatria & Ortodonzia",
    roomKey: "studio-1",
    roomName: "Studio 1",
    weekdays: [1, 2, 3, 4, 5],
    band: "morning",
  },
  {
    id: "fallback-patrizia-scorzelli",
    fullName: "Patrizia Scorzelli",
    title: "Operatrice Estetica",
    roomKey: "studio-2",
    roomName: "Studio 2",
    weekdays: [1, 2, 3, 4, 5],
    band: "morning",
  },
  {
    id: "fallback-titti-errico",
    fullName: "Dott.ssa Concetta (Titti) Errico",
    title: "Medicina Estetica",
    roomKey: "studio-3",
    roomName: "Studio 3",
    weekdays: [1, 3, 4],
    band: "morning",
  },
  {
    id: "fallback-raffaella-poppiti",
    fullName: "Dott.ssa Raffaella Poppiti",
    title: "Chirurgia Plastica & Medicina Estetica",
    roomKey: "studio-3",
    roomName: "Studio 3",
    weekdays: [2, 5],
    band: "afternoon",
  },
  {
    id: "fallback-alessandra-riccardi",
    fullName: "Dott.ssa Alessandra Riccardi",
    title: "Medicina Estetica",
    roomKey: "studio-3",
    roomName: "Studio 3",
    weekdays: [1, 4],
    band: "afternoon",
  },
  {
    id: "fallback-jessica-de-ceglie",
    fullName: "Dott.ssa Jessica De Ceglie",
    title: "Biologa Nutrizionista",
    roomKey: "sala-filtro",
    roomName: "Sala Filtro / Nutrizione",
    weekdays: [2, 4],
    band: "afternoon",
  },
  {
    id: "fallback-giuseppe-buono",
    fullName: "Dr. Giuseppe Buono",
    title: "Cardiologia & Diagnostica",
    roomKey: "studio-4",
    roomName: "Studio 4",
    weekdays: [1, 4],
    band: "morning",
    requiresEcograph: true,
  },
  {
    id: "fallback-anna-maria-stillo",
    fullName: "Dott.ssa Anna Maria Stillo",
    title: "Ginecologia & Ostetricia",
    roomKey: "studio-4",
    roomName: "Studio 4",
    weekdays: [2, 5],
    band: "morning",
    requiresEcograph: true,
  },
  {
    id: "fallback-martina-pontillo",
    fullName: "Dott.ssa Martina Pontillo",
    title: "Diagnostica Ecografica & Senologia",
    roomKey: "studio-4",
    roomName: "Studio 4",
    weekdays: [3],
    band: "morning",
    requiresEcograph: true,
  },
  {
    id: "fallback-mario-toro",
    fullName: "Dr. Mario Toro",
    title: "Oculistica",
    roomKey: "studio-4",
    roomName: "Studio 4",
    weekdays: [2, 4],
    band: "afternoon",
  },
  {
    id: "fallback-alessandra-totaro",
    fullName: "Dott.ssa Alessandra Totaro",
    title: "Specialista Clinica",
    roomKey: "studio-4",
    roomName: "Studio 4",
    weekdays: [1, 5],
    band: "afternoon",
  },
];

export function deriveLiveAppointmentStatus(
  rawStatus?: string | null,
  notes?: string | null
): LiveAppointmentStatus {
  const st = (rawStatus || "").toLowerCase().trim();
  const text = notes || "";

  if (st === "annullato" || st === "disdetto" || st === "cancelled" || st === "canceled") {
    return "annullato";
  }
  if (st === "no_show") {
    return "no_show";
  }
  if (st === "completato" || st === "completata" || /\[FineVisita:/i.test(text)) {
    return "completato";
  }
  if (
    st === "in_visita" ||
    st === "in_corso" ||
    (/\[InizioVisita:/i.test(text) && !/\[FineVisita:/i.test(text))
  ) {
    return "in_visita";
  }
  if (st === "in_attesa" || /\[Arrivo:/i.test(text)) {
    return "in_attesa";
  }
  return "confermato";
}

function cleanTechnicalTags(notes?: string | null): string {
  if (!notes) return "";
  return notes
    .replace(/\[(Arrivo|InizioVisita|FineVisita|Attesa|Durata|Reminder1h):[^\]]*\]/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function normalizeDoctorName(name?: string | null): string {
  if (!name) return "Specialista";
  if (/scorzelli/i.test(name)) {
    return "Patrizia Scorzelli";
  }
  return name;
}

function isExcludedDoctorName(name?: string | null): boolean {
  if (!name) return false;
  return name.toLowerCase().includes("sorrentino");
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return -1;
  return h * 60 + m;
}

function getWeekdayIso(dateStr: string): number {
  const d = new Date(`${dateStr}T00:00:00Z`);
  const day = d.getUTCDay();
  return day === 0 ? 7 : day; // 1 = Lun ... 6 = Sab, 7 = Dom
}

function getInitialBusinessDate(): string {
  const now = new Date();
  const romeStr = now.toLocaleDateString("sv-SE", { timeZone: "Europe/Rome" });
  const wd = getWeekdayIso(romeStr);
  if (wd === 6) {
    const d = new Date(`${romeStr}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + 2);
    return d.toISOString().split("T")[0];
  }
  if (wd === 7) {
    const d = new Date(`${romeStr}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + 1);
    return d.toISOString().split("T")[0];
  }
  return romeStr;
}

function formatRomeTime(isoStr: string): string {
  const d = new Date(isoStr);
  return d.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Rome",
  });
}

function matchesDate(isoStr: string, dateStr: string): boolean {
  if (!isoStr) return false;
  if (isoStr.startsWith(dateStr)) return true;
  const romeDate = new Date(isoStr).toLocaleDateString("sv-SE", { timeZone: "Europe/Rome" });
  return romeDate === dateStr;
}

function normalizeRoomName(value: string | null | undefined): string {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function matchRoomKey(roomSlug?: string | null, roomName?: string | null): string | null {
  const slug = (roomSlug || "").toLowerCase().trim();
  if (ROOM_COLUMNS.some((c) => c.key === slug)) return slug;

  const name = normalizeRoomName(roomName);
  if (!name) return null;
  if (name.includes("studio 1")) return "studio-1";
  if (name.includes("studio 2")) return "studio-2";
  if (name.includes("studio 3")) return "studio-3";
  if (name.includes("studio 4")) return "studio-4";
  if (name.includes("opt") || name.includes("rx") || name.includes("tac") || name.includes("radiolog")) {
    return "sala-opt";
  }
  if (name.includes("filtro") || name.includes("nutrizion")) {
    return "sala-filtro";
  }
  return null;
}

function buildFallbackSlotsForDate(dateStr: string): Slot[] {
  const wd = getWeekdayIso(dateStr);
  if (wd > 5) return [];

  const generated: Slot[] = [];
  for (const doc of OFFICIAL_FALLBACK_ROSTER) {
    if (!doc.weekdays.includes(wd)) continue;
    const hours =
      doc.band === "morning"
        ? ["09:00", "10:00", "11:00", "12:00", "13:00"]
        : ["14:00", "15:00", "16:00", "17:00", "18:00"];
    for (const time of hours) {
      generated.push({
        date: dateStr,
        time,
        doctorId: doc.id,
        doctorName: doc.fullName,
        doctorTitle: doc.title,
        roomId: null,
        roomName: doc.roomName,
        roomSlug: doc.roomKey,
        isAvailable: true,
        visitDurationMinutes: 30,
        cleaningBufferMinutes: 30,
        slotDurationMinutes: 60,
        requiresEcograph: doc.requiresEcograph,
      });
    }
  }
  return generated;
}

const LIVE_STATUS_BADGE: Record<
  LiveAppointmentStatus,
  { label: string; className: string }
> = {
  in_visita: {
    label: "🟢 In Studio",
    className: "bg-emerald-100 text-emerald-900 border border-emerald-300",
  },
  in_attesa: {
    label: "🟡 In Attesa",
    className: "bg-amber-100 text-amber-900 border border-amber-300",
  },
  completato: {
    label: "✓ Conclusa",
    className: "bg-slate-100 text-slate-700 border border-slate-200",
  },
  confermato: {
    label: "Prenotato",
    className: "bg-sky-50 text-sky-800 border border-sky-200",
  },
  annullato: {
    label: "Disdetto",
    className: "bg-rose-50 text-rose-700 border border-rose-200",
  },
  no_show: {
    label: "No-Show",
    className: "bg-rose-50 text-rose-700 border border-rose-200",
  },
};

export function CalendarMatrix() {
  const [selectedDate, setSelectedDate] = useState<string>(getInitialBusinessDate);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [dayAppointments, setDayAppointments] = useState<DayAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingSlot, setBookingSlot] = useState<Slot | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [services, setServices] = useState<MedicalService[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [patientForm, setPatientForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    notes: "",
  });

  const weekdayIso = getWeekdayIso(selectedDate);
  const isClosedDay = weekdayIso >= 6; // 6 = Sabato chiuso, 7 = Domenica chiuso

  const fetchSlotsAndAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const wd = getWeekdayIso(selectedDate);
      if (wd >= 6) {
        setSlots([]);
        setDayAppointments([]);
        return;
      }

      // 1. Carica medici attivi e appuntamenti reali dal Desk Reception (o fallback Supabase)
      const activeDoctorIds = new Set<string>();
      const inactiveDoctorIds = new Set<string>();
      let rawAppointments: any[] = [];

      try {
        const deskRes = await fetch("/api/reception/desk", { cache: "no-store" });
        if (deskRes.ok) {
          const deskData = await deskRes.json();
          if (Array.isArray(deskData.doctors)) {
            for (const d of deskData.doctors) {
              if (d.is_active === false || isExcludedDoctorName(d.full_name)) {
                inactiveDoctorIds.add(d.id);
              } else {
                activeDoctorIds.add(d.id);
              }
            }
          }
          if (Array.isArray(deskData.appointments)) {
            rawAppointments = deskData.appointments;
          }
        }
      } catch {
        const { data: docs } = await supabase
          .from("doctors")
          .select("id, full_name, is_active");
        for (const d of docs || []) {
          if (d.is_active === false || isExcludedDoctorName(d.full_name)) {
            inactiveDoctorIds.add(d.id);
          } else {
            activeDoctorIds.add(d.id);
          }
        }
        const { data: appts } = await supabase
          .from("appointments")
          .select(
            "id, starts_at, ends_at, status, notes, doctor_id, room_id, patient_profiles(first_name, last_name), doctors(id, full_name, is_active), clinic_rooms(id, name, slug)"
          )
          .gte("starts_at", `${selectedDate}T00:00:00Z`)
          .lte("starts_at", `${selectedDate}T23:59:59Z`);
        rawAppointments = appts || [];
      }

      // Mappa appuntamenti del giorno con derivazione stato live dalle note
      const parsedDayAppointments: DayAppointment[] = rawAppointments
        .filter((app) => matchesDate(app.starts_at, selectedDate))
        .map((app) => {
          const docObj = Array.isArray(app.doctors) ? app.doctors[0] : app.doctors;
          const roomObj = Array.isArray(app.clinic_rooms) ? app.clinic_rooms[0] : app.clinic_rooms;
          const patObj = Array.isArray(app.patient_profiles)
            ? app.patient_profiles[0]
            : app.patient_profiles;

          const docNameRaw = docObj?.full_name || app.doctor_name || "";
          const docId = docObj?.id || app.doctor_id || null;
          if (
            docObj?.is_active === false ||
            (docId && inactiveDoctorIds.has(docId)) ||
            isExcludedDoctorName(docNameRaw)
          ) {
            return null;
          }

          const liveStatus = deriveLiveAppointmentStatus(app.status, app.notes);
          const timeStr = formatRomeTime(app.starts_at);
          const startMins = timeToMinutes(timeStr);
          const endTimeStr = app.ends_at ? formatRomeTime(app.ends_at) : timeStr;
          const rawEndMins = timeToMinutes(endTimeStr);
          const endMins = rawEndMins > startMins ? rawEndMins : startMins + 30;

          const patientName = patObj
            ? `${patObj.first_name || ""} ${patObj.last_name || ""}`.trim()
            : app.patient_name || "Paziente";

          return {
            id: app.id,
            startsAt: app.starts_at,
            endsAt: app.ends_at,
            time: timeStr,
            startMins,
            endMins,
            patientName: patientName || "Paziente",
            doctorId: docId,
            doctorName: normalizeDoctorName(docNameRaw),
            roomId: roomObj?.id || app.room_id || null,
            roomSlug: roomObj?.slug || null,
            roomName: roomObj?.name || "Studio 1",
            liveStatus,
            cleanNotes: cleanTechnicalTags(app.notes),
          } satisfies DayAppointment;
        })
        .filter((item): item is DayAppointment => item !== null)
        .filter((item) => item.liveStatus !== "annullato" && item.liveStatus !== "no_show");

      setDayAppointments(parsedDayAppointments);

      // 2. Carica slot dal backend o motore locale
      let fetchedSlots: Slot[] = [];
      try {
        const res = await fetch(`/api/calendar/slots?date=${selectedDate}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.slots)) {
            fetchedSlots = data.slots;
          }
        }
      } catch {
        // Fallback al calcolo locale
      }

      if (fetchedSlots.length === 0) {
        try {
          fetchedSlots = await computeAvailableSlots(selectedDate);
        } catch {
          fetchedSlots = [];
        }
      }

      if (fetchedSlots.length === 0) {
        fetchedSlots = buildFallbackSlotsForDate(selectedDate);
      }

      // 3. Filtra rigorosamente: solo medici attivi (is_active !== false, no Sorrentino) e orari Lun–Ven 09:00–19:00
      const sanitizedSlots = fetchedSlots
        .filter((slot) => {
          if (isExcludedDoctorName(slot.doctorName)) return false;
          if (inactiveDoctorIds.has(slot.doctorId)) return false;
          if (
            activeDoctorIds.size > 0 &&
            !slot.doctorId.startsWith("fallback-") &&
            !activeDoctorIds.has(slot.doctorId)
          ) {
            return false;
          }
          const mins = timeToMinutes(slot.time);
          return mins >= CLINIC_OPEN_MINS && mins < CLINIC_CLOSE_MINS;
        })
        .map((slot) => {
          const normalizedName = normalizeDoctorName(slot.doctorName);
          const normalizedTitle =
            normalizedName === "Patrizia Scorzelli" && !slot.doctorTitle
              ? "Operatrice Estetica"
              : slot.doctorTitle;

          const slotStart = timeToMinutes(slot.time);
          const slotEnd = slotStart + (slot.slotDurationMinutes || 60);
          const slotRoomKey = matchRoomKey(slot.roomSlug, slot.roomName);

          const overlappingAppt = parsedDayAppointments.find((app) => {
            const overlaps = Math.max(slotStart, app.startMins) < Math.min(slotEnd, app.endMins);
            if (!overlaps) return false;
            const sameDoc = app.doctorId && app.doctorId === slot.doctorId;
            const appRoomKey = matchRoomKey(app.roomSlug, app.roomName);
            const sameRoom =
              (app.roomId && slot.roomId && app.roomId === slot.roomId) ||
              (appRoomKey && slotRoomKey && appRoomKey === slotRoomKey);
            return Boolean(sameDoc || sameRoom);
          });

          return {
            ...slot,
            doctorName: normalizedName,
            doctorTitle: normalizedTitle,
            isAvailable: overlappingAppt ? false : slot.isAvailable,
          };
        });

      setSlots(sanitizedSlots);
    } catch (e) {
      console.error("Errore recupero matrice calendario", e);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchSlotsAndAppointments();
  }, [fetchSlotsAndAppointments]);

  useEffect(() => {
    let cancelled = false;

    const fetchServices = async () => {
      try {
        setServicesLoading(true);
        setServicesError(null);
        const res = await fetch("/api/services");
        if (!res.ok) throw new Error("Errore caricamento prestazioni");
        const data = await res.json();
        if (!cancelled) {
          setServices(Array.isArray(data.services) ? data.services : []);
        }
      } catch {
        if (!cancelled) {
          setServicesError("Impossibile caricare il listino prestazioni dal backend clinico.");
        }
      } finally {
        if (!cancelled) setServicesLoading(false);
      }
    };

    fetchServices();

    return () => {
      cancelled = true;
    };
  }, []);

  const changeDateByDays = (days: number) => {
    const d = new Date(`${selectedDate}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + days);
    // Salta automaticamente Sabato (6) e Domenica (0) nella navigazione rapida frecce
    while (d.getUTCDay() === 6 || d.getUTCDay() === 0) {
      d.setUTCDate(d.getUTCDate() + (days >= 0 ? 1 : -1));
    }
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const jumpToNextMonday = () => {
    const d = new Date(`${selectedDate}T00:00:00Z`);
    while (d.getUTCDay() !== 1) {
      d.setUTCDate(d.getUTCDate() + 1);
    }
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const resetBookingForm = () => {
    setPatientForm({ firstName: "", lastName: "", phone: "", email: "", notes: "" });
    setSelectedServiceId("");
    setBookingError(null);
  };

  const selectedService = services.find((service) => service.id === selectedServiceId) || null;
  const bookingDuration = selectedService?.duration_minutes || DEFAULT_DURATION_MINUTES;

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingSlot) return;

    if (!selectedServiceId) {
      setBookingError("Seleziona la prestazione clinica da collegare all'appuntamento.");
      return;
    }

    const patientName = `${patientForm.firstName} ${patientForm.lastName}`.trim();
    if (!patientName) {
      setBookingError("Inserisci nome e cognome del paziente.");
      return;
    }

    try {
      setBookingError(null);
      try {
        const res = await fetch("/api/calendar/slots", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            doctorId: bookingSlot.doctorId,
            roomId: bookingSlot.roomId,
            serviceId: selectedServiceId,
            date: bookingSlot.date,
            time: bookingSlot.time,
            durationMinutes: bookingDuration,
            patientName,
            patientPhone: patientForm.phone,
            patientEmail: patientForm.email,
            notes: patientForm.notes,
          }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setBookingSuccess(true);
            setSuccessMessage(
              `Appuntamento confermato: ${patientName} · ${bookingSlot.roomName || "Studio"} · ${bookingSlot.date} ${bookingSlot.time}`
            );
            setTimeout(() => {
              setBookingSlot(null);
              setBookingSuccess(false);
              setSuccessMessage(null);
              resetBookingForm();
              fetchSlotsAndAppointments();
            }, 1400);
            return;
          } else {
            setBookingError(json.error || "Prenotazione non registrata dal backend clinico.");
            return;
          }
        }

        const errorJson = await res.json().catch(() => null);
        setBookingError(
          (errorJson && typeof errorJson.error === "string" && errorJson.error) ||
            "Lo slot non è più disponibile. Aggiorna la matrice e riprova."
        );
        return;
      } catch {
        // Fallback diretto
      }

      const { data: pData } = await supabase
        .from("patient_profiles")
        .insert({
          patient_code: `COC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
          first_name: patientForm.firstName.trim() || "Paziente",
          last_name: patientForm.lastName.trim() || "Cocoora",
          phone: patientForm.phone,
          email: patientForm.email,
          notes: patientForm.notes,
        })
        .select()
        .single();

      const startIso = `${bookingSlot.date}T${bookingSlot.time}:00Z`;
      const [h, m] = bookingSlot.time.split(":").map(Number);
      const endMins = h * 60 + m + bookingDuration;
      const endH = Math.floor(endMins / 60).toString().padStart(2, "0");
      const endM = (endMins % 60).toString().padStart(2, "0");
      const endIso = `${bookingSlot.date}T${endH}:${endM}:00Z`;

      await supabase.from("appointments").insert({
        patient_id: pData?.id,
        doctor_id: bookingSlot.doctorId,
        room_id: bookingSlot.roomId,
        starts_at: startIso,
        ends_at: endIso,
        status: "confermato",
        is_first_visit: false,
        notes: `${patientForm.notes}${selectedService ? ` [Prestazione: ${selectedService.code || selectedService.id} - ${selectedService.name}]` : ""}`.trim(),
      });

      setBookingSuccess(true);
      setSuccessMessage(
        `Appuntamento confermato: ${patientName} · ${bookingSlot.roomName || "Studio"} · ${bookingSlot.date} ${bookingSlot.time}`
      );
      setTimeout(() => {
        setBookingSlot(null);
        setBookingSuccess(false);
        setSuccessMessage(null);
        resetBookingForm();
        fetchSlotsAndAppointments();
      }, 1400);
    } catch {
      setBookingError("Errore durante la registrazione.");
    }
  };

  const roomColumns = useMemo(() => {
    return ROOM_COLUMNS.map((col) => {
      const colSlots = slots.filter(
        (s) => matchRoomKey(s.roomSlug, s.roomName) === col.key
      );
      const colAppts = dayAppointments.filter(
        (a) => matchRoomKey(a.roomSlug, a.roomName) === col.key
      );
      return {
        ...col,
        slots: colSlots,
        appointments: colAppts,
      };
    });
  }, [slots, dayAppointments]);

  const formattedDate = new Date(`${selectedDate}T00:00:00Z`).toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <div className="space-y-6">
      {/* Barra Navigazione Data & Orari Ufficiali */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => changeDateByDays(-1)}
            title="Giorno feriale precedente"
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-charcoal/70"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-teal-50/70 border border-teal-100">
            <CalendarIcon className="h-4 w-4 text-teal-700" />
            <span className="font-serif text-sm sm:text-base font-semibold text-dark-navy capitalize">
              {formattedDate}
            </span>
          </div>
          <button
            type="button"
            onClick={() => changeDateByDays(1)}
            title="Giorno feriale successivo"
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-charcoal/70"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setSelectedDate(getInitialBusinessDate())}
            className="rounded-xl border border-teal-200 bg-teal-50/50 px-3 py-1.5 text-xs font-semibold text-teal-900 hover:bg-teal-100 transition-colors"
          >
            Oggi
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-dark-navy">
            <Clock className="h-3.5 w-3.5 text-teal-700" />
            Lun–Ven 09:00–19:00 · Mattina 09:00–14:00 / Pom. 14:00–19:00 · Sabato chiuso
          </span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              if (e.target.value) setSelectedDate(e.target.value);
            }}
            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-dark-navy font-semibold focus:border-teal-700 focus:outline-none"
          />
          <button
            type="button"
            onClick={fetchSlotsAndAppointments}
            className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-teal-800 shadow-xs hover:bg-teal-50"
          >
            <RefreshCw className={loading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
            Aggiorna
          </button>
        </div>
      </div>

      {/* Spiegazione Logica Incrocio & Fasce */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-charcoal/75">
        <AlertCircle className="h-4 w-4 text-teal-700 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-dark-navy">
            Motore di Incrocio Équipe Ufficiale × Studi (Lun–Ven 09:00–19:00, Sabato chiuso):
          </strong>{" "}
          Uno slot è prenotabile quando sia lo <strong>Specialista attivo</strong> sia lo{" "}
          <strong>Studio dedicato</strong> (incluso il vincolo condiviso dell&apos;Ecografo in Studio 4) sono
          contemporaneamente liberi nelle fasce <strong>09:00–14:00</strong> e <strong>14:00–19:00</strong>. Gli stati
          visita (<em>In Sala d&apos;Attesa</em> / <em>In Studio</em>) sono sincronizzati in tempo reale col Desk Reception.
        </div>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
          <Check className="h-4 w-4 shrink-0" /> {successMessage}
        </div>
      )}

      {/* Giorno di Chiusura (Sabato / Domenica) */}
      {isClosedDay ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-10 text-center space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
            {weekdayIso === 6 ? "Sabato Chiuso" : "Domenica Chiuso"}
          </p>
          <h3 className="font-serif text-xl font-semibold text-dark-navy">
            Centro Medico Cocoora non operativo di {weekdayIso === 6 ? "Sabato" : "Domenica"}
          </h3>
          <p className="text-xs text-charcoal/75 max-w-lg mx-auto">
            Gli orari ufficiali degli Studi 1–4, Sala Radiologia / OPT e Sala Filtro / Nutrizione sono{" "}
            <strong>Lunedì–Venerdì 09:00–19:00</strong> (Fascia Mattina <strong>09:00–14:00</strong> · Fascia Pomeriggio{" "}
            <strong>14:00–19:00</strong>), con <strong>Sabato chiuso</strong>.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={jumpToNextMonday}
              className="inline-flex items-center gap-1.5 rounded-full bg-dark-navy px-5 py-2 text-xs font-semibold text-white hover:bg-teal-900 transition-colors"
            >
              Vai a Lunedì (09:00–19:00) →
            </button>
          </div>
        </div>
      ) : loading ? (
        <div className="p-16 text-center text-sm text-charcoal/60 bg-white rounded-3xl border border-slate-200">
          <RefreshCw className="mx-auto h-6 w-6 animate-spin text-teal-700 mb-2" />
          Calcolo incrocio disponibilità per {formattedDate}...
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {roomColumns.map((column) => (
            <RoomColumn
              key={column.key}
              roomName={column.roomName}
              subtitle={column.subtitle}
              slots={column.slots}
              appointments={column.appointments}
              onSelectSlot={(s) => {
                setBookingError(null);
                setBookingSuccess(false);
                setSelectedServiceId("");
                setPatientForm({ firstName: "", lastName: "", phone: "", email: "", notes: "" });
                setBookingSlot(s);
              }}
            />
          ))}
        </div>
      )}

      {/* MODAL DI PRENOTAZIONE RAPIDA SLOT */}
      {bookingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-navy/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-teal-100">
            <button
              type="button"
              onClick={() => {
                setBookingSlot(null);
                setBookingError(null);
                setBookingSuccess(false);
              }}
              className="absolute right-5 top-5 rounded-full p-2 text-charcoal/50 hover:bg-slate-100 hover:text-charcoal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-teal-700" />
              <h3 className="font-serif text-lg font-semibold text-dark-navy">
                Prenota Appuntamento Clinico
              </h3>
            </div>
            <p className="mt-1 text-[11px] uppercase font-bold tracking-wider text-slate-accent">
              Matrice a 4 Vertici · Lun–Ven 09:00–19:00
            </p>

            {/* VERTICE 1: RIEPILOGO STANZA, MEDICO E ORARIO */}
            <div className="mt-4 rounded-2xl bg-teal-50/80 p-4 border border-teal-100/80 text-xs space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-teal-800/80">
                1 · Riepilogo
              </p>
              <div className="flex items-center justify-between gap-2 pt-0.5">
                <p className="font-semibold text-dark-navy">{bookingSlot.doctorName}</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-800 border border-teal-100">
                  <DoorOpen className="h-3 w-3" /> {bookingSlot.roomName || "Studio assegnato"}
                </span>
              </div>
              {bookingSlot.doctorTitle && <p className="text-teal-900/80">{bookingSlot.doctorTitle}</p>}
              <div className="flex items-center gap-3 pt-1 text-slate-accent font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-teal-700" /> {bookingSlot.time} ({bookingDuration} min)
                </span>
                <span className="flex items-center gap-1">
                  <CalendarIcon className="h-3.5 w-3.5 text-teal-700" /> {bookingSlot.date}
                </span>
              </div>
            </div>

            <form onSubmit={handleBookAppointment} className="mt-5 space-y-4">
              {/* VERTICE 2: PRESTAZIONE */}
              <div className="rounded-2xl border border-slate-200/90 p-3.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-accent mb-1.5">
                  2 · Prestazione Clinica *
                </label>

                {servicesError && (
                  <div className="mb-2 flex items-center gap-2 rounded-xl bg-amber-50 p-2 text-[11px] text-amber-800 border border-amber-200">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {servicesError}
                  </div>
                )}

                <select
                  required
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  disabled={servicesLoading}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-charcoal focus:border-teal-700 focus:outline-none disabled:bg-slate-50 disabled:text-charcoal/50"
                >
                  <option value="">
                    {servicesLoading ? "Caricamento prestazioni..." : "Seleziona la prestazione"}
                  </option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {`${service.code || "COC"} — ${service.name}`}
                    </option>
                  ))}
                </select>

                {selectedService && (
                  <p className="mt-2 text-[11px] text-charcoal/60">
                    Codice: <strong className="text-dark-navy">{selectedService.code || selectedService.id}</strong>
                    {selectedService.category ? ` · ${selectedService.category}` : ""} ·{" "}
                    {selectedService.duration_minutes || DEFAULT_DURATION_MINUTES} min
                  </p>
                )}

                {!servicesLoading && !servicesError && services.length === 0 && (
                  <p className="mt-2 text-[11px] text-charcoal/60 italic">
                    Nessuna prestazione attiva restituita dal backend clinico.
                  </p>
                )}
              </div>

              {/* VERTICE 3: PAZIENTE */}
              <div className="rounded-2xl border border-slate-200/90 p-3.5 space-y-3">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-accent">
                  3 · Paziente
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-dark-navy mb-1">Nome *</label>
                    <input
                      type="text"
                      required
                      value={patientForm.firstName}
                      onChange={(e) => setPatientForm({ ...patientForm, firstName: e.target.value })}
                      placeholder="es. Mario"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm text-charcoal focus:border-teal-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-dark-navy mb-1">Cognome *</label>
                    <input
                      type="text"
                      required
                      value={patientForm.lastName}
                      onChange={(e) => setPatientForm({ ...patientForm, lastName: e.target.value })}
                      placeholder="es. Rossi"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm text-charcoal focus:border-teal-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-dark-navy mb-1">Telefono *</label>
                    <input
                      type="tel"
                      required
                      value={patientForm.phone}
                      onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                      placeholder="es. 333 1234567"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm text-charcoal focus:border-teal-700 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-dark-navy mb-1">Email</label>
                    <input
                      type="email"
                      value={patientForm.email}
                      onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
                      placeholder="paziente@email.it"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm text-charcoal focus:border-teal-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-dark-navy mb-1">
                    Note cliniche o motivo visita
                  </label>
                  <input
                    type="text"
                    value={patientForm.notes}
                    onChange={(e) => setPatientForm({ ...patientForm, notes: e.target.value })}
                    placeholder="Prima visita, controllo periodico..."
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm text-charcoal focus:border-teal-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* VERTICE 4: CONFERMA */}
              <div className="rounded-2xl border border-slate-200/90 p-3.5 space-y-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-accent">
                  4 · Conferma
                </p>

                {bookingError && (
                  <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-2.5 text-xs text-rose-800 border border-rose-200">
                    <AlertCircle className="h-4 w-4 shrink-0" /> {bookingError}
                  </div>
                )}

                {bookingSuccess && (
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-2.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
                    <Check className="h-4 w-4 shrink-0" /> Appuntamento registrato con successo!
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setBookingSlot(null);
                      setBookingError(null);
                      setBookingSuccess(false);
                    }}
                    className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-charcoal hover:bg-slate-50 transition-colors"
                  >
                    Annulla
                  </button>
                  <Button type="submit" size="sm" disabled={bookingSuccess}>
                    Conferma Prenotazione
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function RoomColumn({
  roomName,
  subtitle,
  slots,
  appointments,
  onSelectSlot,
}: {
  roomName: string;
  subtitle: string;
  slots: Slot[];
  appointments: DayAppointment[];
  onSelectSlot: (slot: Slot) => void;
}) {
  const availableCount = slots.filter((s) => s.isAvailable).length;

  const morningSlots = slots.filter((s) => {
    const mins = timeToMinutes(s.time);
    return mins >= CLINIC_OPEN_MINS && mins < CLINIC_MORNING_END_MINS;
  });

  const afternoonSlots = slots.filter((s) => {
    const mins = timeToMinutes(s.time);
    return mins >= CLINIC_MORNING_END_MINS && mins < CLINIC_CLOSE_MINS;
  });

  const findMatchingAppt = (slot: Slot): DayAppointment | undefined => {
    const slotStart = timeToMinutes(slot.time);
    const slotEnd = slotStart + (slot.slotDurationMinutes || 60);
    return appointments.find(
      (app) => Math.max(slotStart, app.startMins) < Math.min(slotEnd, app.endMins)
    );
  };

  const renderSlotRow = (s: Slot, idx: number) => {
    const matchedAppt = !s.isAvailable ? findMatchingAppt(s) : undefined;
    const badge = matchedAppt ? LIVE_STATUS_BADGE[matchedAppt.liveStatus] : null;

    return (
      <div
        key={`${s.time}-${s.doctorId}-${idx}`}
        className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border text-xs transition-all ${
          s.isAvailable
            ? "bg-white border-slate-200/80 hover:border-teal-400 hover:shadow-xs"
            : matchedAppt?.liveStatus === "in_visita"
              ? "bg-emerald-50/70 border-emerald-200"
              : matchedAppt?.liveStatus === "in_attesa"
                ? "bg-amber-50/70 border-amber-200"
                : "bg-slate-50/80 border-slate-200/60"
        }`}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-dark-navy flex items-center gap-1 shrink-0">
              <Clock className="h-3 w-3 text-teal-700" /> {s.time}
            </span>
            <span className="text-[11px] text-charcoal/75 truncate">
              {s.doctorName}
            </span>
          </div>
          {matchedAppt && (
            <p className="mt-0.5 text-[10.5px] font-medium text-dark-navy/80 truncate">
              Paziente: {matchedAppt.patientName}
            </p>
          )}
        </div>

        {s.isAvailable ? (
          <button
            type="button"
            onClick={() => onSelectSlot(s)}
            className="shrink-0 rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-semibold text-teal-800 hover:bg-teal-600 hover:text-white transition-colors"
          >
            Prenota
          </button>
        ) : badge ? (
          <span
            className={`shrink-0 text-[10px] font-bold rounded-full px-2 py-0.5 whitespace-nowrap ${badge.className}`}
          >
            {badge.label}
          </span>
        ) : (
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-charcoal/45 bg-slate-100 px-2 py-0.5 rounded-full">
            Occupato
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col rounded-3xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
      <div className="bg-gradient-to-r from-dark-navy to-teal-950 p-4 text-white">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 font-serif text-base font-semibold">
            <DoorOpen className="h-4 w-4 text-teal-300" />
            {roomName}
          </span>
          <span
            className={`text-[10px] uppercase font-bold tracking-wider rounded-full px-2.5 py-0.5 ${
              availableCount > 0 ? "bg-emerald-400/20 text-emerald-100" : "bg-white/10 text-teal-100/80"
            }`}
          >
            {availableCount} slot liberi
          </span>
        </div>
        <p className="mt-0.5 text-[11px] text-teal-200/85">{subtitle}</p>
      </div>

      <div className="p-4 space-y-3 flex-1 max-h-[560px] overflow-y-auto">
        {appointments.length > 0 && slots.length === 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
              Visite in Agenda Oggi ({appointments.length})
            </p>
            {appointments.map((app) => {
              const badge = LIVE_STATUS_BADGE[app.liveStatus];
              return (
                <div
                  key={app.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-dark-navy truncate">
                      {app.time} · {app.patientName}
                    </p>
                    <p className="text-[11px] text-charcoal/70 truncate">{app.doctorName}</p>
                  </div>
                  <span className={`shrink-0 text-[10px] font-bold rounded-full px-2 py-0.5 ${badge.className}`}>
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {slots.length === 0 && appointments.length === 0 ? (
          <div className="py-10 text-center text-xs text-charcoal/50 italic">
            Nessun turno programmato in questa stanza (Fascia 09:00–19:00).
          </div>
        ) : (
          <>
            {morningSlots.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-accent">
                  Fascia Mattina · 09:00–14:00
                </p>
                {morningSlots.map((s, idx) => renderSlotRow(s, idx))}
              </div>
            )}

            {afternoonSlots.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-accent">
                  Fascia Pomeriggio · 14:00–19:00
                </p>
                {afternoonSlots.map((s, idx) => renderSlotRow(s, idx))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
