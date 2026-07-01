"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789<>/*+-#";

/**
 * Decode/scramble text reveal — glyphs churn through random mono characters
 * and resolve left-to-right as the element enters the viewport. Built for the
 * uppercase-mono eyebrow labels (fixed-width glyphs = zero layout shift; the
 * big proportional display titles would wiggle mid-animation).
 *
 * Progressive enhancement: renders the real text on the server / with no JS /
 * under reduced motion, and only churns once, on first view. Screen readers
 * always get the real text via aria-label.
 */
export function Scramble({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;

    let interval: ReturnType<typeof setInterval> | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const DURATION = 700;
        interval = setInterval(() => {
          const p = Math.min(1, (performance.now() - start) / DURATION);
          if (p >= 1) {
            clearInterval(interval);
            setDisplay(text);
            return;
          }
          const resolved = Math.floor(p * text.length);
          setDisplay(
            text
              .split("")
              .map((ch, i) =>
                i < resolved || ch === " " || ch === "·"
                  ? ch
                  : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
              )
              .join(""),
          );
        }, 40);
      },
      { threshold: 0.5 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      clearInterval(interval);
    };
  }, [text]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden>{display}</span>
    </span>
  );
}
