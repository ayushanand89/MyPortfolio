"use client";

import { useEffect, useState } from "react";

// Module-scoped: stays true across template remounts within a session, so the
// first (SSR/initial) render shows content immediately and only subsequent
// client navigations animate.
let navigated = false;

/**
 * Entrance for client navigations that DIDN'T go through a view transition
 * (back/forward, unsupported browsers) - a light CSS rise. When a view
 * transition is running (`html[data-vt]`), it already animates the swap.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const [animate] = useState(
    () =>
      navigated &&
      !document.documentElement.dataset.vt &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    navigated = true;
  }, []);

  if (!animate) return <>{children}</>;
  return <div className="route-enter">{children}</div>;
}
