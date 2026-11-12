"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Clock,
  DoorOpen,
  FileText,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Users,
} from "lucide-react";
import type { UserSession } from "@/lib/auth-session";

type LiveVisitStatus = "confermato" | "in_attesa" | "in_visita" | "completato";

interface ActiveDoctorOption {
  id: string;
  fullName: string;
  title: string | null;
}

interface DoctorAppointment {
  id: string;
  startsAt: string;
  time: string;
  patientName: string;
  patientCode: string | null;
  doctorId: string | null;
  doctorName: string;
  service: string;
  room: string;
  status: LiveVisitStatus;
  cleanNotes: string;
  waitMinutes: number | null;
  visitMinutes: number | null;
  isFirstVisit: boolean;
}

const STATUS_LABEL: Record<LiveVisitStatus, string> = {
  confermato: "In Programma",
  in_attesa: "🟡 Arrivato in Sala d'Attesa",
  in_visita: "🟢 In Studio Ora",
  completato: "✓ Visita Conclusa",
};

const STATUS_CLASS: Record<LiveVisitStatus, string> = {
  confermato: "border-sky-200 bg-sky-50 text-sky-800",
  in_attesa: "border-amber-300 bg-amber-100 text-amber-950 shadow-2xs",
  in_visita: "border-emerald-300 bg-emerald-100 text-emerald-950 shadow-2xs",
  completato: "border-slate-200 bg-slate-100 text-slate-700",
};

const STATUS_DOT: Record<LiveVisitStatus, string> = {
  confermato: "bg-sky-500",
  in_attesa: "bg-amber-500 animate-ping",
  in_visita: "bg-emerald-600 animate-pulse",
  completato: "bg-slate-500",
};

function normalizeDoctorName(name?: string | null): string {
  if (!name) return "Specialista Cocoora";
  if (/scorzelli/i.test(name)) {
    return "Patrizia Scorzelli";
  }
  return name;
}

function isExcludedDoctor(name?: string | null, isActive?: boolean): boolean {
  if (isActive === false) return true;
  if (!name) return false;
  return name.toLowerCase().includes("sorrentino");
}

function deriveStatusFromRecord(
  rawStatus?: string | null,
  notes?: string | null
): LiveVisitStatus | "cancelled" {
  const st = (rawStatus || "").toLowerCase().trim();
  const text = notes || "";

  if (
    st === "annullato" ||
    st === "disdetto" ||
    st === "cancelled" ||
    st === "canceled" ||
    st === "no_show"
  ) {
    return "cancelled";
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

function stripTechnicalTags(notes?: string | null): {
  serviceLabel: string | null;
  cleanNotes: string;
} {
  if (!notes) return { serviceLabel: null, cleanNotes: "" };

  let serviceLabel: string | null = null;
  const serviceMatch = notes.match(/\[Prestazione:\s*([^\]]+)\]/i);
  if (serviceMatch && serviceMatch[1]) {
    serviceLabel = serviceMatch[1].replace(/^[A-Z0-9_-]+\s*-\s*/i, "").trim();
  }

  const cleaned = notes
    .replace(/\[(Arrivo|InizioVisita|FineVisita|Attesa|Durata|Reminder1h|Prestazione):[^\]]*\]/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  return { serviceLabel, cleanNotes: cleaned };
}

function isSameRomeDate(isoStr: string, targetDateStr: string): boolean {
  if (!isoStr) return false;
  if (isoStr.startsWith(targetDateStr)) return true;
  const dStr = new Date(isoStr).toLocaleDateString("sv-SE", { timeZone: "Europe/Rome" });
  return dStr === targetDateStr;
}

export default function DoctorPortalPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [doctors, setDoctors] = useState<ActiveDoctorOption[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("all");
  const [hasAutoSelectedDoctor, setHasAutoSelectedDoctor] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>("");
  const [filter, setFilter] = useState("");
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(
      new Date().toLocaleDateString("it-IT", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Europe/Rome",
      })
    );
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/auth/me", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          router.replace("/login?from=/medico");
          return null;
        }
        return (await response.json()) as { user?: UserSession };
      })
      .then((data) => {
        if (cancelled) return;
        if (!data?.user) {
          router.replace("/login?from=/medico");
          return;
        }
        if (data.user.role !== "medico" && data.user.role !== "admin") {
          router.replace("/login?from=/medico");
          return;
        }
        setUser(data.user);
      })
      .catch(() => {
        if (!cancelled) {
          router.replace("/login?from=/medico");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingUser(false);
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  const loadLiveAgenda = useCallback(async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const res = await fetch("/api/reception/desk", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();

      const nowMs = Date.now();
      const todayRomeStr = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Rome" });

      const rawDoctors = Array.isArray(data.doctors) ? data.doctors : [];
      const activeDocs: ActiveDoctorOption[] = rawDoctors
        .filter((d: any) => !isExcludedDoctor(d.full_name, d.is_active))
        .map((d: any) => {
          const fullName = normalizeDoctorName(d.full_name);
          return {
            id: String(d.id),
            fullName,
            title: fullName === "Patrizia Scorzelli" ? "Operatrice Estetica" : d.title || null,
          };
        });
      setDoctors(activeDocs);

      const rawAppts = Array.isArray(data.appointments) ? data.appointments : [];
      const todayMatches = rawAppts.filter((a: any) =>
        isSameRomeDate(a.starts_at, todayRomeStr)
      );
      const sourceAppts = todayMatches.length > 0 ? todayMatches : rawAppts;

      const mapped: DoctorAppointment[] = [];
      for (const app of sourceAppts) {
        const docObj = Array.isArray(app.doctors) ? app.doctors[0] : app.doctors;
        const patObj = Array.isArray(app.patient_profiles)
          ? app.patient_profiles[0]
          : app.patient_profiles;
        const roomObj = Array.isArray(app.clinic_rooms)
          ? app.clinic_rooms[0]
          : app.clinic_rooms;

        if (isExcludedDoctor(docObj?.full_name, docObj?.is_active)) continue;

        const derived = deriveStatusFromRecord(app.status, app.notes);
        if (derived === "cancelled") continue;

        const notesStr: string = app.notes || "";
        const { serviceLabel, cleanNotes } = stripTechnicalTags(notesStr);

        let waitMinutes: number | null = null;
        const arrivoMatch = notesStr.match(/\[Arrivo:\s*([^\]]+)\]/i);
        if (derived === "in_attesa" && arrivoMatch?.[1]) {
          const arrMs = new Date(arrivoMatch[1]).getTime();
          if (!Number.isNaN(arrMs)) {
            waitMinutes = Math.max(0, Math.floor((nowMs - arrMs) / 60000));
          }
        }

        let visitMinutes: number | null = null;
        const inizioMatch = notesStr.match(/\[InizioVisita:\s*([^\]]+)\]/i);
        if (derived === "in_visita" && inizioMatch?.[1]) {
          const startMs = new Date(inizioMatch[1]).getTime();
          if (!Number.isNaN(startMs)) {
            visitMinutes = Math.max(0, Math.floor((nowMs - startMs) / 60000));
          }
        }

        const timeStr = new Date(app.starts_at).toLocaleTimeString("it-IT", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/Rome",
        });

        const patientName = patObj
          ? `${patObj.first_name || ""} ${patObj.last_name || ""}`.trim()
          : "Paziente Cocoora";

        const docName = normalizeDoctorName(docObj?.full_name);
        const fallbackService =
          serviceLabel ||
          (app.is_first_visit
            ? `Prima Visita Specialistica · ${docName}`
            : docObj?.title
              ? `Visita Clinica · ${docObj.title}`
              : "Visita Specialistica Cocoora");

        mapped.push({
          id: String(app.id),
          startsAt: String(app.starts_at),
          time: timeStr,
          patientName: patientName || "Paziente Cocoora",
          patientCode: patObj?.patient_code || null,
          doctorId: docObj?.id ? String(docObj.id) : null,
          doctorName: docName,
          service: fallbackService,
          room: roomObj?.name || "Studio 1",
          status: derived,
          cleanNotes,
          waitMinutes,
          visitMinutes,
          isFirstVisit: Boolean(app.is_first_visit),
        });
      }

      setAppointments(mapped);
      setLastSyncedAt(
        new Date().toLocaleTimeString("it-IT", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Europe/Rome",
        })
      );
    } catch (e) {
      console.error("Errore sincronizzazione agenda medico:", e);
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  }, []);

  // Caricamento iniziale + polling leggero ogni 10 secondi
  useEffect(() => {
    if (!user) return;
    loadLiveAgenda(false);
    const interval = setInterval(() => {
      loadLiveAgenda(true);
    }, 10000);
    return () => clearInterval(interval);
  }, [user, loadLiveAgenda]);

  // Se ruolo medico (non admin), preseleziona il proprio profilo solo se ha visite oggi
  useEffect(() => {
    if (hasAutoSelectedDoctor || !user || doctors.length === 0) return;
    if (user.role === "admin") {
      setSelectedDoctorId("all");
      setHasAutoSelectedDoctor(true);
      return;
    }

    const userLower = (user.name || "").toLowerCase();
    const matched = doctors.find((d) => {
      const parts = d.fullName.toLowerCase().split(/\s+/);
      const surname = parts[parts.length - 1];
      return surname && surname.length > 2 && userLower.includes(surname);
    });

    if (matched && appointments.some((a) => a.doctorId === matched.id)) {
      setSelectedDoctorId(matched.id);
    } else {
      setSelectedDoctorId("all");
    }
    setHasAutoSelectedDoctor(true);
  }, [user, doctors, appointments, hasAutoSelectedDoctor]);

  const scopedAppointments = useMemo(() => {
    if (selectedDoctorId === "all") return appointments;
    return appointments.filter((a) => a.doctorId === selectedDoctorId);
  }, [appointments, selectedDoctorId]);

  const filteredAppointments = useMemo(() => {
    const query = filter.trim().toLowerCase();
    if (!query) return scopedAppointments;

    return scopedAppointments.filter(
      (appointment) =>
        appointment.patientName.toLowerCase().includes(query) ||
        appointment.service.toLowerCase().includes(query) ||
        appointment.doctorName.toLowerCase().includes(query) ||
        appointment.room.toLowerCase().includes(query)
    );
  }, [scopedAppointments, filter]);

  const counts = useMemo(
    () => ({
      total: scopedAppointments.length,
      waiting: scopedAppointments.filter((item) => item.status === "in_attesa").length,
      inProgress: scopedAppointments.filter((item) => item.status === "in_visita").length,
      completed: scopedAppointments.filter((item) => item.status === "completato").length,
    }),
    [scopedAppointments]
  );

  async function handleUpdateVisitStatus(id: string, nextStatus: "in_visita" | "completato") {
    setUpdatingId(id);
    // Aggiornamento ottimistico istantaneo
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === id ? { ...appointment, status: nextStatus } : appointment
      )
    );

    try {
      await fetch("/api/reception/desk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_status",
          appointmentId: id,
          status: nextStatus,
        }),
      });
      await loadLiveAgenda(true);
    } catch (e) {
      console.error("Errore avanzamento stato visita da /medico:", e);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  const isAdmin = user?.role === "admin";

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-[#f2f7f9] font-sans text-[#3d3d3c] antialiased">
      <header className="sticky top-0 z-20 border-b border-[#dce8ed] bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#c5dbe3] bg-[#03354b] p-1.5">
              <Image
                src="/cocoora-symbol.png"
                alt="Cocoora"
                width={32}
                height={32}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight text-[#03354b]">
                Cocoora Centro Medico
              </p>
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-[#80a1b2]">
                Area Medico · Sincronizzata col Desk Reception
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {isAdmin && (
              <>
                <Link
                  href="/segreteria"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#c5dbe3] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#03354b] shadow-2xs transition-colors hover:bg-[#eef5f8]"
                >
                  📋 Torna a Segreteria
                </Link>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#03354b]/25 bg-[#03354b] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-[#1c4a5c]"
                >
                  🏛️ Pannello Direzione
                </Link>
              </>
            )}

            <div className="hidden items-center gap-2 rounded-full border border-[#dce8ed] bg-[#f7fafb] px-3.5 py-1.5 text-xs text-[#1c4a5c] md:flex">
              <Stethoscope className="h-3.5 w-3.5 text-[#1c4a5c]" />
              <span className="max-w-[200px] truncate font-semibold">
                {isLoadingUser ? "Caricamento profilo..." : user?.name ?? "Area Medico"}
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-[11px] font-semibold text-rose-700 transition-colors hover:bg-rose-100"
            >
              <LogOut className="h-3.5 w-3.5" />
              Esci
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c5dbe3] bg-[#e8f1f4] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1c4a5c]">
                <CalendarDays className="h-3.5 w-3.5" />
                Agenda Live di Oggi
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Sync Reception 10s {lastSyncedAt ? `· ${lastSyncedAt}` : ""}
              </span>
            </div>
            <h1 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-[#03354b] sm:text-3xl">
              Pazienti in Studio &amp; Sala d&apos;Attesa
            </h1>
            <p className="mt-1.5 text-xs capitalize text-[#3d3d3c]/70">
              {today || "Caricamento data..."} · Lun–Ven 09:00–19:00 · Sabato chiuso
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              aria-label="Filtra per medico o tutti gli studi"
              className="rounded-full border border-[#dce8ed] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#03354b] outline-none transition-all focus:border-[#1c4a5c] focus:ring-4 focus:ring-[#1c4a5c]/10"
            >
              <option value="all">🏥 Tutti gli Studi Oggi ({appointments.length})</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.fullName}
                </option>
              ))}
            </select>

            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#80a1b2]" />
              <input
                type="search"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                placeholder="Cerca paziente o studio..."
                className="w-full rounded-full border border-[#dce8ed] bg-white py-2.5 pl-9 pr-4 text-xs text-[#03354b] outline-none transition-all placeholder:text-[#80a1b2]/70 focus:border-[#1c4a5c] focus:ring-4 focus:ring-[#1c4a5c]/10"
              />
            </div>

            <button
              type="button"
              onClick={() => loadLiveAgenda(false)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#c5dbe3] bg-white px-4 py-2.5 text-xs font-semibold text-[#1c4a5c] shadow-2xs transition-colors hover:bg-[#eef5f8]"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              Aggiorna Ora
            </button>
          </div>
        </div>

        {isLoadingUser ? (
          <div className="mt-10 flex items-center justify-center gap-2 rounded-2xl border border-[#dce8ed] bg-white py-10 text-xs font-medium text-[#1c4a5c]">
            <Loader2 className="h-4 w-4 animate-spin" />
            Verifica della sessione in corso...
          </div>
        ) : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section aria-label="Agenda giornaliera sincronizzata">
            <div className="grid gap-3.5">
              {filteredAppointments.map((appointment) => {
                const isWaiting = appointment.status === "in_attesa";
                const isInStudio = appointment.status === "in_visita";
                const isCompleted = appointment.status === "completato";

                return (
                  <article
                    key={appointment.id}
                    className={`rounded-2xl border p-4 transition-all sm:p-5 ${
                      isInStudio
                        ? "border-emerald-300 bg-emerald-50/40 shadow-[0_18px_42px_-26px_rgba(16,185,129,0.4)]"
                        : isWaiting
                          ? "border-amber-300 bg-amber-50/40 shadow-[0_18px_42px_-26px_rgba(245,158,11,0.35)]"
                          : "border-[#dce8ed] bg-white shadow-[0_16px_40px_-30px_rgba(3,53,75,0.45)] hover:shadow-[0_22px_48px_-28px_rgba(3,53,75,0.5)]"
                    }`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-start gap-3.5">
                        <div className="flex h-12 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-[#c5dbe3] bg-[#eef5f8] font-mono text-xs font-bold leading-tight text-[#03354b]">
                          <Clock className="mb-0.5 h-3 w-3 text-[#1c4a5c]" />
                          {appointment.time}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-sm font-bold text-[#03354b]">
                              {appointment.patientName}
                            </h2>
                            {appointment.patientCode && (
                              <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
                                {appointment.patientCode}
                              </span>
                            )}
                            {appointment.isFirstVisit && (
                              <span className="rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-800">
                                Prima Visita
                              </span>
                            )}
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${STATUS_CLASS[appointment.status]}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[appointment.status]}`}
                              />
                              {STATUS_LABEL[appointment.status]}
                            </span>
                          </div>

                          <p className="mt-1 text-xs font-semibold text-[#1c4a5c]">
                            {appointment.service}
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#3d3d3c]/75">
                            <span className="inline-flex items-center gap-1 font-semibold text-[#03354b]">
                              <DoorOpen className="h-3.5 w-3.5 text-[#1c4a5c]" />
                              {appointment.room}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Stethoscope className="h-3.5 w-3.5 text-[#1c4a5c]" />
                              {appointment.doctorName}
                            </span>
                            {isWaiting && appointment.waitMinutes !== null && (
                              <span className="font-mono font-semibold text-amber-900">
                                ⏳ Attesa: {appointment.waitMinutes} min
                              </span>
                            )}
                            {isInStudio && appointment.visitMinutes !== null && (
                              <span className="font-mono font-semibold text-emerald-900">
                                🩺 In poltrona da {appointment.visitMinutes} min
                              </span>
                            )}
                          </div>

                          {appointment.cleanNotes ? (
                            <p className="mt-1.5 text-[11px] italic text-[#3d3d3c]/65">
                              Note cliniche: {appointment.cleanNotes}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2 border-t border-[#eef3f5] pt-3 sm:border-t-0 sm:pt-0">
                        {!isCompleted ? (
                          <>
                            {!isInStudio && (
                              <button
                                type="button"
                                disabled={updatingId === appointment.id}
                                onClick={() =>
                                  handleUpdateVisitStatus(appointment.id, "in_visita")
                                }
                                className="rounded-full bg-[#03354b] px-4 py-2 text-[11px] font-semibold text-white shadow-2xs transition-colors hover:bg-[#1c4a5c] disabled:opacity-50"
                              >
                                Fai Entrare / Avvia Visita
                              </button>
                            )}
                            <button
                              type="button"
                              disabled={updatingId === appointment.id}
                              onClick={() =>
                                handleUpdateVisitStatus(appointment.id, "completato")
                              }
                              className="rounded-full border border-emerald-300 bg-emerald-600 px-4 py-2 text-[11px] font-semibold text-white shadow-2xs transition-colors hover:bg-emerald-700 disabled:opacity-50"
                            >
                              Concludi Visita
                            </button>
                          </>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                            <CheckCircle2 className="h-4 w-4" />✓ Visita Conclusa
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}

              {!isLoadingUser && filteredAppointments.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#c5dbe3] bg-white/80 px-5 py-10 text-center">
                  <Search className="mx-auto h-5 w-5 text-[#80a1b2]" />
                  <p className="mt-2 text-sm font-semibold text-[#1c4a5c]">
                    Nessuna visita trovata con i filtri attuali
                  </p>
                  <p className="mt-1 text-xs text-[#3d3d3c]/60">
                    Seleziona &ldquo;Tutti gli Studi Oggi&rdquo; o aggiorna la sincronizzazione col Desk Reception.
                  </p>
                </div>
              ) : null}
            </div>
          </section>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-[#dce8ed] bg-white p-5 shadow-[0_16px_40px_-30px_rgba(3,53,75,0.45)]">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#1c4a5c]" />
                <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1c4a5c]">
                  Stato Live Giornata
                </h2>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <SummaryTile label="Totale Oggi" value={counts.total} />
                <SummaryTile label="In Sala Attesa" value={counts.waiting} highlight="amber" />
                <SummaryTile label="In Studio Ora" value={counts.inProgress} highlight="emerald" />
                <SummaryTile label="Concluse" value={counts.completed} />
              </div>
            </section>

            <section className="rounded-2xl border border-[#dce8ed] bg-white p-5 shadow-[0_16px_40px_-30px_rgba(3,53,75,0.45)]">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#1c4a5c]" />
                <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1c4a5c]">
                  Coda Pazienti Assegnati
                </h2>
              </div>

              <ul className="mt-4 space-y-3">
                {scopedAppointments.map((patient) => (
                  <li key={patient.id} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef5f8] text-[#1c4a5c]">
                      <UserRound className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-[#03354b]">
                        {patient.patientName}
                      </p>
                      <p className="truncate text-[10.5px] text-[#3d3d3c]/65">
                        {patient.time} · {patient.room} · {patient.doctorName}
                      </p>
                    </div>
                    <span
                      className={`ml-auto mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${STATUS_DOT[patient.status]}`}
                      title={STATUS_LABEL[patient.status]}
                    />
                  </li>
                ))}
                {scopedAppointments.length === 0 && (
                  <li className="text-xs text-[#3d3d3c]/55 italic">
                    Nessun paziente in coda per il filtro selezionato.
                  </li>
                )}
              </ul>
            </section>

            <section className="rounded-2xl border border-[#c5dbe3] bg-[#03354b] p-5 text-white shadow-[0_18px_44px_-28px_rgba(3,53,75,0.8)]">
              <div className="flex items-center gap-2 text-[#c5dbe3]">
                <FileText className="h-4 w-4" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                  Continuità Clinica &amp; Desk
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[#d8e7ec]/85">
                Ogni avanzamento stato (&ldquo;In Studio Ora&rdquo; o &ldquo;Visita Conclusa&rdquo;) aggiorna
                istantaneamente il Desk Reception per la dimissione e la refertazione. La tua salute, seguita con cura,
                nel tempo.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-[10px] font-semibold text-[#c5dbe3]">
                <ShieldCheck className="h-3.5 w-3.5" />
                Lun–Ven 09:00–19:00 · Sabato chiuso
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

function SummaryTile({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: "amber" | "emerald";
}) {
  const boxClass =
    highlight === "amber" && value > 0
      ? "border-amber-300 bg-amber-50"
      : highlight === "emerald" && value > 0
        ? "border-emerald-300 bg-emerald-50"
        : "border-[#eef3f5] bg-[#f8fbfc]";

  return (
    <div className={`rounded-xl border px-3 py-2.5 ${boxClass}`}>
      <p className="font-serif text-xl font-semibold leading-none text-[#03354b]">
        {value}
      </p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#80a1b2]">
        {label}
      </p>
    </div>
  );
}
