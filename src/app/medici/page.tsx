"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, GraduationCap, ShieldCheck } from "lucide-react";
import { BRANCHE, DOCTORS } from "@/lib/doctors";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Badge, ButtonLink, Container, SectionLabel } from "@/components/ui";

export default function MediciPage() {
  const [filter, setFilter] = useState<string>("Tutte");

  const filtered = useMemo(() => {
    if (filter === "Tutte") return DOCTORS;
    return DOCTORS.filter((d) => d.branca === filter);
  }, [filter]);

  return (
    <>
      {/* ── Banner Fullwidth compatto sotto al menu ───────────────────── */}
      <section className="relative w-full overflow-hidden bg-dark-navy pt-20 sm:pt-24">
        <div className="relative h-[260px] sm:h-[300px] lg:h-[340px] w-full overflow-hidden">
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
                <Badge className="bg-white/15 text-white border-white/20 backdrop-blur-sm">
                  <ShieldCheck className="h-3.5 w-3.5 text-teal-300" /> Zero Liste d&apos;Attesa — Convenzione Universitaria
                </Badge>
                <h1 className="mt-3.5 font-serif text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  I nostri specialisti
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-teal-100/90 sm:text-base">
                  Una rete di medici con cattedre universitarie e convenzioni ospedaliere a Napoli (Federico II, Vanvitelli, Cardarelli). Visite immediate, senza liste d&apos;attesa e con approccio Amico Medico.
                </p>
              </div>
            </Container>
          </div>
        </div>
      </section>

      {/* ── Filtri per Branca Specialistica ───────────────────────────── */}
      <section className="bg-canvas border-b border-teal-100/60 py-6 sm:py-8">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {["Tutte", ...BRANCHE].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setFilter(b)}
                className={cn(
                  "rounded-full border px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium transition-all duration-200",
                  filter === b
                    ? "border-teal-700 bg-teal-700 text-white shadow-[0_8px_24px_-10px_rgba(28,74,92,0.55)] scale-[1.02]"
                    : "border-teal-200 bg-white text-charcoal/70 hover:border-teal-400 hover:text-teal-900 shadow-xs"
                )}
              >
                {b}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Griglia Specialisti ───────────────────────────────────────── */}
      <section className="bg-canvas py-12 sm:py-16 pb-24">
        <Container>
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
