"use client";

import { ArrowUpRight, Github } from "lucide-react";
import type { Project } from "@/content/projects";
import { MediaFrame } from "@/components/media-frame";
import { Parallax } from "@/components/motion-fx";

/** Compact card for secondary projects. (Currently unused — kept on purpose.) */
export function SecondaryCard({ project }: { project: Project }) {
  return (
    <div className="group flex flex-col">
      <Parallax amount={28} zoom={0.08}>
        <MediaFrame
          src={project.image}
          alt={`${project.title} preview`}
          label={project.title}
          ratio="aspect-[16/10]"
          className="rounded-xl transition-transform duration-500 ease-out-strong hover-device:group-hover:scale-[1.03]"
        />
      </Parallax>

      <div className="mt-5">
        <h3 className="caps text-xl">{project.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {project.summary}
        </p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="data rounded-full border border-line px-2.5 py-0.5 text-faint"
            >
              {tag}
            </li>
          ))}
        </ul>

        <div className="label mt-5 flex items-center gap-5">
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline inline-flex items-center gap-1.5 text-fg"
            >
              Live <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline inline-flex items-center gap-1.5 text-muted hover:text-fg"
            >
              <Github className="h-3.5 w-3.5" /> Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
