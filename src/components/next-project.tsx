"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/content/projects";
import Image from "next/image";
import { Container, Lines } from "@/components/primitives";
import { BrowserFrame } from "@/components/device-frames";
import { TransitionLink } from "@/components/transition-link";

/**
 * Next case study - an ink sheet over the article. Its cover morphs into the
 * next page's hero cover, so momentum carries between case studies.
 */
export function NextProject({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      data-surface="ink"
      className="relative -mt-(--sheet-radius) rounded-t-(--sheet-radius) pb-24 pt-[calc(4rem+var(--sheet-radius))] sm:pb-36 sm:pt-[calc(6rem+var(--sheet-radius))]"
    >
      <Container>
        <div className="label relative flex items-center justify-between pt-4">
          <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-line-strong" />
          <span>
            <span className="text-accent">({pad(index + 1)}/{pad(total)})&nbsp;&nbsp;</span>
            Next case study
          </span>
          <span className="text-muted">{project.domain}</span>
        </div>

        <TransitionLink
          href={`/work/${project.slug}`}
          morphRef={mediaRef}
          data-cursor="Next case"
          className="group mt-10 block"
        >
          <div className="flex items-end justify-between gap-4 sm:gap-6">
            {/* Sized so a single long word ("BARETHREADS") plus the arrow
                still fits a 360px column. */}
            <Lines
              as="h2"
              lines={[project.title]}
              className="display min-w-0 text-[clamp(1.6rem,7.2vw,7rem)] text-balance transition-colors duration-500 group-hover:text-signal"
            />
            <ArrowRight className="mb-[0.6vw] h-8 w-8 shrink-0 transition-transform duration-500 ease-out-strong group-hover:translate-x-2 sm:h-14 sm:w-14" />
          </div>
          <p className="serif mt-5 max-w-2xl text-[clamp(1.25rem,2vw,1.75rem)] italic text-muted">
            {project.tagline}
          </p>
          <div className="mt-10 rounded-[14px]">
            <BrowserFrame
              ref={mediaRef}
              host={project.live?.host ?? "private client build"}
              live={!!project.live}
              note="Private"
            >
              <Image
                src={project.media?.desktop?.poster ?? project.image ?? ""}
                alt={`${project.title} preview`}
                fill
                sizes="(min-width: 1600px) 1520px, 94vw"
                className="object-cover object-top transition-transform duration-1600 ease-out-strong hover-device:group-hover:scale-[1.03]"
              />
            </BrowserFrame>
          </div>
        </TransitionLink>
      </Container>
    </section>
  );
}
