"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDownRight, Pause, Play, Plus } from "lucide-react";
import { Button, Container } from "@/components/ui";
import { EASE } from "@/components/motion/tokens";
import { cn } from "@/lib/utils";

const CHAPTER_MS = 5200;

interface Chapter {
  id: string;
  code: string;
  label: string;
  src: string;
  position: string;
}

const CHAPTERS: readonly Chapter[] = [
  {
    id: "estetica",
    code: "01",
    label: "Medicina Estetica",
    src: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/medicina-estetica/filler-viso-napoli-1.jpg",
    position: "object-[68%_24%]",
  },
  {
    id: "odontoiatria",
    code: "02",
    label: "Odontoiatria & Ortodonzia",
    src: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/trattamenti/odontoiatria/allineatori-trasparenti-napoli-1.jpg",
    position: "object-[62%_50%]",
  },
  {
    id: "diagnostica",
    code: "03",
    label: "Diagnostica Specialistica",
    src: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/visite/oculistica-napoli-1.jpg",
    position: "object-[58%_42%]",
  },
  {
    id: "radiologia",
    code: "04",
    label: "Prevenzione & Imaging",
    src: "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/visite/radiologia-napoli-1.jpg",
    position: "object-[60%_46%]",
  },
];

const AREAS: readonly { code: string; label: string; href: string }[] = [
  { code: "01", label: "Medicina Estetica e Rigenerativa", href: "#medicina-estetica" },
  { code: "02", label: "Odontoiatria e Ortodonzia", href: "#odontoiatria" },
  { code: "03", label: "Visite Specialistiche", href: "#visite-specialistiche" },
];

const TOTAL_MS = CHAPTER_MS * CHAPTERS.length;

function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function splitHeadline(h1?: string): [string, string] {
  const fallback: [string, string] = ["Connessi alla", "tua salute."];
  if (!h1 || !h1.trim()) return fallback;
  const words = h1.trim().split(/\s+/);
  if (words.length < 2) return [words[0] ?? fallback[0], ""];
  const cut = Math.ceil(words.length / 2);
  return [words.slice(0, cut).join(" "), words.slice(cut).join(" ")];
}

interface MaskedLineProps {
  text: string;
  baseDelay: number;
  reduced: boolean;
  className?: string;
}

function MaskedLine({ text, baseDelay, reduced, className }: MaskedLineProps) {
  const words = text.split(" ").filter(Boolean);
  return (
    <span className={cn("block", className)}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="-my-[0.05em] inline-block overflow-hidden py-[0.08em] align-bottom"
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={reduced ? { opacity: 0 } : { y: "110%", opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { y: "0%", opacity: 1 }}
            transition={{
              duration: reduced ? 0.4 : 1.05,
              ease: EASE.out,
              delay: reduced ? 0 : baseDelay + i * 0.08,
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? "\u00A0" : null}
        </span>
      ))}
    </span>
  );
}

export interface HeroCinemaProps {
  h1?: string;
  videoSrc?: string | null;
  openDiscover: () => void;
}

export function HeroCinema({ h1, videoSrc, openDiscover }: HeroCinemaProps) {
  const reducedPref = useReducedMotion();
  const reduced = reducedPref === true;
  const isVideo = videoSrc !== null;

  const frameRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "12%"]);
  const parallaxScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.06]);

  /* ---------- Mode A: real video ---------- */
  const [videoPlaying, setVideoPlaying] = useState(true);

  const toggleVideo = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play().catch(() => undefined);
      setVideoPlaying(true);
    } else {
      v.pause();
      setVideoPlaying(false);
    }
  }, []);

  /* ---------- Mode B: showreel ---------- */
  const [activeIndex, setActiveIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(true);
  const elapsedRef = useRef(0);

  useEffect(() => {
    if (reduced) setPlaying(false);
  }, [reduced]);

  useEffect(() => {
    if (isVideo || !playing) return;
    let raf = 0;
    let last: number | null = null;

    const tick = (now: number) => {
      if (document.hidden) {
        last = null;
        raf = requestAnimationFrame(tick);
        return;
      }
      if (last !== null) {
        const delta = Math.min(now - last, 100);
        let next = elapsedRef.current + delta;
        if (next >= CHAPTER_MS) {
          next = 0;
          setActiveIndex((i) => (i + 1) % CHAPTERS.length);
        }
        elapsedRef.current = next;
        setElapsed(next);
      }
      last = now;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isVideo, playing]);

  const jumpTo = useCallback((index: number) => {
    elapsedRef.current = 0;
    setElapsed(0);
    setActiveIndex(index);
  }, []);

  const active = CHAPTERS[activeIndex] ?? CHAPTERS[0];
  const globalMs = activeIndex * CHAPTER_MS + elapsed;
  const [line1, line2] = splitHeadline(h1);

  return (
    <section className="relative bg-canvas px-2.5 pb-4 pt-[7.25rem] sm:px-4 sm:pb-6 sm:pt-[7.85rem]">
      <div
        ref={frameRef}
        className="relative isolate flex min-h-[540px] flex-col justify-between overflow-hidden rounded-[1.85rem] border border-teal-900/30 bg-[#001824] text-white shadow-[0_36px_90px_-36px_rgba(0,34,49,0.72)] sm:min-h-[min(calc(100svh-9rem),860px)] sm:rounded-[2.5rem] lg:max-h-[860px]"
      >
        {/* Full-bleed background stage */}
        <motion.div
          aria-hidden={!isVideo}
          className="absolute inset-0 -z-10"
          style={{ y: parallaxY, scale: parallaxScale }}
        >
          {isVideo ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-cover"
            >
              {videoSrc ? (
                <source src={videoSrc} type="video/mp4" />
              ) : (
                <>
                  <source
                    src="https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/videos/hero-desktop.mp4"
                    media="(min-width: 768px)"
                    type="video/mp4"
                  />
                  <source
                    src="https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/videos/hero-mobile.mp4"
                    media="(max-width: 767px)"
                    type="video/mp4"
                  />
                </>
              )}
            </video>
          ) : (
            <AnimatePresence initial={false}>
              <motion.div
                key={active.id}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: reduced ? 1 : 1.09 }}
                animate={{ opacity: 1, scale: 1.01 }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { duration: 1.35, ease: EASE.out },
                  scale: { duration: reduced ? 0 : 5.4, ease: "linear" },
                }}
              >
                <Image
                  src={active.src}
                  alt={`${active.label} — Cocoora Centro Medico Napoli`}
                  fill
                  priority={activeIndex === 0}
                  sizes="100vw"
                  className={cn("object-cover", active.position)}
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>

        {/* Cinema grade & legibility scrims - Focused on text zone, keeping the video bright & vibrant */}
        {/* 1. Mobile scrim: bottom-to-top gradient for stacked copy */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 sm:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,18,28,0.50) 0%, rgba(0,18,28,0.15) 35%, rgba(0,18,28,0.85) 75%, rgba(0,18,28,0.96) 100%)",
          }}
        />

        {/* 2. Desktop directional scrim: deep contrast on the left under the text, completely transparent on the right so video action is crisp & bright */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 hidden sm:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,16,25,0.92) 0%, rgba(0,18,28,0.84) 32%, rgba(0,20,31,0.45) 50%, rgba(0,20,31,0.08) 65%, transparent 76%)",
          }}
        />

        {/* 3. Subtle top & bottom edge blends (leaves 75% of the vertical video area untouched) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-24"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,16,25,0.45) 0%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-24"
          style={{
            background:
              "linear-gradient(0deg, rgba(0,16,25,0.65) 0%, transparent 100%)",
          }}
        />

        {/* 4. Film grain - lightened so video details stay high-definition */}
        <div aria-hidden className="noise pointer-events-none absolute inset-0 z-0 opacity-12" />

        {/* Top HUD */}
        <Container className="relative z-20 pt-7 sm:pt-9">
          <div className="flex items-center justify-between gap-4">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: reduced ? 0 : -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE.out, delay: 0.1 }}
            >
              <span aria-hidden className="h-px w-8 bg-white/50" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/80 sm:text-[11px]">
                Cocoora Centro Medico · Napoli
              </span>
            </motion.div>
          </div>
        </Container>

        {/* Main copy + controls */}
        <Container className="relative z-20 mt-auto pb-8 pt-16 sm:pb-10 sm:pt-20 lg:pt-24">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="relative max-w-xl before:pointer-events-none before:absolute before:-inset-8 before:-z-10 before:rounded-3xl before:bg-[radial-gradient(ellipse_at_left,rgba(0,16,25,0.60),transparent_80%)]">
              <h1 className="font-serif text-[clamp(2.85rem,5.6vw,5.2rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-white drop-shadow-[0_2px_14px_rgba(0,16,25,0.75)]">
                <MaskedLine text={line1} baseDelay={0.25} reduced={reduced} />
                {line2 ? (
                  <MaskedLine
                    text={line2}
                    baseDelay={0.45}
                    reduced={reduced}
                    className="font-normal italic text-[#dff0f6]"
                  />
                ) : null}
              </h1>

              <motion.p
                className="mt-2.5 max-w-lg text-[15px] leading-[1.5] text-white/95 drop-shadow-[0_2px_8px_rgba(0,16,25,0.7)] sm:mt-3 sm:text-[17px]"
                initial={{ opacity: 0, y: reduced ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE.out, delay: reduced ? 0 : 0.8 }}
              >
                <span className="sm:block">Prevenzione, diagnostica avanzata</span>
                <span className="sm:block">e cura specialistica in un unico centro.</span>
              </motion.p>

              <motion.div
                className="mt-5 flex flex-wrap items-center gap-3.5 sm:mt-6"
                initial={{ opacity: 0, y: reduced ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE.out, delay: reduced ? 0 : 0.95 }}
              >
                <Button size="lg" variant="white" onClick={openDiscover}>
                  Inizia gratis con il Club <Plus className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>

            <motion.div
              className="w-full max-w-xs shrink-0 lg:w-80"
              initial={{ opacity: 0, y: reduced ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE.out, delay: reduced ? 0 : 1.1 }}
            >
              {isVideo ? (
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={toggleVideo}
                    aria-label={videoPlaying ? "Metti in pausa il video" : "Riproduci il video"}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#001824]/45 text-white backdrop-blur-md transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  >
                    {videoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/15 bg-[#001824]/45 p-3.5 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPlaying((p) => !p)}
                      aria-label={playing ? "Metti in pausa lo showreel" : "Riproduci lo showreel"}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#03354B] transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                    >
                      {playing ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="ml-0.5 h-4 w-4" />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.p
                          key={active.id}
                          className="truncate text-[13px] font-medium text-white"
                          initial={{ opacity: 0, y: reduced ? 0 : 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: reduced ? 0 : -6 }}
                          transition={{ duration: 0.35, ease: EASE.out }}
                          aria-live="polite"
                        >
                          <span className="text-white/60">{active.code} ·</span> {active.label}
                        </motion.p>
                      </AnimatePresence>
                      <p className="mt-0.5 text-[11px] tabular-nums tracking-[0.08em] text-white/55">
                        {formatTime(globalMs)} / {formatTime(TOTAL_MS)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-4 gap-1.5" role="tablist" aria-label="Capitoli showreel">
                    {CHAPTERS.map((chapter, i) => {
                      const fill =
                        i < activeIndex ? 1 : i === activeIndex ? elapsed / CHAPTER_MS : 0;
                      return (
                        <button
                          key={chapter.id}
                          type="button"
                          role="tab"
                          aria-selected={i === activeIndex}
                          aria-label={`${chapter.code} ${chapter.label}`}
                          onClick={() => jumpTo(i)}
                          className="group py-2 focus-visible:outline-none"
                        >
                          <span className="relative block h-[3px] overflow-hidden rounded-full bg-white/20 transition group-hover:bg-white/35 group-focus-visible:ring-2 group-focus-visible:ring-white/70">
                            <span
                              className="absolute inset-y-0 left-0 rounded-full bg-white"
                              style={{ width: `${Math.min(1, Math.max(0, fill)) * 100}%` }}
                            />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </Container>

        {/* Bottom quick navigation */}
        <nav
          aria-label="Aree del centro"
          className="relative z-20 border-t border-white/12 bg-[#00141f]/55 backdrop-blur-md"
        >
          <Container>
            <ul className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {AREAS.map((area) => (
                <li key={area.href}>
                  <a
                    href={area.href}
                    className="group flex items-center justify-between gap-3 py-4 transition sm:px-5 sm:py-5 sm:first:pl-0"
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="text-[11px] font-semibold tabular-nums tracking-[0.18em] text-[#80A1B2]">
                        {area.code}
                      </span>
                      <span className="text-[13px] font-medium text-white/85 transition group-hover:text-white sm:text-[14px]">
                        {area.label}
                      </span>
                    </span>
                    <ArrowDownRight className="h-4 w-4 shrink-0 text-white/50 transition group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:text-white" />
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

export default HeroCinema;