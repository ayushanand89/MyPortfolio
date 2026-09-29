"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { testimonials, trustPoints } from "@/content/testimonials";
import {
  Container,
  Reveal,
  Section,
  SectionHeader,
} from "@/components/primitives";

/**
 * Voices (deliberately unnumbered). One quote at a time, set large in the
 * serif; stepping re-mounts it so each quote rises in fresh. Manual controls
 * only — no auto-advance to chase.
 */
export function Testimonials() {
  const [index, setIndex] = useState(0);
  const count = testimonials.length;
  const t = testimonials[index];
  const step = (dir: 1 | -1) => setIndex((i) => (i + dir + count) % count);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <Section id="testimonials" surface="ink" sheet>
      <Container>
        <SectionHeader
          eyebrow="Voices"
          meta={`${pad(index + 1)} / ${pad(count)}`}
          title={["What working", <em key="e">with me is like.</em>]}
        />

        <Reveal>
          <figure className="grid gap-10 lg:grid-cols-12">
            <span
              aria-hidden
              className="serif select-none text-[clamp(6rem,14vw,13rem)] leading-[0.7] text-signal lg:col-span-2"
            >
              &ldquo;
            </span>
            <div className="lg:col-span-10">
              <blockquote
                key={index}
                aria-live="polite"
                className="serif max-w-5xl animate-[fade-up_0.8s_var(--ease-out)_both] text-[clamp(1.9rem,4vw,4rem)] leading-[1.08] tracking-tight text-balance"
              >
                {t.quote}
              </blockquote>
              <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-line pt-6">
                <figcaption
                  key={`c${index}`}
                  className="animate-[fade-up_0.8s_var(--ease-out)_0.1s_both]"
                >
                  <div className="caps text-lg">{t.name}</div>
                  <div className="data mt-1.5 text-muted">{t.role}</div>
                </figcaption>
                <div className="flex items-center gap-2">
                  <StepButton label="Previous testimonial" onClick={() => step(-1)}>
                    <ArrowLeft className="h-4 w-4" />
                  </StepButton>
                  <StepButton label="Next testimonial" onClick={() => step(1)}>
                    <ArrowRight className="h-4 w-4" />
                  </StepButton>
                </div>
              </div>
            </div>
          </figure>
        </Reveal>

        <Reveal className="label mt-20 flex flex-wrap items-center gap-x-4 gap-y-3 text-muted sm:mt-28">
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

function StepButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="btn btn-line h-12 w-12 justify-center p-0!"
    >
      {children}
    </button>
  );
}
