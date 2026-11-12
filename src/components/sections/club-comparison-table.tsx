"use client";

import Link from "next/link";
import { Check, Minus, ArrowRight, Info } from "lucide-react";
import { CLUB_BENEFITS } from "@/lib/club";
import { Container, SectionLabel } from "@/components/ui";
import { ParametriEmatochimiciModal } from "@/components/club/parametri-ematochimici-modal";
import { cn } from "@/lib/utils";

export type ComparisonTierCol = {
  key: "access" | "care" | "experience" | "signature";
  label: string;
  price: string;
  subtitle: string;
  badge?: string;
};

export const COMPARISON_TIERS: ComparisonTierCol[] = [
  { key: "access", label: "Access", price: "€149 / anno", subtitle: "Prevenzione Base" },
  { key: "care", label: "Care Plus", price: "€299 / anno", subtitle: "Prevenzione Completa", badge: "Più Scelto" },
  { key: "experience", label: "Experience", price: "€599 U / €649 D", subtitle: "Diagnostica & Clinica" },
  { key: "signature", label: "Signature", price: "€890 U / €990 D", subtitle: "Genomica DNA 5 & Équipe" },
];

function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex shrink-0">
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

const CHECKUP_PANEL_BY_TIER: Record<ComparisonTierCol["key"], "salute_17" | "completo_48" | "avanzato_uomo_59"> = {
  access: "salute_17",
  care: "salute_17",
  experience: "completo_48",
  signature: "avanzato_uomo_59",
};

interface ClubComparisonTableProps {
  activeTierId?: string;
  title?: string;
  subtitle?: string;
  sectionLabel?: string;
  className?: string;
}

export function ClubComparisonTable({
  activeTierId,
  title = "Tabella comparativa delle prestazioni",
  subtitle = "Confronta nel dettaglio le prestazioni cliniche, diagnostiche e di laboratorio incluse in ciascun Percorso Salute annuale.",
  sectionLabel = "Confronto Percorsi",
  className,
}: ClubComparisonTableProps) {
  return (
    <section className={cn("bg-teal-50/60 py-20", className)}>
      <Container>
        <div className="text-center max-w-3xl mx-auto">
          <SectionLabel>{sectionLabel}</SectionLabel>
          <h2 className="font-serif text-3xl font-semibold text-teal-900 sm:text-4xl">
            {title}
          </h2>
          <p className="mt-3 text-sm text-charcoal/70">
            {subtitle}
          </p>
        </div>

        <p className="text-center text-xs text-charcoal/50 lg:hidden mt-4">
          ← Scorri orizzontalmente per confrontare tutti i percorsi →
        </p>

        <div className="mt-8 sm:mt-12 overflow-x-auto rounded-[2rem] border border-teal-100/90 bg-white shadow-[0_24px_60px_-28px_rgba(3,53,75,0.35)]">
          <table className="w-full min-w-[760px] text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-teal-100 bg-slate-50/70">
                <th className="p-5 font-semibold text-charcoal/70 w-[36%] align-bottom">
                  Prestazione Inclusa
                </th>
                {COMPARISON_TIERS.map((t) => {
                  const isActive = t.key === activeTierId;
                  return (
                    <th
                      key={t.key}
                      className={cn(
                        "p-5 text-center w-[16%] align-bottom transition-all",
                        isActive
                          ? "bg-dark-navy text-white shadow-md relative"
                          : "text-teal-900"
                      )}
                    >
                      {t.badge ? (
                        <span
                          className={cn(
                            "inline-block mb-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-xs",
                            isActive ? "bg-white/20 text-white" : "bg-teal-800 text-white"
                          )}
                        >
                          {t.badge}
                        </span>
                      ) : null}

                      <span
                        className={cn(
                          "block font-serif text-base font-semibold",
                          isActive ? "text-white text-lg font-bold" : "text-teal-900"
                        )}
                      >
                        {t.label}
                      </span>
                      <span
                        className={cn(
                          "block text-xs font-semibold mt-0.5",
                          isActive ? "text-teal-200" : "text-teal-700"
                        )}
                      >
                        {t.price}
                      </span>
                      <span
                        className={cn(
                          "block text-[11px] mt-0.5",
                          isActive ? "text-teal-100/80" : "text-charcoal/50"
                        )}
                      >
                        {t.subtitle}
                      </span>

                      {!isActive && (
                        <Link
                          href={`/club/${t.key}`}
                          className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 hover:text-dark-navy hover:underline"
                        >
                          Vedi scheda <ArrowRight className="h-3 w-3" />
                        </Link>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-teal-50">
              {CLUB_BENEFITS.map((b, i) => (
                <tr
                  key={b.label}
                  className={
                    i % 2
                      ? "bg-teal-50/20 hover:bg-teal-50/40 transition-colors"
                      : "hover:bg-teal-50/30 transition-colors"
                  }
                >
                  <td className="p-4 sm:p-5">
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-teal-950 block">{b.label}</span>
                      {b.tooltip && <InfoTooltip text={b.tooltip} />}
                    </div>
                    {i === 0 && (
                      <div className="mt-2">
                        <ParametriEmatochimiciModal
                          triggerText="Esplora tutti i pannelli (17 / 48 / 59 / 57)"
                          initialPanel="salute_17"
                        />
                      </div>
                    )}
                    {b.note && (
                      <span className="text-[11px] text-charcoal/55 block mt-0.5 italic">
                        * {b.note}
                      </span>
                    )}
                  </td>
                  {COMPARISON_TIERS.map((t) => {
                    const isActive = t.key === activeTierId;
                    const val = b[t.key];
                    return (
                      <td
                        key={t.key}
                        className={cn(
                          "p-4 sm:p-5 text-center align-middle transition-colors",
                          isActive && "bg-teal-50/70 border-x border-teal-200/80"
                        )}
                      >
                        {i === 0 && typeof val === "string" ? (
                          <ParametriEmatochimiciModal
                            triggerText={val}
                            initialPanel={CHECKUP_PANEL_BY_TIER[t.key]}
                            className={cn(
                              "text-xs font-semibold px-2.5 py-1",
                              isActive
                                ? "bg-primary-teal text-white shadow-xs font-bold hover:bg-primary-teal hover:text-white"
                                : "border border-teal-100"
                            )}
                          />
                        ) : typeof val === "boolean" ? (
                          val ? (
                            <span
                              className={cn(
                                "inline-flex h-7 w-7 items-center justify-center rounded-full mx-auto",
                                isActive
                                  ? "bg-primary-teal text-white shadow-xs"
                                  : "bg-teal-100/80 text-teal-800"
                              )}
                            >
                              <Check className={cn("h-4 w-4", isActive && "stroke-[2.5]")} />
                            </span>
                          ) : (
                            <Minus className="mx-auto h-4 w-4 text-charcoal/25" />
                          )
                        ) : (
                          <span
                            className={cn(
                              "inline-block rounded-lg px-2.5 py-1 text-xs font-semibold",
                              isActive
                                ? "bg-primary-teal text-white shadow-xs font-bold"
                                : "bg-teal-50 text-teal-900 border border-teal-100"
                            )}
                          >
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
          <p>• Le membership sono nominali e non trasferibili.</p>
          <p>• La membership ha validità di 12 mesi dalla data di sottoscrizione.</p>
          <p>• Ogni prestazione inclusa è erogabile una sola volta durante il periodo di validità della membership.</p>
          <p>• Nei percorsi Signature Uomo e Signature Donna è sempre incluso il test FIT (ricerca immunochimica del sangue occulto nelle feci).</p>
          <p>• <strong>Versioni Donna (Experience e Signature):</strong> la visita senologica comprende l&apos;ecografia mammaria bilaterale; in Signature Donna è inclusa anche la visita ginecologica con ecografia e Pap-test. La mammografia non è inclusa nella membership e può essere effettuata presso un centro convenzionato.</p>
          <p>• <strong>Visita di medicina estetica:</strong> valutazione clinica viso e corpo, senza trattamenti inclusi.</p>
        </div>
      </Container>
    </section>
  );
}
