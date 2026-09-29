import type { CSSProperties, ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TransitionLink } from "@/components/transition-link";

export { MediaFrame } from "./media-frame";

export type Surface = "ink" | "paper" | "signal";

/** Horizontal frame. `size="text"` narrows to a reading measure. `wide` is
 *  kept for older call sites (same as the default full frame). */
export function Container({
  className,
  size = "full",
  children,
}: {
  className?: string;
  size?: "full" | "text";
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "gutter mx-auto w-full",
        size === "text" ? "max-w-5xl" : "max-w-[1600px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * A chapter. Paints its own surface (ink / paper / signal) so every token
 * inside re-skins. `sheet` rounds the top edge and tucks it over the previous
 * chapter, so each new surface reads as a sheet sliding over the last.
 */
export function Section({
  id,
  surface = "ink",
  sheet = false,
  className,
  children,
}: {
  id?: string;
  surface?: Surface;
  sheet?: boolean;
  className?: string;
  children: ReactNode;
  /** Legacy rhythm prop — ignored. */
  variant?: "default" | "spacious" | "dense";
}) {
  return (
    <section
      id={id}
      data-surface={surface}
      className={cn(
        "relative isolate py-24 sm:py-32 lg:py-40",
        sheet &&
          "-mt-(--sheet-radius) rounded-t-(--sheet-radius) pt-[calc(6rem+var(--sheet-radius))] sm:pt-[calc(8rem+var(--sheet-radius))]",
        className,
      )}
    >
      {children}
    </section>
  );
}

/** Pulsing-dot availability pill. */
export function AvailabilityBadge({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "label inline-flex w-fit items-center gap-2.5 rounded-full border border-line-strong px-4 py-2.5",
        className,
      )}
    >
      <Dot />
      {children}
    </span>
  );
}

export function Dot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "ping relative inline-flex h-2 w-2 shrink-0 rounded-full bg-signal",
        className,
      )}
    />
  );
}

/**
 * Entrance reveal. Visible by default (SSR / no-JS / reduced motion); the
 * observer in `scroll-reveal.tsx` animates it in once it enters the viewport.
 * `stagger` cascades siblings, `delay` offsets in seconds.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  stagger,
  variant = "up",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Legacy prop — every reveal now triggers on entering the viewport. */
  immediate?: boolean;
  stagger?: number;
  variant?: "up" | "left" | "right" | "scale" | "fade";
  as?: "div" | "li" | "span" | "p" | "article" | "figure";
}) {
  const vars: Record<string, string | number> = {};
  if (stagger) vars["--i"] = stagger;
  if (delay) vars["--d"] = `${Math.round(delay * 1000)}ms`;
  return (
    <Tag
      data-reveal={variant === "up" ? "" : variant}
      className={className}
      style={Object.keys(vars).length ? (vars as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}

/**
 * Masked line stack — each entry rises out of its own clip edge in sequence.
 * `load` plays on page load (hero); otherwise it triggers on scroll-in.
 */
export function Lines({
  lines,
  as: Tag = "span",
  className,
  lineClassName,
  load = false,
  delay = 0,
}: {
  lines: ReactNode[];
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  lineClassName?: string;
  load?: boolean;
  delay?: number;
}) {
  return (
    <Tag
      data-reveal={load ? undefined : "lines"}
      className={cn("block", className)}
      style={delay ? ({ "--d": `${Math.round(delay * 1000)}ms` } as CSSProperties) : undefined}
    >
      {lines.map((line, i) => (
        <span
          key={i}
          className={cn("line", load && "load-rise", lineClassName)}
          style={{ "--l": i } as CSSProperties}
        >
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  );
}

/**
 * Chapter header: a hairline index row — `(02) SELECTED WORK ······ meta` —
 * over a poster headline. Pass `title` as an array to control line breaks
 * (each entry is a masked line); `<em>` inside switches to the serif accent.
 */
export function SectionHeader({
  index,
  eyebrow,
  title,
  meta,
  className,
  titleClassName,
  rule = true,
}: {
  index?: string;
  eyebrow?: string;
  title: ReactNode | ReactNode[];
  meta?: ReactNode;
  className?: string;
  titleClassName?: string;
  rule?: boolean;
}) {
  const lines = Array.isArray(title) ? title : [title];
  return (
    <header className={cn("relative mb-14 sm:mb-20", className)}>
      {(eyebrow || meta) && (
        <div className="relative">
          {rule && (
            <span
              aria-hidden
              data-reveal="rule"
              className="absolute inset-x-0 top-0 block h-px bg-line-strong"
            />
          )}
          <div className="label flex items-center justify-between gap-6 pt-4">
            <span>
              {index && <span className="text-accent">({index})&nbsp;&nbsp;</span>}
              {eyebrow}
            </span>
            {meta && <span className="hidden text-right text-muted sm:inline">{meta}</span>}
          </div>
        </div>
      )}
      <Lines
        as="h2"
        lines={lines}
        className={cn(
          "display mt-8 text-[clamp(2.5rem,7.2vw,7.25rem)] sm:mt-10",
          titleClassName,
        )}
      />
    </header>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="data inline-flex items-center rounded-full border border-line px-3 py-1 text-muted">
      {children}
    </span>
  );
}

/** Text that rolls to a duplicate of itself on hover (needs `group/roll`). */
export function Roll({ children }: { children: string }) {
  return (
    <span className="roll" data-text={children}>
      <span>{children}</span>
    </span>
  );
}

/**
 * Pill button. Internal hrefs go through TransitionLink (same-page anchors
 * smooth-scroll, other routes get the view transition); `external` opens a new
 * tab. The fill wipes up on hover and the label rolls.
 */
export function ButtonLink({
  href,
  variant = "primary",
  external,
  children,
  className,
  onClick,
  icon = true,
}: {
  href: string;
  variant?: "primary" | "ghost" | "accent";
  external?: boolean;
  children: ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler;
  icon?: boolean;
}) {
  const classes = cn(
    "btn group/roll",
    variant === "primary" && "btn-solid",
    variant === "accent" && "btn-accent",
    variant === "ghost" && "btn-line",
    className,
  );
  const Icon = external ? ArrowUpRight : ArrowRight;
  const inner = (
    <>
      {typeof children === "string" ? <Roll>{children}</Roll> : children}
      {icon && (
        <Icon
          aria-hidden
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-500 ease-out-strong",
            external
              ? "hover-device:group-hover/roll:-translate-y-0.5 hover-device:group-hover/roll:translate-x-0.5"
              : "hover-device:group-hover/roll:translate-x-1",
          )}
        />
      )}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={classes}
      >
        {inner}
      </a>
    );
  }

  return (
    <TransitionLink href={href} onClick={onClick} className={classes}>
      {inner}
    </TransitionLink>
  );
}
