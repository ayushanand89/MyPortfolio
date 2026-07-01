"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Cross-browser fallback for the CSS scroll-driven reveals.
 *
 * Chromium animates `.reveal` / `.media-reveal` / `.mask-reveal` natively via
 * `animation-timeline: view()`. Browsers without that feature (Safari, older
 * Firefox) would otherwise skip the whole `@supports` block and never animate —
 * so an inline script in `layout.tsx` adds `html.reveal-js` *before first paint*
 * (only when `animation-timeline: view()` is unsupported, `IntersectionObserver`
 * exists, and reduced motion is off). This component then reveals each element
 * as it scrolls into view by toggling `.is-inview`.
 *
 * `.media-reveal` gets an additional ALWAYS-ON observer, even in browsers that
 * do support view() timelines: Firefox honours `animation-timeline: view()` but
 * does NOT reliably animate `clip-path` on it, so the cover image can get stuck
 * fully clipped (invisible). Forcing `.is-inview` once the frame is well in view
 * guarantees it shows; in Chromium the wipe has already finished by then, so
 * it's a no-op.
 *
 * Keyed off `usePathname` so client navigations (e.g. the `/work/[slug]` case
 * studies) get their fresh nodes observed too.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const revealJs = document.documentElement.classList.contains("reveal-js");
    const observers: IntersectionObserver[] = [];

    const observe = (
      selector: string,
      options: IntersectionObserverInit,
    ) => {
      const targets = document.querySelectorAll<HTMLElement>(selector);
      if (targets.length === 0) return;
      const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-inview");
          io.unobserve(entry.target);
        }
      }, options);
      for (const el of targets) io.observe(el);
      observers.push(io);
    };

    // Media frames: always observed as the clip-path safety net. Fired at ~45%
    // visibility so it never cuts Chromium's native wipe short.
    observe(".media-reveal", { threshold: 0.45 });

    // The rest only need JS when native scroll-timelines are unsupported. Fired
    // early to match the native `entry 0%` feel. (`.media-reveal` is included
    // here too so its wipe keeps the early trigger in those engines; the
    // always-on observer above is then just a redundant safety.)
    if (revealJs) {
      observe(".reveal, .media-reveal, .mask-reveal > *, .rule-draw", {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.08,
      });
    }

    return () => observers.forEach((io) => io.disconnect());
  }, [pathname]);

  return null;
}
