"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight, Check, Quote } from "lucide-react";
import { testimonials, trustPoints } from "@/content/testimonials";
import { Container, Reveal, SectionHeader } from "@/components/primitives";
import { ShowcaseCard } from "@/components/showcase-card";
import { ParallaxGlow } from "@/components/motion-fx";

export function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCards = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section
      id="testimonials"
      className="relative isolate border-t border-border py-20 sm:py-28"
    >
      <ParallaxGlow className="left-[22%]" />
      <Container>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeader
              title="What working with me is like."
              className="mb-0"
            />
            <div className="flex items-center gap-2">
              <CarouselButton label="Previous" onClick={() => scrollByCards(-1)}>
                <ArrowLeft className="h-4 w-4" />
              </CarouselButton>
              <CarouselButton label="Next" onClick={() => scrollByCards(1)}>
                <ArrowRight className="h-4 w-4" />
              </CarouselButton>
            </div>
          </div>
        </Reveal>

        {/* Carousel lives inside the centered column; cards overflow it and
            scroll (snap for native touch/drag, arrows on desktop). Edges fade. */}
        <div
          ref={trackRef}
          className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 [mask-image:linear-gradient(to_right,transparent,black_2%,black_98%,transparent)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((t, i) => (
            <figure
              key={i}
              data-card
              className="w-[84%] shrink-0 snap-start sm:w-[21rem]"
            >
              <ShowcaseCard className="flex h-full flex-col p-7" tilt={6}>
                <Quote className="h-7 w-7 text-accent/60" />
                <blockquote className="mt-4 flex-1 leading-relaxed text-foreground/90">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 border-t border-white/10 pt-4">
                  <div className="font-medium">{t.name}</div>
                  <div className="text-sm text-muted">{t.role}</div>
                </figcaption>
              </ShowcaseCard>
            </figure>
          ))}
        </div>

        <Reveal>
          <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-3">
            {trustPoints.map((point) => (
              <li
                key={point}
                className="flex items-center gap-2 text-sm text-muted"
              >
                <Check className="h-4 w-4 text-accent" />
                {point}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}

function CarouselButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="glass inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition-[transform,color] duration-150 ease-out-strong hover:text-foreground active:scale-[0.94]"
    >
      {children}
    </button>
  );
}
