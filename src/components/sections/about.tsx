"use client";

import { useRef, type CSSProperties } from "react";
import { profile } from "@/content/profile";
import { Reveal } from "@/components/primitives";
import { useScrollProgress } from "@/lib/motion";

/**
 * 02 — the identity chapter, an ink sheet over Work. The manifesto pins to
 * the viewport and lights word by word as you scroll: one `--p` custom
 * property on the paragraph, each word derives its opacity in CSS. Below it,
 * the facts as a hairline spec sheet. Reduced motion shows everything lit.
 */
export function About() {
  const pinRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  // Measured on the non-sticky pin track; written to the paragraph only.
  useScrollProgress(pinRef, [[0, 0.45], [1, 1]], (p) => {
    textRef.current?.style.setProperty("--p", p.toFixed(4));
  });

  const words = profile.about.manifesto.split(" ");
  const highlights = profile.about.highlights as readonly string[];

  return (
    <section
      id="about"
      data-surface="ink"
      className="relative -mt-(--sheet-radius) rounded-t-(--sheet-radius)"
    >
      <div ref={pinRef} className="relative h-[150svh] md:h-[200svh]">
        <div className="sticky top-0 flex h-svh flex-col justify-center">
          <div className="gutter mx-auto w-full max-w-[1600px]">
            <div className="label relative flex items-center justify-between pt-4">
              <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-line-strong" />
              <span>
                <span className="text-accent">(02)&nbsp;&nbsp;</span>About
              </span>
              <span className="text-muted">Manifesto</span>
            </div>
            <p
              ref={textRef}
              className="manifesto serif mt-10 max-w-[24ch] text-[clamp(2.2rem,6.4vw,6.75rem)] leading-[0.98] tracking-tight sm:mt-14"
              style={{ "--words": words.length + 3 } as CSSProperties}
            >
              {words.map((word, i) => {
                const bare = word.replace(/[.,—'’]/g, "").toLowerCase();
                return (
                  <span
                    key={i}
                    style={{ "--w": i } as CSSProperties}
                    className={
                      highlights.includes(bare) ? "italic text-accent" : undefined
                    }
                  >
                    {word}{" "}
                  </span>
                );
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Verifiable facts — identity backed by proof. */}
      <div className="gutter mx-auto max-w-[1600px] pb-[calc(3.5rem+var(--sheet-radius))] sm:pb-[calc(9rem+var(--sheet-radius))]">
        <dl className="grid grid-cols-2 border-t border-line-strong lg:grid-cols-4">
          {profile.about.facts.map((fact, i) => (
            <Reveal
              key={fact.label}
              stagger={i}
              className="border-b border-line py-5 pr-4 odd:border-r odd:pr-4 even:pl-4 sm:py-6 sm:pr-8 lg:border-b-0 lg:border-r lg:py-8 lg:pl-6 lg:odd:pr-8 lg:even:pl-6 lg:first:pl-0 lg:last:border-r-0"
            >
              <dt className="data text-muted">
                0{i + 1} — {fact.label}
              </dt>
              <dd className="caps mt-3 text-[1.05rem] leading-tight sm:mt-4 sm:text-[1.35rem]">{fact.value}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
