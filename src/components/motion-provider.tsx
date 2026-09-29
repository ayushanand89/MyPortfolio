"use client";

import { LazyMotion, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

const loadFeatures = () =>
  import("@/lib/motion-features").then((mod) => mod.default);

/**
 * framer-motion, loaded lazily. Components use the lightweight `m.*`
 * elements; the animation/drag/layout engine arrives async after first
 * paint. `reducedMotion="user"` makes every framer animation respect the OS
 * setting automatically.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
