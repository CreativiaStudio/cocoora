"use client";

import { useState } from "react";
import { Check, Minus } from "lucide-react";
import { useCms, useShop } from "@/components/providers";
import { CLUB_BENEFITS, CLUB_TIERS, FAMILY_ADDONS, PRECISION_PATHS } from "@/lib/club";
import { TierCard } from "@/components/sections/club-showcase";
import type { ClubTier } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge, Container, SectionLabel } from "@/components/ui";

export default function ClubPage() {
  const { pages } = useCms();
  const { openCheckout, openDiscover } = useShop();
  const page = pages.find((p) => p.path === "/club");
  const [gender, setGender] = useState<"uomo" | "donna">("uomo");

  const choose = (tier: ClubTier) => {
    if (tier.free) {
      openDiscover();
      return;
    }
    openCheckout(tier, tier.genderToggle ? gender : undefined);
  };

  return (
    <>
      <section className="hero-mesh relative overflow-hidden pb-20 pt-32 sm:pt-36">
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mx-auto">Cocoora Club</Badge>
            <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-dark-navy sm:text-6xl">
              {page?.h1 ?? "Cocoora Club"}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-charcoal/75">
              {page?.h2 ?? "La salute come stile di vita"}. Un programma esclusivo
              dedicato a chi sceglie la prevenzione costante: accesso prioritario,
              check-up dedicati e vantaggi per tutta la famiglia.
            </p>
            <p className="mx-auto mt-4 max-w-xl text-sm text-charcoal/60">
              Tutte le membership Cocoora Club sono nominative, personali e non
              trasferibili. Durata annuale dalla data di attivazione.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-canvas py-20">
        <Container>
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <SectionLabel>Membership Annuali</SectionLabel>
            <h2 className="font-serif text-4xl font-semibold text-teal-900">Scegli il tuo percorso</h2>
            <div className="mt-8 inline-flex items-center rounded-full border border-teal-200 bg-white p-1">
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
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {CLUB_TIERS.map((tier) => (
              <TierCard
                key={tier.id}
                tier={tier}
                gender={tier.genderToggle ? gender : undefined}
                onChoose={choose}
                variant="light"
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-teal-50/60 py-20">
        <Container>
          <div className="text-center">
            <SectionLabel>Add-on Family</SectionLabel>
            <h2 className="font-serif text-3xl font-semibold text-teal-900 sm:text-4xl">
              Copertura per tutta la famiglia
            </h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {FAMILY_ADDONS.map((tier) => (
              <div key={tier.id} className="rounded-3xl border border-teal-100 bg-white p-7 shadow-[0_16px_40px_-28px_rgba(3,53,75,0.35)]">
                <h3 className="font-serif text-xl font-semibold text-teal-900">{tier.name}</h3>
                <p className="mt-2 text-sm text-charcoal/65">{tier.description}</p>
                <ul className="mt-4 space-y-2">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-charcoal/75">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => choose(tier)}
                  className="mt-6 w-full rounded-full bg-primary-teal px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-dark-navy"
                >
                  Scegli
                </button>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-canvas py-20">
        <Container>
          <div className="text-center">
            <SectionLabel>Cocoora Precision</SectionLabel>
            <h2 className="font-serif text-4xl font-semibold text-teal-900">
              Percorsi di precisione
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-charcoal/70">
              Diagnosi avanzata e protocolli personalizzati per una prevenzione su misura.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {PRECISION_PATHS.map((p) => (
              <div key={p.id} className="rounded-3xl border border-teal-100 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(3,53,75,0.35)]">
                <h3 className="font-serif text-xl font-semibold text-teal-900">{p.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{p.description}</p>
                <ul className="mt-4 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-charcoal/75">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-teal-300 bg-teal-50/40 p-7 text-center">
              <p className="font-serif text-lg font-semibold text-teal-900">Vuoi saperne di più?</p>
              <p className="mt-2 text-sm text-charcoal/65">
                Il nostro team ti guida nella scelta del percorso più adatto.
              </p>
              <button
                type="button"
                onClick={openDiscover}
                className="mt-5 rounded-full border border-teal-600 px-6 py-2.5 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-600 hover:text-white"
              >
                Inizia gratis
              </button>
            </div>
          </div>
        </Container>
      </section>

      <ComparisonTable />

      <FaqSection faq={page?.faq ?? []} />
    </>
  );
}

const COMPARISON_TIERS = [
  { key: "access", label: "Access" },
  { key: "care", label: "Care" },
  { key: "experience", label: "Experience" },
  { key: "signature", label: "Signature" },
] as const;

function ComparisonTable() {
  return (
    <section className="bg-teal-50/60 py-20">
      <Container>
        <div className="text-center">
          <SectionLabel>Confronta</SectionLabel>
          <h2 className="font-serif text-3xl font-semibold text-teal-900 sm:text-4xl">
            Tabella comparativa dei benefici
          </h2>
        </div>
        <div className="mt-10 overflow-x-auto rounded-3xl border border-teal-100 bg-white shadow-[0_20px_50px_-28px_rgba(3,53,75,0.4)]">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-teal-100">
                <th className="p-5 font-medium text-charcoal/60">Beneficio</th>
                {COMPARISON_TIERS.map((t) => (
                  <th key={t.key} className="p-5 text-center font-serif text-base font-semibold text-teal-900">
                    {t.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CLUB_BENEFITS.map((b, i) => (
                <tr key={b.label} className={i % 2 ? "bg-teal-50/40" : ""}>
                  <td className="p-5 font-medium text-teal-900">{b.label}</td>
                  {COMPARISON_TIERS.map((t) => (
                    <td key={t.key} className="p-5 text-center">
                      {b[t.key] ? (
                        <Check className="mx-auto h-5 w-5 text-teal-600" />
                      ) : (
                        <Minus className="mx-auto h-5 w-5 text-charcoal/30" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}

function FaqSection({ faq }: { faq: { q: string; a: string }[] }) {
  if (faq.length === 0) return null;
  return (
    <section className="bg-canvas pb-24">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <SectionLabel>Domande Frequenti</SectionLabel>
            <h2 className="font-serif text-3xl font-semibold text-teal-900">FAQ</h2>
          </div>
          <div className="mt-10 space-y-4">
            {faq.map((f) => (
              <details key={f.q} className="rounded-2xl border border-teal-100 bg-white p-6">
                <summary className="cursor-pointer list-none font-medium text-teal-900">{f.q}</summary>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
