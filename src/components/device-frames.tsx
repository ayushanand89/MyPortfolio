import type { ReactNode, Ref } from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Browser window chrome around a live-site recording or screenshot: traffic
 * lights, a URL pill with the real host, and a pulsing LIVE badge for sites
 * that are actually online. The screen area keeps the 16:10 of the captures.
 * `vtCover` marks it as the page's view-transition morph target.
 */
export function BrowserFrame({
  host,
  live = false,
  note,
  className,
  screenClassName,
  children,
  vtCover = false,
  ref,
}: {
  host: string;
  live?: boolean;
  /** Replaces the LIVE badge, e.g. "Private build". */
  note?: string;
  className?: string;
  screenClassName?: string;
  children: ReactNode;
  vtCover?: boolean;
  ref?: Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={ref}
      data-vt-cover={vtCover ? "" : undefined}
      style={vtCover ? { viewTransitionName: "cover" } : undefined}
      className={cn(
        "relative isolate overflow-hidden rounded-[14px] border border-white/10 bg-[#1b1a18] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.7)]",
        className,
      )}
    >
      <div className="flex h-9 items-center gap-3 border-b border-white/[0.07] px-3.5 sm:h-10">
        <span aria-hidden className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="mx-auto flex min-w-0 max-w-[60%] items-center gap-1.5 truncate rounded-md bg-white/[0.06] px-3 py-1 font-mono text-[0.7rem] text-white/70">
          <Lock aria-hidden className="h-2.5 w-2.5 shrink-0" />
          <span className="truncate">{host}</span>
        </span>
        {live ? (
          <span className="label flex shrink-0 items-center gap-1.5 text-[0.62rem] text-white/80">
            <span className="ping relative h-1.5 w-1.5 rounded-full bg-[#28c840]" />
            Live
          </span>
        ) : (
          <span className="label shrink-0 text-[0.62rem] text-white/50">{note}</span>
        )}
      </div>
      <div className={cn("relative aspect-[16/10] bg-[#0f0e0d]", screenClassName)}>
        {children}
      </div>
    </div>
  );
}

/** A phone: rounded bezel, dynamic-island pill, 9:19.5 screen. */
export function PhoneFrame({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative isolate rounded-[2.4rem] border border-white/15 bg-[#111] p-[0.55rem] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.75)]",
        className,
      )}
    >
      <div className="relative aspect-[9/19.5] overflow-hidden rounded-[1.9rem] bg-[#0f0e0d]">
        {children}
        <span
          aria-hidden
          className="absolute left-1/2 top-2 z-10 h-[1.35rem] w-[32%] -translate-x-1/2 rounded-full bg-black"
        />
      </div>
    </div>
  );
}
