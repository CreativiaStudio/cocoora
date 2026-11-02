"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { ORBIT_SLOTS, LEGS } from "./pictogram";

const R_OUTER = 410;
const R_ORBIT = 285;
const R_INNER = 155;

type Vec = readonly [number, number];
type SlotLike = { center: Vec };

/**
 * Normalizza un elemento di LEGS in un punto unitario [x, y] (sistema matematico, Y verso l'alto).
 * Supporta tuple [x, y], oggetti con center/end/to/point oppure angoli in gradi.
 */
function toUnitPoint(leg: unknown): Vec | null {
  if (typeof leg === "number") {
    const rad = (leg * Math.PI) / 180;
    return [Math.cos(rad), Math.sin(rad)];
  }
  if (
    Array.isArray(leg) &&
    leg.length >= 2 &&
    typeof leg[0] === "number" &&
    typeof leg[1] === "number"
  ) {
    return [leg[0], leg[1]];
  }
  if (leg && typeof leg === "object") {
    const record = leg as Record<string, unknown>;
    for (const key of ["center", "end", "to", "point"]) {
      const v = record[key];
      if (
        Array.isArray(v) &&
        v.length >= 2 &&
        typeof v[0] === "number" &&
        typeof v[1] === "number"
      ) {
        return [v[0], v[1]];
      }
    }
  }
  return null;
}

const slots = ORBIT_SLOTS as unknown as readonly SlotLike[];
const legPoints = (LEGS as unknown as readonly unknown[])
  .map(toUnitPoint)
  .filter((p): p is Vec => p !== null);

const clamp = (v: number) => Math.max(-1, Math.min(1, v));

export function HeroOrbitalStage({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 24 });
  const sy = useSpring(my, { stiffness: 90, damping: 24 });

  const outerX = useTransform(sx, [-1, 1], [-18, 18]);
  const outerY = useTransform(sy, [-1, 1], [-18, 18]);
  const innerX = useTransform(sx, [-1, 1], [-9, 9]);
  const innerY = useTransform(sy, [-1, 1], [-9, 9]);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mx.set(clamp(nx));
      my.set(clamp(ny));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, mx, my]);

  const ticks = Array.from({ length: 72 }, (_, i) => i);

  return (
    <div
      aria-hidden
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}
    >
      {/* LIVELLO 1 — Luce caustica volumetrica */}
      <motion.div
        className="absolute left-[-10%] top-[-15%] h-[70vmax] w-[70vmax] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(28, 74, 92, 0.58) 0%, rgba(28, 74, 92, 0) 70%)",
          filter: "blur(60px)",
        }}
        animate={
          reduced
            ? undefined
            : { x: [0, 60, -40, 0], y: [0, -40, 30, 0], scale: [1, 1.08, 0.96, 1] }
        }
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-12%] top-[10%] h-[60vmax] w-[60vmax] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(128, 161, 178, 0.22) 0%, rgba(128, 161, 178, 0) 70%)",
          filter: "blur(70px)",
        }}
        animate={
          reduced
            ? undefined
            : { x: [0, -70, 30, 0], y: [0, 50, -20, 0], scale: [1, 0.94, 1.05, 1] }
        }
        transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-25%] left-[20%] h-[80vmax] w-[80vmax] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0, 34, 49, 0.85) 0%, rgba(0, 34, 49, 0) 70%)",
          filter: "blur(80px)",
        }}
        animate={
          reduced
            ? undefined
            : { x: [0, 40, -60, 0], y: [0, -30, 20, 0], scale: [1, 1.04, 0.98, 1] }
        }
        transition={{ duration: 42, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Griglia architettonica finissima, sfumata radialmente */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(128, 161, 178, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(128, 161, 178, 0.08) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(circle at center, black 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 0%, transparent 70%)",
        }}
      />

      {/* LIVELLO 2 — Quadrante orbitale a nonio */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative aspect-square w-[min(150vmin,1040px)]">
          {/* Anello esterno: parallasse ±18px */}
          <motion.div className="absolute inset-0" style={{ x: outerX, y: outerY }}>
            {/* Vernier rotante 28s */}
            <motion.div
              className="absolute inset-0"
              animate={reduced ? undefined : { rotate: 360 }}
              transition={{ duration: 28, ease: "linear", repeat: Infinity }}
            >
              <svg
                viewBox="-520 -520 1040 1040"
                className="absolute inset-0 h-full w-full overflow-visible"
              >
                <circle
                  r={R_OUTER}
                  fill="none"
                  stroke="rgba(197, 219, 227, 0.45)"
                  strokeWidth={0.75}
                />
                {ticks.map((i) => (
                  <line
                    key={`tick-${i}`}
                    x1={0}
                    y1={-R_OUTER}
                    x2={0}
                    y2={-R_OUTER + (i % 6 === 0 ? 14 : 6)}
                    stroke="rgba(197, 219, 227, 0.55)"
                    strokeWidth={i % 6 === 0 ? 1 : 0.6}
                    transform={`rotate(${i * 5})`}
                  />
                ))}
                {/* Arco speculare luminoso */}
                <circle
                  r={R_OUTER}
                  fill="none"
                  stroke="rgba(226, 237, 241, 0.95)"
                  strokeWidth={1.4}
                  strokeLinecap="round"
                  strokeDasharray="360 2216"
                  style={{ filter: "drop-shadow(0 0 6px rgba(197, 219, 227, 0.8))" }}
                />
              </svg>
            </motion.div>

            {/* Anello orbitale principale */}
            <svg
              viewBox="-520 -520 1040 1040"
              className="absolute inset-0 h-full w-full overflow-visible"
            >
              <circle
                r={R_ORBIT}
                fill="none"
                stroke="rgba(197, 219, 227, 0.35)"
                strokeWidth={1}
              />

              {/* Direttrici dei LEGS dal centro */}
              {legPoints.map((p, i) => {
                const x = p[0] * R_ORBIT;
                const y = -p[1] * R_ORBIT;
                return (
                  <g key={`leg-${i}`}>
                    <line
                      x1={0}
                      y1={0}
                      x2={x}
                      y2={y}
                      stroke="rgba(128, 161, 178, 0.5)"
                      strokeWidth={0.75}
                    />
                    <motion.circle
                      r={2.5}
                      fill="#e2edf1"
                      initial={{ cx: 0, cy: 0, opacity: 0 }}
                      animate={
                        reduced
                          ? { cx: x, cy: y, opacity: 0 }
                          : { cx: [0, x], cy: [0, y], opacity: [0, 1, 0] }
                      }
                      transition={{
                        duration: 3.2,
                        ease: "easeInOut",
                        repeat: Infinity,
                        delay: i * 0.9,
                      }}
                      style={{ filter: "drop-shadow(0 0 4px #e2edf1)" }}
                    />
                  </g>
                );
              })}

              {/* 8 stazioni con anelli concentrici pulsanti */}
              {slots.map((slot, i) => {
                const cx = slot.center[0] * R_ORBIT;
                const cy = -slot.center[1] * R_ORBIT;
                return (
                  <g key={`station-${i}`}>
                    <motion.circle
                      cx={cx}
                      cy={cy}
                      fill="none"
                      stroke="rgba(197, 219, 227, 0.7)"
                      strokeWidth={0.75}
                      initial={{ r: 8, opacity: 0.7 }}
                      animate={
                        reduced ? { r: 8, opacity: 0.5 } : { r: [8, 26], opacity: [0.7, 0] }
                      }
                      transition={{
                        duration: 3,
                        ease: "easeOut",
                        repeat: Infinity,
                        delay: i * 0.4,
                      }}
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r={8}
                      fill="#00344b"
                      stroke="#c5dbe3"
                      strokeWidth={1}
                    />
                    <circle cx={cx} cy={cy} r={2.5} fill="#80a1b2" />
                  </g>
                );
              })}
            </svg>
          </motion.div>

          {/* Anello interno: parallasse ±9px, tratteggio contro-rotante */}
          <motion.div
            className="absolute inset-0"
            style={{ x: innerX, y: innerY }}
          >
            <motion.div
              className="absolute inset-0"
              animate={reduced ? undefined : { rotate: -360 }}
              transition={{ duration: 60, ease: "linear", repeat: Infinity }}
            >
              <svg
                viewBox="-520 -520 1040 1040"
                className="absolute inset-0 h-full w-full overflow-visible"
              >
                <circle
                  r={R_INNER}
                  fill="none"
                  stroke="rgba(197, 219, 227, 0.4)"
                  strokeWidth={0.6}
                  strokeDasharray="2 6"
                />
              </svg>
            </motion.div>
            <div
              className="absolute left-1/2 top-1/2 h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-100"
              style={{ boxShadow: "0 0 12px 3px rgba(197, 219, 227, 0.45)" }}
            />
          </motion.div>
        </div>
      </div>

      {/* LIVELLO 3 — Micro-telemetria architettonica */}
      <div className="absolute bottom-10 left-10 hidden flex-col gap-2 text-[10px] font-sans uppercase tracking-[0.28em] text-teal-200/35 lg:flex">
        <span>40°50′N · 14°15′E · NAPOLI</span>
        <span>SISTEMA CLINICO CONNESSO · 08 NODI</span>
      </div>
    </div>
  );
}
