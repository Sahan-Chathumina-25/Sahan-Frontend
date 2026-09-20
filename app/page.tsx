import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FolderGit2, Mail } from "lucide-react";
import { NetworkVisualization } from "@/components/hero/NetworkVisualization";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading, Card } from "@/components/ui/SectionHeading";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { SkillCard } from "@/components/about/SkillCard";
import { SocialLinks } from "@/components/layout/Footer";
import { LiveClock } from "@/components/layout/LiveClock";
import { getFeaturedProjects } from "@/data/projects";
import { getFeaturedArticles } from "@/data/articles";
import { skillCategories } from "@/data/education";
import { ProjectsPreview } from "@/components/home/ProjectsPreview";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Sahan Chathumina — technology-focused student working across network engineering, cybersecurity, and software development.",
  alternates: { canonical: "/" },
};

const quickStats = [
  { label: "Degree in progress", value: "BSc Ethical Hacking & Network Security" },
  { label: "Diploma", value: "HND Network Engineering" },
  { label: "Focus areas", value: "Networks · Security · Software" },
  { label: "Based in", value: "Sri Lanka · UTC+5:30" },
];

export default function HomePage() {
  const featuredProjects = getFeaturedProjects();
  const featuredArticles = getFeaturedArticles();

  return (
    <>
      {/* HERO */}
      <section aria-labelledby="hero-heading" className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Reveal>
              <p className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-ink-800/60 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
                Network Engineer · Cybersecurity · Software
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 id="hero-heading" className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight text-paper sm:text-5xl lg:text-6xl">
                Building secure systems. <span className="text-primary">Connecting ideas.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 max-w-xl leading-relaxed text-paper-dim">
                I&apos;m Sahan — a technology-focused student working across network engineering,
                cybersecurity, and software development, with a creative streak in design and
                technical illustration.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-ink-950 transition-opacity hover:opacity-90"
                >
                  <FolderGit2 size={16} /> View projects
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-md border border-primary/40 px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                >
                  <Mail size={16} /> Contact me <ArrowRight size={15} />
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <SocialLinks />
                <span className="hidden h-4 w-px bg-white/15 sm:block" aria-hidden="true" />
                <LiveClock className="font-mono text-xs text-paper-dim" />
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <NetworkVisualization />
          </Reveal>
        </div>
      </section>

      {/* QUICK STATS — honest only */}
      <section aria-label="At a glance" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickStats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.06}>
              <Card className="h-full">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-paper-dim/70">
                  {stat.label}
                </p>
                <p className="mt-2 font-display text-base font-semibold leading-snug text-paper">
                  {stat.value}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SKILLS PREVIEW */}
      <section aria-labelledby="skills-heading" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHeading
          index="01"
          eyebrow="What I work with"
          title="Skills preview"
          description="Areas I actively study and practise — see the about page for the full breakdown."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.slice(0, 3).map((category, i) => (
            <Reveal key={category.title} delay={i * 0.07}>
              <SkillCard category={category} accentIndex={i} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-6">
          <Link href="/about" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            Full background on the about page <ArrowRight size={15} />
          </Link>
        </Reveal>
      </section>

      {/* FEATURED PROJECTS */}
      <section aria-labelledby="featured-projects-heading" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHeading
          index="02"
          eyebrow="Selected work"
          title="Featured projects"
          description="A few labs and builds that best show how I think and work."
        />
        <ProjectsPreview projects={featuredProjects} />
      </section>

      {/* LATEST ARTICLES */}
      <section aria-labelledby="latest-articles-heading" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHeading
          index="03"
          eyebrow="Notes & write-ups"
          title="Latest articles"
          description="Short, practical write-ups from labs and study sessions."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {featuredArticles.map((article, i) => (
            <Reveal key={article.slug} delay={i * 0.07}>
              <ArticleCard article={article} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-6">
          <Link href="/articles" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            Browse all articles <ArrowRight size={15} />
          </Link>
        </Reveal>
      </section>

      {/* CONTACT CTA */}
      <section aria-labelledby="cta-heading" className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6">
        <Reveal>
          <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-ink-800 via-ink-800 to-primary/10 p-8 text-center sm:p-12">
            <h2 id="cta-heading" className="font-display text-2xl font-bold text-paper sm:text-3xl">
              Have a lab, idea, or opportunity to discuss?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-paper-dim">
              I&apos;m always interested in networking labs, security study, and collaborative builds.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-ink-950 transition-opacity hover:opacity-90"
            >
              Get in touch <ArrowRight size={15} />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
