"use client";

import type { CSSProperties } from "react";
import { ArrowDown } from "lucide-react";
import { useLenis } from "lenis/react";
import { profile } from "@/content/profile";
import { Container, Reveal, ButtonLink } from "@/components/primitives";
import { Magnetic } from "@/components/motion-fx";

export function Hero() {
  const lenis = useLenis();

  const scrollToWork = (e: React.MouseEvent) => {
    if (lenis) {
      e.preventDefault();
      lenis.scrollTo("#work", { offset: -72 });
    }
  };

  return (
    <section id="top" className="relative pt-36 pb-20 sm:pt-44 sm:pb-28">
      <Container>
        <Reveal immediate>
          <p className="eyebrow">
            {profile.role} · {profile.location}
            {profile.available ? " · Available for work" : ""}
          </p>
        </Reveal>

        <h1 className="display mt-6 text-[clamp(2.6rem,8vw,6.25rem)]">
          <span
            className="line-mask"
            style={{ "--reveal-delay": "0.05s" } as CSSProperties}
          >
            <span>I build products,</span>
          </span>
          <span
            className="line-mask"
            style={{ "--reveal-delay": "0.2s" } as CSSProperties}
          >
            <span className="text-accent">end to end.</span>
          </span>
        </h1>

        <Reveal immediate delay={0.45}>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted text-balance sm:text-xl">
            {profile.intro}
          </p>
        </Reveal>

        <Reveal immediate delay={0.55}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic>
              <ButtonLink href="/#work" onClick={scrollToWork}>
                View selected work
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink href={profile.resumeUrl} variant="ghost" external>
                Résumé
              </ButtonLink>
            </Magnetic>
          </div>
        </Reveal>
      </Container>

      <Container>
        <div className="mt-20 flex items-center gap-3 text-faint sm:mt-28">
          <ArrowDown className="h-4 w-4 animate-bounce" />
          <span className="eyebrow">Scroll</span>
        </div>
      </Container>
    </section>
  );
}
