import { secondaryProjects } from "@/content/projects";
import { Container, Reveal, SectionHeader } from "@/components/primitives";
import { SecondaryCard } from "@/components/project-card";

export function MoreWork() {
  return (
    <section className="border-t border-border py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow="More work"
            title="Other things I've shipped."
          />
        </Reveal>

        <div className="grid gap-10 sm:grid-cols-2 sm:gap-8">
          {secondaryProjects.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.05}>
              <SecondaryCard project={project} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
