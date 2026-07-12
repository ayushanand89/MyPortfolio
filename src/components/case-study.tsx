import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from "lucide-react";
import type { CaseStudyBlock, Project, Stat } from "@/content/projects";
import { Container, MediaFrame, Reveal } from "@/components/primitives";
import { CountUp } from "@/components/count-up";
import { CursorCta, Parallax } from "@/components/motion-fx";
import { cn } from "@/lib/utils";

export function CaseStudyHero({ project }: { project: Project }) {
  const cover = project.cover;
  return (
    <header className="pt-32 sm:pt-40">
      <Container>
        <Link
          href="/#work"
          className="link-underline inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> All work
        </Link>

        <p className="eyebrow mt-10">{cover?.eyebrow}</p>
        <h1 className="display display-hero mt-5 max-w-4xl text-5xl text-balance sm:text-6xl md:text-7xl">
          {cover?.title ?? project.title}
        </h1>
        {cover?.subtitle && (
          <p className="mt-6 max-w-2xl text-lg text-muted text-balance sm:text-xl">
            {cover.subtitle}
          </p>
        )}

        {/* Spec rail — the project's vitals on one hairline. */}
        <div className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-6 sm:grid-cols-4">
          <Meta label="Role" value={project.role ?? "—"} />
          <Meta label="Year" value={project.year} />
          {project.association && (
            <Meta label="Context" value={project.association} />
          )}
          {(project.links.demo || project.links.github) && (
            <div>
              <span className="eyebrow">Links</span>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                {project.links.demo && (
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline inline-flex items-center gap-1.5 text-foreground"
                  >
                    Live site <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}
                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline inline-flex items-center gap-1.5 text-muted hover:text-foreground"
                  >
                    <Github className="h-4 w-4" /> Source
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <ul className="mt-8 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-border px-3 py-1 font-mono text-[0.7rem] tracking-wide text-muted"
            >
              {tag}
            </li>
          ))}
        </ul>

        {/* Cover breaks out of the text column (same technique as body
            images); the stats row overlaps its bottom edge for depth. The
            cover is this page's LCP — load it eagerly. */}
        <div className="mt-14 sm:-mx-8 xl:-mx-24">
          <Parallax amount={16}>
            <MediaFrame
              src={project.image}
              alt={`${project.title} cover`}
              label={`${project.title} — cover image`}
              ratio="aspect-[16/10] sm:aspect-[21/9]"
              scrim
              eager
            />
          </Parallax>
        </div>

        {project.stats && (
          <StatsRow
            items={project.stats}
            glass
            className="relative z-10 -mt-10 sm:-mt-14 sm:mx-4 xl:mx-10"
          />
        )}
      </Container>
    </header>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="eyebrow">{label}</span>
      <p className="mt-1 text-sm text-foreground">{value}</p>
    </div>
  );
}

export function StatsRow({
  items,
  className,
  glass = false,
}: {
  items: Stat[];
  className?: string;
  /** Frosted cells — for when the row sits over imagery (hero overlap). */
  glass?: boolean;
}) {
  return (
    <dl
      className={cn(
        "mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4",
        className,
      )}
    >
      {items.map((s) => (
        <div key={s.label} className={cn("p-5", glass ? "glass-strong" : "bg-background")}>
          <dt className="display text-3xl text-accent sm:text-4xl">
            <CountUp value={s.value} />
          </dt>
          <dd className="mt-1 text-sm text-muted">{s.label}</dd>
        </div>
      ))}
    </dl>
  );
}

export function CaseStudyBody({ blocks }: { blocks: CaseStudyBlock[] }) {
  return (
    <div className="py-20 sm:py-28">
      <Container>
        <div className="flex flex-col gap-20 sm:gap-28">
          {blocks.map((block, i) => (
            <Reveal key={i}>
              <Block block={block} />
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}

function Block({ block }: { block: CaseStudyBlock }) {
  switch (block.type) {
    case "section":
      return (
        <div className="max-w-3xl">
          {block.eyebrow && <p className="eyebrow">{block.eyebrow}</p>}
          <h2 className="display mt-4 text-3xl text-balance sm:text-4xl md:text-5xl">
            {block.title}
          </h2>
          {block.body && (
            <p className="mt-6 text-lg leading-relaxed text-muted text-balance">
              {block.body}
            </p>
          )}
        </div>
      );

    case "text":
      return (
        <p className="max-w-3xl text-lg leading-relaxed text-muted">
          {block.body}
        </p>
      );

    case "image":
      return (
        // Breakout width — the image outgrows the text column for a
        // full-bleed editorial moment (the xl margin stays inside the
        // viewport gutter, so nothing overflows).
        <figure className="sm:-mx-8 xl:-mx-24">
          <Parallax amount={20}>
            <MediaFrame
              src={block.src}
              alt={block.alt}
              label={block.alt}
              ratio="aspect-[16/9]"
            />
          </Parallax>
          {block.caption && (
            <figcaption className="mt-3 text-sm text-faint sm:mx-8 xl:mx-24">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "stats":
      return <StatsRow items={block.items} />;

    case "features":
      return (
        <div>
          {(block.eyebrow || block.title) && (
            <div className="mb-10 max-w-3xl">
              {block.eyebrow && <p className="eyebrow">{block.eyebrow}</p>}
              {block.title && (
                <h2 className="display mt-4 text-3xl text-balance sm:text-4xl">
                  {block.title}
                </h2>
              )}
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            {block.items.map((item) => (
              <div
                key={item.title}
                className="glass-soft rounded-xl p-6 transition-[transform,border-color] duration-300 ease-out-strong sm:p-7 hover-device:hover:-translate-y-0.5 hover-device:hover:border-white/20"
              >
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case "stack":
      return (
        <div className="grid gap-3">
          {block.items.map((item) => (
            <div
              key={item.name}
              className="glass-soft grid gap-2 rounded-xl p-6 transition-[border-color] duration-300 ease-out-strong md:grid-cols-12 md:gap-6 hover-device:hover:border-accent/30"
            >
              <h3 className="font-semibold text-foreground md:col-span-4">
                <span className="mr-3 inline-block h-2.5 w-2.5 rounded-full bg-accent align-middle" />
                {item.name}
              </h3>
              <p className="leading-relaxed text-muted md:col-span-8">
                {item.why}
              </p>
            </div>
          ))}
        </div>
      );

    case "quote":
      return (
        <blockquote className="max-w-4xl border-l-2 border-accent pl-6">
          <p className="display text-2xl text-balance sm:text-3xl">
            “{block.text}”
          </p>
        </blockquote>
      );

    default:
      return null;
  }
}

export function NextProject({ project }: { project: Project }) {
  return (
    <section className="border-t border-border py-16 sm:py-24">
      <Container>
        <Link href={`/work/${project.slug}`} className="group block">
          <span className="eyebrow">Next case study</span>
          {/* Cinematic handoff — the next project's cover with its title
              riding the scrim, so momentum carries between case studies. */}
          <div className="relative mt-6">
            <MediaFrame
              src={project.image}
              alt={`${project.title} preview`}
              label={project.title}
              ratio="aspect-[16/10] sm:aspect-[21/9]"
              scrim
              zoomOnHover
            />
            {/* Local gradient stronger than the frame scrim — bright covers
                (e.g. photography-led storefronts) would otherwise wash the
                title out. */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 bg-linear-to-t from-background/90 via-background/45 to-transparent p-6 pt-24 sm:p-10 sm:pt-28">
              <h2 className="display text-3xl transition-colors group-hover:text-accent sm:text-5xl md:text-6xl">
                {project.title}
              </h2>
              <ArrowRight className="h-7 w-7 shrink-0 transition-transform duration-300 ease-out-strong group-hover:translate-x-2 sm:h-9 sm:w-9" />
            </div>
            <CursorCta>
              Open case study
              <ArrowRight className="h-3.5 w-3.5" />
            </CursorCta>
          </div>
          <p className="mt-4 max-w-xl text-muted">{project.tagline}</p>
        </Link>
      </Container>
    </section>
  );
}
