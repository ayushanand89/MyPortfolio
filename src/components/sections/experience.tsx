import { ArrowUpRight } from "lucide-react";
import { experience } from "@/content/experience";
import { Container, Reveal, SectionHeader } from "@/components/primitives";
import { ParallaxWatermark } from "@/components/motion-fx";

export function Experience() {
  return (
    <section
      id="experience"
      className="relative isolate border-t border-border py-20 sm:py-28"
    >
      <ParallaxWatermark text="Career" align="right" />
      <Container>
        <Reveal>
          <SectionHeader title="Where I've been working." />
        </Reveal>

        <div className="border-t border-border">
          {experience.map((item) => (
            <Reveal key={`${item.company}-${item.period}`}>
              <article className="grid gap-6 border-b border-border py-10 md:grid-cols-12">
                <div className="md:col-span-4">
                  <h3 className="text-xl font-semibold">{item.role}</h3>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-muted">
                    {item.company}
                    <ArrowUpRight className="h-3.5 w-3.5 text-faint" />
                  </p>
                  <p className="mt-3 eyebrow">
                    {item.period} · {item.location}
                  </p>
                </div>

                <div className="md:col-span-8">
                  <p className="text-lg text-foreground/90 text-balance">
                    {item.summary}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {item.highlights.map((h, i) => (
                      <li key={i} className="flex gap-3 text-muted">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        <span className="leading-relaxed">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
