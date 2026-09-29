import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/projects";
import { profile } from "@/content/profile";
import { BriefLink } from "@/components/brief-link";
import { Container, Lines, Roll } from "@/components/primitives";

/**
 * The closer at the end of every case study, where interest peaks: a
 * signal-red sheet between the story and "Next case study". Clients get the
 * brief pre-set to this kind of build; hiring teams get the résumé and a
 * direct line about a role.
 */
export function CaseStudyCta({ project }: { project: Project }) {
  return (
    <section
      data-surface="signal"
      aria-label="Start a project"
      className="relative -mt-(--sheet-radius) rounded-t-(--sheet-radius) pb-[calc(3.5rem+var(--sheet-radius))] pt-[calc(3.5rem+var(--sheet-radius))] sm:pb-[calc(5.5rem+var(--sheet-radius))] sm:pt-[calc(5rem+var(--sheet-radius))]"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <p className="label">Your turn</p>
            <Lines
              as="h2"
              lines={["Want one", <em key="e">like this?</em>]}
              className="display mt-5 text-[clamp(2.4rem,6vw,6rem)]"
            />
            <p className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-muted text-pretty sm:text-lg">
              Tell me what you&apos;re building. You&apos;ll hear back within 24 hours,
              with a fixed quote before any work starts.
            </p>
          </div>
          <div className="flex flex-col gap-5 lg:col-span-5 lg:items-end">
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <BriefLink brief={project.brief ?? "webapp"} className="btn btn-solid group/roll">
                <Roll>Start a project</Roll>
                <ArrowRight aria-hidden className="h-3.5 w-3.5" />
              </BriefLink>
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-line group/roll"
              >
                <Roll>Résumé</Roll>
                <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
              </a>
            </div>
            <p className="label text-muted">
              Hiring?{" "}
              <BriefLink brief="hiring" className="link-underline text-fg">
                Talk to me about a role
              </BriefLink>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
