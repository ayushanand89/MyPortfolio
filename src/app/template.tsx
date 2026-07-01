"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Module-scoped: stays true across template remounts within a session, so the
// first (SSR/initial) render shows content immediately and only subsequent
// client navigations animate. Avoids hiding content behind JS on first load.
let navigated = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const [animateThis] = useState(() => navigated);

  useEffect(() => {
    navigated = true;
  }, []);

  if (!animateThis) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}
