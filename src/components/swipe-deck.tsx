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
 * behind are inert. Render state: `live` = on show (the top card, plus the
 * one beneath while the top is being dragged off it) — media should play;
 * `warm` = top or next — media may preload.
 */
export function SwipeDeck<T>({
  items,
  keyOf,
  render,
  label,
  className,
  controlsClassName,
  counter = true,
}: {
  items: readonly T[];
  keyOf: (item: T) => string;
  render: (item: T, state: { live: boolean; warm: boolean; index: number }) => ReactNode;
  label: string;
  className?: string;
  controlsClassName?: string;
  counter?: boolean;
}) {
  const n = items.length;
  const reduce = useReducedMotion();
  const deckRef = useRef<HTMLDivElement>(null);
  const [order, setOrder] = useState(() => items.map((_, i) => i));
  const [flying, setFlying] = useState<{ i: number; dir: Dir } | null>(null);
  const [entering, setEntering] = useState<{ i: number; dir: Dir } | null>(null);
  const [nudge, setNudge] = useState(false);
  const [dragging, setDragging] = useState(false);
  const width = () => deckRef.current?.offsetWidth ?? 400;
  const top = order[0];

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
  const landed = (i: number) => {
    if (flying?.i !== i) return;
    setOrder((o) => [...o.slice(1), o[0]]);
    setFlying(null);
  };

  // A one-time nudge the first time the deck scrolls into view: the top card
  // leans left and springs back, so "this swipes" needs no instructions.
  useEffect(() => {
    const el = deckRef.current;
    if (!el || reduce || n < 2) return;
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
  }, [reduce, n]);

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
          {counter && (
            <span className="data tabular-nums text-muted" aria-live="polite">
              <span className="text-fg">{pad(top + 1)}</span> / {pad(n)}
            </span>
          )}
          <span className="flex gap-1.5" aria-hidden>
            {items.map((item, i) => (
              <span
                key={keyOf(item)}
                className={cn(
                  "h-1.5 rounded-full transition-[width,background-color] duration-500 ease-out-strong",
                  i === top ? "w-6 bg-accent" : "w-1.5 bg-line-strong",
                )}
              />
            ))}
          </span>
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
  const rotate = useTransform(x, [-420, 0, 420], [-14, 0, 14]);
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
        y: d * 14,
        scale: 1 - d * 0.045,
        rotate: lean[Math.min(d, 3)],
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
