"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, Github } from "lucide-react";
import type { Project, Stat } from "@/content/projects";
import { projectImages } from "@/content/projects";
import { MediaFrame, Reveal } from "@/components/primitives";
import { CursorCta, Parallax } from "@/components/motion-fx";
import { cn } from "@/lib/utils";

/**
 * Media-first case-study panel: meta bar → cinematic full-width screenshot →
 * editorial spec sheet (story left, proof rail right). Lives inside the
 * sticky-stack ShowcaseCards in `selected-work.tsx`.
 */
export function FlagshipCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const router = useRouter();
  const [hovering, setHovering] = useState(false);
  const num = String(index + 1).padStart(2, "0");
  const caseHref = `/work/${project.slug}`;
  const rail = project.cardStats ?? project.stats?.slice(0, 3) ?? [];

  // Nested links handle their own clicks; stop the bubble so the whole-card
  // click doesn't hijack (or double-fire) them.
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    // Whole-card click is a pointer convenience only — keyboard and assistive
    // tech use the real links inside (title, "Read case study").
    <div
      className="group h-full cursor-pointer"
      onClick={() => router.push(caseHref)}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
    >
      {/* Meta bar — index, domain, year · role. The only scroll-linked reveal
          in the card: it sits at the top, so it finishes before the pin. */}
      <Reveal>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <div className="flex items-baseline gap-4">
            <span
              aria-hidden
              className="font-display text-4xl font-extrabold leading-none text-transparent sm:text-5xl"
              style={{
                WebkitTextStroke:
                  "1px color-mix(in srgb, var(--foreground) 28%, transparent)",
              }}
            >
              {num}
            </span>
            {project.domain && (
              <span className="eyebrow">{project.domain}</span>
            )}
          </div>
          <span className="eyebrow">
            {project.year}
            {project.role ? ` · ${project.role}` : ""}
          </span>
        </div>
      </Reveal>

      {/* Media — dominates the card. Cinematic crop widens with the viewport;
          the svh clamp keeps the whole card above the fold on short laptops
          (aspect-ratio is a preferred size, so max-height simply crops via the
          absolutely-positioned object-cover imgs — no distortion, no CLS). */}
      <div className="relative isolate mt-5">
        <MediaFrame
          src={project.image}
          images={projectImages(project)}
          active={hovering}
          alt={`${project.title} preview`}
          label={`${project.title} — cover`}
          ratio="aspect-[4/3] sm:aspect-[16/9] xl:aspect-[21/9]"
          className="w-full max-h-[40svh]"
          scrim
          zoomOnHover
        />
        <CursorCta>
          Open case study
          <ArrowRight className="h-3.5 w-3.5" />
        </CursorCta>
      </div>

      {/* Spec sheet. Deliberately NO scroll-linked reveals below the media:
          view() timelines freeze when the sticky card pins, which would strand
          these rows half-revealed on short viewports. */}
      <div className="mt-6 grid gap-8 md:grid-cols-12">
        <div className="md:col-span-7">
          <h3 className="display text-2xl sm:text-3xl md:tall:text-4xl">
            <Link
              href={caseHref}
              onClick={stop}
              className="transition-colors group-hover:text-accent"
            >
              {project.title}
            </Link>
          </h3>

          <p className="mt-3 line-clamp-2 max-w-xl text-muted text-balance sm:line-clamp-none">
            {project.story ?? project.tagline}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <Link
              href={caseHref}
              onClick={stop}
              className="inline-flex items-center gap-2 font-medium text-foreground"
            >
              Read case study
              <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out-strong hover-device:group-hover:translate-x-1" />
            </Link>
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                onClick={stop}
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
                onClick={stop}
                className="link-underline inline-flex items-center gap-1.5 text-muted hover:text-foreground"
              >
                <Github className="h-4 w-4" />
                Code
              </a>
            )}
          </div>
        </div>

        {/* Proof rail — real stats and the stack, separated by a hairline. */}
        <div className="md:col-span-5 md:border-l md:border-border md:pl-8">
          <dl>
            {rail.map((stat, i) => (
              <ProofStat key={stat.label} stat={stat} hideOnMobile={i === 2} />
            ))}
          </dl>
          <ul className="mt-5 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <TechBadge key={tag} tag={tag} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function ProofStat({
  stat,
  hideOnMobile = false,
}: {
  stat: Stat;
  hideOnMobile?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4 border-b border-border/70 py-2.5 first:pt-0 last:border-b-0 last:pb-0",
        // Third stat yields on phones — the card height budget is tighter there.
        hideOnMobile ? "hidden sm:flex" : "flex",
      )}
    >
      <dt className="text-xs text-muted">{stat.label}</dt>
      <dd className="display text-xl text-accent sm:text-2xl">{stat.value}</dd>
    </div>
  );
}

function TechBadge({ tag }: { tag: string }) {
  return (
    <li className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 font-mono text-[0.68rem] tracking-wide text-muted">
      <span aria-hidden className="h-1 w-1 rounded-full bg-accent" />
      {tag}
    </li>
  );
}

export function SecondaryCard({ project }: { project: Project }) {
  return (
    <div className="group flex flex-col">
      <Parallax amount={28} zoom={0.08}>
        <MediaFrame
          src={project.image}
          alt={`${project.title} preview`}
          label={project.title}
          ratio="aspect-[16/10]"
          className="transition-transform duration-500 ease-out-strong hover-device:group-hover:scale-[1.03]"
        />
      </Parallax>

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
