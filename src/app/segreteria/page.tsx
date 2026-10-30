"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  DoorOpen,
  ExternalLink,
  FileText,
  Globe,
  LayoutDashboard,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  User,
  UserCheck,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import { CalendarMatrix } from "@/components/admin/calendar-matrix";
import { PatientsCrmAdmin } from "@/components/admin/patients-crm-admin";
import { ReceptionDeskLive } from "@/components/reception/reception-desk-live";
import { ReceptionCashDesk } from "@/components/reception/reception-cash-desk";
import { ReceptionDocumentsDesk } from "@/components/reception/reception-documents-desk";
import { cn } from "@/lib/utils";

type ReceptionTab = "desk" | "calendar" | "crm" | "cassa" | "referti";

export default function SegreteriaPage() {
  const [tab, setTab] = useState<ReceptionTab>("desk");

  return (
    <div className="min-h-screen bg-[#f0f0f1] text-[#2c3338] font-sans antialiased">
      {/* ── 1. SIDEBAR WORDPRESS STYLE PER SEGRETERIA ────────────────── */}
      <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between bg-[#1d2327] text-[#c3c4c7] select-none border-r border-[#2c3338] shadow-lg">
        <div>
          {/* Header Brand Sidebar */}
          <div className="flex h-16 items-center justify-between border-b border-[#2c3338] bg-[#101517] px-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-teal-700 text-white font-bold text-base shadow-xs">
                📋
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-wide">
                  Cocoora Desk
                </h2>
                <p className="text-[10px] text-[#787c82] tracking-wider uppercase">
                  Gestionale Reception v2.4
                </p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-semibold text-emerald-400 border border-emerald-500/30">
              Live Desk
            </span>
          </div>

          {/* Menu Voci Segreteria */}
          <nav className="mt-3 px-2 space-y-1">
            <Link
              href="/segreteria/prenota"
              className="flex items-center justify-between rounded-md px-3 py-2 text-xs font-bold text-white bg-teal-800/90 hover:bg-teal-700 transition-colors shadow-xs mb-2 border border-teal-600/40"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm">⚡</span>
                <span>Prenota in 3 Click</span>
              </div>
              <span className="rounded-full bg-emerald-400/20 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-300">
                Rapido
              </span>
            </Link>

            <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#787c82]">
              Front-Office Clinico
            </p>

            <SidebarItem
              active={tab === "desk"}
              onClick={() => setTab("desk")}
              icon={<UserCheck className="h-4 w-4" />}
              label="Desk Visite di Oggi"
              badge="Accoglienza"
            />

            <SidebarItem
              active={tab === "calendar"}
              onClick={() => setTab("calendar")}
              icon={<Calendar className="h-4 w-4" />}
              label="Calendario & Prenotazioni"
              badge="4 Studi + OPT"
            />

            <SidebarItem
              active={tab === "crm"}
              onClick={() => setTab("crm")}
              icon={<Users className="h-4 w-4" />}
              label="CRM pazienti"
              badge="Cartelle"
            />

            <SidebarItem
              active={tab === "cassa"}
              onClick={() => setTab("cassa")}
              icon={<CreditCard className="h-4 w-4" />}
              label="Cassa & Chiusura Desk"
              badge="POS / Cassa"
            />

            <SidebarItem
              active={tab === "referti"}
              onClick={() => setTab("referti")}
              icon={<FileText className="h-4 w-4" />}
              label="Fascicolo Referti PDF"
              badge="Stampa"
            />

            <div className="my-2 border-t border-[#2c3338]"></div>

            <p className="px-3 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#787c82]">
              Scorciatoie &amp; Viste
            </p>

            <Link
              href="/admin"
              className="flex items-center justify-between rounded-md px-3 py-2 text-xs font-semibold text-[#c3c4c7] hover:bg-[#2c3338] hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm">🏛️</span>
                <span>Pannello Direzione (Admin)</span>
              </div>
              <ExternalLink className="h-3 w-3 text-[#787c82]" />
            </Link>

            <Link
              href="/admin/catalogo"
              className="flex items-center justify-between rounded-md px-3 py-2 text-xs font-semibold text-[#c3c4c7] hover:bg-[#2c3338] hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm">📋</span>
                <span>Catalogo Prestazioni & Tariffe</span>
              </div>
              <span className="rounded-full bg-teal-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-teal-300">
                78 Voci
              </span>
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

        {/* Profilo Operatore Segreteria (Nessun nome non contrattualizzato) */}
        <div className="border-t border-[#2c3338] bg-[#101517] p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-800 text-white font-bold text-xs border border-teal-600">
                RC
              </div>
              <div className="leading-tight">
                <p className="text-xs font-semibold text-white">Segreteria Operativa</p>
                <p className="text-[10px] text-[#787c82]">Accoglienza &amp; Cassa Desk</p>
              </div>
            </div>
            <Link
              href="/"
              title="Esci dal gestionale"
              className="rounded p-1.5 text-[#787c82] hover:bg-[#2c3338] hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* ── 2. TOP BAR ORIZZONTALE SEGRETERIA ────────────────────────── */}
      <header className="fixed top-0 left-64 right-0 z-40 flex h-14 items-center justify-between border-b border-[#dcdcde] bg-white px-6 shadow-2xs">
        {/* Breadcrumb stile WordPress */}
        <div className="flex items-center gap-2 text-xs text-[#50575e]">
          <span className="font-semibold text-[#1d2327]">Cocoora Desk</span>
          <span>/</span>
          <span className="font-medium capitalize text-[#2271b1]">
            {tab === "desk" && "Desk Visite di Oggi (Accoglienza & Cassa)"}
            {tab === "calendar" && "Calendario Generale & Incrocio Stanze"}
            {tab === "crm" && "CRM Pazienti (Cartelle Cliniche & Saldi)"}
            {tab === "cassa" && "Cassa Desk & Chiusura Giornaliera"}
            {tab === "referti" && "Fascicolo Referti PDF & Stampa"}
          </span>
        </div>

        {/* Status Database & Scorciatoie */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-semibold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Database Clinico: Connesso (Crittografato)</span>
          </div>

          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-md border border-[#c3c4c7] bg-white px-3 py-1.5 text-xs font-semibold text-[#2c3338] shadow-2xs hover:bg-[#f6f7f7] hover:border-[#2271b1] transition-all"
          >
            <span>🏛️ Pannello Direzione (Admin)</span>
          </Link>

          <Link
            href="/area-paziente"
            className="inline-flex items-center gap-1.5 rounded-md border border-teal-300 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800 shadow-2xs hover:bg-teal-100 transition-all"
          >
            <span>🩺 Vista Paziente</span>
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

      {/* ── 3. CONTENUTO PRINCIPALE SEGRETERIA ───────────────────────── */}
      <main className="ml-64 pt-20 p-8 min-h-screen">
        {/* TAB 1: DESK VISITE DI OGGI */}
        {tab === "desk" && (
          <ReceptionDeskLive
            onOpenPatient={(id) => setTab("crm")}
            onOpenCassa={() => setTab("cassa")}
          />
        )}

        {/* TAB 2: CALENDARIO & PRENOTAZIONI */}
        {tab === "calendar" && <CalendarMatrix />}

        {/* TAB 3: CRM PAZIENTI */}
        {tab === "crm" && <PatientsCrmAdmin onOpenCassa={() => setTab("cassa")} />}

        {/* TAB 4: CASSA & CHIUSURA DESK */}
        {tab === "cassa" && <ReceptionCashDesk onOpenPatient={(id) => setTab("crm")} />}

        {/* TAB 5: FASCICOLO REFERTI PDF */}
        {tab === "referti" && <ReceptionDocumentsDesk />}
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
  icon: React.ReactNode;
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
        <span className={cn(active ? "text-white" : "text-[#787c82]")}>{icon}</span>
        <span>{label}</span>
      </div>
      {badge && (
        <span
          className={cn(
            "rounded px-1.5 py-0.5 text-[10px] font-mono",
            active ? "bg-white/20 text-white" : "bg-[#2c3338] text-[#787c82]"
          )}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
