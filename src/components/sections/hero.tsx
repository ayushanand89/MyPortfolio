"use client";

import { useRef, type CSSProperties } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useLenis } from "lenis/react";
import { profile } from "@/content/profile";
import { Container, Reveal, ButtonLink } from "@/components/primitives";
import { Magnetic, Spotlight } from "@/components/motion-fx";
import { LocalTime } from "@/components/local-time";
import { Scramble } from "@/components/scramble";
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
      <Container>
        <Reveal immediate>
          <p className="eyebrow">
            <Scramble
              text={`${profile.role} · ${profile.location}${profile.available ? " · Available for freelance" : ""}`}
            />
          </p>
        </Reveal>

        <h1 className="display display-hero mt-6 text-[clamp(2.75rem,8.5vw,7.5rem)] font-extrabold">
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

        {/* Meta bar — live human signals (place + time, availability, current
            role) instead of generic feature badges. Hairline-divided, fixed
            row height so hydration of the clock never shifts layout. */}
        <Reveal immediate delay={0.5}>
          <dl className="mt-12 grid grid-cols-1 divide-y divide-border border-y border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="flex min-h-18 flex-col justify-center gap-1 py-3 sm:py-0 sm:pr-6">
              <dt className="eyebrow">Based in</dt>
              <dd className="text-sm text-foreground/90">
                {profile.location} · <LocalTime />
              </dd>
            </div>
            <div className="flex min-h-18 flex-col justify-center gap-1 py-3 sm:py-0 sm:px-6">
              <dt className="eyebrow">Availability</dt>
              <dd className="flex items-center gap-2 text-sm text-foreground/90">
                {profile.available && (
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                  </span>
                )}
                {profile.availabilityLabel}
              </dd>
            </div>
            <div className="flex min-h-18 flex-col justify-center gap-1 py-3 sm:py-0 sm:pl-6">
              <dt className="eyebrow">Currently</dt>
              <dd className="text-sm text-foreground/90">{profile.currently}</dd>
            </div>
          </dl>
        </Reveal>

        {/* Scroll cue — a real control that hands off to the About chapter,
            inside the parallax wrapper so it fades out with the hero. */}
        <div className="mt-14 sm:mt-16">
          <button
            type="button"
            onClick={scrollTo("#about")}
            className="group flex items-center gap-3 text-faint transition-colors duration-200 hover:text-foreground"
          >
            <ArrowDown className="h-4 w-4 animate-float" />
            <span className="eyebrow transition-colors duration-200 group-hover:text-foreground">
              Scroll
            </span>
          </button>
        </div>
      </Container>
      </motion.div>
    </section>
  );
}
