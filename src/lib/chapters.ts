"use client";

import { useSyncExternalStore } from "react";

/** The homepage chapters, in page order. */
export const CHAPTERS = [
  { id: "work", n: "01", label: "Work" },
  { id: "engineering", n: "02", label: "Engineering" },
  { id: "about", n: "03", label: "About" },
  { id: "services", n: "04", label: "Services" },
  { id: "process", n: "05", label: "Process" },
  { id: "experience", n: "06", label: "Track record" },
  { id: "testimonials", n: "", label: "Voices" },
  { id: "faq", n: "", label: "FAQ" },
  { id: "contact", n: "07", label: "Contact" },
] as const;

export type ChapterId = (typeof CHAPTERS)[number]["id"];

/**
 * One shared scrollspy for the whole app (nav indicator, chapter dock,
 * chapter rail): a single IntersectionObserver watching a thin band through
 * the middle of the viewport. The deepest chapter crossing it wins; the hero
 * (`#top`) reports null.
 */
let active: ChapterId | null = null;
const listeners = new Set<() => void>();
let io: IntersectionObserver | null = null;
const visible = new Set<string>();

function recompute() {
  const order = ["top", ...CHAPTERS.map((c) => c.id)];
  const id = [...order].reverse().find((k) => visible.has(k)) ?? null;
  const next = (id === "top" ? null : id) as ChapterId | null;
  if (next !== active) {
    active = next;
    listeners.forEach((l) => l());
  }
}

/** (Re)attach to the current page's sections - call on route changes. */
export function observeChapters() {
  io?.disconnect();
  visible.clear();
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target.id);
        else visible.delete(e.target.id);
      }
      recompute();
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  ["top", ...CHAPTERS.map((c) => c.id)].forEach((id) => {
    const el = document.getElementById(id);
    if (el) io!.observe(el);
  });
  recompute();
  return () => {
    io?.disconnect();
    io = null;
    visible.clear();
    recompute();
  };
}

export function useActiveChapter() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => active,
    () => null,
  );
}
