"use client";

import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { services } from "@/content/services";
import {
  Container,
  Reveal,
  Section,
  SectionHeader,
} from "@/components/primitives";
import { cn } from "@/lib/utils";

const spring = { type: "spring", stiffness: 380, damping: 38, mass: 0.9 } as const;

/**
 * 03 - Services as an editorial index. Each row is a hairline entry; on a fine
 * pointer, ink wipes up from the row's bottom edge, the title slides over, an
 * italic aside fades in and the arrow turns - all CSS, no listeners.
 *
 * Phones get an accordion instead of six tall rows: one entry open at a time,
 * and the ink block that marks it glides between rows (shared layout) while
 * the panels open and close under it.
 */
export function Services() {
  return (
    <Section id="services" surface="paper" sheet>
      <Container>
        <SectionHeader
          index="03"
          eyebrow="Services"
          meta="Freelance · Remote · Worldwide"
          title={["What I can", <em key="e">build for you.</em>]}
        />

        <ServiceAccordion />

        <ol className="hidden border-b border-line-strong md:block">
          {services.map((service, i) => (
            <Reveal
              key={service.title}
              as="li"
              className="row-wipe group border-t border-line-strong"
            >
              <div className="grid grid-cols-[4rem_1fr_auto] items-baseline gap-x-4 gap-y-3 py-9 transition-colors duration-500 ease-out-strong lg:grid-cols-[5rem_minmax(0,7fr)_minmax(0,4fr)_3rem] hover-device:group-hover:text-bg">
                <span className="data pt-1 text-muted transition-colors duration-500 hover-device:group-hover:text-bg/60">
                  03.{i + 1}
                </span>
                <h3 className="caps text-[clamp(1.5rem,3.4vw,3.25rem)] transition-transform duration-700 ease-out-strong hover-device:group-hover:translate-x-3">
                  {service.title}{" "}
                  <span className="serif inline-block translate-y-1 text-[1.1em] leading-none font-normal normal-case italic text-signal opacity-0 transition-[opacity,transform] duration-500 ease-out-strong [font-variation-settings:normal] hover-device:group-hover:translate-y-0 hover-device:group-hover:opacity-100">
                    {service.keyword}
                  </span>
                </h3>
                <p className="col-span-2 col-start-2 max-w-md text-[0.95rem] leading-relaxed text-muted transition-colors duration-500 lg:col-span-1 lg:col-start-3 hover-device:group-hover:text-bg/75">
                  {service.description}
                </p>
                <ArrowUpRight
                  aria-hidden
                  className="col-start-3 row-start-1 h-7 w-7 justify-self-end rotate-45 transition-transform duration-500 ease-out-strong lg:col-start-4 hover-device:group-hover:rotate-0"
                />
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

function ServiceAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ol className="-mx-2 md:hidden">
      {services.map((service, i) => {
        const on = open === i;
        const panel = `service-panel-${i}`;
        return (
          <Reveal key={service.title} as="li" stagger={i} className="relative">
            {on && (
              <m.span
                layoutId="service-open"
                transition={spring}
                aria-hidden
                className="absolute inset-0 rounded-2xl bg-ink"
              />
            )}
            <span
              aria-hidden
              className={cn(
                "absolute inset-x-2 top-0 h-px bg-line-strong transition-opacity duration-300",
                (on || open === i - 1 || i === 0) && "opacity-0",
              )}
            />
            <h3 className="relative">
              <button
                type="button"
                aria-expanded={on}
                aria-controls={panel}
                onClick={() => setOpen(on ? null : i)}
                className={cn(
                  "grid w-full grid-cols-[2.4rem_1fr_auto] items-center gap-x-3 px-4 py-[1.15rem] text-left transition-colors duration-500",
                  on ? "text-paper" : "text-fg",
                )}
              >
                <span className={cn("data transition-colors duration-500", on ? "text-signal" : "text-muted")}>
                  03.{i + 1}
                </span>
                <span className="caps text-[1.15rem] leading-tight">{service.title}</span>
                <span
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-full border transition-[transform,border-color] duration-500 ease-out-strong",
                    on ? "rotate-45 border-paper/30" : "border-line-strong",
                  )}
                >
                  <Plus className="h-3.5 w-3.5" />
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
                  className="relative overflow-hidden"
                >
                  <div className="px-4 pb-5 pl-[calc(1rem+2.4rem+0.75rem)] text-paper">
                    <p className="serif text-[1.45rem] italic leading-none text-signal">
                      {service.keyword}
                    </p>
                    <p className="mt-2.5 text-[0.95rem] leading-relaxed text-[#b9b2a6]">
                      {service.description}
                    </p>
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </Reveal>
        );
      })}
    </ol>
  );
}
