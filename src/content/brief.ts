/**
 * The contact "brief": what a visitor can pick instead of writing from a
 * blank box. `id`s are also the values of `?brief=` / the `brief` event, so
 * service rows and case studies can open the form with a type already chosen
 * (`hiring` opens the recruiter door instead).
 */
export const BRIEF_TYPES = [
  { id: "website", label: "Website" },
  { id: "landing", label: "Landing page" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "webapp", label: "Web app" },
  { id: "dashboard", label: "Dashboard" },
  { id: "ai", label: "AI feature" },
  { id: "redesign", label: "Redesign" },
  { id: "other", label: "Something else" },
] as const;

export type BriefType = (typeof BRIEF_TYPES)[number]["id"];

export const BRIEF_TIMELINES = [
  "As soon as possible",
  "Within a month",
  "1–3 months",
  "Flexible",
] as const;

/** Only commitments Ayush confirmed; shown beside the form and in the FAQ. */
export const PROMISES = [
  "Reply within 24 hours",
  "Fixed quote before any work starts",
  "You own the code, with support after launch",
] as const;

export const BRIEF_EVENT = "brief:open";

export function isBriefType(v: string | null | undefined): v is BriefType {
  return !!v && BRIEF_TYPES.some((t) => t.id === v);
}
