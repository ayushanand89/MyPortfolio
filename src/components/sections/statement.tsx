"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { Container } from "@/components/primitives";
import { ParallaxGlow } from "@/components/motion-fx";

const STATEMENT =
  "I design and build digital products end to end — obsessing over the details most people never notice, because that is exactly what makes software feel effortless.";

/**
 * Scroll-scrubbed manifesto. Each word rises from dim to lit as the section
 * travels through the viewport, so the sentence *writes itself* under the
 * scroll — the signature "unfurl as you scroll" moment. Reduced motion shows
 * the full statement, lit and still.
 */
export function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.55"],
  });

  const words = STATEMENT.split(" ");

  return (
    <section className="relative isolate py-28 sm:py-40">
      <ParallaxGlow />
      <Container>
        <p className="eyebrow mb-8">How I work</p>
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
      </Container>
    </section>
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
  const accent = children.replace(/[.,—]/g, "").toLowerCase();
  const highlight = accent === "effortless" || accent === "end";

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
