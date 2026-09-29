"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { profile } from "@/content/profile";
import {
  BRIEF_EVENT,
  BRIEF_TIMELINES,
  BRIEF_TYPES,
  PROMISES,
  isBriefType,
  type BriefType,
} from "@/content/brief";
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
type Mode = "project" | "hiring";
type FieldKey = "name" | "email" | "message";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const spring = { type: "spring", stiffness: 420, damping: 36, mass: 0.8 } as const;

const DOORS: { id: Mode; label: string; short: string }[] = [
  { id: "project", label: "Start a project", short: "New project" },
  { id: "hiring", label: "Hiring for a role", short: "Hiring" },
];

/**
 * 07 - Contact, the signal-red finale, with two doors: clients start a
 * project, recruiters reach out about a role. The project door is a brief,
 * not a blank box: tap what you're building and when, and a live summary
 * reads it back. Service rows and case studies open it pre-filled (via
 * `?brief=` on arrival, or the `brief:open` event on this page). Posts to the
 * Resend-backed route (503 without RESEND_API_KEY → mailto fallback).
 */
export function Contact() {
  const [mode, setMode] = useState<Mode>("project");
  const [type, setType] = useState<BriefType | null>(null);
  const [timeline, setTimeline] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [org, setOrg] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState(""); // honeypot - humans never see it
  const [status, setStatus] = useState<Status>("idle");
  // Inline validation (the browser's own bubbles are switched off): errors
  // show after the first send attempt, then update live as you type.
  const [attempted, setAttempted] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  // Pre-fill from a CTA: `?brief=` when arriving from another page, or the
  // event when the CTA is on this page. `hiring` opens the recruiter door.
  useEffect(() => {
    const apply = (v: string | null) => {
      if (v === "hiring") setMode("hiring");
      else if (v === "project") setMode("project");
      else if (isBriefType(v)) {
        setMode("project");
        setType(v);
      } else return;
      setStatus("idle");
    };
    apply(new URLSearchParams(window.location.search).get("brief"));
    const onBrief = (e: Event) => apply((e as CustomEvent<string>).detail);
    window.addEventListener(BRIEF_EVENT, onBrief);
    return () => window.removeEventListener(BRIEF_EVENT, onBrief);
  }, []);

  const typeLabel = BRIEF_TYPES.find((t) => t.id === type)?.label;
  const summary = [typeLabel, timeline].filter(Boolean).join(" · ");

  const mailtoHref = () => {
    const subject =
      mode === "hiring"
        ? `Role: ${role || "full-time"}${org ? ` at ${org}` : ""}`
        : `New project${typeLabel ? `: ${typeLabel}` : ""}`;
    const lines =
      mode === "hiring"
        ? [org && `Company: ${org}`, role && `Role: ${role}`]
        : [typeLabel && `Building: ${typeLabel}`, timeline && `Timeline: ${timeline}`];
    const body = [...lines.filter(Boolean), "", message, "", `${name}${email ? ` · ${email}` : ""}`]
      .join("\n")
      .trim();
    return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const validate = () => {
    const found: Partial<Record<FieldKey, string>> = {};
    if (!name.trim()) found.name = "Add your name, please.";
    const mail = email.trim();
    if (!mail)
      found.email =
        mode === "hiring" ? "Add your work email so I can reply." : "Add your email so I can reply.";
    else if (!EMAIL_RE.test(mail)) found.email = "That email doesn’t look quite right.";
    if (mode === "project" && !type && !timeline && !message.trim())
      found.message = "Pick what you’re building above, or add a line here.";
    if (mode === "hiring" && !org.trim() && !role.trim() && !message.trim())
      found.message = "Add the company, the role or a short note.";
    return found;
  };
  const errors: Partial<Record<FieldKey, string>> = attempted ? validate() : {};
  const invalid = (k: FieldKey) =>
    errors[k] ? { "aria-invalid": true, "aria-describedby": `${k}-error` } : {};

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending" || status === "sent") return;
    const found = validate();
    const first = (["name", "email", "message"] as const).find((k) => found[k]);
    if (first) {
      setAttempted(true);
      document.getElementById(first)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: mode,
          type: mode === "project" ? typeLabel : undefined,
          timeline: mode === "project" ? timeline : undefined,
          org: mode === "hiring" ? org : undefined,
          role: mode === "hiring" ? role : undefined,
          name,
          email,
          message,
          company,
        }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setAttempted(false);
    setStatus("idle");
    setMessage("");
    window.setTimeout(() => nameRef.current?.focus(), 50);
  };

  return (
    <Section id="contact" surface="signal" sheet className="pb-20 sm:pb-40">
      <Container>
        <SectionHeader
          index="07"
          eyebrow="Contact"
          meta="Replies within 24 hours"
          titleClassName="text-[clamp(2.4rem,7vw,7rem)]"
          title={["Let’s work", <em key="e">together.</em>]}
        />

        <div className="grid gap-12 sm:gap-16 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-7">
            {/* The form sits on a paper card: everything read or typed is ink
                on cream (the red frames it, it doesn't sit behind the text). */}
            <div
              data-surface="paper"
              className="rounded-[26px] p-5 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.55)] sm:p-8 lg:p-10"
            >
              {/* Two doors: one segmented control, a shared-layout pill. */}
              <div
                role="radiogroup"
                aria-label="What brings you here?"
                className="grid w-full max-w-md grid-cols-2 rounded-full border border-line-strong p-1"
              >
                {DOORS.map((door) => {
                  const on = mode === door.id;
                  return (
                    <button
                      key={door.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => {
                        setMode(door.id);
                        setAttempted(false);
                        if (status !== "sending") setStatus("idle");
                      }}
                      className={cn(
                        "label relative rounded-full px-2 py-3 transition-colors duration-500",
                        on ? "text-paper" : "text-fg",
                      )}
                    >
                      {on && (
                        <m.span
                          layoutId="contact-door"
                          transition={spring}
                          className="absolute inset-0 rounded-full bg-ink"
                        />
                      )}
                      <span className="relative whitespace-nowrap">
                        <span className="sm:hidden">{door.short}</span>
                        <span className="hidden sm:inline">{door.label}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-muted text-pretty">
                {mode === "project"
                  ? "Tap what you’re building and roughly when. It takes about 20 seconds, and you’ll hear back within 24 hours."
                  : "Hiring for a full-time engineering role? Send the details, or grab my résumé. You’ll hear back within 24 hours."}
              </p>

              <AnimatePresence mode="wait" initial={false}>
                {status === "sent" ? (
                  <NextSteps key="sent" mode={mode} onReset={reset} />
                ) : (
                  <m.form
                    key={`form-${mode}`}
                    onSubmit={onSubmit}
                    noValidate
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-8 space-y-7 sm:mt-10 sm:space-y-8"
                  >
                    {mode === "project" ? (
                      <>
                        <ChipGroup
                          id="type"
                          label="What are you building?"
                          options={BRIEF_TYPES.map((t) => ({ value: t.id, label: t.label }))}
                          value={type}
                          onChange={(v) => setType(v as BriefType | null)}
                        />
                        <ChipGroup
                          id="timeline"
                          label="When do you need it?"
                          options={BRIEF_TIMELINES.map((t) => ({ value: t, label: t }))}
                          value={timeline}
                          onChange={setTimeline}
                        />
                      </>
                    ) : null}

                    <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
                      <Field id="name" label="Name" error={errors.name}>
                        <input
                          ref={nameRef}
                          id="name"
                          type="text"
                          required
                          autoComplete="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          {...invalid("name")}
                          className={cn(fieldClass, errors.name && invalidClass)}
                          placeholder="Your name"
                        />
                      </Field>
                      <Field
                        id="email"
                        label={mode === "hiring" ? "Work email" : "Email"}
                        error={errors.email}
                      >
                        <input
                          id="email"
                          type="email"
                          required
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          {...invalid("email")}
                          className={cn(fieldClass, errors.email && invalidClass)}
                          placeholder="you@company.com"
                        />
                      </Field>
                    </div>

                    {mode === "hiring" && (
                      <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
                        <Field id="org" label="Company">
                          <input
                            id="org"
                            type="text"
                            autoComplete="organization"
                            value={org}
                            onChange={(e) => setOrg(e.target.value)}
                            className={fieldClass}
                            placeholder="Where you're hiring"
                          />
                        </Field>
                        <Field id="role" label="Role">
                          <input
                            id="role"
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className={fieldClass}
                            placeholder="e.g. Full-stack engineer"
                          />
                        </Field>
                      </div>
                    )}

                    <Field
                      id="message"
                      label={mode === "hiring" ? "Anything else" : "Details (optional)"}
                      error={errors.message}
                    >
                      <textarea
                        id="message"
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        {...invalid("message")}
                        className={cn(fieldClass, "resize-none", errors.message && invalidClass)}
                        placeholder={
                          mode === "hiring"
                            ? "Team, stack, location, timeline…"
                            : "Links, goals, what exists today…"
                        }
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

                    <div className="space-y-4">
                      {/* The brief, read back as you build it. */}
                      <AnimatePresence initial={false}>
                        {mode === "project" && summary && (
                          <m.p
                            key="summary"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="data overflow-hidden text-fg"
                            aria-live="polite"
                          >
                            <span className="text-muted">Your brief · </span>
                            {summary}
                          </m.p>
                        )}
                      </AnimatePresence>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                        <Magnetic>
                          <SubmitButton
                            status={status}
                            label={mode === "hiring" ? "Send" : "Send brief"}
                          />
                        </Magnetic>
                        <p aria-live="polite" className="min-h-5 text-sm">
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
                    </div>
                  </m.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-4 lg:col-start-9">
            <p className="label">{mode === "hiring" ? "For hiring teams" : "How I work"}</p>
            <ul className="mt-5 space-y-3">
              {(mode === "hiring"
                ? ["Open to full-time roles", `Based in ${profile.location} (IST)`, "Reply within 24 hours"]
                : PROMISES
              ).map((p) => (
                <li key={p} className="flex items-start gap-3 text-[1rem] leading-snug">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ink text-paper">
                    <Check className="h-3 w-3" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>

            <p className="label mt-12">Or reach me directly</p>
            <div className="mt-5 border-t border-line-strong">
              <ContactRow
                href={`mailto:${profile.email}`}
                label="Email"
                value={profile.email}
                copyText={profile.email}
              />
              <ContactRow
                href={profile.resumeUrl}
                label="Résumé"
                value="View PDF"
                external
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
            </div>
            {profile.available && (
              <AvailabilityBadge className="mt-8 border-paper/40 [&>span:first-child]:bg-paper">
                {profile.availabilityLabel}
              </AvailabilityBadge>
            )}
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

/** Single-select chips; the selection is a shared-layout ink pill that
 *  glides between options. Tapping the selected chip clears it. */
function ChipGroup({
  id,
  label,
  options,
  value,
  onChange,
}: {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  return (
    <fieldset>
      <legend className="label">{label}</legend>
      <div role="radiogroup" aria-label={label} className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(on ? null : o.value)}
              className={cn(
                "relative rounded-full border px-3.5 py-2 text-[0.9rem] leading-none transition-[color,border-color] duration-300 active:scale-[0.97] sm:px-4 sm:py-2.5 sm:text-[0.95rem]",
                on ? "border-transparent text-paper" : "border-line-strong text-fg hover-device:hover:border-fg",
              )}
            >
              {on && (
                <m.span
                  layoutId={`chip-${id}`}
                  transition={spring}
                  className="absolute inset-0 rounded-full bg-ink"
                />
              )}
              <span className="relative">{o.label}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/** After sending: what happens next, so the silence after "send" has shape. */
function NextSteps({ mode, onReset }: { mode: Mode; onReset: () => void }) {
  const steps: ReactNode[] =
    mode === "hiring"
      ? [
          "I read your note and reply within 24 hours.",
          <>
            Meanwhile, my{" "}
            <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
              résumé
            </a>{" "}
            and{" "}
            <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
              LinkedIn
            </a>{" "}
            are one tap away.
          </>,
        ]
      : [
          "I read your brief and reply within 24 hours.",
          "We pin down the scope together.",
          "You get a fixed quote before any work starts.",
        ];
  return (
    <m.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mt-8 rounded-[22px] bg-ink p-6 text-paper sm:mt-10 sm:p-8"
      role="status"
    >
      <p className="serif text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight">
        Sent. <span className="italic text-signal">Thank you.</span>
      </p>
      <p className="label mt-6 text-[#9d978b]">What happens next</p>
      <ol className="mt-4 space-y-3">
        {steps.map((step, i) => (
          <m.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.12, duration: 0.45 }}
            className="flex gap-4 text-[1.02rem] leading-snug"
          >
            <span className="data pt-0.5 text-signal">{String(i + 1).padStart(2, "0")}</span>
            <span>{step}</span>
          </m.li>
        ))}
      </ol>
      <button
        type="button"
        onClick={onReset}
        className="label mt-8 text-[#9d978b] underline-offset-4 hover:text-paper hover:underline"
      >
        Send another
      </button>
    </m.div>
  );
}

const morph = { type: "spring", stiffness: 380, damping: 32, mass: 0.8 } as const;

/**
 * The send button morphs with the request: the pill collapses into a spinning
 * ring while sending, then blooms back out (a framer layout animation - the
 * label counter-scales so it never squashes mid-morph).
 */
function SubmitButton({ status, label }: { status: Status; label: string }) {
  const sending = status === "sending";
  return (
    <m.button
      layout
      type="submit"
      disabled={sending}
      transition={morph}
      style={{ borderRadius: 999, transition: "color 0.45s, border-color 0.45s" }}
      className={cn(
        "btn btn-solid group/roll h-[3.1rem]",
        sending && "w-[3.1rem] cursor-wait justify-center p-0!",
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
        ) : (
          <m.span
            key={`idle-${label}`}
            layout="position"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 whitespace-nowrap"
          >
            <Roll>{label}</Roll>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </m.span>
        )}
      </AnimatePresence>
    </m.button>
  );
}

const fieldClass =
  "mt-2 block w-full border-0 border-b border-line-strong bg-transparent px-0 py-3 text-lg text-fg outline-none transition-[border-color] duration-300 placeholder:text-faint hover:border-fg/70 focus:border-fg";

// A heavier underline for a field that needs attention (box-shadow, so the
// field doesn't shift by a pixel).
const invalidClass = "border-accent shadow-[0_1px_0_0_var(--accent)]";

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <m.p
            key="error"
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <span className="flex items-center gap-2 pt-2.5 text-[0.95rem] font-medium leading-snug text-accent">
              <span
                aria-hidden
                className="grid h-[1.1rem] w-[1.1rem] shrink-0 place-items-center rounded-full bg-accent text-[0.65rem] font-bold text-paper"
              >
                !
              </span>
              {error}
            </span>
          </m.p>
        )}
      </AnimatePresence>
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
