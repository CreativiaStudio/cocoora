"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  GraduationCap,
  Info,
  ShieldCheck,
  TrendingDown,
} from "lucide-react";
import { useShop } from "@/components/providers";
import { getDoctorBySlug } from "@/lib/doctors";
import { computeSavings, getTierDetail } from "@/lib/club-details";
import { MEMBERSHIP_NOTES } from "@/lib/club";
import { redirectToStripeCheckout } from "@/lib/checkout-client";
import { ClubComparisonTable } from "@/components/sections/club-comparison-table";
import { ParametriEmatochimiciModal, type CheckupPanelKey } from "@/components/club/parametri-ematochimici-modal";
import type { ClubTier } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
import { Badge, Button, ButtonLink, Container, SectionLabel } from "@/components/ui";

const TIER_IMAGES: Record<string, string> = {
  discover: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-3.webp",
  access: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-14.webp",
  care: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-8.webp",
  experience: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-5.webp",
  signature: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-20.webp",
};

const PANEL_PARAMETRI_COUNT: Record<CheckupPanelKey, number> = {
  salute_17: 17,
  completo_48: 48,
  avanzato_uomo_59: 59,
  avanzato_donna_57: 57,
};

// Feature flag: oscura il Calcolatore del Risparmio sul sito pubblico.
// Il codice della sezione resta intatto per future landing page dedicate.
const SHOW_SAVINGS_CALCULATOR = false;

export function ClubTierClient({ tier }: { tier: ClubTier }) {
  const { openCheckout, openDiscover } = useShop();
  const [gender, setGender] = useState<"uomo" | "donna">("uomo");

  const detail = getTierDetail(tier.id);
  const activeGender = tier.genderToggle ? gender : undefined;
  const activePrice = tier.genderToggle
    ? gender === "donna"
      ? (tier.priceDonna ?? tier.price)
      : (tier.priceUomo ?? tier.price)
    : tier.price;

  const activeDescription =
    tier.genderToggle && gender === "donna" && tier.descriptionDonna
      ? tier.descriptionDonna
      : tier.description;

  const { items, totalValue, savings, savingsPercent } = detail
    ? computeSavings(activePrice, detail, activeGender)
    : { items: [], totalValue: 0, savings: 0, savingsPercent: 0 };


  const [activating, setActivating] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const doctors = (detail?.doctorSlugs ?? [])
    .map((slug) => getDoctorBySlug(slug))
    .filter(Boolean);

  const handleActivate = async () => {
    if (tier.free) {
      openDiscover();
      return;
    }

    try {
      setActivating(true);
      setCheckoutError("");
      await redirectToStripeCheckout({
        tierId: tier.id,
        gender: tier.genderToggle ? gender : null,
      });
    } catch (err: unknown) {
      console.warn("Errore avvio diretto Stripe, apertura cassetto checkout:", err);
      setActivating(false);
      openCheckout(tier, activeGender);
    }
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
                {activeDescription}
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

              {/* Prezzo */}
              <div className="mx-auto mt-8 max-w-md rounded-3xl border border-teal-100 bg-white/80 p-6 backdrop-blur-sm lg:mx-0">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-5xl font-semibold text-teal-900">
                    {tier.free ? "€0" : formatPrice(activePrice)}
                  </span>
                  {tier.listPrice && (
                    <span className="text-lg text-slate-accent line-through">
                      {formatPrice(tier.listPrice)}
                    </span>
                  )}
                  <span className="text-sm text-charcoal/60">{tier.free ? "Free" : "/ anno"}</span>
                </div>
                {SHOW_SAVINGS_CALCULATOR && savings > 0 && (
                  <p className="mt-3 flex items-center gap-2 text-sm font-medium text-charcoal/70">
                    <TrendingDown className="h-4 w-4 shrink-0 text-teal-600" />
                    Valore prestazioni singole: {formatPrice(totalValue)} — risparmi il {savingsPercent}%
                  </p>
                )}
              </div>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <Button size="lg" disabled={activating} onClick={handleActivate}>
                  {activating ? (
                    "Apertura Cassa Protetta Stripe..."
                  ) : (
                    <>
                      {tier.free ? "Attiva Discover Gratis" : `Attiva ${tier.shortName}`}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>

                {!tier.free && (
                  <button
                    type="button"
                    onClick={openDiscover}
                    className="group inline-flex flex-col items-center justify-center rounded-full border border-teal-200/90 bg-white/80 px-6 py-2.5 text-center backdrop-blur-sm transition-all duration-300 hover:border-teal-400 hover:bg-white hover:-translate-y-0.5 sm:items-start sm:text-left cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40"
                  >
                    <span className="text-xs font-semibold text-teal-950 group-hover:text-dark-navy">
                      Senza abbonamento? Inizia gratis (€0)
                    </span>
                    <span className="text-[11px] font-normal text-charcoal/65">
                      Prenota visite singole · Fai l'upgrade dopo
                    </span>
                  </button>
                )}
              </div>

              {!tier.free && (
                <p className="mt-4 text-xs text-charcoal/60 text-center lg:text-left flex items-center justify-center lg:justify-start gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Pagamento sicuro · Carte di Credito, Apple Pay, Google Pay, Klarna e PayPal in 3 rate</span>
                </p>
              )}
            </div>

            <div className="relative mx-auto aspect-[3/2] w-full max-w-xl overflow-hidden rounded-[2rem] shadow-[0_30px_70px_-28px_rgba(3,53,75,0.4)] lg:mx-0">
              <Image
                src={TIER_IMAGES[tier.id] ?? "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/hero-clinic.jpg"}
                alt={tier.name}
                fill
                priority
                quality={95}
                sizes="(min-width: 1024px) 640px, 95vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-navy/25 via-transparent to-transparent" />
            </div>
          </div>
        </Container>
      </section>

      {/* ── Prestazioni Cliniche Incluse ──────────────────────────── */}
      {items.length > 0 && (
        <section className="bg-canvas py-20">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <SectionLabel>Cosa include</SectionLabel>
              <h2 className="font-serif text-4xl font-semibold leading-tight text-teal-900 sm:text-5xl">
                Prestazioni cliniche incluse
              </h2>
              <p className="mt-4 text-base leading-relaxed text-charcoal/70">
                Tutti i check-up, le visite specialistiche e le prestazioni diagnostiche comprese nel percorso annuale.
              </p>
            </div>

            <div className="mt-12 grid gap-3 sm:grid-cols-2">
              {items.map((item) => {
                const panel: CheckupPanelKey =
                  item.checkupPanel ??
                  (tier.id === "signature"
                    ? gender === "donna"
                      ? "avanzato_donna_57"
                      : "avanzato_uomo_59"
                    : tier.id === "experience"
                    ? "completo_48"
                    : "salute_17");
                const isParametri =
                  item.checkupPanel !== undefined || item.label.toLowerCase().includes("parametri");
                const panelCount = PANEL_PARAMETRI_COUNT[panel];

                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-teal-100 bg-white px-5 py-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="flex items-start gap-2.5 text-sm text-charcoal/80">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                        {item.label}
                      </span>
                      {item.tooltip && <InfoTooltip text={item.tooltip} />}
                      {isParametri && (
                        <ParametriEmatochimiciModal
                          triggerText={`Vedi i ${panelCount} parametri`}
                          initialPanel={panel}
                          className="ml-6 sm:ml-0 self-start sm:self-center"
                        />
                      )}
                    </div>
                    <span className="shrink-0 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800">
                      Incluso
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 rounded-2xl border border-teal-100 bg-white/80 p-5 text-xs leading-relaxed text-charcoal/70 space-y-2">
              {gender === "donna" && (tier.id === "experience" || tier.id === "signature") && (
                <p className="rounded-xl border border-teal-200 bg-teal-50/70 px-3 py-2 text-teal-900">
                  <strong>Nota:</strong> La mammografia non è inclusa nella membership e può essere effettuata presso un centro convenzionato.
                </p>
              )}
              <p>
                <strong className="text-teal-900">Note sulle Membership:</strong>
              </p>
              {MEMBERSHIP_NOTES.map((nota) => (
                <p key={nota}>• {nota}</p>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── Tabella Comparativa Ufficiale Percorsi ──────────────────────── */}
      <ClubComparisonTable activeTierId={tier.id} />

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
                    {formatPrice(activePrice)}
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
                  href="/medici"
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
                    <p className="mt-1.5 flex items-start gap-1.5 text-xs leading-relaxed text-charcoal/70">
                      <GraduationCap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-accent" />
                      <span>{doctor!.title}</span>
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
                  <Check className="h-3.5 w-3.5 text-teal-300" /> {perk}
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
              <Button size="lg" variant="white" disabled={activating} onClick={handleActivate}>
                <ShieldCheck className="h-4 w-4" />{" "}
                {activating
                  ? "Apertura Cassa Protetta Stripe..."
                  : tier.free
                  ? "Attiva Discover Gratis"
                  : `Attiva ${tier.shortName}`}
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

function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex shrink-0 self-start sm:self-center">
      <button
        type="button"
        aria-label="Specifiche della prestazione"
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-teal-100 bg-teal-50 text-teal-700 transition-colors hover:bg-teal-100 hover:text-dark-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40"
      >
        <Info className="h-3 w-3" />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none invisible absolute left-0 top-full z-20 mt-2 w-64 rounded-xl border border-teal-100 bg-white p-3 text-left text-[11px] font-normal leading-relaxed text-charcoal/80 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}
