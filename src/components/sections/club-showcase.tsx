"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { CLUB_TIERS, FAMILY_ADDONS } from "@/lib/club";
import type { ClubTier } from "@/lib/types";
import { cn, formatPrice, formatPricePlain } from "@/lib/utils";
import { useShop } from "../providers";
import { Badge, Button, SectionLabel } from "../ui";

export function ClubShowcase() {
  const { openCheckout, openDiscover } = useShop();
  const [gender, setGender] = useState<"uomo" | "donna">("uomo");

  const handleChoose = (tier: ClubTier) => {
    if (tier.free) {
      openDiscover();
      return;
    }
    openCheckout(tier, tier.genderToggle ? gender : undefined);
  };

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

          <div className="mt-8 inline-flex items-center rounded-full border border-teal-100 bg-canvas p-1">
            {(["uomo", "donna"] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={cn(
                  "rounded-full px-6 py-2 text-sm font-medium capitalize transition-all",
                  gender === g
                    ? "bg-teal-900 text-white shadow-sm"
                    : "text-charcoal/60 hover:text-teal-900"
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Griglia su desktop · carosello con scroll orizzontale su mobile */}
        <div className="mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 pt-5 scrollbar-none lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
          {CLUB_TIERS.map((tier) => (
            <div
              key={tier.id}
              className="w-[85%] shrink-0 snap-center sm:w-[45%] lg:w-auto"
            >
              <TierCard
                tier={tier}
                gender={tier.genderToggle ? gender : undefined}
                onChoose={handleChoose}
                variant="light"
              />
            </div>
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

// Gradienti premium per ogni tier (dark variant)
const TIER_GRADIENTS: Record<string, string> = {
  discover:
    "linear-gradient(160deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 100%)",
  access:
    "linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(128,161,178,0.07) 100%)",
  care:
    "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%)",
  experience:
    "linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(93,132,151,0.12) 100%)",
  signature:
    "linear-gradient(160deg, rgba(255,255,255,0.09) 0%, rgba(93,132,151,0.16) 60%, rgba(3,53,75,0.20) 100%)",
};


export function TierCard({
  tier,
  gender,
  onChoose,
  variant = "dark",
  maxFeatures = 4,
}: {
  tier: ClubTier;
  gender?: "uomo" | "donna";
  onChoose: (tier: ClubTier) => void;
  variant?: "dark" | "light";
  maxFeatures?: number;
}) {
  const dark = variant === "dark";
  const name = gender && tier.genderToggle ? `${tier.name} ${gender === "uomo" ? "Uomo" : "Donna"}` : tier.name;
  const gradient = dark ? (TIER_GRADIENTS[tier.id] ?? TIER_GRADIENTS["access"]) : undefined;
  const featured = dark && !!tier.badge;
  const priceValue = tier.free
    ? 0
    : gender === "uomo" && tier.priceUomo
    ? tier.priceUomo
    : gender === "donna" && tier.priceDonna
    ? tier.priceDonna
    : tier.price;

  const displayedFeatures = maxFeatures ? tier.features.slice(0, maxFeatures) : tier.features;
  const remaining = tier.features.length - displayedFeatures.length;

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col rounded-[2rem] p-5 sm:p-6 transition-all duration-300 ease-out hover:-translate-y-1.5",
        dark
          ? "border border-white/15 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.22),0_18px_45px_-18px_rgba(0,0,0,0.5)] backdrop-blur-xl hover:border-white/35"
          : "border border-teal-100/90 bg-white shadow-[0_16px_40px_-24px_rgba(3,53,75,0.18)] hover:shadow-[0_24px_50px_-20px_rgba(3,53,75,0.28)] hover:border-teal-200",
        featured &&
          "border-slate-accent/50 shadow-[0_20px_50px_-15px_rgba(128,161,178,0.25)] hover:border-slate-accent/80 xl:scale-[1.02]",
        !dark && tier.badge && "border-teal-500/80 ring-1 ring-teal-500/20"
      )}
      style={dark ? { background: gradient } : undefined}
    >
      {dark && (
        <>
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-28 rounded-t-[2rem] opacity-70 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: `radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,${featured ? 0.14 : 0.08}) 0%, rgba(255,255,255,0) 70%)`,
            }}
          />
        </>
      )}

      {tier.badge && (
        <Badge
          className={cn(
            "absolute -top-3 left-5 gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider",
            dark
              ? "border border-teal-300/60 bg-dark-navy/80 text-white shadow-[0_0_15px_-2px_rgba(159,194,207,0.55)] backdrop-blur-md"
              : "bg-teal-600 text-white shadow-sm"
          )}
        >
          {dark && (
            <span className="h-1.5 w-1.5 rounded-full bg-teal-300 shadow-[0_0_8px_2px_rgba(159,194,207,0.8)]" />
          )}
          {tier.badge}
        </Badge>
      )}

      <div className="flex items-baseline justify-between">
        <h3 className={cn("font-serif text-xl sm:text-2xl font-bold tracking-tight", dark ? "text-white" : "text-teal-950")}>
          {name}
        </h3>
      </div>

      <p className={cn("mt-1.5 text-xs sm:text-[13px] leading-relaxed line-clamp-2", dark ? "text-teal-200/80" : "text-charcoal/70")}>
        {tier.description}
      </p>

      {/* Box Prezzo & Rateizzazione compatto su una sola riga */}
      <div className="mt-3 flex items-baseline justify-between gap-2 border-y border-teal-100/70 py-2.5 dark:border-white/10">
        <div className="flex items-baseline">
          <span className={cn("text-lg font-medium", dark ? "text-teal-300" : "text-teal-600")}>€</span>
          <span className={cn("font-serif text-3xl sm:text-4xl font-bold leading-none tracking-tight", dark ? "text-white" : "text-teal-950")}>
            {formatPricePlain(priceValue)}
          </span>
          {tier.listPrice && (
            <span className="ml-1.5 text-xs text-slate-accent line-through">
              {formatPrice(tier.listPrice)}
            </span>
          )}
          <span className={cn("ml-1 text-[11px] font-semibold uppercase tracking-wider", dark ? "text-teal-200/70" : "text-charcoal/60")}>
            {tier.free ? "Free" : "/ anno"}
          </span>
        </div>
        {priceValue > 0 && (
          <div className="text-right">
            <span className="inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700/50">
              Tasso Zero
            </span>
            <p className="text-[11px] font-medium text-charcoal/80 dark:text-teal-100/80 mt-0.5 whitespace-nowrap">
              3 rate da <strong>{formatPrice(Math.round(priceValue / 3))}</strong>
            </p>
          </div>
        )}
      </div>

      {/* Feature sintetizzate ad alto impatto */}
      <ul className="mt-3.5 flex-1 space-y-2">
        {displayedFeatures.map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs sm:text-[13px] leading-snug">
            <span
              className={cn(
                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                dark
                  ? "bg-teal-500/20 text-teal-300 ring-1 ring-teal-300/25"
                  : "bg-teal-50 text-teal-700 ring-1 ring-teal-200/80"
              )}
            >
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
            </span>
            <span className={dark ? "text-teal-100/90" : "text-charcoal/80"}>{f}</span>
          </li>
        ))}
        {remaining > 0 && (
          <li className="pt-0.5">
            <Link
              href={`/club/${tier.id}`}
              className={cn(
                "inline-flex items-center gap-1 text-[11px] font-semibold transition-colors hover:underline",
                dark ? "text-teal-300 hover:text-white" : "text-teal-700 hover:text-dark-navy"
              )}
            >
              <span>+ altre {remaining} prestazioni incluse</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </li>
        )}
      </ul>

      {/* Pulsante e badge pagamenti */}
      <div className="mt-5 space-y-2 pt-2 border-t border-teal-100/50 dark:border-white/10">
        <Button
          variant={dark ? "white" : "primary"}
          className="w-full py-2.5 text-sm font-semibold shadow-sm transition-all hover:shadow-md"
          onClick={() => onChoose(tier)}
        >
          {tier.free ? "Inizia gratis" : "Scegli Percorso"}
          <ArrowRight className="h-4 w-4" />
        </Button>
        {priceValue > 0 && (
          <div
            className={cn(
              "flex items-center justify-center gap-1.5 text-[10px] pt-0.5 text-center",
              dark ? "text-teal-200/60" : "text-charcoal/50"
            )}
          >
            <span>Carta</span>
            <span>·</span>
            <span>Apple Pay</span>
            <span>·</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Klarna 3 rate</span>
            <span>·</span>
            <span className="font-semibold text-teal-700 dark:text-teal-300">PayPal</span>
          </div>
        )}
      </div>
    </div>
  );
}

function FamilyCard({
  tier,
}: {
  tier: ClubTier;
}) {
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
