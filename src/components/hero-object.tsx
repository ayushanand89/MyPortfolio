"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const HeroObjectScene = dynamic(() => import("./hero-object-scene"), {
  ssr: false,
});

/**
 * The hero's foreground 3D layer — a cursor-reactive wireframe knot masked into
 * the upper-right of the hero. Only mounts on large, hover-capable pointers
 * (it's a desktop flourish and a second WebGL context we don't want on phones)
 * and never under reduced motion. Purely decorative and non-interactive.
 */
export function HeroObject() {
  const reduce = useReducedMotion();
  const [ok, setOk] = useState(false);
  // Pause WebGL rendering while the hero is scrolled out of view — no point
  // burning a frame loop on an off-screen desktop flourish.
  const [active, setActive] = useState(true);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOk(
      window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches,
    );
  }, []);

  useEffect(() => {
    if (!ok) return;
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "120px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ok]);

  if (reduce || !ok) return null;

  return (
    <div
      ref={boxRef}
      aria-hidden
      className="pointer-events-none absolute right-[-4%] top-1/2 -z-10 hidden h-[560px] w-[46%] -translate-y-1/2 opacity-90 [mask-image:radial-gradient(58%_58%_at_58%_50%,black,transparent_82%)] lg:block"
    >
      <HeroObjectScene frameloop={active ? "always" : "never"} />
    </div>
  );
}
