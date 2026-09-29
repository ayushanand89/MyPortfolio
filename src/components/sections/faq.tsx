"use client";

import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Plus } from "lucide-react";
import { faq } from "@/content/faq";
import { Container, Reveal, Section, SectionHeader } from "@/components/primitives";
import { TransitionLink } from "@/components/transition-link";
import { cn } from "@/lib/utils";

const spring = { type: "spring", stiffness: 380, damping: 38, mass: 0.9 } as const;

// FAQPage structured data, so the answers can surface in search results.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

/**
 * FAQ (unnumbered, like Voices): the objections a client or recruiter has
 * right before reaching out, answered in one tap each. One open at a time;
 * panels open with a height spring. Sits just before Contact.
 */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq" surface="paper" sheet>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <SectionHeader
              eyebrow="FAQ"
              title={["Straight", <em key="e">answers.</em>]}
              titleClassName="lg:text-[clamp(2.3rem,3.8vw,4.3rem)]"
              className="mb-0! lg:sticky lg:top-28"
            />
          </div>

          <div className="lg:col-span-8">
            <ul className="border-b border-line-strong">
              {faq.map((item, i) => {
                const on = open === i;
                const panel = `faq-panel-${i}`;
                return (
                  <Reveal key={item.q} as="li" stagger={i} className="border-t border-line-strong">
                    <h3>
                      <button
                        type="button"
                        aria-expanded={on}
                        aria-controls={panel}
                        onClick={() => setOpen(on ? null : i)}
                        className="group/faq flex w-full items-center justify-between gap-6 py-5 text-left sm:py-6"
                      >
                        <span className="caps text-[1.05rem] leading-snug sm:text-[1.3rem]">
                          {item.q}
                        </span>
                        <span
                          className={cn(
                            "grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-[transform,background-color,border-color,color] duration-500 ease-out-strong",
                            on
                              ? "rotate-45 border-fg bg-fg text-bg"
                              : "border-line-strong hover-device:group-hover/faq:border-fg",
                          )}
                        >
                          <Plus className="h-4 w-4" />
                        </span>
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {on && (
                        <m.div
                          id={panel}
                          key="panel"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ ...spring, opacity: { duration: 0.25 } }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-2xl pb-6 text-[1rem] leading-relaxed text-muted text-pretty sm:text-[1.05rem]">
                            {item.a}
                          </p>
                        </m.div>
                      )}
                    </AnimatePresence>
                  </Reveal>
                );
              })}
            </ul>
            <p className="label mt-8 text-muted">
              Something else?{" "}
              <TransitionLink href="/#contact" className="link-underline text-fg">
                Ask me directly
              </TransitionLink>
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
