"use client";

import { motion, useReducedMotion } from "motion/react";
import type * as React from "react";

export function NodeLabel({
  children,
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const toneClasses = tone === "light" ? "text-teal-800" : "text-teal-200";

  return (
    <span
      className={`inline-flex items-center gap-3 ${toneClasses} ${className ?? ""}`}
    >
      <span
        className="relative inline-flex h-1.5 w-1.5 shrink-0 items-center justify-center"
        aria-hidden="true"
      >
        {shouldReduceMotion ? (
          <span className="absolute inset-0 rounded-full border border-current opacity-50" />
        ) : (
          <motion.span
            className="absolute inset-0 rounded-full border border-current"
            animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
            transition={{
              duration: 2.6,
              ease: "easeOut",
              repeat: Infinity,
              repeatDelay: 0,
            }}
          />
        )}
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      <span className="text-xs font-semibold uppercase tracking-[0.24em]">
        {children}
      </span>
    </span>
  );
}