"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import { useShop } from "@/components/providers";
import { getDoctorBySlug } from "@/lib/doctors";
import { computeInstallment, computeSavings, getTierDetail } from "@/lib/club-details";
import type { ClubTier } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import { Badge, Button, ButtonLink, Container, SectionLabel } from "@/components/ui";

const TIER_IMAGES: Record<string, string> = {
  discover: "/images/clinic-lounge.jpg",
  access: "/images/doctor-consultation.jpg",
  care: "/images/diagnostics-lab.jpg",
  experience: "/images/laser-technology.jpg",
  signature: "/images/hero-clinic.jpg",
  "signature-longevity": "/images/dna-genomics.jpg",
};

// Feature flag: oscura il Calcolatore del Risparmio sul sito pubblico.
// Il codice della sezione resta intatto per future landing page dedicate.
const SHOW_SAVINGS_CALCULATOR = false;

export function ClubTierClient({ tier }: { tier: ClubTier }) {
  const { openCheckout, openDiscover } = useShop();
  const [gender, setGender] = useState<"uomo" | "donna">("uomo");

  const detail = getTierDetail(tier.id);
  const activeGender = tier.genderToggle ? gender : undefined;
  const { items, totalValue, savings, savingsPercent } = detail
    ? computeSavings(tier.price, detail, activeGender)
    : { items: [], totalValue: 0, savings: 0, savingsPercent: 0 };

  const installmentAmount = detail?.installmentCount
    ? computeInstallment(tier.price, detail.installmentCount)
    : null;

  const doctors = (detail?.doctorSlugs ?? [])
    .map((slug) => getDoctorBySlug(slug))
    .filter(Boolean);

  const handleActivate = () => {
    if (tier.free) {
      openDiscover();
      return;
    }
    openCheckout(tier, activeGender);
  };

  const displayName =
    activeGender && tier.genderToggle
      ? `${tier.name} ${activeGender === "uomo" ? "Uomo" : "Donna"}`
      : tier.name;

  return (
    <>
      {/* ── Hero E-commerce Luxury ───────────────────────────────────── */}
      <section className="hero-mesh relative overflow-hidden pb-16 pt-32 sm:pt-36">
        <div className="noise pointer-events-none absolute inset-0" />
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
            <div className="text-center lg:text-left">
              <Badge className="mx-auto lg:mx-0">Cocoora Club</Badge>
              {tier.badge && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                  {tier.badge}
                </span>
              )}
              <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-dark-navy sm:text-6xl">
                {displayName}
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-charcoal/75 lg:mx-0">
                {tier.description}
              </p>

              {tier.genderToggle && (
                <div className="mx-auto mt-7 inline-flex items-center rounded-full border border-teal-200 bg-white p-1 lg:mx-0">
                  {(["uomo", "donna"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={cn(
                        "rounded-full px-6 py-2 text-sm font-medium capitalize transition-all",
                        gender === g ? "bg-teal-600 text-white" : "text-charcoal/60"
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              )}

              {/* Prezzo + rateizzazione */}
              <div className="mx-auto mt-8 max-w-md rounded-3xl border border-teal-100 bg-white/80 p-6 backdrop-blur-sm lg:mx-0">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-5xl font-semibold text-teal-900">
                    {tier.free ? "€0" : formatPrice(tier.price)}
                  </span>
                  {tier.listPrice && (
                    <span className="text-lg text-slate-accent line-through">
                      {formatPrice(tier.listPrice)}
                    </span>
                  )}
                  <span className="text-sm text-charcoal/60">{tier.free ? "Free" : "/ anno"}</span>
                </div>
                {installmentAmount && (
                  <p className="mt-3 flex items-center gap-2 text-sm font-medium text-teal-700">
                    <CreditCard className="h-4 w-4 shrink-0" />
                    O in {detail?.installmentCount} rate da {formatPrice(installmentAmount)}/mese con{" "}
                    {detail?.installmentProviders?.join(" / ")} a tasso zero
                  </p>
                )}
                {SHOW_SAVINGS_CALCULATOR && savings > 0 && (
                  <p className="mt-3 flex items-center gap-2 text-sm font-medium text-charcoal/70">
                    <TrendingDown className="h-4 w-4 shrink-0 text-teal-600" />
                    Valore prestazioni singole: {formatPrice(totalValue)} — risparmi il {savingsPercent}%
                  </p>
                )}
                {!SHOW_SAVINGS_CALCULATOR && !tier.free && (
                  <p className="mt-3 flex items-center gap-2 text-sm font-medium text-charcoal/70">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-teal-600" />
                    Percorso Annuale di Prevenzione Continua
                  </p>
                )}
              </div>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <Button size="lg" onClick={handleActivate}>
                  {tier.free ? "Attiva Discover Gratis" : `Attiva ${tier.shortName}`}{" "}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <ButtonLink href="/contatti" variant="secondary" size="lg">
                  Prenota Visita Singola
                </ButtonLink>
              </div>
            </div>

            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2.5rem] shadow-[0_30px_70px_-28px_rgba(3,53,75,0.4)] lg:mx-0">
              <Image
                src={TIER_IMAGES[tier.id] ?? "/images/hero-clinic.jpg"}
                alt={tier.name}
                fill
                priority
                sizes="(min-width: 1024px) 480px, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-navy/70 via-transparent to-transparent" />
            </div>
          </div>
        </Container>
      </section>

      {/* ── Scomposizione Clinica ────────────────────────────────────── */}
      {items.length > 0 && (
        <section className="bg-canvas py-20">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <SectionLabel>Cosa include</SectionLabel>
              <h2 className="font-serif text-4xl font-semibold leading-tight text-teal-900 sm:text-5xl">
                Scomposizione clinica del percorso
              </h2>
              <p className="mt-4 text-base leading-relaxed text-charcoal/70">
                Ogni prestazione inclusa, con il relativo valore indicativo di
                mercato a tariffa singola.
              </p>
            </div>

            <div className="mt-12 grid gap-3 sm:grid-cols-2">
              {items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-teal-100 bg-white px-5 py-4"
                >
                  <span className="flex items-start gap-2.5 text-sm text-charcoal/80">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                    {item.label}
                  </span>
                  {item.value > 0 && (
                    <span className="shrink-0 text-sm font-medium text-slate-accent">
                      {formatPrice(item.value)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── Tabella Comparativa: Club vs Singole Prestazioni ────────────── */}
      {SHOW_SAVINGS_CALCULATOR && totalValue > 0 && (
        <section className="section-alt py-20">
          <Container>
            <div className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-teal-100 bg-white shadow-[0_24px_60px_-28px_rgba(3,53,75,0.35)]">
              <div className="border-b border-teal-100 bg-dark-navy px-8 py-6 text-center text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-accent">
                  Pacchetto Club vs Singole Prestazioni
                </p>
                <h3 className="mt-2 font-serif text-2xl font-semibold sm:text-3xl">
                  Quanto risparmi davvero
                </h3>
              </div>
              <div className="grid divide-y divide-teal-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                <div className="p-7 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/50">
                    Valore a tariffa singola
                  </p>
                  <p className="mt-2 font-serif text-3xl font-semibold text-charcoal/60 line-through">
                    {formatPrice(totalValue)}
                  </p>
                </div>
                <div className="bg-teal-50/60 p-7 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                    Con {tier.shortName}
                  </p>
                  <p className="mt-2 font-serif text-3xl font-semibold text-teal-900">
                    {formatPrice(tier.price)}
                  </p>
                </div>
                <div className="p-7 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/50">
                    Risparmio effettivo
                  </p>
                  <p className="mt-2 font-serif text-3xl font-semibold text-teal-600">
                    {savingsPercent}%
                  </p>
                  <p className="mt-1 text-xs text-charcoal/55">{formatPrice(savings)} risparmiati</p>
                </div>
              </div>
              <div className="border-t border-teal-100 bg-white p-6 text-center">
                <p className="text-sm text-charcoal/65">
                  Oltre al vantaggio economico, hai accesso prioritario alla
                  clinica e costruisci un percorso di prevenzione continuativo
                  nel tempo.
                </p>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ── Medici Dedicati ──────────────────────────────────────────── */}
      {doctors.length > 0 && (
        <section className="bg-canvas py-20">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <SectionLabel>Il tuo team clinico</SectionLabel>
              <h2 className="font-serif text-4xl font-semibold leading-tight text-teal-900 sm:text-5xl">
                Medici dedicati inclusi nel percorso
              </h2>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {doctors.map((doctor) => (
                <Link
                  key={doctor!.slug}
                  href={`/medici/${doctor!.slug}`}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-teal-100 bg-white shadow-[0_16px_40px_-28px_rgba(3,53,75,0.3)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-24px_rgba(3,53,75,0.4)]"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={doctor!.image}
                      alt={doctor!.name}
                      fill
                      sizes="(min-width: 1024px) 260px, 90vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-navy/80 via-transparent to-transparent" />
                  </div>
                  <div className="p-5">
                    <p className="font-serif text-lg font-semibold leading-tight text-teal-900">
                      {doctor!.name}
                    </p>
                    <p className="mt-1 flex items-start gap-1.5 text-xs text-charcoal/60">
                      <GraduationCap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-accent" />
                      {doctor!.branca}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── Perks & CTA Finale ───────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-dark-navy py-24 text-white">
        <div className="noise pointer-events-none absolute inset-0" />
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>
              <span className="text-slate-accent">Perché scegliere {tier.shortName}</span>
            </SectionLabel>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {(detail?.perks ?? tier.features).map((perk) => (
                <span
                  key={perk}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-teal-100/90"
                >
                  <Sparkles className="h-3.5 w-3.5 text-slate-accent" /> {perk}
                </span>
              ))}
            </div>
            <h2 className="mt-10 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
              Pronto ad attivare {displayName}?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-teal-200/85">
              Onboarding immediato, kit di benvenuto digitale e primo
              appuntamento entro pochi giorni, con accesso prioritario alla
              clinica.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="white" onClick={handleActivate}>
                <ShieldCheck className="h-4 w-4" />{" "}
                {tier.free ? "Attiva Discover Gratis" : `Attiva ${tier.shortName}`}
              </Button>
              <ButtonLink href="/club" variant="outline-dark" size="lg">
                Confronta tutti i pacchetti
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <div className="bg-canvas py-8">
        <Container>
          <Link href="/club" className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-dark-navy">
            <ArrowLeft className="h-4 w-4" /> Torna a Cocoora Club
          </Link>
        </Container>
      </div>
    </>
  );
}
