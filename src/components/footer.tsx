import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/content/profile";
import { Container } from "./primitives";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-12">
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
            <a
              href={profile.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline mt-1 inline-block text-sm text-faint hover:text-foreground"
            >
              ayush.clanflare.dev
            </a>
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
    </footer>
  );
}
