import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export { MediaFrame } from "./media-frame";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-5xl px-6 sm:px-8", className)}>
      {children}
    </div>
  );
}

/**
 * Pure-CSS entrance reveal. Content is visible by default (works with no JS /
 * unsupported browsers); animation is layered on via `globals.css`.
 * `immediate` plays once on load (above-the-fold); otherwise it is scroll-linked.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  immediate = false,
  stagger,
  variant = "up",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  immediate?: boolean;
  /** Cascade index — same-viewport siblings reveal in sequence (used by the
   *  cross-browser JS fallback; native reveals stagger by entry on their own). */
  stagger?: number;
  /** Entrance direction. `up` (default) rises; `left`/`right` slide in from the
   *  side (≥640px only — they collapse to `up` on phones); `scale` pops. Ignored
   *  when `immediate`. */
  variant?: "up" | "left" | "right" | "scale";
}) {
  const vars: Record<string, string | number> = {};
  if (immediate && delay) vars["--reveal-delay"] = `${delay * 1000}ms`;
  if (stagger) vars["--reveal-order"] = stagger;
  const style =
    Object.keys(vars).length > 0 ? (vars as CSSProperties) : undefined;

  return (
    <div
      className={cn(
        immediate ? "reveal-now" : "reveal",
        !immediate && variant !== "up" && `reveal--${variant}`,
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}

export function SectionHeader({
  index,
  eyebrow,
  title,
  className,
}: {
  index?: string;
  eyebrow?: string;
  title: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-12 sm:mb-16", className)}>
      {eyebrow && (
        <span className="eyebrow">
          {index ? `${index} — ` : ""}
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "display text-4xl text-balance sm:text-5xl md:text-[3.25rem]",
          eyebrow && "mt-4",
        )}
      >
        <span className="mask-reveal">
          <span>{title}</span>
        </span>
      </h2>
    </div>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border px-3 py-1 font-mono text-[0.7rem] tracking-wide text-muted">
      {children}
    </span>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  external,
  children,
  className,
  onClick,
}: {
  href: string;
  variant?: "primary" | "ghost";
  external?: boolean;
  children: ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler;
}) {
  const isPrimary = variant === "primary";
  const styles = isPrimary
    ? "bg-foreground text-background hover:opacity-95"
    : "glass text-foreground hover:border-white/20";
  const classes = cn(
    "group/btn inline-flex items-center gap-3 rounded-full py-1.5 pl-5 pr-1.5 text-sm font-medium transition-[transform,opacity,border-color] duration-150 ease-out-strong active:scale-[0.98]",
    styles,
    className,
  );

  // Trailing icon nested in its own circle that kicks diagonally on hover —
  // "button-in-button" kinetic tension.
  const Icon = external ? ArrowUpRight : ArrowRight;
  const inner = (
    <>
      <span>{children}</span>
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-200 ease-out-strong hover-device:group-hover/btn:translate-x-0.5 hover-device:group-hover/btn:-translate-y-0.5 hover-device:group-hover/btn:scale-105",
          isPrimary ? "bg-background/10" : "bg-white/10",
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
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
    <Link href={href} onClick={onClick} className={classes}>
      {inner}
    </Link>
  );
}
