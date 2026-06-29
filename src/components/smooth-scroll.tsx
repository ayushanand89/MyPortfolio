"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  // Respect reduced-motion: skip the smooth-scroll layer entirely.
  if (reduce) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{ lerp: 0.1, duration: 1.1, smoothWheel: true, wheelMultiplier: 1 }}
    >
      {children}
    </ReactLenis>
  );
}
