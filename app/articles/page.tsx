"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { Reveal } from "@/components/animations/Reveal";
import { articleCategories, articles } from "@/data/articles";
import { cn } from "@/lib/utils";

export default function ArticlesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      const matchesCategory = category === "All" || a.category === category;
      const matchesQuery =
        q.length === 0 ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  const featured = useMemo(() => articles.filter((a) => a.featured), []);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Articles</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl">
          Notes from the lab.
        </h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-paper-dim">
          Short write-ups on networking, security, and development. Seeded posts are labelled{" "}
          <span className="font-semibold text-secondary">SAMPLE</span> — illustrative examples
          until real articles are published.
        </p>
      </Reveal>

      {featured.length > 0 && (
        <section aria-labelledby="featured-articles-heading" className="mt-12">
          <h2 id="featured-articles-heading" className="font-display text-xl font-semibold text-paper">
            Featured
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {featured.map((article) => (
              <Reveal key={article.slug}>
                <ArticleCard article={article} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="browse-heading" className="mt-14">
        <h2 id="browse-heading" className="font-display text-xl font-semibold text-paper">
          Browse all
        </h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label htmlFor="article-search" className="sr-only">
            Search articles
          </label>
          <div className="relative sm:max-w-xs sm:flex-1">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-paper-dim/60" aria-hidden="true" />
            <input
              id="article-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, excerpt, or tag…"
              className="w-full rounded-md border border-white/10 bg-ink-950/70 py-2.5 pl-9 pr-3 text-sm text-paper placeholder:text-paper-dim/40 outline-none focus:border-primary/60"
            />
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter articles by category">
            {articleCategories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                  category === c
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-white/10 text-paper-dim hover:border-primary/40 hover:text-paper"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="mt-6 grid gap-4 md:grid-cols-2" aria-live="polite">
          <AnimatePresence mode="popLayout">
            {visible.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full rounded-xl border border-dashed border-white/15 p-10 text-center"
              >
                <p className="text-paper-dim">No articles match your search.</p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setCategory("All");
                  }}
                  className="mt-3 rounded-md border border-primary/40 px-4 py-2 text-sm text-primary hover:bg-primary/10"
                >
                  Clear search
                </button>
              </motion.div>
            ) : (
              visible.map((article) => (
                <motion.div
                  key={article.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArticleCard article={article} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  );
}
