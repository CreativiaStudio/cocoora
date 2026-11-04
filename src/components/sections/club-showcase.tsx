"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { CLUB_TIERS, FAMILY_ADDONS } from "@/lib/club";
import type { ClubTier } from "@/lib/types";
import { cn, formatPricePlain } from "@/lib/utils";
import { useShop } from "../providers";
import { Badge, Button, SectionLabel } from "../ui";

export function DiscoverHorizontalCard({ onChoose }: { onChoose: () => void }) {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-teal-200/90 bg-gradient-to-br from-white via-[#f7fafb] to-[#eef4f7] p-6 sm:p-8 shadow-[0_16px_40px_-24px_rgba(3,53,75,0.14)] transition-all duration-300 hover:border-teal-400 hover:shadow-[0_24px_50px_-20px_rgba(3,53,75,0.22)]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Sinistra: Titolo, Badge e Prezzo Free */}
        <div className="lg:max-w-xs xl:max-w-sm">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-teal-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-800 border border-teal-200">
              Ingresso Gratuito
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
              Sempre Attivo
            </span>
          </div>
          <h3 className="mt-3 font-serif text-3xl font-bold tracking-tight text-teal-950">
            Discover
          </h3>
          <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-charcoal/70">
            Il percorso gratuito per entrare in Cocoora Club e iniziare il tuo percorso digitale di salute.
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl font-bold leading-none tracking-tight text-teal-950">
              €0
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
              FREE
            </span>
          </div>
        </div>

        {/* Centro: Griglia Funzionalità Orizzontali */}
        <div className="flex-1 border-t border-teal-100/80 pt-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#5d8497] mb-3">
            Incluso nel tuo profilo digitale gratuito:
          </p>
          <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <li className="flex items-center gap-2 text-xs sm:text-[13px] text-charcoal/85">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 ring-1 ring-teal-200/80">
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
              Registrazione app Cocoora
            </li>
            <li className="flex items-center gap-2 text-xs sm:text-[13px] text-charcoal/85">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 ring-1 ring-teal-200/80">
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
              Profilo sanitario digitale
            </li>
            <li className="flex items-center gap-2 text-xs sm:text-[13px] text-charcoal/85">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 ring-1 ring-teal-200/80">
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
              Questionario anamnestico di base
            </li>
            <li className="flex items-center gap-2 text-xs sm:text-[13px] text-charcoal/85">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 ring-1 ring-teal-200/80">
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
              Accesso al catalogo e referti digitali
            </li>
          </ul>
        </div>

        {/* Destra: Azione */}
        <div className="flex flex-col items-stretch lg:items-end justify-center shrink-0 border-t border-teal-100/80 pt-4 lg:border-t-0 lg:pt-0">
          <Button
            variant="primary"
            size="lg"
            className="shadow-sm transition-all hover:shadow-md whitespace-nowrap"
            onClick={onChoose}
          >
            Inizia gratis con il Club <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="mt-2 text-center lg:text-right text-[11px] text-charcoal/50">
            Nessun costo · Nessuna carta richiesta
          </p>
        </div>
      </div>
    </div>
  );
}

export function PaidTierCard({
  tier,
  onChoose,
}: {
  tier: ClubTier;
  onChoose: (tier: ClubTier, gender?: "uomo" | "donna") => void;
}) {
  const [cardGender, setCardGender] = useState<"uomo" | "donna">("uomo");
  const isFeatured = tier.id === "care";

  const activePrice = tier.genderToggle
    ? cardGender === "donna"
      ? (tier.priceDonna ?? tier.price)
      : (tier.priceUomo ?? tier.price)
    : tier.price;

  const activeFeatures =
    tier.genderToggle && cardGender === "donna" && tier.featuresDonna
      ? tier.featuresDonna
      : tier.features;

  const activeDesc =
    tier.genderToggle && cardGender === "donna" && tier.descriptionDonna
      ? tier.descriptionDonna
      : tier.description;

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col rounded-[2rem] p-6 transition-all duration-300 ease-out hover:-translate-y-1.5",
        "border bg-white shadow-[0_16px_40px_-24px_rgba(3,53,75,0.18)] hover:shadow-[0_24px_50px_-20px_rgba(3,53,75,0.28)]",
        isFeatured
          ? "border-teal-500/80 ring-2 ring-teal-500/25"
          : "border-teal-100/90 hover:border-teal-300"
      )}
    >
      {/* 1. Badge slot con altezza fissa per simmetria perfetta */}
      <div className="flex h-7 items-center justify-between gap-2">
        {tier.id === "care" ? (
          <span className="rounded-full bg-teal-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
            Più Scelto
          </span>
        ) : tier.id === "signature" ? (
          <span className="rounded-full bg-[#002231] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
            Top Longevity
          </span>
        ) : tier.id === "experience" ? (
          <span className="rounded-full bg-teal-50 border border-teal-200 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-800">
            Avanzato
          </span>
        ) : (
          <span className="rounded-full bg-teal-50 border border-teal-200 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-800">
            Essenziale
          </span>
        )}

        {tier.discountClub && (
          <span className="text-[11px] font-semibold text-teal-700 bg-teal-50/70 border border-teal-100 rounded-full px-2.5 py-0.5">
            Sconto {tier.discountClub}
          </span>
        )}
      </div>

      {/* 2. Titolo */}
      <h3 className="mt-3 font-serif text-2xl font-bold tracking-tight text-teal-950">
        {tier.name}
      </h3>

      {/* 3. Descrizione breve (altezza fissa 2 righe per allineare i toggle) */}
      <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-charcoal/70 line-clamp-2 h-[38px]">
        {activeDesc}
      </p>

      {/* 4. Slot Toggle Uomo / Donna (altezza fissa h-9 per simmetria millimetrica) */}
      <div className="mt-3 h-9 flex items-center">
        {tier.genderToggle ? (
          <div className="inline-flex w-full items-center rounded-xl bg-[#eef4f7] p-1 border border-teal-100/80">
            <button
              type="button"
              onClick={() => setCardGender("uomo")}
              className={cn(
                "flex-1 rounded-lg py-1 text-xs font-semibold transition-all",
                cardGender === "uomo"
                  ? "bg-white text-teal-950 shadow-sm"
                  : "text-charcoal/60 hover:text-teal-950"
              )}
            >
              Uomo
            </button>
            <button
              type="button"
              onClick={() => setCardGender("donna")}
              className={cn(
                "flex-1 rounded-lg py-1 text-xs font-semibold transition-all",
                cardGender === "donna"
                  ? "bg-white text-teal-950 shadow-sm"
                  : "text-charcoal/60 hover:text-teal-950"
              )}
            >
              Donna
            </button>
          </div>
        ) : (
          <div className="inline-flex w-full items-center justify-center rounded-xl bg-[#f8fafb] py-1.5 px-3 border border-teal-100/50 text-[11px] font-medium text-charcoal/60">
            Percorso Unisex · Per tutti
          </div>
        )}
      </div>

      {/* 5. Box Prezzo & Rateizzazione compatto simmetrico */}
      <div className="mt-4 rounded-2xl bg-[#f8fafb] border border-teal-100/70 p-4">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline">
            <span className="text-lg font-medium text-teal-600">€</span>
            <span className="font-serif text-3xl sm:text-4xl font-bold leading-none tracking-tight text-teal-950">
              {formatPricePlain(activePrice)}
            </span>
            <span className="ml-1 text-[11px] font-semibold uppercase tracking-wider text-charcoal/60">
              / anno
            </span>
          </div>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
            Tasso Zero
          </span>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[11px]">
          <span className="text-charcoal/75">
            3 rate da <strong>€{Math.round(activePrice / 3)}</strong>
          </span>
          <span className="text-emerald-700 font-semibold">Klarna 0%</span>
        </div>
      </div>

      {/* 6. Feature sintetizzate ad alto impatto (altezza minima fissa per fine card allineata) */}
      <ul className="mt-4 flex-1 space-y-2 min-h-[170px]">
        {activeFeatures.slice(0, 4).map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs sm:text-[13px] leading-snug">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 ring-1 ring-teal-200/80">
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
            </span>
            <span className="text-charcoal/80">{f}</span>
          </li>
        ))}
        <li className="pt-1">
          <Link
            href={`/club/${tier.id}`}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 hover:text-dark-navy hover:underline"
          >
            <span>+ altre {Math.max(0, activeFeatures.length - 4)} prestazioni incluse</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </li>
      </ul>

      {/* 7. Pulsante e badge pagamenti */}
      <div className="mt-5 space-y-2 pt-3 border-t border-teal-100/60">
        <Button
          variant={isFeatured ? "primary" : "secondary"}
          className="w-full py-2.5 text-sm font-semibold shadow-sm transition-all hover:shadow-md"
          onClick={() => onChoose(tier, tier.genderToggle ? cardGender : undefined)}
        >
          Scegli Percorso
          <ArrowRight className="h-4 w-4" />
        </Button>
        <div className="flex items-center justify-center gap-1.5 text-[10px] pt-0.5 text-charcoal/50 text-center">
          <span>Carta</span>
          <span>·</span>
          <span>Apple Pay</span>
          <span>·</span>
          <span className="font-semibold text-emerald-600">Klarna 3 rate</span>
          <span>·</span>
          <span className="font-semibold text-teal-700">PayPal</span>
        </div>
      </div>
    </div>
  );
}

// Wrapper retrocompatibile per chiamate legacy
export function TierCard({
  tier,
  onChoose,
}: {
  tier: ClubTier;
  gender?: "uomo" | "donna";
  onChoose: (tier: ClubTier, gender?: "uomo" | "donna") => void;
  variant?: "dark" | "light";
  maxFeatures?: number;
}) {
  if (tier.free) {
    return <DiscoverHorizontalCard onChoose={() => onChoose(tier)} />;
  }
  return <PaidTierCard tier={tier} onChoose={onChoose} />;
}

export function ClubShowcase() {
  const { openCheckout, openDiscover } = useShop();

  const handleChoosePaid = (tier: ClubTier, gender?: "uomo" | "donna") => {
    openCheckout(tier, gender);
  };

  const paidTiers = CLUB_TIERS.filter((t) => !t.free);

  return (
    <section id="club" className="bg-white py-24 text-charcoal">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>Percorsi Salute</SectionLabel>
          <h2 className="font-serif text-4xl font-semibold leading-tight text-teal-900 sm:text-5xl">
            La salute come stile di vita
          </h2>
          <p className="mt-5 text-base leading-relaxed text-charcoal/70">
            Un programma esclusivo dedicato a chi sceglie la prevenzione costante.
            Accesso prioritario, check-up dedicati e vantaggi per tutta la famiglia.
          </p>
        </div>

        {/* 1. Card Discover Orizzontale a piena larghezza in alto */}
        <div className="mt-12">
          <DiscoverHorizontalCard onChoose={openDiscover} />
        </div>

        {/* 2. Griglia a 4 colonne perfettamente simmetrica dei pacchetti a pagamento */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {paidTiers.map((tier) => (
            <PaidTierCard
              key={tier.id}
              tier={tier}
              onChoose={handleChoosePaid}
            />
          ))}
        </div>

        <div className="mt-16">
          <div className="mb-8 flex flex-wrap items-center gap-4">
            <h3 className="font-serif text-2xl font-semibold text-teal-900 sm:text-3xl">
              Add-on Family
            </h3>
            <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-800">
              In arrivo · Scheda informativa
            </span>
            <div className="h-px flex-1 bg-teal-100" />
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
            {FAMILY_ADDONS.map((tier) => (
              <FamilyCard key={tier.id} tier={tier} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FamilyCard({ tier }: { tier: ClubTier }) {
  return (
    <div className="group flex h-full flex-col rounded-3xl border border-teal-100 bg-canvas/60 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-serif text-xl font-semibold text-teal-900">{tier.name}</h4>
        <span className="rounded-full bg-teal-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-teal-800">
          In arrivo
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{tier.description}</p>
      <ul className="mt-5 flex-1 space-y-2.5">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-charcoal/80">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
            {f}
          </li>
        ))}
      </ul>
      <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50/70 px-4 py-3 text-center text-xs font-medium text-teal-900">
        Scheda informativa · Attivazione disponibile prossimamente in sede
      </div>
    </div>
  );
}
