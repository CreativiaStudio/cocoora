"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "motion/react";

export function SpotlightCard({
  children,
  className,
  tilt = true,
  glow = "rgba(128, 161, 178, 0.25)",
}: {
  children: React.ReactNode;
  className?: string;
  tilt?: boolean;
  glow?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tiltEnabled, setTiltEnabled] = useState(false);

  // Pointer position relative to the card surface
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Target tilt angles (degrees)
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // Smooth spring return
  const springRotateX = useSpring(rotateX, { stiffness: 180, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 180, damping: 20 });

  // Disable tilt on touch devices or when reduced motion is preferred
  useEffect(() => {
    if (!tilt) {
      setTiltEnabled(false);
      return;
    }

    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setTiltEnabled(!coarsePointer.matches && !reducedMotion.matches);
    };

    update();
    coarsePointer.addEventListener("change", update);
    reducedMotion.addEventListener("change", update);

    return () => {
      coarsePointer.removeEventListener("change", update);
      reducedMotion.removeEventListener("change", update);
    };
  }, [tilt]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    mouseX.set(x);
    mouseY.set(y);

    if (tiltEnabled) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const percentX = (x - centerX) / centerX; // -1 .. 1
      const percentY = (y - centerY) / centerY; // -1 .. 1

      rotateX.set(-percentY * 4.5);
      rotateY.set(percentX * 4.5);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);

    if (tiltEnabled) {
      rotateX.set(0);
      rotateY.set(0);
    }
  };

  const spotlightBackground = useMotionTemplate`radial-gradient(380px circle at ${mouseX}px ${mouseY}px, ${glow}, transparent 80%)`;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className ?? ""}`}
      style={
        tiltEnabled
          ? {
              rotateX: springRotateX,
              rotateY: springRotateY,
              transformPerspective: 1000,
            }
          : undefined
      }
    >
      <motion.div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ease-out ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        style={{ background: spotlightBackground }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}