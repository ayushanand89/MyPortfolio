import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/marquee";
import { SelectedWork } from "@/components/sections/selected-work";
import { Experience } from "@/components/sections/experience";
import { MoreWork } from "@/components/sections/more-work";
import { Skills } from "@/components/sections/skills";
import { Recognition } from "@/components/sections/recognition";

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <SelectedWork />
      <Experience />
      <MoreWork />
      <Skills />
      <Recognition />
    </main>
  );
}
