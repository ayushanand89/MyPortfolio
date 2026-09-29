"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, m } from "framer-motion";
import { useLenis } from "lenis/react";
import {
  ArrowRight,
  Briefcase,
  Copy,
  CornerDownLeft,
  FileText,
  Github,
  Hash,
  Linkedin,
  Search,
  Sparkles,
} from "lucide-react";
import { CHAPTERS } from "@/lib/chapters";
import { flagshipProjects } from "@/content/projects";
import { profile } from "@/content/profile";
import { BRIEF_EVENT } from "@/content/brief";
import { useNavigate } from "@/components/transition-link";
import { cn } from "@/lib/utils";

export const PALETTE_EVENT = "palette:open";
export const RESUME_EVENT = "resume:open";

type Command = {
  id: string;
  group: "Actions" | "Case studies" | "Jump to" | "Elsewhere";
  label: string;
  hint?: string;
  keywords?: string;
  icon: ReactNode;
  run: () => void | Promise<void>;
  /** Keep the palette open after running (e.g. "Copied"). */
  stay?: boolean;
};

/** Fuzzy score: every query char must appear in order; tighter and earlier
 *  matches (and word starts) score higher. -1 = no match. */
function score(text: string, q: string) {
  if (!q) return 0;
  const t = text.toLowerCase();
  let ti = 0;
  let s = 0;
  let prev = -2;
  for (const ch of q.toLowerCase()) {
    if (ch === " ") continue;
    const at = t.indexOf(ch, ti);
    if (at < 0) return -1;
    s += at === prev + 1 ? 3 : 1;
    if (at === 0 || t[at - 1] === " ") s += 2;
    prev = at;
    ti = at + 1;
  }
  return s - t.length * 0.01;
}

/**
 * ⌘K / Ctrl+K command menu. Everything on the site in one keyboard-first
 * place: jump to a chapter, open a case study, start a brief, copy the email,
 * open the résumé. Fuzzy filtering, ↑↓ / ↵ / esc, a shared-layout highlight,
 * and proper combobox/listbox semantics. Also opens on the `palette:open`
 * event (the nav's ⌘K button).
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const lenis = useLenis();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setOpen(false), []);

  const commands = useMemo<Command[]>(() => {
    const brief = (detail: string, href: string) => () => {
      window.dispatchEvent(new CustomEvent(BRIEF_EVENT, { detail }));
      navigate(href);
    };
    const external = (url: string) => () => {
      window.open(url, "_blank", "noopener,noreferrer");
    };
    return [
      {
        id: "brief",
        group: "Actions",
        label: "Start a project",
        hint: "Brief",
        keywords: "hire freelance quote contact build",
        icon: <Sparkles className="h-4 w-4" />,
        run: brief("project", "/#contact"),
      },
      {
        id: "hiring",
        group: "Actions",
        label: "Hiring? Talk about a role",
        hint: "Recruiters",
        keywords: "job full-time recruiter role career",
        icon: <Briefcase className="h-4 w-4" />,
        run: brief("hiring", "/?brief=hiring#contact"),
      },
      {
        id: "resume",
        group: "Actions",
        label: "Open résumé",
        hint: "Quick look",
        keywords: "resume cv pdf",
        icon: <FileText className="h-4 w-4" />,
        run: () => {
          window.dispatchEvent(new Event(RESUME_EVENT));
        },
      },
      {
        id: "email",
        group: "Actions",
        label: copied ? "Copied to clipboard" : "Copy email address",
        hint: profile.email,
        keywords: "mail contact",
        icon: <Copy className="h-4 w-4" />,
        stay: true,
        run: async () => {
          try {
            await navigator.clipboard.writeText(profile.email);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
          } catch {
            window.location.href = `mailto:${profile.email}`;
          }
        },
      },
      ...flagshipProjects.map<Command>((p, i) => ({
        id: `case-${p.slug}`,
        group: "Case studies",
        label: p.title,
        hint: `0${i + 1}`,
        keywords: `${p.shortTitle ?? ""} ${p.domain ?? ""} ${p.tags.join(" ")}`,
        icon: <ArrowRight className="h-4 w-4" />,
        run: () => navigate(`/work/${p.slug}`),
      })),
      ...CHAPTERS.map<Command>((c) => ({
        id: `jump-${c.id}`,
        group: "Jump to",
        label: c.label,
        hint: c.n || undefined,
        icon: <Hash className="h-4 w-4" />,
        run: () => navigate(`/#${c.id}`),
      })),
      {
        id: "github",
        group: "Elsewhere",
        label: "GitHub",
        hint: "@ayushanand89",
        keywords: "code source repos",
        icon: <Github className="h-4 w-4" />,
        run: external(profile.socials.github),
      },
      {
        id: "linkedin",
        group: "Elsewhere",
        label: "LinkedIn",
        hint: "in/ayush-anand",
        icon: <Linkedin className="h-4 w-4" />,
        run: external(profile.socials.linkedin),
      },
    ];
  }, [navigate, copied]);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return commands;
    return commands
      .map((c) => ({ c, s: Math.max(score(c.label, q), score(`${c.label} ${c.keywords ?? ""}`, q) - 1) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.c);
  }, [commands, query]);

  // Global shortcut + the nav button's event.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(PALETTE_EVENT, onOpen);
    };
  }, []);

  // Open: freeze the page, focus the input. Close: restore focus.
  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    lenis?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    window.setTimeout(() => inputRef.current?.focus(), 20);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = prev;
      setQuery("");
      setActive(0);
      returnFocus.current?.focus?.();
    };
  }, [open, lenis]);

  // Keep the active row in view.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const runAt = async (i: number) => {
    const cmd = results[i];
    if (!cmd) return;
    if (!cmd.stay) close();
    // Let the dialog start leaving before scrolling/navigating.
    await new Promise((r) => window.setTimeout(r, cmd.stay ? 0 : 120));
    await cmd.run();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (results.length ? (a + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (results.length ? (a - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runAt(active);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  // Group headings only for the unfiltered list (search results are ranked).
  const grouped = !query.trim();

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90]" data-lenis-prevent>
          <m.div
            aria-hidden
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/55 backdrop-blur-[3px]"
          />
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            data-surface="ink"
            initial={{ opacity: 0, y: -14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 520, damping: 38, mass: 0.7 }}
            className="relative mx-auto mt-[12vh] flex max-h-[70vh] w-[min(640px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[20px] bg-[#161513] text-fg shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10"
          >
            <div className="flex items-center gap-3 border-b border-white/[0.08] px-5">
              <Search aria-hidden className="h-4 w-4 shrink-0 text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onKeyDown}
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-list"
                aria-activedescendant={results[active] ? `palette-${results[active].id}` : undefined}
                aria-autocomplete="list"
                placeholder="Search work, jump to a section, get in touch…"
                className="h-14 min-w-0 flex-1 bg-transparent text-[1.02rem] text-fg outline-none placeholder:text-faint"
              />
              <kbd className="data rounded-md border border-white/10 px-1.5 py-0.5 text-[0.65rem] text-muted">
                esc
              </kbd>
            </div>

            <div
              ref={listRef}
              id="palette-list"
              role="listbox"
              aria-label="Commands"
              className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain p-2"
            >
              {results.length === 0 && (
                <p className="px-3 py-10 text-center text-muted">
                  Nothing matches &ldquo;{query}&rdquo;.{" "}
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      navigate("/#contact");
                    }}
                    className="text-fg underline underline-offset-4"
                  >
                    Ask me directly
                  </button>
                </p>
              )}
              {results.map((cmd, i) => {
                const header = grouped && (i === 0 || results[i - 1].group !== cmd.group);
                const on = i === active;
                return (
                  <div key={cmd.id}>
                    {header && (
                      <p className="label px-3 pb-2 pt-4 text-[0.65rem] text-muted first:pt-2">
                        {cmd.group}
                      </p>
                    )}
                    <div
                      id={`palette-${cmd.id}`}
                      role="option"
                      aria-selected={on}
                      data-index={i}
                      onMouseMove={() => active !== i && setActive(i)}
                      onClick={() => runAt(i)}
                      className="relative flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5"
                    >
                      {on && (
                        <m.span
                          layoutId="palette-active"
                          transition={{ type: "spring", stiffness: 600, damping: 42 }}
                          className="absolute inset-0 rounded-xl bg-white/[0.07]"
                        />
                      )}
                      <span
                        className={cn(
                          "relative grid h-8 w-8 shrink-0 place-items-center rounded-lg border transition-colors",
                          on ? "border-signal/60 text-signal" : "border-white/10 text-muted",
                        )}
                      >
                        {cmd.icon}
                      </span>
                      <span className="relative min-w-0 flex-1 truncate text-[0.98rem]">{cmd.label}</span>
                      {cmd.hint && (
                        <span className="data relative hidden truncate text-muted sm:inline">{cmd.hint}</span>
                      )}
                      {on && (
                        <CornerDownLeft aria-hidden className="relative h-3.5 w-3.5 shrink-0 text-muted" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="data flex items-center justify-between gap-4 border-t border-white/[0.08] px-5 py-3 text-[0.65rem] text-muted">
              <span className="flex items-center gap-3">
                <span>↑↓ navigate</span>
                <span>↵ open</span>
                <span className="hidden sm:inline">esc close</span>
              </span>
              <span>Built from scratch</span>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
  );
}
