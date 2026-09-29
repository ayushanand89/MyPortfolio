"use client";

import { Fragment, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { scroll } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

// `serif` items set in Instrument Serif italic - the same caps/serif rhythm
// as the headlines.
const items: { text: string; serif?: boolean }[] = [
  { text: "Next.js" },
  { text: "typescript", serif: true },
  { text: "PostgreSQL" },
  { text: "rag pipelines", serif: true },
  { text: "Supabase" },
  { text: "real-time", serif: true },
  { text: "Bun · Hono" },
  { text: "payments", serif: true },
  { text: "Redis" },
  { text: "motion", serif: true },
  { text: "Prisma" },
  { text: "end to end", serif: true },
];

/**
 * The signal-red tape laid across a seam. It drifts on its own and is driven
 * by scroll velocity - faster while you scroll, reversing when you scroll back
 * up. One transform per frame, and the loop only runs while the tape is on
 * screen. Static under reduced motion.
 */
export function Marquee({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    const el = track.current;
    if (reduce || !host || !el) return;
    let raf = 0;
    let x = 0; // percent of the track (two runs → wrap at -50%)
    let dir = -1;
    let boost = 0;
    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(64, now - last) / 1000;
      last = now;
      const v = scroll.velocity;
      if (v > 40) dir = -1;
      else if (v < -40) dir = 1;
      // Ease toward a speed boost proportional to scroll speed.
      boost += (Math.min(5, Math.abs(v) / 400) - boost) * 0.08;
      x += dir * 1.6 * dt * (1 + boost);
      if (x <= -50) x += 50;
      else if (x > 0) x -= 50;
      el.style.transform = `translate3d(${x.toFixed(3)}%, 0, 0)`;
      raf = requestAnimationFrame(loop);
    };

    let inView = false;
    let ready = false;
    const start = () => {
      cancelAnimationFrame(raf);
      if (inView && ready) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      start();
    });
    io.observe(host);
    // Hold the drift until the page has loaded and gone idle, so the loop
    // never competes with hydration on first paint.
    let idle = 0;
    const go = () => {
      const ric =
        window.requestIdleCallback ??
        ((cb: () => void) => window.setTimeout(cb, 300));
      idle = ric(() => {
        ready = true;
        start();
      }) as number;
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("load", go);
      window.cancelIdleCallback?.(idle);
    };
  }, [reduce]);

  const run = (
    <div className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <Fragment key={i}>
          <span
            className={cn(
              "whitespace-nowrap px-[0.45em]",
              item.serif
                ? "serif text-[1.18em] italic leading-none"
                : "display leading-none",
            )}
          >
            {item.text}
          </span>
          <span aria-hidden className="px-[0.2em] text-[0.7em]">
            ✺
          </span>
        </Fragment>
      ))}
    </div>
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "tape pointer-events-none select-none overflow-hidden bg-signal py-3 text-ink shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)] sm:py-4",
        className,
      )}
    >
      <div
        ref={track}
        className="flex w-max text-[clamp(1.35rem,3vw,2.75rem)] will-change-transform"
      >
        {run}
        {run}
      </div>
    </div>
  );
}
