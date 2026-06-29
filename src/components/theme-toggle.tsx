"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Mount guard: the resolved theme is only known client-side, so we render a
  // stable icon during SSR/hydration and reveal the real one once mounted.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/80 transition-colors hover:text-foreground hover:border-border-strong",
        className,
      )}
    >
      {/* Render a stable icon until mounted to avoid hydration mismatch */}
      {mounted ? (
        isDark ? (
          <Sun className="h-[1.05rem] w-[1.05rem]" />
        ) : (
          <Moon className="h-[1.05rem] w-[1.05rem]" />
        )
      ) : (
        <Sun className="h-[1.05rem] w-[1.05rem] opacity-0" />
      )}
    </button>
  );
}
