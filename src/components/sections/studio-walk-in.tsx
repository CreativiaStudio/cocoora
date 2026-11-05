"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

interface StudioWalkInProps {
  imageSrc?: string;
  imageWebp?: string;
}

export function StudioWalkIn({
  imageSrc = "/images/centro/foto-1.jpg",
  imageWebp = "/images/centro/foto-1.webp",
}: StudioWalkInProps) {
  const containerRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // Scroll tracking per l'intera durata del passaggio nella viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Dolly-in cinematica: zoom progressivo incentrato sulla parete con logo Cocoora (52% 26%)
  // per dare la precisa sensazione fisica di avanzare ed entrare nello studio
  const scale = useTransform(scrollYProgress, [0, 1], [1.0, 1.20]);
  const y = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  return (
    <section
      ref={containerRef}
      aria-label="Accoglienza e architettura del centro Cocoora"
      className="relative isolate w-full overflow-hidden border-y border-[#c5dbe3]/40 bg-[#002231] h-[82vh] sm:h-[90vh] lg:h-[96vh] min-h-[560px] max-h-[1100px]"
    >
      {/* Immagine con motion zoom incentrato sul logo e sulla reception */}
      <motion.div
        style={{
          scale: reduced ? 1.03 : scale,
          y: reduced ? "0%" : y,
          transformOrigin: "52% 26%",
        }}
        className="absolute -inset-x-0 -inset-y-[8%] h-[116%] w-full will-change-transform"
      >
        <picture>
          <source srcSet={imageWebp} type="image/webp" />
          <img
            src={imageSrc}
            alt="Reception, logo e accoglienza del centro medico Cocoora a Napoli"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-[center_16%] select-none brightness-[1.02]"
          />
        </picture>
      </motion.div>

      {/* Raccordo sfumato superiore minimale che NON copre il logo a parete */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-6 sm:h-9 bg-gradient-to-b from-[#fafcfd]/60 to-transparent z-10"
      />

      {/* Raccordo sfumato inferiore morbido verso la sezione successiva */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-8 sm:h-12 bg-gradient-to-t from-[#fafcfd]/60 to-transparent z-10"
      />
    </section>
  );
}

export default StudioWalkIn;
