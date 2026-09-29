"use client";

import Image from "next/image";
import { useEffect, useState, type Ref } from "react";
import { cn } from "@/lib/utils";

/**
 * Editorial image frame on next/image (responsive AVIF/WebP). Shows the cover
 * immediately, falling back to a labelled placeholder if it's missing or
 * errors.
 *
 * Entrance: a "window" reveal — the frame opens from a smaller window while
 * the picture settles from an overscan (compositor-only transforms, driven by
 * the shared reveal observer). The frame's own className never changes after
 * mount, so React can't wipe the observer's `.is-in` class.
 *
 * With an `images` gallery of 2+ on a hover-capable device, hovering
 * cross-fades through them (with progress ticks). Extra images only mount on
 * first hover.
 */
export function MediaFrame({
  src,
  images,
  alt,
  label,
  className,
  ratio = "aspect-[16/10]",
  active,
  scrim = false,
  zoomOnHover = false,
  eager = false,
  reveal = true,
  sizes = "(min-width: 1280px) 80vw, 100vw",
  vtCover = false,
  ref,
}: {
  src?: string;
  images?: string[];
  alt: string;
  label?: string;
  className?: string;
  ratio?: string;
  /** Controlled hover — when set, the parent (e.g. the whole card) drives the
   *  carousel. When omitted, the frame reacts to its own hover. */
  active?: boolean;
  /** Bottom gradient scrim for overlaid text/ticks. */
  scrim?: boolean;
  /** Slow zoom while an ancestor `group` is hovered (fine pointers). */
  zoomOnHover?: boolean;
  /** Preload the cover — for the page's LCP image. */
  eager?: boolean;
  /** Window-reveal entrance on scroll-in. */
  reveal?: boolean;
  sizes?: string;
  /** This frame is the page's morph target (`view-transition-name: cover`).
   *  Keep `reveal` off on it — the transition tracks the live element. */
  vtCover?: boolean;
  ref?: Ref<HTMLDivElement>;
}) {
  const [failed, setFailed] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [activated, setActivated] = useState(false);
  const [selfHover, setSelfHover] = useState(false);
  const [index, setIndex] = useState(0);

  const controlled = active !== undefined;
  const isHovering = controlled ? !!active : selfHover;

  const gallery = (images && images.length ? images : src ? [src] : []).filter(
    Boolean,
  );
  const canCarousel = enabled && gallery.length > 1;
  const showImage = gallery.length > 0 && !failed;
  const galleryLen = gallery.length;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  useEffect(() => {
    if (isHovering) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIndex(0);
  }, [isHovering]);

  useEffect(() => {
    if (!isHovering || !canCarousel) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActivated(true);
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % galleryLen);
    }, 1200);
    return () => clearInterval(id);
  }, [isHovering, canCarousel, galleryLen]);

  return (
    <div
      ref={ref}
      data-reveal={reveal ? "window" : undefined}
      data-vt-cover={vtCover ? "" : undefined}
      style={vtCover ? { viewTransitionName: "cover" } : undefined}
      className={cn(
        "relative isolate overflow-hidden rounded-[inherit] bg-raised",
        ratio,
        className,
      )}
      onPointerEnter={
        !controlled && canCarousel ? () => setSelfHover(true) : undefined
      }
      onPointerLeave={
        !controlled && canCarousel ? () => setSelfHover(false) : undefined
      }
    >
      {!showImage && (
        <div className="absolute inset-0 flex items-center justify-center bg-[repeating-linear-gradient(135deg,transparent,transparent_11px,var(--line)_11px,var(--line)_12px)]">
          <span className="label rounded-full border border-line bg-bg px-3 py-1.5 text-muted">
            {label ?? "Screenshot"}
          </span>
        </div>
      )}

      {showImage && (
        <div data-window-inner className="absolute inset-0">
          <div
            className={cn(
              "absolute inset-0",
              zoomOnHover &&
                "transition-transform duration-1600 ease-out-strong hover-device:group-hover:scale-[1.05]",
            )}
          >
            {gallery.map((s, i) => {
              // Only the cover mounts until the user hovers in.
              if (i > 0 && (!canCarousel || !activated)) return null;
              const isCover = i === 0;
              return (
                <Image
                  key={s}
                  src={s}
                  alt={isCover ? alt : ""}
                  fill
                  sizes={sizes}
                  preload={eager && isCover}
                  onError={isCover ? () => setFailed(true) : undefined}
                  className={cn(
                    "object-cover",
                    canCarousel &&
                      "transition-opacity duration-700 ease-out-strong",
                    canCarousel && i !== index ? "opacity-0" : "opacity-100",
                  )}
                />
              );
            })}
          </div>
        </div>
      )}

      {scrim && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/55 to-transparent"
        />
      )}

      {canCarousel && isHovering && (
        <div className="absolute inset-x-4 bottom-4 flex gap-1.5">
          {gallery.map((_, i) => (
            <span
              key={i}
              className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-white/25"
            >
              <span
                className={cn(
                  "absolute inset-0 origin-left rounded-full bg-white transition-transform ease-linear",
                  i < index && "scale-x-100 duration-0",
                  i === index && "scale-x-100 duration-1200",
                  i > index && "scale-x-0 duration-0",
                )}
              />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
