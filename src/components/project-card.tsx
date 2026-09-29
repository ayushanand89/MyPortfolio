"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import type { Project } from "@/content/projects";
import { projectImages } from "@/content/projects";
import { BrowserFrame, PhoneFrame } from "@/components/device-frames";
import { LoopVideo } from "@/components/loop-video";
import { ButtonLink, Lines } from "@/components/primitives";
import { TransitionLink, useNavigate } from "@/components/transition-link";
import { useScrollProgress } from "@/lib/motion";
import { SwipeDeck } from "@/components/swipe-deck";

/**
 * "Screening room" feature for one project: the real site playing in browser
 * chrome (a recording of the live site), its mobile version in a phone that
 * drifts against it on scroll, and a readable spec — story, proof, stack,
 * and the two actions that matter (case study / visit live). Clicking the
 * screen morphs it into the case study's live embed (view transition).
 */
export function ProjectFeature({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const navigate = useNavigate();
  const frameRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const pad = (n: number) => String(n).padStart(2, "0");
  const caseHref = `/work/${project.slug}`;
  const rail = project.cardStats ?? project.stats?.slice(0, 3) ?? [];
  const desktop = project.media?.desktop;
  const mobile = project.media?.mobile;
  const host = project.live?.host ?? "private client build";

  // The phone drifts against the browser as the stage passes — one transform.
  useScrollProgress(stageRef, [[0, 1], [1, 0]], (p) => {
    const el = phoneRef.current;
    if (el) el.style.transform = `translate3d(0, ${((0.5 - p) * 90).toFixed(1)}px, 0)`;
  });

  return (
    <article className="relative border-t border-line-strong py-16 first:border-t-0 first:pt-4 sm:py-24">
      <div className="label flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <span className="flex items-center gap-3">
          <span className="data text-accent">
            {pad(index + 1)}/{pad(total)}
          </span>
          {project.domain}
        </span>
        <span className="flex items-center gap-4 text-muted">
          {project.year}
          {project.live ? (
            <span className="flex items-center gap-2 rounded-full bg-fg px-2.5 py-1 text-bg">
              <span className="ping relative h-1.5 w-1.5 rounded-full bg-[#28c840]" />
              Live
            </span>
          ) : (
            <span className="rounded-full border border-line-strong px-2.5 py-1">
              Client · NDA
            </span>
          )}
        </span>
      </div>

      <TransitionLink href={caseHref} morphRef={frameRef} className="group/title mt-6 block w-fit">
        <Lines
          as="h3"
          lines={[project.title]}
          className="display text-[clamp(1.9rem,9vw,7rem)] transition-colors duration-500 group-hover/title:text-accent"
        />
      </TransitionLink>
      <p className="serif mt-3 max-w-3xl text-[clamp(1.35rem,2.3vw,2.1rem)] italic leading-[1.15] text-muted text-pretty">
        {project.tagline}
      </p>

      {/* The screening: browser (desktop recording) + phone (mobile). */}
      <div ref={stageRef} className="relative mt-10 sm:mt-14">
        <div
          data-reveal="window"
          data-cursor="View case"
          className="cursor-pointer rounded-[14px] lg:w-[84%]"
          onClick={() => navigate(caseHref, frameRef.current)}
        >
          <BrowserFrame
            ref={frameRef}
            host={host}
            live={!!project.live}
            note="Private"
          >
            {desktop ? (
              <LoopVideo
                src={desktop.video}
                poster={desktop.poster}
                alt={`${project.title} — recording of the live site`}
                sizes="(min-width: 1600px) 1300px, (min-width: 1024px) 80vw, 94vw"
              />
            ) : (
              <StillsReel images={projectImages(project)} alt={project.title} />
            )}
          </BrowserFrame>
        </div>

        {mobile && (
          <div
            ref={phoneRef}
            aria-hidden
            className="absolute bottom-[-6%] right-0 hidden w-[20%] max-w-[17rem] will-change-transform md:block lg:right-[2%]"
          >
            <div data-reveal="" style={{ "--d": "250ms" } as CSSProperties}>
              <PhoneFrame tint={mobile.tint}>
                <LoopVideo
                  src={mobile.video}
                  poster={mobile.poster}
                  alt=""
                  sizes="(min-width: 1024px) 17rem, 20vw"
                />
              </PhoneFrame>
            </div>
          </div>
        )}
      </div>

      {/* Spec — story, proof, stack, actions. */}
      <div className="mt-12 grid gap-10 sm:mt-16 lg:grid-cols-12 lg:gap-12">
        <p className="text-[1.1rem] leading-relaxed text-pretty lg:col-span-5">
          {project.story ?? project.summary}
        </p>
        <dl className="lg:col-span-4">
          {rail.map((s) => (
            <div
              key={s.label}
              className="flex items-baseline justify-between gap-4 border-t border-line-strong py-3 last:border-b"
            >
              <dt className="data text-muted">{s.label}</dt>
              <dd className="display whitespace-nowrap text-[clamp(1.5rem,2.2vw,2.1rem)] text-accent">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-col gap-5 lg:col-span-3">
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={caseHref} className="grow justify-between sm:grow-0 lg:grow">
              Read case study
            </ButtonLink>
            {project.live && (
              <ButtonLink
                href={project.live.url}
                external
                variant="ghost"
                className="grow justify-between sm:grow-0 lg:grow"
              >
                Visit live site
              </ButtonLink>
            )}
          </div>
          <p className="data leading-relaxed text-muted">{project.tags.join(" / ")}</p>
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="label link-underline inline-flex w-fit items-center gap-1.5"
            >
              <Github aria-hidden className="h-3.5 w-3.5" /> Source code
              <ArrowUpRight aria-hidden className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * Phones: the same three chapters as a swipeable deck instead of three
 * screen-high features — each card is the site playing in its browser, the
 * pitch, the proof and both actions. The top card's recording plays, and the
 * one beneath is preloaded so it's already running as you drag the top card
 * off it; tapping the screen morphs it into the case study like on desktop.
 */
export function ProjectDeck({ projects }: { projects: readonly Project[] }) {
  return (
    <SwipeDeck
      items={projects}
      keyOf={(p) => p.slug}
      label="Selected work"
      render={(project, { live, warm, index }) => (
        <DeckCard
          project={project}
          live={live}
          warm={warm}
          index={index}
          total={projects.length}
        />
      )}
    />
  );
}

function DeckCard({
  project,
  live,
  warm,
  index,
  total,
}: {
  project: Project;
  live: boolean;
  warm: boolean;
  index: number;
  total: number;
}) {
  const navigate = useNavigate();
  const frameRef = useRef<HTMLDivElement>(null);
  const pad = (n: number) => String(n).padStart(2, "0");
  const caseHref = `/work/${project.slug}`;
  const rail = project.cardStats ?? project.stats?.slice(0, 3) ?? [];
  const desktop = project.media?.desktop;

  return (
    <article
      data-surface="ink"
      className="flex h-full flex-col rounded-[22px] bg-bg p-2.5 shadow-[0_30px_60px_-28px_rgba(0,0,0,0.55)]"
    >
      <div className="cursor-pointer" onClick={() => navigate(caseHref, frameRef.current)}>
        <BrowserFrame
          ref={frameRef}
          host={project.live?.host ?? "private client build"}
          live={!!project.live}
          note="Private"
          className="rounded-[14px] shadow-none"
        >
          {desktop ? (
            <LoopVideo
              src={desktop.video}
              poster={desktop.poster}
              alt={`${project.title} — recording of the live site`}
              sizes="94vw"
              playing={live}
              warm={warm}
            />
          ) : (
            <Image
              src={projectImages(project)[0]}
              alt={`${project.title} — screenshot`}
              fill
              sizes="94vw"
              className="object-cover object-top"
            />
          )}
        </BrowserFrame>
      </div>

      <div className="flex flex-1 flex-col px-2.5 pb-2.5 pt-5">
        <div className="label flex items-center justify-between gap-4 text-muted">
          <span className="flex min-w-0 items-center gap-2.5">
            <span className="data text-accent">
              {pad(index + 1)}/{pad(total)}
            </span>
            <span className="truncate">{project.domain?.split(" · ")[0]}</span>
          </span>
          <span className="shrink-0">{project.year}</span>
        </div>
        <h3 className="display mt-3 text-[clamp(1.75rem,8.4vw,2.4rem)]">{project.title}</h3>
        <p className="serif mt-2 text-[1.2rem] italic leading-[1.15] text-muted text-pretty">
          {project.tagline}
        </p>
        <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4">
          {rail.map((s) => (
            <div key={s.label} className="flex min-w-0 flex-col-reverse justify-end">
              <dt className="data mt-1 text-[0.65rem] leading-snug text-muted">{s.label}</dt>
              <dd className="display whitespace-nowrap text-[1.25rem] text-accent">{s.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-auto flex gap-2 pt-6">
          <ButtonLink href={caseHref} className="grow justify-between px-5!">
            Case study
          </ButtonLink>
          {project.live && (
            <ButtonLink href={project.live.url} external variant="ghost" className="px-5!">
              Live
            </ButtonLink>
          )}
        </div>
      </div>
    </article>
  );
}

/** For projects without a public site: their screenshots crossfading with a
 *  slow push-in (pure CSS, the same loop as the hero reel). */
function StillsReel({ images, alt }: { images: string[]; alt: string }) {
  return (
    <div className="absolute inset-0">
      {images.slice(0, 3).map((src, i) => (
        <div
          key={src}
          className="reel-item absolute inset-0 overflow-hidden"
          style={{ "--r": i } as CSSProperties}
        >
          <Image
            src={src}
            alt={i === 0 ? `${alt} — screenshot` : ""}
            fill
            sizes="(min-width: 1600px) 1300px, (min-width: 1024px) 80vw, 94vw"
            className="object-cover object-top"
          />
        </div>
      ))}
    </div>
  );
}

