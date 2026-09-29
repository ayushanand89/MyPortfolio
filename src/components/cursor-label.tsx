"use client";

import { useEffect, useRef, useState } from "react";

/**
 * One global cursor label. Anything with `data-cursor="View case"` shows a
 * pill that trails the pointer while hovered. A single passive pointermove
 * listener + a rAF lerp that sleeps as soon as the pill settles — no per-card
 * listeners, no React renders while moving (state only changes when the label
 * text does). Fine pointers only; nothing mounts under reduced motion.
 * Purely decorative: every labelled target is also a real link.
 */
export function CursorLabel() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;

    let x = -200;
    let y = -200;
    let tx = -200;
    let ty = -200;
    let raf = 0;
    let current: string | null = null;

    const tick = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      raf =
        Math.abs(tx - x) + Math.abs(ty - y) > 0.2
          ? requestAnimationFrame(tick)
          : 0;
    };

    const resolve = (target: Element | null) => {
      // Hidden while a page transition runs; `data-cursor=""` on a nested
      // element suppresses an outer label.
      const host = document.documentElement.dataset.vt
        ? null
        : target?.closest?.("[data-cursor]");
      const next = host?.getAttribute("data-cursor") || null;
      if (next === current) return;
      if (!current && next) {
        // First contact: appear at the pointer instead of sliding in.
        x = tx;
        y = ty;
      }
      current = next;
      setLabel(next);
      if (next) setText(next);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      resolve(e.target as Element | null);
      if (!raf) raf = requestAnimationFrame(tick);
    };

    // The page can scroll a new target under a still pointer.
    let scrollQueued = false;
    const onScroll = () => {
      if (scrollQueued || tx < 0) return;
      scrollQueued = true;
      requestAnimationFrame(() => {
        scrollQueued = false;
        resolve(document.elementFromPoint(tx, ty));
      });
    };

    const onLeave = () => resolve(null);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[70]"
      style={{ transform: "translate3d(-200px, -200px, 0)" }}
    >
      <span
        data-on={label ? "" : undefined}
        className="cursor-pill label absolute left-0 top-0 inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-signal px-4 py-2.5 text-ink shadow-[0_12px_40px_-12px_rgba(0,0,0,0.6)]"
      >
        {text}
        <span aria-hidden>→</span>
      </span>
    </div>
  );
}
