"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Hydration-safe media query (same pattern as `useReducedMotion`): the server
 * snapshot is `false`, so markup matches during hydration and re-renders once
 * with the real value. Use for behaviour, not for first-paint layout — CSS
 * breakpoints handle that.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
