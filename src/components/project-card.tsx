import Link from "next/link";
import { ArrowRight, ArrowUpRight, Github } from "lucide-react";
import type { Project } from "@/content/projects";
import { MediaFrame } from "@/components/primitives";
import { Tilt } from "@/components/motion-fx";

export function FlagshipCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const num = String(index + 1).padStart(2, "0");
  const caseHref = `/work/${project.slug}`;

  return (
    <div className="group border-t border-border py-10 sm:py-12">
      <div className="grid gap-8 md:grid-cols-12 md:items-center">
        <div className="md:col-span-7">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="eyebrow">{num}</span>
            <span className="eyebrow">
              {project.year}
              {project.role ? ` · ${project.role}` : ""}
            </span>
          </div>

          <h3 className="display mt-4 text-3xl sm:text-4xl md:text-[2.75rem]">
            <Link
              href={caseHref}
              className="transition-colors group-hover:text-accent"
            >
              {project.title}
            </Link>
          </h3>

          <p className="mt-3 max-w-xl text-muted text-balance">
            {project.tagline}
          </p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-border px-3 py-1 font-mono text-[0.7rem] tracking-wide text-muted"
              >
                {tag}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <Link
              href={caseHref}
              className="inline-flex items-center gap-2 font-medium text-foreground"
            >
              Read case study
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline inline-flex items-center gap-1.5 text-muted hover:text-foreground"
              >
                Live site
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline inline-flex items-center gap-1.5 text-muted hover:text-foreground"
              >
                <Github className="h-4 w-4" />
                Code
              </a>
            )}
          </div>
        </div>

        <div className="md:col-span-5">
          <Link href={caseHref} className="block">
            <Tilt>
              <MediaFrame
                src={project.image}
                alt={`${project.title} preview`}
                label={`${project.title} — cover`}
                className="transition-transform duration-500 group-hover:scale-[1.01]"
              />
            </Tilt>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function SecondaryCard({ project }: { project: Project }) {
  return (
    <div className="group flex flex-col">
      <Tilt max={5}>
        <MediaFrame
          src={project.image}
          alt={`${project.title} preview`}
          label={project.title}
          ratio="aspect-[16/10]"
        />
      </Tilt>

      <div className="mt-5">
        <h3 className="text-xl font-semibold">{project.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {project.summary}
        </p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[0.65rem] tracking-wide text-faint"
            >
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-center gap-5 text-sm">
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline inline-flex items-center gap-1.5 text-foreground"
            >
              Live <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline inline-flex items-center gap-1.5 text-muted hover:text-foreground"
            >
              <Github className="h-4 w-4" /> Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
