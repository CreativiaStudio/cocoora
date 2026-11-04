"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container, SectionLabel } from "@/components/ui";
import {
  MATRIX_DATA,
  TREATMENTS_MAP,
  type MatrixArea,
} from "@/components/sections/matrice-medicina";

const AREA_LABELS: Record<MatrixArea, string> = {
  VISO: "Viso",
  PELLE: "Pelle",
  CORPO: "Corpo",
};

export default function MedicinaEsteticaPage() {
  const [selectedArea, setSelectedArea] = useState<MatrixArea>("VISO");
  const [selectedGoalIdx, setSelectedGoalIdx] = useState<number>(0);

  const goals = MATRIX_DATA[selectedArea];
  const activeGoal = goals[selectedGoalIdx] ?? goals[0];
  const activeTreatmentNames = activeGoal?.treatments ?? [];

  const handleAreaChange = (area: MatrixArea) => {
    setSelectedArea(area);
    setSelectedGoalIdx(0);
  };

  return (
    <div className="relative min-h-screen bg-canvas overflow-hidden pt-28 sm:pt-36 lg:pt-40 pb-24 sm:pb-32">
      {/* Background soft glow accents */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] opacity-70"
        style={{
          background:
            "radial-gradient(55% 50% at 50% 0%, rgba(128,161,178,0.18) 0%, rgba(243,248,250,0.4) 60%, transparent 100%)",
        }}
      />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-slate-accent/15 blur-3xl" />

      <Container className="relative">
        {/* Intestazione principale */}
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>MEDICINA ESTETICA</SectionLabel>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-dark-navy">
            Da dove vuoi iniziare?
          </h1>
          <p className="mt-5 text-base sm:text-lg leading-relaxed text-charcoal/75 max-w-2xl mx-auto">
            Ogni persona ha esigenze diverse. Esplora i trattamenti Cocoora partendo da ciò che vorresti migliorare.
          </p>
        </div>

        {/* STEP 1: Area */}
        <div className="mt-12 sm:mt-14 mx-auto max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-800 text-center sm:text-left">
            1. QUALE AREA TI INTERESSA?
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2 rounded-2xl bg-white p-1.5 shadow-sm border border-teal-100">
            {(["VISO", "PELLE", "CORPO"] as MatrixArea[]).map((area) => {
              const active = selectedArea === area;
              return (
                <button
                  key={area}
                  type="button"
                  onClick={() => handleAreaChange(area)}
                  className={`rounded-xl py-3 text-sm font-semibold tracking-tight transition-all ${
                    active
                      ? "bg-dark-navy text-white shadow-md shadow-dark-navy/20"
                      : "text-charcoal/70 hover:bg-slate-50 hover:text-dark-navy"
                  }`}
                >
                  {AREA_LABELS[area]}
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 2: Cosa vorresti migliorare? */}
        <div className="mt-10 mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-800 text-center sm:text-left">
            2. COSA VORRESTI MIGLIORARE?
          </p>
          <div className="mt-3 flex flex-wrap gap-2.5 justify-center sm:justify-start">
            {goals.map((g, idx) => {
              const active = selectedGoalIdx === idx;
              return (
                <button
                  key={g.label}
                  type="button"
                  onClick={() => setSelectedGoalIdx(idx)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs sm:text-sm font-medium transition-all ${
                    active
                      ? "bg-teal-700 text-white shadow-sm ring-2 ring-teal-700/20"
                      : "bg-white text-charcoal/80 border border-teal-100/90 hover:border-teal-300 hover:text-dark-navy shadow-2xs"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full transition-colors ${
                      active ? "bg-white" : "bg-teal-400"
                    }`}
                  />
                  <span>{g.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Trattamenti Correlati Cards */}
        <div className="mt-16 sm:mt-20">
          <div className="flex items-center gap-2.5 justify-center sm:justify-start mb-8">
            <Sparkles className="h-4 w-4 text-teal-700" />
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-dark-navy">
              Scopri i trattamenti correlati
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeTreatmentNames.map((name) => {
              const t = TREATMENTS_MAP[name];
              if (!t) return null;
              return (
                <div
                  key={t.name}
                  className="group flex flex-col overflow-hidden rounded-[2rem] border border-teal-100 bg-white shadow-[0_16px_40px_-28px_rgba(3,53,75,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-24px_rgba(3,53,75,0.4)]"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <Image
                      src={t.image}
                      alt={t.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-navy/40 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-4 rounded-full bg-white/95 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-900 shadow-2xs">
                      {t.overline}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-serif text-xl font-bold text-teal-900 group-hover:text-dark-navy transition-colors">
                      {t.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/70">
                      {t.description}
                    </p>
                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <Link
                        href={`/trattamenti/${t.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 group-hover:text-dark-navy transition-colors"
                      >
                        <span>SCOPRI IL TRATTAMENTO</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
}
