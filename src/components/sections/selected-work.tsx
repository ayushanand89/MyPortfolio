import { flagshipProjects } from "@/content/projects";
import {
  Container,
  Reveal,
  Section,
  SectionHeader,
} from "@/components/primitives";
import { FlagshipCard } from "@/components/project-card";
import { ShowcaseCard } from "@/components/showcase-card";
import {
  ParallaxWatermark,
  ScrollApproach,
  StackPanel,
} from "@/components/motion-fx";

export function SelectedWork() {
  return (
    <Section id="work" variant="spacious">
      <ParallaxWatermark text="Work" align="right" />
      <Container wide>
        <Reveal>
          <SectionHeader
            index="02"
            eyebrow="Selected work"
            title="Products, built end to end."
          />
        </Reveal>

        {/* Sticky stack: each card pins a little lower than the last, so they
            pile with a peeking edge as you scroll — on mobile and desktop alike.
            Cards are `solid` so the stacked ones don't bleed through. */}
        <div className="mt-4">
          {flagshipProjects.map((project, i) => (
            <StackPanel
              key={project.slug}
              className="sticky"
              top={`calc(5rem + ${i * 1.5}rem)`}
            >
              <div className="pb-6 sm:pb-8">
                <ScrollApproach>
                  <ShowcaseCard solid className="p-6 sm:p-9" glow={520}>
                    <FlagshipCard project={project} index={i} />
                  </ShowcaseCard>
                </ScrollApproach>
              </div>
            </StackPanel>
          ))}
        </div>
      </Container>
    </Section>
  );
}
