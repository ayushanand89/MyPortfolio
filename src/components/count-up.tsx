"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const NUM_RE = /^(\D*)([\d,]+(?:\.\d+)?)(.*)$/;

/**
 * Animates the leading number of a stat string (e.g. "2,000+", "~20%",
 * "2 sides") up from zero when scrolled into view, preserving any prefix/suffix.
 * Non-numeric values ("RLS") render as-is. SSR/no-JS renders the final value.
 */
export function CountUp({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [text, setText] = useState(value);

  // Reset to zero on mount so the count-up is visible (stats are below the fold).
  useEffect(() => {
    if (reduce) return;
    const m = value.match(NUM_RE);
    if (!m) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setText(`${m[1]}0${m[3]}`);
  }, [reduce, value]);

  useEffect(() => {
    if (reduce || !inView) return;
    const m = value.match(NUM_RE);
    if (!m) return;
    const [, prefix, numStr, suffix] = m;
    const target = parseFloat(numStr.replace(/,/g, ""));
    const hasComma = numStr.includes(",");
    const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;

    const controls = animate(0, target, {
      duration: 1.3,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        const fixed = v.toFixed(decimals);
        const formatted = hasComma
          ? Number(fixed).toLocaleString("en-US")
          : fixed;
        setText(`${prefix}${formatted}${suffix}`);
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
