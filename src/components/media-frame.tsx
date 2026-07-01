"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Editorial image frame. Shows the cover image immediately (visible by default,
 * with a scroll-driven clip reveal via `.media-reveal`), falling back to a
 * labelled placeholder if the image is missing or errors.
 *
 * When passed an `images` gallery of 2+ and on a hover-capable device, hovering
 * cross-fades through the images like a carousel (with dots). The extra images
 * only mount on first hover, so they don't all load on page render. Under touch
 * or reduced motion it's just the static cover.
 */
export function MediaFrame({
  src,
  images,
  alt,
  label,
  className,
  ratio = "aspect-[16/10]",
  active,
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
    }, 1100);
    return () => clearInterval(id);
  }, [isHovering, canCarousel, galleryLen]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card",
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
      <div className="absolute inset-0 flex items-center justify-center bg-[repeating-linear-gradient(135deg,transparent,transparent_11px,var(--border)_11px,var(--border)_12px)]">
        <span className="rounded-full border border-border bg-background px-3 py-1 eyebrow">
          {label ?? "Screenshot"}
        </span>
      </div>

      {/* The scroll reveal lives on this STABLE wrapper (its className never
          changes), not on the imgs — the imgs' classes flip on hover/carousel,
          which would let React wipe the JS-fallback `.is-inview`. The reveal is
          opacity/transform (not clip-path) so Firefox drives it on a view()
          timeline too. */}
      {showImage && (
        <div className="media-reveal absolute inset-0">
          {gallery.map((s, i) => {
            // Only the cover mounts until the user hovers in.
            if (i > 0 && (!canCarousel || !activated)) return null;
            const isCover = i === 0;
            return (
              // Plain img keeps us free of next/image remote config for a static portfolio.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={s}
                src={s}
                alt={isCover ? alt : ""}
                loading="lazy"
                onError={isCover ? () => setFailed(true) : undefined}
                className={cn(
                  "absolute inset-0 h-full w-full object-cover",
                  canCarousel &&
                    "transition-opacity duration-500 ease-out-strong",
                  canCarousel && i !== index ? "opacity-0" : "opacity-100",
                )}
              />
            );
          })}
        </div>
      )}

      {canCarousel && isHovering && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {gallery.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-colors duration-300",
                i === index ? "bg-accent" : "bg-foreground/40",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
