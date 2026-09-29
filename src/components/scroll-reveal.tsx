"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Drives every `[data-reveal]` entrance with ONE IntersectionObserver.
 *
 * The pre-paint script in `layout.tsx` sets `html[data-reveal-js]` (only when
 * motion is allowed), which hides reveal targets; this component flips it to
 * "ready" (otherwise the script's failsafe un-hides everything) and sets
 * `data-in` on each target as it enters, once. CSS transitions do the rest, so
 * the same time-based motion plays in every engine.
 *
 * Targets entering in the same batch are ordered top→bottom, left→right and
 * cascaded via `--auto`. Anything already scrolled past on load (mid-page
 * reload) is marked `instant` so it doesn't animate off-screen. Re-scans on
 * route change; a MutationObserver (rAF-batched) catches late mounts.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (!root.dataset.revealJs) return;
    root.dataset.revealJs = "ready";

    const io = new IntersectionObserver(
      (entries) => {
        const entering: IntersectionObserverEntry[] = [];
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) entering.push(entry);
          else if (entry.boundingClientRect.bottom < 0) {
            el.dataset.in = "instant";
            io.unobserve(el);
          }
        }
        entering
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top ||
              a.boundingClientRect.left - b.boundingClientRect.left,
          )
          .forEach((entry, n) => {
            const el = entry.target as HTMLElement;
            if (n > 0) el.style.setProperty("--auto", String(Math.min(n, 6)));
            el.dataset.in = "";
            io.unobserve(el);
          });
      },
      { rootMargin: "0px 0px -9% 0px", threshold: 0 },
    );

    const scan = () => {
      document
        .querySelectorAll<HTMLElement>("[data-reveal]:not([data-in])")
        .forEach((el) => io.observe(el));
    };
    scan();

    let queued = 0;
    const mo = new MutationObserver(() => {
      if (queued) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        scan();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(queued);
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
