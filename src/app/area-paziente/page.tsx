import type { Metadata } from "next";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserCheck,
} from "lucide-react";
import { PatientCalendar } from "@/components/calendar/patient-calendar";
import { Container, SectionLabel } from "@/components/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Area Paziente — Calendario & Prenotazione Diretta | Cocoora Centro Medico",
  description:
    "Consulta in tempo reale la disponibilità dei medici e degli studi di Cocoora Centro Medico. Prenota la tua visita specialistica in pochi clic senza attese.",
};

export default function AreaPazientePage() {
  return (
    <main className="min-h-screen bg-slate-50/70 pt-28 sm:pt-32 pb-20">
      {/* ── Header Sezione ────────────────────────────────────────── */}
      <section className="border-b border-slate-200/80 bg-white py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel className="text-center">
              Area Paziente Digitale
            </SectionLabel>
            <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-navy-deep sm:text-4xl lg:text-5xl">
              Prenota la tua visita specialistica in tempo reale
            </h1>
            <p className="mt-4 text-base text-slate-600 sm:text-lg">
              Consulta le presenze effettive dei nostri medici specialisti e la disponibilità
              degli studi attrezzati. Scegli data e orario con conferma immediata.
            </p>

            {/* Badges Garanzia */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50/80 px-3.5 py-1 text-xs font-semibold text-teal-800">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
                Disponibilità verificata live
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50/80 px-3.5 py-1 text-xs font-semibold text-sky-800">
                <ShieldCheck className="h-3.5 w-3.5 text-sky-600" />
                Zero sovrapposizioni garantito
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-800">
                <UserCheck className="h-3.5 w-3.5 text-indigo-600" />
                18 Medici Specialisti
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Calendario Interattivo ──────────────────────────────────── */}
      <section className="py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-5xl">
            <PatientCalendar />
          </div>
        </Container>
      </section>

      {/* ── Supporto Diretto Reception ──────────────────────────────── */}
      <section className="mt-6 border-t border-slate-200/80 bg-white py-12">
        <Container>
          <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  Preferisci parlare con la reception?
                </span>
                <h3 className="mt-1 font-serif text-xl font-semibold text-navy-deep sm:text-2xl">
                  La nostra segreteria è a tua disposizione
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Per urgenze mediche, visite combinate o supporto nella scelta dello specialista.
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>{SITE.fullAddress}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`tel:${SITE.phone.replace(/\s+/g, "")}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-navy-deep shadow-2xs hover:bg-slate-50 transition-colors"
                >
                  <Phone className="h-4 w-4 text-teal-600" />
                  <span>{SITE.phone}</span>
                </a>
                <a
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-2xs hover:bg-emerald-700 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp Diretto</span>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
