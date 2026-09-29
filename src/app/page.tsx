import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { SelectedWork } from "@/components/sections/selected-work";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { Credibility } from "@/components/sections/credibility";
import { Testimonials } from "@/components/sections/testimonials";
import { Faq } from "@/components/sections/faq";
import { Contact } from "@/components/sections/contact";

/**
 * Narrative spine: work → engineering → identity → capability → method →
 * proof → trust → objections → conversion. The projects lead - the strongest evidence comes first. Each
 * chapter is a sheet (ink / paper / signal) that slides over the one before.
 *
 * The hero pins inside `#top`, so the Work sheet (with the red tape on its
 * seam) slides up over it. `#top` is the non-sticky wrapper so anchors and
 * scroll offsets measure correctly.
 */
export default function Home() {
  return (
    <main id="main">
      <div id="top" className="relative">
        <Hero />
        <SelectedWork />
      </div>
      <About />
      <Services />
      <Process />
      <Credibility />
      <Testimonials />
      <Faq />
      <Contact />
    </main>
  );
}
