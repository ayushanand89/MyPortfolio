import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { ArrowUpRight, Github } from "lucide-react";
import type { CaseStudyBlock, Project, Stat } from "@/content/projects";
import { Container, Lines, MediaFrame, Reveal } from "@/components/primitives";
import { CountUp } from "@/components/count-up";
import { BrowserFrame, PhoneFrame } from "@/components/device-frames";
import { LiveEmbed } from "@/components/live-embed";
import { LoopVideo } from "@/components/loop-video";
import { cn } from "@/lib/utils";

export { NextProject } from "./next-project";

/**
 * Editorial hero, set like film credits: index rail → poster title → serif
 * subtitle → centred credits → the SCREEN. For live projects the screen is
 * the real site (a recording with "Launch the live site" → an interactive
 * iframe); for the client build, its cover in browser chrome. Either way it's
 * the landing spot of the Work → case-study morph, with the stats riding over
 * its bottom edge.
 */
export function CaseStudyHero({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const cover = project.cover;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <header className="pt-28 sm:pt-36">
      <Container>
        <div className="label relative flex items-center justify-between gap-6 pt-4">
          <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-line-strong" />
          <span>
            <span className="text-accent">
              ({pad(index + 1)}/{pad(total)})&nbsp;&nbsp;
            </span>
            Case study
          </span>
          <span className="text-right text-muted">{project.domain}</span>
        </div>

        <Lines
          as="h1"
          lines={[cover?.title ?? project.title]}
          className="display mx-auto mt-14 max-w-[16ch] text-center text-[clamp(1.9rem,9vw,8rem)] text-balance sm:mt-20"
        />
        {cover?.subtitle && (
          <Reveal>
            <p className="serif mx-auto mt-8 max-w-3xl text-center text-[clamp(1.35rem,2.3vw,2.1rem)] italic leading-[1.15] text-muted text-balance">
              {cover.subtitle}
            </p>
          </Reveal>
        )}

        {/* Credits - red micro-caps over serif values. */}
        <Reveal>
          <dl className="mx-auto mt-14 flex max-w-4xl flex-wrap justify-center gap-x-14 gap-y-8 text-center">
            <Credit label="Role" value={project.role ?? "Full-stack"} />
            <Credit label="Year" value={project.year} />
            {project.association && (
              <Credit label="Context" value={project.association} />
            )}
            <div>
              <dt className="label text-accent">Links</dt>
              <dd className="serif mt-2 flex flex-col items-center gap-1 text-xl">
                {project.links.demo && (
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline inline-flex items-center gap-1"
                  >
                    Live site <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline inline-flex items-center gap-1.5"
                  >
                    <Github className="h-4 w-4" /> Source
                  </a>
                )}
                {!project.links.demo && !project.links.github && (
                  <span className="text-muted">Private · NDA</span>
                )}
              </dd>
            </div>
          </dl>
          <p className="data mx-auto mt-10 max-w-3xl text-center leading-relaxed text-muted">
            {project.tags.join(" / ")}
          </p>
        </Reveal>
      </Container>

      <div className="gutter mx-auto mt-14 max-w-[1600px] sm:mt-20">
        {project.live ? (
          <LiveEmbed project={project} />
        ) : (
          <BrowserFrame host="private client build" note="Anonymized" vtCover>
            {project.media?.desktop ? (
              <LoopVideo
                src={project.media.desktop.video}
                poster={project.media.desktop.poster}
                alt={`${project.title}: recording of the app`}
                sizes="(min-width: 1600px) 1520px, 94vw"
                priority
              />
            ) : (
              <Image
                src={project.image ?? ""}
                alt={`${project.title} cover`}
                fill
                preload
                sizes="(min-width: 1600px) 1520px, 94vw"
                className="object-cover object-top"
              />
            )}
          </BrowserFrame>
        )}
      </div>

      {project.stats && (
        <Container size="text" className="relative z-10 mt-10 sm:mt-14">
          <StatsRow items={project.stats} />
        </Container>
      )}
    </header>
  );
}

function Credit({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="label text-accent">{label}</dt>
      <dd className="serif mt-2 text-xl leading-snug text-balance">{value}</dd>
    </div>
  );
}

/** Ink stats strip with count-up numerals. */
export function StatsRow({
  items,
  className,
}: {
  items: Stat[];
  className?: string;
}) {
  return (
    <dl
      data-surface="ink"
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)] sm:grid-cols-4",
        className,
      )}
    >
      {items.map((s) => (
        <div key={s.label} className="bg-bg p-5 sm:p-7">
          <dt className="display whitespace-nowrap text-[clamp(1.6rem,2.7vw,2.5rem)] text-accent">
            <CountUp value={s.value} />
          </dt>
          <dd className="data mt-2 text-muted">{s.label}</dd>
        </div>
      ))}
    </dl>
  );
}

export function CaseStudyBody({
  blocks,
  project,
}: {
  blocks: CaseStudyBlock[];
  project: Project;
}) {
  let fig = 0;
  const host = project.live?.host ?? "private client build";
  const live = !!project.live;
  return (
    <div className="pb-[calc(7rem+var(--sheet-radius))] pt-24 sm:pb-[calc(10rem+var(--sheet-radius))] sm:pt-36">
      <Container>
        <div className="flex flex-col gap-24 sm:gap-36">
          {blocks.map((block, i) => (
            <Block
              key={i}
              block={block}
              fig={block.type === "image" ? ++fig : 0}
              host={host}
              live={live}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="label text-accent">{children}</p>;
}

function Block({
  block,
  fig,
  host,
  live,
}: {
  block: CaseStudyBlock;
  fig: number;
  host: string;
  live: boolean;
}) {
  switch (block.type) {
    case "section":
      return (
        <Reveal className="max-w-4xl">
          {block.eyebrow && <Eyebrow>{block.eyebrow}</Eyebrow>}
          <h2 className="serif mt-5 text-[clamp(2.2rem,4.8vw,4.6rem)] leading-[1.02] tracking-tight text-balance">
            {block.title}
          </h2>
          {block.body && (
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted text-pretty">
              {block.body}
            </p>
          )}
        </Reveal>
      );

    case "text":
      return (
        <Reveal>
          <p className="max-w-3xl text-lg leading-relaxed text-muted">{block.body}</p>
        </Reveal>
      );

    case "image":
      return (
        <figure className={cn(block.narrow && "mx-auto w-full max-w-4xl")}>
          <div data-reveal="window" className="rounded-[14px]">
            <BrowserFrame host={host} live={live} note="Private">
              <MediaFrame
                src={block.src}
                alt={block.alt}
                label={block.alt}
                ratio="absolute inset-0"
                className="rounded-none bg-transparent [&_img]:object-top"
                sizes="(min-width: 1600px) 1520px, 94vw"
                reveal={false}
              />
            </BrowserFrame>
          </div>
          {block.caption && (
            <figcaption className="mt-5 grid gap-2 text-muted sm:grid-cols-12">
              <span className="data pt-1 text-accent sm:col-span-2">
                Fig. {String(fig).padStart(2, "0")}
              </span>
              <span className="max-w-2xl text-[1.02rem] leading-relaxed text-pretty sm:col-span-10">
                {block.caption}
              </span>
            </figcaption>
          )}
        </figure>
      );

    case "diagram":
      return (
        // min-w-0: a flex item would otherwise grow to the diagram's min
        // width and get clipped at the screen edge instead of scrolling.
        <figure className="min-w-0">
          <div
            data-surface="ink"
            data-reveal=""
            className="overflow-hidden rounded-[14px] border border-white/10 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.5)]"
          >
            {/* Wide diagrams keep a legible size on phones and scroll
                sideways instead of shrinking their labels to nothing. */}
            <div className="overflow-x-auto [scrollbar-width:thin]">
              {/* SVG: already vector - no optimizer needed, sharp at any size. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={block.src}
                alt={block.alt}
                loading="lazy"
                className="block h-auto w-full min-w-[760px]"
              />
            </div>
          </div>
          <figcaption className="mt-5 grid gap-2 text-muted sm:grid-cols-12">
            <span className="data pt-1 text-accent sm:col-span-2">
              Diagram
              <span className="ml-2 text-muted sm:hidden">· scroll →</span>
            </span>
            {block.caption && (
              <span className="max-w-2xl text-[1.02rem] leading-relaxed text-pretty sm:col-span-10">
                {block.caption}
              </span>
            )}
          </figcaption>
        </figure>
      );

    case "mobile":
      return (
        <div>
          {(block.eyebrow || block.title) && (
            <Reveal className="mb-12 max-w-3xl">
              {block.eyebrow && <Eyebrow>{block.eyebrow}</Eyebrow>}
              {block.title && (
                <h2 className="serif mt-5 text-[clamp(2rem,4vw,3.75rem)] leading-[1.04] tracking-tight text-balance">
                  {block.title}
                </h2>
              )}
            </Reveal>
          )}
          <div className="-mx-(--gutter) flex snap-x snap-mandatory gap-6 overflow-x-auto px-(--gutter) pb-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-8 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
            {block.items.map((item, i) => (
              <figure
                key={item.src}
                data-reveal=""
                style={{ "--i": i } as CSSProperties}
                className="w-[68%] shrink-0 snap-center sm:w-auto"
              >
                <PhoneFrame className="mx-auto max-w-[19rem]" tint={item.tint}>
                  {item.video ? (
                    <LoopVideo
                      src={item.video}
                      poster={item.src}
                      alt={item.alt}
                      sizes="(min-width: 640px) 19rem, 68vw"
                    />
                  ) : (
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 640px) 19rem, 68vw"
                      className="object-cover object-top"
                    />
                  )}
                </PhoneFrame>
                {item.caption && (
                  <figcaption className="data mt-4 text-center text-muted">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      );

    case "stats":
      return (
        <Reveal>
          <StatsRow items={block.items} />
        </Reveal>
      );

    case "features":
      return (
        <div>
          {(block.eyebrow || block.title) && (
            <Reveal className="mb-12 max-w-3xl">
              {block.eyebrow && <Eyebrow>{block.eyebrow}</Eyebrow>}
              {block.title && (
                <h2 className="serif mt-5 text-[clamp(2rem,4vw,3.75rem)] leading-[1.04] tracking-tight text-balance">
                  {block.title}
                </h2>
              )}
            </Reveal>
          )}
          <div className="grid border-t border-line-strong sm:grid-cols-2">
            {block.items.map((item, i) => (
              <Reveal
                key={item.title}
                stagger={i % 2}
                className="border-b border-line py-8 sm:odd:pr-10 sm:even:border-l sm:even:pl-10"
              >
                <span className="data text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="caps mt-4 text-[1.3rem] leading-tight">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-muted text-pretty">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      );

    case "stack":
      return (
        <div>
          <Reveal className="label flex items-center justify-between border-b border-line-strong pb-4">
            <span>Stack</span>
            <span className="text-muted">Why each piece</span>
          </Reveal>
          {block.items.map((item) => (
            <Reveal
              key={item.name}
              className="grid gap-2 border-b border-line py-6 md:grid-cols-12 md:gap-6"
            >
              <h3 className="caps text-[1.15rem] md:col-span-5">{item.name}</h3>
              <p className="leading-relaxed text-muted md:col-span-7">{item.why}</p>
            </Reveal>
          ))}
        </div>
      );

    case "quote":
      return (
        <Reveal>
          <blockquote className="serif max-w-5xl text-[clamp(2rem,4.4vw,4.4rem)] italic leading-[1.05] text-balance">
            <span className="text-accent">&ldquo;</span>
            {block.text}
            <span className="text-accent">&rdquo;</span>
          </blockquote>
        </Reveal>
      );

    default:
      return null;
  }
}
