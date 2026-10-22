import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { ReceptionCrm } from "@/components/reception/reception-crm";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Segreteria & Reception CRM — Cocoora Centro Medico",
  description:
    "Postazione operativa della segreteria: accoglienza pazienti, monitoraggio sale in tempo reale, consegna referti e gestione cassa.",
};

export default function SegreteriaPage() {
  return (
    <main className="min-h-screen bg-slate-50/80 pt-24 sm:pt-28 pb-20">
      <Container>
        <div className="mx-auto max-w-6xl">
          {/* Top Bar navigazione rapida */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-accent">
                Ecosistema Clinico Cocoora
              </p>
              <h1 className="mt-1 font-serif text-3xl font-semibold text-navy-deep sm:text-4xl">
                Segreteria &amp; Front-Desk
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Gestione flussi di accoglienza, monitoraggio delle sale, fascicoli e pagamenti in tempo reale.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
              >
                <span>Passa a Vista Admin →</span>
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-full bg-teal-800 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-navy-deep transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Torna al Sito</span>
              </Link>
            </div>
          </div>

          {/* Cruscotto CRM */}
          <ReceptionCrm />
        </div>
      </Container>
    </main>
  );
}
