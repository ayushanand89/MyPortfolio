import { ArrowUpRight } from "lucide-react";
import { experience } from "@/content/experience";
import { recognition } from "@/content/recognition";
import { education } from "@/content/education";
import { skillGroups } from "@/content/skills";
import {
  Container,
  Reveal,
  Section,
  SectionHeader,
} from "@/components/primitives";
import { StatsRow } from "@/components/case-study";

// Headline numbers pulled forward from the recognition/experience records
// below — the details stay in their rows, these are the scan-first stats.
const stats = [
  { value: "AIR 713", label: "TCS CodeVita 2024 — top 0.15% of 500,000+" },
  { value: "4.9%", label: "Amazon ML Summer School acceptance" },
  { value: "500+", label: "DSA problems solved — top 25%" },
  { value: "10,000+", label: "Daily API requests served at ClanFlare" },
];

/**
 * The merged "why credible" chapter — one dense, scannable section instead of
 * three same-shaped list sections (Skills / Experience / Recognition).
 */
export function Credibility() {
  return (
    <Section id="experience" variant="dense">
      <Container>
        <Reveal>
          <SectionHeader
            index="05"
            eyebrow="Track record"
            title="Proof, not promises."
          />
        </Reveal>

        <Reveal>
          <StatsRow items={stats} />
        </Reveal>

        {/* Experience */}
        <div className="mt-16 sm:mt-20">
          <Reveal>
            <span className="eyebrow">Experience</span>
          </Reveal>
          <div className="mt-4 border-t border-border">
            {experience.map((item) => (
              <Reveal key={`${item.company}-${item.period}`}>
                <article className="grid gap-6 border-b border-border py-10 md:grid-cols-12">
                  <div className="md:col-span-4">
                    <h3 className="text-xl font-semibold">{item.role}</h3>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-muted">
                      {item.company}
                      <ArrowUpRight className="h-3.5 w-3.5 text-faint" />
                    </p>
                    <p className="mt-3 eyebrow">
                      {item.period} · {item.location}
                    </p>
                  </div>

                  <div className="md:col-span-8">
                    <p className="text-lg text-foreground/90 text-balance">
                      {item.summary}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {item.highlights.map((h, i) => (
                        <li key={i} className="flex gap-3 text-muted">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                          <span className="leading-relaxed">{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Recognition & education */}
        <div className="mt-16 sm:mt-20">
          <Reveal>
            <span className="eyebrow">Recognition &amp; education</span>
          </Reveal>
          <div className="mt-4 border-t border-border">
            {recognition.map((item, i) => (
              <Reveal key={item.title} variant="right" stagger={i}>
                <div className="grid gap-2 border-b border-border py-6 md:grid-cols-12 md:gap-6">
                  <div className="eyebrow pt-1 md:col-span-3">{item.meta}</div>
                  <div className="md:col-span-9">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-1 text-muted text-balance">
                      {item.detail}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal variant="right">
              <div className="grid gap-2 border-b border-border py-6 md:grid-cols-12 md:gap-6">
                <div className="eyebrow pt-1 md:col-span-3">
                  {education.period}
                </div>
                <div className="md:col-span-9">
                  <h3 className="text-lg font-semibold">{education.degree}</h3>
                  <p className="mt-1 text-muted">
                    {education.school} · {education.location}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Toolkit — a sub-block, not its own chapter */}
        <div className="mt-16 sm:mt-20">
          <Reveal>
            <span className="eyebrow">Toolkit</span>
          </Reveal>
          <dl className="mt-4 border-t border-border">
            {skillGroups.map((group) => (
              <Reveal key={group.label} variant="left">
                <div className="grid gap-3 border-b border-border py-6 md:grid-cols-12 md:gap-6">
                  <dt className="eyebrow pt-1 md:col-span-3">{group.label}</dt>
                  <dd className="flex flex-wrap gap-2 md:col-span-9">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-border px-3 py-1.5 text-sm text-foreground/90 transition-colors hover:border-border-strong"
                      >
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </Container>
    </Section>
  );
}
