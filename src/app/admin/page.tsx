"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CalendarClock,
  CheckCircle2,
  Clock,
  CreditCard,
  Database,
  DoorOpen,
  ExternalLink,
  Eye,
  FileText,
  Film,
  Globe,
  HelpCircle,
  Home,
  LayoutDashboard,
  LayoutList,
  LogOut,
  RefreshCcw,
  RotateCcw,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  User,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import { VideosManager } from "@/components/admin/videos-manager";
import { SeoManager } from "@/components/admin/seo-manager";
import { DoctorsManager } from "@/components/admin/doctors-manager";
import { RoomsManager } from "@/components/admin/rooms-manager";
import { CalendarMatrix } from "@/components/admin/calendar-matrix";
import { PatientsCrmAdmin } from "@/components/admin/patients-crm-admin";
import { CashFlowManager } from "@/components/admin/cash-flow-manager";
import { cn } from "@/lib/utils";

type Tab =
  | "dashboard"
  | "calendar"
  | "doctors"
  | "rooms"
  | "crm"
  | "cassa"
  | "videos"
  | "seo";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("calendar");

  return (
    <div className="min-h-screen bg-[#f0f0f1] text-[#2c3338] font-sans antialiased">
      {/* ── 1. SIDEBAR LATERALE STILE WORDPRESS ──────────────────────── */}
      <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between bg-[#1d2327] text-[#c3c4c7] select-none border-r border-[#2c3338] shadow-lg">
        <div>
          {/* Header Brand Sidebar */}
          <div className="flex h-16 items-center justify-between border-b border-[#2c3338] bg-[#101517] px-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#2271b1] text-white font-bold text-base shadow-xs">
                C
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-wide">
                  Cocoora CRM
                </h2>
                <p className="text-[10px] text-[#787c82] tracking-wider uppercase">
                  Gestionale Clinico v2.4
                </p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-semibold text-emerald-400 border border-emerald-500/30">
              Live DB
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
            />

            <SidebarItem
              active={tab === "calendar"}
              onClick={() => setTab("calendar")}
              icon={<Calendar className="h-4 w-4" />}
              label="Calendario & Incrocio"
              badge="4 Studi + OPT"
            />

            <SidebarItem
              active={tab === "doctors"}
              onClick={() => setTab("doctors")}
              icon={<Stethoscope className="h-4 w-4" />}
              label="Corpo Medico & Turni"
              badge="18"
            />

            <SidebarItem
              active={tab === "rooms"}
              onClick={() => setTab("rooms")}
              icon={<DoorOpen className="h-4 w-4" />}
              label="Stanze & Spazi"
              badge="4 Studi + OPT"
            />

            <SidebarItem
              active={tab === "crm"}
              onClick={() => setTab("crm")}
              icon={<Users className="h-4 w-4" />}
              label="CRM pazienti"
              badge="3 attivi"
            />

            <SidebarItem
              active={tab === "cassa"}
              onClick={() => setTab("cassa")}
              icon={<CreditCard className="h-4 w-4" />}
              label="Cassa & Flussi"
              badge="Fatture/Rate"
            />

            <Link
              href="/admin/catalogo"
              className="flex items-center justify-between rounded-md px-3 py-2 text-xs font-semibold text-[#c3c4c7] hover:bg-[#2c3338] hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="h-4 w-4 text-teal-400" />
                <span>Catalogo Prestazioni</span>
              </div>
              <span className="rounded-full bg-teal-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-teal-300">
                78 Voci
              </span>
            </Link>

            <div className="my-2 border-t border-[#2c3338]"></div>

            <p className="px-3 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#787c82]">
              Marketing & Pagine
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

            <div className="my-2 border-t border-[#2c3338]"></div>

            <p className="px-3 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#787c82]">
              Simulatore Ruoli & Portale
            </p>

            <Link
              href="/segreteria"
              className="flex items-center justify-between rounded-md px-3 py-2 text-xs font-semibold text-[#c3c4c7] hover:bg-[#2c3338] hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm">📋</span>
                <span>Postazione Segreteria</span>
              </div>
              <ExternalLink className="h-3 w-3 text-[#787c82]" />
            </Link>

            <Link
              href="/segreteria/prenota"
              className="flex items-center justify-between rounded-md px-3 py-2 text-xs font-semibold text-[#c3c4c7] hover:bg-[#2c3338] hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm">⚡</span>
                <span>Prenotazione Rapida (3 Click)</span>
              </div>
              <ExternalLink className="h-3 w-3 text-[#787c82]" />
            </Link>

            <Link
              href="/area-paziente"
              className="flex items-center justify-between rounded-md px-3 py-2 text-xs font-semibold text-[#c3c4c7] hover:bg-[#2c3338] hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm">🩺</span>
                <span>Portale Paziente (Referti)</span>
              </div>
              <ExternalLink className="h-3 w-3 text-[#787c82]" />
            </Link>

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-md px-3 py-2 text-xs font-semibold text-[#c3c4c7] hover:bg-[#2c3338] hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Globe className="h-4 w-4 text-[#787c82]" />
                <span>Visualizza Sito Web</span>
              </div>
              <ExternalLink className="h-3 w-3 text-[#787c82]" />
            </Link>
          </nav>
        </div>

        {/* Profilo Utente Sidebar Bottom */}
        <div className="border-t border-[#2c3338] bg-[#101517] p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-800 text-white font-bold text-xs border border-teal-600">
                ER
              </div>
              <div className="leading-tight">
                <p className="text-xs font-semibold text-white">Dott.ssa Elisa Russo</p>
                <p className="text-[10px] text-[#787c82]">Direttrice Sanitaria</p>
              </div>
            </div>
            <Link
              href="/"
              title="Esci dal gestionale e torna al sito"
              className="rounded p-1.5 text-[#787c82] hover:bg-[#2c3338] hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* ── 2. TOP BAR ORIZZONTALE AMMINISTRATORE ────────────────────── */}
      <header className="fixed top-0 left-64 right-0 z-40 flex h-14 items-center justify-between border-b border-[#dcdcde] bg-white px-6 shadow-2xs">
        {/* Breadcrumb stile WordPress */}
        <div className="flex items-center gap-2 text-xs text-[#50575e]">
          <span className="font-semibold text-[#1d2327]">Cocoora CRM</span>
          <span>/</span>
          <span className="font-medium capitalize text-[#2271b1]">
            {tab === "dashboard" && "Dashboard Panoramica"}
            {tab === "calendar" && "Calendario & Incrocio Stanze"}
            {tab === "doctors" && "Gestione Medici & Presenze"}
            {tab === "rooms" && "Stanze & Macchinari"}
            {tab === "crm" && "CRM Pazienti (Anagrafiche & Cartelle)"}
            {tab === "cassa" && "Gestione Flusso di Cassa & Piani Rateali"}
            {tab === "videos" && "Video Verticali Reels"}
            {tab === "seo" && "SEO & Pagine Pubbliche"}
          </span>
        </div>

        {/* Status Database & Scorciatoie Ruoli */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-semibold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Database Clinico: Connesso (Crittografato)</span>
          </div>

          <Link
            href="/segreteria"
            className="inline-flex items-center gap-1.5 rounded-md border border-[#c3c4c7] bg-white px-3 py-1.5 text-xs font-semibold text-[#2c3338] shadow-2xs hover:bg-[#f6f7f7] hover:border-[#2271b1] transition-all"
          >
            <span>📋 Segreteria CRM</span>
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
              <h1 className="font-serif text-2xl font-bold text-[#1d2327]">
                Pannello Direzionale Cocoora Centro Medico
              </h1>
              <p className="text-xs text-[#50575e] mt-1">
                Panoramica operativa dello studio: 18 medici accreditati, 4 studi specializzati più la sala OPT e sincronizzazione in tempo reale con il Cloud Sanitario.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="rounded-lg border border-[#dcdcde] bg-[#f6f7f7] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#50575e]">
                    Medici Attivi
                  </p>
                  <p className="text-3xl font-bold text-[#1d2327] mt-1">18</p>
                  <p className="text-[11px] text-teal-700 mt-1">✓ Roster confermato</p>
                </div>

                <div className="rounded-lg border border-[#dcdcde] bg-[#f6f7f7] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#50575e]">
                    Stanze Operative
                  </p>
                  <p className="text-3xl font-bold text-[#1d2327] mt-1">5</p>
                  <p className="text-[11px] text-teal-700 mt-1">Studio 1-4 + OPT</p>
                </div>

                <div className="rounded-lg border border-[#dcdcde] bg-[#f6f7f7] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#50575e]">
                    Turni Settimanali
                  </p>
                  <p className="text-3xl font-bold text-[#1d2327] mt-1">22</p>
                  <p className="text-[11px] text-teal-700 mt-1">Zero overbooking</p>
                </div>

                <div
                  onClick={() => setTab("crm")}
                  className="rounded-lg border border-[#dcdcde] bg-[#f6f7f7] p-4 cursor-pointer hover:border-[#2271b1] transition-all"
                >
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#50575e]">
                    CRM Pazienti
                  </p>
                  <p className="text-3xl font-bold text-[#1d2327] mt-1">5</p>
                  <p className="text-[11px] text-teal-700 mt-1">Marco, Laura, Giulia, Matteo, Elena →</p>
                </div>

                <div
                  onClick={() => setTab("cassa")}
                  className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 cursor-pointer hover:border-emerald-500 transition-all"
                >
                  <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                    Cassa Incassata
                  </p>
                  <p className="text-3xl font-bold text-emerald-950 mt-1">€2.400</p>
                  <p className="text-[11px] text-emerald-700 mt-1">Gestione flussi →</p>
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
                  Cassa &amp; Avanzamento Pagamenti 💳
                </button>
                <Link
                  href="/segreteria"
                  className="rounded-md border border-sky-300 bg-sky-50 px-4 py-2 text-xs font-semibold text-sky-800 hover:bg-sky-100 transition-colors"
                >
                  Passa al Cruscotto Segreteria Live 📋
                </Link>
              </div>
            </div>

            {/* ── CARD LIVE PAZIENTI IN ATTESA DI ACCETTAZIONE AL BANCO (5 DEMO) ── */}
            <div className="rounded-lg border border-teal-200 bg-white p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-teal-100 gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-800 text-white font-bold text-lg shadow-xs">
                    📋
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-[#1d2327]">
                      Pazienti in Attesa di Accettazione al Banco Desk (Oggi)
                    </h2>
                    <p className="text-xs text-[#50575e]">
                      Flusso accoglienza in tempo reale: check-in paziente, verifica anamnesi e indirizzamento nelle sale cliniche.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-900">
                    5 Visite da Accogliere Oggi
                  </span>
                  <Link
                    href="/segreteria"
                    className="inline-flex items-center gap-1.5 rounded-md bg-teal-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-teal-800 transition-colors"
                  >
                    <span>Apri Desk Operativo Live ➔</span>
                  </Link>
                </div>
              </div>

              <div className="mt-4 divide-y divide-slate-100">
                <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 p-2.5 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-mono font-bold text-slate-800 border border-slate-200">
                      14:45
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">Marco De Luca</span>
                        <span className="rounded bg-slate-100 text-[10px] font-mono text-slate-600 px-1.5 py-0.5">COC-2026-01001</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Dott.ssa Elisa Russo · <span className="font-semibold text-teal-800">Studio 1</span> · Allineatori Trasparenti (Controllo serie 2)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-800">
                      <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                      Al Banco: Da Accettare
                    </span>
                    <Link
                      href="/segreteria"
                      className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
                    >
                      Fai Check-in ➔
                    </Link>
                  </div>
                </div>

                <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 p-2.5 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-mono font-bold text-slate-800 border border-slate-200">
                      15:00
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">Laura Ferri</span>
                        <span className="rounded bg-slate-100 text-[10px] font-mono text-slate-600 px-1.5 py-0.5">COC-2026-01002</span>
                        <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.2 text-[10px] font-semibold">Prima Visita</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Dott.ssa Alessandra Riccardi · <span className="font-semibold text-teal-800">Studio 2</span> · Consulenza Medicina Estetica Viso &amp; Biorivitalizzazione
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-800">
                      <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                      Al Banco: Da Accettare
                    </span>
                    <Link
                      href="/segreteria"
                      className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
                    >
                      Fai Check-in ➔
                    </Link>
                  </div>
                </div>

                <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 p-2.5 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-mono font-bold text-slate-800 border border-slate-200">
                      15:15
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">Giulia Esposito</span>
                        <span className="rounded bg-slate-100 text-[10px] font-mono text-slate-600 px-1.5 py-0.5">COC-2026-01003</span>
                        <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.2 text-[10px] font-semibold">Prima Visita</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Dr. Antonio Sorrentino · <span className="font-semibold text-teal-800">Studio 3</span> · Visita Specialistica Cardiologia + ECG a 12 derivazioni
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-800">
                      <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                      Al Banco: Da Accettare
                    </span>
                    <Link
                      href="/segreteria"
                      className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
                    >
                      Fai Check-in ➔
                    </Link>
                  </div>
                </div>

                <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 p-2.5 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-mono font-bold text-slate-800 border border-slate-200">
                      15:30
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">Matteo Rossi</span>
                        <span className="rounded bg-slate-100 text-[10px] font-mono text-slate-600 px-1.5 py-0.5">COC-2026-01004</span>
                        <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.2 text-[10px] font-semibold">Prima Visita</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Dr. Raffaele D&apos;Alessio · <span className="font-semibold text-teal-800">Studio 1</span> · Prima Visita Odontoiatrica &amp; Ortopantomografia (OPT)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-800">
                      <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                      Al Banco: Da Accettare
                    </span>
                    <Link
                      href="/segreteria"
                      className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
                    >
                      Fai Check-in ➔
                    </Link>
                  </div>
                </div>

                <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 p-2.5 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-mono font-bold text-slate-800 border border-slate-200">
                      15:45
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">Elena Caputo</span>
                        <span className="rounded bg-slate-100 text-[10px] font-mono text-slate-600 px-1.5 py-0.5">COC-2026-01005</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Dott.ssa Titti Errico · <span className="font-semibold text-teal-800">Studio 2</span> · Seduta Medicina Rigenerativa Viso &amp; Mantenimento
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-800">
                      <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                      Al Banco: Da Accettare
                    </span>
                    <Link
                      href="/segreteria"
                      className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
                    >
                      Fai Check-in ➔
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* ── CARD METRICHE DI QUALITÀ CLINICA, ATTESE E DISDETTE ── */}
            <div className="rounded-lg border border-[#c3c4c7] bg-white p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#dcdcde] gap-3">
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#1d2327]">
                    ⏱️ Qualità Clinica, Tempi d&apos;Attesa &amp; Tasso di Presenza
                  </h2>
                  <p className="text-xs text-[#50575e] mt-0.5">
                    Monitoraggio in tempo reale del flusso di accoglienza, rispetto del benchmark di puntualità e controllo delle disdette per massimizzare la saturazione degli studi.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-800">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    <span>Target Attesa &lt; 7 min: Rispettato 🟢</span>
                  </span>
                </div>
              </div>

              {/* Grid 4 KPI Chiave */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-lg border border-[#dcdcde] bg-[#f6f7f7] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#50575e]">
                      Tasso di Presenza
                    </p>
                    <span className="text-xs font-bold text-emerald-700">94%</span>
                  </div>
                  <p className="text-3xl font-bold text-slate-900 mt-1">94%</p>
                  <p className="text-[11px] text-emerald-700 font-medium mt-1">
                    ✓ Show-up sopra target (90%)
                  </p>
                </div>

                <div className="rounded-lg border border-[#dcdcde] bg-[#f6f7f7] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#50575e]">
                      Tempo Attesa Medio
                    </p>
                    <span className="text-xs font-bold text-teal-700">Target 7m</span>
                  </div>
                  <p className="text-3xl font-bold text-teal-900 mt-1">5m 30s</p>
                  <p className="text-[11px] text-teal-700 font-medium mt-1">
                    ✓ -1m 30s rispetto al limite
                  </p>
                </div>

                <div className="rounded-lg border border-[#dcdcde] bg-[#f6f7f7] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#50575e]">
                      Visite Spostate
                    </p>
                    <span className="text-xs font-bold text-amber-700">Riprogrammate</span>
                  </div>
                  <p className="text-3xl font-bold text-amber-900 mt-1">2</p>
                  <p className="text-[11px] text-amber-700 font-medium mt-1">
                    Slot salvati in agenda
                  </p>
                </div>

                <div className="rounded-lg border border-[#dcdcde] bg-[#f6f7f7] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#50575e]">
                      Disdette &amp; No-Show
                    </p>
                    <span className="text-xs font-bold text-rose-700">Mese in corso</span>
                  </div>
                  <p className="text-3xl font-bold text-rose-900 mt-1">1</p>
                  <p className="text-[11px] text-rose-700 font-medium mt-1">
                    1 disdetta con preavviso · 0 no-show
                  </p>
                </div>
              </div>

              {/* Registro Rapido Azioni Reception */}
              <div className="mt-5 rounded-lg border border-[#dcdcde] bg-[#fafafa] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-[#1d2327]">
                    Registro Monitoraggio Slot &amp; Puntualità Clinica
                  </p>
                  <Link
                    href="/segreteria"
                    className="text-xs font-semibold text-[#2271b1] hover:underline"
                  >
                    Vedi tutte le visite al banco desk →
                  </Link>
                </div>
                <div className="mt-3 divide-y divide-[#e5e5e5] text-xs">
                  <div className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">Marco Esposito (PZ-001)</span>
                      <span className="text-slate-500">— Visita Odontoiatrica</span>
                    </div>
                    <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 font-semibold text-[11px]">
                      Puntuale (Attesa: 4 min)
                    </span>
                  </div>
                  <div className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">Laura De Rosa (PZ-002)</span>
                      <span className="text-slate-500">— Controllo Medicina Estetica</span>
                    </div>
                    <span className="rounded bg-amber-100 text-amber-800 px-2 py-0.5 font-semibold text-[11px]">
                      Spostato al 24/10 ore 11:00 (Richiesta paziente)
                    </span>
                  </div>
                  <div className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">Giulia Romano (PZ-003)</span>
                      <span className="text-slate-500">— Prima Visita Ortodonzia Pediatrica</span>
                    </div>
                    <span className="rounded bg-teal-100 text-teal-800 px-2 py-0.5 font-semibold text-[11px]">
                      In Studio (Attesa: 6 min)
                    </span>
                  </div>
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

        {/* TAB 6: VIDEO VERTICALI */}
        {tab === "videos" && <VideosManager />}

        {/* TAB 7: SEO & PAGINE */}
        {tab === "seo" && <SeoManager />}
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
