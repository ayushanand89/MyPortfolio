"use client";

import { useEffect, useRef, useState } from "react";
import { tween } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const NUM_RE = /^(\D*)([\d,]+(?:\.\d+)?)(.*)$/;

/**
 * Counts the leading number of a stat string (e.g. "2,000+", "~20%",
 * "2 sides") up from zero the first time it scrolls into view, keeping any
 * prefix/suffix. Non-numeric values ("RLS") render as-is. SSR/no-JS/reduced
 * motion render the final value.
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
  const [text, setText] = useState(value);

  useEffect(() => {
    const el = ref.current;
    const m = value.match(NUM_RE);
    if (reduce || !el || !m) return;
    const [, prefix, numStr, suffix] = m;
    const target = parseFloat(numStr.replace(/,/g, ""));
    const hasComma = numStr.includes(",");
    const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
    const format = (v: number) => {
      const fixed = v.toFixed(decimals);
      return `${prefix}${hasComma ? Number(fixed).toLocaleString("en-US") : fixed}${suffix}`;
    };

    // Already on screen at mount: leave the final value alone.
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    // Below the fold: start from zero so the count is seen.
    setText(format(0));

    let cancel = () => {};
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        cancel = tween(1400, (t) => setText(format(target * t)));
      },
      { rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancel();
    };
  }, [reduce, value]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
