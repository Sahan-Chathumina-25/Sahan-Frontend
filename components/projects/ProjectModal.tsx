"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ExternalLink, FolderGit2, X } from "lucide-react";
import type { Project } from "@/data/projects";
import { useFocusTrap } from "@/lib/use-focus-trap";

interface ProjectModalProps {
  readonly project: Project | null;
  readonly onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const reduceMotion = useReducedMotion();
  const dialogRef = useFocusTrap<HTMLDivElement>(project !== null, onClose);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[65] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="presentation"
          onClick={onClose}
        >
          <div aria-hidden="true" className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-white/10 bg-ink-800 p-6 outline-none sm:rounded-2xl sm:p-8"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 24 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
                  {project.category}
                </p>
                <h3 id="project-modal-title" className="mt-1 font-display text-2xl font-bold text-paper">
                  {project.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close project details"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/10 text-paper-dim hover:border-primary/50 hover:text-primary"
              >
                <X size={17} />
              </button>
            </div>

            <p className="mt-4 leading-relaxed text-paper-dim">{project.description}</p>

            <div className="mt-6 space-y-4">
              <div className="rounded-lg border border-white/10 p-4">
                <h4 className="text-sm font-semibold text-paper">The problem</h4>
                <p className="mt-1 text-sm leading-relaxed text-paper-dim">{project.problem}</p>
              </div>
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <h4 className="text-sm font-semibold text-paper">The approach</h4>
                <p className="mt-1 text-sm leading-relaxed text-paper-dim">{project.solution}</p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-paper">Technologies</h4>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {project.technologies.map((t) => (
                  <li key={t} className="rounded bg-white/5 px-2.5 py-1 font-mono text-xs text-paper-dim">
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.github ? (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-ink-950 transition-opacity hover:opacity-90"
                >
                  <FolderGit2 size={16} /> View code
                </a>
              ) : (
                <span className="inline-flex items-center rounded-md border border-white/10 px-4 py-2 text-sm text-paper-dim/60">
                  Code coming soon
                </span>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-primary/40 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10"
                >
                  <ExternalLink size={16} /> Live demo
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
