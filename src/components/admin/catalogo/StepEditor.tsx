"use client";

import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock,
  DoorOpen,
  ListOrdered,
  Stethoscope,
} from "lucide-react";
import {
  formatPriceCents,
  formatStepDuration,
  type CatalogService,
} from "@/lib/catalogo/csvSchema";
import { cn } from "@/lib/utils";

type StepEditorProps = {
  service: CatalogService | null;
};

export function StepEditor({ service }: StepEditorProps) {
  if (!service) {
    return (
      <div className="rounded-2xl border border-dashed border-[#80A1B2]/40 bg-white px-6 py-14 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1C4A5C]/8 text-[#1C4A5C]">
          <ListOrdered className="h-5 w-5" />
        </div>
        <p className="mt-3 text-sm font-bold text-[#03354B]">
          Seleziona una prestazione
        </p>
        <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-[#3D3D3C]/65">
          Apri la scheda di una prestazione dalla tabella del catalogo per
          visualizzare la timeline dei segmenti, le sale coinvolte e la durata
          complessiva.
        </p>
      </div>
    );
  }

  const steps = [...service.steps].sort(
    (left, right) => left.order - right.order
  );
  const totalMinutes = steps.reduce(
    (total, step) => total + step.durationMinutes,
    0
  );
  const rooms = Array.from(new Set(steps.map((step) => step.room)));
  const hasDoctor = steps.some((step) => step.withDoctor);
  const durationAligned = totalMinutes === service.durationMinutes;
  const hasSharedRoom = rooms.includes("Sala OPT");

  return (
    <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
      <section className="overflow-hidden rounded-2xl border border-[#80A1B2]/25 bg-white shadow-[0_18px_40px_-32px_rgba(3,53,75,0.45)]">
        <header className="border-b border-[#80A1B2]/20 bg-[#F4F8F9] px-5 py-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#80A1B2]">
                Timeline della prestazione
              </p>
              <h2 className="mt-1 text-base font-bold leading-snug text-[#03354B]">
                {service.name}
              </h2>
              <p className="mt-1 text-xs text-[#3D3D3C]/65">
                {service.code} · {service.specialty}
              </p>
            </div>
            <span className="rounded-full border border-[#1C4A5C]/15 bg-[#1C4A5C]/8 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#1C4A5C]">
              {service.area}
            </span>
          </div>
        </header>

        <div className="px-5 py-5">
          <ol className="relative space-y-0">
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1;

              return (
                <li key={step.id} className="relative flex gap-4 pb-6 last:pb-0">
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className="absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-px bg-[#80A1B2]/45"
                    />
                  )}
                  <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#1C4A5C] bg-white text-xs font-bold text-[#1C4A5C] shadow-sm">
                    {step.order}
                  </span>

                  <div className="min-w-0 flex-1 rounded-xl border border-[#80A1B2]/25 bg-[#F8FAFB] px-4 py-3.5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold text-[#03354B]">
                          {step.title}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-medium text-[#3D3D3C]/70">
                          <span className="inline-flex items-center gap-1.5">
                            <DoorOpen className="h-3.5 w-3.5 text-[#80A1B2]" />
                            {step.room}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-[#80A1B2]" />
                            {formatStepDuration(step.durationMinutes)}
                          </span>
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5",
                              step.withDoctor
                                ? "text-[#1C4A5C]"
                                : "text-[#3D3D3C]/55"
                            )}
                          >
                            <Stethoscope className="h-3.5 w-3.5" />
                            {step.withDoctor ? "Con medico" : "Senza medico"}
                          </span>
                        </div>
                      </div>
                      <span className="rounded-md bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#3D3D3C]/60 ring-1 ring-[#80A1B2]/25">
                        Step {step.order}
                      </span>
                    </div>

                    {step.notes && (
                      <p className="mt-2.5 border-t border-[#80A1B2]/20 pt-2.5 text-[11px] leading-relaxed text-[#3D3D3C]/70">
                        {step.notes}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-5 flex flex-wrap items-center gap-2 rounded-xl border border-[#80A1B2]/25 bg-white px-4 py-3 text-[11px] text-[#3D3D3C]/70">
            <CalendarClock className="h-4 w-4 text-[#80A1B2]" />
            <span>
              Durata standard della prestazione:{" "}
              <strong className="font-bold text-[#03354B]">
                {formatStepDuration(service.durationMinutes)}
              </strong>
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-[#80A1B2]" />
            <span>
              Timeline calcolata:{" "}
              <strong
                className={cn(
                  "font-bold",
                  durationAligned ? "text-emerald-700" : "text-amber-700"
                )}
              >
                {formatStepDuration(totalMinutes)}
              </strong>
            </span>
            {durationAligned && (
              <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-600" />
            )}
          </div>
        </div>
      </section>

      <aside className="space-y-4">
        <section className="rounded-2xl border border-[#80A1B2]/25 bg-white p-5 shadow-[0_18px_40px_-32px_rgba(3,53,75,0.45)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#80A1B2]">
            Riepilogo operativo
          </p>

          <dl className="mt-3 space-y-3 text-xs">
            <div className="flex items-center justify-between gap-3 border-b border-[#80A1B2]/15 pb-2.5">
              <dt className="text-[#3D3D3C]/65">Tariffa</dt>
              <dd className="font-bold text-[#1C4A5C]">
                {formatPriceCents(service.priceCents)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-[#80A1B2]/15 pb-2.5">
              <dt className="text-[#3D3D3C]/65">Segmenti</dt>
              <dd className="font-bold text-[#03354B]">{steps.length}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 border-b border-[#80A1B2]/15 pb-2.5">
              <dt className="text-[#3D3D3C]/65">Sale coinvolte</dt>
              <dd className="text-right font-bold text-[#03354B]">
                {rooms.join(" · ") || "Da assegnare"}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-[#3D3D3C]/65">Presenza medico</dt>
              <dd className="font-bold text-[#03354B]">
                {hasDoctor ? "Prevista" : "Non prevista"}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-[#1C4A5C]/15 bg-[#1C4A5C] p-5 text-white shadow-[0_18px_40px_-28px_rgba(3,53,75,0.75)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#80A1B2]">
            Regola sale condivise
          </p>
          <p className="mt-2 text-xs leading-relaxed text-white/85">
            La Sala RX/OPT/TAC non ha un medico fisso. La prenotazione di una
            visita odontoiatrica blocca automaticamente la disponibilità della
            Sala OPT; sullo stesso macchinario non possono sovrapporsi due
            trattamenti contemporanei.
          </p>
          {hasSharedRoom && (
            <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-amber-300/15 px-3 py-2 text-[11px] font-semibold text-amber-100">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
              Questa prestazione utilizza la Sala OPT condivisa
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-[#80A1B2]/25 bg-[#F8FAFB] p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#80A1B2]">
            Nota di catalogo
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-[#3D3D3C]/70">
            Gli slot standard durano un&apos;ora, con margine per igienizzazione
            e riordino della sala. I segmenti mostrati sono una vista operativa
            della prestazione e non modificano la durata clinica registrata nel
            piano di cura.
          </p>
        </section>
      </aside>
    </div>
  );
}
