import { experience } from "@/content/experience";
import { recognition } from "@/content/recognition";
import { education } from "@/content/education";
import { skillGroups } from "@/content/skills";
import {
  ButtonLink,
  Container,
  Reveal,
  Section,
  SectionHeader,
} from "@/components/primitives";
import { CountUp } from "@/components/count-up";
import { profile } from "@/content/profile";

// Headline numbers pulled forward from the recognition/experience records
// below — the details stay in their rows, these are the scan-first stats.
const stats = [
  { value: "AIR 713", label: "TCS CodeVita 2024 — top 0.15% of 500,000+" },
  { value: "4.9%", label: "Amazon ML Summer School acceptance" },
  { value: "500+", label: "DSA problems solved — top 25%" },
  { value: "10,000+", label: "Daily API requests served at ClanFlare" },
];

/**
 * 05 — the "why credible" chapter: giant numerals, the role as a spec sheet,
 * recognition as an index with row-hover wipes, and the toolkit set as type
 * rather than a pill cloud.
 */
export function Credibility() {
  return (
    <Section id="experience" surface="paper" sheet>
      <Container>
        <SectionHeader
          index="05"
          eyebrow="Track record"
          meta="Numbers · roles · recognition"
          title={["Proof,", <em key="e">not promises.</em>]}
        />

        {/* Hairlines are the 1px gaps showing the grid's own fill. */}
        <div className="grid grid-cols-1 gap-px border-y border-line-strong bg-line-strong sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className="bg-bg py-8 sm:px-6 sm:py-10 lg:first:pl-0">
              <Reveal stagger={i}>
                <p className="display whitespace-nowrap text-[clamp(2.4rem,3.9vw,4.25rem)]">
                  <CountUp value={s.value} />
                </p>
                <p className="mt-3 max-w-[16rem] text-sm text-muted">{s.label}</p>
              </Reveal>
            </div>
          ))}
        </div>

        {/* The full record — the résumé, always the live Drive copy. */}
        <Reveal className="mt-10">
          <div
            data-surface="ink"
            className="flex flex-col gap-5 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
          >
            <p className="serif text-[clamp(1.5rem,2.6vw,2.25rem)] leading-tight">
              The whole record, on one page.{" "}
              <span className="italic text-signal">Always up to date.</span>
            </p>
            <ButtonLink href={profile.resumeUrl} external variant="accent" className="shrink-0">
              View my résumé
            </ButtonLink>
          </div>
        </Reveal>

        <Block label="Experience">
          {experience.map((item) => (
            <Reveal key={`${item.company}-${item.period}`}>
              <article className="grid gap-8 py-10 md:grid-cols-12">
                <div className="md:col-span-4">
                  <h3 className="caps text-[clamp(1.5rem,2.4vw,2.2rem)]">{item.role}</h3>
                  <p className="mt-2 text-lg">{item.company}</p>
                  <p className="data mt-4 text-muted">
                    {item.period} · {item.location}
                  </p>
                </div>
                <div className="md:col-span-8">
                  <p className="serif text-[clamp(1.5rem,2.6vw,2.4rem)] leading-[1.1] text-balance">
                    {item.summary}
                  </p>
                  <ul className="mt-8 grid gap-x-10 gap-y-4 sm:grid-cols-2">
                    {item.highlights.map((h, i) => (
                      <li key={i} className="flex gap-3 text-[0.95rem] leading-relaxed text-muted">
                        <span className="data pt-1 text-accent">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </Block>

        <Block label="Recognition & education">
          {[
            ...recognition.map((r) => ({
              meta: r.meta ?? "",
              title: r.title,
              detail: r.detail,
            })),
            {
              meta: education.period,
              title: education.degree,
              detail: `${education.school} · ${education.location}`,
            },
          ].map((row) => (
            <Reveal key={row.title} className="row-wipe group border-b border-line">
              <div className="grid gap-2 py-6 transition-colors duration-500 md:grid-cols-12 md:gap-6 hover-device:group-hover:text-bg">
                <div className="data pt-1.5 text-muted transition-colors duration-500 md:col-span-3 hover-device:group-hover:text-bg/60">
                  {row.meta}
                </div>
                <h3 className="caps text-[1.2rem] md:col-span-4 md:text-[1.35rem]">
                  {row.title}
                </h3>
                <p className="text-muted transition-colors duration-500 text-pretty md:col-span-5 hover-device:group-hover:text-bg/75">
                  {row.detail}
                </p>
              </div>
            </Reveal>
          ))}
        </Block>

        <Block label="Toolkit">
          <dl>
            {skillGroups.map((group) => (
              <Reveal
                key={group.label}
                className="grid gap-3 border-b border-line py-6 md:grid-cols-12 md:gap-6"
              >
                <dt className="data pt-1.5 text-muted md:col-span-3">{group.label}</dt>
                <dd className="text-[clamp(1.05rem,1.6vw,1.35rem)] leading-snug md:col-span-9">
                  {/* Real spaces around each slash — they're the line-break
                      opportunities on narrow screens. */}
                  {group.items.map((item, i) => (
                    <span key={item}>
                      {i > 0 && <span className="text-accent"> / </span>}
                      <span className="whitespace-nowrap">{item}</span>
                    </span>
                  ))}
                </dd>
              </Reveal>
            ))}
          </dl>
        </Block>
      </Container>
    </Section>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-20 sm:mt-28">
      <div className="label relative flex items-center justify-between pb-4">
        <span>{label}</span>
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-line-strong" />
      </div>
      {children}
    </div>
  );
}
