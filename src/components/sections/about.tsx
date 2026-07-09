"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { profile } from "@/content/profile";
import { Container, Reveal, Section } from "@/components/primitives";
import { ParallaxGlow } from "@/components/motion-fx";
import { Scramble } from "@/components/scramble";

/**
 * The identity chapter. The site's signature scroll-scrubbed manifesto —
 * each word rises from dim to lit as the section travels through the
 * viewport — reworded in first person, beside an editorial portrait and a
 * hairline row of verifiable facts. Reduced motion shows everything lit and
 * still.
 */
export function About() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.55"],
  });

  const words = profile.about.manifesto.split(" ");

  return (
    <Section id="about" variant="spacious">
      <ParallaxGlow />
      <Container className="relative">
        <span aria-hidden className="chapter-num reveal">
          01
        </span>
        <p className="eyebrow mb-8">
          <span className="eyebrow-accent">01 — </span>
          <Scramble text="About" />
        </p>

        <p
          ref={ref}
          className="display max-w-4xl text-3xl leading-[1.15] text-balance sm:text-4xl md:text-5xl"
        >
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word
                key={i}
                progress={scrollYProgress}
                range={[start, end]}
                reduce={reduce}
              >
                {word}
              </Word>
            );
          })}
        </p>

        {/* Verifiable facts, hairline-divided — identity backed by proof
            within the first chapter. */}
        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {profile.about.facts.map((fact, i) => (
            <Reveal key={fact.label} stagger={i} className="h-full">
              <div className="h-full bg-background px-5 py-5">
                <span className="eyebrow">{fact.label}</span>
                <p className="mt-2 text-sm text-foreground/90">{fact.value}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function Word({
  progress,
  range,
  reduce,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  reduce: boolean | null;
  children: string;
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const bare = children.replace(/[.,—'’]/g, "").toLowerCase();
  const highlight = (
    profile.about.highlights as readonly string[]
  ).includes(bare);

  return (
    <span className="relative mr-[0.28em] inline-block">
      <motion.span
        style={{ opacity: reduce ? 1 : opacity }}
        className={highlight ? "text-accent" : undefined}
      >
        {children}
      </motion.span>
    </span>
  );
}
