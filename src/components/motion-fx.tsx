"use client";

/**
 * framer-motion helpers kept for the DORMANT components only (SecondaryCard,
 * ScrollVelocity, Magnetic). Live pages use the dependency-free scroll engine
 * in `src/lib/motion.ts`, which keeps framer out of the shipped bundle.
 */
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useScroll,
  useVelocity,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/** Pulls its child toward the cursor on hover (primary CTAs only). */
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
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.35 });
  const transform = useMotionTemplate`translate3d(${sx}px, ${sy}px, 0)`;

  if (reduce) {
    return <span className={className}>{children}</span>;
  }

  const handleMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ transform, display: "inline-block" }}
      className={className}
    >
      {children}
    </motion.span>
  );
}

/**
 * Drifts its child vertically as it scrolls through the viewport, with an
 * optional zoom that eases back to 1 as the element centers. (Used by the
 * dormant SecondaryCard.)
 */
export function Parallax({
  children,
  className,
  amount = 24,
  zoom = 0,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  zoom?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const factor = useRef(1);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => {
      factor.current = mq.matches ? 0.45 : 1;
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  const y = useTransform(
    scrollYProgress,
    (v) => amount * (1 - 2 * v) * factor.current,
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1 + zoom, 1 + zoom * 0.35, 1],
  );

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      <motion.div style={zoom ? { y, scale } : { y }}>{children}</motion.div>
    </div>
  );
}

/**
 * Momentum shear: skews its child in proportion to scroll velocity. Kept
 * intentionally (currently unused).
 */
export function ScrollVelocity({
  children,
  className,
  max = 4,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, {
    stiffness: 300,
    damping: 50,
    mass: 0.5,
  });
  const skew = useTransform(smooth, [-2400, 0, 2400], [max, 0, -max], {
    clamp: true,
  });
  const transform = useMotionTemplate`skewY(${skew}deg)`;

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      style={{ transform, willChange: "transform" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
