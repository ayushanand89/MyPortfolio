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

        {/* Timeline rail that draws left→right as the section enters — the
            "idea → launch" progression feeding the steps (lg only, where the
            grid is a single 4-across row). */}
        <div
          aria-hidden
          className="relative mb-8 hidden h-0.5 w-full bg-border lg:block"
        >
          <span className="rule-draw absolute inset-y-0 left-0 w-full bg-linear-to-r from-accent via-accent/80 to-transparent" />
        </div>

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
