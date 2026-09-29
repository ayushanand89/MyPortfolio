"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import type Lenis from "lenis";
import {
  useCallback,
  useEffect,
  type ComponentProps,
  type RefObject,
} from "react";
import { smoothScrollToHash } from "@/lib/scroll";

/**
 * Route transitions on the native View Transitions API (no React
 * experimental APIs).
 *
 * `navigate()` snapshots the current page, pushes the new route with
 * `scroll: false`, and holds the transition open until <RouteTransitions/>
 * sees the new pathname commit, lands the scroll, and releases it. The browser
 * then morphs the one element named `cover` in each state — the clicked
 * project image → the case-study cover (`[data-vt-cover]`) — while the new
 * page wipes up over the old one.
 *
 * Only ONE element per state may carry the name: before starting, every
 * `[data-vt-cover]` on the outgoing page is unnamed and only the clicked
 * source is named. Unsupported browsers / reduced motion get the same
 * push + scroll handling without the animation (template.tsx adds a light
 * entrance). Back/forward restore their own scroll position.
 */

type Intent = { hash: string; resolve?: () => void; timer?: number };
let intent: Intent | null = null;
let running = false;
let popped = false;
let lenisRef: Lenis | null = null;
let currentPath = "";
const savedScroll = new Map<string, number>();

function takeIntent() {
  const i = intent;
  intent = null;
  if (i?.timer) window.clearTimeout(i.timer);
  return i;
}

/** Instant, state-safe jump — also clears any in-flight Lenis scroll and
 *  re-measures the (new) page height before landing. */
function jumpTo(target: string | number) {
  if (typeof target === "string") {
    if (target && document.querySelector(target)) {
      lenisRef?.stop();
      lenisRef?.start();
      lenisRef?.resize();
      smoothScrollToHash(target, lenisRef, { immediate: true });
      return;
    }
    target = 0;
  }
  if (lenisRef) {
    lenisRef.stop();
    lenisRef.start();
    lenisRef.resize();
    lenisRef.scrollTo(target, { immediate: true, force: true });
  } else {
    window.scrollTo({ top: target, behavior: "instant" });
  }
}

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export function useNavigate() {
  const router = useRouter();

  return useCallback(
    (href: string, source?: HTMLElement | null) => {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) {
        window.location.href = href;
        return;
      }

      // Same page: anchors glide, a bare path returns to the top.
      if (url.pathname === window.location.pathname) {
        if (url.hash) smoothScrollToHash(url.hash, lenisRef);
        else if (lenisRef) lenisRef.scrollTo(0);
        else window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (running) return;

      savedScroll.set(window.location.pathname, window.scrollY);
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduce || !("startViewTransition" in document)) {
        intent = { hash: url.hash };
        router.push(href, { scroll: false });
        return;
      }

      running = true;
      const root = document.documentElement;
      root.dataset.vt = "1";
      document
        .querySelectorAll<HTMLElement>("[data-vt-cover]")
        .forEach((el) => (el.style.viewTransitionName = "none"));
      if (source) source.style.viewTransitionName = "cover";

      const vt = document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            intent = {
              hash: url.hash,
              resolve,
              // Never hold the page frozen: release after 1.5s regardless.
              timer: window.setTimeout(() => {
                takeIntent();
                resolve();
              }, 1500),
            };
            router.push(href, { scroll: false });
          }),
      );
      vt.ready.catch(() => {});
      vt.updateCallbackDone.catch(() => {});
      vt.finished
        .catch(() => {})
        .finally(() => {
          running = false;
          delete root.dataset.vt;
          if (source) source.style.viewTransitionName = "";
        });
    },
    [router],
  );
}

/**
 * Lands each client navigation: the new page at its top (or #hash target), or
 * a back/forward entry at its saved position — then releases a pending view
 * transition once the destination cover has decoded, so the morph never lands
 * in an empty frame.
 */
export function RouteTransitions() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    lenisRef = lenis ?? null;
  }, [lenis]);

  useEffect(() => {
    // Manual restoration for in-app back/forward (handled below); handed back
    // to the browser on unload so a reload still returns to where you were.
    const manual = () => {
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    };
    const auto = () => {
      if ("scrollRestoration" in history) history.scrollRestoration = "auto";
    };
    manual();
    // popstate fires after the URL changes but before the new page renders,
    // so scrollY still belongs to the page being left.
    const onPop = () => {
      if (currentPath) savedScroll.set(currentPath, window.scrollY);
      popped = true;
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("pagehide", auto);
    window.addEventListener("pageshow", manual);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("pagehide", auto);
      window.removeEventListener("pageshow", manual);
    };
  }, []);

  useEffect(() => {
    currentPath = pathname;
    if (popped) {
      popped = false;
      const y = savedScroll.get(pathname);
      requestAnimationFrame(() => jumpTo(y ?? 0));
      return;
    }
    const i = takeIntent();
    if (!i) return;
    jumpTo(i.hash);
    if (!i.resolve) return;
    const img = document.querySelector<HTMLImageElement>(
      "[data-vt-cover] img",
    );
    Promise.race([img?.decode().catch(() => {}), wait(320)]).then(i.resolve);
  }, [pathname]);

  return null;
}

/**
 * next/link that routes plain left-clicks through `navigate()`. Modified
 * clicks (new tab etc.), `target` and `download` links keep native behaviour.
 * Prefetches on hover as well as next/link's viewport prefetch.
 */
export function TransitionLink({
  href,
  onClick,
  onPointerEnter,
  morphRef,
  ...rest
}: Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  /** Element to morph into the destination's `[data-vt-cover]`. */
  morphRef?: RefObject<HTMLElement | null>;
}) {
  const navigate = useNavigate();
  const router = useRouter();
  return (
    <Link
      href={href}
      scroll={false}
      {...rest}
      onPointerEnter={(e) => {
        onPointerEnter?.(e);
        if (href.startsWith("/") && !href.startsWith("/#")) router.prefetch(href);
      }}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
          return;
        if ((rest.target && rest.target !== "_self") || rest.download) return;
        e.preventDefault();
        navigate(href, morphRef?.current);
      }}
    />
  );
}
