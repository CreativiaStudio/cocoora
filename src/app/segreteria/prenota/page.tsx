"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Ban,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  DoorOpen,
  Plus,
  RefreshCw,
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
import {
  getLiveAgendaForDateAction,
  type LiveAgendaItem,
  type LiveAgendaStatus,
} from "@/app/segreteria/prenota/actions";
import { cn } from "@/lib/utils";

const STUDIOS = [
  {
    id: "studio-1",
    name: "Studio 1",
    focus: "Odontoiatria & Ortognatodonzia",
    specialists: "Dott.ssa Elisa Russo · Dr. Raffaele D'Alessio",
  },
  {
    id: "studio-2",
    name: "Studio 2",
    focus: "Carbossiterapia & Dermatologia",
    specialists: "Patrizia Scorzelli · Dott.ssa Mirella D'Andrea",
  },
  {
    id: "studio-3",
    name: "Studio 3",
    focus: "Chirurgia Plastica, Estetica & Psicologia",
    specialists: "Errico · F. D'Andrea · Riccardi · Totaro",
  },
  {
    id: "studio-4",
    name: "Studio 4",
    focus: "Ginecologia, Cardio, Eco, Seno & Oculistica",
    specialists: "Poppiti · Stillo · Buono · Pontillo · Toro",
  },
  {
    id: "sala-filtro",
    name: "Sala Filtro",
    focus: "Nutrizione Clinica",
    specialists: "Dott.ssa Jessica De Ceglie",
  },
];

const HOURLY_GRID = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

const STATUS_META: Record<
  LiveAgendaStatus,
  { label: string; badge: string; border: string; dot: string }
> = {
  confermato: {
    label: "Confermato",
    badge: "border-[#80A1B2]/45 bg-[#EEF6FA] text-[#1C4A5C]",
    border: "border-l-[#80A1B2]",
    dot: "bg-[#80A1B2]",
  },
  in_attesa: {
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
  completato: {
    label: "Conclusa",
    badge: "border-slate-200 bg-slate-100 text-slate-700",
    border: "border-l-slate-400",
    dot: "bg-slate-400",
  },
};

const timeFormatter = new Intl.DateTimeFormat("it-IT", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Rome",
});

function getTodayIso(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function shiftIsoDate(iso: string, deltaDays: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  date.setUTCDate(date.getUTCDate() + deltaDays);
  return date.toISOString().slice(0, 10);
}

function isWeekendIso(iso: string): boolean {
  const [y, m, d] = iso.split("-").map(Number);
  const jsDay = new Date(Date.UTC(y, m - 1, d, 12, 0, 0)).getUTCDay();
  return jsDay === 0 || jsDay === 6;
}

function nextMondayIso(iso: string): string {
  let cursor = iso;
  while (isWeekendIso(cursor)) {
    cursor = shiftIsoDate(cursor, 1);
  }
  return cursor;
}

function formatItalianDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  return new Intl.DateTimeFormat("it-IT", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Rome",
  }).format(date);
}

export default function PrenotaPage() {
  const [open, setOpen] = useState(false);
  const todayIso = useMemo(() => getTodayIso(), []);
  const [selectedDate, setSelectedDate] = useState<string>(todayIso);
  const [agendaItems, setAgendaItems] = useState<LiveAgendaItem[]>([]);
  const [loadingAgenda, setLoadingAgenda] = useState<boolean>(true);
  const [lastBooked, setLastBooked] = useState<LiveAgendaItem | null>(null);

  const isToday = selectedDate === todayIso;
  const isClosedWeekend = useMemo(
    () => isWeekendIso(selectedDate),
    [selectedDate]
  );

  const selectedDateLabel = useMemo(
    () => formatItalianDate(selectedDate),
    [selectedDate]
  );

  const fetchLiveAgenda = useCallback(async (dateToLoad: string) => {
    setLoadingAgenda(true);
    try {
      const liveRows = await getLiveAgendaForDateAction(dateToLoad);
      setAgendaItems(liveRows);
    } catch {
      setAgendaItems([]);
    } finally {
      setLoadingAgenda(false);
    }
  }, []);

  useEffect(() => {
    void fetchLiveAgenda(selectedDate);
  }, [selectedDate, fetchLiveAgenda]);

  const counts = useMemo(() => {
    const inProgress = agendaItems.filter(
      (item) => item.status === "in_visita" || item.status === "in_attesa"
    ).length;
    const confirmed = agendaItems.filter(
      (item) => item.status === "confermato"
    ).length;
    const extra = agendaItems.filter((item) => !item.covered).length;

    return {
      total: agendaItems.length,
      inProgress,
      confirmed,
      extra,
    };
  }, [agendaItems]);

  function handleBooked(payload: BookingDrawerBookedPayload) {
    const rawRoom = payload.slot.roomId ?? "studio-1";
    const roomId = STUDIOS.some((studio) => studio.id === rawRoom)
      ? rawRoom
      : "studio-1";

    const startObj = new Date(payload.slot.start);
    const endObj = new Date(payload.slot.end);
    const time = timeFormatter.format(startObj);
    const endTime = timeFormatter.format(endObj);

    const targetDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Rome",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(startObj);

    const item: LiveAgendaItem = {
      id: payload.appointmentId,
      time,
      endTime,
      patient: `${payload.patient.lastName} ${payload.patient.firstName}`,
      patientId: payload.patient.id,
      service: payload.service.name,
      doctor: payload.slot.doctorName ?? "Specialista Cocoora",
      status: "confermato",
      roomId,
      roomName:
        STUDIOS.find((studio) => studio.id === roomId)?.name ?? "Studio 1",
      covered: Boolean(
        payload.service.isCoveredByMembership &&
          (payload.patient.membershipId || payload.patient.pathName)
      ),
    };

    setLastBooked(item);

    if (targetDate !== selectedDate) {
      setSelectedDate(targetDate);
    } else {
      setAgendaItems((previous) =>
        [...previous.filter((p) => p.id !== item.id), item].sort((l, r) =>
          l.time.localeCompare(r.time)
        )
      );
      void fetchLiveAgenda(targetDate);
    }
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
              Desk Visite di Oggi
            </Link>

            <div className="hidden h-6 w-px bg-[#80A1B2]/30 sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#03354B] p-1.5 shadow-xs">
                <Image
                  src="/cocoora-symbol.png"
                  alt="Cocoora"
                  width={24}
                  height={24}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight text-[#03354B]">
                  Cocoora Desk
                </p>
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#80A1B2]">
                  Prenotazione rapida · Sincronizzata con Supabase
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-800 md:inline-flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Agenda Live
            </span>

            <button
              type="button"
              onClick={() => void fetchLiveAgenda(selectedDate)}
              disabled={loadingAgenda}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#80A1B2]/45 bg-white px-2.5 py-2 text-xs font-bold text-[#1C4A5C] transition hover:bg-[#EAF1F5] disabled:opacity-50"
              title="Ricarica appuntamenti reali da Supabase"
            >
              <RefreshCw
                className={cn("h-3.5 w-3.5", loadingAgenda && "animate-spin")}
              />
              <span className="hidden sm:inline">Aggiorna</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (isClosedWeekend) {
                  setSelectedDate(nextMondayIso(selectedDate));
                }
                setOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1C4A5C] px-3 py-2 text-xs font-bold text-white shadow-[0_10px_24px_-12px_rgba(28,74,92,0.8)] transition hover:bg-[#03354B]"
            >
              <CalendarPlus className="h-4 w-4" />
              Nuova prenotazione
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* INTESTAZIONE PAGINA CON SELETTORE DATA */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#80A1B2]/25 bg-white p-4 shadow-xs sm:p-5">
          <div>
            <div className="flex items-center gap-2">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#80A1B2]">
                <Zap className="h-3 w-3 text-[#1C4A5C]" />
                Flusso a 3 click · Slot da 1 ora
              </p>
              {isToday && (
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  Oggi
                </span>
              )}
              {isClosedWeekend && (
                <span className="rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                  Centro Chiuso
                </span>
              )}
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#03354B] sm:text-3xl">
              Agenda del giorno
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold capitalize text-[#1C4A5C]">
              <CalendarDays className="h-3.5 w-3.5 text-[#80A1B2]" />
              {selectedDateLabel}
            </p>
          </div>

          {/* CONTROLLI DATA: PREV / OGGI / NEXT / DATE PICKER */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center rounded-xl border border-[#80A1B2]/35 bg-[#F4F8FA] p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setSelectedDate((d) => shiftIsoDate(d, -1))}
                title="Giorno precedente"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#1C4A5C] transition hover:bg-white hover:shadow-xs"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setSelectedDate(todayIso)}
                className={cn(
                  "rounded-lg px-3 py-1 text-xs font-bold transition",
                  isToday
                    ? "bg-[#1C4A5C] text-white shadow-xs"
                    : "text-[#1C4A5C] hover:bg-white"
                )}
              >
                Oggi
              </button>

              <button
                type="button"
                onClick={() => setSelectedDate((d) => shiftIsoDate(d, 1))}
                title="Giorno successivo"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#1C4A5C] transition hover:bg-white hover:shadow-xs"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Input Data nativo */}
            <div className="flex items-center gap-1.5 rounded-xl border border-[#80A1B2]/35 bg-white px-2.5 py-1.5 shadow-2xs">
              <CalendarDays className="h-3.5 w-3.5 text-[#80A1B2]" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  if (e.target.value) setSelectedDate(e.target.value);
                }}
                className="cursor-pointer bg-transparent text-xs font-semibold text-[#03354B] outline-hidden"
              />
            </div>

            <div className="ml-1 hidden flex-wrap items-center gap-1.5 text-[10px] text-[#3D3D3C]/70 sm:flex">
              <span className="inline-flex items-center gap-1 rounded-full border border-[#80A1B2]/35 bg-white px-2.5 py-1 font-semibold text-[#1C4A5C]">
                <Clock className="h-3 w-3 text-[#80A1B2]" />
                Lun–Ven 9:00–19:00 (Orario continuato) · Sabato chiuso
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#80A1B2]/35 bg-white px-2.5 py-1">
                <Users className="h-3 w-3 text-[#80A1B2]" />
                4 Studi + Sala Filtro
              </span>
            </div>
          </div>
        </div>

        {/* BANNER CONFERMA PRENOTAZIONE CON CTA DIRETTA AL DESK */}
        {lastBooked && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3.5 shadow-xs">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
              <div>
                <p className="text-xs font-bold text-emerald-950">
                  Appuntamento salvato su Supabase: {lastBooked.patient}
                </p>
                <p className="mt-0.5 text-[11px] font-medium text-emerald-800">
                  {lastBooked.time}–{lastBooked.endTime} · {lastBooked.service} ·{" "}
                  {lastBooked.doctor} · {lastBooked.roomName}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/segreteria"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-800"
              >
                <span>📋 Vai subito al Desk Visite di Oggi →</span>
              </Link>
              <button
                type="button"
                onClick={() => setLastBooked(null)}
                className="rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-emerald-900 transition hover:bg-emerald-100"
              >
                Chiudi
              </button>
            </div>
          </div>
        )}

        {/* BLOCCO SABATO E DOMENICA CENTRO CHIUSO */}
        {isClosedWeekend && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3.5">
            <div className="flex items-start gap-2.5">
              <Ban className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
              <div>
                <p className="text-xs font-bold text-amber-950">
                  Sabato e Domenica Centro Chiuso
                </p>
                <p className="mt-0.5 text-[11px] text-amber-900">
                  Gli orari ufficiali di apertura sono Lun–Ven 9:00–19:00
                  (mattina 09:00–14:00, pomeriggio 14:00–19:00). Non sono
                  previsti slot prenotabili nel fine settimana.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedDate(nextMondayIso(selectedDate))}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1C4A5C] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#03354B]"
            >
              Vai a Lunedì →
            </button>
          </div>
        )}

        {/* GRIGLIA FASCE ORARIE UFFICIALI 09:00–19:00 */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#80A1B2]/25 bg-white px-3.5 py-2.5 text-[10px]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-[#03354B]">
              Griglia Oraria Ufficiale (60 min):
            </span>
            <span className="rounded-md bg-[#EEF6FA] px-2 py-0.5 font-semibold text-[#1C4A5C]">
              Mattina 09:00–14:00
            </span>
            <span className="rounded-md bg-[#EEF6FA] px-2 py-0.5 font-semibold text-[#1C4A5C]">
              Pomeriggio 14:00–19:00
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {HOURLY_GRID.map((slotHour) => (
              <span
                key={slotHour}
                className="rounded border border-[#80A1B2]/30 bg-[#F4F8FA] px-1.5 py-0.5 font-mono text-[9px] font-semibold text-[#1C4A5C]"
              >
                {slotHour}
              </span>
            ))}
          </div>
        </div>

        {/* KPI AGENDA */}
        <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          <StatCard
            label={isToday ? "Appuntamenti oggi" : "Appuntamenti del giorno"}
            value={counts.total}
            hint={
              isClosedWeekend
                ? "Centro chiuso (Sab–Dom)"
                : isToday
                  ? "Agenda live da Supabase"
                  : `Totale per ${selectedDateLabel}`
            }
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

        {/* AGENDA 4 STUDI + SALA FILTRO */}
        <section className="mt-5 rounded-2xl border border-[#80A1B2]/30 bg-white p-3 shadow-[0_18px_50px_-30px_rgba(3,53,75,0.35)] sm:p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
            <div>
              <h2 className="text-sm font-bold text-[#03354B]">
                Agenda reale per studio ·{" "}
                <span className="font-semibold capitalize text-[#1C4A5C]">
                  {selectedDateLabel}
                </span>
              </h2>
              <p className="text-[10px] text-[#3D3D3C]/60">
                Sincronizzazione diretta con il Desk Visite di Oggi · Lun–Ven
                9:00–19:00 (Orario continuato) · Sabato chiuso
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[9px] font-medium text-[#3D3D3C]/65">
              {(Object.keys(STATUS_META) as LiveAgendaStatus[]).map(
                (status) => (
                  <span key={status} className="inline-flex items-center gap-1">
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        STATUS_META[status].dot
                      )}
                    />
                    {STATUS_META[status].label}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {STUDIOS.map((studio) => {
              const studioItems = agendaItems.filter(
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
                    <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-[#80A1B2]">
                      {studio.focus}
                    </p>
                    <p className="mt-0.5 truncate text-[9px] text-[#3D3D3C]/65">
                      {studio.specialists}
                    </p>
                  </div>

                  <div className="flex-1 space-y-2 p-2.5">
                    {isClosedWeekend ? (
                      <div className="flex h-full min-h-[120px] items-center justify-center rounded-lg border border-dashed border-amber-300 bg-amber-50/50 px-3 text-center">
                        <p className="text-[10px] font-semibold text-amber-900">
                          Sabato e Domenica Centro Chiuso
                        </p>
                      </div>
                    ) : loadingAgenda ? (
                      <div className="flex h-full min-h-[120px] items-center justify-center rounded-lg border border-dashed border-[#80A1B2]/30 bg-white/60 px-3 text-center">
                        <p className="text-[10px] text-[#3D3D3C]/55">
                          Caricamento agenda live…
                        </p>
                      </div>
                    ) : studioItems.length === 0 ? (
                      <div className="flex h-full min-h-[120px] items-center justify-center rounded-lg border border-dashed border-[#80A1B2]/40 bg-white/60 px-3 text-center">
                        <p className="text-[10px] text-[#3D3D3C]/60">
                          Tutti gli slot 09:00–19:00 disponibili
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
                                <span className="text-[9px] font-normal text-[#3D3D3C]/55">
                                  –{item.endTime}
                                </span>
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
                              <p className="truncate text-[9px] font-medium text-[#1C4A5C]">
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
                    disabled={isClosedWeekend}
                    onClick={() => setOpen(true)}
                    className="m-2.5 mt-0 inline-flex items-center justify-center gap-1 rounded-lg border border-dashed border-[#80A1B2]/50 bg-white/70 px-2 py-1.5 text-[10px] font-bold text-[#1C4A5C] transition hover:border-[#1C4A5C] hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <Plus className="h-3 w-3" />
                    {isClosedWeekend
                      ? "Chiuso"
                      : `Prenota in ${studio.name}`}
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
                Prenota in 3 click, salvataggio diretto nel Desk Visite di Oggi
              </p>
              <p className="mt-0.5 text-[11px] text-[#CFE0E8]">
                Paziente → Prestazione → Slot libero da 1 ora (Lun–Ven 9:00–19:00,
                Sabato chiuso). Il doppio consenso per i minori è richiesto
                automaticamente.
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
              onClick={() => {
                if (isClosedWeekend) {
                  setSelectedDate(nextMondayIso(selectedDate));
                }
                setOpen(true);
              }}
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
        initialDate={isClosedWeekend ? nextMondayIso(selectedDate) : selectedDate}
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
