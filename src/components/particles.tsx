"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient light particles — tiny sage motes drifting gently upward and
 * twinkling. A cheap 2D-canvas field (no WebGL) that gives mobile the sense of
 * life the desktop gets from the 3D scene.
 *
 * Mobile/tablet only (hidden and never animated on ≥lg, where the WebGL
 * backdrop + hero object lead) and skipped under reduced motion.
 *
 * Motion is deliberately deterministic — a constant slow rise plus a per-mote
 * sine sway — so there's no random per-frame jitter. No allocations or layout
 * reads happen in the animation loop.
 */
export function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(min-width: 1024px)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    type P = {
      baseX: number;
      y: number;
      vy: number; // constant upward speed
      r: number;
      a: number;
      tw: number; // twinkle rate
      phase: number; // sway phase offset
      sway: number; // sway amplitude
    };

    let parts: P[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let t = 0;

    const seed = () => {
      const count = Math.max(24, Math.min(44, Math.round((w * h) / 26000)));
      parts = Array.from({ length: count }, () => ({
        baseX: Math.random() * w,
        y: Math.random() * h,
        vy: rand(0.12, 0.3),
        r: rand(0.7, 1.9),
        a: rand(0.2, 0.6),
        tw: rand(0.006, 0.018),
        phase: rand(0, Math.PI * 2),
        sway: rand(5, 16),
      }));
    };

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const tick = () => {
      t += 1;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y -= p.vy;
        if (p.y < -6) {
          p.y = h + 6;
          p.baseX = Math.random() * w;
        }
        const x = p.baseX + Math.sin(t * 0.006 + p.phase) * p.sway;
        const twinkle = 0.55 + 0.45 * Math.sin(t * p.tw);
        ctx.beginPath();
        ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124, 200, 162, ${p.a * twinkle})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full lg:hidden"
    />
  );
}
