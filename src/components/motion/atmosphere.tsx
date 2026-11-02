"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * "La Marea" — sfondo atmosferico fisso guidato dallo scroll.
 *
 * L'intera pagina scorre sopra questo layer: il colore di fondo attraversa
 * una rampa continua (nessuno stacco netto) dal Dark Navy al Teal, poi
 * all'azzurro polvere e infine a un neutral chiaro, per tornare al Navy
 * in chiusura. Una luce volumetrica radiale filtra dall'alto e si attenua
 * con l'avanzare dello scroll.
 */

const SCROLL_STOPS: number[] = [0, 0.22, 0.45, 0.72, 0.88, 1];

const TIDE_COLORS: string[] = [
  "#03354B",
  "#0c3d52",
  "#1C4A5C",
  "#80A1B2",
  "#EEF4F7",
  "#03354B",
];

const VOLUMETRIC_LIGHT =
  "radial-gradient(125% 90% at 50% 0%, rgba(238, 244, 247, 0.95) 0%, rgba(128, 161, 178, 0.42) 38%, rgba(28, 74, 92, 0.16) 62%, rgba(3, 53, 75, 0) 78%)";

export function Atmosphere() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const backgroundColor = useTransform(
    scrollYProgress,
    SCROLL_STOPS,
    TIDE_COLORS
  );

  const lightOpacity = useTransform(scrollYProgress, [0, 0.7], [0.5, 0.05], {
    clamp: true,
  });

  if (prefersReducedMotion) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#1C4A5C]"
      >
        <div
          className="absolute inset-0"
          style={{ backgroundImage: VOLUMETRIC_LIGHT, opacity: 0.12 }}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#03354B]"
    >
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundColor,
          willChange: "background-color",
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: VOLUMETRIC_LIGHT,
          opacity: lightOpacity,
          willChange: "opacity",
        }}
      />
    </div>
  );
}
