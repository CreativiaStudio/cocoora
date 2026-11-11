"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { CareDial, type CareDialItem } from "@/components/motion/care-dial";
import { Reveal } from "@/components/motion/reveal";
import { DUR, EASE } from "@/components/motion/tokens";
import { ButtonLink, Container } from "@/components/ui";
import { cn } from "@/lib/utils";

type AreaItem = CareDialItem & {
  id: string;
  label: string;
  category: string;
  href: string;
  image: string;
};

type CategoryCheck = {
  label: string;
  matchCategory: string;
  jumpIndex: number;
};

type AreaAlign = "left" | "right";

type AreaDefinition = {
  id: string;
  align: AreaAlign;
  href: string;
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  copy: string;
  shortTag: string;
  ctaLabel?: string;
  checks: readonly CategoryCheck[];
  items: AreaItem[];
  variant: "canvas" | "tinted";
};

const MANUAL_HOLD_MS = 8000;
const SCROLL_STEPS = 6;

const AREAS: readonly AreaDefinition[] = [
  {
    id: "medicina-estetica",
    align: "right",
    href: "/servizi/medicina-estetica",
    eyebrow: "01 · Medicina Estetica & Rigenerativa",
    titleLine1: "Medicina Estetica",
    titleLine2: "e Rigenerativa",
    copy: "La tua bellezza valorizzata nella sua forma più autentica — Naturally You. Protocolli medici personalizzati per viso, pelle e corpo, guidati da specialisti con tecnologie medicali certificate.",
    shortTag: "Medicina Estetica",
    ctaLabel: "Esplora Medicina Estetica",
    variant: "canvas",
    checks: [
      { label: "Viso e rigenerazione cellulare", matchCategory: "Viso e rigenerazione", jumpIndex: 0 },
      { label: "Corpo, rimodellamento e silhouette", matchCategory: "Corpo e silhouette", jumpIndex: 7 },
      { label: "Laser medicali e ultrasuoni CFU", matchCategory: "Laser e tecnologie", jumpIndex: 13 },
    ],
    items: [
      { id: "me-filler", label: "Filler viso", category: "Viso e rigenerazione", href: "/trattamenti/filler-acido-ialuronico", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/medicina-estetica/filler-viso-napoli-1.jpg" },
      { id: "me-tossina", label: "Tossina botulinica", category: "Viso e rigenerazione", href: "/trattamenti/tossina-botulinica", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/medicina-estetica/tossina-botulinica-napoli-1.jpg" },
      { id: "me-biostim", label: "Biostimolazione", category: "Viso e rigenerazione", href: "/trattamenti/biorivitalizzazione", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/medicina-estetica/biostimolazione-napoli-1.jpg" },
      { id: "me-biorig", label: "Biorigenerazione", category: "Viso e rigenerazione", href: "/trattamenti/biorigenerazione", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/medicina-estetica/biorigenerazione-napoli-1.jpg" },
      { id: "me-biostimolatori", label: "Biostimolatori", category: "Viso e rigenerazione", href: "/trattamenti/acido-polilattico", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/medicina-estetica/biostimolatori-napoli-1.jpg" },
      { id: "me-peeling", label: "Peeling medicale", category: "Viso e rigenerazione", href: "/trattamenti/peeling-chimico", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/medicina-estetica/peeling-medicale-napoli-1.jpg" },
      { id: "me-prx", label: "PRX", category: "Viso e rigenerazione", href: "/trattamenti/prx", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/medicina-estetica/prx-napoli-1.jpg" },
      { id: "me-crio", label: "Criolipolisi", category: "Corpo e silhouette", href: "/trattamenti/cryoliposculpt", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/medicina-estetica/criolipolisi-napoli-1.jpg" },
      { id: "me-carbossi", label: "Carbossiterapia", category: "Corpo e silhouette", href: "/trattamenti/carbossiterapia", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/medicina-estetica/carbossiterapia-napoli-1.jpg" },
      { id: "me-meso", label: "Mesoterapia", category: "Corpo e silhouette", href: "/trattamenti/mesoterapia", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/medicina-estetica/mesoterapia-napoli-1.jpg" },
      { id: "me-biocorpo", label: "Biostimolazione corpo", category: "Corpo e silhouette", href: "/trattamenti/biostimolazione-corpo", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/medicina-estetica/biostimolazione-corpo-napoli-1.jpg" },
      { id: "me-intralipo", label: "Intralipoterapia", category: "Corpo e silhouette", href: "/trattamenti/intralipoterapia", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/medicina-estetica/intralipoterapia-napoli-1.jpg" },
      { id: "me-lipedema", label: "Lipedema e linfedema", category: "Corpo e silhouette", href: "/trattamenti/lipedema-linfedema", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/medicina-estetica/lipedema-linfedema-napoli-1.jpg" },
      { id: "me-ipl", label: "Laser e luce pulsata", category: "Laser e tecnologie", href: "/trattamenti/laser-luce-pulsata", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/medicina-estetica/laser-luce-pulsata-napoli-1.jpg" },
      { id: "me-resurfacing", label: "Laser resurfacing", category: "Laser e tecnologie", href: "/trattamenti/laser-resurfacing", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/medicina-estetica/laser-resurfacing-napoli-1.jpg" },
      { id: "me-cfu", label: "Ultrasuoni focalizzati CFU", category: "Laser e tecnologie", href: "/trattamenti/ultrasuoni-cfu", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/medicina-estetica/ultrasuoni-cfu-napoli-1.jpg" },
    ],
  },
  {
    id: "odontoiatria",
    align: "left",
    href: "/servizi/odontoiatria",
    eyebrow: "02 · Odontoiatria & Ortodonzia",
    titleLine1: "Odontoiatria",
    titleLine2: "e Ortodonzia",
    copy: "Il tuo sorriso, la nostra visione. La bellezza si riconosce, la competenza si sente, la salute si costruisce nel tempo: dall'ortodonzia con allineatori trasparenti alla riabilitazione protesica e implantare.",
    shortTag: "Odontoiatria",
    ctaLabel: "Esplora Odontoiatria",
    variant: "tinted",
    checks: [
      { label: "Ortodonzia specialistica per adulti e bambini", matchCategory: "Ortodonzia specialistica", jumpIndex: 0 },
      { label: "Salute, diagnosi e prevenzione gengivale", matchCategory: "Salute e prevenzione", jumpIndex: 4 },
      { label: "Cura conservativa, protesi e implantologia", matchCategory: "Cura e riabilitazione", jumpIndex: 6 },
    ],
    items: [
      { id: "od-allineatori", label: "Allineatori trasparenti", category: "Ortodonzia specialistica", href: "/trattamenti/allineatori-trasparenti", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/odontoiatria/allineatori-trasparenti-napoli-1.jpg" },
      { id: "od-fisso", label: "Apparecchio fisso", category: "Ortodonzia specialistica", href: "/trattamenti/apparecchio-fisso", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/odontoiatria/apparecchio-fisso-napoli-1.jpg" },
      { id: "od-intercettiva", label: "Ortodonzia intercettiva", category: "Ortodonzia specialistica", href: "/trattamenti/ortodonzia-intercettiva", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/odontoiatria/ortodonzia-intercettiva-napoli-1.jpg" },
      { id: "od-contenzione", label: "Contenzione", category: "Ortodonzia specialistica", href: "/trattamenti/contenzione", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/odontoiatria/contenzione-napoli-1.jpg" },
      { id: "od-visita", label: "Visita odontoiatrica", category: "Salute e prevenzione", href: "/trattamenti/visita-odontoiatrica", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/odontoiatria/visita-odontoiatrica-napoli-1.jpg" },
      { id: "od-igiene", label: "Igiene orale professionale", category: "Salute e prevenzione", href: "/trattamenti/igiene", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/odontoiatria/igiene-orale-professionale-napoli-1.jpg" },
      { id: "od-conservativa", label: "Conservativa", category: "Cura e riabilitazione", href: "/trattamenti/conservativa", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/odontoiatria/conservativa-napoli-1.jpg" },
      { id: "od-endodonzia", label: "Endodonzia", category: "Cura e riabilitazione", href: "/trattamenti/endodonzia", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/odontoiatria/endodonzia-napoli-1.jpg" },
      { id: "od-parodontologia", label: "Parodontologia", category: "Cura e riabilitazione", href: "/trattamenti/parodontologia", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/odontoiatria/paradontologia-napoli-1.jpg" },
      { id: "od-protesi", label: "Protesi", category: "Cura e riabilitazione", href: "/trattamenti/protesi", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/odontoiatria/protesi-napoli-1.jpg" },
      { id: "od-implantologia", label: "Implantologia", category: "Cura e riabilitazione", href: "/trattamenti/implantologia", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/odontoiatria/implantologia-napoli-1.jpg" },
    ],
  },
  {
    id: "visite-specialistiche",
    align: "right",
    href: "/visite",
    eyebrow: "03 · Visite Specialistiche",
    titleLine1: "Visite",
    titleLine2: "Specialistiche",
    copy: "La tua salute, seguita con cura, nel tempo. Un'équipe multidisciplinare con docenti universitari e diagnostica avanzata in sede per accompagnare ogni fase della vita, senza frammentazioni.",
    shortTag: "Visite Specialistiche",
    ctaLabel: "Esplora Visite Specialistiche",
    variant: "canvas",
    checks: [
      { label: "Benessere, nutrizione e salute cutanea", matchCategory: "Benessere e cura di sé", jumpIndex: 0 },
      { label: "Diagnostica ecografica e prevenzione clinica", matchCategory: "Diagnostica e prevenzione", jumpIndex: 3 },
      { label: "Specialistiche dedicate a tutta la famiglia", matchCategory: "Specialistiche per la famiglia", jumpIndex: 8 },
    ],
    items: [
      { id: "vs-nutrizione", label: "Nutrizione", category: "Benessere e cura di sé", href: "/visite/nutrizione", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/visite/nutrizione-napoli-1.jpg" },
      { id: "vs-dermatologia", label: "Dermatologia", category: "Benessere e cura di sé", href: "/visite/dermatologia", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/visite/dermatologia-napoli-1.jpg" },
      { id: "vs-chirurgia", label: "Chirurgia plastica", category: "Benessere e cura di sé", href: "/visite/chirurgia-plastica", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/visite/chiururgia-plastica-napoli-1.jpg" },
      { id: "vs-cardiologia", label: "Cardiologia", category: "Diagnostica e prevenzione", href: "/visite/cardiologia", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/visite/cardiologia-napoli-1.jpg" },
      { id: "vs-ginecologia", label: "Ginecologia", category: "Diagnostica e prevenzione", href: "/visite/ginecologia", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/visite/ginecologia-napoli-1.jpg" },
      { id: "vs-oculistica", label: "Oculistica", category: "Diagnostica e prevenzione", href: "/visite/oculistica", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/visite/oculistica-napoli-1.jpg" },
      { id: "vs-radiologia", label: "Radiologia ed ecografia", category: "Diagnostica e prevenzione", href: "/visite/radiologia", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/visite/radiologia-napoli-1.jpg" },
      { id: "vs-pediatria", label: "Pediatria", category: "Diagnostica e prevenzione", href: "/visite/pediatria", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/visite/pediatria-napoli-1.jpg" },
      { id: "vs-senologia", label: "Senologia", category: "Specialistiche per la famiglia", href: "/visite/senologia", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/visite/senologia-napoli-1.jpg" },
      { id: "vs-sport", label: "Medicina dello sport", category: "Specialistiche per la famiglia", href: "/visite/medicina-dello-sport", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/visite/medicina-dello-sport-napoli-1.jpg" },
      { id: "vs-psicologia", label: "Psicologia", category: "Specialistiche per la famiglia", href: "/visite/psicologia", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/visite/psicologia-napoli-1.jpg" },
      { id: "vs-oncologia", label: "Oncologia", category: "Specialistiche per la famiglia", href: "/visite/oncologia", image: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/visite/oncologia-napoli-1.jpg" },
    ],
  },
];

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M3.5 8.5l3 3 6-7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AreaBlock({ area }: { area: AreaDefinition }) {
  const sectionRef = useRef<HTMLElement>(null);
  const manualUntilRef = useRef<number>(0);
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const total = area.items.length;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 75%", "end 25%"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (prefersReducedMotion) return;
    if (Date.now() < manualUntilRef.current) return;
    const clamped = Math.min(1, Math.max(0, v));
    const step = Math.min(SCROLL_STEPS - 1, Math.floor(clamped * SCROLL_STEPS));
    const next = Math.round((step * (total - 1)) / (SCROLL_STEPS - 1));
    setActiveIndex((prev) => (prev === next ? prev : next));
  });

  const handleManualSelect = useCallback(
    (index: number) => {
      if (total <= 0) return;
      const wrapped = ((index % total) + total) % total;
      manualUntilRef.current = Date.now() + MANUAL_HOLD_MS;
      setActiveIndex(wrapped);
    },
    [total],
  );

  const activeItem = useMemo<AreaItem>(
    () => area.items[Math.min(activeIndex, total - 1)] ?? area.items[0],
    [area.items, activeIndex, total],
  );

  const isLeft = area.align === "left";

  return (
    <section
      ref={sectionRef}
      id={area.id}
      aria-labelledby={`${area.id}-title`}
      className={cn(
        "relative scroll-mt-28 overflow-hidden py-20 sm:py-28",
        area.variant === "canvas"
          ? "bg-canvas"
          : "border-y border-teal-200/55 bg-gradient-to-b from-[#eef4f7] via-[#f3f8fa] to-[#eef4f7]",
      )}
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal className={cn("min-w-0 lg:col-span-5", isLeft && "lg:order-2")}>
            <div className="flex items-center gap-4">
              <span aria-hidden="true" className="h-px w-10 bg-[#80A1B2]" />
              <span className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#1C4A5C]">
                {area.eyebrow}
              </span>
            </div>

            <h2
              id={`${area.id}-title`}
              className="mt-6 font-serif text-[clamp(2.35rem,3.9vw,3.55rem)] font-semibold leading-[1.03] tracking-[-0.028em]"
            >
              <span className="block text-[#00344B]">{area.titleLine1}</span>
              <span className="block italic font-normal text-[#5d8497]">
                {area.titleLine2}
              </span>
            </h2>

            <p className="mt-6 max-w-xl font-sans text-base leading-[1.7] text-charcoal">
              {area.copy}
            </p>

            <ul className="mt-8 space-y-3" role="list">
              {area.checks.map((check) => {
                const active = activeItem.category === check.matchCategory;
                return (
                  <li key={check.matchCategory}>
                    <button
                      type="button"
                      onClick={() => handleManualSelect(check.jumpIndex)}
                      aria-pressed={active}
                      className="group flex w-full items-center gap-3 rounded-full py-1 text-left font-sans text-[0.95rem] text-[#1C4A5C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#80A1B2] focus-visible:ring-offset-2"
                    >
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                          active
                            ? "border-[#1C4A5C] bg-[#1C4A5C] text-white"
                            : "border-[#80A1B2]/55 text-[#1C4A5C] group-hover:border-[#1C4A5C]",
                        )}
                      >
                        <CheckIcon className="h-3.5 w-3.5" />
                      </span>
                      <span
                        className={cn(
                          "transition-opacity duration-300",
                          active ? "font-medium opacity-100" : "opacity-80 group-hover:opacity-100",
                        )}
                      >
                        {check.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <ButtonLink href={activeItem.href} variant="primary" size="lg" className="group">
                <span>Approfondisci</span>
                <span className="relative inline-block overflow-hidden font-semibold">
                  <motion.span
                    key={activeItem.id}
                    initial={prefersReducedMotion ? false : { y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    transition={{ duration: DUR.base, ease: EASE.out }}
                    className="inline-block"
                  >
                    {activeItem.label}
                  </motion.span>
                </span>
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </ButtonLink>
            </div>
          </Reveal>

          <div className={cn("min-w-0 lg:col-span-7", isLeft && "lg:order-1")}>
            <CareDial
              items={area.items}
              activeIndex={activeIndex}
              onSelectIndex={handleManualSelect}
              align={area.align}
              accentLabel={area.shortTag}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

export function AreasShowcase() {
  return (
    <div id="servizi">
      {AREAS.map((area) => (
        <AreaBlock key={area.id} area={area} />
      ))}
    </div>
  );
}

export default AreasShowcase;