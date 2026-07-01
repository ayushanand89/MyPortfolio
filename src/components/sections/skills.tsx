import { skillGroups } from "@/content/skills";
import { Container, Reveal, SectionHeader } from "@/components/primitives";

export function Skills() {
  return (
    <section id="skills" className="border-t border-border py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeader title="The toolkit." />
        </Reveal>

        <dl className="border-t border-border">
          {skillGroups.map((group) => (
            <Reveal key={group.label}>
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
      </Container>
    </section>
  );
}
