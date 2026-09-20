"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProjectCard, ProjectGridEmpty } from "@/components/projects/ProjectCard";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { Reveal } from "@/components/animations/Reveal";
import { projectCategories, projects, type Project } from "@/data/projects";
import { fetchGithubRepos, githubProfileUrl, type GithubRepo } from "@/lib/github";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { FolderGit2 } from "lucide-react";

export default function ProjectsPage() {
  const [filter, setFilter] = useState<(typeof projectCategories)[number]>("All");
  const [selected, setSelected] = useState<Project | null>(null);
  const [repos, setRepos] = useState<readonly GithubRepo[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchGithubRepos(6).then((data) => {
      if (!cancelled) setRepos(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.category === filter)),
    [filter]
  );
  const featured = useMemo(() => projects.filter((p) => p.featured), []);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Projects</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl">
          Labs, builds & experiments.
        </h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-paper-dim">
          Networking labs, security practice, automation scripts, and web builds. Select any
          project for the problem, the approach, and the stack.
        </p>
      </Reveal>

      {/* Featured */}
      <section aria-labelledby="featured-heading" className="mt-12">
        <h2 id="featured-heading" className="font-display text-xl font-semibold text-paper">
          Featured
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {featured.map((project) => (
              <ProjectCard key={project.id} project={project} onSelect={setSelected} />
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Filter + grid */}
      <section aria-labelledby="all-heading" className="mt-14">
        <h2 id="all-heading" className="font-display text-xl font-semibold text-paper">
          All projects
        </h2>
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
          {projectCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              aria-pressed={filter === category}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                filter === category
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-white/10 text-paper-dim hover:border-primary/40 hover:text-paper"
              )}
            >
              {category}
            </button>
          ))}
        </div>
        <motion.div layout className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.length === 0 ? (
              <ProjectGridEmpty key="empty" onReset={() => setFilter("All")} />
            ) : (
              visible.map((project) => (
                <ProjectCard key={project.id} project={project} onSelect={setSelected} />
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* GitHub */}
      <section aria-labelledby="github-heading" className="mt-14">
        <Reveal>
          <div className="rounded-xl border border-white/10 bg-ink-800/60 p-6 backdrop-blur">
            <h2 id="github-heading" className="flex items-center gap-2 font-display text-lg font-semibold text-paper">
              <FolderGit2 size={18} className="text-primary" /> Open source
            </h2>
            {repos && repos.length > 0 ? (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {repos.map((repo) => (
                  <li key={repo.id} className="rounded-lg border border-white/10 p-4">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm font-semibold text-primary hover:underline"
                    >
                      {repo.name}
                    </a>
                    {repo.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-paper-dim">{repo.description}</p>
                    )}
                    <p className="mt-2 text-xs text-paper-dim/70">
                      {repo.language ?? "—"} · ★ {repo.stargazers_count}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-paper-dim">
                Public repositories live on GitHub — project repos are linked from each card as
                they&apos;re published.{" "}
                <a
                  href={githubProfileUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  Visit the profile
                </a>
                .
              </p>
            )}
          </div>
        </Reveal>
      </section>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
