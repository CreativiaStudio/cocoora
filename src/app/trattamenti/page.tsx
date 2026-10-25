"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Smile, Stethoscope, ArrowRight, ShieldCheck, CheckCircle2, Search } from "lucide-react";
import { TREATMENTS } from "@/lib/content";
import { SPECIALTIES } from "@/lib/diagnostics";
import { Container, Badge, ButtonLink } from "@/components/ui";
import { cn } from "@/lib/utils";

const serif = { fontFamily: '"Cormorant Garamond", "EB Garamond", Garamond, serif' };

type FilterCategory = "all" | "odontoiatria" | "medicina-estetica" | "diagnostica";

export default function TrattamentiIndexPage() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("all");
  const [search, setSearch] = useState("");

  const filteredTreatments = TREATMENTS.filter((t) => {
    const matchesCat = activeCategory === "all" || t.category === activeCategory;
    const matchesSearch =
      search === "" ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.tagline.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const showSpecialties = activeCategory === "all" || activeCategory === "diagnostica";
  const filteredSpecialties = SPECIALTIES.filter((s) => {
    return (
      search === "" ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <main className="bg-stone-50 min-h-screen text-stone-900 pb-28">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[46vh] items-end overflow-hidden bg-emerald-950 pb-16 pt-36">
        <div className="absolute inset-0">
          <Image
            src="/images/laser-technology.jpg"
            alt="Percorsi Clinici e Trattamenti Cocoora Centro Medico"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/75 to-emerald-950/30" />
        </div>

        <Container className="relative z-10">
          <div className="max-w-3xl">
            <Badge className="mb-4 border border-amber-300/40 bg-amber-50/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-amber-200">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Guida ai Percorsi Clinici
            </Badge>
            <h1 style={serif} className="text-4xl sm:text-5xl lg:text-6xl font-medium text-white leading-tight">
              Medicina Estetica, Odontoiatria e Visite Specialistiche
            </h1>
            <p className="mt-4 text-base sm:text-lg text-stone-200 font-light leading-relaxed">
              Dall&apos;ortodonzia digitale con scanner 3D alla medicina rigenerativa, fino alle visite specialistiche coordinate su appuntamento dedicato.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Barra Filtri & Ricerca ───────────────────────────────────── */}
      <section className="sticky top-[72px] z-30 border-b border-stone-200/80 bg-white/90 backdrop-blur-md py-4 shadow-xs">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Pillole Categoria */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
                  activeCategory === "all"
                    ? "bg-emerald-950 text-white shadow-xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                )}
              >
                Tutti i Trattamenti ({TREATMENTS.length + SPECIALTIES.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("odontoiatria")}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5",
                  activeCategory === "odontoiatria"
                    ? "bg-teal-800 text-white shadow-xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                )}
              >
                <Smile className="h-3.5 w-3.5" /> Sorriso & Odontoiatria (
                {TREATMENTS.filter((t) => t.category === "odontoiatria").length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("medicina-estetica")}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5",
                  activeCategory === "medicina-estetica"
                    ? "bg-rose-900 text-white shadow-xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                )}
              >
                <Sparkles className="h-3.5 w-3.5" /> Medicina Estetica (
                {TREATMENTS.filter((t) => t.category === "medicina-estetica").length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory("diagnostica")}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5",
                  activeCategory === "diagnostica"
                    ? "bg-amber-900 text-white shadow-xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                )}
              >
                <Stethoscope className="h-3.5 w-3.5" /> Visite Specialistiche (6)
              </button>
            </div>

            {/* Ricerca per Testo */}
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cerca trattamento o sintomo..."
                className="w-full rounded-full border border-stone-200 bg-stone-50 py-1.5 pl-9 pr-4 text-xs text-stone-800 placeholder:text-stone-400 focus:border-emerald-800 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ── Griglia Trattamenti con Scheda Dedicata ────────────────────── */}
      <Container className="pt-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 style={serif} className="text-2xl font-medium text-emerald-950 sm:text-3xl">
            {activeCategory === "diagnostica" ? "Branche delle Visite Specialistiche" : "Schede Trattamenti Clinici"}
          </h2>
          <span className="text-xs text-stone-500 font-light">
            {filteredTreatments.length + (showSpecialties ? filteredSpecialties.length : 0)} risultati disponibili
          </span>
        </div>

        {activeCategory !== "diagnostica" && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTreatments.map((t) => (
              <Link
                key={t.slug}
                href={`/trattamenti/${t.slug}`}
                className="group flex flex-col justify-between rounded-3xl border border-stone-200 bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-700/40"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className={cn(
                        "rounded-full px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
                        t.category === "odontoiatria"
                          ? "bg-teal-50 text-teal-800 border border-teal-200"
                          : "bg-rose-50 text-rose-800 border border-rose-200"
                      )}
                    >
                      {t.category === "odontoiatria" ? "Sorriso & Denti" : "Medicina Estetica"}
                    </span>
                    {t.slug.includes("invisalign") && (
                      <span className="text-[10px] bg-teal-100 text-teal-900 font-bold px-2 py-0.5 rounded-full">
                        ALLINEATORI
                      </span>
                    )}
                  </div>

                  <h3 style={serif} className="text-2xl font-medium text-emerald-950 group-hover:text-emerald-800 transition-colors">
                    {t.title}
                  </h3>

                  <p className="mt-2 text-xs font-medium uppercase tracking-wider text-amber-700">
                    {t.tagline}
                  </p>

                  <p className="mt-3 text-sm text-stone-600 font-light leading-relaxed line-clamp-3">
                    {t.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-stone-100">
                  <span className="text-xs font-semibold text-emerald-950 group-hover:text-amber-700 transition-colors inline-flex items-center gap-1">
                    Vedi scheda trattamento <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="text-[11px] text-stone-400">Su appuntamento</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ── Sezione Visite Specialistiche ────────────────────────────── */}
        {showSpecialties && (
          <div className="mt-16">
            <div className="mb-6 border-t border-stone-200 pt-10">
              <h2 style={serif} className="text-2xl font-medium text-emerald-950 sm:text-3xl">
                Visite Specialistiche &amp; Diagnostica
              </h2>
              <p className="mt-1 text-xs text-stone-500 font-light">
                Consulti multidisciplinari con équipe specialistica dedicata.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSpecialties.map((s) => (
                <Link
                  key={s.id}
                  href={`/servizi/diagnostica#${s.id}`}
                  className="group flex flex-col justify-between rounded-3xl border border-stone-200 bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-amber-600/40"
                >
                  <div>
                    <span className="rounded-full bg-amber-50 text-amber-900 border border-amber-200 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider mb-4 inline-block">
                      Visita Specialistica
                    </span>
                    <h3 style={serif} className="text-2xl font-medium text-emerald-950 group-hover:text-amber-800 transition-colors">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-sm text-stone-600 font-light leading-relaxed">
                      {s.description}
                    </p>
                    <ul className="mt-4 space-y-1.5">
                      {s.exams.slice(0, 3).map((e) => (
                        <li key={e} className="text-xs text-stone-500 flex items-center gap-1.5">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{e}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-stone-100">
                    <span className="text-xs font-semibold text-emerald-950 group-hover:text-amber-700 transition-colors inline-flex items-center gap-1">
                      Dettaglio esami & medici <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                    <span className="text-[11px] text-emerald-700 font-medium">Su appuntamento</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Banner Ponte Club ───────────────────────────────────────── */}
        <div className="mt-16 rounded-[2.5rem] bg-emerald-950 p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> Continuità Clinica · Cocoora Club
            </span>
            <h3 style={serif} className="mt-2 text-3xl font-medium sm:text-4xl">
              Prevenzione strutturata nei Percorsi Salute annuali
            </h3>
            <p className="mt-3 text-sm text-stone-300 font-light leading-relaxed">
              Con Cocoora Club accedi a programmi annuali di prevenzione coordinata, con cartella clinica digitale, check-up dedicati e continuità assistenziale tra le diverse branche del centro.
            </p>
          </div>
          <div className="flex shrink-0 flex-col sm:flex-row gap-3">
            <ButtonLink href="/club" className="rounded-full bg-amber-200 text-emerald-950 hover:bg-amber-100">
              Scopri i Percorsi Salute
            </ButtonLink>
            <ButtonLink href="/contatti" variant="outline-dark" className="rounded-full border-white/25 bg-white/5 text-white hover:bg-white/10">
              Prenota una Visita
            </ButtonLink>
          </div>
        </div>
      </Container>
    </main>
  );
}
