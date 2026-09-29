import { flagshipProjects } from "@/content/projects";
import { Container, SectionHeader } from "@/components/primitives";
import { ProjectDeck, ProjectFeature } from "@/components/project-card";
import { Marquee } from "@/components/marquee";
import { Engineering } from "@/components/sections/engineering";

const years = flagshipProjects.map((p) => Number(p.year));
const span = `${Math.min(...years)}–${Math.max(...years)}`;
const liveCount = flagshipProjects.filter((p) => p.live).length;

/**
 * 01 - Work, the "screening room". A paper sheet that slides up over the
 * pinned hero with the red tape across its seam. Each project gets a full
 * chapter: its real site playing in browser chrome, the mobile version beside
 * it, and a readable spec with the two actions that matter.
 */
export function SelectedWork() {
  return (
    <section
      id="work"
      data-surface="paper"
      className="relative z-10 rounded-t-(--sheet-radius) pb-[calc(3.5rem+var(--sheet-radius))] pt-14 shadow-[0_-40px_80px_-30px_rgba(0,0,0,0.6)] sm:pb-[calc(7rem+var(--sheet-radius))] md:pt-40"
    >
      {/* The tape is wider than the viewport and tilted; clip it on x only so
          it can still straddle the seam without widening the page. Phones get
          the plain sheet edge - calmer, and one less thing on screen. */}
      <div className="absolute inset-x-0 top-0 z-20 -translate-y-1/2 overflow-x-clip max-md:hidden">
        <Marquee />
      </div>

      <Container>
        <SectionHeader
          index="01"
          eyebrow="Selected work"
          meta={`${String(flagshipProjects.length).padStart(2, "0")} case studies · ${liveCount} live · ${span}`}
          title={["Products, built", <em key="e">end to end.</em>]}
          className="mb-8 sm:mb-10"
        />
        {/* Phones get the deck; tablets and up, the full screening. Both are
            rendered (no hydration guesswork) - hidden media never loads. */}
        <div className="md:hidden">
          <ProjectDeck projects={flagshipProjects} />
        </div>
        <div className="hidden md:block">
          {flagshipProjects.map((project, i) => (
            <ProjectFeature
              key={project.slug}
              project={project}
              index={i}
              total={flagshipProjects.length}
            />
          ))}
        </div>
        <Engineering />
      </Container>
    </section>
  );
}
