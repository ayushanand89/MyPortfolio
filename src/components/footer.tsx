"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { profile } from "@/content/profile";
import { ButtonLink, Roll } from "./primitives";
import { LocalTime } from "./local-time";
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
 * shared reveal observer.
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
    return () => io.disconnect();
  }, [pathname]);

  return (
    <footer
      ref={ref}
      data-surface="ink"
      className="sticky bottom-0 z-0 flex min-h-[min(100svh,46rem)] flex-col justify-end"
    >
      <div className="gutter mx-auto w-full max-w-[1600px] pb-6 pt-24">
        <div className="grid gap-12 border-t border-line-strong pt-8 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="serif text-[clamp(1.8rem,3vw,2.8rem)] leading-[1.05]">
              Got something worth building?{" "}
              <span className="italic text-signal">Let&rsquo;s talk.</span>
            </p>
            <ButtonLink href="/#contact" variant="accent" className="mt-7">
              Start a project
            </ButtonLink>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2 lg:col-start-7">
            <p className="data text-muted">Index</p>
            <ul className="mt-4 space-y-2">
              {sitemap.map((l) => (
                <li key={l.href}>
                  <TransitionLink href={l.href} className="label group/roll">
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
                <a href={`mailto:${profile.email}`} className="label group/roll">
                  <Roll>Email</Roll>
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="data text-muted">Local time</p>
            <p className="caps mt-4 text-2xl">
              <LocalTime />
            </p>
            <p className="data mt-1 text-muted">{profile.location}</p>
          </div>
        </div>

        <p
          aria-label={profile.name}
          className="footer-mark display mt-16 whitespace-nowrap text-[9.4vw] leading-[0.8] min-[1600px]:text-[9.4rem] sm:mt-20"
        >
          <span className="line" aria-hidden>
            <span>
              {profile.name}
              <span className="text-signal">.</span>
            </span>
          </span>
        </p>

        <div className="data mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5 text-muted">
          <p>
            © {year} {profile.name} — Designed &amp; built in Delhi with Next.js
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
