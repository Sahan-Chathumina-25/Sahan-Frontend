import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading, Card } from "@/components/ui/SectionHeading";
import { Timeline } from "@/components/about/Timeline";
import { SkillCard } from "@/components/about/SkillCard";
import { JourneyTopology } from "@/components/about/JourneyTopology";
import { education, skillCategories } from "@/data/education";

export const metadata: Metadata = {
  title: "About",
  description: "Background, education, technical focus, and creative work of Sahan Chathumina.",
  alternates: { canonical: "/about" },
};

const journey = [
  { title: "Foundations", text: "Studying network engineering and security full-time — every concept gets a lab, every lab gets notes." },
  { title: "Building in public", text: "This portfolio is the hub: labs, scripts, and write-ups collected in one honest place." },
  { title: "Next steps", text: "Deeper security study, larger home-lab builds, and contributing to open, collaborative projects." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">About</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl">
          Network engineer in training, security-minded builder.
        </h1>
      </Reveal>

      {/* 01 PROFILE */}
      <section aria-labelledby="profile-heading" className="mt-14">
        <SectionHeading
          index="01"
          eyebrow="Profile"
          title="Who I am"
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <Reveal>
            <div className="overflow-hidden rounded-xl border border-white/10">
              <Image
                src="/images/portrait.svg"
                alt="Abstract geometric portrait placeholder for Sahan Chathumina"
                width={560}
                height={560}
                className="h-auto w-full"
                priority={false}
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-4 leading-relaxed text-paper-dim">
              <h3 id="profile-heading" className="sr-only">Profile</h3>
              <p>
                I&apos;m Sahan Chathumina, a technology-focused student from Sri Lanka. My core
                work is network engineering — addressing, routing, switching, and segmentation —
                with a growing practice in cybersecurity and software development.
              </p>
              <p>
                I learn by building: home labs for networking concepts, small scripts for
                repetitive tasks, and web apps like this portfolio to tie it together. When
                something finally clicks, I write it up so the next person (often future-me)
                has an easier path.
              </p>
              <p>
                Outside the terminal I care about design and explanation — clear diagrams,
                readable docs, and interfaces that respect the person using them.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 02 EDUCATION */}
      <section aria-labelledby="education-heading" className="mt-16">
        <SectionHeading
          index="02"
          eyebrow="Education"
          title="Learning path"
          description="Verified qualifications and programmes only — no dates shown, nothing invented."
        />
        <h3 id="education-heading" className="sr-only">Education</h3>
        <div className="mt-8">
          <Timeline items={education} />
        </div>
      </section>

      {/* 03 TECHNICAL FOCUS */}
      <section aria-labelledby="focus-heading" className="mt-16">
        <SectionHeading
          index="03"
          eyebrow="Technical focus"
          title="What I practise"
          description="The areas I spend my lab hours on — honest scope, no proficiency theatre."
        />
        <h3 id="focus-heading" className="sr-only">Technical focus</h3>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, i) => (
            <Reveal key={category.title} delay={(i % 3) * 0.07}>
              <SkillCard category={category} accentIndex={i} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* 04 CREATIVE SIDE */}
      <section aria-labelledby="creative-heading" className="mt-16">
        <SectionHeading
          index="04"
          eyebrow="Creative side"
          title="Design & explanation"
          description="UI/UX study, technical illustration, and visual explainers — the other half of the work."
        />
        <h3 id="creative-heading" className="sr-only">Creative side</h3>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { title: "Interface design", text: "Layout, hierarchy, and usability fundamentals from UI/UX study — applied on this site." },
            { title: "Visual explainers", text: "Diagrams that make subnetting and segmentation click, like the poster series in projects." },
            { title: "Technical writing", text: "Lab notes and articles written to be re-run, not just re-read." },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.07}>
              <Card className="h-full">
                <h4 className="font-display text-base font-semibold text-paper">{item.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-paper-dim">{item.text}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 05 CURRENT JOURNEY */}
      <section aria-labelledby="journey-heading" className="mt-16">
        <SectionHeading
          index="05"
          eyebrow="Current journey"
          title="Where I'm headed"
        />
        <h3 id="journey-heading" className="sr-only">Current journey</h3>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {journey.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.07}>
              <Card className="h-full">
                <p className="font-mono text-xs text-primary">0{i + 1}</p>
                <h4 className="mt-2 font-display text-base font-semibold text-paper">{step.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-paper-dim">{step.text}</p>
              </Card>
            </Reveal>
          ))}
        </div>
        <div className="mt-10">
          <Reveal>
            <h4 className="mb-4 font-display text-xl font-semibold text-paper">
              How I think — follow a packet
            </h4>
          </Reveal>
          <Reveal delay={0.1}>
            <JourneyTopology />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
