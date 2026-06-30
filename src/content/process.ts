export type ProcessStep = {
  step: string;
  title: string;
  description: string;
};

export const process: ProcessStep[] = [
  {
    step: "01",
    title: "Discover",
    description:
      "We align on goals, audience, scope and brand. I turn fuzzy ideas into a concrete plan with clear deliverables and timeline.",
  },
  {
    step: "02",
    title: "Design",
    description:
      "I map the UX, layout and UI direction — content structure first, then a clean, on-brand interface you sign off on.",
  },
  {
    step: "03",
    title: "Build",
    description:
      "Responsive frontend, backend, integrations and motion — built in reusable components with the hard parts (auth, payments, data) done right.",
  },
  {
    step: "04",
    title: "Launch",
    description:
      "Deploy, optimize for speed and SEO, test across devices, and hand over a polished product — with support after delivery.",
  },
];
