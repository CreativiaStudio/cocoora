"use client";

import { useRef } from "react";
import type * as React from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

export type PathStep = {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
};

type Tone = "light" | "dark";

type StepNodeProps = {
  index: number;
  total: number;
  progress: MotionValue<number>;
  tone: Tone;
};

function StepNode({ index, total, progress, tone }: StepNodeProps) {
  const isReducedMotion = useReducedMotion();
  const threshold = total <= 1 ? 0 : index / (total - 1);
  const minT = Math.max(0, threshold - 0.05);
  const maxT = Math.min(1, threshold + 0.05);

  const scale = useTransform(progress, [minT, maxT], [0.85, 1.15], { clamp: true });
  const opacity = useTransform(progress, [minT, maxT], [0, 1], { clamp: true });
  const label = String(index + 1).padStart(2, "0");

  const ringBase =
    tone === "dark"
      ? "border-white/20 bg-dark-navy"
      : "border-teal-200 bg-white";
  const ringActive =
    tone === "dark"
      ? "border-slate-accent ring-4 ring-slate-accent/20"
      : "border-primary-teal ring-4 ring-primary-teal/15";
  const dotBase = tone === "dark" ? "bg-white/30" : "bg-teal-200";
  const dotActive = tone === "dark" ? "bg-slate-accent" : "bg-primary-teal";

  return (
    <div className="relative flex flex-col items-center">
      <span
        className={`mb-2 font-serif text-sm font-semibold transition-colors duration-300 ${
          tone === "dark" ? "text-teal-200" : "text-primary-teal"
        }`}
      >
        {label}
      </span>
      <motion.div
        className={`relative flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-300 ${
          isReducedMotion ? ringActive : ringBase
        }`}
        style={isReducedMotion ? undefined : { scale }}
      >
        <span
          className={`h-2 w-2 rounded-full transition-colors duration-300 ${
            isReducedMotion ? dotActive : dotBase
          }`}
        />
        {!isReducedMotion && (
          <motion.span
            aria-hidden="true"
            className={`absolute inset-0 rounded-full border-2 ${ringActive}`}
            style={{ opacity }}
          />
        )}
      </motion.div>
    </div>
  );
}

export function ConnectedPath({
  steps,
  tone = "light",
  className = "",
}: {
  steps: PathStep[];
  tone?: Tone;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 55%"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
  });

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Desktop Track (lg+) */}
      <div className="hidden lg:block relative mb-8">
        {/* SVG connecting line */}
        <div className="absolute top-[38px] left-[10%] right-[10%] h-0.5 -z-0">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 100 2"
            preserveAspectRatio="none"
          >
            {/* Background line */}
            <line
              x1="0"
              y1="1"
              x2="100"
              y2="1"
              stroke={tone === "dark" ? "rgba(255,255,255,0.15)" : "#c5dbe3"}
              strokeWidth="2"
              strokeDasharray="4 6"
              vectorEffect="non-scaling-stroke"
            />
            {/* Active animated line */}
            <motion.line
              x1="0"
              y1="1"
              x2="100"
              y2="1"
              stroke={tone === "dark" ? "#80a1b2" : "#1c4a5c"}
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: isReducedMotion ? 1 : progress }}
            />
          </svg>
        </div>

        {/* Nodes Grid */}
        <div
          className="grid gap-6 items-start"
          style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
        >
          {steps.map((_, i) => (
            <div key={i} className="flex justify-center">
              <StepNode
                index={i}
                total={steps.length}
                progress={progress}
                tone={tone}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div
              key={i}
              className={`relative overflow-hidden rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                tone === "dark"
                  ? "bg-white/[0.04] border-white/10 text-white hover:border-white/20"
                  : "bg-white/80 border-teal-100/80 text-charcoal backdrop-blur-md hover:border-teal-300"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <span
                  className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                    tone === "dark" ? "text-slate-accent" : "text-primary-teal"
                  }`}
                >
                  Step {String(i + 1).padStart(2, "0")}
                </span>
                {Icon && (
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                      tone === "dark"
                        ? "bg-white/10 text-teal-200"
                        : "bg-teal-50 text-primary-teal"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                )}
              </div>
              <h3
                className={`font-serif text-2xl font-semibold mb-3 ${
                  tone === "dark" ? "text-white" : "text-teal-900"
                }`}
              >
                {step.title}
              </h3>
              <p
                className={`text-sm leading-relaxed ${
                  tone === "dark" ? "text-teal-100/75" : "text-charcoal/75"
                }`}
              >
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
