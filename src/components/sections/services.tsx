import {
  Boxes,
  Gauge,
  Globe,
  LayoutDashboard,
  Rocket,
  ShoppingCart,
} from "lucide-react";
import { services } from "@/content/services";
import { Container, Reveal, SectionHeader } from "@/components/primitives";
import { ShowcaseCard } from "@/components/showcase-card";
import { cn } from "@/lib/utils";

const icons = {
  globe: Globe,
  rocket: Rocket,
  "shopping-cart": ShoppingCart,
  "layout-dashboard": LayoutDashboard,
  boxes: Boxes,
  gauge: Gauge,
} as const;

// Asymmetric bento rhythm on a 6-col grid — every row fills (4+2 / 2+4 / 3+3),
// breaking the generic "three equal cards" feature row.
const spans = [
  "lg:col-span-4",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-4",
  "lg:col-span-3",
  "lg:col-span-3",
];

export function Services() {
  return (
    <section id="services" className="border-t border-border py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeader title="What I can build for you." />
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {services.map((service, i) => {
            const Icon = icons[service.icon];
            return (
              <Reveal
                key={service.title}
                className={cn("h-full", spans[i % spans.length])}
              >
                <ShowcaseCard className="group h-full p-7">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {service.description}
                  </p>
                </ShowcaseCard>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
