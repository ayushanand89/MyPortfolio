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
  description: string;
};

export const services: Service[] = [
  {
    icon: "globe",
    title: "Websites & Portfolios",
    description:
      "Premium marketing sites, brand and portfolio sites — fast, responsive and built to convert visitors into customers.",
  },
  {
    icon: "rocket",
    title: "Landing Pages",
    description:
      "High-conversion landing pages for launches and campaigns, with crisp copy structure, motion and analytics-ready markup.",
  },
  {
    icon: "shopping-cart",
    title: "E-commerce",
    description:
      "Storefronts with catalog, cart, secure checkout and payments — plus an admin suite to actually run the store.",
  },
  {
    icon: "layout-dashboard",
    title: "SaaS Dashboards & Admin Panels",
    description:
      "Data-dense, role-gated dashboards and admin tools with clean state management and real-time-ready APIs.",
  },
  {
    icon: "boxes",
    title: "Full-Stack Web Apps",
    description:
      "Idea to launch — auth, databases, REST APIs, integrations and deployment, engineered to be secure and correct.",
  },
  {
    icon: "gauge",
    title: "Redesigns & Performance",
    description:
      "Rebuilds of dated or slow sites — modern UI, Core-Web-Vitals tuning, SEO structure and API integration.",
  },
];
