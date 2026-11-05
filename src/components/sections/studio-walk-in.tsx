"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

interface StudioWalkInProps {
  imageSrc?: string;
  imageWebp?: string;
  tag?: string;
}

export function StudioWalkIn({
  imageSrc = "/images/centro/foto-1.jpg",
  imageWebp = "/images/centro/foto-1.webp",
  tag = "Accoglienza & Spazi Clinici · Napoli",
}: StudioWalkInProps) {
  const containerRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // Scroll tracking from when section starts entering the screen to when it fully leaves
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Dolly-in zoom: scale increases smoothly as the user scrolls, creating the sensation
  // of walking forward into the clinical space
  const scale = useTransform(scrollYProgress, [0, 1], [1.02, 1.25]);

  // Subtle vertical parallax to enhance depth
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section
      ref={containerRef}
      aria-label="Spazi e architettura clinica Cocoora"
      className="relative isolate w-full overflow-hidden bg-[#002231] h-[60vh] sm:h-[72vh] lg:h-[84vh] min-h-[460px] max-h-[860px]"
    >
      {/* Immagine con motion zoom progressivo in scroll */}
      <motion.div
        style={{
          scale: reduced ? 1.05 : scale,
          y: reduced ? "0%" : y,
        }}
        className="absolute -inset-x-0 -inset-y-[10%] h-[120%] w-full will-change-transform"
      >
        <picture>
          <source srcSet={imageWebp} type="image/webp" />
          <img
            src={imageSrc}
            alt="Spazi clinici, design e accoglienza del centro medico Cocoora"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-center select-none"
          />
        </picture>
      </motion.div>

      {/* Sfumatura superiore: raccordo morbido con il background chiaro della sezione precedente */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 sm:h-36 bg-gradient-to-b from-[#fafcfd] via-[#fafcfd]/50 to-transparent z-10"
      />

      {/* Vignettatura radiale di profondità cinematica */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,34,49,0.32)_100%)] z-10"
      />

      {/* Sfumatura inferiore: raccordo morbido verso la sezione Aree Cliniche */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 sm:h-36 bg-gradient-to-t from-[#fafcfd] via-[#fafcfd]/50 to-transparent z-10"
      />

      {/* Tag editoriale minimale in frosted glass */}
      {tag && (
        <div className="pointer-events-none absolute bottom-8 left-6 sm:bottom-12 sm:left-12 lg:left-16 z-20">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-[#002231]/60 px-4 py-2 text-xs font-medium tracking-wide text-white/90 backdrop-blur-md shadow-[0_12px_32px_-10px_rgba(0,34,49,0.6)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#80a1b2] animate-pulse" />
            <span>{tag}</span>
          </div>
        </div>
      )}
    </section>
  );
}

export default StudioWalkIn;
