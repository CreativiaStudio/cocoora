"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE } from "@/components/motion/tokens";

export interface CareDialItem {
  id: string;
  label: string;
  category: string;
  subtitle?: string;
  href: string;
  image: string;
}

export interface CareDialProps {
  items: readonly CareDialItem[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  align?: "right" | "left";
  accentLabel?: string;
}

const SLOT_OFFSETS = [-3, -2, -1, 0, 1, 2, 3] as const;

const ROW_SPRING = { type: "spring", stiffness: 175, damping: 24, mass: 0.72 } as const;

interface Tick {
  key: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
  opacity: number;
  strokeWidth: number;
}

function buildTicks(): Tick[] {
  const ticks: Tick[] = [];
  for (let i = 0; i <= 48; i++) {
    const t = (i / 48) * 2 - 1;
    const cy = 16 + (i / 48) * 388;
    const cx = 8 + Math.cos(t * (Math.PI / 2)) * 24;
    const angleDeg = -t * 18;
    const focus = Math.max(0, 1 - Math.abs(t) * 2.4);
    const len = (i % 4 === 0 ? 12 : 7.5) + focus * 5.5;
    const rad = (angleDeg * Math.PI) / 180;
    const dx = Math.cos(rad) * len;
    const dy = Math.sin(rad) * len;
    const near = focus > 0;
    ticks.push({
      key: i,
      x1: Number((cx - dx).toFixed(2)),
      y1: Number((cy - dy).toFixed(2)),
      x2: Number(cx.toFixed(2)),
      y2: Number(cy.toFixed(2)),
      stroke: near ? "#1C4A5C" : "#80A1B2",
      opacity: near ? 0.22 + focus * 0.68 : 0.42,
      strokeWidth: focus > 0.5 ? 1.6 : 1.1,
    });
  }
  return ticks;
}

const TICKS = buildTicks();

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function BezelSpine() {
  const reticleX = 8 + 24 + 6;
  return (
    <div className="h-[370px] w-10 shrink-0 select-none sm:h-[420px] sm:w-12">
      <svg viewBox="0 0 48 420" className="h-full w-full overflow-visible" aria-hidden="true">
        {TICKS.map((tk) => (
          <line
            key={tk.key}
            x1={tk.x1}
            y1={tk.y1}
            x2={tk.x2}
            y2={tk.y2}
            stroke={tk.stroke}
            strokeOpacity={tk.opacity}
            strokeWidth={tk.strokeWidth}
            strokeLinecap="round"
          />
        ))}
        <circle cx={reticleX} cy={210} r={2.6} fill="#1C4A5C" />
        <circle cx={reticleX} cy={210} r={5.5} fill="none" stroke="#1C4A5C" strokeOpacity={0.25} strokeWidth={1} />
      </svg>
    </div>
  );
}

export function CareDial({ items, activeIndex, onSelectIndex, align = "right", accentLabel }: CareDialProps) {
  const reduceMotion = useReducedMotion();
  const touchStartY = React.useRef<number | null>(null);

  const count = items.length;
  if (count === 0) return null;

  const safeActive = ((activeIndex % count) + count) % count;
  const activeItem = items[safeActive];

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const start = touchStartY.current;
    touchStartY.current = null;
    if (start === null) return;
    const end = e.changedTouches[0]?.clientY ?? start;
    const delta = end - start;
    if (Math.abs(delta) < 28) return;
    onSelectIndex(delta < 0 ? safeActive + 1 : safeActive - 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      onSelectIndex(safeActive + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      onSelectIndex(safeActive - 1);
    }
  };

  const rowTransition = reduceMotion ? { duration: 0 } : ROW_SPRING;

  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-center lg:gap-7", align === "left" && "md:flex-row-reverse")}>
      {/* Dial column */}
      <div
        className="relative flex min-w-0 flex-1 items-center outline-none"
        role="listbox"
        aria-label={accentLabel ?? "Selettore trattamenti"}
        aria-activedescendant={`care-dial-${activeItem.id}`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <BezelSpine />

        <div className="relative h-[370px] min-w-0 flex-1 sm:h-[420px]">
          <div className="relative h-full w-full [mask-image:linear-gradient(to_bottom,transparent_0%,black_14%,black_86%,transparent_100%)]">
            <AnimatePresence initial={false}>
              {SLOT_OFFSETS.map((d) => {
                const itemIdx = (((safeActive + d) % count) + count) % count;
                const item = items[itemIdx];
                const isActive = d === 0;
                const abs = Math.abs(d);
                const y = d * 54;
                const x = Math.round(Math.cos((d / 3.5) * (Math.PI / 2)) * 22);
                const scale = isActive ? 1 : Math.max(0.84, 1 - abs * 0.05);
                const opacity = isActive ? 1 : abs === 1 ? 0.74 : abs === 2 ? 0.45 : 0.2;

                return (
                  <motion.div
                    key={item.id}
                    id={`care-dial-${item.id}`}
                    role="option"
                    aria-selected={isActive}
                    initial={{ opacity: 0, scale: 0.8, x, y }}
                    animate={{ opacity, scale, x, y }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={rowTransition}
                    style={{ zIndex: 10 - abs }}
                    className="absolute left-0 right-9 top-1/2 -translate-y-1/2 flex origin-left items-center gap-3 will-change-transform sm:gap-3.5"
                  >
                    <div
                      className={cn(
                        "relative h-10 w-10 shrink-0 overflow-hidden rounded-[12px] bg-teal-100 sm:h-12 sm:w-12",
                        isActive && "ring-2 ring-[#1C4A5C]/30 shadow-[0_12px_26px_-10px_rgba(3,53,75,0.45)]"
                      )}
                    >
                      <Image src={item.image} alt={item.label} width={64} height={64} className="h-full w-full object-cover" />
                    </div>

                    {isActive ? (
                      <Link href={item.href} className="group/active flex min-w-0 items-center gap-2 focus-visible:outline-none">
                        <span className="flex min-w-0 flex-col">
                          <span className="truncate font-serif text-[20px] font-semibold leading-tight tracking-[-0.02em] text-[#00344B] sm:text-[23px] xl:text-[24px]">
                            {item.label}
                          </span>
                          {item.subtitle ? (
                            <span className="truncate font-sans text-[12px] text-[#3D3D3C]/70 sm:text-[13px]">{item.subtitle}</span>
                          ) : null}
                        </span>
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#1C4A5C]/25 bg-[#1C4A5C]/10 text-[#1C4A5C] transition-colors duration-200 group-hover/active:bg-[#1C4A5C] group-hover/active:text-white group-focus-visible/active:ring-2 group-focus-visible/active:ring-[#1C4A5C]/40">
                          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => onSelectIndex(itemIdx)}
                        className="min-w-0 truncate text-left font-sans text-[15px] font-medium tracking-[-0.015em] text-[#00344B]/80 transition-colors hover:text-[#00344B] sm:text-[17px]"
                      >
                        {item.label}
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={() => onSelectIndex(safeActive - 1)}
            aria-label="Trattamento precedente"
            className="absolute right-1 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-[#1C4A5C]/15 bg-white/80 text-[#1C4A5C] backdrop-blur transition-colors hover:bg-[#1C4A5C] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C4A5C]/40"
          >
            <ChevronUp className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onSelectIndex(safeActive + 1)}
            aria-label="Trattamento successivo"
            className="absolute bottom-2 right-1 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-[#1C4A5C]/15 bg-white/80 text-[#1C4A5C] backdrop-blur transition-colors hover:bg-[#1C4A5C] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C4A5C]/40"
          >
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Portrait */}
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-[1.85rem] border border-white/90 bg-[#00344b] shadow-[0_32px_70px_-28px_rgba(3,53,75,0.38)] sm:aspect-[16/10] md:aspect-[4/5] md:w-[230px] xl:w-[275px]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={activeItem.id}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.7, ease: EASE.out }}
            className="absolute inset-0 will-change-transform"
          >
            <Image
              src={activeItem.image}
              alt={activeItem.label}
              fill
              sizes="(min-width: 1280px) 275px, (min-width: 768px) 230px, 100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#00344b]/85 via-[#00344b]/20 to-transparent" aria-hidden="true" />

        {accentLabel ? (
          <span className="absolute left-3.5 top-3.5 z-10 rounded-full border border-white/25 bg-white/15 px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
            {accentLabel}
          </span>
        ) : null}

        <span className="absolute right-3.5 top-3.5 z-10 rounded-full border border-white/25 bg-[#00344b]/40 px-2.5 py-1 font-sans text-[11px] font-medium tabular-nums text-white backdrop-blur-md">
          {pad(safeActive + 1)} / {pad(count)}
        </span>

        <Link
          href={activeItem.href}
          className="group/caption absolute inset-x-3 bottom-3 z-10 flex items-end justify-between gap-3 rounded-[1.25rem] border border-white/20 bg-white/10 p-3.5 text-white backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <span className="flex min-w-0 flex-col">
            <span className="truncate font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#80A1B2]">
              {activeItem.category}
            </span>
            <span className="truncate font-serif text-[19px] font-semibold leading-tight tracking-[-0.01em]">
              {activeItem.label}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-1 font-sans text-[12px] font-medium">
            Scopri
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/caption:translate-x-0.5" aria-hidden="true" />
          </span>
        </Link>
      </div>
    </div>
  );
}

export default CareDial;