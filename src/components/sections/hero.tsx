"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { profile } from "@/content/profile";
import { flagshipProjects } from "@/content/projects";
import { ButtonLink, Dot, Lines } from "@/components/primitives";
import { LocalTime } from "@/components/local-time";
import { LoopVideo } from "@/components/loop-video";
import { TransitionLink } from "@/components/transition-link";
import { scroll } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/**
 * Poster hero. The work plays BEHIND the headline — a "now showing" screen of
 * the real sites, fading into the ink on its left so the type laid over it
 * stays legible. Pinned (sticky) so the Work sheet slides up over it while it
 * recedes. The entrance is pure CSS (`load-*`), so the headline paints before
 * hydration and syncs with the intro curtain via `--hero-delay`.
 *
 * Sticky offset is `min(0, 100svh - height)`: a hero taller than the viewport
 * scrolls to its bottom edge before pinning. Recede progress comes from
 * window scroll (the hero sits at the page top), never the sticky node.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [covered, setCovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let h = el.offsetHeight || 1;
    const ro = new ResizeObserver(() => {
      h = el.offsetHeight || 1;
      el.style.setProperty("--hero-h", `${h}px`);
    });
    ro.observe(el);
    if (reduce) return () => ro.disconnect();
    const off = scroll.subscribe(() => {
      const p = Math.min(1, Math.max(0, scroll.y / h));
      const inner = innerRef.current;
      if (inner) {
        inner.style.transform = p
          ? `translate3d(0, ${(-5 * p).toFixed(2)}%, 0) scale(${(1 - 0.1 * p).toFixed(4)})`
          : "";
      }
      if (dimRef.current) dimRef.current.style.opacity = (0.72 * p).toFixed(3);
      setCovered((c) => (c === p > 0.96 ? c : p > 0.96));
    });
    return () => {
      ro.disconnect();
      off();
    };
  }, [reduce]);

  return (
    <section
      ref={ref}
      data-surface="ink"
      aria-label="Introduction"
      className="sticky top-[min(0px,calc(100svh-var(--hero-h,100svh)))] min-h-svh overflow-hidden"
    >
      <div
        ref={innerRef}
        className="gutter mx-auto flex min-h-svh max-w-[1600px] origin-top flex-col pb-16 pt-18 will-change-transform sm:pb-24 sm:pt-22 lg:pb-28"
      >
        {/* Meta row — the inspo's corner captions. */}
        <div
          className="load-fade label relative z-10 grid grid-cols-2 gap-4 pt-3 md:grid-cols-3"
          style={d(150)}
        >
          <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-line-strong" />
          <span>
            {profile.role}
            <span className="text-muted"> — Freelance</span>
          </span>
          <span className="hidden items-center justify-center gap-2.5 md:flex">
            {profile.available && <Dot />}
            {profile.availabilityLabel}
          </span>
          <span className="text-right text-muted">
            {profile.location} · <LocalTime />
          </span>
        </div>

        <div className="relative flex flex-1 flex-col justify-center pt-6 lg:py-10">
          <Screening paused={covered} />
          <Lines
            load
            as="h1"
            className="display relative z-10 -mt-[18vw] text-[clamp(2.65rem,11.2vw,5rem)] md:-mt-[14vw] md:text-[7.7vw] lg:mt-0 min-[1600px]:text-[7.7rem]"
            lines={[
              <>
                I build <em>premium</em>
              </>,
              "websites &",
              "full-stack",
              <em key="p">products.</em>,
            ]}
          />
        </div>

        <div className="relative z-10 mt-8 grid gap-6 pt-5 md:grid-cols-12 md:items-end">
          <span aria-hidden className="load-fade absolute inset-x-0 top-0 h-px bg-line" style={d(700)} />
          <p
            className="load-fade max-w-md text-[1.05rem] leading-relaxed text-muted text-pretty md:col-span-5 lg:col-span-4"
            style={d(750)}
          >
            {profile.lede}
          </p>
          <div
            className="load-fade flex flex-wrap items-center gap-3 md:col-span-7 md:justify-end lg:col-span-6 lg:justify-center"
            style={d(850)}
          >
            <ButtonLink href="/#work">Selected work</ButtonLink>
            <ButtonLink href={profile.resumeUrl} external variant="accent">
              Résumé
            </ButtonLink>
            <ButtonLink href="/#contact" variant="ghost">
              Work with me
            </ButtonLink>
          </div>
          <div
            className="load-fade hidden items-center justify-end lg:col-span-2 lg:flex"
            style={d(950)}
          >
            <span className="label flex items-center gap-3 text-muted">
              Scroll
              <span className="relative block h-9 w-px overflow-hidden bg-line-strong">
                <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-signal" />
              </span>
            </span>
          </div>
        </div>
      </div>

      {!reduce && (
        <div
          ref={dimRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-black opacity-0"
        />
      )}
    </section>
  );
}

/**
 * "Now showing" — the flagship sites cycling behind the headline: recordings
 * of the live sites (clips load after idle; only the showing one plays), the
 * client project as a still. Fades into the ink on its left (desktop) or
 * bottom (phones) so the title reads over it.
 */
function Screening({ paused }: { paused: boolean }) {
  const items = flagshipProjects.filter((p) => p.image);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || paused) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % items.length),
      5200,
    );
    return () => window.clearInterval(id);
  }, [items.length, reduce, paused]);

  const p = items[active];
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <TransitionLink
      href="/#work"
      data-cursor="See the work"
      aria-label="See selected work"
      className="group relative z-0 block w-full lg:absolute lg:right-0 lg:top-1/2 lg:w-[min(58%,calc((100svh-24rem)*1.6))] lg:-translate-y-1/2"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-[12px] bg-raised">
        <div className="load-settle absolute inset-0" style={d(450)}>
        {items.map((item, i) => {
          const rec = item.media?.reel;
          const poster = item.media?.desktop?.poster ?? item.image!;
          const on = i === active;
          return (
            <div
              key={item.slug}
              className={cn(
                "absolute inset-0 transition-[opacity,transform] ease-out-strong",
                on
                  ? "scale-100 opacity-100 duration-[1200ms,6000ms]"
                  : "scale-[1.06] opacity-0 duration-[1200ms,0ms]",
              )}
            >
              {rec ? (
                <LoopVideo
                  src={rec}
                  poster={poster}
                  alt=""
                  sizes="(min-width: 1024px) 60vw, 94vw"
                  priority={i === 0}
                  playing={on && !paused}
                />
              ) : (
                <Image
                  src={poster}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 60vw, 94vw"
                  className="object-cover object-top"
                />
              )}
            </div>
          );
        })}
        </div>
        {/* Legibility: fade into the ink where the headline overlaps. */}
        <span
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-ink via-ink/35 to-ink/10 lg:bg-linear-to-r lg:from-ink lg:via-ink/55 lg:to-ink/5"
        />
        <span className="label absolute right-3 top-3 flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-paper sm:right-4 sm:top-4">
          <span className="h-1.5 w-1.5 rounded-full bg-signal" />
          Now showing
        </span>
      </div>
      <div className="data mt-2.5 flex items-center justify-end gap-3 text-muted max-lg:hidden">
        <span key={p.slug} className="animate-[fade-up_0.6s_var(--ease-out)_both]">
          {pad(active + 1)}/{pad(items.length)} — {p.title}
          {p.live ? " · live" : " · client build"}
        </span>
      </div>
    </TransitionLink>
  );
}
