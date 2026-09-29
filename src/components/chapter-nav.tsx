"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { useLenis } from "lenis/react";
import { ArrowUp, ArrowUpRight, ChevronUp, X } from "lucide-react";
import { CHAPTERS, useActiveChapter } from "@/lib/chapters";
import { scroll } from "@/lib/motion";
import { smoothScrollToHash } from "@/lib/scroll";
import { profile } from "@/content/profile";
import { cn } from "@/lib/utils";

const spring = { type: "spring", stiffness: 420, damping: 36, mass: 0.8 } as const;

/** Shown once past the hero, hidden again as the footer lifts into view. */
function useChapterNavVisible() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let pastHero = false;
    let atEnd = false;
    const update = () => setVisible(pastHero && !atEnd);
    const check = () => {
      const next = scroll.y > window.innerHeight * 0.7;
      if (next !== pastHero) {
        pastHero = next;
        update();
      }
    };
    const off = scroll.subscribe(check);
    check();
    // #page-end marks the bottom of the content sheet — once it's on screen
    // the footer (which has its own links) is being uncovered.
    const end = document.getElementById("page-end");
    const io = end
      ? new IntersectionObserver(([e]) => {
          atEnd = e.isIntersecting;
          update();
        })
      : null;
    if (end) io!.observe(end);
    return () => {
      off();
      io?.disconnect();
    };
  }, []);
  return visible;
}

function useJump() {
  const lenis = useLenis();
  return (id: string) => {
    if (id === "top") {
      if (lenis) lenis.scrollTo(0, { duration: 1.4 });
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    smoothScrollToHash(`#${id}`, lenis);
  };
}

/**
 * Phone/tablet chapter dock — a thumb-reach pill at the bottom showing where
 * you are (chapter + page progress ring). Tap it and it morphs (a framer
 * layout animation) into a jump list for every chapter.
 */
export function ChapterDock() {
  const pathname = usePathname();
  const visible = useChapterNavVisible();
  const activeId = useActiveChapter();
  const jump = useJump();
  const [open, setOpen] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);
  const active = CHAPTERS.find((c) => c.id === activeId) ?? CHAPTERS[0];

  // Page progress ring — written straight to the SVG, no re-renders.
  useEffect(() => {
    const C = 2 * Math.PI * 9;
    const paint = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, scroll.y / max) : 0;
      ringRef.current?.setAttribute("stroke-dashoffset", String(C * (1 - p)));
    };
    paint();
    return scroll.subscribe(paint);
  }, [visible]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(false), [pathname, visible]);

  if (pathname !== "/") return null;

  return (
    <>
      <AnimatePresence>
        {open && (
          <m.button
            key="scrim"
            type="button"
            aria-label="Close chapters"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="chapter-dock fixed inset-0 z-[46] bg-ink/40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className="chapter-dock pointer-events-none fixed inset-x-0 bottom-0 z-[47] flex justify-center px-4 pb-[max(env(safe-area-inset-bottom),0.85rem)] lg:hidden">
        <AnimatePresence>
          {visible && (
            <m.div
              key="dock"
              layout
              initial={{ y: 90, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 90, opacity: 0 }}
              transition={spring}
              style={{ borderRadius: open ? 26 : 999 }}
              className={cn(
                "pointer-events-auto overflow-hidden bg-ink text-paper shadow-[0_18px_50px_-12px_rgba(0,0,0,0.6)] ring-1 ring-white/10",
                open ? "w-full max-w-sm" : "w-auto",
              )}
            >
              {open ? (
                <m.nav
                  key="list"
                  aria-label="Jump to a chapter"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.08 } }}
                  className="p-2"
                >
                  <div className="flex items-center justify-between px-3 pb-2 pt-2">
                    <span className="label text-[#9d978b]">Jump to</span>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      aria-label="Close"
                      className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.07]"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <ul>
                    {CHAPTERS.map((c, i) => {
                      const on = c.id === active.id;
                      return (
                        <m.li
                          key={c.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0, transition: { delay: 0.05 + i * 0.03 } }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setOpen(false);
                              jump(c.id);
                            }}
                            className="relative flex w-full items-center gap-4 rounded-2xl px-3 py-3 text-left"
                          >
                            {on && (
                              <m.span
                                layoutId="dock-active"
                                transition={spring}
                                className="absolute inset-0 rounded-2xl bg-white/[0.08]"
                              />
                            )}
                            <span className={cn("data relative w-7", on ? "text-signal" : "text-[#9d978b]")}>
                              {c.n}
                            </span>
                            <span className="caps relative text-[1.15rem]">{c.label}</span>
                            {on && <span className="relative ml-auto h-1.5 w-1.5 rounded-full bg-signal" />}
                          </button>
                        </m.li>
                      );
                    })}
                  </ul>
                  <div className="mt-1 grid grid-cols-2 gap-2 border-t border-white/10 px-1 pb-1 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        jump("top");
                      }}
                      className="label flex items-center justify-center gap-2 rounded-full bg-white/[0.07] py-3"
                    >
                      <ArrowUp className="h-3.5 w-3.5" /> Top
                    </button>
                    <a
                      href={profile.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="label flex items-center justify-center gap-2 rounded-full bg-signal py-3 text-ink"
                    >
                      Résumé <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </m.nav>
              ) : (
                <m.button
                  key="pill"
                  type="button"
                  onClick={() => setOpen(true)}
                  aria-expanded={false}
                  aria-label={`Chapter ${active.n} ${active.label}. Open chapter list`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex h-12 items-center gap-3 pl-2 pr-4"
                >
                  <svg viewBox="0 0 24 24" className="h-8 w-8 -rotate-90" aria-hidden>
                    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2.2" />
                    <circle
                      ref={ringRef}
                      cx="12"
                      cy="12"
                      r="9"
                      fill="none"
                      stroke="var(--signal)"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 9}
                      strokeDashoffset={2 * Math.PI * 9}
                    />
                  </svg>
                  <span className="data text-signal">{active.n}</span>
                  <span className="relative block h-5 w-[9.25rem] overflow-hidden text-left">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <m.span
                        key={active.id}
                        initial={{ y: "110%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-110%" }}
                        transition={spring}
                        className="caps absolute inset-0 whitespace-nowrap text-[0.95rem] leading-5"
                      >
                        {active.label}
                      </m.span>
                    </AnimatePresence>
                  </span>
                  <ChevronUp className="h-4 w-4 text-[#9d978b]" aria-hidden />
                </m.button>
              )}
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

/**
 * Desktop chapter rail — a quiet column of ticks on the right edge. The active
 * tick stretches (shared layout animation); hovering the rail fans out every
 * label. Difference-blended so it reads on ink, paper and signal alike.
 */
export function ChapterRail() {
  const pathname = usePathname();
  const visible = useChapterNavVisible();
  const activeId = useActiveChapter();
  const jump = useJump();
  if (pathname !== "/") return null;

  return (
    <AnimatePresence>
      {visible && (
        <m.nav
          aria-label="Chapters"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={spring}
          className="group/rail fixed right-3 top-1/2 z-[46] hidden -translate-y-1/2 text-white mix-blend-difference lg:block"
        >
          <ul className="flex flex-col items-end">
            {CHAPTERS.map((c, i) => {
              const on = c.id === activeId;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => jump(c.id)}
                    aria-current={on ? "true" : undefined}
                    className="flex items-center gap-3 py-[7px] pl-4"
                  >
                    <span
                      style={{ transitionDelay: `${i * 25}ms` }}
                      className="label translate-x-2 whitespace-nowrap opacity-0 transition-[opacity,transform] duration-300 group-hover/rail:translate-x-0 group-hover/rail:opacity-100 group-focus-within/rail:translate-x-0 group-focus-within/rail:opacity-100"
                    >
                      <span className="data mr-2 opacity-60">{c.n}</span>
                      {c.label}
                    </span>
                    <span className="relative flex h-[2px] w-6 items-center justify-end">
                      <span className="h-px w-2.5 bg-current opacity-45" />
                      {on && (
                        <m.span
                          layoutId="rail-active"
                          transition={spring}
                          className="absolute inset-y-0 right-0 w-6 bg-current"
                        />
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </m.nav>
      )}
    </AnimatePresence>
  );
}
