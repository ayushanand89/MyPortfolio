"use client";

import { useEffect } from "react";
import { profile } from "@/content/profile";

/** A note for the engineers who open dev tools (once per session). */
export function ConsoleSignature() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("aa:sig")) return;
      sessionStorage.setItem("aa:sig", "1");
    } catch {
      // Storage blocked - still fine to log.
    }
    const apple = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
    console.log(
      "%cAyush Anand%c\nYou opened the console, so you're my kind of person.\n\nThis site is hand-built: Next.js, React, TypeScript, Tailwind CSS, framer-motion and Lenis. No templates, no page builders.\n\nHiring?  %s\nSay hi:  %s\nGet around: press %s",
      "font: 800 20px system-ui, sans-serif; letter-spacing: .06em; text-transform: uppercase; color: #ff3b1f; padding: 6px 0",
      "font: 12px/1.7 ui-monospace, SFMono-Regular, Menlo, monospace",
      profile.resumeUrl,
      profile.email,
      apple ? "⌘K" : "Ctrl+K",
    );
  }, []);
  return null;
}
