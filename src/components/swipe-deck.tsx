"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { m, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/use-media-query";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Dir = 1 | -1;

const settle = { type: "spring", stiffness: 260, damping: 30, mass: 0.9 } as const;
const flyOut = { type: "tween", duration: 0.34, ease: [0.4, 0, 0.9, 0.6] } as const;
// Cards behind the top one fan out slightly, alternating their lean.
const lean = [0, -2.6, 2.1, 0];

/**
 * A physical stack of cards. Drag the top card sideways (or use the arrows /
 * ← → keys) and it's flung off with its release velocity, then tucks back in
 * at the bottom of the deck while the next card springs forward. Cards
 * behind are inert. On phones the deck is "calm": a flat, tight stack (no
 * fanned lean, no wiggle hint - a quiet "Swipe" label instead) and a gentler
 * drag tilt. Render state: `live` = on show (the top card, plus the
 * one beneath while the top is being dragged off it) - media should play;
 * `warm` = top or next - media may preload.
 */
export function SwipeDeck<T>({
  items,
  keyOf,
  render,
  label,
  className,
  controlsClassName,
  counter = true,
  tabs,
}: {
  items: readonly T[];
  keyOf: (item: T) => string;
  render: (item: T, state: { live: boolean; warm: boolean; index: number }) => ReactNode;
  label: string;
  className?: string;
  controlsClassName?: string;
  counter?: boolean;
  /** Label per card: renders an index of every card above the deck (so it's
   *  obvious there are more before you reach the controls), tap to jump. */
  tabs?: (item: T) => string;
}) {
  const n = items.length;
  const reduce = useReducedMotion();
  const calm = !useMediaQuery("(min-width: 768px)");
  const deckRef = useRef<HTMLDivElement>(null);
  const [order, setOrder] = useState(() => items.map((_, i) => i));
  const [flying, setFlying] = useState<{ i: number; dir: Dir } | null>(null);
  const [entering, setEntering] = useState<{ i: number; dir: Dir } | null>(null);
  const [nudge, setNudge] = useState(false);
  const [dragging, setDragging] = useState(false);
  const width = () => deckRef.current?.offsetWidth ?? 400;
  const top = order[0];
  // The card on show — mid-fling that's already the one coming up.
  const shown = flying ? order[1] : top;

  const fling = (dir: Dir) => {
    if (flying || n < 2) return;
    if (reduce) setOrder((o) => [...o.slice(1), o[0]]);
    else setFlying({ i: order[0], dir });
  };
  const back = () => {
    if (flying || n < 2) return;
    const last = order[n - 1];
    setOrder((o) => [o[n - 1], ...o.slice(0, n - 1)]);
    if (!reduce) setEntering({ i: last, dir: -1 });
  };
  // Jump straight to a card: next/previous reuse the fling/back motions;
  // anything further is brought to the top and slides in from its side.
  const goTo = (i: number) => {
    if (flying || i === top) return;
    const pos = order.indexOf(i);
    if (pos === 1) return fling(-1);
    if (pos === n - 1) return back();
    setOrder((o) => [...o.slice(pos), ...o.slice(0, pos)]);
    if (!reduce) setEntering({ i, dir: i > top ? 1 : -1 });
  };
  const landed = (i: number) => {
    if (flying?.i !== i) return;
    setOrder((o) => [...o.slice(1), o[0]]);
    setFlying(null);
  };

  // A one-time nudge the first time the deck scrolls into view: the top card
  // leans left and springs back, so "this swipes" needs no instructions.
  useEffect(() => {
    const el = deckRef.current;
    if (!el || reduce || calm || n < 2) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        window.setTimeout(() => setNudge(true), 700);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce, calm, n]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") fling(-1);
    else if (e.key === "ArrowLeft") back();
    else return;
    e.preventDefault();
  };

  const pad = (v: number) => String(v).padStart(2, "0");

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={onKey}
      className={className}
    >
      {tabs && (
        <div
          role="tablist"
          aria-label={label}
          className="mb-5 grid gap-3"
          style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
        >
          {items.map((item, i) => {
            const on = i === shown;
            return (
              <button
                key={keyOf(item)}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => goTo(i)}
                className="relative flex flex-col items-start justify-start pb-3 text-left"
              >
                <span className="data block text-[0.65rem] text-muted">{pad(i + 1)}</span>
                <span
                  className={cn(
                    "label mt-1 block leading-tight transition-colors duration-500",
                    on ? "text-fg" : "text-muted",
                  )}
                >
                  {tabs(item)}
                </span>
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-line-strong" />
                {on && (
                  <m.span
                    aria-hidden
                    layoutId={`${label}-tab`}
                    transition={settle}
                    className="absolute inset-x-0 -bottom-px h-[3px] rounded-full bg-accent"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
      <div ref={deckRef} className="grid grid-cols-[minmax(0,1fr)] pb-8">
        {items.map((item, i) => {
          let depth = order.indexOf(i);
          if (flying && i !== flying.i) depth -= 1;
          const isTop = depth === 0 && flying?.i !== i;
          return (
            <DeckCard
              key={keyOf(item)}
              depth={flying?.i === i ? -1 : depth}
              count={n}
              draggable={i === top && !flying}
              flying={flying?.i === i ? flying.dir : 0}
              entering={entering?.i === i ? entering.dir : 0}
              nudge={nudge && i === top}
              calm={calm}
              width={width}
              onSwipe={fling}
              onLanded={() => landed(i)}
              onEntered={() => setEntering(null)}
              onNudged={() => setNudge(false)}
              onDragging={setDragging}
              label={`${pad(order.indexOf(i) + 1)} of ${pad(n)}`}
            >
              {render(item, {
                live: isTop || (dragging && depth === 1),
                warm: depth <= 1,
                index: i,
              })}
            </DeckCard>
          );
        })}
      </div>

      <div className={cn("flex items-center justify-between gap-4", controlsClassName)}>
        <div className="flex items-center gap-3">
          {counter && !tabs && (
            <span className="data tabular-nums text-muted" aria-live="polite">
              <span className="text-fg">{pad(shown + 1)}</span> / {pad(n)}
            </span>
          )}
          <span className={cn("flex gap-1.5", tabs && "hidden")} aria-hidden>
            {items.map((item, i) => (
              <span
                key={keyOf(item)}
                className={cn(
                  "h-1.5 rounded-full transition-[width,background-color] duration-500 ease-out-strong",
                  i === shown ? "w-6 bg-accent" : "w-1.5 bg-line-strong",
                )}
              />
            ))}
          </span>
          <span className="label text-muted md:hidden">Swipe</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous"
            onClick={back}
            className="btn btn-line h-12 w-12 justify-center p-0!"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => fling(-1)}
            className="btn btn-line h-12 w-12 justify-center p-0!"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function DeckCard({
  depth,
  count,
  draggable,
  flying,
  entering,
  nudge,
  calm,
  width,
  onSwipe,
  onLanded,
  onEntered,
  onNudged,
  onDragging,
  label,
  children,
}: {
  /** 0 = top; -1 = currently being flung off. */
  depth: number;
  count: number;
  draggable: boolean;
  flying: Dir | 0;
  entering: Dir | 0;
  nudge: boolean;
  calm: boolean;
  width: () => number;
  onSwipe: (dir: Dir) => void;
  onLanded: () => void;
  onEntered: () => void;
  onNudged: () => void;
  onDragging: (on: boolean) => void;
  label: string;
  children: ReactNode;
}) {
  const x = useMotionValue(0);
  const tilt = calm ? 8 : 14;
  const rotate = useTransform(x, [-420, 0, 420], [-tilt, 0, tilt]);
  const dragged = useRef(false);
  const d = Math.max(0, depth);
  const hidden = d > 2;

  const onDragEnd = (_: unknown, info: PanInfo) => {
    onDragging(false);
    const w = width();
    const { offset, velocity } = info;
    if (offset.x < -w * 0.22 || velocity.x < -520) onSwipe(-1);
    else if (offset.x > w * 0.22 || velocity.x > 520) onSwipe(1);
  };

  let xTarget: number | number[] = 0;
  let xTransition: object = settle;
  if (flying) {
    xTarget = flying * width() * 1.25;
    xTransition = flyOut;
  } else if (entering) {
    xTarget = [entering * width() * 1.25, 0];
  } else if (nudge) {
    xTarget = [0, -34, 0];
    xTransition = { duration: 0.9, times: [0, 0.4, 1], ease: "easeInOut" };
  }

  return (
    <m.div
      aria-roledescription="slide"
      aria-label={label}
      aria-hidden={depth !== 0 || undefined}
      inert={depth !== 0}
      className="min-w-0 [grid-area:1/1]"
      style={{ zIndex: flying ? count + 1 : count - d, transformOrigin: "50% 100%" }}
      initial={false}
      animate={{
        y: d * (calm ? 10 : 14),
        scale: 1 - d * (calm ? 0.035 : 0.045),
        rotate: calm ? 0 : lean[Math.min(d, 3)],
        opacity: hidden ? 0 : 1,
      }}
      transition={settle}
    >
      <m.div
        style={{ x, rotate }}
        drag={draggable ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.9}
        dragMomentum={false}
        onPointerDownCapture={() => (dragged.current = false)}
        onDragStart={() => {
          dragged.current = true;
          onDragging(true);
        }}
        onDragEnd={onDragEnd}
        onClickCapture={(e) => {
          // A drag that ends over a link must not also follow it.
          if (!dragged.current) return;
          e.preventDefault();
          e.stopPropagation();
        }}
        animate={{ x: xTarget }}
        transition={xTransition}
        onAnimationComplete={() => {
          if (flying) onLanded();
          else if (entering) onEntered();
          else if (nudge) onNudged();
        }}
        className={cn("h-full", draggable && "cursor-grab active:cursor-grabbing")}
      >
        {children}
      </m.div>
    </m.div>
  );
}
