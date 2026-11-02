"use client";

import { useEffect, useRef } from "react";

type Particle = {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  x: number;
  y: number;
  size: number;
  phase: number;
  speed: number;
};

export function ConstellationCanvas({
  className,
  color = "255, 255, 255",
  density = 1,
}: {
  className?: string;
  color?: string;
  density?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = media.matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let rafId = 0;
    let startTime = performance.now();
    let disposed = false;

    const mouse = { x: -9999, y: -9999, active: false };

    const LINK_DISTANCE = 130;
    const MOUSE_RADIUS = 160;
    const CONVERGE_END = 0.32;
    const INTRO_DURATION = 2.4;

    const easeInOut = (t: number) => {
      const c = Math.min(1, Math.max(0, t));
      return c * c * (3 - 2 * c);
    };

    const buildParticles = () => {
      const area = Math.max(1, width * height);
      const count = Math.max(
        24,
        Math.min(180, Math.round((area / 14000) * Math.max(0.2, density)))
      );

      particles = Array.from({ length: count }, () => {
        const startX = Math.random() * width;
        const startY = Math.random() * height;
        const targetX = Math.random() * width;
        const targetY = Math.random() * height;
        return {
          startX,
          startY,
          targetX,
          targetY,
          x: startX,
          y: startY,
          size: 0.6 + Math.random() * 1.6,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 0.9,
        };
      });
    };

    const drawScene = (points: { x: number; y: number; size: number }[]) => {
      // Connessioni sottili
      ctx.lineWidth = 0.6;
      for (let i = 0; i < points.length; i++) {
        const a = points[i];
        for (let j = i + 1; j < points.length; j++) {
          const b = points[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 0 && dist < LINK_DISTANCE) {
            const alpha = (1 - dist / LINK_DISTANCE) * 0.2;
            if (alpha > 0.004) {
              ctx.strokeStyle = `rgba(${color}, ${alpha.toFixed(3)})`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      // Nodi stellari
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        ctx.fillStyle = `rgba(${color}, 0.85)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      drawScene(
        particles.map((p) => ({ x: p.targetX, y: p.targetY, size: p.size }))
      );
    };

    const render = (now: number) => {
      if (disposed) return;

      const elapsed = (now - startTime) / 1000;
      const introT = Math.min(1, elapsed / INTRO_DURATION);
      const cx = width / 2;
      const cy = height / 2;

      const points: { x: number; y: number; size: number }[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        let px: number;
        let py: number;

        if (introT < CONVERGE_END) {
          // Convergenza verso il centro
          const t = easeInOut(introT / CONVERGE_END);
          px = p.startX + (cx - p.startX) * t;
          py = p.startY + (cy - p.startY) * t;
        } else {
          // Espansione verso la costellazione finale
          const t = easeInOut((introT - CONVERGE_END) / (1 - CONVERGE_END));
          px = cx + (p.targetX - cx) * t;
          py = cy + (p.targetY - cy) * t;
        }

        // Fluttuazione morbida dopo l'intro
        if (introT >= 1) {
          px += Math.sin(elapsed * p.speed + p.phase) * 6;
          py += Math.cos(elapsed * p.speed * 0.8 + p.phase * 1.3) * 6;
        }

        // Attrazione morbida al cursore
        if (mouse.active) {
          const mdx = mouse.x - px;
          const mdy = mouse.y - py;
          const mdist = Math.hypot(mdx, mdy);
          if (mdist > 0.001 && mdist < MOUSE_RADIUS) {
            const strength = (1 - mdist / MOUSE_RADIUS) * 0.16;
            px += mdx * strength;
            py += mdy * strength;
          }
        }

        p.x = px;
        p.y = py;
        points.push({ x: px, y: py, size: p.size });
      }

      ctx.clearRect(0, 0, width, height);
      drawScene(points);

      rafId = requestAnimationFrame(render);
    };

    const applySize = () => {
      const rect = canvas.getBoundingClientRect();
      const nextWidth = rect.width;
      const nextHeight = rect.height;

      if (
        particles.length > 0 &&
        Math.abs(nextWidth - width) < 0.5 &&
        Math.abs(nextHeight - height) < 0.5
      ) {
        return false;
      }

      width = nextWidth;
      height = nextHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();

      return true;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (reduceMotion) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const onPointerLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const onMotionChange = () => {
      reduceMotion = media.matches;
      cancelAnimationFrame(rafId);
      if (reduceMotion) {
        mouse.active = false;
        drawStatic();
      } else {
        startTime = performance.now();
        rafId = requestAnimationFrame(render);
      }
    };

    // Inizializzazione
    applySize();
    startTime = performance.now();

    if (reduceMotion) {
      drawStatic();
    } else {
      rafId = requestAnimationFrame(render);
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    }

    const ro = new ResizeObserver(() => {
      const changed = applySize();
      if (changed) {
        startTime = performance.now();
        if (reduceMotion) {
          drawStatic();
        }
      }
    });
    ro.observe(canvas);

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onMotionChange);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      if (typeof media.removeEventListener === "function") {
        media.removeEventListener("change", onMotionChange);
      }
    };
  }, [color, density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={[
        "pointer-events-none absolute inset-0 h-full w-full",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}