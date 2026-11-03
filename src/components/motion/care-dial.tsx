"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";

const ROW_SPRING = { type: "spring" as const, stiffness: 180, damping: 24, mass: 0.72 };

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

const DRAG_STEP_PX = 18;
const HOVER_STEP_PX = 22;
const WHEEL_THRESHOLD = 36;
const WHEEL_COOLDOWN_MS = 65;
const SWIPE_THRESHOLD_PX = 28;
const VISIBLE_OFFSETS = [-3, -2, -1, 0, 1, 2, 3] as const;

interface LatestState {
  safeActive: number;
  count: number;
  onSelectIndex: (index: number) => void;
}

interface Anchor {
  y: number;
  baseIndex: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function wrapIndex(index: number, count: number): number {
  if (count <= 0) return 0;
  return ((index % count) + count) % count;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

interface BezelSpineProps {
  safeActive: number;
  latestRef: React.MutableRefObject<LatestState>;
}

function BezelSpine({ safeActive, latestRef }: BezelSpineProps) {
  const [hoverRatio, setHoverRatio] = React.useState<number | null>(null);
  const [isBezelHovered, setIsBezelHovered] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);

  const hoverAnchorRef = React.useRef<Anchor | null>(null);
  const dragAnchorRef = React.useRef<Anchor | null>(null);

  const isEngaged = isBezelHovered || isDragging;
  const cursorT = hoverRatio !== null ? hoverRatio * 2 - 1 : null;
  const reticleX = 10 + 24 + 7;

  const getRatio = (e: React.PointerEvent<HTMLDivElement>): number => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.height <= 0) return 0.5;
    return clamp((e.clientY - rect.top) / rect.height, 0, 1);
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    hoverAnchorRef.current = { y: e.clientY, baseIndex: latestRef.current.safeActive };
    setIsBezelHovered(true);
    setHoverRatio(getRatio(e));
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    setHoverRatio(getRatio(e));

    const dragging = dragAnchorRef.current !== null;
    let anchor = dragging ? dragAnchorRef.current : hoverAnchorRef.current;
    if (!anchor) {
      anchor = { y: e.clientY, baseIndex: latestRef.current.safeActive };
      hoverAnchorRef.current = anchor;
      return;
    }

    const stepPx = dragging ? DRAG_STEP_PX : HOVER_STEP_PX;
    const delta = e.clientY - anchor.y;
    const stepDelta = Math.trunc(delta / stepPx);
    if (stepDelta === 0) return;

    const next = anchor.baseIndex + stepDelta;
    const nextAnchor: Anchor = { y: anchor.y + stepDelta * stepPx, baseIndex: next };
    if (dragging) {
      dragAnchorRef.current = nextAnchor;
    } else {
      hoverAnchorRef.current = nextAnchor;
    }
    latestRef.current.onSelectIndex(next);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
    dragAnchorRef.current = { y: e.clientY, baseIndex: latestRef.current.safeActive };
    setIsDragging(true);
    setHoverRatio(getRatio(e));
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragAnchorRef.current) {
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        /* noop */
      }
    }
    dragAnchorRef.current = null;
    setIsDragging(false);
    hoverAnchorRef.current = { y: e.clientY, baseIndex: latestRef.current.safeActive };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    endDrag(e);
    if (e.pointerType !== "mouse") {
      hoverAnchorRef.current = null;
      setIsBezelHovered(false);
      setHoverRatio(null);
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    endDrag(e);
    hoverAnchorRef.current = null;
    setIsBezelHovered(false);
    setHoverRatio(null);
  };

  const handlePointerLeave = () => {
    if (dragAnchorRef.current) return;
    hoverAnchorRef.current = null;
    setIsBezelHovered(false);
    setIsDragging(false);
    setHoverRatio(null);
  };

  const ticks: React.ReactNode[] = [];
  for (let i = 0; i <= 48; i++) {
    const t = (i / 48) * 2 - 1;
    const cy = 16 + (i / 48) * 388;
    const cx = 10 + Math.cos(t * (Math.PI / 2)) * 24;
    const angleDeg = -t * 18;
    const angleRad = (angleDeg * Math.PI) / 180;
    const isMajor = (i + safeActive) % 4 === 0;
    const cursorFocus =
      cursorT !== null ? Math.max(0, 1 - Math.abs(t - cursorT) * 4.5) : 0;
    const len = (isMajor ? 10 : 5) + cursorFocus * 5;
    const dx = Math.cos(angleRad) * len;
    const dy = Math.sin(angleRad) * len;
    const edgeFade = 1 - Math.abs(t) * 0.55;
    const baseOpacity = (isMajor ? 0.55 : 0.3) * edgeFade;
    const opacity = Math.min(1, baseOpacity + cursorFocus * 0.5);
    const stroke = cursorFocus > 0.05 ? "#1C4A5C" : "#80A1B2";

    ticks.push(
      <line
        key={i}
        x1={cx - dx}
        y1={cy - dy}
        x2={cx}
        y2={cy}
        stroke={stroke}
        strokeOpacity={opacity}
        strokeWidth={isMajor ? 1.4 : 1}
        strokeLinecap="round"
        style={{ transition: "stroke 160ms ease-out, stroke-opacity 160ms ease-out" }}
      />,
    );
  }

  return (
    <div
      className="relative w-12 sm:w-14 h-[370px] sm:h-[420px] shrink-0 select-none touch-none cursor-ns-resize active:cursor-grabbing"
      title="Scorri o muovi il cursore per ruotare"
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerLeave}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 56 420"
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
      >
        {ticks}
        <circle
          cx={reticleX}
          cy={210}
          r={isEngaged ? 11 : 7}
          fill={isEngaged ? "rgba(28,74,92,0.10)" : "rgba(28,74,92,0.03)"}
          stroke="#1C4A5C"
          strokeOpacity={isEngaged ? 0.65 : 0.28}
          strokeWidth={1.15}
          style={{ transition: "all 180ms ease-out" }}
        />
        <circle cx={reticleX} cy={210} r={2.8} fill="#1C4A5C" />
        {hoverRatio !== null && cursorT !== null ? (
          <circle
            cx={10 + Math.cos(cursorT * (Math.PI / 2)) * 24 + 7}
            cy={16 + hoverRatio * 388}
            r={2.2}
            fill="#1C4A5C"
            fillOpacity={0.7}
          />
        ) : null}
      </svg>
    </div>
  );
}

export function CareDial({
  items,
  activeIndex,
  onSelectIndex,
  align = "right",
  accentLabel = "Cocoora",
}: CareDialProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const count = items.length;
  const safeActive = count > 0 ? wrapIndex(Math.round(activeIndex), count) : 0;

  const select = React.useCallback(
    (index: number) => {
      if (count <= 0) return;
      const next = wrapIndex(index, count);
      onSelectIndex(next);
    },
    [count, onSelectIndex],
  );

  const latestRef = React.useRef<LatestState>({
    safeActive,
    count,
    onSelectIndex: select,
  });
  latestRef.current = { safeActive, count, onSelectIndex: select };

  const dialZoneRef = React.useRef<HTMLDivElement | null>(null);
  const wheelAccRef = React.useRef(0);
  const wheelLastStepRef = React.useRef(0);
  const touchStartYRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const el = dialZoneRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      e.stopPropagation();

      const delta = e.deltaMode === 1 ? e.deltaY * 36 : e.deltaY;
      if (delta === 0) return;

      if (
        wheelAccRef.current !== 0 &&
        Math.sign(wheelAccRef.current) !== Math.sign(delta)
      ) {
        wheelAccRef.current = 0;
      }
      wheelAccRef.current += delta;

      const now = performance.now();
      if (Math.abs(wheelAccRef.current) < WHEEL_THRESHOLD) return;
      if (now - wheelLastStepRef.current < WHEEL_COOLDOWN_MS) return;

      const dir = wheelAccRef.current > 0 ? 1 : -1;
      wheelAccRef.current = 0;
      wheelLastStepRef.current = now;
      latestRef.current.onSelectIndex(latestRef.current.safeActive + dir);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      select(safeActive - 1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      select(safeActive + 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    touchStartYRef.current = touch ? touch.clientY : null;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const startY = touchStartYRef.current;
    touchStartYRef.current = null;
    const touch = e.changedTouches[0];
    if (startY === null || !touch) return;
    const dy = touch.clientY - startY;
    if (Math.abs(dy) < SWIPE_THRESHOLD_PX) return;
    select(safeActive + (dy < 0 ? 1 : -1));
  };

  if (count === 0) return null;

  const activeItem = items[safeActive] as CareDialItem;

  const card = (
    <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full shrink-0 overflow-hidden md:aspect-[4/5] md:w-[230px] xl:w-[275px] rounded-[1.85rem] border border-white/90 bg-[#00344b] shadow-[0_24px_60px_-28px_rgba(3,53,75,0.55)]">
      <Image
        key={activeItem.id}
        src={activeItem.image}
        alt={activeItem.label}
        fill
        sizes="(min-width: 1280px) 275px, 230px"
        className="object-cover transition-opacity duration-500"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#00344b]/25 via-transparent to-[#00344b]/55" />
      <span className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1C4A5C] backdrop-blur-md">
        {accentLabel}
      </span>
      <span className="absolute right-3 top-3 rounded-full bg-white/85 px-3 py-1 font-sans text-[11px] font-semibold tabular-nums tracking-[0.08em] text-[#1C4A5C] backdrop-blur-md">
        {pad2(safeActive + 1)} / {pad2(count)}
      </span>
      <Link
        href={activeItem.href}
        className="group absolute inset-x-3 bottom-3 flex items-end justify-between gap-3 rounded-[1.25rem] border border-white/40 bg-white/20 px-4 py-3 text-white backdrop-blur-xl transition-colors hover:bg-white/30"
      >
        <span className="min-w-0">
          <span className="block font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-white/80">
            {activeItem.category}
          </span>
          <span className="mt-0.5 block truncate font-serif text-[19px] font-semibold leading-tight">
            {activeItem.label}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1 font-sans text-[13px] font-semibold">
          Scopri
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </div>
  );

  const dial = (
    <div
      ref={dialZoneRef}
      data-lenis-prevent
      className="relative flex min-w-0 flex-1 items-center outline-none"
      tabIndex={0}
      role="listbox"
      aria-label="Selettore trattamenti"
      aria-activedescendant={`care-dial-${activeItem.id}`}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <BezelSpine safeActive={safeActive} latestRef={latestRef} />

      <div className="relative h-[370px] sm:h-[420px] min-w-0 flex-1">
        <div className="relative h-full w-full [mask-image:linear-gradient(to_bottom,transparent_0%,black_14%,black_86%,transparent_100%)]">
          <AnimatePresence initial={false}>
            {VISIBLE_OFFSETS.map((offset) => {
              const idx = wrapIndex(safeActive + offset, count);
              const item = items[idx] as CareDialItem;
              const isActive = offset === 0;
              const abs = Math.abs(offset);
              const y = offset * 54;
              const x = Math.round(Math.cos((offset / 3.5) * (Math.PI / 2)) * 22);
              const scale = isActive ? 1 : Math.max(0.84, 1 - abs * 0.05);
              const opacity = isActive ? 1 : abs === 1 ? 0.74 : abs === 2 ? 0.45 : 0.2;

              return (
                <motion.div
                  key={count >= VISIBLE_OFFSETS.length ? item.id : `${item.id}-${offset}`}
                  id={isActive ? `care-dial-${item.id}` : undefined}
                  role="option"
                  aria-selected={isActive}
                  initial={{ opacity: 0, scale: 0.82, x, y }}
                  animate={{ opacity, scale, x, y }}
                  exit={{ opacity: 0, scale: 0.82 }}
                  transition={reduceMotion ? { duration: 0 } : ROW_SPRING}
                  style={{ zIndex: 10 - abs }}
                  className="absolute left-0 right-9 top-1/2 -translate-y-1/2 flex origin-left items-center gap-3 will-change-transform sm:gap-3.5"
                >
                  <span
                    className={`relative h-10 w-10 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-[12px] bg-teal-100 ${
                      isActive ? "ring-2 ring-[#1C4A5C]/30 shadow-[0_12px_26px_-10px_rgba(3,53,75,0.45)]" : ""
                    }`}
                  >
                    <Image src={item.image} alt={item.label} width={64} height={64} className="h-full w-full object-cover" />
                  </span>

                  {isActive ? (
                    <Link
                      href={item.href}
                      className="group flex min-w-0 items-center gap-2 focus-visible:outline-none"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-serif text-[20px] sm:text-[23px] xl:text-[24px] font-semibold leading-tight tracking-[-0.02em] text-[#00344B]">
                          {item.label}
                        </span>
                        {item.subtitle ? (
                          <span className="block truncate font-sans text-[12px] sm:text-[13px] text-[#3D3D3C]/75">
                            {item.subtitle}
                          </span>
                        ) : null}
                      </span>
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#1C4A5C]/25 bg-[#1C4A5C]/10 text-[#1C4A5C] transition-colors duration-200 group-hover:bg-[#1C4A5C] group-hover:text-white">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => select(safeActive + offset)}
                      className="min-w-0 truncate text-left font-sans text-[15px] sm:text-[17px] font-medium tracking-[-0.015em] text-[#00344B]/80 transition-colors hover:text-[#00344B]"
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
          aria-label="Voce precedente"
          onClick={() => select(safeActive - 1)}
          className="absolute top-2 right-1 flex h-9 w-9 items-center justify-center rounded-full border border-[#80A1B2]/50 bg-white text-[#1C4A5C] shadow-sm transition-colors hover:bg-[#1C4A5C] hover:text-white"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Voce successiva"
          onClick={() => select(safeActive + 1)}
          className="absolute bottom-2 right-1 flex h-9 w-9 items-center justify-center rounded-full border border-[#80A1B2]/50 bg-white text-[#1C4A5C] shadow-sm transition-colors hover:bg-[#1C4A5C] hover:text-white"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div
      className={`flex w-full flex-col gap-6 md:items-center lg:gap-7 ${
        align === "left" ? "md:flex-row-reverse" : "md:flex-row"
      }`}
    >
      {dial}
      {card}
    </div>
  );
}

export default CareDial;