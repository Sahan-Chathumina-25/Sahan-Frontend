import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { Article } from "@/data/articles";
import { formatDateISO } from "@/lib/utils";

export function SampleBadge() {
  return (
    <span
      title="Illustrative example post, not published work"
      className="rounded border border-secondary/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-secondary"
    >
      Sample
    </span>
  );
}

export function ArticleCard({ article }: { readonly article: Article }) {
  return (
    <article className="group flex h-full flex-col rounded-xl border border-white/10 bg-ink-800/60 p-6 backdrop-blur transition-colors hover:border-primary/40">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
          {article.category}
        </span>
        {article.sample && <SampleBadge />}
      </div>
      <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-paper transition-colors group-hover:text-primary">
        <Link href={`/articles/${article.slug}`}>{article.title}</Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-paper-dim">{article.excerpt}</p>
      <div className="mt-4 flex items-center justify-between text-xs text-paper-dim/80">
        <span className="flex items-center gap-3">
          <time dateTime={article.date}>{formatDateISO(article.date)}</time>
          <span className="inline-flex items-center gap-1">
            <Clock size={12} /> {article.readingTime}
          </span>
        </span>
        <Link
          href={`/articles/${article.slug}`}
          aria-label={`Read: ${article.title}`}
          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
        >
          Read <ArrowRight size={13} />
        </Link>
      </div>
    </article>
  );
}
