import { process } from "@/content/process";
import { Container, Reveal, SectionHeader } from "@/components/primitives";
import { ParallaxWatermark } from "@/components/motion-fx";

export function Process() {
  return (
    <section
      id="process"
      className="relative isolate border-t border-border py-20 sm:py-28"
    >
      <ParallaxWatermark text="Process" align="left" />
      <Container>
        <Reveal>
          <SectionHeader title="From idea to launch." />
        </Reveal>

        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
          {process.map((item, i) => (
            <Reveal
              key={item.step}
              variant="scale"
              stagger={i}
              className="h-full"
            >
              <div className="h-full bg-background p-7">
                <span className="display text-4xl text-accent">{item.step}</span>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
