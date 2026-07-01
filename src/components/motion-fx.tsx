"use client";

import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Pulls its child toward the cursor on hover. */
export function Magnetic({
  children,
  strength = 0.35,
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
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.3 });
  // Full transform string keeps this GPU-composited (Framer's x/y shorthands
  // run on the main thread and drop frames under load).
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

/** Subtle pointer-driven 3D tilt. */
export function Tilt({
  children,
  className,
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 15 });
  const sry = useSpring(ry, { stiffness: 150, damping: 15 });
  const transform = useMotionTemplate`perspective(1000px) rotateX(${srx}deg) rotateY(${sry}deg)`;

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rx.set(-py * max);
    ry.set(px * max);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ transform, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Drifts its child vertically as it scrolls through the viewport, with an
 * optional cinematic zoom that eases back to 1 as the element centers.
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
  // On phones the drift is scaled down (read live from a ref each frame) so a
  // stacked, full-width image never rides over its neighbours' spacing.
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
 * Layered-depth parallax: an oversized, very faint ghost word pinned behind a
 * section that drifts opposite the scroll, so it slides past the foreground at a
 * different speed — the depth cue that defines "parallax scrolling". Purely
 * decorative (aria-hidden, non-interactive) and removed entirely under reduced
 * motion. Full transform string keeps it GPU-composited.
 *
 * Drop in as the first child of a `relative isolate` section.
 */
export function ParallaxWatermark({
  text,
  align = "left",
  speed = 130,
  className,
}: {
  text: string;
  align?: "left" | "right" | "center";
  speed?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  // Compose x-centering (for `center`) and the parallax drift into one string so
  // it doesn't fight a Tailwind transform utility.
  const tx = align === "center" ? "-50%" : "0px";
  const transform = useMotionTemplate`translate3d(${tx}, calc(-50% + ${y}px), 0)`;

  if (reduce) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 select-none overflow-hidden"
    >
      <motion.span
        style={{ transform }}
        className={cn(
          "display absolute top-1/2 whitespace-nowrap font-extrabold uppercase leading-none tracking-tighter text-white/[0.035] text-[22vw] sm:text-[16vw]",
          align === "left" && "left-[-0.06em]",
          align === "right" && "right-[-0.06em]",
          align === "center" && "left-1/2",
          className,
        )}
      >
        {text}
      </motion.span>
    </div>
  );
}
