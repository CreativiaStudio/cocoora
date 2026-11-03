"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { ArrowRight, Activity } from "lucide-react";

import {
  MATRIX_DATA,
  TREATMENTS_MAP,
  type MatrixArea,
  type MatrixGoal,
  type TreatmentRef,
} from "@/components/sections/matrice-medicina";

const AREAS: ReadonlyArray<{ key: MatrixArea; label: string }> = [
  { key: "VISO", label: "Viso" },
  { key: "PELLE", label: "Pelle" },
  { key: "CORPO", label: "Corpo" },
];

const GLASS_BORDER = "rgba(28,74,92,0.15)";
const GLASS_HIGHLIGHT = "rgba(255,255,255,0.2)";

export function GlassMatrixDrum() {
  const prefersReducedMotion = useReducedMotion();

  const [selectedArea, setSelectedArea] = useState<MatrixArea>("VISO");
  const [activeGoalIdx, setActiveGoalIdx] = useState(0);

  const goals: MatrixGoal[] = MATRIX_DATA[selectedArea] ?? [];
  const activeGoal: MatrixGoal | undefined = goals[activeGoalIdx] ?? goals[0];
  const treatmentNames: string[] = activeGoal?.treatments ?? [];
  const treatments: TreatmentRef[] = treatmentNames
    .map((name) => TREATMENTS_MAP[name])
    .filter((treatment): treatment is TreatmentRef => Boolean(treatment));

  function selectArea(area: MatrixArea) {
    if (area === selectedArea) return;
    setSelectedArea(area);
    setActiveGoalIdx(0);
  }

  const containerVariants: Variants = prefersReducedMotion
    ? {
        hidden: { opacity: 1 },
        visible: { opacity: 1 },
        exit: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.35,
            ease: "easeOut",
            staggerChildren: 0.07,
          },
        },
        exit: {
          opacity: 0,
          y: -10,
          transition: { duration: 0.2, ease: "easeIn" },
        },
      };

  const cardVariants: Variants = prefersReducedMotion
    ? {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0 },
      }
    : {
        hidden: { opacity: 0, y: 18 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: "easeOut" },
        },
      };

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-[#F7FAFB] via-[#F2F7F9] to-[#EAF2F5] px-5 py-20 sm:px-8 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-[#80A1B2]/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 bottom-0 h-96 w-96 rounded-full bg-[#1C4A5C]/10 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <div
            className="inline-flex items-center gap-2 rounded-full border bg-white/40 px-4 py-1.5 backdrop-blur-md"
            style={{
              borderColor: GLASS_BORDER,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.65)",
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#80A1B2]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#1C4A5C]">
              Medicina Estetica
            </span>
          </div>

          <h2 className="mt-5 font-serif text-3xl font-semibold tracking-tight text-[#03354B] sm:text-4xl lg:text-5xl">
            Da dove vuoi iniziare?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#3D3D3C]/80">
            Ogni persona ha esigenze diverse. Esplora i trattamenti Cocoora
            partendo da ciò che vorresti migliorare.
          </p>
        </div>

        <div
          className="mt-10 rounded-[28px] border bg-white/45 p-5 shadow-[0_24px_60px_-40px_rgba(3,53,75,0.45)] backdrop-blur-md sm:p-7"
          style={{
            borderColor: GLASS_BORDER,
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.7), 0 24px 60px -40px rgba(3,53,75,0.45)",
          }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-[#1C4A5C]">
              1. Quale area ti interessa?
            </p>

            <div
              role="group"
              aria-label="Quale area ti interessa?"
              className="relative inline-flex w-fit items-center gap-1 rounded-full border bg-white/40 p-1.5 backdrop-blur-md"
              style={{
                borderColor: GLASS_BORDER,
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.8), 0 10px 24px -18px rgba(3,53,75,0.5)",
              }}
            >
              {AREAS.map((area) => {
                const isActive = selectedArea === area.key;

                return (
                  <button
                    key={area.key}
                    type="button"
                    onClick={() => selectArea(area.key)}
                    aria-pressed={isActive}
                    className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C4A5C]/40 focus-visible:ring-offset-2 sm:px-7 ${
                      isActive
                        ? "text-white"
                        : "text-[#1C4A5C]/70 hover:text-[#03354B]"
                    }`}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 rounded-full border border-white/20 bg-gradient-to-br from-[#1C4A5C] to-[#03354B] shadow-[0_10px_22px_-12px_rgba(3,53,75,0.8)]"
                        style={{
                          boxShadow:
                            "inset 0 1px 0 rgba(255,255,255,0.28), 0 10px 22px -12px rgba(3,53,75,0.8)",
                        }}
                        transition={
                          prefersReducedMotion
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 220, damping: 28 }
                        }
                      />
                    ) : null}
                    <span className="relative z-10">{area.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-7 border-t border-[#1C4A5C]/10 pt-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[#1C4A5C]">
              2. Cosa vorresti migliorare?
            </p>

            <div className="mt-3 flex flex-wrap gap-2.5">
              {goals.map((goal, idx) => {
                const isActive = activeGoalIdx === idx;

                return (
                  <button
                    key={goal.label}
                    type="button"
                    onClick={() => setActiveGoalIdx(idx)}
                    aria-pressed={isActive}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium backdrop-blur-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C4A5C]/40 focus-visible:ring-offset-2 sm:text-sm ${
                      isActive
                        ? "border-[#1C4A5C]/35 bg-[#1C4A5C]/10 text-[#03354B] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
                        : "bg-white/40 text-[#3D3D3C]/80 hover:border-[#80A1B2]/60 hover:text-[#03354B]"
                    }`}
                    style={
                      isActive
                        ? undefined
                        : {
                            borderColor: GLASS_BORDER,
                            boxShadow:
                              "inset 0 1px 0 rgba(255,255,255,0.65)",
                          }
                    }
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isActive ? "bg-[#1C4A5C]" : "bg-[#80A1B2]"
                      }`}
                    />
                    <span>{goal.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-14" aria-live="polite">
          <div className="mb-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-start">
            <Activity className="h-4 w-4 text-[#1C4A5C]" aria-hidden="true" />
            <h3 className="font-serif text-lg font-semibold text-[#03354B]">
              Scopri i trattamenti correlati
            </h3>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedArea}-${activeGoalIdx}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {treatments.map((treatment) => (
                <motion.article
                  key={treatment.slug}
                  variants={cardVariants}
                  className="group flex flex-col overflow-hidden rounded-[26px] border border-white/70 bg-white/80 shadow-[0_18px_44px_-30px_rgba(3,53,75,0.45)] backdrop-blur-md transition-shadow duration-300 hover:shadow-[0_28px_60px_-30px_rgba(3,53,75,0.5)]"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EAF2F5]">
                    <Image
                      src={treatment.image}
                      alt={treatment.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#03354B]/40 via-transparent to-transparent" />
                    <span
                      className="absolute bottom-3 left-4 rounded-full border bg-white/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1C4A5C] backdrop-blur-md"
                      style={{ borderColor: GLASS_HIGHLIGHT }}
                    >
                      {treatment.overline}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h4 className="font-serif text-xl font-bold text-[#03354B] transition-colors group-hover:text-[#1C4A5C]">
                      {treatment.title}
                    </h4>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-[#3D3D3C]/75">
                      {treatment.description}
                    </p>

                    {activeGoal ? (
                      <div
                        className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 backdrop-blur-md"
                        style={{
                          borderColor: GLASS_BORDER,
                          backgroundColor: "rgba(128,161,178,0.12)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.65)",
                        }}
                      >
                        <Activity
                          className="h-3 w-3 shrink-0 text-[#80A1B2]"
                          aria-hidden="true"
                        />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#80A1B2]">
                          Obiettivo
                        </span>
                        <span className="text-xs font-semibold text-[#1C4A5C]">
                          {activeGoal.label}
                        </span>
                      </div>
                    ) : null}

                    <div className="mt-5 border-t border-[#1C4A5C]/10 pt-4">
                      <Link
                        href={`/trattamenti/${treatment.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1C4A5C] transition-colors hover:text-[#03354B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C4A5C]/40 focus-visible:ring-offset-2"
                      >
                        <span>Scopri il trattamento</span>
                        <ArrowRight
                          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
