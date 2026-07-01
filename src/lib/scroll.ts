import type Lenis from "lenis";

/**
 * Smoothly scrolls to an in-page anchor, landing the section's *content* just
 * below the fixed nav. It absorbs the section's own top padding into the scroll
 * offset, so jumping to a section doesn't leave a big empty gap above its
 * heading. Uses Lenis when active, otherwise a small rAF-eased fallback.
 */
export function smoothScrollToHash(hash: string, lenis?: Lenis | null) {
  if (typeof document === "undefined") return;
  const el = document.querySelector(hash) as HTMLElement | null;
  if (!el) return;

  const nav = document.querySelector("header");
  const navH = nav ? nav.offsetHeight : 64;
  const padTop = parseFloat(getComputedStyle(el).paddingTop) || 0;
  // Positive offset scrolls *into* the section's top padding so the heading sits
  // just below the nav; negative when padding is small (just clear the nav).
  const offset = padTop - navH - 16;

  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.1 });
    return;
  }

  const startY = window.scrollY;
  const targetY = Math.max(0, el.getBoundingClientRect().top + startY + offset);
  const distance = targetY - startY;
  const duration = 850;
  let start: number | null = null;
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  const step = (now: number) => {
    if (start === null) start = now;
    const progress = Math.min((now - start) / duration, 1);
    window.scrollTo(0, startY + distance * easeOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
