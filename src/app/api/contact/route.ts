import { NextResponse } from "next/server";
import { profile } from "@/content/profile";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Contact form endpoint - relays the message via Resend's REST API (no SDK).
 * Returns 503 when RESEND_API_KEY is unset so the client can fall back to
 * mailto. Env: RESEND_API_KEY (required), CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL
 * (optional - default to the profile email and Resend's onboarding sender).
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { name, email, message, company, kind, type, timeline, org, role } = (body ??
    {}) as Record<string, unknown>;

  // Honeypot - humans never see the "company" field; pretend success to bots.
  if (typeof company === "string" && company.trim()) {
    return NextResponse.json({ ok: true });
  }

  // Optional short fields from the brief (chips / hiring door).
  const short = (v: unknown) =>
    typeof v === "string" && v.trim() ? v.trim().slice(0, 120) : "";
  const hiring = kind === "hiring";
  const fields: Record<string, string> = hiring
    ? { Company: short(org), Role: short(role) }
    : { Building: short(type), Timeline: short(timeline) };
  const text = typeof message === "string" ? message.trim() : "";

  if (
    typeof name !== "string" ||
    !name.trim() ||
    name.length > 200 ||
    typeof email !== "string" ||
    !EMAIL_RE.test(email) ||
    email.length > 320 ||
    (message !== undefined && typeof message !== "string") ||
    text.length > 5000 ||
    // Something to act on: a message, or at least one brief field.
    (!text && !Object.values(fields).some(Boolean))
  ) {
    return NextResponse.json(
      { error: "Missing or invalid fields" },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Contact form not configured" },
      { status: 503 },
    );
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO_EMAIL ?? profile.email],
      reply_to: email,
      subject: hiring
        ? `Role enquiry${fields.Role ? `: ${fields.Role}` : ""}${fields.Company ? ` at ${fields.Company}` : ""} · ${name.trim()}`
        : `New project${fields.Building ? `: ${fields.Building}` : ""} · ${name.trim()}`,
      text: [
        hiring ? "HIRING ENQUIRY" : "PROJECT BRIEF",
        ...Object.entries(fields)
          .filter(([, v]) => v)
          .map(([k, v]) => `${k}: ${v}`),
        "",
        text,
        "",
        `From ${name.trim()} · ${email}`,
      ]
        .join("\n")
        .replace(/\n{3,}/g, "\n\n"),
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to send" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
