"use client";

import { useRef, useState, type CSSProperties, type UIEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { engineering } from "@/content/engineering";
import { SectionHeader } from "@/components/primitives";
import { TransitionLink } from "@/components/transition-link";

/**
 * 02 - Under the hood. Closes the Work sheet with the decisions behind the
 * screens above, for the engineers and hiring teams reading along: each note
 * is problem → decision → a verifiable number, linked to its evidence.
 * Desktop: an editorial 3 × 2 grid. Phones: a swipe rail with a progress bar
 * (the same pattern as Process), so six notes cost one screen of height.
 */
export function Engineering() {
  const barRef = useRef<HTMLSpanElement>(null);
  const [slide, setSlide] = useState(0);
  const n = engineering.length;

  const onSwipe = (e: UIEvent<HTMLOListElement>) => {
    const el = e.currentTarget;
    const max = el.scrollWidth - el.clientWidth;
    const p = max > 0 ? el.scrollLeft / max : 0;
    const k = 1 / n;
    barRef.current?.style.setProperty("transform", `scaleX(${(k + p * (1 - k)).toFixed(4)})`);
    const next = Math.round(p * (n - 1));
    setSlide((s) => (s === next ? s : next));
  };

  return (
    <div id="engineering" className="pt-16 sm:pt-24 lg:pt-32">
      <SectionHeader
        index="02"
        eyebrow="Engineering"
        meta="Six decisions · with the evidence"
        title={["Built right,", <em key="e">under the hood.</em>]}
        className="mb-6 sm:mb-8"
      />
      <p className="mb-10 max-w-xl text-[1rem] leading-relaxed text-muted text-pretty sm:mb-14 sm:text-[1.05rem]">
        For engineers and hiring teams: the decisions behind the screens above.
        Security, money, AI, state and scale, each tied to a real build.
      </p>

      <ol
        onScroll={onSwipe}
        className="no-scrollbar -mx-(--gutter) flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-(--gutter) scroll-px-(--gutter) md:mx-0 md:grid md:grid-cols-2 md:gap-x-10 md:gap-y-14 md:overflow-visible md:px-0 lg:grid-cols-3 lg:gap-x-12"
      >
        {engineering.map((note, i) => (
          <li
            key={note.title}
            data-reveal=""
            style={{ "--i": i % 3 } as CSSProperties}
            className="flex w-[84%] max-w-[22rem] shrink-0 snap-start flex-col rounded-[20px] border border-line-strong p-5 md:w-auto md:max-w-none md:rounded-none md:border-0 md:border-t md:p-0 md:pt-6"
          >
            <div className="label flex items-center justify-between gap-3">
              <span className="text-accent">{note.area}</span>
              <TransitionLink
                href={note.source.href}
                className="data group/src inline-flex items-center gap-1 text-muted transition-colors hover:text-fg"
              >
                {note.source.label}
                <ArrowUpRight
                  aria-hidden
                  className="h-3 w-3 transition-transform duration-300 group-hover/src:-translate-y-0.5 group-hover/src:translate-x-0.5"
                />
              </TransitionLink>
            </div>
            <h3 className="caps mt-5 text-[1.25rem] leading-[1.1] text-balance sm:text-[1.4rem]">
              {note.title}
            </h3>
            <p className="mb-6 mt-3 text-[0.95rem] leading-relaxed text-muted text-pretty">{note.body}</p>
            <div className="mt-auto flex items-baseline gap-3 border-t border-line pt-4">
              <span className="display whitespace-nowrap text-[1.6rem]">{note.metric.value}</span>
              <span className="data leading-snug text-muted">{note.metric.label}</span>
            </div>
          </li>
        ))}
      </ol>

      {/* Phones: where you are in the rail. */}
      <div aria-hidden className="mt-6 flex items-center gap-4 md:hidden">
        <span className="data tabular-nums text-muted">
          <span className="text-fg">{String(slide + 1).padStart(2, "0")}</span> /{" "}
          {String(n).padStart(2, "0")}
        </span>
        <span className="relative h-px flex-1 bg-line-strong">
          <span
            ref={barRef}
            className="absolute inset-0 origin-left bg-accent transition-transform duration-150"
            style={{ transform: `scaleX(${1 / n})` }}
          />
        </span>
        <span className="label text-muted">Swipe</span>
      </div>
    </div>
  );
}
