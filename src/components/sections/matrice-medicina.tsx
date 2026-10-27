"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container, SectionLabel } from "@/components/ui";

type TreatmentRef = {
  name: string;
  slug: string;
  overline: string;
  title: string;
  description: string;
  image: string;
};

const TREATMENTS_MAP: Record<string, TreatmentRef> = {
  "Tossina botulinica": {
    name: "Tossina botulinica",
    slug: "tossina-botulinica",
    overline: "VISO",
    title: "Tossina botulinica",
    description: "Per distendere le rughe d'espressione e armonizzare alcune aree del viso.",
    image: "/images/trattamenti/medicina-estetica/botox-napoli-1.jpg",
  },
  "Filler viso": {
    name: "Filler viso",
    slug: "filler-acido-ialuronico",
    overline: "VISO",
    title: "Filler viso con acido ialuronico",
    description: "Per valorizzare proporzioni e volumi del viso in modo naturale.",
    image: "/images/trattamenti/medicina-estetica/filler-viso-napoli-1.jpg",
  },
  "Ultrasuoni CFU": {
    name: "Ultrasuoni CFU",
    slug: "ultrasuoni-cfu",
    overline: "TECNOLOGIE",
    title: "Ultrasuoni focalizzati CFU",
    description: "Per il tono dei tessuti e la definizione di alcune aree del viso e del collo.",
    image: "/images/trattamenti/medicina-estetica/cfu-napoli-1.jpg",
  },
  "Biostimolatori": {
    name: "Biostimolatori",
    slug: "acido-polilattico",
    overline: "RIGENERAZIONE",
    title: "Biostimolatori",
    description: "Per supportare la qualità della pelle e accompagnare il viso nel tempo.",
    image: "/images/trattamenti/medicina-estetica/biostimolatori-napoli-1.jpg",
  },
  "Biostimolazione": {
    name: "Biostimolazione",
    slug: "biorivitalizzazione",
    overline: "RIGENERAZIONE",
    title: "Biostimolazione cutanea",
    description: "Per stimolare idratazione profonda, luminosità e qualità del tessuto cutaneo.",
    image: "/images/trattamenti/medicina-estetica/bistimolazione-napoli-1.jpg",
  },
  "Biorigenerazione": {
    name: "Biorigenerazione",
    slug: "biorigenerazione",
    overline: "RIGENERAZIONE",
    title: "Biorigenerazione",
    description: "Per favorire la rigenerazione e la vitalità biologica dei tessuti cutanei.",
    image: "/images/trattamenti/medicina-estetica/biorigenerazione-napoli-1.jpg",
  },
  "PRX": {
    name: "PRX",
    slug: "prx",
    overline: "RIGENERAZIONE",
    title: "PRX biostimolazione senza aghi",
    description: "Biostimolazione non invasiva per restituire luminosità e compattezza.",
    image: "/images/trattamenti/medicina-estetica/prx-napoli-1.jpg",
  },
  "Laser e luce pulsata": {
    name: "Laser e luce pulsata",
    slug: "laser-luce-pulsata",
    overline: "TECNOLOGIE",
    title: "Laser e luce pulsata",
    description: "Piattaforma avanzata per intervenire su macchie, discromie e rossori.",
    image: "/images/trattamenti/medicina-estetica/laser-luce-pulsata-napoli-1.jpg",
  },
  "Peeling chimico": {
    name: "Peeling chimico",
    slug: "peeling-chimico",
    overline: "RIGENERAZIONE",
    title: "Peeling chimico medicale",
    description: "Esfoliazione controllata per rinnovare la texture e uniformare il colorito.",
    image: "/images/trattamenti/medicina-estetica/peeling-medicale-napoli-1.jpg",
  },
  "Laser resurfacing": {
    name: "Laser resurfacing",
    slug: "laser-resurfacing",
    overline: "TECNOLOGIE",
    title: "Laser resurfacing",
    description: "Protocolli laser per cicatrici da acne, rughe sottili e texture cutanea.",
    image: "/images/trattamenti/medicina-estetica/laser-resurfacing-napoli-1.jpg",
  },
  "Criolipolisi": {
    name: "Criolipolisi",
    slug: "cryoliposculpt",
    overline: "CORPO",
    title: "Criolipolisi",
    description: "Rimodellamento non invasivo per le adiposità localizzate resistenti.",
    image: "/images/trattamenti/medicina-estetica/criolipolisi-napoli-1.jpg",
  },
  "Intralipoterapia": {
    name: "Intralipoterapia",
    slug: "intralipoterapia",
    overline: "CORPO",
    title: "Intralipoterapia",
    description: "Trattamento iniettivo mirato alla riduzione del grasso localizzato.",
    image: "/images/trattamenti/medicina-estetica/intralipoterapia-napoli-1.jpg",
  },
  "Carbossiterapia": {
    name: "Carbossiterapia",
    slug: "carbossiterapia",
    overline: "CORPO",
    title: "Carbossiterapia medicale",
    description: "CO2 medicale per microcircolo, cellulite e compattezza dei tessuti.",
    image: "/images/trattamenti/medicina-estetica/carbossiterapia-napoli-1.jpg",
  },
  "Mesoterapia": {
    name: "Mesoterapia",
    slug: "mesoterapia",
    overline: "CORPO",
    title: "Mesoterapia",
    description: "Micro-iniezioni intradermiche per contrastare ritenzione e cellulite.",
    image: "/images/trattamenti/medicina-estetica/mesoterapia-napoli-1.jpg",
  },
  "Biostimolazione corpo": {
    name: "Biostimolazione corpo",
    slug: "biostimolazione-corpo",
    overline: "CORPO",
    title: "Biostimolazione corpo",
    description: "Stimolazione del collagene per lassità e compattezza di glutei, cosce e braccia.",
    image: "/images/trattamenti/medicina-estetica/biostimolazione-corpo-napoli-1.jpg",
  },
};

type MatrixArea = "VISO" | "PELLE" | "CORPO";

type MatrixGoal = {
  label: string;
  treatments: string[];
};

const MATRIX_DATA: Record<MatrixArea, MatrixGoal[]> = {
  VISO: [
    { label: "Rughe d'espressione", treatments: ["Tossina botulinica"] },
    { label: "Volumi e proporzioni del viso", treatments: ["Filler viso"] },
    { label: "Definizione di mento e mandibola", treatments: ["Filler viso", "Ultrasuoni CFU"] },
    { label: "Perdita di tono e lassità", treatments: ["Ultrasuoni CFU", "Biostimolatori"] },
    { label: "Bruxismo e digrignamento denti", treatments: ["Tossina botulinica"] },
    { label: "Qualità della pelle del viso", treatments: ["Biostimolazione", "Biorigenerazione", "PRX"] },
  ],
  PELLE: [
    { label: "Macchie e discromie", treatments: ["Laser e luce pulsata", "Peeling chimico"] },
    { label: "Rossori e colorito irregolare", treatments: ["Laser e luce pulsata"] },
    { label: "Acne e imperfezioni superficiali", treatments: ["Peeling chimico"] },
    { label: "Cicatrici da acne", treatments: ["Laser resurfacing"] },
    { label: "Rughe sottili e fotoinvecchiamento", treatments: ["Laser resurfacing", "Peeling chimico"] },
    { label: "Pelle spenta e poca luminosità", treatments: ["PRX", "Biostimolazione", "Biorigenerazione"] },
    { label: "Texture irregolare", treatments: ["Peeling chimico", "PRX", "Laser resurfacing"] },
    { label: "Elasticità e qualità cutanea", treatments: ["Biostimolazione", "Biorigenerazione", "Biostimolatori"] },
  ],
  CORPO: [
    { label: "Grasso localizzato sull'addome", treatments: ["Criolipolisi", "Intralipoterapia"] },
    { label: "Grasso localizzato su fianchi e cosce", treatments: ["Criolipolisi", "Intralipoterapia"] },
    { label: "Grasso localizzato su braccia", treatments: ["Criolipolisi"] },
    { label: "Cellulite e pelle a buccia d'arancia", treatments: ["Carbossiterapia", "Mesoterapia"] },
    { label: "Microcircolo e qualità dei tessuti", treatments: ["Carbossiterapia", "Mesoterapia"] },
    { label: "Sudorazione eccessiva", treatments: ["Tossina botulinica"] },
    { label: "Texture irregolare di cosce e glutei", treatments: ["Mesoterapia", "Carbossiterapia", "Biostimolazione corpo"] },
    { label: "Perdita di tono e compattezza", treatments: ["Ultrasuoni CFU", "Biostimolazione corpo"] },
  ],
};

const AREA_LABELS: Record<MatrixArea, string> = {
  VISO: "Viso",
  PELLE: "Pelle",
  CORPO: "Corpo",
};

export function MatriceMedicinaEstetica() {
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
    <section id="da-dove-iniziare" className="scroll-mt-20 bg-slate-50/70 py-20 sm:py-24 border-y border-teal-100/60">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>Medicina Estetica</SectionLabel>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-dark-navy sm:text-4xl">
            Da dove vuoi iniziare?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-charcoal/75">
            Ogni persona ha esigenze diverse. Esplora i trattamenti Cocoora partendo da ciò che vorresti migliorare.
          </p>
        </div>

        {/* STEP 1: Area */}
        <div className="mt-12 mx-auto max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-800 text-center sm:text-left">
            1. Quale area ti interessa?
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2.5 rounded-2xl bg-white p-1.5 shadow-sm border border-teal-100">
            {(["VISO", "PELLE", "CORPO"] as MatrixArea[]).map((area) => {
              const active = selectedArea === area;
              return (
                <button
                  key={area}
                  type="button"
                  onClick={() => handleAreaChange(area)}
                  className={`rounded-xl py-2.5 text-sm font-semibold transition-all ${
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
        <div className="mt-8 mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-800 text-center sm:text-left">
            2. Cosa vorresti migliorare?
          </p>
          <div className="mt-3 flex flex-wrap gap-2.5 justify-center sm:justify-start">
            {goals.map((g, idx) => {
              const active = selectedGoalIdx === idx;
              return (
                <button
                  key={g.label}
                  type="button"
                  onClick={() => setSelectedGoalIdx(idx)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all ${
                    active
                      ? "bg-teal-700 text-white shadow-sm ring-2 ring-teal-700/20"
                      : "bg-white text-charcoal/80 border border-teal-100/80 hover:border-teal-300 hover:text-dark-navy"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      active ? "bg-white" : "bg-teal-300"
                    }`}
                  />
                  <span>{g.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Trattamenti Correlati Cards */}
        <div className="mt-14">
          <div className="flex items-center gap-2 justify-center sm:justify-start mb-6">
            <Sparkles className="h-4 w-4 text-teal-700" />
            <h3 className="font-serif text-lg font-semibold text-dark-navy">
              Scopri i trattamenti correlati
            </h3>
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
                    <span className="absolute bottom-3 left-4 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-900">
                      {t.overline}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h4 className="font-serif text-xl font-bold text-teal-900 group-hover:text-dark-navy transition-colors">
                      {t.title}
                    </h4>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/70">
                      {t.description}
                    </p>
                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <Link
                        href={`/trattamenti/${t.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 group-hover:text-dark-navy transition-colors"
                      >
                        <span>Scopri il trattamento</span>
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
    </section>
  );
}
