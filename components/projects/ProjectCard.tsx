"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Code2, FolderGit2 } from "lucide-react";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  readonly project: Project;
  readonly onSelect: (project: Project) => void;
}

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-ink-800/60 backdrop-blur transition-colors hover:border-primary/40"
    >
      <div aria-hidden="true" className="h-28 bg-gradient-to-br from-primary/25 via-ink-700 to-secondary/25" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full border border-primary/30 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-primary">
            {project.category}
          </span>
          {project.featured && (
            <span className="text-[11px] font-medium uppercase tracking-wider text-secondary">
              Featured
            </span>
          )}
        </div>
        <h3 className="mt-3 font-display text-lg font-semibold text-paper">{project.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-paper-dim">
          {project.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map((t) => (
            <span key={t} className="rounded bg-white/5 px-2 py-0.5 font-mono text-[11px] text-paper-dim">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => onSelect(project)}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          >
            Details <ArrowUpRight size={15} />
          </button>
          {project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} source code on GitHub`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-paper-dim transition-colors hover:border-primary/50 hover:text-primary"
            >
              <FolderGit2 size={16} />
            </a>
          ) : (
            <span
              className="inline-flex items-center gap-1.5 rounded-md border border-white/5 px-3 py-2 text-xs text-paper-dim/50"
              title="Repository coming soon"
            >
              <Code2 size={14} /> Code coming soon
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function ProjectGridEmpty({ onReset }: { readonly onReset: () => void }) {
  return (
    <div className={cn("col-span-full rounded-xl border border-dashed border-white/15 p-10 text-center")}>
      <p className="text-paper-dim">No projects in this category yet.</p>
      <button
        type="button"
        onClick={onReset}
        className="mt-3 rounded-md border border-primary/40 px-4 py-2 text-sm text-primary hover:bg-primary/10"
      >
        Show all projects
      </button>
    </div>
  );
}
