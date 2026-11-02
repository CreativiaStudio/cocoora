"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { ORBIT_SLOTS, LEGS } from "./orbit/pictogram";

type Phase = {
  id: string;
  label: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  metrics: string[];
};

const PHASES: Phase[] = [
  {
    id: "01",
    label: "Profilo",
    badge: "Area Paziente · 24/7",
    title: "Profilo Sanitario Digitale",
    subtitle: "La tua storia clinica sempre protetta e accessibile",
    description:
      "Crea il tuo profilo digitale in pochi minuti: referti, storico esami e documenti clinici sono custoditi in un unico spazio ordinato, consultabile ovunque e in qualsiasi momento.",
    metrics: ["Dossier clinico digitale", "Referti consultabili 24/7", "Prenotazione immediata"],
  },
  {
    id: "02",
    label: "Équipe",
    badge: "Direzione Sanitaria · Napoli",
    title: "Équipe Universitaria Integrata",
    subtitle: "Specialisti in dialogo costante per una visione unitaria",
    description:
      "Docenti dell'Università Federico II e Vanvitelli operano in sinergia sotto il coordinamento della Direzione Sanitaria Dott.ssa Elisa Russo, superando la frammentazione delle singole visite isolate.",
    metrics: [
      "Docenti Federico II & Vanvitelli",
      "Approccio multidisciplinare",
      "Orario continuato Lun–Ven 8–20",
    ],
  },
  {
    id: "03",
    label: "Percorsi",
    badge: "Cocoora Club · Prevenzione",
    title: "Percorsi Salute Continuativi",
    subtitle: "Dalla prevenzione programmata al benessere familiare",
    description:
      "Da Discover ai percorsi annuali Essential, Prime Care e Signature Longevity: check-up periodici e continuità assistenziale pensati per accompagnare te e la tua famiglia nel tempo.",
    metrics: [
      "4 Percorsi Salute strutturati",
      "Check-up periodici programmati",
      "Estensione nucleo familiare",
    ],
  },
  {
    id: "04",
    label: "Precision",
    badge: "Cocoora Precision · Genomica",
    title: "Medicina Predittiva & Precision",
    subtitle: "Conoscere in anticipo il proprio equilibrio biologico",
    description:
      "Approfondimenti genetici DNA 5 e sequenziamento del microbiota per leggere le predisposizioni individuali e impostare strategie di prevenzione realmente personalizzate.",
    metrics: ["Test genetici DNA 5", "Analisi del microbiota", "Prevenzione personalizzata"],
  },
];

const TICK_COUNT = 60;
const SCALE = 165;

export function CocooraContinuumStage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const springProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 32,
    mass: 0.6,
    restDelta: 0.0005,
  });

  const progress = reduceMotion ? scrollYProgress : springProgress;
  const needleRotate = useTransform(progress, [0, 1], [-135, 225]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(PHASES.length - 1, Math.max(0, Math.floor(v * PHASES.length)));
    setActiveIndex(next);
  });

  const scrollToPhase = (index: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    const target = top + range * ((index + 0.5) / PHASES.length);
    window.scrollTo({ top: target, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const current = PHASES[activeIndex];
  const counter = String(activeIndex + 1).padStart(2, "0");

  return (
    <div
      ref={sectionRef}
      className="relative h-[320vh] bg-gradient-to-b from-canvas via-[#eef5f8] to-canvas"
    >
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-12">
          {/* Sinistra: Cronometro */}
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto flex h-[300px] w-[300px] items-center justify-center rounded-full border border-teal-200/80 bg-white/85 shadow-[0_40px_100px_-30px_rgba(0,52,75,0.22)] backdrop-blur-xl sm:h-[420px] sm:w-[420px]">
              <svg
                viewBox="-220 -220 440 440"
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                {/* Anello base */}
                <circle r={200} fill="none" stroke="#c5dbe3" strokeWidth={1} />
                <circle r={150} fill="none" stroke="#e2edf1" strokeWidth={1} />

                {/* Progresso */}
                <motion.circle
                  r={200}
                  fill="none"
                  stroke="#1c4a5c"
                  strokeWidth={3}
                  strokeLinecap="round"
                  transform="rotate(-90)"
                  pathLength={progress}
                />

                {/* 60 tacche nonio */}
                {Array.from({ length: TICK_COUNT }).map((_, i) => (
                  <line
                    key={`tick-${i}`}
                    x1={0}
                    y1={-200}
                    x2={0}
                    y2={i % 5 === 0 ? -184 : -192}
                    stroke={i % 5 === 0 ? "#1c4a5c" : "#80a1b2"}
                    strokeWidth={i % 5 === 0 ? 1.6 : 0.8}
                    transform={`rotate(${i * (360 / TICK_COUNT)})`}
                  />
                ))}

                {/* Legs del pittogramma */}
                {LEGS.slice(0, 2).map((_, i) => (
                  <line
                    key={`leg-${i}`}
                    x1={0}
                    y1={0}
                    x2={0}
                    y2={-SCALE * 0.82}
                    stroke="#c5dbe3"
                    strokeWidth={1.2}
                    strokeDasharray="3 5"
                    transform={`rotate(${i * 180})`}
                  />
                ))}

                {/* 8 slot orbitali */}
                {ORBIT_SLOTS.map((slot, i) => {
                  const cx = slot.center[0] * SCALE;
                  const cy = -slot.center[1] * SCALE;
                  const station = Math.floor(i / 2);
                  const isStation = i % 2 === 0;
                  const isActive = isStation && station === activeIndex;
                  const isDone = isStation && station < activeIndex;
                  return (
                    <g key={`slot-${i}`}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isStation ? 14 : 6}
                        fill={isActive ? "#00344b" : isDone ? "#80a1b2" : "#ffffff"}
                        stroke={isStation ? "#1c4a5c" : "#c5dbe3"}
                        strokeWidth={1.2}
                      />
                      {isStation && (
                        <text
                          x={cx}
                          y={cy + 4}
                          textAnchor="middle"
                          fontSize={10}
                          fontFamily="Inter, sans-serif"
                          fill={isActive ? "#ffffff" : "#1c4a5c"}
                        >
                          {String(station + 1).padStart(2, "0")}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Ago indicatore */}
                <motion.g style={{ rotate: needleRotate, transformOrigin: "0px 0px" }}>
                  <line x1={0} y1={0} x2={0} y2={-175} stroke="#00344b" strokeWidth={1.4} />
                  <circle cx={0} cy={0} r={4} fill="#00344b" />
                </motion.g>
              </svg>

              {/* Contatore centrale */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="h-[1.1em] overflow-hidden font-serif text-7xl leading-none text-dark-navy sm:text-8xl">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={counter}
                      className="block"
                      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -24 }}
                      transition={{ duration: reduceMotion ? 0 : 0.35 }}
                    >
                      {counter}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <span className="mt-2 font-sans text-[10px] uppercase tracking-[0.3em] text-primary-teal">
                  di 04
                </span>
              </div>
            </div>
          </div>

          {/* Destra: Contenuto */}
          <div className="lg:col-span-7">
            <p className="mb-6 font-sans text-xs font-medium uppercase tracking-[0.25em] text-primary-teal">
              CONTINUUM CLINICO · SCORRI PER ESPLORARE
            </p>

            <div className="relative rounded-[2.25rem] border border-white bg-white/85 p-8 shadow-[0_30px_80px_-28px_rgba(0,52,75,0.25)] backdrop-blur-xl sm:p-11">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                  transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
                >
                  <span className="inline-flex items-center rounded-full border border-teal-200 bg-teal-100/60 px-4 py-1.5 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-teal-900">
                    {current.badge}
                  </span>

                  <h2 className="mt-6 font-serif text-4xl leading-tight text-dark-navy sm:text-5xl">
                    {current.title}
                  </h2>

                  <p className="mt-3 font-serif text-xl italic text-primary-teal sm:text-2xl">
                    {current.subtitle}
                  </p>

                  <p className="mt-6 font-sans text-base leading-relaxed text-charcoal">
                    {current.description}
                  </p>

                  <ul className="mt-8 space-y-3">
                    {current.metrics.map((metric) => (
                      <li key={metric} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-600" aria-hidden="true" />
                        <span className="font-sans text-sm font-medium text-dark-navy">{metric}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pillole di navigazione */}
            <div className="mt-8 flex flex-wrap gap-3">
              {PHASES.map((phase, i) => {
                const isActive = i === activeIndex;
                return (
                  <button
                    key={phase.id}
                    type="button"
                    onClick={() => scrollToPhase(i)}
                    aria-current={isActive ? "step" : undefined}
                    className={`rounded-full border px-5 py-2.5 font-sans text-sm font-medium transition-colors duration-300 ${
                      isActive
                        ? "border-dark-navy bg-dark-navy text-white"
                        : "border-teal-200 bg-white/80 text-primary-teal hover:border-teal-400 hover:text-dark-navy"
                    }`}
                  >
                    <span className="font-serif">{phase.id}</span>{" "}
                    <span>{phase.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
