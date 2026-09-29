"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useLenis } from "lenis/react";
import { ArrowDownToLine, ArrowUpRight, X } from "lucide-react";
import { profile } from "@/content/profile";
import { RESUME_EVENT } from "@/components/command-palette";

// The résumé stays the live Google Drive copy: preview and download are
// derived from the same file id, so updating the Drive file updates both.
const fileId = profile.resumeUrl.match(/\/d\/([^/]+)/)?.[1];
const previewUrl = fileId ? `https://drive.google.com/file/d/${fileId}/preview` : null;
const downloadUrl = fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : null;
const DESKTOP = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

/**
 * Résumé quick look. On desktop, any plain click on a link to the résumé
 * opens it in a side sheet (the live Drive preview) instead of sending a
 * recruiter off-site; download and open-in-Drive sit in the header.
 * Modifier-clicks, phones and tablets keep the normal new-tab link. Also
 * opens on the `resume:open` event (the command menu).
 */
export function ResumeQuickLook() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const lenis = useLenis();
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!previewUrl) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.getAttribute("href") !== profile.resumeUrl) return;
      if (a.hasAttribute("data-quicklook-skip")) return;
      if (!window.matchMedia(DESKTOP).matches) return;
      e.preventDefault();
      returnFocus.current = a;
      setOpen(true);
    };
    const onOpen = () => {
      if (window.matchMedia(DESKTOP).matches) setOpen(true);
      else window.open(profile.resumeUrl, "_blank", "noopener,noreferrer");
    };
    // Capture phase: runs before the link's own handlers.
    document.addEventListener("click", onClick, true);
    window.addEventListener(RESUME_EVENT, onOpen);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener(RESUME_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.setTimeout(() => closeRef.current?.focus(), 40);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      returnFocus.current?.focus?.();
    };
  }, [open, lenis]);

  if (!previewUrl) return null;

  return (
    <AnimatePresence onExitComplete={() => setLoaded(false)}>
      {open && (
        <div className="fixed inset-0 z-[90]" data-lenis-prevent>
          <m.div
            aria-hidden
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/55 backdrop-blur-[3px]"
          />
          <m.aside
            role="dialog"
            aria-modal="true"
            aria-label="Résumé"
            data-surface="ink"
            initial={{ x: "104%" }}
            animate={{ x: 0 }}
            exit={{ x: "104%" }}
            transition={{ type: "spring", stiffness: 300, damping: 36, mass: 0.9 }}
            className="absolute bottom-3 right-3 top-3 flex w-[min(820px,58vw)] flex-col overflow-hidden rounded-[22px] bg-[#161513] text-fg shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10"
          >
            <header className="flex items-center justify-between gap-4 border-b border-white/[0.08] px-5 py-3.5">
              <div className="min-w-0">
                <p className="caps truncate text-[1rem]">{profile.name}</p>
                <p className="data mt-0.5 text-muted">Résumé · always the live copy</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    className="label inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-2 transition-colors hover:border-white/40"
                  >
                    Download <ArrowDownToLine aria-hidden className="h-3.5 w-3.5" />
                  </a>
                )}
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-quicklook-skip
                  className="label inline-flex items-center gap-2 rounded-full bg-signal px-3.5 py-2 text-ink"
                >
                  Open in Drive <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
                </a>
                <button
                  ref={closeRef}
                  type="button"
                  aria-label="Close résumé"
                  onClick={() => setOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.07] transition-colors hover:bg-white/[0.14]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </header>
            <div className="relative flex-1 bg-[#0f0e0d]">
              {/* Sits beneath the (transparent-until-painted) frame: Drive's
                  page covers it as soon as it renders, whether or not its
                  load event ever fires. */}
              {!loaded && (
                <div className="absolute inset-0 grid place-items-center">
                  <span className="data flex items-center gap-3 text-muted">
                    <span className="block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                    Loading the live copy…
                  </span>
                </div>
              )}
              <iframe
                src={previewUrl}
                title={`${profile.name} résumé`}
                onLoad={() => setLoaded(true)}
                className="absolute inset-0 h-full w-full border-0"
                allow="autoplay"
              />
            </div>
          </m.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
