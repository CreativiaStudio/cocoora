"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "motion/react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ShieldCheck,
  Activity,
  Microscope,
} from "lucide-react";

export interface ScrollExpandCinemaProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  videoSrc?: string;
  posterSrc?: string;
  className?: string;
  metrics?: Array<{ label: string; value: string }>;
}

const DEFAULT_METRICS = [
  { label: "Tecnologie in Sede", value: "Diagnostica HD" },
  { label: "Équipe Integrata", value: "Docenti Federico II & Vanvitelli" },
  { label: "Continuità Clinica", value: "Dossier Digitale 24/7" },
];

export function ScrollExpandCinema({
  title = "Il Centro si racconta: connessi alla tua salute",
  subtitle = "Uno sguardo autentico dentro gli ambienti, le tecnologie cliniche e l'équipe multidisciplinare di Cocoora Centro Medico a Napoli.",
  badge = "Napoli · Ambienti & Tecnologie d'Eccellenza",
  videoSrc,
  posterSrc = "/images/hero-clinic.jpg",
  className,
  metrics = DEFAULT_METRICS,
}: ScrollExpandCinemaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);

  // Audio Context per drone armonico terapeutico (432Hz) & gestione audio video
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Pulizia audio alla disattivazione
  useEffect(() => {
    return () => {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch {
          // ignore cleanup error
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const toggleSoundExperience = useCallback(() => {
    if (typeof window === "undefined") return;

    if (isAudioActive) {
      // Spegnimento morbido
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(
          0.0001,
          audioCtxRef.current.currentTime,
          0.15,
        );
        setTimeout(() => {
          setIsAudioActive(false);
          setIsPlaying(false);
        }, 200);
      } else {
        setIsAudioActive(false);
        setIsPlaying(false);
      }
      if (videoRef.current) {
        videoRef.current.muted = true;
        videoRef.current.pause();
      }
    } else {
      // Attivazione con dissolvenza sonora
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }
        if (audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume();
        }

        // Tono armonico a 432Hz (frequenza rilassante per ambiente clinico di longevità)
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(432, audioCtxRef.current.currentTime);
        gain.gain.setValueAtTime(0.001, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.035,
          audioCtxRef.current.currentTime + 0.6,
        );
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start();
        oscRef.current = osc;
        gainNodeRef.current = gain;

        setIsAudioActive(true);
        setIsPlaying(true);

        if (videoRef.current) {
          videoRef.current.muted = false;
          videoRef.current.play().catch(() => {});
        }
      } catch {
        setIsAudioActive(true);
        setIsPlaying(true);
      }
    }
  }, [isAudioActive]);

  // Hook scroll progress diretto Lenis senza overdamped spring
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // =========================================================================
  // ATTO I: ESPANSIONE GPU A ZERO REFLOW (0.00 -> 0.30)
  // Il container è permanentemente 100vw × 100vh. Il ritaglio avviene su GPU.
  // =========================================================================
  const insetY = useTransform(
    scrollYProgress,
    [0, 0.3],
    [isMobile ? 22 : 18, 0],
    { clamp: true },
  );
  const insetX = useTransform(scrollYProgress, [0, 0.3], [isMobile ? 5 : 12, 0], {
    clamp: true,
  });
  const radius = useTransform(scrollYProgress, [0, 0.3], [40, 0], {
    clamp: true,
  });
  const clipPath = useMotionTemplate`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${radius}px)`;

  // Dissolvenza contenuti introduttivi Act 1
  const contentOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0], {
    clamp: true,
  });
  const contentY = useTransform(scrollYProgress, [0, 0.22], [0, -35], {
    clamp: true,
  });
  const badgeOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0], {
    clamp: true,
  });
  const badgeXLeft = useTransform(scrollYProgress, [0, 0.2], [0, -80], {
    clamp: true,
  });
  const badgeXRight = useTransform(scrollYProgress, [0, 0.2], [0, 80], {
    clamp: true,
  });
  const initialOverlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.3],
    [0.85, 0.35],
    { clamp: true },
  );

  // =========================================================================
  // ATTO II: PLATEAU IMMERSIVO & TELEMETRIA CLINICA (0.30 -> 0.75)
  // Il video satura il display al 100%. Tre milestone cliniche si alternano.
  // =========================================================================
  const milestone1Opacity = useTransform(
    scrollYProgress,
    [0.34, 0.38, 0.44, 0.48],
    [0, 1, 1, 0],
    { clamp: true },
  );
  const milestone1Y = useTransform(
    scrollYProgress,
    [0.34, 0.38, 0.44, 0.48],
    [24, 0, 0, -24],
    { clamp: true },
  );

  const milestone2Opacity = useTransform(
    scrollYProgress,
    [0.49, 0.53, 0.59, 0.63],
    [0, 1, 1, 0],
    { clamp: true },
  );
  const milestone2Y = useTransform(
    scrollYProgress,
    [0.49, 0.53, 0.59, 0.63],
    [24, 0, 0, -24],
    { clamp: true },
  );

  const milestone3Opacity = useTransform(
    scrollYProgress,
    [0.64, 0.68, 0.73, 0.76],
    [0, 1, 1, 0],
    { clamp: true },
  );
  const milestone3Y = useTransform(
    scrollYProgress,
    [0.64, 0.68, 0.73, 0.76],
    [24, 0, 0, -24],
    { clamp: true },
  );

  const hudOpacity = useTransform(
    scrollYProgress,
    [0.32, 0.37, 0.72, 0.76],
    [0, 1, 1, 0],
    { clamp: true },
  );

  // =========================================================================
  // ATTO III: NARRATIVE HAND-OFF & PUSH OTTICO (0.75 -> 1.00)
  // Transizione dolce verso la Scena 05 (Glass Matrix Drum)
  // =========================================================================
  const cameraScale = useTransform(scrollYProgress, [0.75, 1.0], [1.0, 1.06], {
    clamp: true,
  });
  const exitVeilOpacity = useTransform(
    scrollYProgress,
    [0.78, 0.98],
    [0, 0.85],
    { clamp: true },
  );

  // Fallback per preferenza utente di riduzione del movimento
  if (prefersReducedMotion) {
    return (
      <section className="relative h-screen w-full overflow-hidden">
        <div className="relative h-full w-full overflow-hidden bg-dark-navy">
          {videoSrc ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              poster={posterSrc}
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src={videoSrc} />
            </video>
          ) : (
            <Image
              src={posterSrc}
              alt={title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-navy/90 via-dark-navy/40 to-dark-navy/30" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
            <button
              type="button"
              onClick={toggleSoundExperience}
              aria-label={
                isAudioActive
                  ? "Disattiva audio ambientale"
                  : "Riproduci racconto con audio"
              }
              className="flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white shadow-lg backdrop-blur-md transition-transform hover:scale-105"
            >
              {isAudioActive || isPlaying ? (
                <Pause className="h-6 w-6 text-teal-200" />
              ) : (
                <Play className="ml-1 h-6 w-6" />
              )}
            </button>
            <h2 className="mt-8 max-w-3xl font-serif text-3xl sm:text-5xl">
              {title}
            </h2>
            <p className="mt-4 max-w-xl font-sans text-sm text-teal-100/90 sm:text-base">
              {subtitle}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div
      ref={containerRef}
      className={className ?? "relative h-[280vh]"}
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Stage Viewport GPU con clip-path: nessun ricalcolo di width/height */}
        <motion.div
          style={{
            clipPath,
            willChange: "clip-path",
          }}
          className="relative h-full w-full overflow-hidden bg-dark-navy shadow-2xl"
        >
          {/* Traccia Visiva Video / Poster con Camera Scale Push Act 3 */}
          <motion.div
            style={{ scale: cameraScale }}
            className="absolute inset-0 h-full w-full"
          >
            {videoSrc ? (
              <video
                ref={videoRef}
                autoPlay
                muted={!isAudioActive}
                loop
                playsInline
                poster={posterSrc}
                className="h-full w-full object-cover"
              >
                <source src={videoSrc} />
              </video>
            ) : (
              <Image
                src={posterSrc}
                alt={title}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            )}
          </motion.div>

          {/* Overlay gradiente cinematico di base */}
          <motion.div
            style={{ opacity: initialOverlayOpacity }}
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark-navy/90 via-dark-navy/40 to-dark-navy/30"
          />

          {/* Velo di transizione ottica Act 3 verso la sezione successiva */}
          <motion.div
            style={{ opacity: exitVeilOpacity }}
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-dark-navy/70 to-dark-navy"
          />

          {/* =============================================================== */}
          {/* ATTO I: CONTENUTI INTRODUTTIVI                                  */}
          {/* =============================================================== */}
          <motion.div
            style={{ opacity: contentOpacity, y: contentY }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white"
          >
            <button
              type="button"
              onClick={toggleSoundExperience}
              aria-label={
                isAudioActive
                  ? "Disattiva audio ambientale"
                  : "Riproduci il racconto del Centro e attiva l'esperienza immersiva"
              }
              className="group relative flex h-20 w-20 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-teal-200 hover:bg-white/25 active:scale-95"
            >
              {/* Effetto alone sonoro / pulse wave */}
              <span
                className={`absolute inset-0 rounded-full border border-teal-300/40 transition-transform ${
                  isAudioActive
                    ? "animate-ping opacity-60"
                    : "opacity-0 group-hover:scale-110 group-hover:opacity-40"
                }`}
              />

              {isAudioActive || isPlaying ? (
                <Pause className="h-7 w-7 text-teal-200" />
              ) : (
                <Play className="ml-1 h-7 w-7 text-white transition-colors group-hover:text-teal-200" />
              )}
            </button>

            <div className="mt-4 flex items-center gap-2 rounded-full border border-white/20 bg-dark-navy/40 px-3.5 py-1 backdrop-blur-md">
              <Volume2 className="h-3 w-3 text-teal-300" />
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-teal-100">
                {isAudioActive
                  ? "Audio Spaziale 432Hz Attivo"
                  : "Ascolto Immersivo Disponibile"}
              </span>
            </div>

            <h2 className="mt-6 max-w-3xl font-serif text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              {title}
            </h2>
            <p className="mt-4 max-w-xl font-sans text-sm leading-relaxed text-teal-100/90 sm:text-base">
              {subtitle}
            </p>
          </motion.div>

          {/* =============================================================== */}
          {/* ATTO II: MILESTONE CLINICHE SEQUENZIATE                         */}
          {/* =============================================================== */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
            {/* Milestone 1: Tecnologie in Sede */}
            <motion.div
              style={{ opacity: milestone1Opacity, y: milestone1Y }}
              className="absolute max-w-2xl text-center text-white"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/30 bg-dark-navy/60 px-4 py-1.5 backdrop-blur-md mb-4">
                <Microscope className="h-3.5 w-3.5 text-teal-300" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-100">
                  Ambienti &amp; Tecnologie · Studio 1, 2, 3
                </span>
              </div>
              <h3 className="font-serif text-3xl font-semibold tracking-tight sm:text-5xl text-white">
                Diagnostica Avanzata in Sede
              </h3>
              <p className="mx-auto mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-teal-100/90">
                Dall&apos;ecografia ad alta risoluzione alla diagnostica odontoiatrica
                digitale: esami approfonditi e refertazione rapida senza dispersioni.
              </p>
            </motion.div>

            {/* Milestone 2: Équipe Universitaria */}
            <motion.div
              style={{ opacity: milestone2Opacity, y: milestone2Y }}
              className="absolute max-w-2xl text-center text-white"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/30 bg-dark-navy/60 px-4 py-1.5 backdrop-blur-md mb-4">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-300" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-100">
                  Équipe Medica Integrata
                </span>
              </div>
              <h3 className="font-serif text-3xl font-semibold tracking-tight sm:text-5xl text-white">
                Docenti Federico II &amp; Vanvitelli
              </h3>
              <p className="mx-auto mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-teal-100/90">
                Specialisti ospedalieri e docenti universitari a Napoli riuniti
                in un unico comitato clinico per condividere ogni percorso di cura.
              </p>
            </motion.div>

            {/* Milestone 3: Prevenzione e Direzione Sanitaria */}
            <motion.div
              style={{ opacity: milestone3Opacity, y: milestone3Y }}
              className="absolute max-w-2xl text-center text-white"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/30 bg-dark-navy/60 px-4 py-1.5 backdrop-blur-md mb-4">
                <Activity className="h-3.5 w-3.5 text-teal-300" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-teal-100">
                  Direzione Sanitaria Dott.ssa Elisa Russo
                </span>
              </div>
              <h3 className="font-serif text-3xl font-semibold tracking-tight sm:text-5xl text-white">
                Continuità Clinica &amp; Prevenzione
              </h3>
              <p className="mx-auto mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-teal-100/90">
                Dossier clinico digitale accessibile 24/7 e Percorsi Salute
                annuali: la tua salute seguita con cura costante, tutto l&apos;anno.
              </p>
            </motion.div>
          </div>

          {/* =============================================================== */}
          {/* TELEMETRIA HUD & CONTROLLO AUDIO ATTIVO (Plateau Act 2)         */}
          {/* =============================================================== */}
          <motion.div
            style={{ opacity: hudOpacity }}
            className="pointer-events-auto absolute inset-x-0 bottom-8 z-30 flex flex-col items-center justify-between gap-4 px-6 sm:flex-row sm:px-12"
          >
            {/* Metriche Cliniche HUD */}
            <div className="hidden flex-wrap items-center gap-3 md:flex">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-full border border-white/20 bg-dark-navy/60 px-4 py-1.5 backdrop-blur-md shadow-sm"
                >
                  <span className="text-[10px] uppercase tracking-[0.16em] text-teal-200/80">
                    {metric.label}:{" "}
                  </span>
                  <span className="font-semibold text-xs text-white">
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Interruttore Sonoro & Onde di Frequenza Dinamiche */}
            <button
              type="button"
              onClick={toggleSoundExperience}
              className="group flex items-center gap-3 rounded-full border border-white/25 bg-dark-navy/70 px-4 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-xl transition-all hover:border-teal-300 hover:bg-dark-navy/90"
              aria-label={
                isAudioActive
                  ? "Spegni ambiente sonoro"
                  : "Attiva ambiente sonoro 432Hz"
              }
            >
              <div className="flex items-center gap-0.5">
                {[4, 8, 12, 6].map((barHeight, idx) => (
                  <span
                    key={idx}
                    className={`w-0.5 rounded-full bg-teal-300 transition-all duration-300 ${
                      isAudioActive
                        ? "animate-pulse"
                        : "opacity-40 group-hover:opacity-75"
                    }`}
                    style={{
                      height: isAudioActive ? `${barHeight + 2}px` : "4px",
                      animationDelay: `${idx * 0.15}s`,
                    }}
                  />
                ))}
              </div>
              <span className="text-teal-100">
                {isAudioActive
                  ? "Audio Spaziale Attivo"
                  : "Audio Ambientale"}
              </span>
              {isAudioActive ? (
                <Volume2 className="h-3.5 w-3.5 text-teal-300" />
              ) : (
                <VolumeX className="h-3.5 w-3.5 text-white/60" />
              )}
            </button>
          </motion.div>
        </motion.div>

        {/* =============================================================== */}
        {/* BADGE DI EMERSIONE LATERALI ACT I                              */}
        {/* =============================================================== */}
        <motion.div
          style={{ opacity: badgeOpacity, x: badgeXLeft }}
          className="pointer-events-none absolute inset-y-0 left-[4%] z-20 hidden items-center md:flex"
        >
          <span className="inline-flex items-center rounded-full border border-white/50 bg-white/70 px-5 py-2.5 font-sans text-xs font-medium tracking-wide text-primary-teal shadow-lg backdrop-blur-xl">
            {badge}
          </span>
        </motion.div>

        <motion.div
          style={{ opacity: badgeOpacity, x: badgeXRight }}
          className="pointer-events-none absolute inset-y-0 right-[4%] z-20 hidden items-center md:flex"
        >
          <span className="inline-flex items-center rounded-full border border-white/50 bg-white/70 px-5 py-2.5 font-sans text-xs font-medium tracking-wide text-primary-teal shadow-lg backdrop-blur-xl">
            Orario continuato · Lun–Ven 8:00–20:00 · Sab 9:00–14:00
          </span>
        </motion.div>
      </div>
    </div>
  );
}
