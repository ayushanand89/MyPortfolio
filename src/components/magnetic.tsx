"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { m, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const spring = { stiffness: 240, damping: 16, mass: 0.5 };

/**
 * Magnetic hover for primary actions: on a mouse, the button leans toward
 * the cursor (a fraction of the offset from its centre) and springs home on
 * leave. Touch, pen and reduced motion get a plain button. The rest centre is
 * measured on enter, so the lean never feeds back into itself.
 */
export function Magnetic({
  children,
  strength = 0.3,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const centre = useRef<{ x: number; y: number } | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  const onEnter = (e: PointerEvent<HTMLSpanElement>) => {
    if (e.pointerType !== "mouse" || reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    centre.current = {
      x: r.left + r.width / 2 - x.get(),
      y: r.top + r.height / 2 - y.get(),
    };
  };
  const onMove = (e: PointerEvent<HTMLSpanElement>) => {
    const c = centre.current;
    if (!c) return;
    x.set((e.clientX - c.x) * strength);
    y.set((e.clientY - c.y) * strength);
  };
  const onLeave = () => {
    centre.current = null;
    x.set(0);
    y.set(0);
  };

  return (
    <m.span
      style={{ x: sx, y: sy }}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn("inline-flex", className)}
    >
      {children}
    </m.span>
  );
}
