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
  // The WebGL scene is a desktop layer only — on phones/tablets the aurora +
  // particles carry the atmosphere, and skipping a second always-on canvas
  // keeps mobile scrolling smooth.
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const mq = window.matchMedia("(min-width: 768px)");
    setDesktop(mq.matches);
    const onChange = () => setDesktop(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (!mounted) return null;

  const dark = resolvedTheme !== "light";

  // Reduced motion or mobile: a calm static gradient instead of the live 3D scene.
  if (reduce || !desktop) {
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
        dark ? "opacity-80" : "opacity-50",
      )}
    >
      <BackdropScene {...palette} />
    </div>
  );
}
