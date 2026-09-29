import type { BriefType } from "./brief";

export type Service = {
  /** lucide-react icon key, mapped in the Services component */
  icon:
    | "globe"
    | "rocket"
    | "shopping-cart"
    | "layout-dashboard"
    | "boxes"
    | "gauge";
  title: string;
  /** Brief type the "Get a quote" link pre-selects (see content/brief.ts). */
  brief: BriefType;
  /** Italic serif aside revealed on hover in the Services index. */
  keyword: string;
  description: string;
};

export const services: Service[] = [
  {
    icon: "globe",
    title: "Websites & Portfolios",
    brief: "website",
    keyword: "that convert",
    description:
      "Premium marketing sites, brand and portfolio sites: fast, responsive and built to convert visitors into customers.",
  },
  {
    icon: "rocket",
    title: "Landing Pages",
    brief: "landing",
    keyword: "for launch day",
    description:
      "High-conversion landing pages for launches and campaigns, with crisp copy structure, motion and analytics-ready markup.",
  },
  {
    icon: "shopping-cart",
    title: "E-commerce",
    brief: "ecommerce",
    keyword: "that sells",
    description:
      "Storefronts with catalog, cart, secure checkout and payments, plus an admin suite to actually run the store.",
  },
  {
    icon: "layout-dashboard",
    title: "SaaS Dashboards & Admin Panels",
    brief: "dashboard",
    keyword: "data, made calm",
    description:
      "Data-dense, role-gated dashboards and admin tools with clean state management and real-time-ready APIs.",
  },
  {
    icon: "boxes",
    title: "Full-Stack Web Apps",
    brief: "webapp",
    keyword: "idea to launch",
    description:
      "Idea to launch: auth, databases, REST APIs, integrations and deployment, engineered to be secure and correct.",
  },
  {
    icon: "gauge",
    title: "Redesigns & Performance",
    brief: "redesign",
    keyword: "faster, sharper",
    description:
      "Rebuilds of dated or slow sites: modern UI, Core-Web-Vitals tuning, SEO structure and API integration.",
  },
];
