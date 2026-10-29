"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AlertTriangle,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  DoorOpen,
  Loader2,
  MessageCircle,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import type { SlotCandidate } from "@/lib/scheduling/contract";
import {
  bookAppointmentAction,
  getAvailableSlotsAction,
} from "@/app/segreteria/prenota/actions";
import {
  PatientSearch,
  type PatientSearchResult,
} from "@/components/segreteria/booking/PatientSearch";
import {
  ServiceSearch,
  type ServiceSearchResult,
} from "@/components/segreteria/booking/ServiceSearch";
import { SlotList } from "@/components/segreteria/booking/SlotList";
import { CoverageBadge } from "@/components/segreteria/booking/CoverageBadge";
import { useBookingHotkeys } from "@/components/segreteria/booking/useBookingHotkeys";
import { cn } from "@/lib/utils";

export type BookingDrawerBookedPayload = {
  appointmentId: string;
  patient: PatientSearchResult;
  service: ServiceSearchResult;
  slot: SlotCandidate;
  whatsappConfirmed: boolean;
};

export type BookingDrawerProps = {
  open: boolean;
  onClose: () => void;
  initialDate?: string;
  onBooked?: (payload: BookingDrawerBookedPayload) => void;
};

type BookingStep = 1 | 2 | 3;

type BookingSuccess = {
  appointmentId: string;
  patient: PatientSearchResult;
  service: ServiceSearchResult;
  slot: SlotCandidate;
  whatsapp: boolean;
  isCovered: boolean;
};

const timeFormatter = new Intl.DateTimeFormat("it-IT", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Rome",
});

const longDateFormatter = new Intl.DateTimeFormat("it-IT", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Rome",
});

function todayInRome(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function resolveDate(value?: string): string {
  if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return todayInRome();
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "--:--";
  return timeFormatter.format(date);
}

function formatLongDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Data da definire";
  return longDateFormatter.format(date);
}

function formatDateInput(dateStr: string): string {
  const date = new Date(`${dateStr}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return dateStr;
  return longDateFormatter.format(date);
}

function calculateAge(birthDate?: string | null): number | null {
  if (!birthDate) return null;
  const birth = new Date(`${birthDate}T00:00:00Z`);
  if (Number.isNaN(birth.getTime())) return null;

  const now = new Date();
  let age = now.getUTCFullYear() - birth.getUTCFullYear();
  const monthDiff = now.getUTCMonth() - birth.getUTCMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && now.getUTCDate() < birth.getUTCDate())
  ) {
    age -= 1;
  }
  return age;
}

const STEPS: Array<{ step: BookingStep; label: string; hint: string }> = [
  { step: 1, label: "Paziente", hint: "Anagrafica" },
  { step: 2, label: "Prestazione", hint: "Percorso o extra" },
  { step: 3, label: "Slot libero", hint: "Data e conferma" },
];

export function BookingDrawer({
  open,
  onClose,
  initialDate,
  onBooked,
}: BookingDrawerProps) {
  const patientInputRef = useRef<HTMLInputElement>(null);
  const serviceInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<BookingStep>(1);
  const [patient, setPatient] = useState<PatientSearchResult | null>(null);
  const [service, setService] = useState<ServiceSearchResult | null>(null);
  const [dateStr, setDateStr] = useState<string>(
    resolveDate(initialDate)
  );
  const [slots, setSlots] = useState<SlotCandidate[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SlotCandidate | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [slotTaken, setSlotTaken] = useState(false);
  const [whatsappConfirm, setWhatsappConfirm] = useState(true);
  const [minorConsent, setMinorConsent] = useState(false);
  const [delegateConsent, setDelegateConsent] = useState(false);
  const [success, setSuccess] = useState<BookingSuccess | null>(null);

  const age = patient ? calculateAge(patient.birthDate) : null;
  const isMinor = age !== null && age < 18;
  const hasActivePath = Boolean(patient?.membershipId || patient?.pathName);
  const isCovered = Boolean(
    service?.isCoveredByMembership && hasActivePath
  );

  /* Reset pulito a ogni apertura del drawer. */
  useEffect(() => {
    if (!open) return;

    setStep(1);
    setPatient(null);
    setService(null);
    setDateStr(resolveDate(initialDate));
    setSlots([]);
    setSelectedSlot(null);
    setIsLoadingSlots(false);
    setSlotError(null);
    setIsBooking(false);
    setBookingError(null);
    setSlotTaken(false);
    setWhatsappConfirm(true);
    setMinorConsent(false);
    setDelegateConsent(false);
    setSuccess(null);
  }, [open, initialDate]);

  const loadSlots = useCallback(
    async (keepSelection = false) => {
      if (!service) {
        setSlots([]);
        setSelectedSlot(null);
        return;
      }

      setIsLoadingSlots(true);
      setSlotError(null);

      try {
        const nextSlots = await getAvailableSlotsAction(
          service.id,
          undefined,
          dateStr
        );

        setSlots(nextSlots);
        setSelectedSlot((previous) => {
          if (!keepSelection || !previous) return null;
          return (
            nextSlots.find(
              (slot) =>
                slot.start === previous.start &&
                slot.doctorId === previous.doctorId
            ) ?? null
          );
        });
      } catch {
        setSlots([]);
        setSlotError(
          "Impossibile recuperare gli slot liberi. Verifica la connessione e riprova."
        );
      } finally {
        setIsLoadingSlots(false);
      }
    },
    [service, dateStr]
  );

  useEffect(() => {
    if (!open || step !== 3 || !service || success) return;
    void loadSlots(false);
  }, [open, step, service, success, loadSlots]);

  useEffect(() => {
    if (!open || success) return;

    const timer = window.setTimeout(() => {
      if (step === 1) patientInputRef.current?.focus();
      if (step === 2) serviceInputRef.current?.focus();
    }, 120);

    return () => window.clearTimeout(timer);
  }, [open, step, success]);

  const handlePatientSelect = useCallback(
    (nextPatient: PatientSearchResult | null) => {
      setPatient(nextPatient);
      setBookingError(null);
      setSlotTaken(false);
      setMinorConsent(false);
      setDelegateConsent(false);

      if (nextPatient) {
        setStep(2);
      } else {
        setStep(1);
      }
    },
    []
  );

  const handleServiceSelect = useCallback(
    (nextService: ServiceSearchResult | null) => {
      setService(nextService);
      setSelectedSlot(null);
      setSlots([]);
      setBookingError(null);
      setSlotTaken(false);

      if (nextService) {
        setStep(3);
      } else {
        setStep(2);
      }
    },
    []
  );

  const handleConfirm = useCallback(async () => {
    if (isBooking || success) return;

    if (step === 1) {
      if (!patient) {
        patientInputRef.current?.focus();
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!service) {
        serviceInputRef.current?.focus();
        return;
      }
      setStep(3);
      return;
    }

    if (!patient || !service || !selectedSlot) {
      setBookingError("Seleziona uno slot libero per completare la prenotazione.");
      return;
    }

    if (isMinor && !minorConsent) {
      setBookingError(
        "Acquisisci il doppio consenso firmato da entrambi i genitori prima di confermare."
      );
      return;
    }

    setIsBooking(true);
    setBookingError(null);
    setSlotTaken(false);

    try {
      const result = await bookAppointmentAction({
        patientId: patient.id,
        serviceId: service.id,
        doctorId: selectedSlot.doctorId,
        start: selectedSlot.start,
        channel: "reception",
        coveredByMembershipId:
          isCovered && patient.membershipId ? patient.membershipId : undefined,
      });

      if (result.success && result.appointmentId) {
        const booked: BookingSuccess = {
          appointmentId: result.appointmentId,
          patient,
          service,
          slot: selectedSlot,
          whatsapp: whatsappConfirm,
          isCovered,
        };

        setSuccess(booked);
        onBooked?.({
          appointmentId: result.appointmentId,
          patient,
          service,
          slot: selectedSlot,
          whatsappConfirmed: whatsappConfirm,
        });
        return;
      }

      if (result.errorCode === "SLOT_TAKEN") {
        setSlotTaken(true);
        setBookingError(
          result.errorMessage ??
            "Lo slot è stato appena occupato da un'altra operatrice."
        );
        setSelectedSlot(null);
        await loadSlots(false);
        return;
      }

      setBookingError(
        result.errorMessage ??
          "Prenotazione non registrata. Verifica i dati e riprova."
      );
    } catch {
      setBookingError(
        "Connessione non disponibile: la prenotazione non è stata registrata. Riprova."
      );
    } finally {
      setIsBooking(false);
    }
  }, [
    isBooking,
    success,
    step,
    patient,
    service,
    selectedSlot,
    isMinor,
    minorConsent,
    isCovered,
    whatsappConfirm,
    onBooked,
    loadSlots,
  ]);

  const focusPatient = useCallback(() => {
    if (success) return;
    setStep(1);
    window.setTimeout(() => patientInputRef.current?.focus(), 80);
  }, [success]);

  const focusService = useCallback(() => {
    if (success) return;

    if (!patient) {
      setStep(1);
      window.setTimeout(() => patientInputRef.current?.focus(), 80);
      return;
    }

    setService(null);
    setSelectedSlot(null);
    setSlots([]);
    setStep(2);
    window.setTimeout(() => serviceInputRef.current?.focus(), 80);
  }, [patient, success]);

  const handleHotkeyConfirm = useCallback(() => {
    if (success || isBooking) return;
    void handleConfirm();
  }, [success, isBooking, handleConfirm]);

  const handleEscape = useCallback(() => {
    if (isBooking) return;
    onClose();
  }, [isBooking, onClose]);

  useBookingHotkeys({
    enabled: open,
    onFocusPatient: focusPatient,
    onFocusService: focusService,
    onConfirm: handleHotkeyConfirm,
    onEscape: handleEscape,
  });

  const selectedDateLabel = useMemo(
    () => formatDateInput(dateStr),
    [dateStr]
  );

  const canContinue = step === 1 ? Boolean(patient) : Boolean(service);
  const canConfirm =
    Boolean(selectedSlot) &&
    !isLoadingSlots &&
    !isBooking &&
    step === 3 &&
    (!isMinor || minorConsent);

  function goToStep(target: BookingStep) {
    if (target >= 2 && !patient) return;
    if (target >= 3 && !service) return;
    setStep(target);
  }

  function handleAnotherBooking() {
    setSuccess(null);
    setService(null);
    setSlots([]);
    setSelectedSlot(null);
    setBookingError(null);
    setSlotTaken(false);
    setMinorConsent(false);
    setDelegateConsent(false);
    setStep(2);
  }

  if (!open) return null;

  const confirmedDate = success ? formatLongDate(success.slot.start) : "";

  return (
    <div
      className="fixed inset-0 z-[100000] flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Prenotazione rapida Cocoora Desk"
    >
      <button
        type="button"
        aria-label="Chiudi prenotazione rapida"
        onClick={handleEscape}
        className="absolute inset-0 bg-[#03354B]/45 backdrop-blur-[2px] animate-[fadeIn_0.2s_ease-out]"
      />

      <div className="relative z-10 flex h-full w-full max-w-2xl flex-col bg-white shadow-[0_30px_90px_-20px_rgba(3,53,75,0.55)] animate-[fadeUp_0.28s_cubic-bezier(0.22,1,0.36,1)]">
        {/* HEADER BRAND */}
        <header className="shrink-0 bg-[#03354B] px-5 py-4 text-white sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-base font-black tracking-tight">
                C
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-sm font-bold tracking-wide">
                  Cocoora Desk
                  <Sparkles className="h-3.5 w-3.5 text-[#9FC2CF]" />
                </p>
                <p className="text-[11px] text-[#CFE0E8]">
                  Prenotazione rapida · 3 click
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleEscape}
              disabled={isBooking}
              className="rounded-lg border border-white/15 bg-white/5 p-2 text-[#CFE0E8] transition hover:bg-white/15 hover:text-white disabled:opacity-50"
              aria-label="Chiudi"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[10px] font-medium text-[#CFE0E8]">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-0.5">
              <Zap className="h-3 w-3 text-[#9FC2CF]" />
              Flusso segreteria
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-0.5">
              <Clock className="h-3 w-3 text-[#9FC2CF]" />
              Lun–Ven 8:00–20:00 · Sab 9:00–14:00
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-0.5">
              <UserRound className="h-3 w-3 text-[#9FC2CF]" />
              Percorsi Salute · Tariffa Extra STP
            </span>
          </div>
        </header>

        {/* STEP INDICATOR */}
        {!success && (
          <nav
            aria-label="Passaggi prenotazione"
            className="grid shrink-0 grid-cols-3 gap-1 border-b border-[#EAF1F5] bg-[#F4F8FA] px-3 py-2.5"
          >
            {STEPS.map((item) => {
              const completed = step > item.step;
              const current = step === item.step;
              const locked =
                (item.step >= 2 && !patient) || (item.step >= 3 && !service);

              return (
                <button
                  key={item.step}
                  type="button"
                  disabled={locked}
                  onClick={() => goToStep(item.step)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-2 py-1.5 text-left transition",
                    current && "bg-white shadow-sm ring-1 ring-[#1C4A5C]/15",
                    !current && !locked && "hover:bg-white/70",
                    locked && "cursor-not-allowed opacity-45"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                      completed || current
                        ? "bg-[#1C4A5C] text-white"
                        : "border border-[#80A1B2]/50 bg-white text-[#1C4A5C]"
                    )}
                  >
                    {completed ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      item.step
                    )}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block truncate text-[11px] font-bold",
                        current ? "text-[#03354B]" : "text-[#3D3D3C]/75"
                      )}
                    >
                      {item.label}
                    </span>
                    <span className="hidden truncate text-[9px] text-[#3D3D3C]/50 sm:block">
                      {item.hint}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>
        )}

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {success ? (
            <div className="pb-4">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                <h3 className="mt-3 text-lg font-bold text-[#03354B]">
                  Appuntamento confermato
                </h3>
                <p className="mt-1 text-xs text-[#3D3D3C]/75">
                  {success.patient.lastName} {success.patient.firstName} ·{" "}
                  {success.service.name}
                </p>
                <p className="mt-1 inline-flex items-center gap-1 rounded-full border border-[#80A1B2]/40 bg-[#F4F8FA] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#1C4A5C]">
                  ID {success.appointmentId}
                </p>
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border border-[#80A1B2]/35">
                <div className="grid grid-cols-2 gap-px bg-[#EAF1F5]">
                  <div className="bg-white p-3">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#80A1B2]">
                      Data
                    </p>
                    <p className="mt-0.5 text-xs font-bold capitalize text-[#03354B]">
                      {confirmedDate}
                    </p>
                  </div>
                  <div className="bg-white p-3">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#80A1B2]">
                      Orario
                    </p>
                    <p className="mt-0.5 text-xs font-bold text-[#03354B]">
                      {formatTime(success.slot.start)} –{" "}
                      {formatTime(success.slot.end)}
                    </p>
                  </div>
                  <div className="bg-white p-3">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#80A1B2]">
                      Specialista
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-[#03354B]">
                      <Stethoscope className="h-3 w-3 text-[#80A1B2]" />
                      {success.slot.doctorName ?? "Specialista Cocoora"}
                    </p>
                  </div>
                  <div className="bg-white p-3">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#80A1B2]">
                      Stanza
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-[#03354B]">
                      <DoorOpen className="h-3 w-3 text-[#80A1B2]" />
                      {success.slot.roomName ?? "Da assegnare"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <CoverageBadge
                  isCovered={success.isCovered}
                  priceCents={success.service.priceCents}
                  vatRegime={success.service.vatRegime}
                  billingEntity={success.service.billingEntity}
                />
              </div>

              <div className="mt-3 flex items-start gap-2 rounded-xl border border-[#80A1B2]/35 bg-[#F4F8FA] px-3 py-2.5">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#1C4A5C]" />
                <p className="text-[11px] text-[#3D3D3C]/80">
                  {success.whatsapp
                    ? "Conferma WhatsApp programmata al paziente, con promemoria il giorno prima dell'appuntamento."
                    : "Conferma WhatsApp non inviata: il paziente è stato informato verbalmente in reception."}
                </p>
              </div>

              {isMinor && (
                <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                  <p className="text-[11px] text-amber-900">
                    Paziente minorenne: doppio consenso dei genitori acquisito.
                    {delegateConsent
                      ? " Delega dell'accompagnatore registrata agli atti."
                      : " Nessuna delega per accompagnatori terzi."}
                  </p>
                </div>
              )}

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={handleAnotherBooking}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#1C4A5C] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#03354B]"
                >
                  <CalendarDays className="h-4 w-4" />
                  Prenota un altro appuntamento
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#80A1B2]/50 bg-white px-4 py-2.5 text-xs font-bold text-[#1C4A5C] transition hover:bg-[#EAF1F5]"
                >
                  Chiudi
                </button>
              </div>
            </div>
          ) : (
            <>
              {step === 1 && (
                <section className="space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1C4A5C] text-[11px] font-bold text-white">
                      1
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-[#03354B]">
                        Paziente
                      </h3>
                      <p className="text-[11px] text-[#3D3D3C]/70">
                        Cerca per numero di telefono, cognome o codice fiscale.
                        Premi Invio per selezionare il primo risultato.
                      </p>
                    </div>
                  </div>

                  <PatientSearch
                    selectedPatient={patient}
                    onSelect={handlePatientSelect}
                    inputRef={patientInputRef}
                    autoFocus
                  />

                  {patient && (
                    <div className="flex items-start gap-2 rounded-xl border border-[#80A1B2]/35 bg-[#F4F8FA] px-3 py-2.5">
                      <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-[#1C4A5C]" />
                      <p className="text-[11px] text-[#3D3D3C]/80">
                        Paziente selezionato. Premi Invio o Continua per passare
                        alla scelta della prestazione.
                      </p>
                    </div>
                  )}
                </section>
              )}

              {step === 2 && (
                <section className="space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1C4A5C] text-[11px] font-bold text-white">
                      2
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-[#03354B]">
                        Prestazione
                      </h3>
                      <p className="text-[11px] text-[#3D3D3C]/70">
                        Cerca per nome o codice COC, oppure usa una delle voci
                        rapide.
                      </p>
                    </div>
                  </div>

                  <ServiceSearch
                    selectedService={service}
                    onSelect={handleServiceSelect}
                    inputRef={serviceInputRef}
                    autoFocus
                  />

                  {service && (
                    <CoverageBadge
                      isCovered={isCovered}
                      priceCents={service.priceCents}
                      vatRegime={service.vatRegime}
                      billingEntity={service.billingEntity}
                    />
                  )}
                </section>
              )}

              {step === 3 && (
                <section className="space-y-4">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1C4A5C] text-[11px] font-bold text-white">
                      3
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-[#03354B]">
                        Slot libero
                      </h3>
                      <p className="text-[11px] text-[#3D3D3C]/70">
                        Scegli l&apos;orario, verifica medico e stanza, poi
                        conferma l&apos;appuntamento.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#80A1B2]/35 bg-[#F4F8FA] p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <UserRound className="h-3.5 w-3.5 shrink-0 text-[#80A1B2]" />
                        <p className="truncate text-[11px] font-semibold text-[#03354B]">
                          {patient?.lastName} {patient?.firstName}
                        </p>
                        <span className="text-[#80A1B2]">·</span>
                        <Stethoscope className="h-3.5 w-3.5 shrink-0 text-[#80A1B2]" />
                        <p className="truncate text-[11px] text-[#3D3D3C]/80">
                          {service?.name}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => goToStep(2)}
                        className="text-[10px] font-bold text-[#1C4A5C] underline decoration-[#80A1B2] underline-offset-2"
                      >
                        Modifica
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <label className="min-w-[180px] flex-1 space-y-1">
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-[#1C4A5C]">
                        <CalendarDays className="h-3 w-3" />
                        Data appuntamento
                      </span>
                      <input
                        type="date"
                        value={dateStr}
                        min={todayInRome()}
                        onChange={(event) => {
                          setDateStr(event.target.value || todayInRome());
                          setSelectedSlot(null);
                          setBookingError(null);
                          setSlotTaken(false);
                        }}
                        className="h-10 w-full rounded-lg border border-[#80A1B2]/45 bg-white px-3 text-sm font-semibold text-[#03354B] outline-none transition focus:border-[#1C4A5C] focus:ring-2 focus:ring-[#1C4A5C]/10"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => void loadSlots(true)}
                      disabled={isLoadingSlots}
                      className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#80A1B2]/50 bg-white px-3 text-[11px] font-bold text-[#1C4A5C] transition hover:bg-[#EAF1F5] disabled:opacity-50"
                    >
                      <RefreshCw
                        className={cn(
                          "h-3.5 w-3.5",
                          isLoadingSlots && "animate-spin"
                        )}
                      />
                      Ricarica
                    </button>
                  </div>

                  <p className="text-[10px] capitalize text-[#3D3D3C]/60">
                    {selectedDateLabel}
                  </p>

                  <SlotList
                    slots={slots}
                    selectedSlot={selectedSlot}
                    onSelect={(slot) => {
                      setSelectedSlot(slot);
                      setBookingError(null);
                      setSlotTaken(false);
                    }}
                    isLoading={isLoadingSlots}
                    error={slotError}
                    onRefresh={() => void loadSlots(true)}
                    coverageOverride={isCovered}
                  />

                  {slotTaken && (
                    <div
                      role="status"
                      className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5"
                    >
                      <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                      <p className="text-[11px] text-amber-900">
                        Lo slot era appena stato occupato. La lista è stata
                        ricaricata automaticamente: scegli un nuovo orario senza
                        interrompere la prenotazione.
                      </p>
                    </div>
                  )}

                  {bookingError && !slotTaken && (
                    <div
                      role="alert"
                      className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5"
                    >
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" />
                      <p className="text-[11px] text-red-800">{bookingError}</p>
                    </div>
                  )}

                  {selectedSlot && (
                    <>
                      <div className="rounded-xl border border-[#1C4A5C]/20 bg-[#F4F8FA] p-3">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-[#80A1B2]">
                          Slot selezionato
                        </p>
                        <p className="mt-0.5 text-sm font-bold text-[#03354B]">
                          {formatTime(selectedSlot.start)} –{" "}
                          {formatTime(selectedSlot.end)}
                        </p>
                        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#3D3D3C]/75">
                          <span className="inline-flex items-center gap-1">
                            <Stethoscope className="h-3 w-3 text-[#80A1B2]" />
                            {selectedSlot.doctorName ?? "Specialista Cocoora"}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <DoorOpen className="h-3 w-3 text-[#80A1B2]" />
                            {selectedSlot.roomName ?? "Da assegnare"}
                          </span>
                        </p>
                      </div>

                      <CoverageBadge
                        isCovered={isCovered}
                        priceCents={service?.priceCents ?? selectedSlot.priceCents}
                        vatRegime={service?.vatRegime ?? selectedSlot.vatRegime}
                        billingEntity={
                          service?.billingEntity ?? selectedSlot.billingEntity
                        }
                      />

                      <div className="flex items-start justify-between gap-3 rounded-xl border border-[#80A1B2]/35 bg-white p-3">
                        <div className="flex items-start gap-2.5">
                          <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#1C4A5C]" />
                          <div>
                            <p className="text-[11px] font-bold text-[#03354B]">
                              Conferma WhatsApp
                            </p>
                            <p className="mt-0.5 text-[10px] text-[#3D3D3C]/70">
                              Invia conferma e promemoria il giorno prima
                              dell&apos;appuntamento.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={whatsappConfirm}
                          onClick={() => setWhatsappConfirm((value) => !value)}
                          className={cn(
                            "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
                            whatsappConfirm
                              ? "bg-[#1C4A5C]"
                              : "bg-slate-300"
                          )}
                        >
                          <span
                            className={cn(
                              "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
                              whatsappConfirm
                                ? "translate-x-6"
                                : "translate-x-1"
                            )}
                          />
                        </button>
                      </div>

                      {isMinor && (
                        <div className="rounded-xl border border-amber-300 bg-amber-50 p-3">
                          <div className="flex items-start gap-2.5">
                            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-bold text-amber-900">
                                Paziente minorenne ({age} anni)
                              </p>
                              <p className="mt-0.5 text-[10px] text-amber-800">
                                Per i pazienti minorenni è obbligatorio
                                acquisire il doppio consenso firmato da entrambi
                                i genitori. Registra anche l&apos;eventuale
                                delega per nonni o tate.
                              </p>

                              <label className="mt-2 flex cursor-pointer items-start gap-2 rounded-lg bg-white/70 p-2">
                                <input
                                  type="checkbox"
                                  checked={minorConsent}
                                  onChange={(event) => {
                                    setMinorConsent(event.target.checked);
                                    setBookingError(null);
                                  }}
                                  className="mt-0.5 h-4 w-4 accent-[#1C4A5C]"
                                />
                                <span className="text-[10px] font-semibold text-amber-950">
                                  Doppio consenso firmato acquisito (madre e
                                  padre)
                                </span>
                              </label>

                              <label className="mt-1.5 flex cursor-pointer items-start gap-2 rounded-lg bg-white/70 p-2">
                                <input
                                  type="checkbox"
                                  checked={delegateConsent}
                                  onChange={(event) =>
                                    setDelegateConsent(event.target.checked)
                                  }
                                  className="mt-0.5 h-4 w-4 accent-[#1C4A5C]"
                                />
                                <span className="text-[10px] font-semibold text-amber-950">
                                  Delega accompagnatore acquisita (se presente)
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                      )}

                      {patient && age === null && (
                        <p className="rounded-lg border border-[#80A1B2]/35 bg-[#F4F8FA] px-3 py-2 text-[10px] text-[#3D3D3C]/70">
                          Data di nascita non disponibile in anagrafica: verifica
                          manualmente se il paziente è minorenne prima di
                          confermare.
                        </p>
                      )}
                    </>
                  )}
                </section>
              )}
            </>
          )}
        </div>

        {/* FOOTER AZIONI */}
        {!success && (
          <footer className="shrink-0 border-t border-[#EAF1F5] bg-white px-5 py-3 sm:px-6">
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="hidden flex-wrap items-center gap-2 text-[9px] font-medium text-[#3D3D3C]/60 sm:flex">
                <span className="inline-flex items-center gap-1">
                  <kbd className="rounded border border-[#80A1B2]/40 bg-[#F4F8FA] px-1 py-0.5 font-semibold text-[#1C4A5C]">
                    /
                  </kbd>
                  Paziente
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="rounded border border-[#80A1B2]/40 bg-[#F4F8FA] px-1 py-0.5 font-semibold text-[#1C4A5C]">
                    S
                  </kbd>
                  Prestazione
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="rounded border border-[#80A1B2]/40 bg-[#F4F8FA] px-1 py-0.5 font-semibold text-[#1C4A5C]">
                    Invio
                  </kbd>
                  Conferma
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="rounded border border-[#80A1B2]/40 bg-[#F4F8FA] px-1 py-0.5 font-semibold text-[#1C4A5C]">
                    Esc
                  </kbd>
                  Chiudi
                </span>
              </div>

              <div className="flex items-center justify-end gap-2">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => goToStep((step - 1) as BookingStep)}
                    disabled={isBooking}
                    className="inline-flex items-center gap-1 rounded-xl border border-[#80A1B2]/50 bg-white px-3 py-2.5 text-xs font-bold text-[#1C4A5C] transition hover:bg-[#EAF1F5] disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Indietro
                  </button>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => void handleConfirm()}
                    disabled={!canContinue}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#1C4A5C] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#03354B] disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    Continua
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => void handleConfirm()}
                    disabled={!canConfirm}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#1C4A5C] px-4 py-2.5 text-xs font-bold text-white shadow-[0_10px_24px_-10px_rgba(28,74,92,0.65)] transition hover:bg-[#03354B] disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {isBooking ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Conferma Appuntamento (Invio)
                  </button>
                )}
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}
