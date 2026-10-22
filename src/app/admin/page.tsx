"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Calendar,
  DoorOpen,
  Film,
  LayoutList,
  RotateCcw,
  Stethoscope,
} from "lucide-react";
import { cmsStore } from "@/lib/cms-store";
import { VideosManager } from "@/components/admin/videos-manager";
import { SeoManager } from "@/components/admin/seo-manager";
import { DoctorsManager } from "@/components/admin/doctors-manager";
import { RoomsManager } from "@/components/admin/rooms-manager";
import { CalendarMatrix } from "@/components/admin/calendar-matrix";
import { PatientsCrmAdmin } from "@/components/admin/patients-crm-admin";
import { cn } from "@/lib/utils";

type Tab = "calendar" | "doctors" | "rooms" | "crm" | "videos" | "seo";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("calendar");

  return (
    <div className="min-h-screen bg-canvas pt-24">
      <div className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-accent">
              Gestionale CRM &amp; Piattaforma Clinica
            </p>
            <h1 className="mt-1 font-serif text-3xl font-semibold text-teal-900">
              Pannello di Controllo Cocoora
            </h1>
            <p className="mt-1 text-sm text-charcoal/60">
              Gestione Medici, Stanze, Calendario Visite e Contenuti Digitali
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/segreteria"
              className="inline-flex items-center gap-1.5 rounded-full border border-sky-300 bg-sky-50 px-3.5 py-1.5 text-xs font-semibold text-sky-800 hover:bg-sky-100 transition-colors"
            >
              <span>Vista Segreteria →</span>
            </Link>
            <Link
              href="/area-paziente"
              className="inline-flex items-center gap-1.5 rounded-full border border-teal-300 bg-teal-50 px-3.5 py-1.5 text-xs font-semibold text-teal-800 hover:bg-teal-100 transition-colors"
            >
              <span>Vista Paziente →</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-primary-teal px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-dark-navy"
            >
              <ArrowLeft className="h-4 w-4" /> Torna al sito
            </Link>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-8 flex flex-wrap gap-1.5 rounded-2xl sm:rounded-full border border-teal-100 bg-white p-1.5 shadow-sm">
          <TabButton
            active={tab === "calendar"}
            onClick={() => setTab("calendar")}
            icon={<Calendar className="h-4 w-4" />}
          >
            Calendario &amp; Incrocio
          </TabButton>
          <TabButton
            active={tab === "doctors"}
            onClick={() => setTab("doctors")}
            icon={<Stethoscope className="h-4 w-4" />}
          >
            Medici &amp; Presenze
          </TabButton>
          <TabButton
            active={tab === "rooms"}
            onClick={() => setTab("rooms")}
            icon={<DoorOpen className="h-4 w-4" />}
          >
            Stanze &amp; Spazi
          </TabButton>
          <TabButton
            active={tab === "crm"}
            onClick={() => setTab("crm")}
            icon={<LayoutList className="h-4 w-4" />}
          >
            Pazienti &amp; Fascicoli CRM
          </TabButton>
          <TabButton
            active={tab === "videos"}
            onClick={() => setTab("videos")}
            icon={<Film className="h-4 w-4" />}
          >
            Video Verticali
          </TabButton>
          <TabButton
            active={tab === "seo"}
            onClick={() => setTab("seo")}
            icon={<LayoutList className="h-4 w-4" />}
          >
            SEO &amp; Pagine
          </TabButton>
        </div>

        {/* Contenuto Tab */}
        <div className="mt-8">
          {tab === "calendar" && <CalendarMatrix />}
          {tab === "doctors" && <DoctorsManager />}
          {tab === "rooms" && <RoomsManager />}
          {tab === "crm" && <PatientsCrmAdmin />}
          {tab === "videos" && <VideosManager />}
          {tab === "seo" && <SeoManager />}
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
        active ? "bg-teal-600 text-white" : "text-charcoal/60 hover:text-teal-700"
      )}
    >
      {icon}
      {children}
    </button>
  );
}
