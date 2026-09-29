"use client";

import { useRef, useState, type UIEvent } from "react";
import { process } from "@/content/process";
import { Container, Section, SectionHeader } from "@/components/primitives";
import { useScrollProgress } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/use-media-query";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * 04 - Process, as four poster words (the inspo's pillars). A rail fills as
 * the chapter scrolls through; each step's word goes from outline to solid as
 * the rail reaches it, and the step in progress burns signal red. The rail is
 * one `--p` custom property; steps only re-render when a threshold is crossed.
 *
 * Phones swipe through the steps instead (a snap carousel): the step centred
 * burns red, and the rail tracks the swipe rather than the page.
 */
export function Process() {
  const reduce = useReducedMotion();
  const wide = useMediaQuery("(min-width: 768px)");
  const trackRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const swipeBarRef = useRef<HTMLSpanElement>(null);
  const [reached, setReached] = useState(-1);
  const [slide, setSlide] = useState(0);

  useScrollProgress(trackRef, [[0, 0.7], [1, 0.6]], (p) => {
    railRef.current?.style.setProperty("--p", p.toFixed(4));
    const next = p < 0.02 ? -1 : Math.min(process.length - 1, Math.floor(p * 4.2));
    setReached((r) => (r === next ? r : next));
  });

  const onSwipe = (e: UIEvent<HTMLOListElement>) => {
    const el = e.currentTarget;
    const max = el.scrollWidth - el.clientWidth;
    const p = max > 0 ? el.scrollLeft / max : 0;
    const k = 1 / process.length;
    swipeBarRef.current?.style.setProperty("transform", `scaleX(${(k + p * (1 - k)).toFixed(4)})`);
    const next = Math.round(p * (process.length - 1));
    setSlide((s) => (s === next ? s : next));
  };

  const current = reduce ? process.length - 1 : wide ? reached : slide;

  return (
    <Section
      id="process"
      surface="ink"
      sheet
      className="bg-[radial-gradient(ellipse_70%_55%_at_85%_25%,rgba(192,39,26,0.42),transparent_70%),radial-gradient(ellipse_55%_45%_at_5%_95%,rgba(192,39,26,0.22),transparent_70%)]"
    >
      <Container>
        <SectionHeader
          index="04"
          eyebrow="Process"
          meta="Four steps · no surprises"
          title={["From idea", <em key="e">to launch.</em>]}
        />

        <div ref={trackRef} className="relative">
          {/* Rails: vertical beside the steps on tablets, a hairline across
              the top on large screens. `--p` lands on this display:contents
              node, so only the two fills restyle. */}
          <div ref={railRef} className="contents">
            <div
              aria-hidden
              className="absolute bottom-0 left-0 top-0 hidden w-px bg-line md:block lg:hidden"
            >
              <span
                className="absolute inset-0 origin-top bg-signal"
                style={{ transform: "scaleY(var(--p, 1))" }}
              />
            </div>
            <div aria-hidden className="relative mb-12 hidden h-px bg-line lg:block">
              <span
                className="absolute inset-0 origin-left bg-linear-to-r from-signal via-signal to-signal/40"
                style={{ transform: "scaleX(var(--p, 1))" }}
              />
            </div>
          </div>

          <ol
            onScroll={wide ? undefined : onSwipe}
            className="no-scrollbar -mx-(--gutter) flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-(--gutter) scroll-px-(--gutter) md:mx-0 md:grid md:gap-x-16 md:gap-y-20 md:overflow-visible md:px-0 md:pl-6 lg:grid-cols-2 lg:pl-0"
          >
            {process.map((item, i) => {
              const on = i <= current;
              const now = i === current;
              return (
                <li
                  key={item.step}
                  data-reveal=""
                  className={cn(
                    "relative w-[80%] max-w-[22rem] shrink-0 snap-start rounded-[20px] border p-5 transition-[border-color,background-color] duration-500 md:w-auto md:max-w-none md:rounded-none md:border-0 md:bg-transparent md:p-0",
                    now ? "border-signal/50 bg-white/[0.03]" : "border-line",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={cn(
                        "data transition-colors duration-700",
                        on ? "text-signal" : "text-muted",
                      )}
                    >
                      {item.step}
                    </span>
                    <span className="h-px w-10 bg-line-strong" />
                    <span className="label text-muted">
                      Step {i + 1} of {process.length}
                    </span>
                  </div>
                  <h3
                    className={cn(
                      "display mt-5 text-[clamp(1.9rem,8.8vw,3rem)] md:text-[clamp(2.6rem,11vw,5.5rem)] lg:text-[min(6.2vw,6.2rem)] transition-[color,-webkit-text-stroke-color] duration-700 ease-out-strong [-webkit-text-stroke-width:1px]",
                      on
                        ? now
                          ? "text-signal [-webkit-text-stroke-color:transparent]"
                          : "text-fg [-webkit-text-stroke-color:transparent]"
                        : "text-transparent [-webkit-text-stroke-color:var(--line-strong)]",
                    )}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-md text-[1rem] leading-relaxed text-muted text-pretty md:mt-6 md:text-[1.05rem]">
                    {item.description}
                  </p>
                </li>
              );
            })}
          </ol>

          {/* Phones: where you are in the swipe. */}
          <div aria-hidden className="mt-6 flex items-center gap-4 md:hidden">
            <span className="data tabular-nums text-muted">
              <span className="text-fg">{String(slide + 1).padStart(2, "0")}</span> /{" "}
              {String(process.length).padStart(2, "0")}
            </span>
            <span className="relative h-px flex-1 bg-line">
              <span
                ref={swipeBarRef}
                className="absolute inset-0 origin-left bg-signal transition-transform duration-150"
                style={{ transform: `scaleX(${1 / process.length})` }}
              />
            </span>
            <span className="label text-muted">Swipe</span>
          </div>
        </div>
      </Container>
    </Section>
  );
}
