import { flagshipProjects } from "@/content/projects";
import { Container, Reveal, SectionHeader } from "@/components/primitives";
import { FlagshipCard } from "@/components/project-card";
import { ShowcaseCard } from "@/components/showcase-card";
import { ParallaxWatermark } from "@/components/motion-fx";

export function SelectedWork() {
  return (
    <section id="work" className="relative isolate py-20 sm:py-28">
      <ParallaxWatermark text="Work" align="right" />
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow="Selected work"
            title="Products, built end to end."
          />
        </Reveal>

        {/* Sticky stack: each card pins a little lower than the last, so they
            pile with a peeking edge as you scroll — on mobile and desktop alike.
            Cards are `solid` so the stacked ones don't bleed through. */}
        <div className="mt-4">
          {flagshipProjects.map((project, i) => (
            <div
              key={project.slug}
              className="sticky"
              style={{ top: `calc(5rem + ${i * 1.5}rem)` }}
            >
              <div className="pb-6 sm:pb-8">
                <ShowcaseCard
                  solid
                  className="p-6 sm:p-9"
                  tilt={3}
                  lift={0}
                  glow={520}
                >
                  <FlagshipCard project={project} index={i} />
                </ShowcaseCard>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
