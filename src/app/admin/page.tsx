"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { UserSession } from "@/lib/auth-session";
import {
  Activity,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  DoorOpen,
  FileText,
  Film,
  Globe,
  LayoutDashboard,
  LogOut,
  RefreshCw,
  Shield,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import { VideosManager } from "@/components/admin/videos-manager";
import { SeoManager } from "@/components/admin/seo-manager";
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";
import { DoctorsManager } from "@/components/admin/doctors-manager";
import { RoomsManager } from "@/components/admin/rooms-manager";
import {
  CalendarMatrix,
  deriveLiveAppointmentStatus,
} from "@/components/admin/calendar-matrix";
import { PatientsCrmAdmin } from "@/components/admin/patients-crm-admin";
import { CashFlowManager } from "@/components/admin/cash-flow-manager";
import { ConsentsLedgerAdmin } from "@/components/admin/consents-ledger-admin";
import { ScatolaNeraDashboard } from "@/components/admin/scatola-nera-dashboard";
import { cn } from "@/lib/utils";

type Tab =
  | "dashboard"
  | "calendar"
  | "doctors"
  | "rooms"
  | "crm"
  | "cassa"
  | "consensi"
  | "videos"
  | "seo"
  | "analytics"
  | "scatola-nera";

type DeskDoctor = {
  id: string;
  full_name: string;
  title?: string | null;
  specialty_slug?: string | null;
  is_active?: boolean;
};

type DeskAppointment = {
  id: string;
  starts_at: string;
  ends_at: string;
  status: string;
  notes?: string | null;
  is_first_visit?: boolean;
  patient_profiles?: {
    id: string;
    patient_code?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    phone?: string | null;
  } | null;
  doctors?: {
    id: string;
    full_name?: string | null;
    title?: string | null;
    specialty_slug?: string | null;
    is_active?: boolean;
  } | null;
  clinic_rooms?: {
    id: string;
    name?: string | null;
    slug?: string | null;
  } | null;
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

function cleanClinicalNotes(notes?: string | null): string {
  if (!notes) return "";
  return notes
    .replace(/\[(Arrivo|InizioVisita|FineVisita|Attesa|Durata|Reminder1h):[^\]]*\]/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function isSameRomeDay(isoStr: string, targetDateStr: string): boolean {
  if (!isoStr) return false;
  if (isoStr.startsWith(targetDateStr)) return true;
  const dStr = new Date(isoStr).toLocaleDateString("sv-SE", { timeZone: "Europe/Rome" });
  return dStr === targetDateStr;
}

function formatTimeRome(isoStr: string): string {
  return new Date(isoStr).toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Rome",
  });
}

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const isAgency = currentUser?.role === "agenzia";
  const [tab, setTab] = useState<Tab>("dashboard");

  const [deskLoading, setDeskLoading] = useState(true);
  const [activeDoctors, setActiveDoctors] = useState<DeskDoctor[]>([]);
  const [appointments, setAppointments] = useState<DeskAppointment[]>([]);
  const [patientsCount, setPatientsCount] = useState<number>(0);
  const [paidCashTotal, setPaidCashTotal] = useState<number>(0);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.user) {
          setCurrentUser(d.user);
          if (d.user.role === "agenzia") {
            setTab("analytics");
          }
        }
      })
      .catch(() => {});
  }, []);

  const loadDeskLive = useCallback(async (silent = false) => {
    if (!silent) setDeskLoading(true);
    try {
      const res = await fetch("/api/reception/desk", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();

      const docsRaw: DeskDoctor[] = Array.isArray(data.doctors) ? data.doctors : [];
      const cleanDocs = docsRaw
        .filter((d) => !isExcludedDoctor(d.full_name, d.is_active))
        .map((d) => ({
          ...d,
          full_name: normalizeDoctorName(d.full_name),
        }));
      setActiveDoctors(cleanDocs);

      const apptsRaw: DeskAppointment[] = Array.isArray(data.appointments)
        ? data.appointments
        : [];
      const cleanAppts = apptsRaw
        .map((a) => {
          const pat = Array.isArray(a.patient_profiles)
            ? a.patient_profiles[0]
            : a.patient_profiles;
          const doc = Array.isArray(a.doctors) ? a.doctors[0] : a.doctors;
          const rm = Array.isArray(a.clinic_rooms) ? a.clinic_rooms[0] : a.clinic_rooms;
          return {
            ...a,
            patient_profiles: pat || null,
            doctors: doc
              ? { ...doc, full_name: normalizeDoctorName(doc.full_name) }
              : null,
            clinic_rooms: rm || null,
          };
        })
        .filter((a) => !isExcludedDoctor(a.doctors?.full_name, a.doctors?.is_active));
      setAppointments(cleanAppts);

      if (Array.isArray(data.patients)) {
        setPatientsCount(data.patients.length);
      }

      if (Array.isArray(data.installments)) {
        const paid = data.installments
          .filter((i: any) => String(i.status || "").toLowerCase() === "pagato")
          .reduce((sum: number, i: any) => sum + Number(i.amount || 0), 0);
        setPaidCashTotal(paid);
      }
    } catch (e) {
      console.error("Errore caricamento live desk in Admin:", e);
    } finally {
      if (!silent) setDeskLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDeskLive(false);
    const interval = setInterval(() => {
      loadDeskLive(true);
    }, 15000);
    return () => clearInterval(interval);
  }, [loadDeskLive]);

  const todayRomeStr = useMemo(
    () => new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Rome" }),
    []
  );

  const formattedTodayLabel = useMemo(
    () =>
      new Date().toLocaleDateString("it-IT", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Europe/Rome",
      }),
    []
  );

  const todayAppointments = useMemo(() => {
    const exactToday = appointments.filter((a) => isSameRomeDay(a.starts_at, todayRomeStr));
    const source = exactToday.length > 0 ? exactToday : appointments;
    return source.map((a) => ({
      ...a,
      liveStatus: deriveLiveAppointmentStatus(a.status, a.notes),
      cleanNotes: cleanClinicalNotes(a.notes),
    }));
  }, [appointments, todayRomeStr]);

  const doctorsOnDutyToday = useMemo(() => {
    const byDoctor = new Map<
      string,
      { id: string; name: string; title: string; roomName: string; visitsCount: number }
    >();

    for (const app of todayAppointments) {
      if (app.liveStatus === "annullato" || app.liveStatus === "no_show") continue;
      const docName = normalizeDoctorName(app.doctors?.full_name);
      const docKey = app.doctors?.id || docName;
      const existing = byDoctor.get(docKey);
      if (existing) {
        existing.visitsCount += 1;
      } else {
        byDoctor.set(docKey, {
          id: docKey,
          name: docName,
          title:
            docName === "Patrizia Scorzelli"
              ? "Operatrice Estetica"
              : app.doctors?.title || "Équipe Ufficiale Cocoora",
          roomName: app.clinic_rooms?.name || "Studio Clinico",
          visitsCount: 1,
        });
      }
    }

    return Array.from(byDoctor.values());
  }, [todayAppointments]);

  const dashboardMetrics = useMemo(() => {
    const total = todayAppointments.length;
    const waiting = todayAppointments.filter((a) => a.liveStatus === "in_attesa").length;
    const inVisit = todayAppointments.filter((a) => a.liveStatus === "in_visita").length;
    const completed = todayAppointments.filter((a) => a.liveStatus === "completato").length;
    const cancelled = appointments.filter((a) => {
      const st = deriveLiveAppointmentStatus(a.status, a.notes);
      return st === "annullato";
    }).length;
    const noShow = appointments.filter((a) => {
      const st = deriveLiveAppointmentStatus(a.status, a.notes);
      return st === "no_show";
    }).length;
    const rescheduled = appointments.filter((a) => a.notes?.includes("[Spostato")).length;

    const allCount = appointments.length;
    const showUpRate =
      allCount > 0 ? Math.round(((allCount - cancelled - noShow) / allCount) * 100) : 100;

    const waitSamples: number[] = [];
    for (const a of appointments) {
      const m = a.notes?.match(/\[Attesa:\s*(\d+)m\]/);
      if (m && m[1]) waitSamples.push(parseInt(m[1], 10));
    }
    const avgWaitMins =
      waitSamples.length > 0
        ? Math.round(waitSamples.reduce((acc, v) => acc + v, 0) / waitSamples.length)
        : 5;

    return {
      total,
      waiting,
      inVisit,
      completed,
      cancelled,
      noShow,
      rescheduled,
      showUpRate,
      avgWaitMins,
    };
  }, [todayAppointments, appointments]);

  const activeDoctorsCount = activeDoctors.length || 11;

  return (
    <div className="min-h-screen bg-[#f0f0f1] text-[#2c3338] font-sans antialiased">
      {/* ── 1. SIDEBAR LATERALE STILE WORDPRESS ──────────────────────── */}
      <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between bg-[#1d2327] text-[#c3c4c7] select-none border-r border-[#2c3338] shadow-lg">
        <div>
          {/* Header Brand Sidebar */}
          <div className="flex h-16 items-center justify-between border-b border-[#2c3338] bg-[#101517] px-4">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#182a32] p-1 border border-teal-500/20 shadow-xs">
                <Image
                  src="/cocoora-symbol.png"
                  alt="Cocoora"
                  width={32}
                  height={32}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-wide">
                  Cocoora CRM
                </h2>
                <p className="text-[10px] text-[#787c82] tracking-wider uppercase">
                  Gestionale Clinico
                </p>
              </div>
            </div>
            <span className="rounded-full bg-teal-500/15 px-2 py-0.5 text-[10px] font-mono font-semibold text-teal-300 border border-teal-500/30">
              v2.5
            </span>
          </div>

          {/* Menu Voci WordPress Style */}
          <nav className="mt-3 px-2 space-y-1">
            <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#787c82]">
              Pannello di Controllo
            </p>

            <SidebarItem
              active={tab === "dashboard"}
              onClick={() => setTab("dashboard")}
              icon={<LayoutDashboard className="h-4 w-4" />}
              label="Dashboard Panoramica"
              badge="Live"
            />

            {!isAgency && (
              <>
                <SidebarItem
                  active={tab === "calendar"}
                  onClick={() => setTab("calendar")}
                  icon={<Calendar className="h-4 w-4" />}
                  label="Calendario & Incrocio"
                  badge="9:00–19:00"
                />

                <SidebarItem
                  active={tab === "doctors"}
                  onClick={() => setTab("doctors")}
                  icon={<Stethoscope className="h-4 w-4" />}
                  label="Corpo Medico & Turni"
                  badge={`${activeDoctorsCount} attivi`}
                />

                <SidebarItem
                  active={tab === "rooms"}
                  onClick={() => setTab("rooms")}
                  icon={<DoorOpen className="h-4 w-4" />}
                  label="Stanze & Spazi"
                  badge="Studi 1-4 + OPT"
                />

                <SidebarItem
                  active={tab === "crm"}
                  onClick={() => setTab("crm")}
                  icon={<Users className="h-4 w-4" />}
                  label="CRM pazienti"
                  badge={patientsCount > 0 ? `${patientsCount} attivi` : "Cartelle"}
                />

                <SidebarItem
                  active={tab === "cassa"}
                  onClick={() => setTab("cassa")}
                  icon={<CreditCard className="h-4 w-4" />}
                  label="Cassa & Flussi"
                  badge="Investimenti"
                />

                <SidebarItem
                  active={tab === "consensi"}
                  onClick={() => setTab("consensi")}
                  icon={<ShieldCheck className="h-4 w-4 text-emerald-400" />}
                  label="Registro Consensi GDPR"
                  badge="Art. 7"
                />
              </>
            )}

            <Link
              href="/admin/catalogo"
              className="flex items-center justify-between rounded-md px-3 py-2 text-xs font-semibold text-[#c3c4c7] hover:bg-[#2c3338] hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="h-4 w-4 text-teal-400" />
                <span>Catalogo Prestazioni</span>
              </div>
              <span className="rounded-full bg-teal-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-teal-300">
                Ufficiale
              </span>
            </Link>

            <div className="my-2 border-t border-[#2c3338]"></div>

            <p className="px-3 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#787c82]">
              Marketing &amp; Pagine
            </p>

            <SidebarItem
              active={tab === "videos"}
              onClick={() => setTab("videos")}
              icon={<Film className="h-4 w-4" />}
              label="Video Verticali (Reels)"
            />

            <SidebarItem
              active={tab === "seo"}
              onClick={() => setTab("seo")}
              icon={<Globe className="h-4 w-4" />}
              label="SEO & Indicizzazione"
            />

            <SidebarItem
              active={tab === "analytics"}
              onClick={() => setTab("analytics")}
              icon={<Activity className="h-4 w-4" />}
              label="Analytics & SEO Silvia"
              badge="Live"
            />

            <SidebarItem
              active={tab === "scatola-nera"}
              onClick={() => setTab("scatola-nera")}
              icon={<Shield className="h-4 w-4 text-emerald-400" />}
              label="Scatola Nera & Telemetria"
              badge="100% Interna"
            />
          </nav>
        </div>

        {/* Profilo Utente Sidebar Bottom */}
        <div className="border-t border-[#2c3338] bg-[#101517] p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-white font-bold text-xs border ${
                  isAgency
                    ? "bg-sky-800 border-sky-500"
                    : "bg-teal-800 border-teal-600"
                }`}
              >
                {isAgency ? "AG" : "ER"}
              </div>
              <div className="leading-tight">
                <p className="text-xs font-semibold text-white">
                  {isAgency ? "Silvia (Agenzia SEO)" : "Dott.ssa Elisa Russo"}
                </p>
                <p className="text-[10px] text-[#787c82]">
                  {isAgency ? "Accesso Marketing & Contenuti" : "Direttrice Sanitaria"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                window.location.href = "/login";
              }}
              title="Disconnetti sessione e torna al login"
              className="rounded p-1.5 text-[#787c82] hover:bg-[#2c3338] hover:text-white transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── 2. TOP BAR ORIZZONTALE AMMINISTRATORE ────────────────────── */}
      <header className="fixed top-0 left-64 right-0 z-40 flex h-14 items-center justify-between border-b border-[#dcdcde] bg-white px-6 shadow-2xs">
        {/* Breadcrumb stile WordPress */}
        <div className="flex items-center gap-2 text-xs text-[#50575e]">
          <span className="font-semibold text-[#1d2327]">Cocoora CRM</span>
          <span>/</span>
          <span className="font-medium text-[#2271b1]">
            {tab === "dashboard" && "Dashboard Panoramica"}
            {tab === "calendar" && "Calendario & Incrocio Stanze (Lun–Ven 09:00–19:00)"}
            {tab === "doctors" && "Gestione Medici & Presenze"}
            {tab === "rooms" && "Stanze & Macchinari Ufficiali"}
            {tab === "crm" && "CRM Pazienti (Anagrafiche & Cartelle)"}
            {tab === "cassa" && "Gestione Flussi di Cassa & Investimenti Rateali"}
            {tab === "consensi" && "Registro Consensi GDPR (Art. 7)"}
            {tab === "videos" && "Video Verticali Reels"}
            {tab === "seo" && "SEO & Pagine Pubbliche"}
            {tab === "analytics" && "Analytics, Server-Side Tracking & Box ID Silvia"}
            {tab === "scatola-nera" && "Scatola Nera & Telemetria Clinica"}
          </span>
        </div>

        {/* Status Database & Scorciatoie Ruoli */}
        <div className="flex items-center gap-2.5">
          <div className="hidden xl:flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-semibold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Lun–Ven 09:00–19:00 · Sabato chiuso</span>
          </div>

          <Link
            href="/segreteria"
            className="inline-flex items-center gap-1.5 rounded-md border border-[#c3c4c7] bg-white px-3 py-1.5 text-xs font-semibold text-[#2c3338] shadow-2xs hover:bg-[#f6f7f7] hover:border-[#2271b1] transition-all"
          >
            <span>📋 Segreteria CRM</span>
          </Link>

          <Link
            href="/medico"
            className="inline-flex items-center gap-1.5 rounded-md border border-[#c3c4c7] bg-white px-3 py-1.5 text-xs font-semibold text-[#2c3338] shadow-2xs hover:bg-[#f6f7f7] hover:border-[#2271b1] transition-all"
          >
            <span>👨‍⚕️ Vista Medico</span>
          </Link>

          <Link
            href="/area-paziente"
            className="inline-flex items-center gap-1.5 rounded-md border border-teal-300 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800 shadow-2xs hover:bg-teal-100 transition-all"
          >
            <span>🩺 Portale Paziente</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-md bg-[#2271b1] px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#135e96] transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Sito Web</span>
          </Link>
        </div>
      </header>

      {/* ── 3. CONTENUTO PRINCIPALE DEL GESTIONALE ──────────────────── */}
      <main className="ml-64 pt-20 p-8 min-h-screen">
        {/* TAB 0: DASHBOARD PANORAMICA */}
        {tab === "dashboard" && (
          <div className="space-y-6">
            <div className="rounded-lg border border-[#c3c4c7] bg-white p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="font-serif text-2xl font-bold text-[#1d2327]">
                    Pannello Direzionale Cocoora Centro Medico
                  </h1>
                  <p className="text-xs text-[#50575e] mt-1">
                    Operatività in tempo reale: <strong>{activeDoctorsCount} professionisti attivi</strong>, Studi 1–4 +
                    Sala Radiologia / OPT + Sala Filtro / Nutrizione · Orari ufficiali{" "}
                    <strong>Lun–Ven 09:00–19:00 · Sabato chiuso</strong>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => loadDeskLive(false)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[#c3c4c7] bg-white px-3 py-1.5 text-xs font-semibold text-[#2c3338] hover:bg-[#f6f7f7] self-start sm:self-auto"
                >
                  <RefreshCw className={cn("h-3.5 w-3.5", deskLoading && "animate-spin")} />
                  <span>Sincronizza Dati Live</span>
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div
                  onClick={() => setTab("doctors")}
                  className="rounded-lg border border-[#dcdcde] bg-[#f6f7f7] p-4 cursor-pointer hover:border-[#2271b1] transition-all"
                >
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#50575e]">
                    Medici Attivi
                  </p>
                  <p className="text-3xl font-bold text-[#1d2327] mt-1">{activeDoctorsCount}</p>
                  <p className="text-[11px] text-teal-700 mt-1">✓ Équipe ufficiale Cocoora →</p>
                </div>

                <div
                  onClick={() => setTab("rooms")}
                  className="rounded-lg border border-[#dcdcde] bg-[#f6f7f7] p-4 cursor-pointer hover:border-[#2271b1] transition-all"
                >
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#50575e]">
                    Spazi Clinici
                  </p>
                  <p className="text-3xl font-bold text-[#1d2327] mt-1">6</p>
                  <p className="text-[11px] text-teal-700 mt-1">Studi 1–4 + OPT + Filtro →</p>
                </div>

                <div className="rounded-lg border border-[#dcdcde] bg-[#f6f7f7] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#50575e]">
                    Agenda Oggi
                  </p>
                  <p className="text-3xl font-bold text-[#1d2327] mt-1">{dashboardMetrics.total}</p>
                  <p className="text-[11px] text-teal-700 mt-1">
                    {dashboardMetrics.inVisit} in studio · {dashboardMetrics.waiting} in attesa
                  </p>
                </div>

                <div
                  onClick={() => setTab("crm")}
                  className="rounded-lg border border-[#dcdcde] bg-[#f6f7f7] p-4 cursor-pointer hover:border-[#2271b1] transition-all"
                >
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#50575e]">
                    CRM Pazienti
                  </p>
                  <p className="text-3xl font-bold text-[#1d2327] mt-1">{patientsCount}</p>
                  <p className="text-[11px] text-teal-700 mt-1">Anagrafiche cliniche reali →</p>
                </div>

                <div
                  onClick={() => setTab("cassa")}
                  className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 cursor-pointer hover:border-emerald-500 transition-all"
                >
                  <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                    Flussi &amp; Investimenti
                  </p>
                  <p className="text-3xl font-bold text-emerald-950 mt-1">
                    €{paidCashTotal.toLocaleString("it-IT")}
                  </p>
                  <p className="text-[11px] text-emerald-700 mt-1">
                    Gestione Flussi &amp; Investimenti Rateali →
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[#dcdcde] flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setTab("calendar")}
                  className="rounded-md bg-[#2271b1] px-4 py-2 text-xs font-semibold text-white hover:bg-[#135e96] transition-colors"
                >
                  Apri Calendario Incrocio Stanze →
                </button>
                <button
                  type="button"
                  onClick={() => setTab("doctors")}
                  className="rounded-md border border-[#c3c4c7] bg-white px-4 py-2 text-xs font-semibold text-[#2c3338] hover:bg-[#f6f7f7] transition-colors"
                >
                  Gestisci Medici e Presenze
                </button>
                <button
                  type="button"
                  onClick={() => setTab("cassa")}
                  className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
                >
                  Gestione Flussi di Cassa &amp; Investimenti Rateali 💳
                </button>
                <Link
                  href="/segreteria"
                  className="rounded-md border border-sky-300 bg-sky-50 px-4 py-2 text-xs font-semibold text-sky-800 hover:bg-sky-100 transition-colors"
                >
                  Gestisci al Desk Reception →
                </Link>
                <Link
                  href="/medico"
                  className="rounded-md border border-teal-300 bg-teal-50 px-4 py-2 text-xs font-semibold text-teal-900 hover:bg-teal-100 transition-colors"
                >
                  👨‍⚕️ Apri Vista Medico Live →
                </Link>
              </div>
            </div>

            {/* ── AGENDA REALE DI OGGI + MEDICI IN TURNO (LIVE DA /api/reception/desk) ── */}
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              {/* Colonna Sinistra: Appuntamenti Reali in Agenda Oggi */}
              <div className="rounded-lg border border-teal-200 bg-white p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-teal-100 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-800 text-white font-bold text-lg shadow-xs">
                      📋
                    </div>
                    <div>
                      <h2 className="font-serif text-lg font-bold text-[#1d2327] capitalize">
                        Appuntamenti in Agenda Oggi — {formattedTodayLabel}
                      </h2>
                      <p className="text-xs text-[#50575e]">
                        Sincronizzato in tempo reale col Desk Reception e la Vista Medico · Orari Lun–Ven 09:00–19:00 ·
                        Sabato chiuso.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-800">
                      {todayAppointments.length} visite in agenda
                    </span>
                    <Link
                      href="/segreteria"
                      className="inline-flex items-center gap-1.5 rounded-md bg-teal-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-teal-800 transition-colors"
                    >
                      <span>Gestisci al Desk Reception →</span>
                    </Link>
                  </div>
                </div>

                {deskLoading && todayAppointments.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-500">
                    <RefreshCw className="mx-auto h-5 w-5 animate-spin text-teal-700 mb-2" />
                    Caricamento agenda clinica reale dal Desk Reception...
                  </div>
                ) : todayAppointments.length === 0 ? (
                  <div className="py-10 text-center space-y-2">
                    <p className="text-sm font-semibold text-slate-700">
                      Nessuna visita registrata per la giornata corrente.
                    </p>
                    <p className="text-xs text-slate-500">
                      Puoi fissare una nuova prenotazione dal Desk Reception o dalla matrice Calendario (Lun–Ven
                      09:00–19:00 · Sabato chiuso).
                    </p>
                    <div className="pt-2">
                      <Link
                        href="/segreteria"
                        className="inline-flex items-center gap-1.5 rounded-md bg-teal-700 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-800"
                      >
                        Gestisci al Desk Reception →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 divide-y divide-slate-100">
                    {todayAppointments.map((app) => {
                      const pat = app.patient_profiles;
                      const patientFullName = pat
                        ? `${pat.first_name || ""} ${pat.last_name || ""}`.trim()
                        : "Paziente Cocoora";
                      const docName = normalizeDoctorName(app.doctors?.full_name);
                      const roomName = app.clinic_rooms?.name || "Studio 1";
                      const timeStr = formatTimeRome(app.starts_at);

                      return (
                        <div
                          key={app.id}
                          className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 p-2.5 rounded-lg transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <span className="flex h-9 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-mono font-bold text-slate-800 border border-slate-200">
                              {timeStr}
                            </span>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-bold text-slate-900">
                                  {patientFullName}
                                </span>
                                {pat?.patient_code && (
                                  <span className="rounded bg-slate-100 text-[10px] font-mono text-slate-600 px-1.5 py-0.5">
                                    {pat.patient_code}
                                  </span>
                                )}
                                {app.is_first_visit && (
                                  <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold">
                                    Prima Visita
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-600 mt-0.5">
                                <strong className="text-slate-800">{docName}</strong> ·{" "}
                                <span className="font-semibold text-teal-800">{roomName}</span>
                                {app.cleanNotes ? ` · ${app.cleanNotes}` : ""}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {app.liveStatus === "in_visita" && (
                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100 border border-emerald-300 px-2.5 py-1 text-xs font-semibold text-emerald-900">
                                🟢 In Studio Ora
                              </span>
                            )}
                            {app.liveStatus === "in_attesa" && (
                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100 border border-amber-300 px-2.5 py-1 text-xs font-semibold text-amber-900">
                                🟡 In Sala d&apos;Attesa
                              </span>
                            )}
                            {app.liveStatus === "confermato" && (
                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-sky-50 border border-sky-200 px-2.5 py-1 text-xs font-semibold text-sky-800">
                                In Programma
                              </span>
                            )}
                            {app.liveStatus === "completato" && (
                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                Visita Conclusa
                              </span>
                            )}
                            {(app.liveStatus === "annullato" || app.liveStatus === "no_show") && (
                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-800">
                                {app.liveStatus === "no_show" ? "No-Show" : "Disdetta"}
                              </span>
                            )}

                            <Link
                              href="/segreteria"
                              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
                            >
                              Desk →
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Colonna Destra: Veri Medici in Turno & Équipe Attiva */}
              <div className="rounded-lg border border-[#c3c4c7] bg-white p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#dcdcde]">
                    <div>
                      <h2 className="font-serif text-base font-bold text-[#1d2327]">
                        👨‍⚕️ Medici Ufficiali in Turno
                      </h2>
                      <p className="text-[11px] text-[#50575e]">
                        Lun–Ven 09:00–19:00 · Sabato chiuso
                      </p>
                    </div>
                    <span className="rounded-full bg-teal-50 border border-teal-200 px-2.5 py-0.5 text-[11px] font-bold text-teal-800">
                      {activeDoctorsCount} attivi
                    </span>
                  </div>

                  {doctorsOnDutyToday.length > 0 ? (
                    <div className="mt-4 space-y-2.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
                        Con Pazienti in Agenda Oggi ({doctorsOnDutyToday.length})
                      </p>
                      {doctorsOnDutyToday.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between rounded-lg border border-teal-100 bg-teal-50/50 p-2.5 text-xs"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="font-bold text-slate-900 truncate">{doc.name}</p>
                            <p className="text-[11px] text-slate-600 truncate">
                              {doc.roomName} · {doc.title}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-full bg-white border border-teal-200 px-2 py-0.5 text-[10px] font-bold text-teal-800">
                            {doc.visitsCount} {doc.visitsCount === 1 ? "visita" : "visite"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Équipe Accreditata Cocoora
                    </p>
                    <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                      {activeDoctors.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between rounded-md bg-slate-50 px-2.5 py-1.5 text-[11px] border border-slate-100"
                        >
                          <span className="font-semibold text-slate-800 truncate">{doc.full_name}</span>
                          <span className="text-[10px] text-teal-700 font-medium shrink-0 ml-2">
                            {doc.full_name === "Patrizia Scorzelli"
                              ? "Operatrice Estetica"
                              : doc.title || "Attivo"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2">
                  <Link
                    href="/segreteria"
                    className="inline-flex items-center justify-center gap-1.5 rounded-md bg-teal-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-teal-800 transition-colors"
                  >
                    Gestisci al Desk Reception →
                  </Link>
                  <Link
                    href="/medico"
                    className="inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    👨‍⚕️ Apri Stanza Medico Live →
                  </Link>
                </div>
              </div>
            </div>

            {/* ── CARD METRICHE DI QUALITÀ CLINICA, ATTESE E DISDETTE (REALI) ── */}
            <div className="rounded-lg border border-[#c3c4c7] bg-white p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#dcdcde] gap-3">
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#1d2327]">
                    ⏱️ Qualità Clinica, Tempi d&apos;Attesa &amp; Tasso di Presenza
                  </h2>
                  <p className="text-xs text-[#50575e] mt-0.5">
                    Indicatori reali calcolati dal flusso di accoglienza al Desk Reception (Lun–Ven 09:00–19:00 ·
                    Sabato chiuso).
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-800">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    <span>
                      {dashboardMetrics.avgWaitMins <= 7
                        ? "Target Attesa < 7 min: Rispettato 🟢"
                        : "Monitoraggio Attesa Sala Attivo 🟡"}
                    </span>
                  </span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-lg border border-[#dcdcde] bg-[#f6f7f7] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#50575e]">
                      Tasso di Presenza
                    </p>
                    <span className="text-xs font-bold text-emerald-700">
                      {dashboardMetrics.showUpRate}%
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {dashboardMetrics.showUpRate}%
                  </p>
                  <p className="text-[11px] text-emerald-700 font-medium mt-1">
                    ✓ Calcolato sulle visite reali a sistema
                  </p>
                </div>

                <div className="rounded-lg border border-[#dcdcde] bg-[#f6f7f7] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#50575e]">
                      Tempo Attesa Medio
                    </p>
                    <span className="text-xs font-bold text-teal-700">Target 7m</span>
                  </div>
                  <p className="text-3xl font-bold text-teal-900 mt-1">
                    {dashboardMetrics.avgWaitMins} min
                  </p>
                  <p className="text-[11px] text-teal-700 font-medium mt-1">
                    <Clock className="inline h-3 w-3 mr-1" />
                    Telemetria Sala d&apos;Attesa → Studio
                  </p>
                </div>

                <div className="rounded-lg border border-[#dcdcde] bg-[#f6f7f7] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#50575e]">
                      Visite Riprogrammate
                    </p>
                    <span className="text-xs font-bold text-amber-700">Agenda</span>
                  </div>
                  <p className="text-3xl font-bold text-amber-900 mt-1">
                    {dashboardMetrics.rescheduled}
                  </p>
                  <p className="text-[11px] text-amber-700 font-medium mt-1">
                    Slot riallocati con preavviso
                  </p>
                </div>

                <div className="rounded-lg border border-[#dcdcde] bg-[#f6f7f7] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#50575e]">
                      Disdette &amp; No-Show
                    </p>
                    <span className="text-xs font-bold text-rose-700">Registro</span>
                  </div>
                  <p className="text-3xl font-bold text-rose-900 mt-1">
                    {dashboardMetrics.cancelled + dashboardMetrics.noShow}
                  </p>
                  <p className="text-[11px] text-rose-700 font-medium mt-1">
                    {dashboardMetrics.cancelled} disdette · {dashboardMetrics.noShow} no-show
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: CALENDARIO & INCROCIO */}
        {tab === "calendar" && <CalendarMatrix />}

        {/* TAB 2: MEDICI & PRESENZE */}
        {tab === "doctors" && <DoctorsManager />}

        {/* TAB 3: STANZE & SPAZI */}
        {tab === "rooms" && <RoomsManager />}

        {/* TAB 4: CRM PAZIENTI */}
        {tab === "crm" && <PatientsCrmAdmin onOpenCassa={() => setTab("cassa")} />}

        {/* TAB 5: CASSA & FLUSSI */}
        {tab === "cassa" && <CashFlowManager onOpenPatient={() => setTab("crm")} />}

        {/* TAB 5B: REGISTRO CONSENSI GDPR ART. 7 */}
        {tab === "consensi" && <ConsentsLedgerAdmin />}

        {/* TAB 6: VIDEO VERTICALI */}
        {tab === "videos" && <VideosManager />}

        {/* TAB 7: SEO & PAGINE */}
        {tab === "seo" && <SeoManager />}

        {/* TAB 8: ANALYTICS & MONITORAGGIO SILVIA */}
        {tab === "analytics" && <AnalyticsDashboard />}

        {/* TAB 9: SCATOLA NERA & TELEMETRIA INTERNA (100% DATI PROPRIETARI) */}
        {tab === "scatola-nera" && <ScatolaNeraDashboard />}
      </main>
    </div>
  );
}

function SidebarItem({
  active,
  onClick,
  icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-md px-3 py-2.5 text-xs font-semibold transition-all text-left",
        active
          ? "bg-[#2271b1] text-white shadow-xs font-bold"
          : "text-[#c3c4c7] hover:bg-[#2c3338] hover:text-white"
      )}
    >
      <div className="flex items-center gap-2.5">
        <span className={cn(active ? "text-white" : "text-[#787c82]")}>
          {icon}
        </span>
        <span>{label}</span>
      </div>
      {badge && (
        <span
          className={cn(
            "rounded px-1.5 py-0.5 text-[10px] font-mono",
            active
              ? "bg-white/20 text-white"
              : "bg-[#2c3338] text-[#787c82]"
          )}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
