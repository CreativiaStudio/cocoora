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
            <SectionLabel>Percorsi Salute Annuali</SectionLabel>
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
            <p className="mx-auto mt-3 max-w-2xl text-sm text-charcoal/70">
              Attivabili esclusivamente in abbinamento a un Percorso Salute con
              quota pari o superiore ad Access (€99 / anno). Non attivabili su
              profilo Discover Free.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
            {FAMILY_ADDONS.map((tier) => (
              <div key={tier.id} className="flex flex-col rounded-3xl border border-teal-100 bg-white p-7 shadow-[0_16px_40px_-28px_rgba(3,53,75,0.35)]">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-serif text-xl font-semibold text-teal-900">{tier.name}</h3>
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-teal-800">
                    In arrivo
                  </span>
                </div>
                <p className="mt-2 text-sm text-charcoal/65">{tier.description}</p>
                <ul className="mt-4 flex-1 space-y-2">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-charcoal/75">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50/60 px-4 py-3 text-center text-xs font-medium text-teal-900">
                  Scheda informativa · Attivazione disponibile prossimamente in sede
                </div>
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

type ComparisonTierCol = {
  key: "access" | "care" | "experience" | "signature";
  label: string;
  price: string;
  subtitle: string;
  badge?: string;
};

const COMPARISON_TIERS: ComparisonTierCol[] = [
  { key: "access", label: "Access", price: "€149 / anno", subtitle: "Prevenzione Base" },
  { key: "care", label: "Care Plus", price: "€299 / anno", subtitle: "Prevenzione Completa", badge: "Più Scelto" },
  { key: "experience", label: "Experience", price: "€599 U / €649 D", subtitle: "Diagnostica & Clinica" },
  { key: "signature", label: "Signature", price: "€940 U / €990 D", subtitle: "Genomica DNA 5 & Équipe" },
];

function ComparisonTable() {
  return (
    <section className="bg-teal-50/60 py-20">
      <Container>
        <div className="text-center max-w-3xl mx-auto">
          <SectionLabel>Confronto Ufficiale</SectionLabel>
          <h2 className="font-serif text-3xl font-semibold text-teal-900 sm:text-4xl">
            Tabella comparativa delle prestazioni
          </h2>
          <p className="mt-3 text-sm text-charcoal/70">
            Confronta nel dettaglio le prestazioni cliniche, diagnostiche e di laboratorio incluse in ciascun Percorso Salute annuale.
          </p>
        </div>
        <div className="mt-12 overflow-x-auto rounded-[2rem] border border-teal-100/90 bg-white shadow-[0_24px_60px_-28px_rgba(3,53,75,0.35)]">
          <table className="w-full min-w-[760px] text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-teal-100 bg-slate-50/70">
                <th className="p-5 font-semibold text-charcoal/70 w-[36%]">Prestazione Inclusa</th>
                {COMPARISON_TIERS.map((t) => (
                  <th key={t.key} className="p-5 text-center w-[16%]">
                    {t.badge && (
                      <span className="inline-block mb-1.5 rounded-full bg-teal-800 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
                        {t.badge}
                      </span>
                    )}
                    <span className="block font-serif text-base font-semibold text-teal-900">
                      {t.label}
                    </span>
                    <span className="block text-xs font-semibold text-teal-700 mt-0.5">
                      {t.price}
                    </span>
                    <span className="block text-[11px] text-charcoal/50 mt-0.5">
                      {t.subtitle}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-teal-50">
              {CLUB_BENEFITS.map((b, i) => (
                <tr key={b.label} className={i % 2 ? "bg-teal-50/25 hover:bg-teal-50/50 transition-colors" : "hover:bg-teal-50/40 transition-colors"}>
                  <td className="p-4 sm:p-5">
                    <span className="font-medium text-teal-950 block">{b.label}</span>
                    {b.note && (
                      <span className="text-[11px] text-charcoal/55 block mt-0.5 italic">
                        * {b.note}
                      </span>
                    )}
                  </td>
                  {COMPARISON_TIERS.map((t) => {
                    const val = b[t.key];
                    return (
                      <td key={t.key} className="p-4 sm:p-5 text-center align-middle">
                        {typeof val === "boolean" ? (
                          val ? (
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-teal-100/80 text-teal-800 mx-auto">
                              <Check className="h-4 w-4" />
                            </span>
                          ) : (
                            <Minus className="mx-auto h-4 w-4 text-charcoal/25" />
                          )
                        ) : (
                          <span className="inline-block rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-900">
                            {val}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Note esplicative vincolanti di Direzione Sanitaria */}
        <div className="mt-6 rounded-2xl border border-teal-100 bg-white/80 p-5 text-xs leading-relaxed text-charcoal/70 space-y-1.5">
          <p>
            <strong className="text-teal-900">Note cliniche e informative:</strong>
          </p>
          <p>• <strong>U/D:</strong> versione calibrata sui parametri clinici specifici Uomo / Donna.</p>
          <p>• <strong>Senologia Donna:</strong> include visita senologica ed ecografia mammaria bilaterale sia in Experience Donna che in Signature Donna.</p>
          <p>• <strong>Mammografia:</strong> prestazione non inclusa nella quota e non effettuata in sede (Cocoora non dispone di macchinario mammografico); se prescritta dal senologo, è effettuabile presso centro convenzionato esterno.</p>
          <p>• <strong>Visita medicina estetica:</strong> consultazione clinica e inquadramento viso/corpo personalizzato, senza trattamenti inclusi.</p>
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
