"use client";

import { Fragment } from "react";

const MASK_IMAGE =
  "linear-gradient(to right, transparent, black 10%, black 90%, transparent)";

export function NodeMarquee({
  items,
  speed = 35,
  className,
  tone = "light",
}: {
  items: string[];
  speed?: number;
  className?: string;
  tone?: "light" | "dark";
}) {
  if (items.length === 0) return null;

  const duration = Math.max(1, speed);
  const color = tone === "dark" ? "#C5DBE3" : "#1C4A5C";

  const rootClassName = [
    "node-marquee relative overflow-hidden",
    "text-[13px] font-medium uppercase tracking-[0.22em]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const renderGroup = (clone: boolean) => (
    <div
      className={["flex items-center", clone ? "node-marquee-clone" : ""]
        .filter(Boolean)
        .join(" ")}
      aria-hidden={clone ? "true" : undefined}
    >
      {items.map((item, index) => (
        <Fragment key={`${clone ? "clone" : "original"}-${index}`}>
          <span className="whitespace-nowrap">{item}</span>
          <span
            aria-hidden="true"
            className="mx-6 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-slate-accent/40"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-slate-accent" />
          </span>
        </Fragment>
      ))}
    </div>
  );

  return (
    <div
      className={rootClassName}
      style={{
        color,
        maskImage: MASK_IMAGE,
        WebkitMaskImage: MASK_IMAGE,
      }}
    >
      <style>{`
        @keyframes node-marquee-scroll {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }

        .node-marquee:hover .node-marquee-track {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .node-marquee {
            overflow-x: auto !important;
            overflow-y: hidden !important;
            mask-image: none !important;
            -webkit-mask-image: none !important;
          }

          .node-marquee-track {
            animation: none !important;
            transform: none !important;
          }

          .node-marquee-clone {
            display: none !important;
          }
        }
      `}</style>

      <div
        className="node-marquee-track flex w-max items-center will-change-transform"
        style={{
          animation: `node-marquee-scroll ${duration}s linear infinite`,
        }}
      >
        {renderGroup(false)}
        {renderGroup(true)}
      </div>
    </div>
  );
}