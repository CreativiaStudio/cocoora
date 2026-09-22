"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { CLUB_TIERS, FAMILY_ADDONS } from "@/lib/club";
import type { ClubTier } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";
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
    <section id="club" className="relative bg-dark-navy py-24 text-white">
      <div className="noise pointer-events-none absolute inset-0" />
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>Cocoora Club</SectionLabel>
          <h2 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl">
            La salute come stile di vita
          </h2>
          <p className="mt-5 text-base leading-relaxed text-teal-200/85">
            Un programma esclusivo dedicato a chi sceglie la prevenzione costante.
            Accesso prioritario, check-up dedicati e vantaggi per tutta la famiglia.
          </p>

          <div className="mt-8 inline-flex items-center rounded-full border border-white/15 bg-white/5 p-1">
            {(["uomo", "donna"] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={cn(
                  "rounded-full px-6 py-2 text-sm font-medium capitalize transition-all",
                  gender === g ? "bg-white text-teal-900" : "text-teal-100/70"
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {CLUB_TIERS.map((tier) => (
            <TierCard
              key={tier.id}
              tier={tier}
              gender={tier.genderToggle ? gender : undefined}
              onChoose={handleChoose}
            />
          ))}
        </div>

        <div className="mt-16">
          <div className="mb-8 flex items-center gap-4">
            <h3 className="font-serif text-2xl font-semibold sm:text-3xl">
              Add-on Family
            </h3>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {FAMILY_ADDONS.map((tier) => (
              <FamilyCard key={tier.id} tier={tier} onChoose={handleChoose} />
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
    "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(128,161,178,0.10) 100%)",
  access:
    "linear-gradient(145deg, rgba(28,74,92,0.10) 0%, rgba(3,53,75,0.18) 100%)",
  care:
    "linear-gradient(145deg, rgba(3,53,75,0.12) 0%, rgba(28,74,92,0.22) 100%)",
  experience:
    "linear-gradient(145deg, rgba(28,74,92,0.16) 0%, rgba(3,53,75,0.28) 100%)",
  signature:
    "linear-gradient(145deg, rgba(128,161,178,0.12) 0%, rgba(28,74,92,0.30) 50%, rgba(3,53,75,0.35) 100%)",
  "signature-longevity":
    "linear-gradient(145deg, rgba(128,161,178,0.15) 0%, rgba(28,74,92,0.32) 50%, rgba(3,53,75,0.42) 100%)",
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

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-3xl p-7 transition-all duration-300 hover:-translate-y-2",
        dark
          ? "border border-white/20 backdrop-blur-sm hover:border-white/35 hover:shadow-[0_32px_80px_-24px_rgba(3,53,75,0.5)]"
          : "border border-teal-100 bg-white shadow-[0_20px_50px_-24px_rgba(3,53,75,0.25)] hover:shadow-[0_30px_70px_-24px_rgba(3,53,75,0.35)]",
        tier.badge && (dark ? "border-slate-accent/50" : "border-teal-500")
      )}
      style={
        dark
          ? {
              background: gradient,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), 0 24px 60px -24px rgba(3,53,75,0.4)",
            }
          : undefined
      }
    >
      {/* Shimmer line top per le card premium */}
      {dark && (
        <div className="absolute inset-x-0 top-0 h-px rounded-t-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      )}

      {tier.badge && (
        <Badge className="absolute -top-3 left-6 bg-teal-500 text-white">
          {tier.badge}
        </Badge>
      )}

      <div className="flex items-baseline justify-between">
        <h3 className={cn("font-serif text-2xl font-semibold", dark ? "text-white" : "text-teal-900")}>
          {name}
        </h3>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className={cn("font-serif text-4xl font-semibold", dark ? "text-white" : "text-teal-900")}>
          {tier.free ? "€0" : formatPrice(tier.price)}
        </span>
        {tier.listPrice && (
          <span className="text-lg text-slate-accent line-through">
            {formatPrice(tier.listPrice)}
          </span>
        )}
        <span className={cn("text-sm", dark ? "text-teal-200/70" : "text-charcoal/60")}>
          {tier.free ? "Free" : "/ anno"}
        </span>
      </div>

      <p className={cn("mt-3 text-sm leading-relaxed", dark ? "text-teal-200/80" : "text-charcoal/70")}>
        {tier.description}
      </p>

      <ul className="mt-6 flex-1 space-y-3">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm">
            <Check className={cn("mt-0.5 h-4 w-4 shrink-0", dark ? "text-slate-accent" : "text-teal-600")} />
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
    </div>
  );
}

function FamilyCard({
  tier,
  onChoose,
}: {
  tier: ClubTier;
  onChoose: (tier: ClubTier) => void;
}) {
  return (
    <div className="group flex flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/20">
      <h4 className="font-serif text-xl font-semibold text-white">{tier.name}</h4>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-serif text-2xl font-semibold text-white">
          {tier.price === 0 ? "Su misura" : formatPrice(tier.price)}
        </span>
        {tier.price !== 0 && (
          <span className="text-xs text-teal-200/60">/ anno</span>
        )}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-teal-200/80">{tier.description}</p>
      <ul className="mt-5 flex-1 space-y-2.5">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-teal-100/90">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-slate-accent" />
            {f}
          </li>
        ))}
      </ul>
      <Button variant="outline-dark" className="mt-6 w-full" onClick={() => onChoose(tier)}>
        Scegli
      </Button>
    </div>
  );
}
