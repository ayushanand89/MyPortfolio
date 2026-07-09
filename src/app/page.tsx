import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/marquee";
import { About } from "@/components/sections/about";
import { SelectedWork } from "@/components/sections/selected-work";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { Credibility } from "@/components/sections/credibility";
import { Testimonials } from "@/components/sections/testimonials";
import { Contact } from "@/components/sections/contact";

/**
 * Narrative spine: identity → evidence → capability → method → proof →
 * trust → conversion. Work sits above Services because shipped products are
 * a stronger opener than claims.
 */
export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <About />
      <SelectedWork />
      <Services />
      <Process />
      <Credibility />
      <Testimonials />
      <Contact />
    </main>
  );
}
