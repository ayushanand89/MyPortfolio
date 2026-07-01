"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/**
 * Premium interactive card: frosted-glass surface that tilts toward the cursor
 * in 3D, lifts its content on a parallax plane, and carries an accent spotlight
 * that follows the pointer. All motion is spring-eased and driven through
 * transform strings (GPU-composited, off the React render loop).
 *
 * Degrades gracefully: static glass panel on touch devices / reduced motion,
 * solid fill under `prefers-reduced-transparency` (see `.glass` in globals.css).
 */
export function ShowcaseCard({
  children,
  className,
  tilt = 7,
  glow = 320,
  lift = 34,
  solid = false,
}: {
  children: ReactNode;
  className?: string;
  tilt?: number;
  glow?: number;
  lift?: number;
  /** Opaque surface instead of the translucent glass — needed when cards stack
   *  over each other (sticky stack) so lower cards don't bleed through. */
  solid?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(-9999);
  const gy = useMotionValue(-9999);
  const go = useMotionValue(0);

  const srx = useSpring(rx, { stiffness: 200, damping: 22 });
  const sry = useSpring(ry, { stiffness: 200, damping: 22 });
  const sgx = useSpring(gx, { stiffness: 220, damping: 28, mass: 0.5 });
  const sgy = useSpring(gy, { stiffness: 220, damping: 28, mass: 0.5 });
  const sgo = useSpring(go, { stiffness: 180, damping: 26 });

  const cardTransform = useMotionTemplate`perspective(1000px) rotateX(${srx}deg) rotateY(${sry}deg)`;
  const glowTransform = useMotionTemplate`translate3d(${sgx}px, ${sgy}px, 0)`;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  const base = cn(
    "relative overflow-hidden rounded-2xl",
    solid ? "glass-strong" : "glass",
  );

  // Always-on accent corner glow — gives every card a light source and a bit of
  // personality even when it's static (touch / reduced motion), so cards never
  // read as flat dark boxes.
  const decor = (
    <span
      aria-hidden
      className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-60 blur-3xl"
      style={{
        background:
          "radial-gradient(circle, color-mix(in srgb, var(--accent) 16%, transparent), transparent 70%)",
      }}
    />
  );

  // Opaque fill whose opacity is driven (via the `--panel-solid` CSS var set by
  // StackPanel on scroll) so a sticky card firms up as it stacks. Animating this
  // overlay's opacity is compositor-only — far cheaper than repainting the
  // card's own backdrop-blurred background each scroll frame. Defaults opaque
  // (0.9) when no StackPanel drives it (e.g. reduced motion), so it never bleeds.
  const panel = solid ? (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-card"
      style={{ opacity: "var(--panel-solid, 0.9)" } as CSSProperties}
    />
  ) : null;

  if (reduce || !enabled) {
    return (
      <div className={cn(base, className)}>
        {panel}
        {decor}
        <div className="relative z-10 h-full">{children}</div>
      </div>
    );
  }

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * tilt);
    rx.set(-py * tilt);
    gx.set(e.clientX - r.left - glow / 2);
    gy.set(e.clientY - r.top - glow / 2);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
    go.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerEnter={() => go.set(1)}
      onPointerLeave={reset}
      style={{ transform: cardTransform, transformStyle: "preserve-3d" }}
      className={cn(
        base,
        "group/card transition-shadow duration-300 ease-out-strong hover:shadow-[0_28px_70px_-24px_rgba(0,0,0,0.65)]",
        className,
      )}
    >
      {panel}
      {decor}
      {/* One-shot specular sheen that wipes across on hover (clipped by the
          card's overflow-hidden). Only the interactive branch renders it, so
          touch / reduced-motion never see it. */}
      <span
        aria-hidden
        className="card-sheen pointer-events-none absolute inset-0 z-20"
      />
      <motion.span
        aria-hidden
        style={{
          width: glow,
          height: glow,
          transform: glowTransform,
          opacity: sgo,
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 24%, transparent), transparent 60%)",
        }}
        className="pointer-events-none absolute left-0 top-0 rounded-full blur-2xl"
      />
      <div
        className="relative z-10 h-full"
        style={{ transform: `translateZ(${lift}px)` }}
      >
        {children}
      </div>
    </motion.div>
  );
}
