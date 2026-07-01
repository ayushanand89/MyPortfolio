"use client";

import { useRef, type CSSProperties } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowDown, Check } from "lucide-react";
import { useLenis } from "lenis/react";
import { profile } from "@/content/profile";
import { Container, Reveal, ButtonLink } from "@/components/primitives";
import { Magnetic, Spotlight } from "@/components/motion-fx";
import { HeroObject } from "@/components/hero-object";
import { smoothScrollToHash } from "@/lib/scroll";

export function Hero() {
  const lenis = useLenis();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Scroll-driven parallax: the hero drifts down, scales back, and fades as it
  // leaves — a cinematic "zoom out" hand-off to the rest of the page.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const parallax = reduce ? undefined : { y, scale, opacity };

  const scrollTo = (hash: string) => (e: React.MouseEvent) => {
    if (document.querySelector(hash)) {
      e.preventDefault();
      smoothScrollToHash(hash, lenis);
    }
  };

  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate pt-36 pb-20 sm:pt-44 sm:pb-24"
    >
      <Spotlight size={560} />
      <motion.div style={parallax}>
      <HeroObject />
      <Container>
        <Reveal immediate>
          <p className="eyebrow">
            {profile.role} · {profile.location}
            {profile.available ? " · Available for freelance" : ""}
          </p>
        </Reveal>

        <h1 className="display mt-6 text-[clamp(2.75rem,8.5vw,7rem)] font-extrabold">
          <span
            className="line-mask"
            style={{ "--reveal-delay": "0.05s" } as CSSProperties}
          >
            <span>I build premium websites</span>
          </span>
          <span
            className="line-mask"
            style={{ "--reveal-delay": "0.2s" } as CSSProperties}
          >
            <span>
              &amp; <span className="text-sweep">full-stack products.</span>
            </span>
          </span>
        </h1>

        <Reveal immediate delay={0.3}>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted text-balance sm:text-xl">
            {profile.intro}
          </p>
        </Reveal>

        <Reveal immediate delay={0.4}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic>
              <ButtonLink href="/#work" onClick={scrollTo("#work")}>
                View selected work
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink
                href="/#contact"
                variant="ghost"
                onClick={scrollTo("#contact")}
              >
                Work with me
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink href={profile.resumeUrl} variant="ghost" external>
                Résumé
              </ButtonLink>
            </Magnetic>
          </div>
        </Reveal>

        <Reveal immediate delay={0.5}>
          <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
            {profile.badges.map((badge) => (
              <li
                key={badge}
                className="flex items-center gap-2 text-sm text-muted"
              >
                <Check className="h-4 w-4 text-accent" />
                {badge}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
      </motion.div>

      <Container>
        <div className="mt-16 flex items-center gap-3 text-faint sm:mt-20">
          <ArrowDown className="h-4 w-4 animate-float" />
          <span className="eyebrow">Scroll</span>
        </div>
      </Container>
    </section>
  );
}
