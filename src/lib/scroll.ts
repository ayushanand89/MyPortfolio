import type Lenis from "lenis";

const NAV_OFFSET = 72;

/**
 * Smoothly scrolls to an in-page anchor. Uses Lenis when it's active,
 * otherwise runs a small rAF-eased fallback — so section navigation is always
 * smooth, even when Lenis is gated off (e.g. reduced-motion) or unmounted.
 */
export function smoothScrollToHash(hash: string, lenis?: Lenis | null) {
  if (typeof document === "undefined") return;
  const el = document.querySelector(hash) as HTMLElement | null;
  if (!el) return;

  if (lenis) {
    lenis.scrollTo(el, { offset: -NAV_OFFSET, duration: 1.1 });
    return;
  }

  const startY = window.scrollY;
  const targetY = el.getBoundingClientRect().top + startY - NAV_OFFSET;
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
