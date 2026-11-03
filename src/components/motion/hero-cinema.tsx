"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDownRight, Pause, Play, Plus, Volume2, VolumeX } from "lucide-react";
import { Button, ButtonLink, Container } from "@/components/ui";
import { EASE } from "@/components/motion/tokens";
import { cn } from "@/lib/utils";

// Inserire qui il percorso del video istituzionale definitivo (es. "/video/cocoora-hero.mp4")
const HERO_VIDEO_SRC: string | null = null;

const DEFAULT_H1 = "Connessi alla tua salute.";
const CHAPTER_MS = 5200;

interface Chapter {
  id: string;
  code: string;
  label: string;
  caption: string;
  src: string;
  position: string;
}

const CHAPTERS: readonly Chapter[] = [
  {
    id: "estetica",
    code: "01",
    label: "Medicina Estetica",
    caption: "Armonia autentica e protocolli rigenerativi del viso",
    src: "/images/trattamenti/medicina-estetica/filler-viso-napoli-1.jpg",
    position: "object-[50%_28%]",
  },
  {
    id: "odontoiatria",
    code: "02",
    label: "Odontoiatria & Ortodonzia",
    caption: "Allineatori trasparenti e progettazione digitale del sorriso",
    src: "/images/trattamenti/odontoiatria/allineatori-trasparenti-napoli-1.jpg",
    position: "object-center",
  },
  {
    id: "diagnostica",
    code: "03",
    label: "Diagnostica Specialistica",
    caption: "Strumentazione clinica ad alta precisione in sede",
    src: "/images/visite/oculistica-napoli-1.jpg",
    position: "object-[42%_45%]",
  },
  {
    id: "cura",
    code: "04",
    label: "Continuità di Cura",
    caption: "Ascolto medico multidisciplinare nel tempo",
    src: "/images/visite/oncologia-napoli-1.jpg",
    position: "object-center",
  },
];

const TOTAL_MS = CHAPTER_MS * CHAPTERS.length;

const AREAS = [
  { code: "01", label: "Medicina Estetica e Rigenerativa", href: "#medicina-estetica" },
  { code: "02", label: "Odontoiatria e Ortodonzia", href: "#odontoiatria" },
  { code: "03", label: "Visite Specialistiche", href: "#visite-specialistiche" },
] as const;

function formatTime(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export interface HeroCinemaProps {
  h1?: string;
  videoSrc?: string | null;
  openDiscover: () => void;
}

interface Word {
  text: string;
  accent: boolean;
}

function buildLines(h1?: string): Word[][] {
  if (!h1 || h1.trim() === DEFAULT_H1) {
    return [
      [
        { text: "Connessi", accent: false },
        { text: "alla", accent: false },
      ],
      [
        { text: "tua", accent: true },
        { text: "salute.", accent: true },
      ],
    ];
  }
  const words = h1.trim().split(/\s+/);
  const accentFrom = Math.max(0, words.length - 2);
  return [words.map((text, i) => ({ text, accent: i >= accentFrom }))];
}

function AnimatedHeadline({ h1, reduced }: { h1?: string; reduced: boolean }) {
  const lines = buildLines(h1);
  let index = 0;
  return (
    <h1 className="mt-5 font-serif font-semibold leading-[1.04] tracking-[-0.03em] text-[clamp(2.65rem,5.1vw,5.1rem)] text-white">
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.map((word, wi) => {
            const i = index++;
            return (
              <span key={`${li}-${wi}`}>
                <span className="inline-block overflow-hidden align-bottom py-[0.08em] -my-[0.05em]">
                  <motion.span
                    className={cn(
                      "inline-block",
                      word.accent ? "italic font-normal text-[#c5dbe3]" : "text-white",
                    )}
                    initial={reduced ? false : { y: "108%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.72, ease: EASE.emphasized, delay: reduced ? 0 : 0.04 + i * 0.055 }}
                  >
                    {word.text}
                  </motion.span>
                </span>
                {wi < line.length - 1 ? " " : null}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

function RealVideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play().catch(() => undefined);
    } else {
      v.pause();
    }
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  return (
    <div className="group relative aspect-[5/4] sm:aspect-[16/11] w-full overflow-hidden rounded-[1.25rem] sm:rounded-[1.55rem] bg-[#001824]">
      <video
        ref={videoRef}
        src={src}
        className="absolute inset-0 h-full w-full cursor-pointer object-cover"
        autoPlay
        muted
        loop
        playsInline
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#001824]/80 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Metti in pausa il video" : "Riproduci il video"}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-[1px]" />}
        </button>
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Attiva l'audio" : "Disattiva l'audio"}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200"
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

function ShowreelPlayer({ reduced }: { reduced: boolean }) {
  const [playing, setPlaying] = useState(!reduced);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [docHidden, setDocHidden] = useState(false);
  const lastTsRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const onVis = () => setDocHidden(document.hidden);
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const running = playing && !docHidden;

  useEffect(() => {
    if (!running) {
      lastTsRef.current = null;
      return;
    }
    const tick = (ts: number) => {
      if (lastTsRef.current !== null) {
        const delta = Math.min(ts - lastTsRef.current, 100);
        setElapsedMs((prev) => (prev + delta) % TOTAL_MS);
      }
      lastTsRef.current = ts;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [running]);

  const activeIndex = Math.min(CHAPTERS.length - 1, Math.floor(elapsedMs / CHAPTER_MS));
  const active = CHAPTERS[activeIndex];
  const togglePlay = useCallback(() => setPlaying((p) => !p), []);
  const jumpTo = useCallback((i: number) => setElapsedMs(i * CHAPTER_MS), []);

  return (
    <div className="group relative aspect-[5/4] sm:aspect-[16/11] w-full overflow-hidden rounded-[1.25rem] sm:rounded-[1.55rem] bg-[#001824]">
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={active.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: reduced ? 1 : 1.06 }}
            animate={{ opacity: 1, scale: reduced ? 1 : 1.0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: EASE.out }}
          >
            <Image
              src={active.src}
              alt={`${active.label} — ${active.caption}`}
              fill
              sizes="(min-width: 1024px) 580px, 95vw"
              priority={activeIndex === 0}
              className={cn("object-cover", active.position)}
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <button
        type="button"
        onClick={togglePlay}
        aria-label={playing ? "Metti in pausa l'anteprima" : "Riproduci l'anteprima"}
        className="absolute inset-0 z-[15] cursor-pointer focus-visible:outline-none"
      />

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1/3 bg-gradient-to-b from-[#001824]/75 via-[#001824]/15 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[62%] bg-gradient-to-t from-[#001824]/92 via-[#001824]/45 to-transparent" />

      <div className="pointer-events-none absolute inset-x-3 top-3 z-20 flex items-center justify-between gap-2 sm:inset-x-4 sm:top-4">
        <span className="glass-dark inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#001824]/45 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-md sm:text-[11px]">
          <span className="relative flex h-2 w-2">
            {!reduced && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-300/70" />}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-300" />
          </span>
          Video Istituzionale · Anteprima
        </span>
        <span className="rounded-full border border-white/15 bg-[#001824]/45 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-md sm:text-[11px]">
          16:9 · In arrivo
        </span>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
        <motion.span
          aria-hidden="true"
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white shadow-[0_12px_40px_-10px_rgba(0,0,0,0.6)] backdrop-blur-md transition-opacity duration-300 sm:h-20 sm:w-20",
            playing ? "opacity-0 group-hover:opacity-100" : "opacity-100",
          )}
          animate={{ scale: playing ? 0.92 : 1 }}
          transition={{ duration: 0.3, ease: EASE.out }}
        >
          {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 translate-x-[2px]" />}
        </motion.span>
      </div>

      <div className="absolute inset-x-3 bottom-3 z-30 sm:inset-x-5 sm:bottom-5">
        <div className="flex items-end gap-3 sm:gap-4">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pausa" : "Riproduci"}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#03354b] transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200 sm:h-11 sm:w-11"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-[1px]" />}
          </button>
          <div className="min-w-0 flex-1" aria-live="polite">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-200/90">
              Capitolo {active.code}
            </p>
            <p className="truncate font-serif text-lg font-semibold leading-tight text-white sm:text-xl">{active.label}</p>
            <p className="hidden truncate text-xs text-teal-100/75 sm:block">{active.caption}</p>
          </div>
          <span className="shrink-0 font-mono text-[11px] tabular-nums text-white/80 sm:text-xs">
            {formatTime(elapsedMs)} / {formatTime(TOTAL_MS)}
          </span>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-1.5">
          {CHAPTERS.map((c, i) => {
            const progress =
              i < activeIndex ? 1 : i > activeIndex ? 0 : (elapsedMs - i * CHAPTER_MS) / CHAPTER_MS;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => jumpTo(i)}
                aria-label={`Vai al capitolo ${c.code}: ${c.label}`}
                aria-current={i === activeIndex ? "step" : undefined}
                className="group/seg py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200 rounded"
              >
                <span className="relative block h-[3px] overflow-hidden rounded-full bg-white/20 transition-[height] group-hover/seg:h-[5px]">
                  <span
                    className="absolute inset-0 origin-left rounded-full bg-white"
                    style={{ transform: `scaleX(${Math.max(0, Math.min(1, progress))})` }}
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function HeroCinema({ h1, videoSrc, openDiscover }: HeroCinemaProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;
  const activeVideoSrc = videoSrc ?? HERO_VIDEO_SRC;

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -14]);

  return (
    <section ref={sectionRef} className="relative bg-canvas px-2.5 pb-4 pt-[7.25rem] sm:px-4 sm:pb-6 sm:pt-[7.85rem]">
      <div className="relative isolate overflow-hidden rounded-[1.85rem] sm:rounded-[2.5rem] bg-[#002231] text-white shadow-[0_36px_90px_-36px_rgba(0,34,49,0.68)] border border-teal-900/40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 75% 65% at 82% 38%, rgba(28,74,92,0.62) 0%, rgba(0,52,75,0.35) 48%, rgba(0,34,49,0.98) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "radial-gradient(circle at 12% 18%, rgba(128,161,178,0.16), transparent 52%)" }}
        />
        <div aria-hidden="true" className="noise pointer-events-none absolute inset-0 -z-10 opacity-60" />

        <Container className="relative z-10 py-10 sm:py-14 lg:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="min-w-0 lg:col-span-6">
              <motion.div
                className="flex items-center gap-3"
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE.out }}
              >
                <span className="h-px w-8 bg-[#80a1b2]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.26em] text-teal-200/90">
                  Cocoora Centro Medico · Napoli
                </span>
              </motion.div>

              <AnimatedHeadline h1={h1} reduced={reduced} />

              <motion.div
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.62, ease: EASE.out, delay: reduced ? 0 : 0.22 }}
              >
                <p className="mt-6 max-w-xl text-[15px] sm:text-[17px] leading-[1.68] text-teal-100/80">
                  Un centro medico autorizzato a Napoli dove prevenzione, diagnostica avanzata e cura si incontrano:
                  specialisti, docenti universitari e tecnologie di ultima generazione al servizio del tuo tempo.
                </p>

                <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
                  <Button size="lg" variant="white" onClick={openDiscover}>
                    Inizia gratis con il Club <Plus className="h-4 w-4" />
                  </Button>
                  <ButtonLink href="/contatti" variant="outline-dark" size="lg">
                    Prenota Visita
                  </ButtonLink>
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-teal-200/70">
                  <span>Docenti Università Federico II & Vanvitelli</span>
                  <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#80a1b2]" />
                  <span>Lun–Ven 8:00–20:00 (Orario continuato) · Sab 9:00–14:00</span>
                </div>
              </motion.div>
            </div>

            <div className="min-w-0 lg:col-span-6">
              <motion.div
                style={{ y: parallaxY }}
                initial={reduced ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.85, ease: EASE.emphasized, delay: reduced ? 0 : 0.14 }}
                className="relative rounded-[1.6rem] sm:rounded-[2rem] border border-white/15 bg-white/[0.04] p-2 sm:p-2.5 shadow-[0_32px_80px_-28px_rgba(0,0,0,0.75)] backdrop-blur-md"
              >
                {activeVideoSrc ? <RealVideoPlayer src={activeVideoSrc} /> : <ShowreelPlayer reduced={reduced} />}
              </motion.div>
            </div>
          </div>
        </Container>

        <nav aria-label="Aree del centro" className="relative z-10 border-t border-white/10 bg-[#001a26]/55 backdrop-blur-md">
          <Container>
            <ul className="grid divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {AREAS.map((area) => (
                <li key={area.href}>
                  <a
                    href={area.href}
                    className="group flex items-center justify-between gap-4 py-4 sm:px-5 sm:py-5 first:sm:pl-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-200 rounded"
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="font-mono text-[11px] tabular-nums text-[#80a1b2]">{area.code}</span>
                      <span className="text-sm font-medium text-white/90 transition-colors group-hover:text-white">
                        {area.label}
                      </span>
                    </span>
                    <ArrowDownRight className="h-4 w-4 shrink-0 text-teal-200/70 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:text-white" />
                  </a>
                </li>
              ))}
            </ul>
          </Container>
        </nav>
      </div>
    </section>
  );
}