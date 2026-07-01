"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Shows the image as soon as it's available (visible by default — no JS gating,
 * so cached/fast images never get stuck behind the placeholder). A labelled
 * editorial placeholder sits behind it and is revealed only if the image is
 * missing or errors.
 *
 * `.media-reveal` layers a scroll-driven clip-path wipe on top *where the
 * browser supports it* (see globals.css); everywhere else the image simply
 * stays visible. The reveal can never hide the image.
 */
export function MediaFrame({
  src,
  alt,
  label,
  className,
  ratio = "aspect-[16/10]",
}: {
  src?: string;
  alt: string;
  label?: string;
  className?: string;
  ratio?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card",
        ratio,
        className,
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center bg-[repeating-linear-gradient(135deg,transparent,transparent_11px,var(--border)_11px,var(--border)_12px)]">
        <span className="rounded-full border border-border bg-background px-3 py-1 eyebrow">
          {label ?? "Screenshot"}
        </span>
      </div>

      {showImage && (
        // Plain img keeps us free of next/image remote config for a static portfolio.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="media-reveal absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}
