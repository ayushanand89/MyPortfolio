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

  const { name, email, message, company } = (body ?? {}) as Record<
    string,
    unknown
  >;

  // Honeypot - humans never see the "company" field; pretend success to bots.
  if (typeof company === "string" && company.trim()) {
    return NextResponse.json({ ok: true });
  }

  if (
    typeof name !== "string" ||
    !name.trim() ||
    name.length > 200 ||
    typeof email !== "string" ||
    !EMAIL_RE.test(email) ||
    email.length > 320 ||
    typeof message !== "string" ||
    !message.trim() ||
    message.length > 5000
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
      subject: `Project enquiry from ${name.trim()}`,
      text: `${message.trim()}\n\nFrom ${name.trim()} · ${email}`,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to send" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
