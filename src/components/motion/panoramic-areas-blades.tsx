"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Plus, ArrowUpRight } from "lucide-react";

type MedicalArea = {
  number: string;
  title: string;
  href: string;
  image: string;
  tag: string;
  description: string;
  highlights: string[];
};

const areas: MedicalArea[] = [
  {
    number: "01",
    title: "Medicina Estetica & Rigenerativa",
    href: "/servizi/medicina-estetica",
    image: "/images/aesthetic-skin.jpg",
    tag: "Viso · Pelle · Corpo",
    description:
      "Protocolli medici per viso, pelle e corpo: biostimolazione, filler, tossina botulinica, criolipolisi, ultrasuoni focalizzati CFU e piattaforme laser medicali.",
    highlights: [
      "Biostimolazione & Rigenerazione",
      "Armonizzazione naturale del viso",
      "Tecnologie Laser & CFU",
    ],
  },
  {
    number: "02",
    title: "Odontoiatria & Ortodonzia",
    href: "/servizi/odontoiatria",
    image: "/images/trattamenti/odontoiatria/allineatori-trasparenti-napoli-1.jpg",
    tag: "Sorriso · Prevenzione",
    description:
      "Allineatori Trasparenti, Ortodonzia Specialistica, Estetica del Sorriso, Implantologia e Igiene professionale con tecnologie digitali.",
    highlights: [
      "Allineatori Trasparenti",
      "Estetica del Sorriso",
      "Prevenzione & Igiene",
    ],
  },
  {
    number: "03",
    title: "Visite Specialistiche",
    href: "/visite",
    image: "/images/diagnostics-lab.jpg",
    tag: "Équipe Universitaria",
    description:
      "Cardiologia, Ginecologia, Senologia, Ecografia, Oculistica, Pediatria, Psicologia e Medicina dello Sport con docenti universitari a Napoli.",
    highlights: [
      "Docenti Federico II & Vanvitelli",
      "Diagnostica Ecografica",
      "Visione Clinica Integrata",
    ],
  },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function PanoramicAreasBlades() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  return (
    <section className="w-full bg-transparent py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:h-[540px] lg:flex-row">
          {areas.map((area, i) => {
            const isActive = activeIndex === i;

            return (
              <div
                key={area.href}
                role="button"
                tabIndex={0}
                aria-expanded={isActive}
                aria-label={`${area.title} — apri per esplorare l'area medica`}
                onMouseEnter={() => setActiveIndex(i)}
                onFocus={() => setActiveIndex(i)}
                onClick={() => setActiveIndex(i)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveIndex(i);
                  }
                }}
                className="group relative flex min-h-[420px] flex-1 cursor-pointer flex-col justify-between overflow-hidden rounded-[2.25rem] transition-[flex] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none focus-visible:ring-2 focus-visible:ring-teal-200 lg:min-h-0"
                style={{ flex: isActive ? 2.5 : 1 }}
              >
                <Image
                  src={area.image}
                  alt={area.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority={i === 0}
                  className={`object-cover transition-transform duration-[1200ms] ease-out ${
                    isActive ? "scale-100" : "scale-105"
                  }`}
                />

                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark-navy/95 via-dark-navy/45 to-dark-navy/15"
                  aria-hidden="true"
                />

                <div className="relative z-10 flex items-start justify-between gap-4 p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-4xl text-white/90 sm:text-5xl">
                      {area.number}
                    </span>
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/90 backdrop-blur-md sm:px-4 sm:py-1.5">
                      {area.tag}
                    </span>
                  </div>

                  <span
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-transform duration-500 ease-out group-hover:scale-105"
                    aria-hidden="true"
                  >
                    {isActive ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </span>
                </div>

                <div className="relative z-10 p-6 sm:p-8">
                  <h3 className="font-serif text-2xl leading-tight text-white sm:text-3xl">
                    {area.title}
                  </h3>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        key="content"
                        initial={
                          reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        exit={
                          reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }
                        }
                        transition={{
                          duration: reduceMotion ? 0 : 0.4,
                          ease: EASE,
                        }}
                      >
                        <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/85 sm:text-[15px]">
                          {area.description}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {area.highlights.map((highlight) => (
                            <span
                              key={highlight}
                              className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md sm:text-xs"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>

                        <Link
                          href={area.href}
                          onClick={(event) => event.stopPropagation()}
                          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-dark-navy shadow-sm transition-colors hover:bg-teal-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
                        >
                          Esplora l&apos;area medica
                          <span aria-hidden="true">→</span>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
