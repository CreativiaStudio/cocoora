import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, DoorOpen, ExternalLink, Globe, LayoutDashboard, ShieldCheck, Stethoscope, User } from "lucide-react";
import { ReceptionCrm } from "@/components/reception/reception-crm";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Segreteria & Reception CRM — Cocoora Centro Medico",
  description:
    "Postazione operativa della segreteria: accoglienza pazienti, monitoraggio sale in tempo reale, consegna referti e gestione cassa.",
};

export default function SegreteriaPage() {
  return (
    <div className="min-h-screen bg-[#f0f0f1] text-[#2c3338] antialiased">
      {/* ── Top Bar Reception Gestionale ────────────────────────────── */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[#dcdcde] bg-white px-6 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-teal-800 text-white font-bold text-sm shadow-xs">
            📋
          </div>
          <div>
            <h2 className="text-xs font-bold text-[#1d2327] tracking-wide leading-tight">
              Cocoora Front-Desk
            </h2>
            <p className="text-[10px] text-[#787c82]">
              Postazione Operativa Reception
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-md border border-[#c3c4c7] bg-white px-3 py-1.5 text-xs font-semibold text-[#2c3338] shadow-2xs hover:bg-[#f6f7f7] hover:border-[#2271b1] transition-all"
          >
            <LayoutDashboard className="h-3.5 w-3.5 text-[#2271b1]" />
            <span>Pannello Direzione (Admin) →</span>
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

      {/* ── Cruscotto Reception ─────────────────────────────────────── */}
      <main className="p-6 sm:p-8 max-w-7xl mx-auto">
        <ReceptionCrm />
      </main>
    </div>
  );
}
