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
    <section id="club" className="relative overflow-hidden bg-dark-navy py-24 text-white">
      <div className="noise pointer-events-none absolute inset-0" />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-40 top-24 h-[34rem] w-[34rem] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(93,132,151,0.35) 0%, rgba(93,132,151,0) 70%)" }}
        />
        <div
          className="absolute left-1/2 top-[42%] h-[40rem] w-[40rem] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(128,161,178,0.22) 0%, rgba(128,161,178,0) 70%)" }}
        />
        <div
          className="absolute -right-44 top-[38%] h-[36rem] w-[36rem] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(159,194,207,0.25) 0%, rgba(93,132,151,0.10) 45%, rgba(93,132,151,0) 70%)" }}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>
      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
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
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
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
  const priceValue = tier.free ? 0 : tier.price;

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-3xl p-7 transition-all duration-500 ease-out hover:-translate-y-2.5",
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
          Vedi dettagli e scomposizione clinica
        </Link>
      )}
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
