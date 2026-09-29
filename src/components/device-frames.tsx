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

/** Relative luminance of a #rrggbb colour, 0 (black) → 1 (white). */
function luminance(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255].map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * A phone: rounded bezel, dynamic island and a status bar, like a real
 * iPhone - the site starts BELOW the status bar instead of running under the
 * island. `tint` is the status bar colour; pass the captured page's top-edge
 * colour so bar and header read as one surface (the time and icons flip
 * dark/light to suit). Captures are full 390×844 viewports; the status bar
 * trims their bottom edge, never the header.
 */
export function PhoneFrame({
  className,
  tint = "#0f0e0d",
  children,
}: {
  className?: string;
  tint?: string;
  children: ReactNode;
}) {
  const ink = luminance(tint) > 0.45 ? "#111" : "#fff";
  return (
    <div
      className={cn(
        "relative isolate rounded-[2.4rem] border border-white/15 bg-[#111] p-[0.55rem] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.75)]",
        className,
      )}
    >
      <div
        className="relative aspect-[9/19.5] overflow-hidden rounded-[1.9rem] [--sb:max(6%,2.1rem)]"
        style={{ backgroundColor: tint }}
      >
        <div className="absolute inset-x-0 bottom-0 top-(--sb)">{children}</div>
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 flex h-(--sb) items-center justify-between px-[9%] pt-[0.2rem] text-[0.6rem] font-semibold tracking-tight"
          style={{ color: ink }}
        >
          <span className="tabular-nums">9:41</span>
          <span className="flex items-center gap-[0.22rem]">
            <svg viewBox="0 0 17 11" className="h-[0.5rem]" fill="currentColor">
              <rect x="0" y="7" width="3" height="4" rx="0.7" />
              <rect x="4.5" y="5" width="3" height="6" rx="0.7" />
              <rect x="9" y="2.5" width="3" height="8.5" rx="0.7" />
              <rect x="13.5" y="0" width="3" height="11" rx="0.7" />
            </svg>
            <svg viewBox="0 0 15 11" className="h-[0.5rem]" fill="currentColor">
              <path d="M7.5 2.2c2.1 0 4 .8 5.5 2.1l1.1-1.1A9.3 9.3 0 0 0 7.5.6 9.3 9.3 0 0 0 .9 3.2L2 4.3a7.7 7.7 0 0 1 5.5-2.1Zm0 3.2c1.2 0 2.4.5 3.2 1.2l1.1-1.1a6.2 6.2 0 0 0-8.6 0l1.1 1.1c.9-.7 2-1.2 3.2-1.2Zm0 3.2c-.4 0-.8.2-1.1.4L7.5 10l1.1-1.1c-.3-.2-.7-.4-1.1-.4Z" />
            </svg>
            <svg viewBox="0 0 25 12" className="h-[0.55rem]" fill="none">
              <rect x="0.5" y="0.5" width="21" height="11" rx="3.2" stroke="currentColor" strokeOpacity="0.4" />
              <rect x="2" y="2" width="16" height="8" rx="1.8" fill="currentColor" />
              <path d="M23 4v4c.8-.3 1.3-1.1 1.3-2S23.8 4.3 23 4Z" fill="currentColor" fillOpacity="0.45" />
            </svg>
          </span>
        </div>
        <span
          aria-hidden
          className="absolute left-1/2 top-[0.45rem] z-10 h-[1.35rem] w-[32%] -translate-x-1/2 rounded-full bg-black"
        />
      </div>
    </div>
  );
}
