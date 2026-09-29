"use client";

import { ReactLenis } from "lenis/react";
import { useState, type ReactNode } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [reduce] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  // Respect reduced-motion: skip the smooth-scroll layer entirely. Read
  // synchronously on purpose - root-mode Lenis renders no DOM, so there's no
  // hydration mismatch, and flipping after hydration would remount the app.
  if (reduce) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1,
      }}
    >
      {children}
    </ReactLenis>
  );
}
