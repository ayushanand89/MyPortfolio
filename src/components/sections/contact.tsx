"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  Github,
  Linkedin,
  Loader2,
  Mail,
} from "lucide-react";
import { profile } from "@/content/profile";
import {
  AvailabilityBadge,
  Container,
  Reveal,
  Section,
  SectionHeader,
} from "@/components/primitives";
import { Magnetic, ParallaxWatermark, Spotlight } from "@/components/motion-fx";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot — humans never see it
  const [status, setStatus] = useState<Status>("idle");

  const mailtoHref = () => {
    const subject = encodeURIComponent(
      `Project enquiry${name ? ` from ${name}` : ""}`,
    );
    const body = encodeURIComponent(
      `${message}\n\n— ${name}${email ? ` · ${email}` : ""}`,
    );
    return `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending" || status === "sent") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, company }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <Section id="contact" variant="spacious">
      <ParallaxWatermark text="Say hello" align="left" />
      <Spotlight size={620} />
      <Container>
        <Reveal>
          <SectionHeader
            index="06"
            eyebrow="Contact"
            title="Have a project in mind? Let’s build it."
            className="mb-5 sm:mb-5"
          />
          <p className="mb-12 max-w-xl text-muted sm:mb-16">
            Tell me what you&apos;re building and I&apos;ll get back to you
            within a day. Freelance projects and full-time roles both welcome.
          </p>
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
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
              {/* Honeypot — visually hidden, skipped by keyboard focus. */}
              <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Magnetic strength={0.4}>
                  <button
                    type="submit"
                    disabled={status === "sending" || status === "sent"}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-[transform,opacity,background-color] duration-150 ease-out-strong",
                      status === "sent"
                        ? "cursor-default bg-accent text-accent-foreground"
                        : "bg-foreground text-background hover:opacity-90 active:scale-[0.98]",
                      status === "sending" && "cursor-wait opacity-80",
                    )}
                  >
                    {status === "sending" && (
                      <>
                        Sending
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </>
                    )}
                    {status === "sent" && (
                      <>
                        Message sent
                        <Check className="h-4 w-4" />
                      </>
                    )}
                    {(status === "idle" || status === "error") && (
                      <>
                        Send message
                        <ArrowUpRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </Magnetic>
                <p aria-live="polite" className="min-h-5 text-sm">
                  {status === "sent" && (
                    <span className="text-muted">
                      Thanks — I&apos;ll reply within a day.
                    </span>
                  )}
                  {status === "error" && (
                    <span className="text-muted">
                      Couldn&apos;t send right now —{" "}
                      <a
                        href={mailtoHref()}
                        className="link-underline text-foreground"
                      >
                        email me directly
                      </a>
                      .
                    </span>
                  )}
                </p>
              </div>
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
                  copyText={profile.email}
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
                <AvailabilityBadge className="mt-8">
                  Available for freelance projects
                </AvailabilityBadge>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

function ContactRow({
  href,
  label,
  value,
  icon,
  external,
  copyText,
}: {
  href: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  external?: boolean;
  /** When set, renders a copy-to-clipboard button beside the row. */
  copyText?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!copyText) return;
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable — the mailto link still works.
    }
  };

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
        {copyText ? (
          <button
            type="button"
            aria-label={copied ? "Copied" : `Copy ${label.toLowerCase()}`}
            onClick={copy}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-faint transition-[color,border-color,transform] duration-200 ease-out-strong hover:border-border-strong hover:text-foreground active:scale-95"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-accent" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        ) : (
          <ArrowUpRight className="h-4 w-4 text-faint transition-transform duration-200 ease-out-strong hover-device:group-hover:-translate-y-0.5 hover-device:group-hover:translate-x-0.5" />
        )}
      </span>
    </a>
  );
}
