"use client";

import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useScroll,
  useVelocity,
  useTransform,
  useReducedMotion,
  type MotionStyle,
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
 * Sticky-stack panel that firms up its card's frosted opacity as it scrolls
 * into the pinned "reading" position and recedes to translucent while it's
 * entering from below. Drives the `--panel-alpha` CSS variable that
 * `.glass-strong` reads, so a card is see-through (3D shows) as it enters, then
 * turns readable exactly when it overlaps the cards stacked above it — no bleed
 * while you're reading it. Static (opaque fallback 88%) under reduced motion.
 */
export function StackPanel({
  children,
  className,
  top,
}: {
  children: ReactNode;
  className?: string;
  top?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    // 0 as the card's top sits at the viewport bottom (entering, translucent);
    // 1 by the time it reaches its pin near the top (reading, opaque).
    offset: ["start end", "start 14%"],
  });
  // Drives the card's opaque-overlay opacity (see ShowcaseCard `panel`).
  // Overlay opacity is compositor-only — no backdrop-blur repaint on scroll.
  const solid = useTransform(scrollYProgress, [0, 1], [0, 0.9]);

  const style = (
    reduce ? { top } : { top, "--panel-solid": solid }
  ) as MotionStyle;

  return (
    <motion.div ref={ref} className={className} style={style}>
      {children}
    </motion.div>
  );
}

/**
 * Momentum shear: skews its child in proportion to scroll velocity, so images
 * "lean" into the direction of travel and spring back to flat when the scroll
 * settles. The velocity is spring-smoothed and clamped, then applied as a full
 * `skewY` transform string (GPU-composited). Passthrough under reduced motion.
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
  // Map a wide velocity band onto a small skew and clamp, so fast flings never
  // shear past a tasteful few degrees.
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

/**
 * Ambient accent glow that drifts with scroll — a soft depth layer behind a
 * section's content. Scroll-driven (not perpetual), faint, GPU-composited, and
 * null under reduced motion. Drop as the first child of a `relative isolate`
 * section; reposition with `className` (defaults to centred).
 */
export function ParallaxGlow({
  size = 620,
  speed = 130,
  className,
}: {
  size?: number;
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
  const transform = useMotionTemplate`translate3d(-50%, calc(-50% + ${y}px), 0)`;

  if (reduce) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <motion.span
        style={{
          width: size,
          height: size,
          transform,
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 13%, transparent), transparent 66%)",
        }}
        className={cn(
          "absolute left-1/2 top-1/2 rounded-full blur-3xl",
          className,
        )}
      />
    </div>
  );
}

/**
 * Cursor-follow accent glow. Listens on its parent element, so drop it as the
 * first child of any `relative isolate` container and it lights up where the
 * pointer is. Hover-capable pointers only (attaches no listeners on touch) and
 * null under reduced motion. Spring-smoothed, GPU-composited.
 */
export function Spotlight({
  size = 520,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);
  const o = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 140, damping: 26, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 140, damping: 26, mass: 0.6 });
  const so = useSpring(o, { stiffness: 180, damping: 30 });
  const transform = useMotionTemplate`translate3d(${sx}px, ${sy}px, 0)`;

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const move = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      x.set(e.clientX - r.left - size / 2);
      y.set(e.clientY - r.top - size / 2);
      o.set(1);
    };
    const leave = () => o.set(0);

    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerleave", leave);
    return () => {
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, [size, x, y, o]);

  if (reduce) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <motion.span
        style={{
          width: size,
          height: size,
          transform,
          opacity: so,
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 20%, transparent), transparent 62%)",
        }}
        className="absolute left-0 top-0 rounded-full blur-3xl"
      />
    </div>
  );
}
