"use client";

import { useState } from "react";
import { Info, X, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

export type CheckupPanelKey = "salute_17" | "completo_48" | "avanzato_uomo_59" | "avanzato_donna_57";

type Voce = { numero: string; nome: string };

const toVoci = (nomi: string[]): Voce[] =>
  nomi.map((nome, i) => ({ numero: String(i + 1).padStart(2, "0"), nome }));

const VOCI_01_17 = [
  "Emocromo completo con formula leucocitaria",
  "Glicemia",
  "Emoglobina glicata (HbA1c)",
  "Colesterolo totale",
  "Colesterolo HDL",
  "Colesterolo LDL",
  "Trigliceridi",
  "Creatinina",
  "eGFR (filtrato glomerulare stimato, calcolato)",
  "Azotemia",
  "AST (GOT)",
  "ALT (GPT)",
  "Gamma GT (GGT)",
  "Fosfatasi alcalina (ALP)",
  "Bilirubina totale",
  "Albumina",
  "Esame urine completo chimico-fisico e microscopico del sedimento",
];

const VOCI_18_48 = [
  "Apolipoproteina B (ApoB)",
  "Lipoproteina(a) [Lp(a)]",
  "Proteina C reattiva (PCR)",
  "Velocità di eritrosedimentazione (VES)",
  "Insulina basale",
  "Indice HOMA-IR (calcolato)",
  "Acido urico",
  "Tempo di protrombina (PT) con INR",
  "Tempo di tromboplastina parziale attivata (aPTT)",
  "TSH",
  "FT3 (triiodotironina libera)",
  "FT4 (tiroxina libera)",
  "DHEA-S",
  "Estradiolo",
  "FSH",
  "LH",
  "Vitamina D (25-OH)",
  "Vitamina B12",
  "Folati",
  "Magnesio",
  "Sideremia",
  "Ferritina",
  "Transferrina",
  "Bilirubina diretta",
  "Bilirubina indiretta (calcolata)",
  "Proteine totali",
  "Elettroforesi sieroproteica completa (frazioni e rapporto A/G)",
  "Sodio",
  "Potassio",
  "Calcio",
  "Albumina urinaria quantitativa (microalbuminuria)",
];

const VOCI_49_59_UOMO = [
  "Prolattina",
  "SHBG (globulina legante gli ormoni sessuali)",
  "Zinco",
  "Anticorpi anti-transglutaminasi tissutale (anti-tTG), classe IgA",
  "Anticorpi anti-endomisio (EMA), classe IgA",
  "Immunoglobuline A totali (IgA)",
  "Testosterone totale",
  "Testosterone libero",
  "PSA totale",
  "PSA libero",
  "FIT — ricerca immunochimica del sangue occulto nelle feci",
];

const VOCI_49_56_DONNA = [
  "Progesterone",
  "Prolattina",
  "SHBG (globulina legante gli ormoni sessuali)",
  "Zinco",
  "Anticorpi anti-transglutaminasi tissutale (anti-tTG), classe IgA",
  "Anticorpi anti-endomisio (EMA), classe IgA",
  "Immunoglobuline A totali (IgA)",
  "FIT — ricerca immunochimica del sangue occulto nelle feci",
];

export const PARAMETRI_EMATOCHIMICI_17 = toVoci(VOCI_01_17);
export const PARAMETRI_COMPLETO_48 = toVoci([...VOCI_01_17, ...VOCI_18_48]);
export const PARAMETRI_AVANZATO_UOMO_59 = toVoci([...VOCI_01_17, ...VOCI_18_48, ...VOCI_49_59_UOMO]);
export const PARAMETRI_AVANZATO_DONNA_57 = toVoci([...VOCI_01_17, ...VOCI_18_48, ...VOCI_49_56_DONNA]);

const PANNELLI: Record<
  CheckupPanelKey,
  { tab: string; sub: string; titolo: string; voci: Voce[] }
> = {
  salute_17: {
    tab: "Salute (17)",
    sub: "Access e Care Plus",
    titolo: "Check-up Cocoora Salute: 17 parametri",
    voci: PARAMETRI_EMATOCHIMICI_17,
  },
  completo_48: {
    tab: "Completo U/D (48)",
    sub: "Experience Uomo e Donna",
    titolo: "Check-up Completo Uomo e Donna: 48 parametri",
    voci: PARAMETRI_COMPLETO_48,
  },
  avanzato_uomo_59: {
    tab: "Avanzato Uomo (59)",
    sub: "Signature Uomo",
    titolo: "Check-up Avanzato Uomo: 59 parametri",
    voci: PARAMETRI_AVANZATO_UOMO_59,
  },
  avanzato_donna_57: {
    tab: "Avanzato Donna (57)",
    sub: "Signature Donna",
    titolo: "Check-up Avanzato Donna: 57 parametri",
    voci: PARAMETRI_AVANZATO_DONNA_57,
  },
};

const PANEL_ORDER: CheckupPanelKey[] = ["salute_17", "completo_48", "avanzato_uomo_59", "avanzato_donna_57"];

export function ParametriEmatochimiciModal({
  triggerText = "Vedi elenco analisi",
  initialPanel = "salute_17",
  className,
}: {
  triggerText?: string;
  initialPanel?: CheckupPanelKey;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [panel, setPanel] = useState<CheckupPanelKey>(initialPanel);
  const current = PANNELLI[panel];

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setPanel(initialPanel);
          setIsOpen(true);
        }}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-semibold text-teal-800 transition-all hover:bg-teal-100 hover:text-dark-navy",
          className
        )}
      >
        <Info className="h-3 w-3 text-teal-600" />
        <span>{triggerText}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop con sfocatura */}
          <div
            className="fixed inset-0 bg-dark-navy/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-teal-100 bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between border-b border-teal-100/80 pb-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 border border-teal-100">
                  <FlaskConical className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-dark-navy">
                    {current.titolo}
                  </h3>
                  <p className="text-xs text-charcoal/70">
                    {current.sub} · {current.voci.length} voci analitiche
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-charcoal/50 hover:bg-teal-50 hover:text-dark-navy transition-colors"
                aria-label="Chiudi finestra"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tab Pannelli */}
            <div role="tablist" className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PANEL_ORDER.map((key) => {
                const isActive = key === panel;
                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setPanel(key)}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all",
                      isActive
                        ? "border-dark-navy bg-dark-navy text-white shadow-sm"
                        : "border-teal-100 bg-white text-teal-900 hover:border-teal-300 hover:bg-teal-50/60"
                    )}
                  >
                    <span className="block">{PANNELLI[key].tab}</span>
                    <span
                      className={cn(
                        "block text-[10px] font-normal mt-0.5",
                        isActive ? "text-teal-200" : "text-charcoal/55"
                      )}
                    >
                      {PANNELLI[key].sub}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Griglia Parametri */}
            <ol className="mt-5 grid gap-2 sm:grid-cols-2">
              {current.voci.map((p) => (
                <li
                  key={p.numero}
                  className="flex items-start gap-3 rounded-xl border border-teal-100/80 bg-white px-3 py-2.5"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-teal-50 text-[10px] font-bold text-teal-800 border border-teal-100">
                    {p.numero}
                  </span>
                  <span className="text-sm leading-snug text-teal-950">{p.nome}</span>
                </li>
              ))}
            </ol>

            {/* Footer Nota Ufficiale */}
            <div className="mt-6 rounded-2xl bg-teal-50/70 border border-teal-100 p-4 text-xs text-charcoal/75 leading-relaxed">
              <strong className="text-teal-900 block mb-1">Nota ufficiale:</strong>
              Elenco analitico per la verifica delle membership Cocoora Club. Analisi del sangue con prelievo e analisi delle urine. Il test FIT (ricerca immunochimica del sangue occulto nelle feci) è sempre incluso nei percorsi Signature.
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-dark-navy px-6 py-2.5 text-xs font-semibold text-white transition-all hover:bg-teal-900"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
