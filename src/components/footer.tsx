"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { profile } from "@/content/profile";
import { ButtonLink, Roll } from "./primitives";
import { LetterLens } from "./letter-lens";
import { LocalTime } from "./local-time";
import { Magnetic } from "./magnetic";
import { TransitionLink } from "./transition-link";

const sitemap = [
  { label: "About", href: "/#about" },
  { label: "Work", href: "/#work" },
  { label: "Services", href: "/#services" },
  { label: "Process", href: "/#process" },
  { label: "Contact", href: "/#contact" },
];

/**
 * The finale. Sticky to the viewport bottom BENEATH the page (layout gives the
 * page wrapper z-1 and an opaque fill), so the last chapter lifts away to
 * reveal it. It's always "in view" underneath, so its wordmark is triggered by
 * the `#page-end` sentinel at the bottom of the page wrapper instead of the
 * shared reveal observer. Until the page end is within a screen of the
 * viewport it isn't painted at all (`data-near`, see globals.css): hidden
 * under the page it only cost paint time, and (being geometrically "on
 * screen") it could pass for the page's largest contentful paint.
 */
export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const year = new Date().getFullYear();

  useEffect(() => {
    const footer = ref.current;
    const end = document.getElementById("page-end");
    if (!footer || !end) return;
    delete footer.dataset.open;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          footer.dataset.open = "";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -25% 0px" },
    );
    io.observe(end);
    delete footer.dataset.near;
    const nearIo = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) footer.dataset.near = "";
        else delete footer.dataset.near;
      },
      { rootMargin: "0px 0px 100% 0px" },
    );
    nearIo.observe(end);
    return () => {
      io.disconnect();
      nearIo.disconnect();
    };
  }, [pathname]);

  return (
    <footer
      ref={ref}
      data-surface="ink"
      className="sticky bottom-0 z-0 flex min-h-[min(100svh,46rem)] flex-col justify-end"
    >
      <div className="gutter mx-auto w-full max-w-[1600px] pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-16 sm:pt-24">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-line-strong pt-8 sm:gap-12 lg:grid-cols-12">
          <div className="col-span-2 sm:col-span-1 lg:col-span-5">
            <p className="serif text-[clamp(1.8rem,3vw,2.8rem)] leading-[1.05]">
              Got something worth building?{" "}
              <span className="italic text-signal">Let&rsquo;s talk.</span>
            </p>
            <Magnetic className="mt-7">
              <ButtonLink href="/#contact" variant="accent">
                Start a project
              </ButtonLink>
            </Magnetic>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2 lg:col-start-7">
            <p className="data text-muted">Index</p>
            <ul className="mt-4 space-y-2">
              {sitemap.map((l) => (
                <li key={l.href}>
                  <TransitionLink href={l.href} className="label group/roll inline-flex items-center">
                    <Roll>{l.label}</Roll>
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <p className="data text-muted">Elsewhere</p>
            <ul className="mt-4 space-y-2">
              {[
                { label: "GitHub", href: profile.socials.github },
                { label: "LinkedIn", href: profile.socials.linkedin },
                { label: "Résumé", href: profile.resumeUrl },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label group/roll inline-flex items-center gap-1.5"
                  >
                    <Roll>{l.label}</Roll>
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${profile.email}`} className="label group/roll inline-flex items-center">
                  <Roll>Email</Roll>
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-2 flex items-baseline justify-between gap-4 sm:col-span-1 sm:block lg:col-span-2">
            <p className="data text-muted">Local time</p>
            <p className="caps text-2xl sm:mt-4">
              <LocalTime />
            </p>
            <p className="data text-muted sm:mt-1">{profile.location}</p>
          </div>
        </div>

        <p
          className="footer-mark display mt-12 whitespace-nowrap text-[min(9.4vw,9.4rem)] leading-[0.8] sm:mt-20"
        >
          <span className="sr-only">{profile.name}</span>
          <span className="line" aria-hidden>
            <span>
              <LetterLens text={profile.name} accent="." />
            </span>
          </span>
        </p>

        <div className="data mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5 text-muted">
          <p>
            © {year} {profile.name}. Designed and built from scratch in Delhi. No templates.
          </p>
          <TransitionLink
            href={pathname}
            className="group/roll inline-flex items-center gap-2 text-fg"
          >
            <Roll>Back to top</Roll>
            <ArrowUp className="h-3 w-3" />
          </TransitionLink>
        </div>
      </div>
    </footer>
  );
}
