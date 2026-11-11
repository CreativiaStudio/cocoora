"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calendar as CalendarIcon,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  MapPin,
  Pencil,
  Phone,
  Sparkles,
  Stethoscope,
  User,
} from "lucide-react";
import { Button } from "@/components/ui";
import { computeAvailableSlots, type Slot } from "@/lib/slot-engine";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export type LoggedPatient = {
  id: string;
  patient_code?: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
};

export type PatientCalendarProps = {
  patient?: LoggedPatient | null;
  onBookingComplete?: () => void;
};

type MedicalService = {
  id: string;
  code?: string | null;
  name: string;
  category?: string | null;
  duration_minutes?: number | null;
  is_bookable_online?: boolean | null;
  room?: string | null;
};

type AreaId = "odontoiatria" | "estetica" | "specialistiche";
type Step = 1 | 2 | 3 | 4;

const CLINIC_PHONE = "081 18182091";

const AREAS: ReadonlyArray<{
  id: AreaId;
  label: string;
  emoji: string;
  description: string;
}> = [
  {
    id: "odontoiatria",
    label: "Odontoiatria",
    emoji: "🦷",
    description: "Prevenzione, igiene e cura del sorriso",
  },
  {
    id: "estetica",
    label: "Medicina Estetica",
    emoji: "✨",
    description: "Viso, corpo e tecnologie medicali",
  },
  {
    id: "specialistiche",
    label: "Visite Specialistiche",
    emoji: "🩺",
    description: "Specialisti, diagnostica e prevenzione",
  },
];

/** Keyword utilizzate per abbinare gli slot del giorno all'area scelta. */
const AREA_DOCTOR_KEYWORDS: Record<AreaId, string[]> = {
  odontoiatria: ["odonto", "dent", "ortodon", "igien", "parodon", "implant", "protesi"],
  estetica: ["estetic", "dermat", "laser", "criolipo", "carbossi", "medicina estetica"],
  specialistiche: [
    "ocul",
    "cardio",
    "gineco",
    "pediat",
    "senolo",
    "ecograf",
    "radiolog",
    "endocrin",
    "nutrizion",
    "ortoped",
    "otorin",
    "neurolog",
    "urolog",
    "androlog",
    "flebolog",
    "pneumolog",
    "gastroenter",
    "reumatolog",
    "psicolog",
    "chirurg",
    "dermatolog",
  ],
};

/** Indizi di specialità ricavati dal nome della prestazione scelta. */
const SERVICE_SPECIALTY_HINTS: ReadonlyArray<{ pattern: RegExp; keywords: string[] }> = [
  { pattern: /nei|mappatura|dermat|pelle|skin/, keywords: ["dermat"] },
  { pattern: /ocul|visus|vista|refraz/, keywords: ["ocul"] },
  { pattern: /gineco|ostetric/, keywords: ["gineco"] },
  { pattern: /pediatr/, keywords: ["pediat"] },
  { pattern: /cardiolog|elettrocardiogramma|ecg/, keywords: ["cardio"] },
  { pattern: /senolog|mammar/, keywords: ["senolo", "senolog", "mammar"] },
  { pattern: /odonto|dental|dente|denti|igiene|ortodon|allineator/, keywords: ["odonto", "dent", "ortodon", "igien"] },
  {
    pattern: /estetic|filler|botulin|tossina|biorivital|biostimol|peeling|prx|laser|criolip|carbossi|mesoterap|intralipo|ultrasuoni/,
    keywords: ["estetic", "dermat", "laser"],
  },
];

const STOP_WORDS = new Set([
  "della",
  "dello",
  "delle",
  "degli",
  "della",
  "delle",
  "dello",
  "della",
  "della",
  "visita",
  "seduta",
  "prima",
  "dopo",
  "controllo",
  "completa",
  "completo",
  "professionale",
  "medicina",
  "medico",
  "medica",
  "specialistica",
  "specialistico",
  "trattamento",
  "trattamenti",
  "bilaterale",
  "online",
]);

const REFERENCE_SPECIALISTS: Partial<Record<AreaId, { name: string; title: string }>> = {
  odontoiatria: {
    name: "Dott.ssa Elisa Russo",
    title: "Odontoiatra e Specialista in Ortodonzia · Direttrice Sanitaria",
  },
};

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatLongDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function resolveServiceArea(service: MedicalService): AreaId {
  const category = normalizeText(service.category ?? "");
  const name = normalizeText(service.name);

  if (category === "medicina_estetica") return "estetica";
  if (category === "odontoiatria") return "odontoiatria";
  if (category === "igiene_prevenzione") {
    return /igien|dent|odont|tartaro|placca/.test(name) ? "odontoiatria" : "specialistiche";
  }
  if (
    category === "visita_specialistica" ||
    category === "diagnostica" ||
    category === "precision" ||
    category === "altro"
  ) {
    return "specialistiche";
  }

  if (/odont|igien|ortodon|allineator|implant|endodon|parodont|protesi|conservativa|dental/.test(name)) {
    return "odontoiatria";
  }
  if (
    /estetic|filler|botulin|tossina|biorivital|biostimol|peeling|prx|criolip|carbossi|mesoterap|intralipo|laser|ultrasuoni/.test(
      name
    )
  ) {
    return "estetica";
  }
  return "specialistiche";
}

function buildDoctorKeywords(area: AreaId, service: MedicalService | null): string[] {
  const keywords = new Set<string>(AREA_DOCTOR_KEYWORDS[area] ?? []);

  if (service) {
    const serviceName = normalizeText(service.name);
    for (const hint of SERVICE_SPECIALTY_HINTS) {
      if (hint.pattern.test(serviceName)) {
        hint.keywords.forEach((keyword) => keywords.add(keyword));
      }
    }
    for (const word of serviceName.split(/[^a-z0-9]+/)) {
      if (word.length >= 6 && !STOP_WORDS.has(word)) {
        keywords.add(word.slice(0, 6));
      }
    }
  }

  return Array.from(keywords);
}

function slotMatchesDoctorKeywords(slot: Slot, keywords: string[]): boolean {
  const haystack = normalizeText(`${slot.doctorName} ${slot.doctorTitle ?? ""}`);
  return keywords.some((keyword) => haystack.includes(keyword));
}

function makeReminderCode(appointmentId?: string | null): string {
  if (appointmentId) {
    const compact = appointmentId.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    if (compact.length >= 6) return `COC-${compact.slice(0, 6)}`;
  }
  return `COC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

const STEPS: ReadonlyArray<{ id: 1 | 2 | 3; label: string }> = [
  { id: 1, label: "Prestazione" },
  { id: 2, label: "Giorno e orario" },
  { id: 3, label: "Conferma" },
];

export function PatientCalendar({ patient, onBookingComplete }: PatientCalendarProps = {}) {
  const [step, setStep] = useState<Step>(1);
  const [area, setArea] = useState<AreaId>("odontoiatria");
  const [services, setServices] = useState<MedicalService[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [servicesError, setServicesError] = useState(false);
  const [selectedService, setSelectedService] = useState<MedicalService | null>(null);

  const todayISO = useMemo(() => toISODate(new Date()), []);

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return toISODate(tomorrow);
  });
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);

  // Precompila i recapiti se il paziente è già autenticato nell'Area Paziente.
  useEffect(() => {
    if (!patient) return;
    setForm((prev) => ({
      ...prev,
      name: `${patient.first_name || ""} ${patient.last_name || ""}`.trim(),
      phone: patient.phone || prev.phone,
      email: patient.email || prev.email,
    }));
  }, [patient]);

  // Carica il catalogo delle prestazioni prenotabili online.
  useEffect(() => {
    let cancelled = false;

    async function loadServices() {
      setLoadingServices(true);
      setServicesError(false);
      let loaded = false;

      try {
        const res = await fetch("/api/services");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data?.services) && data.services.length > 0) {
            const bookable = (data.services as MedicalService[]).filter(
              (service) => service.is_bookable_online === true
            );
            if (!cancelled) setServices(bookable);
            loaded = true;
          }
        }
      } catch (error) {
        console.warn("Recupero prestazioni tramite Supabase", error);
      }

      if (!loaded) {
        try {
          const { data } = await supabase
            .from("medical_services")
            .select("id, code, name, category, duration_minutes, is_bookable_online, room")
            .eq("is_active", true)
            .eq("is_bookable_online", true)
            .order("name", { ascending: true });

          if (!cancelled) {
            if (data && data.length > 0) {
              setServices(data as MedicalService[]);
            } else {
              setServicesError(true);
            }
          }
        } catch (error) {
          console.error("Errore recupero prestazioni", error);
          if (!cancelled) setServicesError(true);
        }
      }

      if (!cancelled) setLoadingServices(false);
    }

    loadServices();

    return () => {
      cancelled = true;
    };
  }, []);

  async function fetchSlots() {
    try {
      setLoadingSlots(true);
      let loaded = false;

      try {
        const res = await fetch(`/api/calendar/slots?date=${encodeURIComponent(selectedDate)}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data?.slots)) {
            setSlots(data.slots as Slot[]);
            loaded = true;
          }
        }
      } catch {
        // Fallback sul motore di calcolo locale.
      }

      if (!loaded) {
        const directSlots = await computeAvailableSlots(selectedDate);
        setSlots(directSlots);
      }
    } catch (error) {
      console.error("Errore recupero disponibilità", error);
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }

  useEffect(() => {
    if (step === 2) {
      fetchSlots();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, selectedDate]);

  const areaServices = useMemo(
    () => services.filter((service) => resolveServiceArea(service) === area),
    [services, area]
  );

  const availableSlots = useMemo(() => slots.filter((slot) => slot.isAvailable), [slots]);

  const doctorKeywords = useMemo(
    () => buildDoctorKeywords(area, selectedService),
    [area, selectedService]
  );

  const visibleSlots = useMemo(() => {
    // 1. La stanza indicata nel catalogo per la prestazione è l'indizio più preciso.
    const serviceRoom = normalizeText(selectedService?.room ?? "");
    if (serviceRoom) {
      const roomMatched = availableSlots.filter(
        (slot) => normalizeText(slot.roomName ?? "") === serviceRoom
      );
      if (roomMatched.length > 0) return roomMatched;
    }

    // 2. Abbinamento per specialità ricavata dal nome del medico o della prestazione.
    const areaSpecific = availableSlots.filter((slot) => slotMatchesDoctorKeywords(slot, doctorKeywords));
    if (areaSpecific.length > 0) return areaSpecific;

    // 3. Se la specialità non è deducibile mostriamo la disponibilità reale della giornata.
    return availableSlots;
  }, [availableSlots, doctorKeywords, selectedService]);

  const slotTimes = useMemo(() => {
    const byTime = new Map<string, Slot>();
    for (const slot of visibleSlots) {
      if (!byTime.has(slot.time)) byTime.set(slot.time, slot);
    }
    return Array.from(byTime.values()).sort((a, b) => a.time.localeCompare(b.time));
  }, [visibleSlots]);

  const availableDoctors = useMemo(() => {
    const byDoctor = new Map<string, { id: string; name: string; title: string | null }>();
    for (const slot of visibleSlots) {
      if (!byDoctor.has(slot.doctorId)) {
        byDoctor.set(slot.doctorId, {
          id: slot.doctorId,
          name: slot.doctorName,
          title: slot.doctorTitle,
        });
      }
    }
    return Array.from(byDoctor.values());
  }, [visibleSlots]);

  const referenceSpecialist = REFERENCE_SPECIALISTS[area] ?? null;
  const formattedDate = formatLongDate(selectedDate);
  const selectedDuration = selectedService?.duration_minutes || 30;

  function changeDateByDays(days: number) {
    const date = new Date(`${selectedDate}T00:00:00`);
    date.setDate(date.getDate() + days);
    const nextDate = toISODate(date);
    if (nextDate < todayISO) return;
    setSelectedDate(nextDate);
  }

  function setRelativeDay(offsetDays: number) {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    setSelectedDate(toISODate(date));
  }

  function handleSelectService(service: MedicalService) {
    setSelectedService(service);
    setSelectedSlot(null);
    setBookingError(null);
    setStep(2);
  }

  function handleSelectSlot(slot: Slot) {
    setSelectedSlot(slot);
    setBookingError(null);
    setStep(3);
  }

  function resetBookingFlow() {
    setStep(1);
    setSelectedService(null);
    setSelectedSlot(null);
    setConfirmationCode(null);
    setBookingError(null);
    if (!patient) {
      setForm({ name: "", phone: "", email: "", notes: "" });
    } else {
      setForm((prev) => ({ ...prev, notes: "" }));
    }
  }

  async function handleConfirmBooking(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedService || !selectedSlot) return;

    const patientName = form.name.trim();
    const patientPhone = form.phone.trim();

    if (!patientName || !patientPhone) {
      setBookingError("Inserisci nome e cognome e un numero di telefono per confermare la prenotazione.");
      return;
    }

    setSubmitting(true);
    setBookingError(null);

    const duration = selectedDuration;

    try {
      let appointmentId: string | null = null;
      let booked = false;

      try {
        const res = await fetch("/api/calendar/slots", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            doctorId: selectedSlot.doctorId,
            roomId: selectedSlot.roomId,
            serviceId: selectedService.id,
            patientId: patient?.id,
            date: selectedSlot.date,
            time: selectedSlot.time,
            durationMinutes: duration,
            patientName,
            patientPhone,
            patientEmail: form.email.trim() || undefined,
            notes: form.notes.trim() || undefined,
          }),
        });

        let payload: { success?: boolean; appointmentId?: string; error?: string } | null = null;
        try {
          payload = await res.json();
        } catch {
          payload = null;
        }

        if (res.ok && payload?.success) {
          booked = true;
          appointmentId = payload.appointmentId ?? null;
        } else if (res.status === 400 || res.status === 409) {
          setBookingError(
            payload?.error || "Questo orario non è più disponibile: scegli un altro orario."
          );
          setSubmitting(false);
          setStep(2);
          return;
        }
      } catch {
        // Se l'API non è raggiungibile procediamo con l'inserimento diretto.
      }

      // Fallback diretto su Supabase (ambienti statici / API non disponibile).
      if (!booked) {
        let patientId: string | null = patient?.id ?? null;

        if (!patientId) {
          const nameParts = patientName.split(" ");
          const firstName = nameParts[0] || "Paziente";
          const lastName = nameParts.slice(1).join(" ") || "Cocoora";

          const { data: createdPatient } = await supabase
            .from("patient_profiles")
            .insert({
              patient_code: `COC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
              first_name: firstName,
              last_name: lastName,
              phone: patientPhone,
              email: form.email.trim() || null,
            })
            .select("id")
            .single();

          if (createdPatient) patientId = createdPatient.id;
        }

        const startsAt = new Date(`${selectedSlot.date}T${selectedSlot.time}:00Z`).toISOString();
        const endsAt = new Date(new Date(startsAt).getTime() + duration * 60 * 1000).toISOString();

        const { data: createdAppointment, error: appointmentError } = await supabase
          .from("appointments")
          .insert({
            patient_id: patientId,
            doctor_id: selectedSlot.doctorId,
            room_id: selectedSlot.roomId,
            service_id: selectedService.id,
            starts_at: startsAt,
            ends_at: endsAt,
            status: "confermato",
            is_first_visit: true,
            notes: form.notes.trim()
              ? `Prenotazione Area Paziente: ${form.notes.trim()}`
              : `Prenotazione Area Paziente · ${patientName} (${patientPhone})`,
          })
          .select("id")
          .single();

        if (appointmentError) throw appointmentError;
        appointmentId = createdAppointment?.id ?? null;
      }

      setConfirmationCode(makeReminderCode(appointmentId));
      setStep(4);
      onBookingComplete?.();
    } catch (error) {
      console.error("Errore prenotazione", error);
      setBookingError(
        `Non è stato possibile completare la prenotazione. Riprova o contatta la reception al ${CLINIC_PHONE}.`
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Intestazione e claim */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-800 border border-teal-100">
            <Sparkles className="h-3 w-3" /> Connessi alla tua salute
          </span>
          <h3 className="mt-2 font-serif text-xl sm:text-2xl font-bold text-dark-navy">
            Prenota la tua visita
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-charcoal/70">
            Tre passaggi semplici: scegli la prestazione, il giorno e l&apos;orario. Al resto pensiamo noi.
          </p>
        </div>
        <a
          href={`tel:${CLINIC_PHONE.replace(/\s+/g, "")}`}
          className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-dark-navy transition-colors hover:border-teal-300 hover:bg-teal-50"
        >
          <Phone className="h-3.5 w-3.5 text-teal-700" />
          {CLINIC_PHONE}
        </a>
      </div>

      {/* Stepper */}
      {step !== 4 && (
        <ol className="flex items-center gap-1.5 sm:gap-3 rounded-2xl border border-slate-200/90 bg-white p-3 sm:p-4">
          {STEPS.map((item, index) => {
            const isDone = step > item.id;
            const isCurrent = step === item.id;
            return (
              <li key={item.id} className="flex flex-1 items-center gap-1.5 sm:gap-2.5">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                    isDone && "bg-emerald-600 text-white",
                    isCurrent && "bg-primary-teal text-white shadow-sm",
                    !isDone && !isCurrent && "border border-slate-200 bg-slate-50 text-slate-500"
                  )}
                  aria-hidden="true"
                >
                  {isDone ? <Check className="h-4 w-4" /> : item.id}
                </span>
                <span
                  className={cn(
                    "truncate text-[11px] sm:text-xs font-semibold",
                    isCurrent ? "text-dark-navy" : isDone ? "text-emerald-700" : "text-slate-400"
                  )}
                >
                  {item.id}. {item.label}
                </span>
                {index < STEPS.length - 1 && (
                  <span
                    className={cn(
                      "hidden h-px flex-1 sm:block",
                      step > item.id ? "bg-emerald-200" : "bg-slate-200"
                    )}
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>
      )}

      {/* ── STEP 1 · PRESTAZIONE ─────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <h4 className="font-serif text-base sm:text-lg font-semibold text-dark-navy">
              1. Scegli la visita o trattamento
            </h4>
            <p className="mt-0.5 text-xs text-charcoal/60">
              Seleziona l&apos;area medica e poi la prestazione che ti interessa.
            </p>
          </div>

          {/* Aree mediche */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {AREAS.map((item) => {
              const isActive = area === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setArea(item.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border p-4 text-left transition-all sm:flex-col sm:items-start sm:gap-2 sm:p-5",
                    isActive
                      ? "border-primary-teal bg-teal-50/80 shadow-sm ring-2 ring-primary-teal/15"
                      : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-sm"
                  )}
                >
                  <span className="text-2xl leading-none" aria-hidden="true">
                    {item.emoji}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block font-serif text-sm sm:text-base font-semibold",
                        isActive ? "text-dark-navy" : "text-dark-navy/90"
                      )}
                    >
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-charcoal/60">
                      {item.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Prestazioni dell'area selezionata */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <h5 className="font-serif text-sm font-semibold text-dark-navy">
                Prestazioni disponibili online
              </h5>
              <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-charcoal/60">
                {areaServices.length} {areaServices.length === 1 ? "prestazione" : "prestazioni"}
              </span>
            </div>

            {loadingServices ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <Loader2 className="h-6 w-6 animate-spin text-teal-700" />
                <p className="text-xs text-charcoal/60">Caricamento delle prestazioni del centro…</p>
              </div>
            ) : servicesError && services.length === 0 ? (
              <div className="py-10 text-center">
                <AlertCircle className="mx-auto mb-2 h-7 w-7 text-rose-500" />
                <p className="text-sm font-semibold text-dark-navy">
                  Non riusciamo a caricare le prestazioni.
                </p>
                <p className="mt-1 text-xs text-charcoal/60">
                  Riprova tra poco oppure chiama la reception al{" "}
                  <a href={`tel:${CLINIC_PHONE.replace(/\s+/g, "")}`} className="font-semibold text-teal-800 underline">
                    {CLINIC_PHONE}
                  </a>
                  .
                </p>
              </div>
            ) : areaServices.length === 0 ? (
              <div className="py-10 text-center">
                <Stethoscope className="mx-auto mb-2 h-7 w-7 text-teal-600/70" />
                <p className="text-sm font-semibold text-dark-navy">
                  Nessuna prestazione prenotabile online in quest&apos;area.
                </p>
                <p className="mt-1 text-xs text-charcoal/60">
                  Chiama la reception al{" "}
                  <a href={`tel:${CLINIC_PHONE.replace(/\s+/g, "")}`} className="font-semibold text-teal-800 underline">
                    {CLINIC_PHONE}
                  </a>{" "}
                  per fissare l&apos;appuntamento.
                </p>
              </div>
            ) : (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {areaServices.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => handleSelectService(service)}
                    className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-primary-teal/60 hover:bg-teal-50/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-teal/30"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 group-hover:bg-white">
                        <Stethoscope className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-serif text-sm sm:text-base font-semibold leading-snug text-dark-navy">
                          {service.name}
                        </span>
                        <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-charcoal/60">
                          <Clock className="h-3 w-3 text-teal-700" />
                          {service.duration_minutes || 30} min
                        </span>
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1 text-[11px] font-bold text-primary-teal">
                      Scegli
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STEP 2 · GIORNO E ORARIO ─────────────────────────────────── */}
      {step === 2 && selectedService && (
        <div className="space-y-5">
          <div>
            <h4 className="font-serif text-base sm:text-lg font-semibold text-dark-navy">
              2. Scegli giorno e orario
            </h4>
            <p className="mt-0.5 text-xs text-charcoal/60">
              Gli orari mostrati sono aggiornati in tempo reale.
            </p>
          </div>

          {/* Riepilogo prestazione con badge */}
          <div className="flex flex-col gap-3 rounded-2xl border border-[#80A1B2]/40 bg-teal-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-teal text-white">
                <Stethoscope className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1 rounded-full border border-teal-200 bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-800">
                  <Check className="h-3 w-3" /> Prestazione scelta
                </span>
                <p className="mt-1 truncate font-serif text-sm sm:text-base font-semibold text-dark-navy">
                  {selectedService.name}
                </p>
                <p className="flex items-center gap-1 text-[11px] text-charcoal/60">
                  <Clock className="h-3 w-3 text-teal-700" />
                  Durata stimata {selectedDuration} min
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[11px] font-semibold text-primary-teal transition-colors hover:border-teal-300 hover:bg-teal-50 sm:self-center"
            >
              <Pencil className="h-3 w-3" /> Modifica
            </button>
          </div>

          {/* Specialista */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
              {availableDoctors.length > 0
                ? availableDoctors.length === 1
                  ? "Il tuo specialista"
                  : "Specialisti disponibili"
                : "Specialista di riferimento"}
            </p>

            {loadingSlots ? (
              <div className="mt-3 flex items-center gap-2 text-xs text-charcoal/60">
                <Loader2 className="h-4 w-4 animate-spin text-teal-700" />
                Verifica degli specialisti disponibili…
              </div>
            ) : availableDoctors.length > 0 ? (
              <div className="mt-3 space-y-2">
                {availableDoctors.slice(0, 3).map((doctor) => (
                  <div key={doctor.id} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                      <User className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-dark-navy">{doctor.name}</p>
                      {doctor.title && (
                        <p className="text-[11px] leading-snug text-charcoal/60">{doctor.title}</p>
                      )}
                    </div>
                  </div>
                ))}
                {availableDoctors.length > 3 && (
                  <p className="pl-10 text-[11px] font-medium text-charcoal/50">
                    + altri specialisti disponibili in questa giornata
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-3 flex items-start gap-2.5">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700">
                  <User className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-dark-navy">
                    {referenceSpecialist?.name ?? "Specialista del centro Cocoora"}
                  </p>
                  <p className="text-[11px] leading-snug text-charcoal/60">
                    {referenceSpecialist?.title ??
                      "Assegnato in base alla prestazione selezionata dalla Direzione Sanitaria."}
                  </p>
                </div>
              </div>
            )}

            <p className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-[11px] text-charcoal/60">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
              L&apos;assegnazione della stanza è automatica: non devi preoccuparti di nulla.
            </p>
          </div>

          {/* Navigatore data */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => changeDateByDays(-1)}
                  disabled={selectedDate <= todayISO}
                  aria-label="Giorno precedente"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-charcoal/70 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-teal-50 px-3 py-2 text-center">
                  <CalendarIcon className="h-4 w-4 shrink-0 text-teal-700" />
                  <span className="truncate font-serif text-sm font-semibold capitalize text-dark-navy">
                    {formattedDate}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => changeDateByDays(1)}
                  aria-label="Giorno successivo"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-charcoal/70 transition-colors hover:bg-slate-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRelativeDay(0)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                    selectedDate === todayISO
                      ? "border-primary-teal bg-primary-teal text-white"
                      : "border-slate-200 text-charcoal/70 hover:bg-slate-50"
                  )}
                >
                  Oggi
                </button>
                <button
                  type="button"
                  onClick={() => setRelativeDay(1)}
                  className="rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-charcoal/70 transition-colors hover:bg-slate-50"
                >
                  Domani
                </button>
                <input
                  type="date"
                  value={selectedDate}
                  min={todayISO}
                  onChange={(event) => {
                    if (event.target.value) setSelectedDate(event.target.value);
                  }}
                  aria-label="Scegli la data"
                  className="rounded-xl border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-dark-navy focus:border-primary-teal focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Griglia orari */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <h5 className="font-serif text-sm font-semibold text-dark-navy">Orari disponibili</h5>
              {!loadingSlots && slotTimes.length > 0 && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                  {slotTimes.length} {slotTimes.length === 1 ? "orario" : "orari"}
                </span>
              )}
            </div>

            {loadingSlots ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                <Loader2 className="h-6 w-6 animate-spin text-teal-700" />
                <p className="text-xs text-charcoal/60">Ricerca degli orari liberi in agenda…</p>
              </div>
            ) : slotTimes.length === 0 ? (
              <div className="py-10 text-center">
                <CalendarIcon className="mx-auto mb-2 h-7 w-7 text-teal-600/70" />
                <p className="text-sm font-semibold text-dark-navy">
                  Nessun orario disponibile in questa data.
                </p>
                <p className="mt-1 text-xs text-charcoal/60">
                  Prova con un altro giorno oppure chiama la reception al{" "}
                  <a href={`tel:${CLINIC_PHONE.replace(/\s+/g, "")}`} className="font-semibold text-teal-800 underline">
                    {CLINIC_PHONE}
                  </a>
                  .
                </p>
                <div className="mt-4 flex justify-center">
                  <Button type="button" variant="secondary" size="sm" onClick={() => changeDateByDays(1)}>
                    Vedi il giorno successivo
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                {slotTimes.map((slot) => (
                  <button
                    key={`${slot.date}-${slot.time}`}
                    type="button"
                    title={`${slot.time} · ${slot.doctorName}`}
                    onClick={() => handleSelectSlot(slot)}
                    className="group inline-flex items-center justify-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-bold text-emerald-800 transition-all hover:-translate-y-0.5 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                  >
                    <Clock className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100" />
                    {slot.time}
                  </button>
                ))}
              </div>
            )}

            <p className="mt-4 text-[11px] leading-snug text-charcoal/50">
              Orari ufficiali del centro: Lun–Ven 8:00–20:00 (orario continuato), Sab 9:00–14:00.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal/60 transition-colors hover:text-dark-navy"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Cambia prestazione
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3 · RECAPITI E CONFERMA ─────────────────────────────── */}
      {step === 3 && selectedService && selectedSlot && (
        <div className="space-y-5">
          <div>
            <h4 className="font-serif text-base sm:text-lg font-semibold text-dark-navy">
              3. I tuoi recapiti e conferma
            </h4>
            <p className="mt-0.5 text-xs text-charcoal/60">
              Ti invieremo il promemoria dell&apos;appuntamento via SMS o WhatsApp.
            </p>
          </div>

          {/* Riepilogo completa */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                  Riepilogo prenotazione
                </p>
                <h5 className="mt-0.5 font-serif text-base font-semibold text-dark-navy">
                  {selectedService.name}
                </h5>
                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-0.5 text-[10px] font-semibold text-charcoal/60">
                  <Clock className="h-3 w-3 text-teal-700" />
                  {selectedDuration} min
                </span>
              </div>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-primary-teal hover:underline"
              >
                <Pencil className="h-3 w-3" /> Modifica
              </button>
            </div>

            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-charcoal/45">
                  Medico specialista
                </dt>
                <dd className="mt-0.5 text-sm font-semibold text-dark-navy">
                  {selectedSlot.doctorName}
                </dd>
                {selectedSlot.doctorTitle && (
                  <dd className="text-[11px] leading-snug text-charcoal/60">{selectedSlot.doctorTitle}</dd>
                )}
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-wider text-charcoal/45">
                  Data e orario
                </dt>
                <dd className="mt-0.5 text-sm font-semibold capitalize text-dark-navy">
                  {formattedDate}
                </dd>
                <dd className="text-[11px] text-charcoal/60">Ore {selectedSlot.time}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[10px] font-bold uppercase tracking-wider text-charcoal/45">
                  Sede
                </dt>
                <dd className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-dark-navy">
                  <MapPin className="h-3.5 w-3.5 text-teal-700" />
                  Cocoora Centro Medico · Via De Bonis, Napoli
                </dd>
              </div>
            </dl>
          </div>

          {/* Form recapiti */}
          <form
            onSubmit={handleConfirmBooking}
            className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5"
          >
            {patient && (
              <div className="flex items-center gap-2.5 rounded-xl border border-teal-100 bg-teal-50/70 p-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-teal text-white">
                  <Check className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-teal-800">
                    Stai prenotando come
                  </p>
                  <p className="text-xs font-semibold text-dark-navy">
                    {patient.first_name} {patient.last_name}
                    {patient.patient_code ? ` · ${patient.patient_code}` : ""}
                  </p>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="patient-name" className="mb-1 block text-xs font-semibold text-dark-navy">
                Nome e Cognome *
              </label>
              <input
                id="patient-name"
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Mario Rossi"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-charcoal focus:border-primary-teal focus:outline-none focus:ring-2 focus:ring-primary-teal/15"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="patient-phone" className="mb-1 block text-xs font-semibold text-dark-navy">
                  Telefono cellulare *
                </label>
                <input
                  id="patient-phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  placeholder="333 1234567"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-charcoal focus:border-primary-teal focus:outline-none focus:ring-2 focus:ring-primary-teal/15"
                />
                <p className="mt-1 text-[10px] text-charcoal/50">
                  Per il promemoria dell&apos;appuntamento via SMS o WhatsApp.
                </p>
              </div>

              <div>
                <label htmlFor="patient-email" className="mb-1 block text-xs font-semibold text-dark-navy">
                  Email <span className="font-normal text-charcoal/50">(opzionale)</span>
                </label>
                <input
                  id="patient-email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  placeholder="mario.rossi@email.it"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-charcoal focus:border-primary-teal focus:outline-none focus:ring-2 focus:ring-primary-teal/15"
                />
                <p className="mt-1 text-[10px] text-charcoal/50">Per ricevere la ricevuta dell&apos;appuntamento.</p>
              </div>
            </div>

            <div>
              <label htmlFor="patient-notes" className="mb-1 block text-xs font-semibold text-dark-navy">
                Note <span className="font-normal text-charcoal/50">(opzionale)</span>
              </label>
              <textarea
                id="patient-notes"
                rows={2}
                value={form.notes}
                onChange={(event) => setForm({ ...form, notes: event.target.value })}
                placeholder="Es. prima visita, controllo, preferenze particolari…"
                className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-charcoal focus:border-primary-teal focus:outline-none focus:ring-2 focus:ring-primary-teal/15"
              />
            </div>

            {bookingError && (
              <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{bookingError}</span>
              </div>
            )}

            <div className="border-t border-slate-100 pt-4">
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="w-full bg-emerald-600 text-white shadow-[0_12px_30px_-12px_rgba(5,150,105,0.65)] hover:bg-emerald-700 hover:shadow-[0_16px_40px_-12px_rgba(5,150,105,0.75)]"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Prenotazione in corso…
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5" /> Conferma Prenotazione
                  </>
                )}
              </Button>
              <p className="mt-2 text-center text-[10px] leading-snug text-charcoal/50">
                Confermando accetti di essere ricontattato dalla reception per eventuali variazioni
                dell&apos;appuntamento.
              </p>
            </div>

            <div className="flex justify-start">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal/60 transition-colors hover:text-dark-navy"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Torna agli orari
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── STEP 4 · CONFERMA ────────────────────────────────────────── */}
      {step === 4 && selectedService && selectedSlot && (
        <div className="mx-auto max-w-xl space-y-5 rounded-3xl border border-emerald-100 bg-white p-6 text-center shadow-sm sm:p-9">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50">
            <CheckCircle2 className="h-11 w-11" />
          </div>

          <div>
            <h4 className="font-serif text-2xl font-bold text-dark-navy">Prenotazione confermata</h4>
            <p className="mt-1 text-sm text-charcoal/70">
              Ti aspettiamo da Cocoora. La tua richiesta è già in agenda.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              Codice promemoria
            </p>
            <p className="mt-0.5 font-mono text-xl font-bold tracking-wider text-emerald-900">
              {confirmationCode}
            </p>
          </div>

          <dl className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-left text-xs">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200/60 pb-2">
              <dt className="text-charcoal/50">Prestazione</dt>
              <dd className="text-right font-semibold text-dark-navy">{selectedService.name}</dd>
            </div>
            <div className="flex items-start justify-between gap-3 border-b border-slate-200/60 pb-2">
              <dt className="text-charcoal/50">Medico specialista</dt>
              <dd className="text-right font-semibold text-dark-navy">
                {selectedSlot.doctorName}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-3 border-b border-slate-200/60 pb-2">
              <dt className="text-charcoal/50">Data e orario</dt>
              <dd className="text-right font-semibold capitalize text-dark-navy">
                {formattedDate} · Ore {selectedSlot.time}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="text-charcoal/50">Sede</dt>
              <dd className="text-right font-semibold text-dark-navy">
                Via De Bonis, Napoli
              </dd>
            </div>
          </dl>

          <p className="text-[11px] leading-relaxed text-charcoal/55">
            Riceverai il promemoria sul numero indicato. Ti consigliamo di arrivare con qualche
            minuto di anticipo: la reception ti accompagnerà nella stanza assegnata.
          </p>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button type="button" variant="secondary" size="md" onClick={resetBookingFlow}>
              Prenota un&apos;altra visita
            </Button>
            <Link
              href="/area-paziente"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-teal px-6 py-3 text-sm font-medium text-white shadow-[0_10px_30px_-12px_rgba(28,74,92,0.55)] transition-all hover:-translate-y-0.5 hover:bg-dark-navy"
            >
              Torna all&apos;Area Paziente
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
