"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { ArrowLeft, ArrowUpRight, FileText } from "lucide-react";
import { profile } from "@/content/profile";
import { cn } from "@/lib/utils";
import { TransitionLink } from "@/components/transition-link";
import { LocalTime } from "@/components/local-time";
import { Dot, Roll, type Surface } from "@/components/primitives";
import { CHAPTERS, observeChapters, useActiveChapter } from "@/lib/chapters";

const links = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Process", href: "/#process" },
  { label: "Contact", href: "/#contact" },
];

// The résumé pill's glow ring is for larger screens; on phones it's a plain
// solid pill (still the one highlighted action in the bar).
// `bar`: below lg, once scrolled, the bar gets a solid fill of the
// surface beneath it, so the name and menu never sit on top of page content.
const tone: Record<Surface, { text: string; pill: string; line: string; bar: string }> = {
  ink: {
    text: "text-paper",
    bar: "max-lg:bg-ink",
    pill: "bg-signal text-ink sm:shadow-[0_0_0_4px_rgba(255,59,31,0.18)]",
    line: "border-paper/30 hover:border-paper",
  },
  paper: {
    text: "text-ink",
    bar: "max-lg:bg-paper",
    pill: "bg-signal text-ink sm:shadow-[0_0_0_4px_rgba(255,59,31,0.16)]",
    line: "border-ink/25 hover:border-ink",
  },
  signal: {
    text: "text-paper",
    bar: "max-lg:bg-signal",
    pill: "bg-ink text-paper sm:shadow-[0_0_0_4px_rgba(12,11,10,0.18)]",
    line: "border-paper/40 hover:border-paper",
  },
};

export function Nav() {
  const pathname = usePathname();
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [surface, setSurface] = useState<Surface>("ink");
  const activeId = useActiveChapter();
  const active = CHAPTERS.find((c) => c.id === activeId);
  const chapter = active ? (active.n ? `(${active.n}) ${active.label}` : active.label) : "";
  const isCase = pathname.startsWith("/work/");

  // Hide on scroll down, reveal on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        const y = window.scrollY;
        setScrolled(y > 24);
        const d = y - last;
        if (Math.abs(d) < 6) return;
        setHidden(d > 0 && y > 160);
        last = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Surface under the bar: hit-test the page just below the bar's midline
  // once per scrolled frame. Hit-testing respects occlusion (About sliding
  // over the pinned hero, the page lifting off the footer), which an
  // IntersectionObserver can't see.
  useEffect(() => {
    let queued = 0;
    const sample = () => {
      queued = 0;
      const y = 34;
      const stack = document.elementsFromPoint(window.innerWidth / 2, y);
      const hit = stack.find((el) => !el.closest("#site-nav, #site-menu"));
      const s = hit?.closest("[data-surface]")?.getAttribute("data-surface");
      if (s === "ink" || s === "paper" || s === "signal") setSurface(s);
    };
    const onScroll = () => {
      if (!queued) queued = requestAnimationFrame(sample);
    };
    sample();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(queued);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  // Shared chapter scrollspy (home only) - the dock and rail read it too.
  useEffect(() => {
    if (pathname !== "/") return;
    return observeChapters();
  }, [pathname]);

  // Menu open: freeze and inert the page underneath, close on Escape.
  useEffect(() => {
    if (!open) return;
    const main = document.getElementById("main");
    main?.setAttribute("inert", "");
    document.documentElement.dataset.menu = "open";
    lenis?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      main?.removeAttribute("inert");
      delete document.documentElement.dataset.menu;
      lenis?.start();
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis]);

  const t = tone[open ? "ink" : surface];

  return (
    <>
    <header
      id="site-nav"
      style={{ viewTransitionName: "site-nav" } as CSSProperties}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[transform,background-color] duration-500 ease-out-strong",
        hidden && !open && "-translate-y-full",
        scrolled && !open && t.bar,
      )}
    >
      <div
        className={cn(
          "gutter relative z-10 mx-auto grid h-16 max-w-[1600px] grid-cols-[1fr_auto] items-center gap-6 transition-colors duration-500 lg:grid-cols-[auto_1fr_auto] sm:h-[4.5rem]",
          t.text,
        )}
      >
        <TransitionLink
          href="/"
          onClick={() => setOpen(false)}
          className="group/roll flex w-fit items-center gap-2.5"
          aria-label={`${profile.name}, home`}
        >
          {profile.available && <Dot className="max-md:hidden" />}
          <span className="caps whitespace-nowrap text-[0.9rem] tracking-[-0.01em] sm:text-[0.95rem]">
            <Roll>{profile.name}</Roll>
          </span>
        </TransitionLink>

        {/* Centre: chapter indicator on home, a BACK pill on case studies. */}
        <div className="hidden justify-center xl:flex">
          {isCase ? (
            <TransitionLink
              href="/#work"
              className={cn(
                "label group/roll inline-flex items-center gap-2 rounded-full border px-4 py-2 transition-colors duration-500",
                t.line,
              )}
            >
              <ArrowLeft className="h-3 w-3" />
              <Roll>All work</Roll>
            </TransitionLink>
          ) : (
            <span className="label relative block h-4 min-w-40 overflow-hidden text-center">
              <span key={chapter} className="block animate-[fade-up_0.6s_var(--ease-out)_both]">
                {chapter}
              </span>
            </span>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 sm:gap-5 lg:gap-7">
          <ul className="hidden items-center gap-6 lg:flex">
            {links.slice(0, 4).map((link) => (
              <li key={link.href}>
                <TransitionLink
                  href={link.href}
                  className="label group/roll block opacity-80 transition-opacity hover:opacity-100"
                >
                  <Roll>{link.label}</Roll>
                </TransitionLink>
              </li>
            ))}
          </ul>
          <TransitionLink
            href="/#contact"
            className={cn(
              "label group/roll hidden items-center gap-2 rounded-full border px-4 py-2.5 transition-colors duration-500 xl:inline-flex",
              t.line,
            )}
          >
            <Roll>Let&rsquo;s talk</Roll>
          </TransitionLink>
          {/* Résumé - the one highlighted action in the bar, on every size.
              Opens the live Google Drive copy (always the latest). */}
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "label group/roll inline-flex items-center gap-2 rounded-full px-3.5 py-2.5 transition-[background-color,color,box-shadow] duration-500 sm:px-4",
              t.pill,
            )}
          >
            <FileText aria-hidden className="h-3.5 w-3.5" />
            <span className="sm:hidden">CV</span>
            <span className="hidden sm:inline">
              <Roll>Résumé</Roll>
            </span>
            <ArrowUpRight aria-hidden className="h-3 w-3" />
          </a>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
            className="label group/roll inline-flex h-10 items-center gap-2.5 lg:hidden"
          >
            <Roll>{open ? "Close" : "Menu"}</Roll>
            <span aria-hidden className="relative block h-2.5 w-5">
              <span
                className={cn(
                  "absolute inset-x-0 top-0 h-px bg-current transition-transform duration-500 ease-out-strong",
                  open && "translate-y-[5px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-500 ease-out-strong",
                  open && "-translate-y-[4px] -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </div>

    </header>

      {/* Mobile menu - an ink sheet that drops in; links rise from their
          clip edges in sequence. Kept mounted (inert when closed) so the
          open/close animation runs both ways. Lives outside the header so the
          header's hide transform can never become its containing block. */}
      <div
        id="site-menu"
        inert={!open}
        className={cn(
          "fixed inset-0 z-40 flex flex-col bg-ink text-paper transition-[transform,border-radius] duration-700 ease-in-out-strong lg:hidden",
          open
            ? "translate-y-0 rounded-none"
            : "-translate-y-full rounded-b-[40%]",
        )}
      >
        <nav className="gutter flex flex-1 flex-col justify-center pt-16">
          <ul>
            {links.map((link, i) => (
              <li key={link.href} className="line border-b border-[#262420]">
                <TransitionLink
                  href={link.href}
                  onClick={() => setOpen(false)}
                  style={{ transitionDelay: open ? `${180 + i * 60}ms` : "0ms" }}
                  className={cn(
                    "display flex items-baseline justify-between py-3 text-[clamp(2.4rem,12vw,4.5rem)] transition-transform duration-700 ease-out-strong",
                    open ? "translate-y-0" : "translate-y-full",
                  )}
                >
                  {link.label}
                  <span className="data text-[#9d978b]">0{i + 1}</span>
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>
        <div
          className={cn(
            "gutter pb-6 transition-opacity duration-500",
            open ? "opacity-100 delay-500" : "opacity-0",
          )}
        >
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-accent w-full justify-between"
          >
            <span className="flex items-center gap-2.5">
              <FileText aria-hidden className="h-4 w-4" />
              View my résumé
            </span>
            <ArrowUpRight aria-hidden className="h-4 w-4" />
          </a>
        </div>
        <div
          className={cn(
            "gutter flex flex-wrap items-end justify-between gap-x-4 gap-y-4 pb-[max(env(safe-area-inset-bottom),2rem)] transition-opacity duration-500",
            open ? "opacity-100 delay-500" : "opacity-0",
          )}
        >
          <div className="min-w-0 space-y-1">
            <a href={`mailto:${profile.email}`} className="block break-all text-sm">
              {profile.email}
            </a>
            <p className="data text-[#9d978b]">
              {profile.location} · <LocalTime />
            </p>
          </div>
          <div className="label flex gap-4">
            <a href={profile.socials.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
