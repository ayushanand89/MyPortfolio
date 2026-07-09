import Link from "next/link";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/content/profile";
import { Container, Reveal } from "./primitives";
import { Magnetic, ParallaxWatermark } from "./motion-fx";
import { LocalTime } from "./local-time";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden border-t border-border">
      {/* Finale — the closing CTA moment, with the name as the watermark. */}
      <div className="relative py-20 sm:py-28">
        <ParallaxWatermark text={profile.name} align="left" />
        <Container>
          <Reveal>
            <span className="eyebrow">Next step</span>
            <Magnetic strength={0.15}>
              <Link
                href="/#contact"
                className="group mt-6 flex w-fit items-center gap-4 sm:gap-8"
              >
                <span className="display display-hero text-[clamp(3rem,9vw,7rem)] transition-colors duration-300 group-hover:text-accent">
                  Let&rsquo;s build it
                </span>
                <ArrowRight className="h-9 w-9 shrink-0 transition-transform duration-300 ease-out-strong sm:h-14 sm:w-14 hover-device:group-hover:translate-x-3" />
              </Link>
            </Magnetic>
          </Reveal>
        </Container>
      </div>

      {/* Utility tier */}
      <div className="border-t border-border py-12">
        <Container>
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Link
                href="/"
                className="font-display text-lg font-semibold tracking-tight"
              >
                {profile.name}
                <span className="text-accent">.</span>
              </Link>
              <p className="mt-2 text-sm text-muted">
                Full-Stack Web Developer · Available for freelance projects
              </p>
              <p className="mt-1 text-sm text-faint">
                {profile.location} · <LocalTime />
              </p>
            </div>

            <div className="flex items-center gap-5">
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-muted transition-colors hover:text-foreground"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-muted transition-colors hover:text-foreground"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email"
                className="text-muted transition-colors hover:text-foreground"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-sm text-faint sm:flex-row sm:items-center">
            <p>
              © {year} {profile.name}. Built with Next.js &amp; Tailwind.
            </p>
            <Link href="#top" className="link-underline hover:text-foreground">
              Back to top ↑
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
