import { Check, Quote } from "lucide-react";
import { testimonials, trustPoints } from "@/content/testimonials";
import { Container, Reveal, SectionHeader } from "@/components/primitives";

export function Testimonials() {
  return (
    <section id="testimonials" className="border-t border-border py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeader
            index="07"
            eyebrow="Trust"
            title="What working with me is like."
          />
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={i} className="h-full">
              <figure className="flex h-full flex-col rounded-xl border border-border p-7">
                <Quote className="h-6 w-6 text-accent/60" />
                <blockquote className="mt-4 flex-1 leading-relaxed text-foreground/90">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-border pt-4">
                  <div className="font-medium">{t.name}</div>
                  <div className="text-sm text-muted">{t.role}</div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3">
            {trustPoints.map((point) => (
              <li
                key={point}
                className="flex items-center gap-2 text-sm text-muted"
              >
                <Check className="h-4 w-4 text-accent" />
                {point}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
