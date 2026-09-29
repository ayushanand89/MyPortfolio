"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

// Archivo's variable axes: display type rests at the widest, heaviest cut;
// under the lens it pinches toward the condensed, light end.
const REST = { wdth: 125, wght: 850 };
const PINCH = { wdth: 62, wght: 260 };

/**
 * A variable-font lens over a word: letters near the pointer (or a finger
 * sliding across) condense and thin out, falling off smoothly with distance,
 * then ease back when it leaves. One rAF loop that runs only while something
 * is moving; each frame writes `font-variation-settings` per letter.
 */
export function LetterLens({
  text,
  accent,
  className,
}: {
  text: string;
  /** Trailing characters set in the signal colour (e.g. the full stop). */
  accent?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const chars = [...text];
  const tail = accent ? [...accent] : [];

  useEffect(() => {
    const root = ref.current;
    if (!root || reduce) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-ch]"));
    const cur = els.map(() => 0);
    let centres: number[] = [];
    let radius = 1;
    let px: number | null = null;
    let raf = 0;

    const measure = () => {
      const box = root.getBoundingClientRect();
      radius = Math.max(120, box.width * 0.16);
      centres = els.map((el) => {
        const r = el.getBoundingClientRect();
        return r.left + r.width / 2;
      });
    };

    const tick = () => {
      raf = 0;
      let moving = false;
      els.forEach((el, i) => {
        let target = 0;
        if (px !== null) {
          const f = Math.max(0, 1 - Math.abs(px - centres[i]) / radius);
          target = f * f * (3 - 2 * f);
        }
        const next = cur[i] + (target - cur[i]) * 0.16;
        if (Math.abs(target - next) > 0.002) moving = true;
        cur[i] = Math.abs(target - next) > 0.002 ? next : target;
        const v = cur[i];
        el.style.fontVariationSettings = v
          ? `"wdth" ${(REST.wdth + (PINCH.wdth - REST.wdth) * v).toFixed(1)}, "wght" ${(REST.wght + (PINCH.wght - REST.wght) * v).toFixed(0)}`
          : "";
      });
      if (moving || px !== null) raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onEnter = () => measure();
    const onMove = (e: PointerEvent) => {
      if (px === null) measure();
      px = e.clientX;
      wake();
    };
    const onLeave = () => {
      px = null;
      wake();
    };
    // A finger lifting doesn't fire pointerleave on every engine.
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") onLeave();
    };

    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("pointercancel", onLeave);
    root.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("pointercancel", onLeave);
      root.removeEventListener("pointerup", onUp);
      els.forEach((el) => (el.style.fontVariationSettings = ""));
    };
  }, [reduce]);

  let c = 0;
  return (
    <span ref={ref} className={className} style={{ touchAction: "pan-y" }}>
      {chars.map((ch, i) => (
        <span key={i} data-ch className="lens-ch" style={{ "--c": c++ } as CSSProperties}>
          {ch === " " ? " " : ch}
        </span>
      ))}
      {tail.map((ch, i) => (
        <span
          key={`a${i}`}
          data-ch
          className="lens-ch text-signal"
          style={{ "--c": c++ } as CSSProperties}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}
