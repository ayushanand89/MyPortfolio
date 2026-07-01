"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

/**
 * Pins a section and pans its track sideways as the user scrolls vertically —
 * the scroll-hijacked horizontal gallery. The vertical scroll distance is
 * derived from the track's real overflow past the viewport (measured against
 * the clipping container, resize-aware), so it always lands exactly at the end.
 * An optional `header` stays pinned above the track for context. Under reduced
 * motion it degrades to a normal horizontal scroll strip.
 */
export function HorizontalPan({
  children,
  header,
  className,
}: {
  children: ReactNode;
  header?: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const distance = useRef(0);
  const [travel, setTravel] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, (v) => -(v * distance.current));

  useEffect(() => {
    if (reduce) return;
    const measure = () => {
      const track = trackRef.current;
      const vp = viewportRef.current;
      if (!track || !vp) return;
      const d = Math.max(0, track.scrollWidth - vp.clientWidth);
      distance.current = d;
      setTravel(d);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    if (viewportRef.current) ro.observe(viewportRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [reduce]);

  if (reduce) {
    return (
      <div className={className}>
        {header}
        <div className="mt-8 flex gap-6 overflow-x-auto px-6 pb-4 sm:px-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={sectionRef}
      style={{ height: `calc(100vh + ${travel}px)` }}
      className={className}
    >
      <div className="sticky top-0 flex h-screen flex-col">
        {header && (
          <div className="shrink-0 px-6 pt-28 sm:px-8">{header}</div>
        )}
        <div
          ref={viewportRef}
          className="flex flex-1 items-center overflow-hidden"
        >
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex gap-6 px-6 will-change-transform sm:px-8"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
