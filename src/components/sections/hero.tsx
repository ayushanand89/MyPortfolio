"use client";

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Image from "next/image";
import { profile } from "@/content/profile";
import { flagshipProjects } from "@/content/projects";
import { ButtonLink, Dot } from "@/components/primitives";
import { Magnetic } from "@/components/magnetic";
import { LocalTime } from "@/components/local-time";
import { LoopVideo } from "@/components/loop-video";
import { TransitionLink } from "@/components/transition-link";
import { scroll } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/use-media-query";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/**
 * Poster hero. The headline and a "now showing" screen of the real sites sit
 * side by side (stacked on tablets) and never overlap, so the type stays
 * clean and the work reads as its own framed picture. Pinned (sticky) so the Work sheet slides up over it while it
 * recedes. The entrance is pure CSS (`load-*`), so the headline paints before
 * hydration and syncs with the intro curtain via `--hero-delay`.
 *
 * Phones get a quieter, type-only version: no screen behind the title, one
 * caption line, two actions, and only as tall as its content - the Work
 * sheet begins on the first screen.
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
      className="sticky top-[min(0px,calc(100svh-var(--hero-h,100svh)))] overflow-hidden md:min-h-svh"
    >
      <div
        ref={innerRef}
        className="gutter mx-auto flex max-w-[1600px] origin-top flex-col pb-14 pt-18 will-change-transform sm:pb-24 sm:pt-22 md:min-h-svh lg:pb-28"
      >
        {/* Meta row - the inspo's corner captions (phones: one quiet line). */}
        <div
          className="load-fade label relative z-10 flex items-center justify-between gap-4 pt-3 md:hidden"
          style={d(150)}
        >
          <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-line-strong" />
          <span className="flex items-center gap-2.5">
            {profile.available ? (
              <>
                <Dot />
                Open for work
              </>
            ) : (
              profile.role
            )}
          </span>
          <span className="text-muted">
            Delhi · <LocalTime />
          </span>
        </div>
        <div
          className="load-fade label relative z-10 hidden gap-4 pt-3 md:grid md:grid-cols-3"
          style={d(150)}
        >
          <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-line-strong" />
          <span>
            {profile.role}
            <span className="text-muted"> · Freelance &amp; full-time</span>
          </span>
          <span className="hidden items-center justify-center gap-2.5 md:flex">
            {profile.available && <Dot />}
            {profile.availabilityLabel}
          </span>
          <span className="text-right text-muted">
            {profile.location} · <LocalTime />
          </span>
        </div>

        {/* Phones: the hero is only as tall as its content, so the Work sheet
            starts right below it - no dead space, and the next chapter's
            header peeks in on the first screen. */}
        <div className="relative flex flex-1 flex-col justify-center pb-9 pt-14 md:pb-0 md:pt-6 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-8 lg:py-10">
          <Screening paused={covered} />
          <KineticTitle
            className="display relative z-10 text-[clamp(2.1rem,9.6vw,5rem)] md:mt-10 md:text-[7.7vw] lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:mt-0 lg:text-[min(6vw,6rem)]"
            lines={[
              [{ t: "I build " }, { t: "premium", em: true }],
              [{ t: "websites &" }],
              [{ t: "full-stack" }],
              [{ t: "products.", em: true }],
            ]}
          />
        </div>

        <div className="relative z-10 grid gap-7 pt-6 md:mt-8 md:grid-cols-12 md:items-end md:gap-6 md:pt-5">
          <span aria-hidden className="load-fade absolute inset-x-0 top-0 h-px bg-line" style={d(700)} />
          <div className="load-fade md:col-span-5 lg:col-span-4" style={d(750)}>
            <p className="max-w-md text-[1rem] leading-relaxed text-muted text-pretty sm:text-[1.05rem]">
              {profile.lede}
            </p>
            {/* Proof in the first five seconds - facts documented further down. */}
            <ul className="data mt-5 flex flex-wrap gap-x-5 gap-y-2 text-fg">
              {profile.proof.map((point) => (
                <li key={point} className="flex items-center gap-2">
                  <span aria-hidden className="h-1 w-1 rounded-full bg-signal" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          {/* Phones: two equal actions in one row. */}
          <div className="load-fade grid grid-cols-2 gap-3 md:hidden" style={d(850)}>
            <ButtonLink href="/#work" className="justify-center px-4!">
              View work
            </ButtonLink>
            <ButtonLink
              href={profile.resumeUrl}
              external
              variant="accent"
              className="justify-center px-4!"
            >
              Résumé
            </ButtonLink>
          </div>
          <div
            className="load-fade hidden flex-wrap items-center gap-3 md:col-span-7 md:flex md:justify-end lg:col-span-8 xl:col-span-6 xl:justify-center"
            style={d(850)}
          >
            <Magnetic>
              <ButtonLink href="/#work">Selected work</ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink href={profile.resumeUrl} external variant="accent">
                Résumé
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink href="/#contact" variant="ghost">
                Work with me
              </ButtonLink>
            </Magnetic>
          </div>
          <div
            className="load-fade hidden items-center justify-end xl:col-span-2 xl:flex"
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

type Seg = { t: string; em?: boolean };

/**
 * The headline, set letter by letter: each character flips up out of its
 * line's mask on a slight 3D hinge, cascading across the lines. Pure CSS
 * (`.kinetic .kchar`), so it plays before hydration and waits for the intro
 * curtain via `--hero-delay`. Words stay unbreakable; screen readers get the
 * plain sentence.
 */
function KineticTitle({ lines, className }: { lines: Seg[][]; className?: string }) {
  let c = 0;
  const plain = lines.map((segs) => segs.map((s) => s.t).join("")).join(" ");
  return (
    <h1 className={cn("kinetic", className)}>
      <span className="sr-only">{plain}</span>
      {lines.map((segs, l) => (
        <span
          key={l}
          aria-hidden
          className="line"
          style={{ "--l": l } as CSSProperties}
        >
          <span>
            {segs.map((seg, s) => {
              const words = seg.t.split(/(\s+)/).map((w, k) =>
                /^\s+$/.test(w) ? (
                  " "
                ) : w ? (
                  <span key={k} className="inline-block whitespace-nowrap">
                    {[...w].map((ch, j) => (
                      <span
                        key={j}
                        className="kchar"
                        style={{ "--c": c++, "--l": l } as CSSProperties}
                      >
                        {ch}
                      </span>
                    ))}
                  </span>
                ) : null,
              );
              return seg.em ? <em key={s}>{words}</em> : <Fragment key={s}>{words}</Fragment>;
            })}
          </span>
        </span>
      ))}
    </h1>
  );
}

/**
 * "Now showing" - the flagship sites cycling beside the headline: recordings
 * of the live sites (clips load after idle; only the showing one plays), the
 * client project as a still. A clean framed screen, with its label and the
 * current project in a caption line beneath rather than laid over the site.
 */
function Screening({ paused }: { paused: boolean }) {
  const items = flagshipProjects.filter((p) => p.image);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  // Hidden on phones - don't cycle (or re-render) a screen nobody sees.
  const shown = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (reduce || paused || !shown) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % items.length),
      5200,
    );
    return () => window.clearInterval(id);
  }, [items.length, reduce, paused, shown]);

  const p = items[active];
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <TransitionLink
      href="/#work"
      data-cursor="See the work"
      className="group relative z-0 block w-full max-md:hidden lg:col-span-5 lg:col-start-8 lg:row-start-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-[12px] bg-raised shadow-[0_40px_90px_-40px_rgba(0,0,0,0.85)] ring-1 ring-white/10">
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
                  sizes="(min-width: 1024px) 42vw, 94vw"
                  posterMedia={i === 0 ? "(min-width: 768px)" : undefined}
                  playing={on && !paused}
                />
              ) : (
                <Image
                  src={poster}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 42vw, 94vw"
                  className="object-cover object-top"
                />
              )}
            </div>
          );
        })}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-4">
        <span className="label flex shrink-0 items-center gap-2 text-fg">
          <span className="h-1.5 w-1.5 rounded-full bg-signal" />
          Now showing
        </span>
        <span
          key={p.slug}
          className="data min-w-0 truncate text-right text-muted animate-[fade-up_0.6s_var(--ease-out)_both]"
        >
          {pad(active + 1)}/{pad(items.length)} · {p.title}
          {p.live ? " · live" : " · client build"}
        </span>
      </div>
    </TransitionLink>
  );
}
