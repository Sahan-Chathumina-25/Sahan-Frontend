import type { ReactNode } from "react";
import { Reveal } from "@/components/animations/Reveal";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  readonly index: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly description?: string;
  readonly className?: string;
}

export function SectionHeading({ index, eyebrow, title, description, className }: SectionHeadingProps) {
  return (
    <Reveal className={cn("max-w-2xl", className)}>
      <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
        <span className="text-paper-dim/60">{index}</span>
        <span aria-hidden="true" className="h-px w-8 bg-primary/50" />
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-paper sm:text-4xl">
        {title}
      </h2>
      {description ? <p className="mt-3 leading-relaxed text-paper-dim">{description}</p> : null}
    </Reveal>
  );
}

export function Card({ children, className }: { readonly children: ReactNode; readonly className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-ink-800/60 p-6 backdrop-blur transition-colors hover:border-primary/30",
        className
      )}
    >
      {children}
    </div>
  );
}
