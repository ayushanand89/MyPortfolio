import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/marquee";
import { Statement } from "@/components/sections/statement";
import { Services } from "@/components/sections/services";
import { SelectedWork } from "@/components/sections/selected-work";
import { Process } from "@/components/sections/process";
import { Skills } from "@/components/sections/skills";
import { Experience } from "@/components/sections/experience";
import { Recognition } from "@/components/sections/recognition";
import { Testimonials } from "@/components/sections/testimonials";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <Statement />
      <Services />
      <SelectedWork />
      <Process />
      <Skills />
      <Experience />
      <Recognition />
      <Testimonials />
      <Contact />
    </main>
  );
}
