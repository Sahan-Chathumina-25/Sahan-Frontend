"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, viewportOnce } from "@/components/animations/variants";

interface RevealProps {
  readonly children: ReactNode;
  readonly delay?: number;
  readonly className?: string;
  readonly as?: "div" | "section" | "li" | "span";
}

/** Scroll-triggered reveal wrapper. Renders statically when reduced motion is preferred. */
export function Reveal({ children, delay = 0, className, as = "div" }: RevealProps) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) {
    if (as === "section") return <section className={className}>{children}</section>;
    if (as === "li") return <li className={className}>{children}</li>;
    if (as === "span") return <span className={className}>{children}</span>;
    return <div className={className}>{children}</div>;
  }
  const Component = as === "section" ? motion.section : as === "li" ? motion.li : motion.div;
  return (
    <Component
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={{ delay }}
    >
      {children}
    </Component>
  );
}
