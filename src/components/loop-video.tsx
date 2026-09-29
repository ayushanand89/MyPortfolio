"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * A recording of a real site, playing like a live screen. The poster is a
 * next/image (responsive AVIF/WebP) so the frame is never empty; the muted
 * loop only starts fetching as it approaches the viewport, plays while it's
 * actually visible, and pauses the moment it isn't — so only on-screen videos
 * ever decode. It fades in on `playing` (no black flash). Reduced motion or
 * Data Saver: the poster alone.
 */
export function LoopVideo({
  src,
  poster,
  alt,
  sizes,
  className,
  priority = false,
  deferIdle = true,
  playing: controlled,
  warm = false,
}: {
  src?: string;
  poster: string;
  alt: string;
  sizes: string;
  className?: string;
  /** Preload the poster (above-the-fold / LCP). */
  priority?: boolean;
  /** Don't fetch until the page has loaded and gone idle, so no video ever
   *  competes with fonts / images / LCP during the initial load. */
  deferIdle?: boolean;
  /** Extra gate from the parent (e.g. the hero pauses once covered). */
  playing?: boolean;
  /** Fetch even while `playing` is false, so it can start instantly later
   *  (e.g. the card under the top of a swipe deck). */
  warm?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAllowed(!!src && !reduce && !conn?.saveData);
  }, [src, reduce]);

  const [near, setNear] = useState(false);
  const [idleOk, setIdleOk] = useState(!deferIdle);

  // Near = within a viewport of the screen; visible = ≥30% on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el || !allowed) return;
    const nearIo = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          nearIo.disconnect();
        }
      },
      { rootMargin: "75% 0px" },
    );
    const seenIo = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.3,
    });
    nearIo.observe(el);
    seenIo.observe(el);
    return () => {
      nearIo.disconnect();
      seenIo.disconnect();
    };
  }, [allowed]);

  // Above-the-fold clips wait for load + idle before fetching anything.
  useEffect(() => {
    if (!deferIdle || !allowed) return;
    let handle = 0;
    const go = () => {
      const ric =
        window.requestIdleCallback ??
        ((cb: () => void) => window.setTimeout(cb, 400));
      handle = ric(() => setIdleOk(true)) as number;
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => {
      window.removeEventListener("load", go);
      window.cancelIdleCallback?.(handle);
    };
  }, [deferIdle, allowed]);

  // Fetch only once near, idle-cleared, and wanted (or warmed) by the parent.
  useEffect(() => {
    if (near && idleOk && (controlled !== false || warm)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setArmed(true);
    }
  }, [near, idleOk, controlled, warm]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !armed) return;
    if (visible && controlled !== false) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [armed, visible, controlled]);

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <Image
        src={poster}
        alt={alt}
        fill
        sizes={sizes}
        preload={priority}
        className="object-cover object-top"
      />
      {allowed && (
        <video
          ref={ref}
          src={armed ? src : undefined}
          muted
          loop
          playsInline
          preload={armed ? "auto" : "none"}
          aria-hidden
          onPlaying={() => setReady(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700",
            ready ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </div>
  );
}
