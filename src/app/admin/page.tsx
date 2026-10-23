"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  Activity,
  ArrowLeft,
  Calendar,
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
  Search,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import { VideosManager } from "@/components/admin/videos-manager";
import { SeoManager } from "@/components/admin/seo-manager";
import { DoctorsManager } from "@/components/admin/doctors-manager";
import { RoomsManager } from "@/components/admin/rooms-manager";
import { CalendarMatrix } from "@/components/admin/calendar-matrix";
import { PatientsCrmAdmin } from "@/components/admin/patients-crm-admin";
import { cn } from "@/lib/utils";

type Tab = "dashboard" | "calendar" | "doctors" | "rooms" | "crm" | "videos" | "seo";

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
              badge="3 Sale"
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
              badge="Studio 1-3"
            />

            <SidebarItem
              active={tab === "crm"}
              onClick={() => setTab("crm")}
              icon={<Users className="h-4 w-4" />}
              label="Pazienti & Fascicoli CRM"
            />

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
            {tab === "crm" && "Pazienti & Fascicoli Clinici"}
            {tab === "videos" && "Video Verticali Reels"}
            {tab === "seo" && "SEO & Pagine Pubbliche"}
          </span>
        </div>

        {/* Status Database & Scorciatoie Ruoli */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-semibold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Supabase Cloud: Connesso (eu-west-1)</span>
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
                Panoramica operativa dello studio: 18 medici accreditati, 3 stanze specializzate e sincronizzazione in tempo reale con Supabase.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
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
                  <p className="text-3xl font-bold text-[#1d2327] mt-1">3</p>
                  <p className="text-[11px] text-teal-700 mt-1">Studio 1, 2, 3</p>
                </div>

                <div className="rounded-lg border border-[#dcdcde] bg-[#f6f7f7] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#50575e]">
                    Turni Settimanali
                  </p>
                  <p className="text-3xl font-bold text-[#1d2327] mt-1">22</p>
                  <p className="text-[11px] text-teal-700 mt-1">Zero overbooking</p>
                </div>

                <div className="rounded-lg border border-[#dcdcde] bg-[#f6f7f7] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#50575e]">
                    Pazienti a Sistema
                  </p>
                  <p className="text-3xl font-bold text-[#1d2327] mt-1">3 Demo</p>
                  <p className="text-[11px] text-teal-700 mt-1">Marco, Laura, Giulia</p>
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
                <Link
                  href="/segreteria"
                  className="rounded-md border border-sky-300 bg-sky-50 px-4 py-2 text-xs font-semibold text-sky-800 hover:bg-sky-100 transition-colors"
                >
                  Passa al Cruscotto Segreteria Live 📋
                </Link>
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

        {/* TAB 4: PAZIENTI & FASCICOLI CRM */}
        {tab === "crm" && <PatientsCrmAdmin />}

        {/* TAB 5: VIDEO VERTICALI */}
        {tab === "videos" && <VideosManager />}

        {/* TAB 6: SEO & PAGINE */}
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
