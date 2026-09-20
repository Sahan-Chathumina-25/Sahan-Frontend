import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { ArticleCard, SampleBadge } from "@/components/articles/ArticleCard";
import { articles, getArticleBySlug, getRelatedArticles } from "@/data/articles";
import { formatDateISO } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export function generateStaticParams(): Array<{ slug: string }> {
  return articles.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { readonly params: { slug: string } }): Metadata {
  const article = getArticleBySlug(params.slug);
  if (!article) return { title: "Article not found" };
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      url: `${siteConfig.url}/articles/${article.slug}`,
    },
  };
}

export default function ArticlePage({ params }: { readonly params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();
  const related = getRelatedArticles(article.slug);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    author: { "@type": "Person", name: siteConfig.fullName },
  };

  return (
    <article className="mx-auto max-w-3xl px-4 pb-20 pt-14 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <Reveal>
        <Link href="/articles" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
          <ArrowLeft size={15} /> All articles
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            {article.category}
          </span>
          {article.sample && <SampleBadge />}
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-paper sm:text-4xl">
          {article.title}
        </h1>
        <p className="mt-4 leading-relaxed text-paper-dim">{article.excerpt}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-paper-dim/80">
          <time dateTime={article.date}>{formatDateISO(article.date)}</time>
          <span className="inline-flex items-center gap-1">
            <Clock size={12} /> {article.readingTime}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Tag size={12} />
            {article.tags.join(" · ")}
          </span>
        </div>
      </Reveal>

      {/* Table of contents */}
      <Reveal delay={0.05}>
        <nav aria-label="Table of contents" className="mt-8 rounded-xl border border-white/10 bg-ink-800/60 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-paper">On this page</h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm">
            {article.content.map((section, i) => (
              <li key={section.heading}>
                <a href={`#section-${i + 1}`} className="text-paper-dim hover:text-primary hover:underline">
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </Reveal>

      {/* Body */}
      <div className="mt-8 space-y-10">
        {article.content.map((section, i) => (
          <Reveal key={section.heading}>
            <section aria-labelledby={`section-${i + 1}-heading`}>
              <h2 id={`section-${i + 1}-heading`} className="font-display text-2xl font-semibold text-paper">
                <span id={`section-${i + 1}`} className="scroll-mt-24" aria-hidden="true" />
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph, j) => (
                <p key={j} className="mt-3 leading-relaxed text-paper-dim">
                  {paragraph}
                </p>
              ))}
            </section>
          </Reveal>
        ))}
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-14">
          <h2 id="related-heading" className="font-display text-xl font-semibold text-paper">
            Related reading
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {related.map((item) => (
              <ArticleCard key={item.slug} article={item} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
