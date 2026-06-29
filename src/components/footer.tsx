import Link from "next/link";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/content/profile";
import { Container } from "./primitives";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="border-t border-border py-16 sm:py-24">
      <Container>
        <span className="eyebrow">Contact</span>
        <h2 className="display mt-4 max-w-3xl text-3xl text-balance sm:text-5xl">
          Open to new opportunities — let&apos;s talk.
        </h2>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a
            href={`mailto:${profile.email}`}
            className="link-underline inline-flex items-center gap-2 text-lg text-foreground"
          >
            <Mail className="h-4 w-4 text-accent" />
            {profile.email}
          </a>
          <a
            href={profile.phoneHref}
            className="link-underline text-lg text-muted hover:text-foreground"
          >
            {profile.phone}
          </a>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-6">
          <SocialLink href={profile.socials.github} label="GitHub">
            <Github className="h-4 w-4" />
            GitHub
          </SocialLink>
          <SocialLink href={profile.socials.linkedin} label="LinkedIn">
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </SocialLink>
          <SocialLink href={profile.resumeUrl} label="Résumé">
            Résumé
            <ArrowUpRight className="h-4 w-4" />
          </SocialLink>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-sm text-faint sm:flex-row sm:items-center">
          <p>
            © {year} {profile.name}. Built with Next.js & Tailwind.
          </p>
          <Link href="#top" className="link-underline hover:text-foreground">
            Back to top ↑
          </Link>
        </div>
      </Container>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="link-underline inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
    >
      {children}
    </a>
  );
}
