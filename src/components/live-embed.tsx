"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Monitor, Play, Smartphone, X } from "lucide-react";
import type { Project } from "@/content/projects";
import { BrowserFrame } from "@/components/device-frames";
import { LoopVideo } from "@/components/loop-video";
import { cn } from "@/lib/utils";

const DESKTOP = { w: 1440, h: 900 };
const MOBILE = { w: 390, h: 844 };

/**
 * The real website, running inside the case study. Starts as a facade — the
 * recording playing in browser chrome with a "Launch the live site" button —
 * so nothing third-party loads until asked. On launch it mounts the actual
 * site in an iframe: desktop mode renders it at a true 1440px layout scaled
 * to fit the frame; mobile mode renders a 390px phone viewport. Wheel/touch
 * inside the iframe stay inside it, so the page's smooth scroll is untouched.
 */
export function LiveEmbed({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const live = project.live!;
  const rec = project.media?.desktop;
  const [on, setOn] = useState(false);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [loaded, setLoaded] = useState(false);
  const [scale, setScale] = useState(0);
  const screenRef = useRef<HTMLDivElement>(null);

  // Phones get the mobile layout by default — a 1440px site scaled into a
  // 360px frame is unreadable.
  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDevice("mobile");
    }
  }, []);

  // Fit the virtual viewport into the screen area.
  useEffect(() => {
    const el = screenRef.current;
    if (!el || !on) return;
    const fit = () => {
      const { width, height } = el.getBoundingClientRect();
      const v = device === "desktop" ? DESKTOP : MOBILE;
      setScale(
        device === "desktop"
          ? width / v.w
          : Math.min((height * 0.94) / v.h, (width * 0.9) / v.w),
      );
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [on, device]);

  useEffect(() => {
    if (!on) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOn(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [on]);

  const switchDevice = (d: "desktop" | "mobile") => {
    if (d === device) return;
    setLoaded(false);
    setDevice(d);
  };

  const v = device === "desktop" ? DESKTOP : MOBILE;

  return (
    <div className={className}>
      <BrowserFrame
        host={live.host}
        live
        vtCover
        screenClassName={cn(
          device === "mobile" && on && "max-md:aspect-[9/16]",
          "transition-[aspect-ratio] duration-500",
        )}
      >
        <div ref={screenRef} className="absolute inset-0">
          {!on && (
            <>
              {rec ? (
                <LoopVideo
                  src={rec.video}
                  poster={rec.poster}
                  alt={`${project.title} — the live site`}
                  sizes="(min-width: 1600px) 1520px, 94vw"
                  priority
                />
              ) : null}
              <div className="absolute inset-0 flex items-center justify-center bg-linear-to-t from-black/55 via-black/10 to-black/20">
                <button
                  type="button"
                  onClick={() => {
                    setLoaded(false);
                    setOn(true);
                  }}
                  className="btn btn-accent group/roll shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)]"
                >
                  <Play aria-hidden className="h-3.5 w-3.5 fill-current" />
                  Launch the live site
                </button>
              </div>
              <p className="label absolute bottom-4 left-4 flex items-center gap-2 text-white/85 sm:bottom-5 sm:left-5">
                <span className="ping relative h-1.5 w-1.5 rounded-full bg-[#28c840]" />
                The real site — interactive, right here
              </p>
            </>
          )}

          {on && (
            <div
              data-lenis-prevent
              className="absolute inset-0 flex items-start justify-center overflow-hidden bg-[#0f0e0d]"
            >
              {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="label flex items-center gap-3 text-white/70">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-signal" />
                    Loading {live.host}…
                  </span>
                </div>
              )}
              {scale > 0 && (
                <div
                  className={cn(
                    "relative shrink-0 origin-top overflow-hidden transition-opacity duration-500",
                    device === "mobile" && "mt-[3%] rounded-[1.6rem] ring-1 ring-white/15",
                    loaded ? "opacity-100" : "opacity-0",
                  )}
                  style={{
                    width: v.w,
                    height: v.h,
                    transform: `scale(${scale})`,
                    marginBottom: v.h * (scale - 1),
                  }}
                >
                  <iframe
                    key={device}
                    src={live.url}
                    title={`${project.title} — live site`}
                    referrerPolicy="strict-origin-when-cross-origin"
                    allow="clipboard-write"
                    onLoad={() => setLoaded(true)}
                    className="h-full w-full border-0 bg-white"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </BrowserFrame>

      {/* Controls */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Preview size"
          className={cn(
            "flex rounded-full border border-line-strong p-1 transition-opacity duration-300",
            !on && "pointer-events-none opacity-40",
          )}
        >
          {(["desktop", "mobile"] as const).map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={device === d}
              onClick={() => switchDevice(d)}
              className={cn(
                "label flex items-center gap-2 rounded-full px-3.5 py-2 transition-colors duration-300",
                device === d ? "bg-fg text-bg" : "text-muted hover:text-fg",
              )}
            >
              {d === "desktop" ? (
                <Monitor aria-hidden className="h-3.5 w-3.5" />
              ) : (
                <Smartphone aria-hidden className="h-3.5 w-3.5" />
              )}
              {d}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {on && (
            <button type="button" onClick={() => setOn(false)} className="btn btn-line">
              <X aria-hidden className="h-3.5 w-3.5" />
              Close
            </button>
          )}
          <a
            href={live.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-line group/roll"
          >
            Open {live.host}
            <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
