"use client";

import { testimonials, trustPoints } from "@/content/testimonials";
import {
  Container,
  Reveal,
  Section,
  SectionHeader,
} from "@/components/primitives";
import { SwipeDeck } from "@/components/swipe-deck";

/**
 * Voices (deliberately unnumbered). The quotes are a physical deck of paper
 * cards — drag one away (or use the arrows / ← →) and it's flung off and
 * tucked in at the back. Manual only; nothing auto-advances.
 */
export function Testimonials() {
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <Section id="testimonials" surface="ink" sheet>
      <Container>
        <SectionHeader
          eyebrow="Voices"
          meta={`${pad(testimonials.length)} notes · drag to shuffle`}
          title={["What working", <em key="e">with me is like.</em>]}
        />

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="hidden lg:col-span-4 lg:block">
            <span
              aria-hidden
              className="serif block select-none text-[clamp(8rem,14vw,13rem)] leading-[0.7] text-signal"
            >
              &ldquo;
            </span>
            <ul className="label mt-12 space-y-3 text-muted">
              {trustPoints.map((point) => (
                <li key={point} className="flex items-center gap-3">
                  <span aria-hidden className="text-signal">
                    ✺
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal variant="scale" className="lg:col-span-8">
            <SwipeDeck
              items={testimonials}
              keyOf={(t) => t.name}
              label="Testimonials"
              render={(t, { index }) => (
                <figure
                  data-surface="paper"
                  className="flex h-full min-h-[21rem] flex-col rounded-[22px] bg-bg p-6 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.8)] sm:min-h-[24rem] sm:p-10"
                >
                  <div className="flex items-start justify-between gap-6">
                    <span
                      aria-hidden
                      className="serif select-none text-[4.5rem] leading-[0.6] text-accent"
                    >
                      &ldquo;
                    </span>
                    <span className="data text-muted">
                      {pad(index + 1)} / {pad(testimonials.length)}
                    </span>
                  </div>
                  <blockquote className="serif mt-5 text-[clamp(1.4rem,4.4vw,2.6rem)] leading-[1.1] tracking-tight text-balance">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-auto flex items-center gap-4 border-t border-line pt-5">
                    <span
                      aria-hidden
                      className="caps grid h-11 w-11 shrink-0 place-items-center rounded-full bg-fg text-[0.8rem] text-bg"
                    >
                      {t.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                    </span>
                    <span>
                      <span className="caps block text-[1.05rem]">{t.name}</span>
                      <span className="data mt-1 block text-muted">{t.role}</span>
                    </span>
                  </figcaption>
                </figure>
              )}
            />
          </Reveal>
        </div>

        <Reveal className="label mt-12 flex flex-wrap items-center gap-x-4 gap-y-3 text-muted lg:hidden">
          {trustPoints.map((point, i) => (
            <span key={point} className="flex items-center gap-4">
              {i > 0 && (
                <span aria-hidden className="text-signal">
                  ✺
                </span>
              )}
              {point}
            </span>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
