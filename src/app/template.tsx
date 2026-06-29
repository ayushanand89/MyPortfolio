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
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
