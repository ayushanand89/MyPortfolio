import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

const DIGITS = "01234567890123456789".split("");

/**
 * A mechanical counter: every digit is a reel that spins through a full turn
 * and lands on its value, reels staggered left → right. Pure CSS driven by
 * the shared reveal observer (`data-reveal="odo"` → `data-in`), so SSR,
 * no-JS and reduced motion simply show the final number (the reels rest on
 * their value by default). Screen readers get the plain value.
 */
export function Odometer({ value, className }: { value: string; className?: string }) {
  let col = 0;
  return (
    <span data-reveal="odo" className={cn("odo", className)}>
      <span className="sr-only">{value}</span>
      <span aria-hidden className="inline-flex">
        {value.split("").map((ch, i) => {
          if (!/\d/.test(ch)) {
            return (
              <span key={i} className="whitespace-pre">
                {ch}
              </span>
            );
          }
          const c = col++;
          return (
            <span key={i} className="odo-col">
              <span
                className="odo-reel"
                style={{ "--v": Number(ch) + 10, "--c": c } as CSSProperties}
              >
                {DIGITS.map((d, k) => (
                  <span key={k}>{d}</span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
