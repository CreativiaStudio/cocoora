"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { CENTER_NODE, ORBIT_SLOTS, LEGS } from "./pictogram";

function OrbitFallback() {
  return (
    <svg
      viewBox="-1.55 -1.55 3.1 3.1"
      className="h-full w-full"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx={0}
        cy={0}
        r={1.0}
        fill="none"
        stroke="#80a1b2"
        strokeOpacity={0.35}
        strokeWidth={0.015}
        strokeDasharray="0.05 0.07"
      />
      {LEGS.map((leg, index) => (
        <line
          key={`leg-${index}`}
          x1={0}
          y1={0}
          x2={leg.to[0]}
          y2={-leg.to[1]}
          stroke="#80a1b2"
          strokeWidth={leg.thickness}
          strokeLinecap="round"
        />
      ))}
      <circle cx={0} cy={0} r={CENTER_NODE.radius} fill="#e2edf1" />
      {ORBIT_SLOTS.map((slot, index) => (
        <circle
          key={`slot-${index}`}
          cx={slot.center[0]}
          cy={-slot.center[1]}
          r={slot.radius}
          fill={slot.connected ? "#e2edf1" : "#80a1b2"}
        />
      ))}
    </svg>
  );
}

const CocooraOrbit3D = dynamic(() => import("./cocoora-orbit-3d"), {
  ssr: false,
  loading: () => <OrbitFallback />,
});

export function CocooraOrbit({ className, interactive = true }: { className?: string; interactive?: boolean }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;

    let supported = false;
    try {
      const canvas = document.createElement("canvas");
      const context =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      supported = Boolean(context);
    } catch {
      supported = false;
    }
    setHasWebGL(supported);
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
            return;
          }
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const enable3D = isVisible && hasWebGL && !shouldReduceMotion;

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full ${className ?? ""}`}
    >
      {enable3D ? (
        <CocooraOrbit3D interactive={interactive} />
      ) : (
        <OrbitFallback />
      )}
    </div>
  );
}
