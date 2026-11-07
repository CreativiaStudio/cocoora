"use client";

import { useState } from "react";
import { Info, X, CheckCircle2, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

export const PARAMETRI_EMATOCHIMICI_17 = [
  { numero: "01", nome: "Emocromo completo con formula leucocitaria", desc: "Globuli rossi, globuli bianchi, piastrine ed emoglobina per il quadro ematologico generale." },
  { numero: "02", nome: "Glicemia a digiuno", desc: "Monitoraggio dei livelli di glucosio nel sangue e screening metabolico." },
  { numero: "03", nome: "Creatinina sierica con eGFR", desc: "Valutazione della funzionalità e del filtraggio renale." },
  { numero: "04", nome: "Azotemia (Urea)", desc: "Metabolismo delle proteine e funzionalità escretoria renale." },
  { numero: "05", nome: "Uricemia (Acido Urico)", desc: "Controllo dei livelli di acido urico e prevenzione metabolica." },
  { numero: "06", nome: "Colesterolo Totale", desc: "Inquadramento lipidico complessivo e rischio cardiovascolare." },
  { numero: "07", nome: "Colesterolo HDL", desc: "Frazione protettiva ('colesterolo buono') per l'equilibrio vascolare." },
  { numero: "08", nome: "Colesterolo LDL", desc: "Frazione aterogena ('colesterolo cattivo') da monitorare per la prevenzione arteriosa." },
  { numero: "09", nome: "Trigliceridi", desc: "Grassi circolanti nel sangue legati all'alimentazione e al metabolismo energetico." },
  { numero: "10", nome: "Transaminasi AST (GOT)", desc: "Enzima indicatore della funzionalità epatica e muscolare." },
  { numero: "11", nome: "Transaminasi ALT (GPT)", desc: "Marcatore specifico della salute delle cellule del fegato." },
  { numero: "12", nome: "Gamma-GT (GGT)", desc: "Enzima epato-biliare per la valutazione della funzionalità epatica." },
  { numero: "13", nome: "Bilirubina totale e frazionata", desc: "Valutazione del metabolismo della bile e del funzionamento del fegato." },
  { numero: "14", nome: "Sideremia (Ferro sierico)", desc: "Concentrazione di ferro circolante nell'organismo." },
  { numero: "15", nome: "Ferritina", desc: "Riserva reale di ferro immagazzinata nei tessuti." },
  { numero: "16", nome: "VES (Velocità di Eritrosedimentazione)", desc: "Indice aspecifico di infiammazione sistemica." },
  { numero: "17", nome: "Proteina C Reattiva (PCR ad alta sensibilità)", desc: "Indicatore sensibile di processi infiammatori acuti o cronici." },
];

export function ParametriEmatochimiciModal({
  triggerText = "Vedi i 17 parametri",
  className,
}: {
  triggerText?: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
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
          <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-teal-100 bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between border-b border-teal-100/80 pb-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 border border-teal-100">
                  <FlaskConical className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-dark-navy">
                    Check-up Laboratorio Salute: 17 Parametri
                  </h3>
                  <p className="text-xs text-charcoal/70">
                    Pannello ematochimico preventivo di base incluso nei Percorsi Access e Care Plus.
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

            {/* Lista Parametri */}
            <div className="mt-6 divide-y divide-teal-50 space-y-2">
              {PARAMETRI_EMATOCHIMICI_17.map((p) => (
                <div key={p.numero} className="pt-2.5 pb-2 flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-teal-50 text-[10px] font-bold text-teal-800 border border-teal-100">
                    {p.numero}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-teal-950 flex items-center gap-1.5">
                      {p.nome}
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    </h4>
                    <p className="text-xs text-charcoal/70 mt-0.5 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Nota Clinica */}
            <div className="mt-6 rounded-2xl bg-teal-50/70 border border-teal-100 p-4 text-xs text-charcoal/75 leading-relaxed">
              <strong className="text-teal-900 block mb-1">Nota della Direzione Sanitaria:</strong>
              Il prelievo ematico viene eseguito in sede con refertazione completa digitale. Il pannello include i 17 parametri biochimici fondamentali per l&apos;inquadramento dello stato di salute generale, del profilo cardiovascolare, epatico, renale e metabolico.
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
