"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, GraduationCap, Stethoscope } from "lucide-react";
import { useShop } from "@/components/providers";
import { CLUB_TIERS } from "@/lib/club";
import { getTreatmentBySlug } from "@/lib/content";
import type { Doctor, ClubTier } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Badge, Button, ButtonLink, Container, SectionLabel } from "@/components/ui";

const ALL_TIERS: ClubTier[] = [...CLUB_TIERS];

function findTier(id: string): ClubTier | undefined {
  return ALL_TIERS.find((t) => t.id === id);
}

export function DoctorClient({ doctor }: { doctor: Doctor }) {
  const { openCheckout, openDiscover } = useShop();

  const includedTiers = doctor.clubTierIds
    .map((id) => findTier(id))
    .filter((t): t is ClubTier => Boolean(t));

  const recommendedTier =
    includedTiers.find((t) => !t.free) ?? includedTiers[0];

  const handlePrimaryCta = () => {
    if (!recommendedTier) {
      openDiscover();
      return;
    }
    if (recommendedTier.free) {
      openDiscover();
      return;
    }
    openCheckout(recommendedTier);
  };

  const treatments = (doctor.treatmentSlugs ?? [])
    .map((slug) => getTreatmentBySlug(slug))
    .filter(Boolean);

  return (
    <>
      {/* ── Hero Accademica ─────────────────────────────────────────── */}
      <section className="hero-mesh relative overflow-hidden pb-16 pt-32 sm:pt-36">
        <div className="noise pointer-events-none absolute inset-0" />
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-16">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2.5rem] shadow-[0_30px_70px_-28px_rgba(3,53,75,0.4)] lg:mx-0">
              <Image
                src={doctor.image}
                alt={doctor.name}
                fill
                priority
                sizes="(min-width: 1024px) 480px, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-navy/70 via-transparent to-transparent" />
            </div>

            <div className="text-center lg:text-left">
              <SectionLabel>{doctor.branca}</SectionLabel>
              <h1 className="font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-dark-navy sm:text-5xl">
                {doctor.name}
              </h1>
              <p className="mt-3 text-lg font-medium text-teal-700">{doctor.title}</p>
              <p className="mx-auto mt-4 flex max-w-xl items-start justify-center gap-2 text-sm leading-relaxed text-charcoal/65 lg:mx-0 lg:justify-start">
                <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-slate-accent" />
                {doctor.affiliation}
              </p>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-charcoal/75 lg:mx-0">
                {doctor.bio}
              </p>
              <blockquote className="mx-auto mt-6 max-w-xl border-l-2 border-teal-600 pl-5 font-serif text-lg italic leading-relaxed text-teal-800 lg:mx-0">
                &ldquo;{doctor.approach}&rdquo;
              </blockquote>
              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <Button size="lg" onClick={handlePrimaryCta}>
                  Scopri i Percorsi Salute <ArrowRight className="h-4 w-4" />
                </Button>
                <ButtonLink href="/contatti" variant="secondary" size="lg">
                  Prenota Visita su Appuntamento
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Curriculum & Carriera Accademica ────────────────────────── */}
      <section className="bg-canvas py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionLabel>Curriculum & Carriera Accademica</SectionLabel>
              <h2 className="font-serif text-3xl font-semibold text-teal-900 sm:text-4xl">
                Un percorso costruito sul rigore clinico
              </h2>
              <ul className="mt-7 space-y-4">
                {doctor.curriculum.map((c) => (
                  <li key={c} className="flex items-start gap-3 rounded-2xl border border-teal-100 bg-white p-4">
                    <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
                    <span className="text-sm leading-relaxed text-charcoal/80">{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionLabel>Prestazioni Erogate</SectionLabel>
              <h2 className="font-serif text-3xl font-semibold text-teal-900 sm:text-4xl">
                Cosa esegue in studio
              </h2>
              <ul className="mt-7 space-y-3">
                {doctor.servizi.map((s) => (
                  <li key={s} className="flex items-start gap-2.5 rounded-2xl border border-teal-100 bg-white p-4 text-sm text-charcoal/80">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                    {s}
                  </li>
                ))}
              </ul>

              {treatments.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2.5">
                  {treatments.map((t) => (
                    <Link
                      key={t!.slug}
                      href={`/trattamenti/${t!.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-white px-4 py-2 text-xs font-medium text-teal-800 transition-colors hover:border-teal-400 hover:bg-teal-50"
                    >
                      <Stethoscope className="h-3.5 w-3.5" /> {t!.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Sezione Strategica Up-sell Club ──────────────────────────── */}
      {includedTiers.length > 0 && (
        <section id="pacchetti-club" className="section-alt py-24">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <SectionLabel>Continuità di Cura</SectionLabel>
              <h2 className="font-serif text-4xl font-semibold leading-tight text-teal-900 sm:text-5xl">
                {doctor.name} è incluso nei percorsi Cocoora Club
              </h2>
              <p className="mt-4 text-base leading-relaxed text-charcoal/70">
                Con un Percorso Salute annuale, le consulenze con questo specialista
                rientrano in un programma coordinato di prevenzione e continuità clinica.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {includedTiers.map((tier) => (
                <Link
                  key={tier.id}
                  href={`/club/${tier.id}`}
                  className="group relative flex flex-col rounded-3xl border border-teal-100 bg-white p-7 shadow-[0_20px_50px_-28px_rgba(3,53,75,0.3)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-24px_rgba(3,53,75,0.4)]"
                >
                  {tier.badge && (
                    <Badge className="absolute -top-3 left-6 bg-teal-500 text-white">{tier.badge}</Badge>
                  )}
                  <h3 className="font-serif text-2xl font-semibold text-teal-900">{tier.name}</h3>
                  <p className="mt-2 flex items-baseline gap-2">
                    <span className="font-serif text-3xl font-semibold text-teal-900">
                      {tier.free ? "€0" : formatPrice(tier.price)}
                    </span>
                    <span className="text-sm text-charcoal/55">{tier.free ? "" : "/ anno"}</span>
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal/70">{tier.description}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 transition-colors group-hover:text-dark-navy">
                    Scopri il percorso <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" onClick={handlePrimaryCta}>
                Scopri i Percorsi Salute <ArrowRight className="h-4 w-4" />
              </Button>
              <ButtonLink href="/contatti" variant="secondary" size="lg">
                Prenota Visita su Appuntamento
              </ButtonLink>
            </div>
          </Container>
        </section>
      )}

      <div className="bg-canvas pb-20 pt-8">
        <Container>
          <Link href="/medici" className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-dark-navy">
            <ArrowLeft className="h-4 w-4" /> Tutti gli specialisti
          </Link>
        </Container>
      </div>
    </>
  );
}
