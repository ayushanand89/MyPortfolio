"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Hydration-safe reduced-motion flag. framer-motion's `useReducedMotion`
 * reads the media query synchronously on the client's first render, so any
 * markup branched on it disagrees with the server HTML (React #418) for
 * reduced-motion users. `useSyncExternalStore` renders the server snapshot
 * (`false`) during hydration, then re-renders with the real value.
 */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
