import { flagshipProjects } from "@/content/projects";
import { Container, Reveal, SectionHeader } from "@/components/primitives";
import { FlagshipCard } from "@/components/project-card";
import { ShowcaseCard } from "@/components/showcase-card";

export function SelectedWork() {
  return (
    <section id="work" className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow="Selected work"
            title="Products, built end to end."
          />
        </Reveal>

        <div className="space-y-6 sm:space-y-8">
          {flagshipProjects.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.05}>
              <ShowcaseCard className="p-6 sm:p-9" tilt={3} lift={0} glow={520}>
                <FlagshipCard project={project} index={i} />
              </ShowcaseCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
