"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, GraduationCap, Search, ShieldCheck, X } from "lucide-react";
import { BRANCHE, DOCTORS } from "@/lib/doctors";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Badge, Button, ButtonLink, Container, SectionLabel } from "@/components/ui";

// Mappatura etichette brevi per una UI più pulita ed elegante
const BRANCA_SHORT_LABELS: Record<string, string> = {
  "Tutte": "Tutti gli Specialisti",
  "Odontoiatria & Ortodonzia Digitale": "Odontoiatria & Ortodonzia",
  "Medicina Estetica Avanzata": "Medicina Estetica",
  "Cardiologia & Prevenzione Cardiovascolare": "Cardiologia",
  "Senologia & Prevenzione Donna": "Senologia",
  "Ecografia & Diagnostica per Immagini": "Ecografia & Diagnostica",
  "Oculistica & Salute della Vista": "Oculistica",
  "Pediatria & Cura della Crescita": "Pediatria",
  "Ginecologia & Benessere Intimo": "Ginecologia",
  "Nutrizione Clinica & Metabolismo": "Nutrizione Clinica",
};

export default function MediciPage() {
  const [filter, setFilter] = useState<string>("Tutte");
  const [search, setSearch] = useState<string>("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return DOCTORS.filter((d) => {
      // Filtro per branca
      const matchesBranch = filter === "Tutte" || d.branca === filter;
      if (!matchesBranch) return false;

      // Filtro per testo di ricerca
      if (!q) return true;
      const matchName = d.name.toLowerCase().includes(q);
      const matchTitle = d.title.toLowerCase().includes(q);
      const matchBranch = d.branca.toLowerCase().includes(q);
      const matchServices = d.servizi.some((s) => s.toLowerCase().includes(q));
      const matchApproach = d.approach.toLowerCase().includes(q);
      const matchAffiliation = d.affiliation.toLowerCase().includes(q);

      return matchName || matchTitle || matchBranch || matchServices || matchApproach || matchAffiliation;
    });
  }, [filter, search]);

  const resetFilters = () => {
    setFilter("Tutte");
    setSearch("");
  };

  return (
    <>
      {/* ── Banner Fullwidth compatto sotto al menu ───────────────────── */}
      <section className="relative w-full overflow-hidden bg-dark-navy pt-20 sm:pt-24">
        <div className="relative h-[180px] sm:h-[210px] lg:h-[230px] w-full overflow-hidden">
          <Image
            src="/images/medici-hero-banner.jpg"
            alt="Équipe medica e clinica Cocoora a Napoli"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Gradienti per leggibilità e texture */}
          <div className="absolute inset-0 bg-gradient-to-r from-dark-navy/95 via-dark-navy/80 to-dark-navy/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-navy/90 via-transparent to-transparent" />
          <div className="noise pointer-events-none absolute inset-0" />

          {/* Testo in overlay posizionato all'interno del Container */}
          <div className="relative z-10 flex h-full items-center">
            <Container>
              <div className="max-w-3xl">
                <Badge className="bg-white/15 text-white border-white/20 backdrop-blur-sm text-[11px] py-0.5">
                  <ShieldCheck className="h-3 w-3 text-teal-300" /> Prima visita garantita entro 72h · Federico II & Vanvitelli
                </Badge>
                <h1 className="mt-2 font-serif text-2xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                  I nostri specialisti
                </h1>
                <p className="mt-1.5 max-w-2xl text-xs sm:text-sm leading-relaxed text-teal-100/90 line-clamp-2">
                  Medici con cattedre universitarie e convenzioni ospedaliere a Napoli. Visite immediate senza attese e approccio Amico Medico.
                </p>
              </div>
            </Container>
          </div>
        </div>
      </section>

      {/* ── Sezione Ricerca & Filtri per Branca Specialistica (Compatta) ─ */}
      <section className="bg-canvas/95 border-b border-teal-100/70 py-3 sm:py-3.5 sticky top-14 sm:top-16 z-20 backdrop-blur-md shadow-xs transition-all">
        <Container>
          <div className="mx-auto max-w-5xl space-y-2">
            {/* Riga 1: Barra di ricerca snella + Contatore e reset */}
            <div className="flex items-center gap-2.5">
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-teal-800/60">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cerca per medico, prestazione o branca (es. Sorrentino, Invisalign, Cuore, Ecografia)..."
                  className="w-full rounded-xl border border-teal-200/80 bg-white py-2 pl-9 pr-9 text-xs sm:text-sm text-charcoal placeholder:text-charcoal/45 shadow-xs transition-all focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/15"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-charcoal/40 hover:text-charcoal transition-colors"
                    title="Cancella ricerca"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-semibold text-teal-900 bg-white px-2.5 py-1.5 rounded-lg border border-teal-200/70 shadow-xs whitespace-nowrap">
                  {filtered.length} {filtered.length === 1 ? "medico" : "specialisti"}
                </span>

                {(search || filter !== "Tutte") && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-[11px] font-semibold text-teal-800 hover:text-dark-navy underline underline-offset-2 whitespace-nowrap transition-colors"
                  >
                    Azzera
                  </button>
                )}
              </div>
            </div>

            {/* Riga 2: Pillole orizzontali monoriga a scorrimento senza wrap */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none flex-nowrap">
              {["Tutte", ...BRANCHE].map((b) => {
                const label = BRANCA_SHORT_LABELS[b] || b;
                const isSelected = filter === b;
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setFilter(b)}
                    className={cn(
                      "shrink-0 rounded-full border px-3 py-1 text-[11px] sm:text-xs font-medium transition-all duration-150 whitespace-nowrap",
                      isSelected
                        ? "border-teal-900 bg-teal-900 text-white shadow-xs font-semibold"
                        : "border-teal-200/70 bg-white text-charcoal/70 hover:border-teal-400 hover:text-teal-950"
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Griglia Specialisti ───────────────────────────────────────── */}
      <section className="bg-canvas py-10 sm:py-14 pb-24">
        <Container>
          {filtered.length > 0 ? (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((doctor) => (
                <Link
                  key={doctor.slug}
                  href={`/medici/${doctor.slug}`}
                  className="group flex flex-col overflow-hidden rounded-[2rem] border border-teal-100/80 bg-white shadow-[0_20px_50px_-28px_rgba(3,53,75,0.22)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_32px_70px_-24px_rgba(3,53,75,0.35)] hover:border-teal-300"
                >
                  {/* Ritratto medico in formato verticale (3:4) con focus volto */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-teal-50">
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      fill
                      sizes="(min-width: 1024px) 400px, 90vw"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-navy/90 via-dark-navy/20 to-transparent" />
                    
                    {/* Badge superiore */}
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-teal-900 shadow-sm backdrop-blur-sm">
                      <ShieldCheck className="h-3 w-3 text-teal-600" /> Zero Attese
                    </span>

                    {/* Nome e Branca in overlay inferiore sul ritratto */}
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                      <p className="font-serif text-xl sm:text-2xl font-semibold leading-snug text-white drop-shadow-sm">
                        {doctor.name}
                      </p>
                      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-teal-200">
                        {doctor.branca}
                      </p>
                    </div>
                  </div>

                  {/* Dati Clinici e Approccio */}
                  <div className="flex flex-1 flex-col p-6">
                    <p className="flex items-start gap-2 text-xs leading-relaxed text-charcoal/65">
                      <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-slate-accent" />
                      <span>{doctor.affiliation}</span>
                    </p>
                    <p className="mt-3.5 flex-1 text-sm leading-relaxed text-charcoal/75 line-clamp-3">
                      {doctor.approach}
                    </p>
                    <div className="mt-5 flex items-center justify-between border-t border-teal-50 pt-4">
                      <span className="text-xs text-charcoal/60">
                        Visita da <strong className="text-teal-900 text-sm font-semibold">{formatPrice(doctor.tariffaVisita)}</strong>
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 transition-colors group-hover:text-dark-navy">
                        Scopri profilo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Empty state se nessun medico corrisponde ai filtri */
            <div className="mx-auto max-w-xl rounded-3xl border border-teal-100 bg-white p-8 sm:p-12 text-center shadow-md">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-800 mb-5">
                <Search className="h-8 w-8 text-teal-800" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-dark-navy">
                Nessuno specialista trovato
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                Non abbiamo trovato medici corrispondenti a <strong className="text-teal-900">«{search || filter}»</strong>. La nostra équipe accoglie continuamente nuovi docenti universitari e specialisti ospedalieri.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button onClick={resetFilters} variant="primary">
                  Mostra tutti gli specialisti
                </Button>
                <ButtonLink href="tel:08118182091" variant="secondary">
                  Chiama la segreteria (081 18182091)
                </ButtonLink>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* ── Banner Percorsi Cocoora Club ──────────────────────────────── */}
      <section className="section-alt py-20">
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-dark-navy px-8 py-14 text-center text-white sm:px-16 shadow-[0_30px_70px_-24px_rgba(3,53,75,0.45)]">
            <div className="noise pointer-events-none absolute inset-0" />
            <div className="relative mx-auto max-w-2xl">
              <SectionLabel>
                <span className="text-slate-accent">Il tuo percorso</span>
              </SectionLabel>
              <h2 className="font-serif text-3xl font-semibold leading-tight sm:text-4xl">
                Visite incluse con i migliori specialisti
              </h2>
              <p className="mt-4 text-base leading-relaxed text-teal-200/85">
                Con Cocoora Club scegli il tuo percorso annuale e includi le
                visite con i tuoi specialisti di fiducia, a un prezzo molto più
                conveniente della singola prestazione isolata.
              </p>
              <div className="mt-8 flex justify-center">
                <ButtonLink href="/club" variant="white" size="lg">
                  Entra in Cocoora Club <ArrowRight className="h-4 w-4" />
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
