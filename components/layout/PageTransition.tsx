"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface PageTransitionProps {
  readonly children: ReactNode;
}

/**
 * Cross-fade + rise on every route change.
 *
 * Implemented as a CSS animation (not framer-motion) as a fail-safe: the
 * previous AnimatePresence `mode="wait"` implementation raced with the App
 * Router transition and could strand <main> at opacity 0 after navigation,
 * hiding the entire page body. CSS keyframes are time-based and always run to
 * completion, and without the animation the element is simply visible.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  return (
    <main key={pathname} className="page-transition">
      {children}
    </main>
  );
}
