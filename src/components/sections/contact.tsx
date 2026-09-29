"use client";

import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { profile } from "@/content/profile";
import {
  AvailabilityBadge,
  Container,
  Reveal,
  Roll,
  Section,
  SectionHeader,
} from "@/components/primitives";
import { Magnetic } from "@/components/magnetic";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * 06 - Contact, the signal-red finale. Underline fields, the real Resend-backed
 * form (503 without RESEND_API_KEY → mailto fallback), and direct lines.
 */
export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot - humans never see it
  const [status, setStatus] = useState<Status>("idle");

  const mailtoHref = () => {
    const subject = encodeURIComponent(
      `Project enquiry${name ? ` from ${name}` : ""}`,
    );
    const body = encodeURIComponent(
      `${message}\n\n${name}${email ? ` · ${email}` : ""}`,
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
    <Section id="contact" surface="signal" sheet className="pb-20 sm:pb-40">
      <Container>
        <SectionHeader
          index="06"
          eyebrow="Contact"
          meta="Replies within a day"
          titleClassName="text-[clamp(2.4rem,7vw,7rem)]"
          title={["Have a project", "in mind?", <em key="e">Let’s build it.</em>]}
        />

        <div className="grid gap-12 sm:gap-16 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-7">
            <p className="max-w-lg text-[1.05rem] leading-relaxed text-muted text-pretty sm:text-lg">
              Tell me what you&apos;re building and I&apos;ll get back to you
              within a day. Freelance projects and full-time roles both welcome.
            </p>
            <form onSubmit={onSubmit} className="mt-8 space-y-6 sm:mt-10 sm:space-y-8">
              <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
                <Field id="name" label="Name">
                  <input
                    id="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={fieldClass}
                    placeholder="Your name"
                  />
                </Field>
                <Field id="email" label="Email">
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={fieldClass}
                    placeholder="you@company.com"
                  />
                </Field>
              </div>
              <Field id="message" label="Project">
                <textarea
                  id="message"
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={cn(fieldClass, "resize-none")}
                  placeholder="What are you building, timeline, budget range…"
                />
              </Field>
              {/* Honeypot - visually hidden, skipped by keyboard focus. */}
              <div aria-hidden className="absolute left-[-9999px] h-0 overflow-hidden">
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

              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <Magnetic>
                  <SubmitButton status={status} />
                </Magnetic>
                <p aria-live="polite" className="min-h-5 text-sm">
                  {status === "sent" && (
                    <span>Thanks. I&apos;ll reply within a day.</span>
                  )}
                  {status === "error" && (
                    <span>
                      Couldn&apos;t send right now. Please{" "}
                      <a href={mailtoHref()} className="underline underline-offset-4">
                        email me directly
                      </a>
                      .
                    </span>
                  )}
                </p>
              </div>
            </form>
          </Reveal>

          <Reveal className="lg:col-span-4 lg:col-start-9">
            <p className="label">Or reach me directly</p>
            <div className="mt-5 border-t border-line-strong">
              <ContactRow
                href={`mailto:${profile.email}`}
                label="Email"
                value={profile.email}
                copyText={profile.email}
              />
              <ContactRow
                href={profile.socials.linkedin}
                label="LinkedIn"
                value="in/ayush-anand"
                external
              />
              <ContactRow
                href={profile.socials.github}
                label="GitHub"
                value="@ayushanand89"
                external
              />
              <ContactRow
                href={profile.resumeUrl}
                label="Résumé"
                value="View PDF"
                external
              />
            </div>
            {profile.available && (
              <AvailabilityBadge className="mt-8 border-paper/40 [&>span:first-child]:bg-paper">
                Available for freelance projects
              </AvailabilityBadge>
            )}
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

const morph = { type: "spring", stiffness: 380, damping: 32, mass: 0.8 } as const;

/**
 * The send button morphs with the request: the pill collapses into a spinning
 * ring while sending, then blooms back out into "Message sent" with a drawn
 * check (a framer layout animation - the label counter-scales so it never
 * squashes mid-morph).
 */
function SubmitButton({ status }: { status: Status }) {
  const sending = status === "sending";
  const sent = status === "sent";
  return (
    <m.button
      layout
      type="submit"
      disabled={sending || sent}
      transition={morph}
      style={{ borderRadius: 999, transition: "color 0.45s, border-color 0.45s" }}
      className={cn(
        "btn btn-solid group/roll h-[3.1rem]",
        sending && "w-[3.1rem] cursor-wait justify-center p-0!",
        sent && "cursor-default",
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {sending ? (
          <m.span
            key="sending"
            layout="position"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="grid place-items-center"
          >
            <span className="sr-only">Sending</span>
            <span
              aria-hidden
              className="block h-5 w-5 animate-spin rounded-full border-2 border-current border-r-transparent"
            />
          </m.span>
        ) : sent ? (
          <m.span
            key="sent"
            layout="position"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 whitespace-nowrap"
          >
            Message sent
            <svg viewBox="0 0 16 16" aria-hidden className="h-3.5 w-3.5">
              <m.path
                d="M2.5 8.5l3.5 3.5 7.5-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.25, duration: 0.45, ease: "easeOut" }}
              />
            </svg>
          </m.span>
        ) : (
          <m.span
            key="idle"
            layout="position"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 whitespace-nowrap"
          >
            <Roll>Send message</Roll>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </m.span>
        )}
      </AnimatePresence>
    </m.button>
  );
}

const fieldClass =
  "mt-2 block w-full border-0 border-b border-line-strong bg-transparent px-0 py-3 text-lg text-fg outline-none transition-[border-color] duration-300 placeholder:text-faint hover:border-fg/70 focus:border-fg";

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children}
    </div>
  );
}

function ContactRow({
  href,
  label,
  value,
  external,
  copyText,
}: {
  href: string;
  label: string;
  value: string;
  external?: boolean;
  /** When set, renders a copy-to-clipboard button beside the row. */
  copyText?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!copyText) return;
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable - the mailto link still works.
    }
  };

  return (
    <div className="row-wipe group flex items-center gap-3 border-b border-line-strong">
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="flex min-w-0 flex-1 items-baseline justify-between gap-4 py-4 transition-colors duration-500 hover-device:group-hover:text-bg"
      >
        <span className="label">{label}</span>
        <span className="flex min-w-0 items-center gap-2 truncate">
          <span className="truncate">{value}</span>
          {!copyText && (
            <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform duration-300 ease-out-strong hover-device:group-hover:-translate-y-0.5 hover-device:group-hover:translate-x-0.5" />
          )}
        </span>
      </a>
      {copyText && (
        <button
          type="button"
          aria-label={copied ? "Copied" : `Copy ${label.toLowerCase()}`}
          onClick={copy}
          className="mr-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line-strong transition-[color,border-color,transform] duration-300 active:scale-95 hover-device:group-hover:border-bg/40 hover-device:group-hover:text-bg"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      )}
    </div>
  );
}
