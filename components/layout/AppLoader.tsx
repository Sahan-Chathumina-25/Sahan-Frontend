"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/** Minimal loader overlay. Fades out on first paint — never an artificial delay. */
export function AppLoader() {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {!ready && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-950"
          exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.3 } }}
        >
          <div className="flex items-center gap-1 font-display text-sm tracking-[0.5em] text-paper">
            {["S", "A", "H", "A", "N"].map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0.15 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: reduceMotion ? 0 : i * 0.06 }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
