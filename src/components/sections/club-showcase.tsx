"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { CLUB_TIERS, FAMILY_ADDONS } from "@/lib/club";
import type { ClubTier } from "@/lib/types";
import { cn, formatPricePlain } from "@/lib/utils";
import { useShop } from "../providers";
import { Button, SectionLabel } from "../ui";

/* ─── 1. Card Discover Orizzontale Compatta (Senza listati, con descrizione) ─── */
export function DiscoverHorizontalCard({ onChoose }: { onChoose: () => void }) {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-teal-200/80 bg-gradient-to-r from-white via-[#f7fafb] to-[#eef4f7] p-6 sm:p-7 shadow-[0_16px_36px_-24px_rgba(3,53,75,0.12)] transition-all duration-300 hover:border-teal-400 hover:shadow-[0_22px_45px_-20px_rgba(3,53,75,0.20)]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Sinistra: Badge + Nome + Prezzo */}
        <div className="lg:w-72 shrink-0">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-800 border border-teal-200">
              Ingresso Gratuito
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
              Sempre Attivo
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-3">
            <h3 className="font-serif text-3xl font-bold tracking-tight text-teal-950">
              Discover
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-3xl font-bold text-teal-950">€0</span>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600">FREE</span>
            </div>
          </div>
        </div>

        {/* Centro: Descrizione ufficiale discorsiva (senza elenchi puntati) */}
        <div className="flex-1 lg:border-l lg:border-teal-200/70 lg:pl-7">
          <p className="text-xs sm:text-[13px] leading-relaxed text-charcoal/80">
            La porta d’accesso digitale gratuita al mondo Cocoora: attiva il tuo profilo sanitario,
            compila il questionario anamnestico di base e consulta referti, documenti clinici e
            catalogo specialistico in ogni momento, senza code né moduli cartacei.
          </p>
        </div>

        {/* Destra: Azione */}
        <div className="flex flex-col items-stretch lg:items-end justify-center shrink-0">
          <Button
            variant="primary"
            size="md"
            className="shadow-sm transition-all hover:shadow-md whitespace-nowrap px-6 py-2.5 text-xs sm:text-sm font-semibold"
            onClick={onChoose}
          >
            Inizia gratis con il Club <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="mt-1.5 text-center lg:text-right text-[11px] text-charcoal/50">
            Nessuna carta richiesta
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── 2. Card a Pagamento Compatta e Simmetrica (Descrizione narrativa dal brief, no elenchi, no klarna) ─── */
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

  // Testo narrativo principale dal brief del 21 ottobre
  const narrativeIntro =
    tier.id === "access"
      ? "La porta d’ingresso nel mondo Cocoora: una prima valutazione dello stato di salute che unisce esami, medicina interna, salute del sorriso e medicina estetica."
      : tier.id === "care"
      ? "Un percorso dedicato a prevenzione, salute orale e nutrizione, con prestazioni concrete e maggiore continuità clinica tutto l’anno."
      : tier.id === "experience"
      ? cardGender === "donna"
        ? "Un percorso completo con approfondimenti specialistici avanzati e attenzione primaria alla salute del seno e dell’apparato cardiologico."
        : "Un approfondimento della salute con analisi più complete, diagnostica per immagini e valutazioni specialistiche integrate multidisciplinari."
      : cardGender === "donna"
      ? "Il percorso più approfondito dedicato alla salute femminile: massima prevenzione con genomica DNA 5, senologia ed ecografia addominale."
      : "Il percorso più approfondito di Cocoora Club, con diagnostica avanzata per immagini, test FIT e test genomico DNA 5 con consulenza specialistica.";

  // Box descrittivo "Comprende" in prosa compatta
  const comprendeText =
    tier.id === "access"
      ? "Check-up Salute (17 voci, urine incluse), Medicina Interna con ECG a 12 derivazioni, visita odontoiatrica con OPT, visita medicina estetica viso/corpo e booklet personale."
      : tier.id === "care"
      ? "Tutte le prestazioni Access, igiene orale professionale in sede, visita nutrizionale con piano alimentare scritto e 1° controllo di monitoraggio."
      : tier.id === "experience"
      ? cardGender === "donna"
        ? "Tutte le prestazioni Care Plus con Check-up Completo Donna, visita senologica con ecografia mammaria bilaterale, cardiologia + ecocardiogramma Color Doppler e oculistica."
        : "Tutte le prestazioni Care Plus con Check-up Completo Uomo, cardiologia con ecocardiogramma Color Doppler, oculistica specialistica, skin check-up e 2° controllo nutrizionale."
      : cardGender === "donna"
      ? "Tutte le prestazioni Experience Donna con Check-up Avanzato Donna + FIT, senologia con eco mammaria bilaterale, ecografia addominale e DNA 5 con consulenza genetica."
      : "Tutte le prestazioni Experience Uomo con Check-up Avanzato Uomo + FIT, ecografia addominale completa, dermatologia con dermatoscopia e test DNA 5 con consulenza genetica.";

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col justify-between rounded-[2rem] p-6 transition-all duration-300 ease-out hover:-translate-y-1.5",
        "border bg-white shadow-[0_14px_35px_-22px_rgba(3,53,75,0.16)] hover:shadow-[0_22px_45px_-18px_rgba(3,53,75,0.26)]",
        isFeatured
          ? "border-teal-500/80 ring-2 ring-teal-500/25"
          : "border-teal-100/90 hover:border-teal-300"
      )}
    >
      <div>
        {/* 1. Header: Badge di posizionamento + Sconto Club (Altezza fissa h-7) */}
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
            <span className="text-[10px] font-bold text-teal-800 bg-teal-50 border border-teal-200 rounded-full px-2.5 py-0.5">
              Sconto Club {tier.discountClub}
            </span>
          )}
        </div>

        {/* 2. Titolo del percorso */}
        <h3 className="mt-3 font-serif text-2xl sm:text-[1.75rem] font-bold tracking-tight text-teal-950">
          {tier.name}
        </h3>

        {/* 3. Slot Toggle Uomo / Donna (Altezza fissa h-9 per simmetria perfetta) */}
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
            <div className="inline-flex w-full items-center justify-center rounded-xl bg-[#f8fafb] py-1.5 px-3 border border-teal-100/60 text-[11px] font-medium text-charcoal/60">
              Percorso Unisex · Per tutti
            </div>
          )}
        </div>

        {/* 4. Prezzo pulito e compatto (SENZA Klarna e SENZA Tasso Zero) */}
        <div className="mt-3.5 flex items-baseline py-1 border-b border-teal-100/70">
          <span className="text-xl font-medium text-teal-700">€</span>
          <span className="font-serif text-4xl sm:text-[2.65rem] font-bold leading-none tracking-tight text-teal-950">
            {formatPricePlain(activePrice)}
          </span>
          <span className="ml-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal/60">
            / anno
          </span>
        </div>

        {/* 5. Descrizione narrativa ufficiale (Altezza fissa calcolata per allineare le card) */}
        <div className="mt-3.5 space-y-3">
          <p className="text-xs sm:text-[13px] leading-relaxed text-charcoal/75 h-[58px] overflow-hidden">
            {narrativeIntro}
          </p>

          {/* Box Comprende: elegante e discorsivo, senza elenchi puntati */}
          <div className="rounded-2xl bg-[#f8fafb] border border-teal-100/70 p-3.5 text-xs leading-relaxed text-charcoal/85 h-[115px] overflow-hidden flex flex-col justify-between">
            <div>
              <span className="font-semibold text-teal-900 block mb-1">Comprende:</span>
              <p className="text-[12px] text-charcoal/75 line-clamp-4 leading-snug">
                {comprendeText}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Footer con Azione e Link di approfondimento */}
      <div className="mt-5 pt-3 border-t border-teal-100/60">
        <Button
          variant={isFeatured ? "primary" : "secondary"}
          className="w-full py-2.5 text-xs sm:text-sm font-semibold shadow-sm transition-all hover:shadow-md"
          onClick={() => onChoose(tier, tier.genderToggle ? cardGender : undefined)}
        >
          Scegli Percorso
          <ArrowRight className="h-4 w-4" />
        </Button>
        <div className="mt-2 text-center">
          <Link
            href={`/club/${tier.id}`}
            className="text-[11px] font-semibold text-teal-700 hover:text-dark-navy hover:underline"
          >
            Tutte le prestazioni incluse →
          </Link>
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
    <section id="club" className="bg-white py-20 text-charcoal">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>Percorsi Salute</SectionLabel>
          <h2 className="font-serif text-4xl font-semibold leading-tight text-teal-900 sm:text-5xl">
            La salute come stile di vita
          </h2>
          <p className="mt-4 text-base leading-relaxed text-charcoal/70">
            Un programma esclusivo dedicato a chi sceglie la prevenzione costante.
            Accesso prioritario, check-up dedicati e vantaggi per tutta la famiglia.
          </p>
        </div>

        {/* 1. Card Discover Orizzontale Compatta in alto */}
        <div className="mt-10">
          <DiscoverHorizontalCard onChoose={openDiscover} />
        </div>

        {/* 2. Griglia a 4 colonne perfettamente simmetrica dei pacchetti a pagamento */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
          <div className="mx-auto mt-8 grid max-w-4xl gap-6 sm:grid-cols-2">
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
    <div className="group flex h-full flex-col rounded-3xl border border-teal-100 bg-canvas/60 p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-serif text-xl font-semibold text-teal-900">{tier.name}</h4>
        <span className="rounded-full bg-teal-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-teal-800">
          In arrivo
        </span>
      </div>
      <p className="mt-2.5 text-xs sm:text-[13px] leading-relaxed text-charcoal/70">{tier.description}</p>
      <div className="mt-5 rounded-2xl border border-teal-100 bg-teal-50/70 px-4 py-3 text-center text-xs font-medium text-teal-900">
        Scheda informativa · Attivazione disponibile prossimamente in sede
      </div>
    </div>
  );
}
