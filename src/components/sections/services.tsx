import { ArrowUpRight } from "lucide-react";
import { services } from "@/content/services";
import {
  Container,
  Reveal,
  Section,
  SectionHeader,
} from "@/components/primitives";

/**
 * 03 — Services as an editorial index. Each row is a hairline entry; on a fine
 * pointer, ink wipes up from the row's bottom edge, the title slides over, an
 * italic aside fades in and the arrow turns — all CSS, no listeners.
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

        <ol className="border-b border-line-strong">
          {services.map((service, i) => (
            <Reveal
              key={service.title}
              as="li"
              className="row-wipe group border-t border-line-strong"
            >
              <div className="grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 gap-y-3 py-7 transition-colors duration-500 ease-out-strong sm:grid-cols-[4rem_1fr_auto] sm:py-9 lg:grid-cols-[5rem_minmax(0,7fr)_minmax(0,4fr)_3rem] hover-device:group-hover:text-bg">
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
                  className="col-start-3 row-start-1 h-6 w-6 justify-self-end rotate-45 transition-transform duration-500 ease-out-strong sm:h-7 sm:w-7 lg:col-start-4 hover-device:group-hover:rotate-0"
                />
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
