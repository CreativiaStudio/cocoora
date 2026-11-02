"use client";

import { useEffect } from "react";
import type React from "react";
import Lenis from "lenis";

/**
 * Scroll fluido Lenis con loop requestAnimationFrame dedicato.
 * Il loop viene cancellato in cleanup, in pausa quando la tab è nascosta
 * e non viene mai istanziato se l'utente preferisce movimento ridotto.
 */
const LENIS_OPTIONS = {
  lerp: 0.085,
  wheelMultiplier: 0.9,
  smoothWheel: true,
  syncTouch: false,
  autoRaf: false,
} as const;

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let teardown: (() => void) | null = null;

    const enable = () => {
      if (teardown || mediaQuery.matches) return;

      const lenis = new Lenis({ ...LENIS_OPTIONS });

      let frameId: number | null = null;

      const loop = (time: number) => {
        lenis.raf(time);
        frameId = requestAnimationFrame(loop);
      };

      const resume = () => {
        if (frameId !== null || document.hidden) return;
        frameId = requestAnimationFrame(loop);
      };

      const pause = () => {
        if (frameId === null) return;
        cancelAnimationFrame(frameId);
        frameId = null;
      };

      const handleVisibilityChange = () => {
        if (document.hidden) {
          pause();
        } else {
          resume();
        }
      };

      resume();
      document.addEventListener("visibilitychange", handleVisibilityChange);

      teardown = () => {
        pause();
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
        lenis.destroy();
      };
    };

    const disable = () => {
      teardown?.();
      teardown = null;
    };

    const handlePreferenceChange = () => {
      if (mediaQuery.matches) {
        disable();
      } else {
        enable();
      }
    };

    enable();
    mediaQuery.addEventListener("change", handlePreferenceChange);

    return () => {
      mediaQuery.removeEventListener("change", handlePreferenceChange);
      disable();
    };
  }, []);

  return <>{children}</>;
}
