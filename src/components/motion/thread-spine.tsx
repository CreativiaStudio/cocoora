"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

export type ThreadSection = {
  /** Id dell'elemento DOM a cui agganciare il nodo del filo. */
  id: string;
  /** Etichetta descrittiva della sezione (facoltativa). */
  label?: string;
};

export type ThreadSpineProps = {
  /** Sezioni, in ordine di lettura, che il filo deve connettere. */
  sections?: ThreadSection[];
  /** Classi aggiuntive per il contenitore del filo. */
  className?: string;
};

type ThreadNodeData = {
  id: string;
  /** Posizione del nodo sul filo, in percentuale (0-100). */
  y: number;
};

const EDGE_PADDING = 3;
const MIN_NODE_GAP = 4;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

/**
 * Costruisce un filo verticale leggermente organico che attraversa i nodi.
 * Le coordinate sono in un viewBox 100x100 con preserveAspectRatio="none".
 */
function buildThreadPath(nodes: ThreadNodeData[]): string {
  const points = [
    { x: 50, y: 0 },
    ...nodes.map((node, index) => ({
      x: 50 + (index % 2 === 0 ? 1 : -1) * 13,
      y: node.y,
    })),
    { x: 50, y: 100 },
  ];

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const handle = (next.y - current.y) * 0.5;

    path += ` C ${current.x} ${current.y + handle}, ${next.x} ${
      next.y - handle
    }, ${next.x} ${next.y}`;
  }

  return path;
}

/**
 * Misura le sezioni reali e calcola la percentuale di scroll a cui
 * ciascuna entra nel viewport. Il nodo viene posizionato sul filo
 * esattamente a quella percentuale, così la punta del filo lo
 * raggiunge nel momento in cui la sezione viene inquadrata.
 */
function useThreadNodes(sections: ThreadSection[]): ThreadNodeData[] {
  const idsKey = sections.map((section) => section.id).join("|");
  const [nodes, setNodes] = useState<ThreadNodeData[]>([]);

  useEffect(() => {
    const ids = idsKey ? idsKey.split("|") : [];

    if (ids.length === 0) {
      setNodes([]);
      return;
    }

    let frame = 0;

    const measure = () => {
      frame = 0;

      const viewportHeight = window.innerHeight;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - viewportHeight
      );

      const measured: ThreadNodeData[] = [];

      ids.forEach((id) => {
        const element = document.getElementById(id);
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const center = rect.top + window.scrollY + rect.height / 2;
        const progress = clamp01(
          (center - viewportHeight * 0.55) / maxScroll
        );

        measured.push({ id, y: progress * 100 });
      });

      const next: ThreadNodeData[] = [];

      measured.forEach((node, index) => {
        const floor =
          index === 0 ? EDGE_PADDING : next[index - 1].y + MIN_NODE_GAP;
        const y = clamp(
          Math.max(node.y, floor),
          EDGE_PADDING,
          100 - EDGE_PADDING
        );

        next.push({ id: node.id, y });
      });

      setNodes((previous) => {
        const unchanged =
          previous.length === next.length &&
          previous.every(
            (node, index) =>
              node.id === next[index].id &&
              Math.abs(node.y - next[index].y) < 0.2
          );

        return unchanged ? previous : next;
      });
    };

    const schedule = () => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();

    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(schedule)
        : null;

    resizeObserver?.observe(document.body);

    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) resizeObserver?.observe(element);
    });

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
      resizeObserver?.disconnect();
    };
  }, [idsKey]);

  return nodes;
}

type ThreadNodeProps = {
  index: number;
  y: number;
  progress: MotionValue<number>;
  reducedMotion: boolean;
};

function ThreadNode({ index, y, progress, reducedMotion }: ThreadNodeProps) {
  const threshold = clamp01(y / 100);
  const reachStart = Math.max(0, threshold - 0.05);

  const haloOpacity = useTransform(progress, [reachStart, threshold], [0, 0.9], {
    clamp: true,
  });
  const coreScale = useTransform(progress, [reachStart, threshold], [0.7, 1], {
    clamp: true,
  });

  return (
    <div
      aria-hidden="true"
      className="absolute"
      style={{
        top: `${y}%`,
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="relative flex h-7 w-7 items-center justify-center">
        {/* Nodo di base, sempre visibile lungo il filo */}
        <span
          className="absolute h-1.5 w-1.5 rounded-full"
          style={{
            backgroundColor: "rgba(28, 74, 92, 0.35)",
            boxShadow: "0 0 0 3px rgba(128, 161, 178, 0.12)",
          }}
        />

        {/* Alone luminoso: compare quando lo scroll raggiunge il nodo */}
        <motion.span
          className="absolute inset-0 flex items-center justify-center"
          style={reducedMotion ? { opacity: 1 } : { opacity: haloOpacity }}
        >
          <motion.span
            className="block h-4 w-4 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(128, 161, 178, 0.55) 0%, rgba(28, 74, 92, 0.18) 55%, rgba(28, 74, 92, 0) 72%)",
            }}
            animate={
              reducedMotion
                ? undefined
                : { scale: [1, 1.45, 1], opacity: [0.95, 0.4, 0.95] }
            }
            transition={{
              duration: 3.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.4,
            }}
          />
        </motion.span>

        {/* Nucleo biologico */}
        <motion.span
          className="block h-[7px] w-[7px] rounded-full"
          style={
            reducedMotion
              ? { backgroundColor: "#1C4A5C" }
              : {
                  scale: coreScale,
                  backgroundColor: "#1C4A5C",
                  boxShadow: "0 0 8px rgba(128, 161, 178, 0.85)",
                }
          }
        />
      </div>
    </div>
  );
}

/**
 * "Il Filo": la spina dorsale luminosa che connette le sezioni di Cocoora.
 * Il tracciato si disegna seguendo l'avanzamento dello scroll di pagina e
 * i nodi pulsano quando vengono raggiunti. Nascosta sotto md.
 */
export function ThreadSpine({
  sections = [],
  className = "",
}: ThreadSpineProps) {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion ?? false;

  const nodes = useThreadNodes(sections);
  const path = useMemo(() => buildThreadPath(nodes), [nodes]);

  const { scrollYProgress } = useScroll();
  const smoothedProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const gradientId = `thread-gradient-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const glowId = `thread-glow-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  if (sections.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed right-4 top-1/2 z-30 hidden h-[68vh] w-8 -translate-y-1/2 md:block lg:right-6 xl:right-10 ${className}`}
    >
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1C4A5C" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#80A1B2" stopOpacity="1" />
            <stop offset="100%" stopColor="#1C4A5C" stopOpacity="0.85" />
          </linearGradient>

          <filter id={glowId} x="-150%" y="-15%" width="400%" height="130%">
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
        </defs>

        {/* Traccia di base */}
        <path
          d={path}
          stroke="#03354B"
          strokeOpacity="0.12"
          strokeWidth={1.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Filo luminoso disegnato dallo scroll */}
        <motion.path
          d={path}
          stroke={`url(#${gradientId})`}
          strokeWidth={1.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: reducedMotion ? 1 : smoothedProgress }}
        />

        {/* Glow soffuso del filo */}
        <motion.path
          d={path}
          stroke="#80A1B2"
          strokeOpacity={0.55}
          strokeWidth={3}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          filter={`url(#${glowId})`}
          style={{ pathLength: reducedMotion ? 1 : smoothedProgress }}
        />
      </svg>

      {nodes.map((node, index) => (
        <ThreadNode
          key={node.id}
          index={index}
          y={node.y}
          progress={smoothedProgress}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  );
}
