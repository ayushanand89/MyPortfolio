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

const icons = {
  globe: Globe,
  rocket: Rocket,
  "shopping-cart": ShoppingCart,
  "layout-dashboard": LayoutDashboard,
  boxes: Boxes,
  gauge: Gauge,
} as const;

export function Services() {
  return (
    <section id="services" className="border-t border-border py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeader
            index="01"
            eyebrow="Services"
            title="What I can build for you."
          />
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = icons[service.icon];
            return (
              <Reveal key={service.title} className="h-full">
                <div className="group h-full rounded-xl border border-border p-7 transition-all duration-300 hover:border-border-strong hover:bg-card">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border text-accent transition-colors duration-300 group-hover:border-accent/40">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {service.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
