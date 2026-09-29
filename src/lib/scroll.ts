import type Lenis from "lenis";

/**
 * Scrolls to an in-page anchor, landing the section's *content* just below
 * the fixed nav. It absorbs the section's own top padding into the offset, so
 * jumping to a chapter doesn't leave a big empty gap above its heading. Uses
 * Lenis when active, otherwise a small rAF-eased fallback. `immediate` jumps
 * without animating (used while a view transition holds the frame).
 */
export function smoothScrollToHash(
  hash: string,
  lenis?: Lenis | null,
  { immediate = false }: { immediate?: boolean } = {},
) {
  if (typeof document === "undefined") return;
  const el = document.querySelector(hash) as HTMLElement | null;
  if (!el) return;

  const nav = document.getElementById("site-nav");
  const navH = nav ? nav.offsetHeight : 64;
  const padTop = parseFloat(getComputedStyle(el).paddingTop) || 0;
  // Positive offset scrolls *into* the section's top padding so the heading
  // sits just below the nav; negative when padding is small (just clear it).
  const offset = padTop - navH - 24;

  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.4, immediate, force: immediate });
    return;
  }

  const startY = window.scrollY;
  const targetY = Math.max(0, el.getBoundingClientRect().top + startY + offset);
  if (immediate) {
    window.scrollTo(0, targetY);
    return;
  }
  const distance = targetY - startY;
  const duration = 900;
  let start: number | null = null;
  const ease = (t: number) => 1 - Math.pow(1 - t, 4);

  const step = (now: number) => {
    if (start === null) start = now;
    const progress = Math.min((now - start) / duration, 1);
    window.scrollTo(0, startY + distance * ease(progress));
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
