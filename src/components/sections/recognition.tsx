import { recognition } from "@/content/recognition";
import { education } from "@/content/education";
import { Container, Reveal, SectionHeader } from "@/components/primitives";

export function Recognition() {
  return (
    <section id="recognition" className="border-t border-border py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeader
            index="05"
            eyebrow="Recognition"
            title="Selected highlights."
          />
        </Reveal>

        <div className="border-t border-border">
          {recognition.map((item) => (
            <Reveal key={item.title}>
              <div className="grid gap-2 border-b border-border py-6 md:grid-cols-12 md:gap-6">
                <div className="eyebrow pt-1 md:col-span-3">{item.meta}</div>
                <div className="md:col-span-9">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-1 text-muted text-balance">{item.detail}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-16">
            <span className="eyebrow">Education</span>
            <div className="mt-4 grid gap-2 border-y border-border py-6 md:grid-cols-12 md:gap-6">
              <div className="eyebrow pt-1 md:col-span-3">
                {education.period}
              </div>
              <div className="md:col-span-9">
                <h3 className="text-lg font-semibold">{education.degree}</h3>
                <p className="mt-1 text-muted">
                  {education.school} · {education.location}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
