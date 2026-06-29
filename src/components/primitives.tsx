import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
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
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  immediate?: boolean;
}) {
  const style: CSSProperties | undefined =
    immediate && delay
      ? ({ "--reveal-delay": `${delay * 1000}ms` } as CSSProperties)
      : undefined;

  return (
    <div className={cn(immediate ? "reveal-now" : "reveal", className)} style={style}>
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
  eyebrow: string;
  title: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-12 sm:mb-16", className)}>
      <span className="eyebrow">
        {index ? `${index} — ` : ""}
        {eyebrow}
      </span>
      <h2 className="display mt-4 text-3xl text-balance sm:text-4xl md:text-5xl">
        {title}
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
  const styles =
    variant === "primary"
      ? "bg-foreground text-background hover:opacity-90"
      : "border border-border text-foreground hover:border-border-strong";
  const classes = cn(
    "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 active:scale-[0.98]",
    styles,
    className,
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
        {children}
        <ArrowUpRight className="h-4 w-4" />
      </a>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={classes}>
      {children}
    </Link>
  );
}
