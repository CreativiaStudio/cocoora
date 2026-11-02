"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

import {
  MATRIX_DATA,
  TREATMENTS_MAP,
  type MatrixArea,
  type MatrixGoal,
  type TreatmentRef,
} from "@/components/sections/matrice-medicina";

const AREAS: { key: MatrixArea; label: string }[] = [
  { key: "VISO", label: "Viso" },
  { key: "PELLE", label: "Pelle" },
  { key: "CORPO", label: "Corpo" },
];

const DRUM_LIMIT = 3;
const DRUM_STEP = 56;

export function ClinicalPerspectiveDrum() {
  const prefersReducedMotion = useReducedMotion();

  const [selectedArea, setSelectedArea] = useState<MatrixArea>("VISO");
  const [activeGoalIdx, setActiveGoalIdx] = useState<number>(0);
  const [selectedTreatmentName, setSelectedTreatmentName] = useState<string | null>(null);

  const goals: MatrixGoal[] = MATRIX_DATA[selectedArea] ?? [];
  const activeGoal: MatrixGoal | undefined = goals[activeGoalIdx];
  const treatments: string[] = activeGoal?.treatments ?? [];
  const currentName: string | null = selectedTreatmentName ?? treatments[0] ?? null;
  const currentTreatment: TreatmentRef | undefined = currentName
    ? TREATMENTS_MAP[currentName]
    : undefined;

  function selectArea(area: MatrixArea) {
    if (area === selectedArea) return;
    setSelectedArea(area);
    setActiveGoalIdx(0);
    setSelectedTreatmentName(null);
  }

  function selectGoal(idx: number) {
    if (idx === activeGoalIdx) return;
    setActiveGoalIdx(idx);
    setSelectedTreatmentName(null);
  }

  function stepGoal(delta: number) {
    if (goals.length === 0) return;
    setActiveGoalIdx((prev) => {
      const next = prev + delta;
      if (next < 0) return 0;
      if (next > goals.length - 1) return goals.length - 1;
      return next;
    });
    setSelectedTreatmentName(null);
  }

  return (
    <section className="relative w-full overflow-hidden rounded-[28px] bg-[#00344b] px-5 py-12 text-white sm:px-8 sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-teal-300/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#1c4a5c]/50 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-6xl">
        {/* Intestazione + switcher aree */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-md">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#80a1b2]">
              Prospettiva clinica
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Ogni obiettivo, il suo percorso
            </h2>
          </div>

          <div className="inline-flex w-fit items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1">
            {AREAS.map((area) => {
              const isActive = selectedArea === area.key;
              return (
                <button
                  key={area.key}
                  type="button"
                  onClick={() => selectArea(area.key)}
                  aria-pressed={isActive}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors sm:px-5 ${
                    isActive ? "text-white" : "text-[#c5dbe3]/70 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="drumAreaActive"
                      className="absolute inset-0 rounded-full border border-teal-300/40 bg-white/15"
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 380, damping: 34 }
                      }
                    />
                  )}
                  <span className="relative z-10">{area.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Layout due colonne */}
        <div className="grid items-center gap-8 lg:grid-cols-12">
          {/* Colonna sinistra: tamburo cilindrico prospettico */}
          <div className="lg:col-span-6">
            <div className="flex items-stretch gap-4">
              {/* Righello millimetrico verticale con mirino centrale */}
              <div
                aria-hidden="true"
                className="relative h-[360px] w-9 shrink-0 select-none"
              >
                <div className="absolute inset-y-0 right-0 flex w-full flex-col justify-between py-1">
                  {Array.from({ length: 25 }).map((_, tick) => (
                    <span
                      key={tick}
                      className={`ml-auto h-px ${
                        tick % 5 === 0 ? "w-5 bg-[#80a1b2]/60" : "w-2.5 bg-[#80a1b2]/25"
                      }`}
                    />
                  ))}
                </div>
                <div className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center">
                  <span className="h-px w-5 bg-teal-300/80" />
                  <span className="block h-2.5 w-2.5 rotate-45 border border-teal-300/80 bg-teal-300/20" />
                </div>
              </div>

              {/* Tamburo */}
              <div
                className="relative h-[360px] flex-1 overflow-hidden"
                style={{ perspective: "1000px" }}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-[#00344b] to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-[#00344b] to-transparent"
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full">
                    {goals.map((goal, idx) => {
                      const offset = idx - activeGoalIdx;
                      if (Math.abs(offset) > DRUM_LIMIT) return null;

                      const isActive = offset === 0;

                      return (
                        <button
                          key={goal.label}
                          type="button"
                          onClick={() => selectGoal(idx)}
                          aria-pressed={isActive}
                          className={`absolute left-1/2 top-0 w-[86%] rounded-2xl border px-4 py-3 text-left backdrop-blur-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-teal-300/60 ${
                            isActive
                              ? "border-teal-300/40 bg-white/15 text-white shadow-xl"
                              : "border-white/10 bg-white/[0.04] text-[#c5dbe3]/80 hover:border-teal-300/25 hover:bg-white/[0.08]"
                          }`}
                          style={{
                            transform: `translate(-50%, -50%) translateY(${
                              offset * DRUM_STEP
                            }px) rotateX(${offset * -18}deg) translateZ(${
                              -Math.abs(offset) * 28
                            }px) scale(${1 - Math.abs(offset) * 0.06})`,
                            opacity: Math.max(0.2, 1 - Math.abs(offset) * 0.28),
                            transition: prefersReducedMotion
                              ? "none"
                              : "transform 520ms cubic-bezier(0.22, 1, 0.36, 1), opacity 520ms ease, background-color 300ms ease, border-color 300ms ease",
                            zIndex: 10 - Math.abs(offset),
                          }}
                        >
                          <span className="flex items-center justify-between gap-3">
                            <span className="block font-serif text-lg font-semibold leading-tight">
                              {goal.label}
                            </span>
                            <span
                              className={`text-[11px] tabular-nums ${
                                isActive ? "text-teal-200" : "text-[#80a1b2]/60"
                              }`}
                            >
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Frecce di scorrimento */}
                <button
                  type="button"
                  onClick={() => stepGoal(-1)}
                  disabled={activeGoalIdx <= 0}
                  aria-label="Obiettivo precedente"
                  className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/10 text-[#e2edf1] transition-colors hover:border-teal-300/40 hover:bg-white/20 hover:text-white disabled:pointer-events-none disabled:opacity-30"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => stepGoal(1)}
                  disabled={activeGoalIdx >= goals.length - 1}
                  aria-label="Obiettivo successivo"
                  className="absolute bottom-2 right-2 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/10 text-[#e2edf1] transition-colors hover:border-teal-300/40 hover:bg-white/20 hover:text-white disabled:pointer-events-none disabled:opacity-30"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Colonna destra: vetrina trattamento correlato */}
          <div className="lg:col-span-6">
            {activeGoal && (
              <div className="mb-4">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#80a1b2]">
                  Obiettivo selezionato
                </p>
                <h3 className="mt-1.5 font-serif text-2xl font-medium text-white">
                  {activeGoal.label}
                </h3>
              </div>
            )}

            {treatments.length > 1 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {treatments.map((name) => {
                  const isSelected = currentName === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setSelectedTreatmentName(name)}
                      aria-pressed={isSelected}
                      className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                        isSelected
                          ? "border-teal-300/50 bg-white/15 text-white"
                          : "border-white/10 bg-transparent text-[#c5dbe3]/70 hover:border-teal-300/30 hover:text-white"
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            )}

            <AnimatePresence mode="wait">
              {currentTreatment ? (
                <motion.article
                  key={currentTreatment.slug ?? currentName ?? "treatment"}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-5"
                >
                  <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-2xl">
                    <Image
                      src={currentTreatment.image}
                      alt={currentTreatment.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 40vw, 100vw"
                    />
                  </div>

                  <span className="mb-3 inline-block rounded-full border border-teal-300/30 bg-teal-300/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#e2edf1]">
                    {currentTreatment.overline}
                  </span>

                  <h4 className="mb-2 font-serif text-2xl font-semibold text-white sm:text-3xl">
                    {currentTreatment.title}
                  </h4>

                  <p className="mb-4 text-sm leading-relaxed text-[#c5dbe3]/80">
                    {currentTreatment.description}
                  </p>

                  <Link
                    href={`/trattamenti/${currentTreatment.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-teal-200"
                  >
                    Approfondisci il trattamento
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.article>
              ) : (
                <motion.div
                  key="empty-state"
                  initial={prefersReducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-sm leading-relaxed text-[#c5dbe3]/75"
                >
                  Seleziona un obiettivo per visualizzare i trattamenti correlati.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
