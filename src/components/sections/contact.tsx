"use client";

import { useState } from "react";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/content/profile";
import { Container, Reveal } from "@/components/primitives";
import { Magnetic, ParallaxWatermark, Spotlight } from "@/components/motion-fx";
import { Scramble } from "@/components/scramble";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Project enquiry${name ? ` from ${name}` : ""}`,
    );
    const body = encodeURIComponent(
      `${message}\n\n— ${name}${email ? ` · ${email}` : ""}`,
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section
      id="contact"
      className="relative isolate border-t border-border py-20 sm:py-28"
    >
      <ParallaxWatermark text="Say hello" align="left" />
      <Spotlight size={620} />
      <Container>
        <Reveal>
          <span className="eyebrow">
            <Scramble text="Contact" />
          </span>
          <h2 className="display mt-4 max-w-3xl text-3xl text-balance sm:text-5xl">
            Have a project in mind? Let&apos;s build it.
          </h2>
          <p className="mt-5 max-w-xl text-muted">
            Tell me what you&apos;re building and I&apos;ll get back to you
            within a day. Freelance projects and full-time roles both welcome.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <form
              onSubmit={onSubmit}
              className="mx-auto w-full max-w-md space-y-5 lg:mx-0 lg:max-w-none"
            >
              <div>
                <label htmlFor="name" className="eyebrow">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="field mt-2 w-full rounded-lg border border-border px-4 py-3 text-foreground outline-none placeholder:text-faint"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="eyebrow">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="field mt-2 w-full rounded-lg border border-border px-4 py-3 text-foreground outline-none placeholder:text-faint"
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="eyebrow">
                  Project
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="field mt-2 w-full resize-none rounded-lg border border-border px-4 py-3 text-foreground outline-none placeholder:text-faint"
                  placeholder="What are you building, timeline, budget range…"
                />
              </div>
              <Magnetic strength={0.4}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-[transform,opacity] duration-150 ease-out-strong hover:opacity-90 active:scale-[0.98]"
                >
                  Send message
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </Magnetic>
            </form>
          </Reveal>

          <Reveal>
            <div className="mx-auto flex w-full max-w-md flex-col lg:mx-0 lg:max-w-none">
              <p className="text-sm text-muted">
                Prefer something direct? Reach me here.
              </p>
              <div className="mt-6 divide-y divide-border border-y border-border">
                <ContactRow
                  href={`mailto:${profile.email}`}
                  label="Email"
                  value={profile.email}
                  icon={<Mail className="h-4 w-4 text-accent" />}
                />
                <ContactRow
                  href={profile.socials.linkedin}
                  label="LinkedIn"
                  value="in/ayush-anand"
                  icon={<Linkedin className="h-4 w-4 text-accent" />}
                  external
                />
                <ContactRow
                  href={profile.socials.github}
                  label="GitHub"
                  value="@ayushanand89"
                  icon={<Github className="h-4 w-4 text-accent" />}
                  external
                />
                <ContactRow
                  href={profile.portfolio}
                  label="Portfolio"
                  value="ayush.clanflare.dev"
                  icon={<ArrowUpRight className="h-4 w-4 text-accent" />}
                  external
                />
              </div>
              {profile.available && (
                <div className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-accent/40 px-4 py-2 text-sm text-foreground">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                  </span>
                  Available for freelance projects
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function ContactRow({
  href,
  label,
  value,
  icon,
  external,
}: {
  href: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="group flex items-center justify-between py-4 transition-colors hover:text-foreground"
    >
      <span className="flex items-center gap-3">
        {icon}
        <span className="eyebrow">{label}</span>
      </span>
      <span className="flex items-center gap-2 text-foreground/90">
        {value}
        <ArrowUpRight className="h-4 w-4 text-faint transition-transform duration-200 ease-out-strong hover-device:group-hover:-translate-y-0.5 hover-device:group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}
