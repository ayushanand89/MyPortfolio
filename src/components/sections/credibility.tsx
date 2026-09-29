"use client";

import { useState, type ReactNode } from "react";
import { m } from "framer-motion";
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
import { Odometer } from "@/components/odometer";
import { profile } from "@/content/profile";
import { cn } from "@/lib/utils";

// Headline numbers pulled forward from the recognition/experience records
// below — the details stay in their rows, these are the scan-first stats.
const stats = [
  { value: "AIR 713", label: "TCS CodeVita 2024 — top 0.15% of 500,000+" },
  { value: "4.9%", label: "Amazon ML Summer School acceptance" },
  { value: "500+", label: "DSA problems solved — top 25%" },
  { value: "10,000+", label: "Daily API requests served at ClanFlare" },
];

const tabs = [
  { id: "experience", label: "Experience" },
  { id: "recognition", label: "Recognition" },
  { id: "toolkit", label: "Toolkit" },
] as const;
type Tab = (typeof tabs)[number]["id"];

/**
 * 05 — the "why credible" chapter: giant numerals on odometer reels, the role
 * as a spec sheet, recognition as an index with row-hover wipes, and the
 * toolkit set as type rather than a pill cloud. On phones the three records
 * sit behind tabs (one shared-layout indicator) instead of stacking up.
 */
export function Credibility() {
  const [tab, setTab] = useState<Tab>("experience");
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
        <div className="grid grid-cols-2 gap-px border-y border-line-strong bg-line-strong lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="bg-bg py-6 pr-3 odd:pr-4 even:pl-4 sm:px-6 sm:py-10 sm:odd:pr-6 sm:even:pl-6 lg:first:pl-0"
            >
              <Reveal stagger={i}>
                <p className="display whitespace-nowrap text-[clamp(1.45rem,7.2vw,2.4rem)] sm:text-[clamp(2.4rem,3.9vw,4.25rem)]">
                  <Odometer value={s.value} />
                </p>
                <p className="mt-2.5 max-w-[16rem] text-[0.8rem] leading-snug text-muted sm:mt-3 sm:text-sm">
                  {s.label}
                </p>
              </Reveal>
            </div>
          ))}
        </div>

        {/* The full record — the résumé, always the live Drive copy. */}
        <Reveal className="mt-8 sm:mt-10">
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

        {/* Phones: one record at a time. */}
        <div
          role="tablist"
          aria-label="Track record"
          className="mt-12 grid grid-cols-3 rounded-full border border-line-strong p-1 md:hidden"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
              onClick={() => setTab(t.id)}
              className={cn(
                "label relative rounded-full px-1 py-3 text-[0.66rem] tracking-[0.04em] transition-colors duration-500 min-[400px]:text-[0.72rem]",
                tab === t.id ? "text-bg" : "text-muted",
              )}
            >
              {tab === t.id && (
                <m.span
                  layoutId="record-tab"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  className="absolute inset-0 rounded-full bg-fg"
                />
              )}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </div>

        <Block id="experience" label="Experience" tab={tab}>
          {experience.map((item) => (
            <Reveal key={`${item.company}-${item.period}`}>
              <article className="grid gap-6 py-8 md:grid-cols-12 md:gap-8 md:py-10">
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
                  <ul className="mt-6 grid gap-x-10 gap-y-3.5 sm:mt-8 sm:grid-cols-2 sm:gap-y-4">
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

        <Block id="recognition" label="Recognition & education" tab={tab}>
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

        <Block id="toolkit" label="Toolkit" tab={tab}>
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

function Block({
  id,
  label,
  tab,
  children,
}: {
  id: Tab;
  label: string;
  tab: Tab;
  children: ReactNode;
}) {
  const shown = tab === id;
  return (
    <div
      id={`panel-${id}`}
      role="tabpanel"
      aria-labelledby={`tab-${id}`}
      className={cn(
        "mt-4 md:mt-28",
        shown ? "max-md:animate-[fade-up_0.6s_var(--ease-out)_both]" : "max-md:hidden",
      )}
    >
      <div className="label relative hidden items-center justify-between pb-4 md:flex">
        <span>{label}</span>
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-line-strong" />
      </div>
      {children}
    </div>
  );
}
