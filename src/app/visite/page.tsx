"use client";

// Pagina hub /visite — lista tutte le specialità con card link
// Usa i dati reali dei medici importati da @/lib/doctors
// DOCTORS filtrati per specialtyId non-undefined

import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Baby,
  Eye,
  Heart,
  HeartPulse,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { DOCTORS } from "@/lib/doctors";
import { formatPrice } from "@/lib/utils";
import { Badge, Container, SectionLabel } from "@/components/ui";

type SpecialtyCard = {
  id: string;
  title: string;
  href: string;
  icon: LucideIcon;
  doctorSlug: string;
};

const SPECIALTY_CARDS: SpecialtyCard[] = [
  { id: "cardiologia", title: "Cardiologia", href: "/visite/cardiologia", icon: HeartPulse, doctorSlug: "ferdinando-esposito" },
  { id: "ginecologia", title: "Ginecologia", href: "/visite/ginecologia", icon: Heart, doctorSlug: "federica-caputo" },
  { id: "senologia", title: "Senologia", href: "/visite/senologia", icon: ShieldCheck, doctorSlug: "marianna-coppola" },
  { id: "radiologia-ecografie", title: "Ecografia", href: "/visite/ecografia", icon: Activity, doctorSlug: "gennaro-iovine" },
  { id: "oculistica", title: "Oculistica", href: "/visite/oculistica", icon: Eye, doctorSlug: "ilaria-russo" },
  { id: "pediatria", title: "Pediatria", href: "/visite/pediatria", icon: Baby, doctorSlug: "teresa-amato" },
];

export default function VisitePage() {
  const specialtyDoctors = DOCTORS.filter((d) => d.specialtyId !== undefined);

  return (
    <>
      {/* ── Banner Hero ──────────────────────────────────────────────── */}
      <div className="relative z-10 h-64 w-full overflow-hidden rounded-b-[2.5rem] border-b border-slate-200/80 shadow-xl shadow-dark-navy/10 sm:h-72">
        <Image
          src="/images/diagnostics-lab.jpg"
          alt="Poliambulatorio e visite specialistiche Cocoora Napoli"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-dark-navy/60 via-dark-navy/15 to-transparent" />
      </div>

      {/* ── Hero Testuale ────────────────────────────────────────────── */}
      <section className="hero-mesh relative overflow-hidden pb-16 pt-8 sm:pt-12">
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mx-auto shadow-sm">Prima Visita Entro 72h · Zero Lista d&apos;Attesa</Badge>
            <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-dark-navy sm:text-6xl">
              Visite Specialistiche Private a Napoli
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-charcoal/75">
              Sei branche cliniche, prima visita garantita entro 72 ore e zero lista
              d&apos;attesa SSN. Scegli la specialità di cui hai bisogno e prenota
              direttamente con lo specialista dedicato.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Grid Specialità ──────────────────────────────────────────── */}
      <section className="bg-canvas py-20">
        <Container>
          <SectionLabel>Le Nostre Specialità</SectionLabel>
          <h2 className="font-serif text-3xl font-semibold text-teal-900 sm:text-4xl">
            Scegli la tua visita
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SPECIALTY_CARDS.map((card) => {
              const doctor = specialtyDoctors.find((d) => d.slug === card.doctorSlug);
              const Icon = card.icon;
              return (
                <Link
                  key={card.id}
                  href={card.href}
                  className="group flex flex-col rounded-3xl border border-teal-100 bg-white p-7 shadow-[0_16px_40px_-28px_rgba(3,53,75,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-24px_rgba(3,53,75,0.4)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600/10 text-teal-700">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-serif text-2xl font-semibold text-teal-900">
                    {card.title}
                  </h3>
                  {doctor && (
                    <p className="mt-2 text-sm text-charcoal/65">{doctor.name}</p>
                  )}
                  {doctor && (
                    <p className="mt-1 text-sm font-medium text-slate-accent">
                      da {formatPrice(doctor.tariffaVisita)}
                    </p>
                  )}
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 transition-all group-hover:gap-2.5 group-hover:text-dark-navy">
                    Scopri la visita <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
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
                Incluse nel Cocoora Club Care e superiori
              </h2>
              <p className="mt-4 text-base leading-relaxed text-teal-200/85">
                Con i piani Care, Experience e Signature le visite specialistiche
                sono incluse senza costi aggiuntivi, tutto l&apos;anno.
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-all group-hover:gap-2.5">
                Scopri i Piani Salute <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </Container>
      </section>

      {/* ── Trust Bar ────────────────────────────────────────────────── */}
      <section className="border-t border-teal-100 bg-white py-8">
        <Container>
          <div className="flex flex-col items-center justify-center gap-2 text-center text-sm font-medium text-charcoal/70 sm:flex-row sm:gap-3">
            <span>9 Specialisti</span>
            <span className="hidden text-teal-300 sm:inline">·</span>
            <span>Convenzione Federico II &amp; Vanvitelli</span>
            <span className="hidden text-teal-300 sm:inline">·</span>
            <span>Referto Digitale 24h</span>
          </div>
        </Container>
      </section>
    </>
  );
}
