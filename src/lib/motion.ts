"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * A tiny scroll engine - the whole site's scroll-linked motion runs on ONE
 * passive `scroll` listener. Browsers dispatch scroll events once per frame
 * (right before rAF), so subscribers update in the same frame the page moved:
 * no extra rAF hop, no lag. Works with Lenis (it drives native window scroll).
 *
 * Geometry is cached: elements are measured on mount, on resize and when the
 * document's height changes - never inside the per-frame path.
 */

type Sub = () => void;
const subs = new Set<Sub>();
const measurers = new Set<() => void>();
let attached = false;
let y = 0;
let velocity = 0;
let lastT = 0;

function onScroll() {
  const now = performance.now();
  const ny = window.scrollY;
  const dt = Math.max(1, now - lastT);
  velocity = ((ny - y) / dt) * 1000; // px/s
  y = ny;
  lastT = now;
  subs.forEach((fn) => fn());
}

function remeasure() {
  measurers.forEach((fn) => fn());
  onScroll();
}

function attach() {
  if (attached || typeof window === "undefined") return;
  attached = true;
  y = window.scrollY;
  lastT = performance.now();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", remeasure);
  // Layout above an element can change without a resize (fonts, images).
  new ResizeObserver(remeasure).observe(document.body);
}

export const scroll = {
  get y() {
    return y;
  },
  /** Scroll velocity in px/s - decays to 0 once scrolling stops. */
  get velocity() {
    return performance.now() - lastT > 120 ? 0 : velocity;
  },
  subscribe(fn: Sub) {
    attach();
    subs.add(fn);
    return () => {
      subs.delete(fn);
    };
  },
};

/** `[elementFraction, viewportFraction]` - "this point of the element meets
 *  this line of the viewport" (0 = top, 1 = bottom), like framer's offsets. */
export type Edge = [number, number];

/**
 * Calls `onProgress(0…1)` as the element travels between two edges, e.g.
 * `[[0, 1], [1, 0]]` = from its top touching the viewport bottom until its
 * bottom leaves the top. Measure NON-sticky nodes only (a pinned element's
 * position doesn't move). Under reduced motion it reports 1 once and stops.
 */
export function useScrollProgress<T extends HTMLElement>(
  ref: RefObject<T | null>,
  [from, to]: [Edge, Edge],
  onProgress: (p: number) => void,
) {
  const reduce = useReducedMotion();
  const cb = useRef(onProgress);
  useEffect(() => {
    cb.current = onProgress;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      cb.current(1);
      return;
    }
    let y0 = 0;
    let y1 = 1;
    let last = -1;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const top = r.top + window.scrollY;
      const vh = window.innerHeight;
      y0 = top + from[0] * r.height - from[1] * vh;
      y1 = top + to[0] * r.height - to[1] * vh;
    };
    const update = () => {
      const p = Math.min(1, Math.max(0, (scroll.y - y0) / (y1 - y0 || 1)));
      if (Math.abs(p - last) < 0.0005) return;
      last = p;
      cb.current(p);
    };
    measure();
    measurers.add(measure);
    const off = scroll.subscribe(update);
    update();
    return () => {
      off();
      measurers.delete(measure);
    };
    // Offsets are literal tuples at call sites; stringify to keep deps stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, reduce, JSON.stringify([from, to])]);
}

/** Eased 0→1 tween on rAF. Returns a cancel function. */
export function tween(
  duration: number,
  onUpdate: (t: number) => void,
  ease: (t: number) => number = (t) => 1 - Math.pow(2, -10 * t),
) {
  const start = performance.now();
  let raf = requestAnimationFrame(function step(now) {
    const t = Math.min(1, (now - start) / duration);
    onUpdate(t >= 1 ? 1 : ease(t));
    if (t < 1) raf = requestAnimationFrame(step);
  });
  return () => cancelAnimationFrame(raf);
}
