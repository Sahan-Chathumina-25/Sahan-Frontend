import type { SkillCategory } from "@/data/education";

const accents = ["text-primary", "text-primary-soft", "text-secondary", "text-primary", "text-secondary"];

export function SkillCard({ category, accentIndex }: { readonly category: SkillCategory; readonly accentIndex: number }) {
  const accent = accents[accentIndex % accents.length] ?? "text-primary";
  return (
    <div className="flex h-full flex-col rounded-xl border border-white/10 bg-ink-800/60 p-5 backdrop-blur transition-colors hover:border-primary/30">
      <h3 className={`font-display text-base font-semibold ${accent}`}>{category.title}</h3>
      <ul className="mt-3 space-y-1.5">
        {category.skills.map((skill) => (
          <li key={skill} className="flex items-start gap-2 text-sm text-paper-dim">
            <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current opacity-70" />
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
}
