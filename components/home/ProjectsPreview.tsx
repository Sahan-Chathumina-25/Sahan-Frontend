"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectModal } from "@/components/projects/ProjectModal";
import type { Project } from "@/data/projects";

/** Client wrapper so the home page stays a server component while cards open a modal. */
export function ProjectsPreview({ projects }: { readonly projects: readonly Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);
  return (
    <>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onSelect={setSelected} />
        ))}
      </div>
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  );
}
