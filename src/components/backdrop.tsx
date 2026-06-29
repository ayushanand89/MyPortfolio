"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const BackdropScene = dynamic(() => import("./backdrop-scene"), { ssr: false });

export function Backdrop() {
  const { resolvedTheme } = useTheme();
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const dark = resolvedTheme !== "light";

  // Reduced motion: a calm static gradient instead of the live 3D scene.
  if (reduce) {
    return (
      <div
        aria-hidden
        className={cn(
          "pointer-events-none fixed inset-0 z-0",
          dark ? "opacity-60" : "opacity-50",
        )}
        style={{
          background: dark
            ? "radial-gradient(60% 50% at 72% 32%, #1f3a3055, transparent 70%)"
            : "radial-gradient(60% 50% at 72% 32%, #b9d8c455, transparent 70%)",
        }}
      />
    );
  }

  const palette = dark
    ? { base: "#2c5a49", spark: "#8fd4ad", ambient: 0.4, point: 1.6 }
    : { base: "#c3e2d1", spark: "#1c6b45", ambient: 1.0, point: 1.0 };

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 z-0 [mask-image:radial-gradient(82%_82%_at_70%_32%,black,transparent_85%)]",
        dark ? "opacity-70" : "opacity-50",
      )}
    >
      <BackdropScene {...palette} />
    </div>
  );
}
