"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** Apple keyboard? (⌘ vs Ctrl in shortcut hints). Hydration-safe: the server
 *  snapshot assumes ⌘, the client corrects it right after hydration. */
export function useIsApple() {
  return useSyncExternalStore(
    noop,
    () => /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent),
    () => true,
  );
}
