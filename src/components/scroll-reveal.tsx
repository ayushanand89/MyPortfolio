"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Cross-browser fallback for the CSS scroll-driven reveals.
 *
 * Chromium animates `.reveal` / `.media-reveal` / `.mask-reveal` natively via
 * `animation-timeline: view()`. Browsers without that feature (Safari, Firefox)
 * would otherwise skip the whole `@supports` block and never animate — so an
 * inline script in `layout.tsx` adds `html.reveal-js` *before first paint*, but
 * ONLY when `animation-timeline: view()` is unsupported, `IntersectionObserver`
 * exists, and the user hasn't asked for reduced motion. This component then
 * reveals each element as it scrolls into view by toggling `.is-inview`.
 *
 * Keyed off `usePathname` so client navigations (e.g. the `/work/[slug]` case
 * studies) get their fresh `.reveal` nodes observed too.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("reveal-js")) return;
    if (!("IntersectionObserver" in window)) return;

    const targets = document.querySelectorAll<HTMLElement>(
      ".reveal, .media-reveal, .mask-reveal > *, .rule-draw",
    );
    if (targets.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-inview");
          io.unobserve(entry.target);
        }
      },
      // Fire a touch before the element is fully in — matches the early feel of
      // the native `entry 0%` ranges.
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    for (const el of targets) io.observe(el);
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
