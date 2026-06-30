import { flagshipProjects } from "@/content/projects";
import { Container, Reveal, SectionHeader } from "@/components/primitives";
import { FlagshipCard } from "@/components/project-card";

export function SelectedWork() {
  return (
    <section id="work" className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeader
            index="01"
            eyebrow="Selected work"
            title="Three products, built end to end."
          />
        </Reveal>

        <div className="border-b border-border">
          {flagshipProjects.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.05}>
              <FlagshipCard project={project} index={i} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
