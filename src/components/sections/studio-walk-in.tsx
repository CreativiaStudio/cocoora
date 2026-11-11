"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

interface StudioWalkInProps {
  imageSrc?: string;
  imageWebp?: string;
}

export function StudioWalkIn({
  imageSrc = "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-1.jpg",
  imageWebp = "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev/images/centro/foto-1.webp",
}: StudioWalkInProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Tracking dello scroll per l'espansione cinematica
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // =========================================================================
  // EFFETTO CINEMA: ESPANSIONE GPU A ZERO REFLOW (0.00 -> 0.45)
  // La foto parte come una card elegante e proporzionata con angoli arrotondati,
  // e man mano che si scrolla si espande fluidamente fino a saturare il 100%
  // dello schermo (full-bleed), dando la sensazione fisica di entrare nello studio.
  // =========================================================================
  const insetY = useTransform(
    scrollYProgress,
    [0.05, 0.45],
    [isMobile ? 18 : 13, 0],
    { clamp: true }
  );

  const insetX = useTransform(
    scrollYProgress,
    [0.05, 0.45],
    [isMobile ? 5 : 9, 0],
    { clamp: true }
  );

  const radius = useTransform(
    scrollYProgress,
    [0.05, 0.45],
    [32, 0],
    { clamp: true }
  );

  const clipPath = useMotionTemplate`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${radius}px)`;

  // Dolly-in: zoom progressivo continuo incentrato sul logo Cocoora e sulla reception (52% 26%)
  const cameraScale = useTransform(
    scrollYProgress,
    [0.05, 0.95],
    [1.0, 1.22],
    { clamp: true }
  );

  // Ombra della card iniziale che sfuma quando raggiunge il pieno schermo
  const frameShadowOpacity = useTransform(
    scrollYProgress,
    [0.05, 0.38],
    [0.35, 0],
    { clamp: true }
  );

  // Se l'utente ha impostato preferenze di movimento ridotto (accessibilità)
  if (prefersReducedMotion) {
    return (
      <section
        aria-label="Accoglienza e architettura del centro Cocoora"
        className="relative w-full overflow-hidden bg-[#002231] h-[80vh] min-h-[500px]"
      >
        <picture>
          <source srcSet={imageWebp} type="image/webp" />
          <img
            src={imageSrc}
            alt="Reception, logo e accoglienza del centro medico Cocoora a Napoli"
            className="h-full w-full object-cover object-[center_16%]"
          />
        </picture>
      </section>
    );
  }

  return (
    <div
      ref={containerRef}
      aria-label="Esperienza immersiva studio Cocoora"
      className="relative h-[220vh] bg-canvas"
    >
      {/* Viewport fissa a schermo intero durante lo scroll */}
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Stage GPU con clip-path: parte incorniciata e poi prende tutto lo schermo */}
        <motion.div
          style={{
            clipPath,
            willChange: "clip-path",
          }}
          className="relative h-full w-full overflow-hidden bg-[#002231]"
        >
          {/* Traccia visiva della foto con Dolly Zoom cinematografico verso il logo */}
          <motion.div
            style={{
              scale: cameraScale,
              transformOrigin: "52% 26%",
            }}
            className="absolute inset-0 h-full w-full will-change-transform"
          >
            <picture>
              <source srcSet={imageWebp} type="image/webp" />
              <img
                src={imageSrc}
                alt="Reception, logo e accoglienza del centro medico Cocoora a Napoli"
                loading="eager"
                decoding="async"
                className="h-full w-full object-cover object-[center_16%] select-none brightness-[1.02]"
              />
            </picture>
          </motion.div>

          {/* Raccordo superiore ed inferiore morbidissimo senza coprire il logo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-8 sm:h-12 bg-gradient-to-b from-[#002231]/30 to-transparent z-10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-10 sm:h-16 bg-gradient-to-t from-[#002231]/40 to-transparent z-10"
          />
        </motion.div>

        {/* Ombra di profondità quando la card è ristretta all'inizio */}
        <motion.div
          style={{ opacity: frameShadowOpacity }}
          className="pointer-events-none absolute inset-0 z-20 shadow-[0_30px_90px_-20px_rgba(0,34,49,0.4)]"
        />
      </div>
    </div>
  );
}

export default StudioWalkIn;
