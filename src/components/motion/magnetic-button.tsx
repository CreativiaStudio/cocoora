"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

export interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "light" | "glass";
  strength?: number;
  className?: string;
}

const SPRING = { stiffness: 240, damping: 18, mass: 0.45 };
const OUTER_RANGE = 12;
const INNER_RANGE = 5;

const VARIANT_CLASSES: Record<NonNullable<MagneticButtonProps["variant"]>, string> = {
  primary:
    "bg-primary-teal text-white border border-teal-500/40 shadow-[0_18px_40px_-14px_rgba(0,52,75,0.45)] hover:bg-dark-navy",
  light:
    "bg-white text-dark-navy border border-teal-100 shadow-[0_18px_40px_-16px_rgba(0,52,75,0.22)] hover:border-teal-300",
  glass:
    "bg-white/10 text-white border border-white/25 backdrop-blur-md hover:bg-white/20",
};

const BASE_CLASSES =
  "relative isolate overflow-hidden rounded-full px-7 py-3.5 text-sm font-medium tracking-wide inline-flex items-center gap-2.5 font-sans transition-colors duration-300 select-none";

export function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  strength = 1,
  className = "",
}: MagneticButtonProps) {
  const reduceMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Coordinate normalizzate del cursore in [-1, 1]
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);

  // Coordinate in pixel per il riflesso speculare
  const hx = useMotionValue(0);
  const hy = useMotionValue(0);

  // Contenitore esterno: ±12px
  const outerX = useSpring(
    useTransform(nx, (v) => v * OUTER_RANGE * strength),
    SPRING,
  );
  const outerY = useSpring(
    useTransform(ny, (v) => v * OUTER_RANGE * strength),
    SPRING,
  );

  // Contenuto interno: ±5px
  const innerX = useSpring(
    useTransform(nx, (v) => v * INNER_RANGE * strength),
    SPRING,
  );
  const innerY = useSpring(
    useTransform(ny, (v) => v * INNER_RANGE * strength),
    SPRING,
  );

  const specular = useMotionTemplate`radial-gradient(140px circle at ${hx}px ${hy}px, rgba(255,255,255,0.45), rgba(255,255,255,0) 65%)`;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const el = wrapperRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    const normX = Math.max(-1, Math.min(1, (px / rect.width) * 2 - 1));
    const normY = Math.max(-1, Math.min(1, (py / rect.height) * 2 - 1));

    hx.set(px);
    hy.set(py);

    if (!reduceMotion) {
      nx.set(normX);
      ny.set(normY);
    }
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    setHovered(true);
  };

  const handlePointerLeave = () => {
    setHovered(false);
    nx.set(0);
    ny.set(0);
  };

  const variantClasses = VARIANT_CLASSES[variant];
  const buttonClasses = `${BASE_CLASSES} ${variantClasses} ${className}`.trim();

  const content = (
    <>
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background: reduceMotion
            ? "radial-gradient(140px circle at 50% 50%, rgba(255,255,255,0.25), rgba(255,255,255,0) 65%)"
            : specular,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />
      <motion.span
        className="relative z-10 inline-flex items-center gap-2.5"
        style={reduceMotion ? undefined : { x: innerX, y: innerY }}
      >
        {children}
      </motion.span>
    </>
  );

  return (
    <motion.div
      ref={wrapperRef}
      className="relative inline-flex"
      style={reduceMotion ? undefined : { x: outerX, y: outerY }}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {href ? (
        <Link
          href={href}
          className={buttonClasses}
          onClick={() => onClick?.()}
        >
          {content}
        </Link>
      ) : (
        <button
          type="button"
          className={buttonClasses}
          onClick={() => onClick?.()}
        >
          {content}
        </button>
      )}
    </motion.div>
  );
}
