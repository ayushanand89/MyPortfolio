"use client";

import type { CSSProperties } from "react";
import { ArrowDown, Check } from "lucide-react";
import { useLenis } from "lenis/react";
import { profile } from "@/content/profile";
import { Container, Reveal, ButtonLink } from "@/components/primitives";
import { Magnetic } from "@/components/motion-fx";

export function Hero() {
  const lenis = useLenis();

  const scrollTo = (hash: string) => (e: React.MouseEvent) => {
    if (lenis) {
      e.preventDefault();
      lenis.scrollTo(hash, { offset: -72 });
    }
  };

  return (
    <section id="top" className="relative pt-36 pb-20 sm:pt-44 sm:pb-24">
      <Container>
        <Reveal immediate>
          <p className="eyebrow">
            {profile.role} · {profile.location}
            {profile.available ? " · Available for freelance" : ""}
          </p>
        </Reveal>

        <h1 className="display mt-6 text-[clamp(2.5rem,7.5vw,6rem)]">
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
              &amp; <span className="text-accent">full-stack products.</span>
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

      <Container>
        <div className="mt-16 flex items-center gap-3 text-faint sm:mt-20">
          <ArrowDown className="h-4 w-4 animate-bounce" />
          <span className="eyebrow">Scroll</span>
        </div>
      </Container>
    </section>
  );
}
