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
  "signature-longevity":
    "linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(128,161,178,0.16) 55%, rgba(3,53,75,0.24) 100%)",
};


export function TierCard({
  tier,
  gender,
  onChoose,
  variant = "dark",
}: {
  tier: ClubTier;
  gender?: "uomo" | "donna";
  onChoose: (tier: ClubTier) => void;
  variant?: "dark" | "light";
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

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col rounded-3xl p-7 transition-all duration-500 ease-out hover:-translate-y-2.5",
        dark
          ? "border border-white/15 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.22),inset_0_-1px_1px_0_rgba(0,0,0,0.3),0_20px_50px_-20px_rgba(0,0,0,0.5)] backdrop-blur-xl hover:border-white/40 hover:shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.3),inset_0_-1px_1px_0_rgba(0,0,0,0.3),0_32px_70px_-20px_rgba(0,0,0,0.6),0_0_40px_-10px_rgba(128,161,178,0.3)]"
          : "border border-teal-100 bg-white shadow-[0_20px_50px_-24px_rgba(3,53,75,0.25)] hover:shadow-[0_30px_70px_-24px_rgba(3,53,75,0.35)]",
        featured &&
          "border-slate-accent/50 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.3),inset_0_-1px_1px_0_rgba(0,0,0,0.3),0_20px_60px_-15px_rgba(128,161,178,0.25)] hover:border-slate-accent/80 hover:shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.35),inset_0_-1px_1px_0_rgba(0,0,0,0.3),0_36px_80px_-15px_rgba(128,161,178,0.45)] xl:scale-[1.03]",
        !dark && tier.badge && "border-teal-500"
      )}
      style={dark ? { background: gradient } : undefined}
    >
      {dark && (
        <>
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-32 rounded-t-3xl opacity-70 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: `radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,${featured ? 0.14 : 0.08}) 0%, rgba(255,255,255,0) 70%)`,
            }}
          />
        </>
      )}

      {tier.badge && (
        <Badge
          className={cn(
            "absolute -top-3.5 left-6 gap-2 px-4 py-1.5 text-[11px]",
            dark
              ? "border border-teal-300/60 bg-dark-navy/60 text-white shadow-[0_0_20px_-2px_rgba(159,194,207,0.55),inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-md"
              : "bg-teal-500 text-white"
          )}
        >
          {dark && (
            <span className="h-1.5 w-1.5 rounded-full bg-teal-300 shadow-[0_0_8px_2px_rgba(159,194,207,0.8)]" />
          )}
          {tier.badge}
        </Badge>
      )}

      <div className="flex items-baseline justify-between">
        <h3 className={cn("font-serif text-2xl font-semibold", dark ? "text-white" : "text-teal-900")}>
          {name}
        </h3>
      </div>

      <div className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span
          className={cn(
            "flex items-baseline font-serif font-semibold tracking-tight",
            dark ? "text-white" : "text-teal-900"
          )}
        >
          <span className={cn("mr-1 text-2xl font-medium", dark ? "text-teal-300" : "text-teal-600")}>€</span>
          <span className="text-5xl leading-none">{formatPricePlain(priceValue)}</span>
        </span>
        {tier.listPrice && (
          <span className="text-lg text-slate-accent line-through">
            {formatPrice(tier.listPrice)}
          </span>
        )}
        <span
          className={cn(
            "text-sm font-medium uppercase tracking-[0.12em]",
            dark ? "text-teal-200/70" : "text-charcoal/60"
          )}
        >
          {tier.free ? "Free" : "/ anno"}
        </span>
      </div>

      {dark && <div className="mt-5 h-px w-full bg-gradient-to-r from-white/25 via-white/10 to-transparent" />}

      <p className={cn("mt-3 text-sm leading-relaxed", dark ? "text-teal-200/80" : "text-charcoal/70")}>
        {tier.description}
      </p>

      <ul className="mt-6 flex-1 space-y-3">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm">
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                dark
                  ? "bg-teal-500/20 text-teal-300 ring-1 ring-teal-300/20"
                  : "bg-teal-500/10 text-teal-600"
              )}
            >
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            <span className={dark ? "text-teal-100/90" : "text-charcoal/80"}>{f}</span>
          </li>
        ))}
      </ul>

      <Button
        variant={dark ? "white" : "primary"}
        className="mt-7 w-full"
        onClick={() => onChoose(tier)}
      >
        {tier.free ? "Inizia gratis" : "Scegli"}
        <ArrowRight className="h-4 w-4" />
      </Button>
      {!tier.family && (
        <Link
          href={`/club/${tier.id}`}
          className={cn(
            "mt-3 text-center text-xs font-medium underline-offset-4 transition-colors hover:underline",
            dark ? "text-teal-200/70 hover:text-white" : "text-teal-700 hover:text-dark-navy"
          )}
        >
          Vedi dettagli e prestazioni incluse
        </Link>
      )}
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
