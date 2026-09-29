"use client";

import { useEffect, useRef } from "react";
import { scroll } from "@/lib/motion";

/**
 * A 2px signal line across the top of a case study that fills as you read.
 * Written straight to the transform on the shared scroll listener - no
 * re-renders, compositor-only.
 */
export function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const paint = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, scroll.y / max)) : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${p.toFixed(4)})`;
    };
    paint();
    return scroll.subscribe(paint);
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-signal"
      style={{ transform: "scaleX(0)" }}
    />
  );
}
