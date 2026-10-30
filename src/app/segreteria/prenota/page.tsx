"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  Clock,
  DoorOpen,
  Plus,
  Sparkles,
  Stethoscope,
  UserRound,
  Users,
  Zap,
} from "lucide-react";
import {
  BookingDrawer,
  type BookingDrawerBookedPayload,
} from "@/components/segreteria/booking/BookingDrawer";
import { cn } from "@/lib/utils";

type AgendaStatus = "confermato" | "arrivato" | "in_visita";

type AgendaItem = {
  id: string;
  time: string;
  patient: string;
  service: string;
  doctor: string;
  status: AgendaStatus;
  roomId: string;
  covered: boolean;
};

const STUDIOS = [
  { id: "studio-1", name: "Studio 1", focus: "Odontoiatria" },
  { id: "studio-2", name: "Studio 2", focus: "Medicina Estetica · Jolly" },
  { id: "studio-3", name: "Studio 3", focus: "Medicina Estetica · Laser" },
  { id: "studio-4", name: "Studio 4", focus: "Oculistica" },
  { id: "sala-opt", name: "Sala OPT", focus: "Ortopantomografia" },
];

const INITIAL_AGENDA: AgendaItem[] = [
  {
    id: "appt-001",
    time: "08:30",
    patient: "Maria Esposito",
    service: "Visita Odontoiatrica",
    doctor: "Dr. Antonio Sorrentino",
    status: "in_visita",
    roomId: "studio-1",
    covered: true,
  },
  {
    id: "appt-002",
    time: "10:00",
    patient: "Salvatore Ferraro",
    service: "Igiene Orale Professionale",
    doctor: "Dr.ssa Elisa Russo",
    status: "confermato",
    roomId: "studio-1",
    covered: false,
  },
  {
    id: "appt-003",
    time: "11:30",
    patient: "Luca Vitale",
    service: "Allineatori Trasparenti - Prima Visita",
    doctor: "Dr.ssa Elisa Russo",
    status: "confermato",
    roomId: "studio-1",
    covered: true,
  },
  {
    id: "appt-004",
    time: "09:00",
    patient: "Giovanni Russo",
    service: "Visita Cardiologica",
    doctor: "Dr. Marco Esposito",
    status: "arrivato",
    roomId: "studio-2",
    covered: true,
  },
  {
    id: "appt-005",
    time: "10:30",
    patient: "Francesca Greco",
    service: "Visita Dermatologica",
    doctor: "Dr.ssa Giulia Ferraro",
    status: "confermato",
    roomId: "studio-2",
    covered: true,
  },
  {
    id: "appt-006",
    time: "12:00",
    patient: "Anna De Luca",
    service: "Visita Pediatrica",
    doctor: "Dr.ssa Anna Romano",
    status: "confermato",
    roomId: "studio-2",
    covered: true,
  },
  {
    id: "appt-007",
    time: "09:30",
    patient: "Giulia Romano",
    service: "Laser CO2 Frazionato",
    doctor: "Dr.ssa Paola Ruggiero",
    status: "in_visita",
    roomId: "studio-3",
    covered: false,
  },
  {
    id: "appt-008",
    time: "11:00",
    patient: "Antonio Marino",
    service: "Criolipolisi",
    doctor: "Dr.ssa Chiara Del Prete",
    status: "confermato",
    roomId: "studio-3",
    covered: false,
  },
  {
    id: "appt-009",
    time: "10:00",
    patient: "Rosa Bianchi",
    service: "Visita Oculistica",
    doctor: "Dr. Luca Costa",
    status: "confermato",
    roomId: "studio-4",
    covered: true,
  },
];

const STATUS_META: Record<
  AgendaStatus,
  { label: string; badge: string; border: string; dot: string }
> = {
  confermato: {
    label: "Confermato",
    badge: "border-[#80A1B2]/45 bg-[#EEF6FA] text-[#1C4A5C]",
    border: "border-l-[#80A1B2]",
    dot: "bg-[#80A1B2]",
  },
  arrivato: {
    label: "In attesa",
    badge: "border-amber-200 bg-amber-50 text-amber-800",
    border: "border-l-amber-400",
    dot: "bg-amber-500",
  },
  in_visita: {
    label: "In visita",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-800",
    border: "border-l-emerald-500",
    dot: "bg-emerald-500",
  },
};

const timeFormatter = new Intl.DateTimeFormat("it-IT", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Rome",
});

export default function PrenotaPage() {
  const [open, setOpen] = useState(true);
  const [agenda, setAgenda] = useState<AgendaItem[]>(INITIAL_AGENDA);
  const [lastBooked, setLastBooked] = useState<AgendaItem | null>(null);

  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("it-IT", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "Europe/Rome",
      }).format(new Date()),
    []
  );

  const counts = useMemo(() => {
    const inProgress = agenda.filter(
      (item) => item.status === "in_visita" || item.status === "arrivato"
    ).length;
    const confirmed = agenda.filter(
      (item) => item.status === "confermato"
    ).length;
    const extra = agenda.filter((item) => !item.covered).length;

    return {
      total: agenda.length,
      inProgress,
      confirmed,
      extra,
    };
  }, [agenda]);

  function handleBooked(payload: BookingDrawerBookedPayload) {
    const roomId = STUDIOS.some((studio) => studio.id === payload.slot.roomId)
      ? (payload.slot.roomId as string)
      : "studio-2";

    const time = timeFormatter.format(new Date(payload.slot.start));

    const item: AgendaItem = {
      id: payload.appointmentId,
      time,
      patient: `${payload.patient.lastName} ${payload.patient.firstName}`,
      service: payload.service.name,
      doctor: payload.slot.doctorName ?? "Specialista Cocoora",
      status: "confermato",
      roomId,
      covered: Boolean(
        payload.service.isCoveredByMembership &&
          (payload.patient.membershipId || payload.patient.pathName)
      ),
    };

    setAgenda((previous) =>
      [...previous, item].sort((left, right) =>
        left.time.localeCompare(right.time)
      )
    );
    setLastBooked(item);
  }

  return (
    <div className="min-h-screen bg-[#F4F8FA] text-[#3D3D3C]">
      {/* TOP BAR */}
      <header className="sticky top-0 z-40 border-b border-[#80A1B2]/25 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/segreteria"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#80A1B2]/45 bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#1C4A5C] transition hover:border-[#1C4A5C] hover:bg-[#EAF1F5]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Segreteria
            </Link>

            <div className="hidden h-6 w-px bg-[#80A1B2]/30 sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#03354B] text-sm font-black text-white">
                C
              </div>
              <div>
                <p className="text-sm font-bold leading-tight text-[#03354B]">
                  Cocoora Desk
                </p>
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#80A1B2]">
                  Prenotazione rapida
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-800 md:inline-flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Desk attivo
            </span>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1C4A5C] px-3 py-2 text-xs font-bold text-white shadow-[0_10px_24px_-12px_rgba(28,74,92,0.8)] transition hover:bg-[#03354B]"
            >
              <CalendarPlus className="h-4 w-4" />
              Nuova prenotazione
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* INTESTAZIONE PAGINA */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#80A1B2]">
              <Zap className="h-3 w-3" />
              Flusso a 3 click
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#03354B] sm:text-3xl">
              Agenda del giorno
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-xs capitalize text-[#3D3D3C]/70">
              <CalendarDays className="h-3.5 w-3.5 text-[#80A1B2]" />
              {todayLabel}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-[#3D3D3C]/65">
            <span className="inline-flex items-center gap-1 rounded-full border border-[#80A1B2]/35 bg-white px-2 py-1">
              <Clock className="h-3 w-3 text-[#80A1B2]" />
              8:00–20:00 · Sab 9:00–14:00
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-[#80A1B2]/35 bg-white px-2 py-1">
              <Users className="h-3 w-3 text-[#80A1B2]" />
              4 studi + OPT
            </span>
          </div>
        </div>

        {lastBooked && (
          <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-emerald-900">
                Prenotazione registrata: {lastBooked.patient}
              </p>
              <p className="mt-0.5 text-[11px] text-emerald-800">
                {lastBooked.time} · {lastBooked.service} ·{" "}
                {lastBooked.doctor} ·{" "}
                {STUDIOS.find((studio) => studio.id === lastBooked.roomId)?.name}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLastBooked(null)}
              className="rounded-md px-2 py-1 text-[10px] font-bold text-emerald-800 transition hover:bg-emerald-100"
            >
              Chiudi
            </button>
          </div>
        )}

        {/* KPI AGENDA */}
        <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          <StatCard
            label="Appuntamenti oggi"
            value={counts.total}
            hint="Agenda aggregata"
            icon={<CalendarDays className="h-4 w-4" />}
          />
          <StatCard
            label="In studio"
            value={counts.inProgress}
            hint="Accolti e in visita"
            icon={<Stethoscope className="h-4 w-4" />}
            accent="emerald"
          />
          <StatCard
            label="Da accogliere"
            value={counts.confirmed}
            hint="Confermati in attesa"
            icon={<Clock className="h-4 w-4" />}
            accent="amber"
          />
          <StatCard
            label="Tariffa Extra STP"
            value={counts.extra}
            hint="Fuori Percorso Salute"
            icon={<Sparkles className="h-4 w-4" />}
            accent="blue"
          />
        </div>

        {/* AGENDA 4 STUDI + SALA OPT */}
        <section className="mt-5 rounded-2xl border border-[#80A1B2]/30 bg-white p-3 shadow-[0_18px_50px_-30px_rgba(3,53,75,0.35)] sm:p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
            <div>
              <h2 className="text-sm font-bold text-[#03354B]">
                Agenda del giorno per studio
              </h2>
              <p className="text-[10px] text-[#3D3D3C]/60">
                Incrocio sale, specialisti e prestazioni in tempo reale.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[9px] font-medium text-[#3D3D3C]/65">
              {(Object.keys(STATUS_META) as AgendaStatus[]).map((status) => (
                <span key={status} className="inline-flex items-center gap-1">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      STATUS_META[status].dot
                    )}
                  />
                  {STATUS_META[status].label}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {STUDIOS.map((studio) => {
              const studioItems = agenda.filter(
                (item) => item.roomId === studio.id
              );

              return (
                <div
                  key={studio.id}
                  className="flex min-h-[260px] flex-col rounded-xl border border-[#80A1B2]/25 bg-[#F4F8FA]/70"
                >
                  <div className="border-b border-[#80A1B2]/20 px-3 py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="flex items-center gap-1.5 text-xs font-bold text-[#03354B]">
                        <DoorOpen className="h-3.5 w-3.5 text-[#80A1B2]" />
                        {studio.name}
                      </p>
                      <span className="rounded-full border border-[#80A1B2]/35 bg-white px-1.5 py-0.5 text-[9px] font-bold text-[#1C4A5C]">
                        {studioItems.length}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-[#80A1B2]">
                      {studio.focus}
                    </p>
                  </div>

                  <div className="flex-1 space-y-2 p-2.5">
                    {studioItems.length === 0 ? (
                      <div className="flex h-full min-h-[120px] items-center justify-center rounded-lg border border-dashed border-[#80A1B2]/40 bg-white/60 px-3 text-center">
                        <p className="text-[10px] text-[#3D3D3C]/55">
                          Nessun appuntamento in agenda
                        </p>
                      </div>
                    ) : (
                      studioItems.map((item) => {
                        const meta = STATUS_META[item.status];

                        return (
                          <div
                            key={item.id}
                            className={cn(
                              "rounded-lg border border-[#80A1B2]/25 border-l-4 bg-white p-2.5 shadow-sm",
                              meta.border
                            )}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#03354B]">
                                <Clock className="h-3 w-3 text-[#80A1B2]" />
                                {item.time}
                              </span>
                              <span
                                className={cn(
                                  "rounded-full border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide",
                                  meta.badge
                                )}
                              >
                                {meta.label}
                              </span>
                            </div>

                            <p className="mt-1.5 truncate text-[11px] font-bold text-[#03354B]">
                              {item.patient}
                            </p>
                            <p className="truncate text-[10px] text-[#3D3D3C]/70">
                              {item.service}
                            </p>
                            <div className="mt-1 flex items-center justify-between gap-1">
                              <p className="truncate text-[9px] text-[#3D3D3C]/55">
                                {item.doctor}
                              </p>
                              <span
                                className={cn(
                                  "shrink-0 rounded px-1 py-0.5 text-[8px] font-bold",
                                  item.covered
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-[#EEF6FA] text-[#1C4A5C]"
                                )}
                              >
                                {item.covered ? "Percorso" : "Extra STP"}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="m-2.5 mt-0 inline-flex items-center justify-center gap-1 rounded-lg border border-dashed border-[#80A1B2]/50 bg-white/70 px-2 py-1.5 text-[10px] font-bold text-[#1C4A5C] transition hover:border-[#1C4A5C] hover:bg-white"
                  >
                    <Plus className="h-3 w-3" />
                    Prenota in {studio.name}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* CALLOUT PRENOTAZIONE RAPIDA */}
        <section className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#1C4A5C]/15 bg-[#03354B] p-4 text-white">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#9FC2CF]">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold">
                Prenota in 3 click, senza interrompere l&apos;accoglienza
              </p>
              <p className="mt-0.5 text-[11px] text-[#CFE0E8]">
                Paziente → Prestazione → Slot libero. Il doppio consenso per i
                minori è richiesto automaticamente.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden items-center gap-1.5 text-[9px] text-[#CFE0E8] lg:flex">
              <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 font-semibold text-white">
                /
              </kbd>
              Paziente
              <kbd className="ml-1.5 rounded border border-white/20 bg-white/10 px-1.5 py-0.5 font-semibold text-white">
                S
              </kbd>
              Prestazione
              <kbd className="ml-1.5 rounded border border-white/20 bg-white/10 px-1.5 py-0.5 font-semibold text-white">
                Invio
              </kbd>
              Conferma
              <kbd className="ml-1.5 rounded border border-white/20 bg-white/10 px-1.5 py-0.5 font-semibold text-white">
                Esc
              </kbd>
              Chiudi
            </div>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2.5 text-xs font-bold text-[#03354B] transition hover:bg-[#EAF1F5]"
            >
              <CalendarPlus className="h-4 w-4" />
              Apri prenotazione rapida
            </button>
          </div>
        </section>

        <p className="mt-4 flex flex-wrap items-center gap-1.5 text-[10px] text-[#3D3D3C]/55">
          <UserRound className="h-3 w-3" />
          I pazienti minorenni richiedono doppio consenso firmato da entrambi i
          genitori e delega per eventuali accompagnatori.
        </p>
      </main>

      <BookingDrawer
        open={open}
        onClose={() => setOpen(false)}
        onBooked={handleBooked}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon,
  accent = "teal",
}: {
  label: string;
  value: number;
  hint: string;
  icon: React.ReactNode;
  accent?: "teal" | "emerald" | "amber" | "blue";
}) {
  const accentClass =
    accent === "emerald"
      ? "bg-emerald-50 text-emerald-700"
      : accent === "amber"
        ? "bg-amber-50 text-amber-700"
        : accent === "blue"
          ? "bg-[#EEF6FA] text-[#1C4A5C]"
          : "bg-[#EAF1F5] text-[#1C4A5C]";

  return (
    <div className="rounded-xl border border-[#80A1B2]/30 bg-white p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-[#80A1B2]">
            {label}
          </p>
          <p className="mt-0.5 text-2xl font-bold leading-none text-[#03354B]">
            {value}
          </p>
          <p className="mt-1 text-[9px] text-[#3D3D3C]/55">{hint}</p>
        </div>
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            accentClass
          )}
        >
          {icon}
        </span>
      </div>
    </div>
  );
}
