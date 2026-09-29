"use client";

import { useRef, useState } from "react";
import { process } from "@/content/process";
import { Container, Section, SectionHeader } from "@/components/primitives";
import { useScrollProgress } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * 04 — Process, as four poster words (the inspo's pillars). A rail fills as
 * the chapter scrolls through; each step's word goes from outline to solid as
 * the rail reaches it, and the step in progress burns signal red. The rail is
 * one `--p` custom property; steps only re-render when a threshold is crossed.
 */
export function Process() {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [reached, setReached] = useState(-1);

  useScrollProgress(trackRef, [[0, 0.7], [1, 0.6]], (p) => {
    railRef.current?.style.setProperty("--p", p.toFixed(4));
    const next = p < 0.02 ? -1 : Math.min(process.length - 1, Math.floor(p * 4.2));
    setReached((r) => (r === next ? r : next));
  });

  const current = reduce ? process.length - 1 : reached;

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
          {/* Rails: vertical beside the steps on small screens, a hairline
              across the top on large ones. `--p` lands on this
              display:contents node, so only the two fills restyle. */}
          <div ref={railRef} className="contents">
            <div
              aria-hidden
              className="absolute bottom-0 left-0 top-0 w-px bg-line lg:hidden"
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

          <ol className="grid gap-x-16 gap-y-14 pl-6 sm:gap-y-20 lg:grid-cols-2 lg:pl-0">
            {process.map((item, i) => {
              const on = i <= current;
              const now = i === current;
              return (
                <li key={item.step} data-reveal="" className="relative">
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
                      "display mt-5 text-[clamp(2.6rem,11vw,5.5rem)] lg:text-[6.2vw] min-[1600px]:text-[6.2rem] transition-[color,-webkit-text-stroke-color] duration-700 ease-out-strong [-webkit-text-stroke-width:1px]",
                      on
                        ? now
                          ? "text-signal [-webkit-text-stroke-color:transparent]"
                          : "text-fg [-webkit-text-stroke-color:transparent]"
                        : "text-transparent [-webkit-text-stroke-color:var(--line-strong)]",
                    )}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-muted text-pretty">
                    {item.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
