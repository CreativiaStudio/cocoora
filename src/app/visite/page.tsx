"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Stethoscope } from "lucide-react";
import { VISITE_SPECIALISTICHE } from "@/lib/visite-specialistiche";
import { Badge, Container, SectionLabel } from "@/components/ui";

export default function VisitePage() {
  return (
    <>
      {/* ── Hero Unificata Immersiva con Foto Studio ────────────────── */}
      <section className="relative overflow-hidden bg-dark-navy pb-20 pt-32 sm:pb-24 sm:pt-36">
        <div className="absolute inset-0">
          <Image
            src="https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-8.webp"
            alt="Ambulatori specialistici e clinica Cocoora Napoli"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-navy/95 via-dark-navy/85 to-dark-navy/90" />
          <div className="noise pointer-events-none absolute inset-0" />
        </div>

        <Container className="relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mx-auto shadow-md bg-white/15 text-teal-100 border border-white/20 backdrop-blur-md">
              Équipe Specialistica · Prenotazione su Appuntamento
            </Badge>
            <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
              Visite Specialistiche Private a Napoli
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-teal-100/90">
              13 branche specialistiche coordinate, con tempi dedicati all&apos;ascolto e
              refertazione strutturata. Scegli la visita di cui hai bisogno e
              prenota la tua valutazione dedicata.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Grid Specialità ──────────────────────────────────────────── */}
      <section className="bg-canvas py-20">
        <Container>
          <SectionLabel>Le Nostre Specialità</SectionLabel>
          <h2 className="font-serif text-3xl font-semibold text-teal-900 sm:text-4xl">
            Tutte le visite specialistiche
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VISITE_SPECIALISTICHE.map((visita) => (
              <Link
                key={visita.slug}
                href={`/visite/${visita.slug}`}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-teal-100 bg-white p-6 shadow-[0_16px_40px_-28px_rgba(3,53,75,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-24px_rgba(3,53,75,0.4)]"
              >
                <div>
                  <div className="relative mb-4 h-44 w-full overflow-hidden rounded-2xl bg-teal-50">
                    <Image
                      src={visita.heroImage}
                      alt={visita.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-teal-900 shadow-sm backdrop-blur-sm">
                        <Stethoscope className="h-3 w-3 text-teal-700" />
                        {visita.categoryName}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-teal-900">
                    {visita.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-charcoal/70">
                    {visita.tagline}
                  </p>
                </div>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-800 transition-all group-hover:gap-2.5 group-hover:text-dark-navy">
                  Scopri la visita <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Cross-sell Club ──────────────────────────────────────────── */}
      <section className="bg-canvas pb-20">
        <Container>
          <Link
            href="/club"
            className="group relative block overflow-hidden rounded-[2rem] bg-dark-navy px-8 py-12 text-center text-white transition-all duration-300 hover:-translate-y-1 sm:px-16"
          >
            <div className="noise pointer-events-none absolute inset-0" />
            <div className="relative mx-auto max-w-2xl">
              <Badge className="bg-white/15 text-white">Cocoora Club</Badge>
              <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight sm:text-4xl">
                Incluse nei Percorsi Cocoora Club Care e superiori
              </h2>
              <p className="mt-4 text-base leading-relaxed text-teal-200/85">
                Con i Percorsi Salute Care, Experience e Signature le visite
                specialistiche previste dal programma sono incluse nel tuo percorso
                annuale coordinato.
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-all group-hover:gap-2.5">
                Scopri i Percorsi Salute <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </Container>
      </section>

      {/* ── Trust Bar ────────────────────────────────────────────────── */}
      <section className="border-t border-teal-100 bg-white py-8">
        <Container>
          <div className="flex flex-col items-center justify-center gap-2 text-center text-sm font-medium text-charcoal/70 sm:flex-row sm:gap-3">
            <span>14 Specialità Private</span>
            <span className="hidden text-teal-300 sm:inline">·</span>
            <span>Équipe Medica Coordinata</span>
            <span className="hidden text-teal-300 sm:inline">·</span>
            <span>Referto Digitale 24h</span>
          </div>
        </Container>
      </section>
    </>
  );
}
