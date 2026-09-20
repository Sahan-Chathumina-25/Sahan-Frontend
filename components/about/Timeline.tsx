"use client";

import { motion, useReducedMotion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import type { EducationItem } from "@/data/education";

export function Timeline({ items }: { readonly items: readonly EducationItem[] }) {
  const reduceMotion = useReducedMotion();
  return (
    <ol className="relative space-y-8 border-l border-white/10 pl-0">
      {/* Animated progress line overlay */}
      <motion.span
        aria-hidden="true"
        className="absolute -left-px top-0 w-px origin-top bg-gradient-to-b from-primary to-secondary"
        style={{ height: "100%" }}
        initial={reduceMotion ? { scaleY: 1 } : { scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
      {items.map((item, i) => (
        <motion.li
          key={item.id}
          className="relative pl-10"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: i * 0.06 }}
        >
          <span
            aria-hidden="true"
            className="absolute left-0 top-1 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border border-primary/40 bg-ink-900 text-primary"
          >
            <GraduationCap size={14} />
          </span>
          <h3 className="font-display text-lg font-semibold text-paper">{item.title}</h3>
          <p className="mt-0.5 text-sm font-medium text-primary">{item.institution}</p>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-paper-dim">{item.detail}</p>
        </motion.li>
      ))}
    </ol>
  );
}
