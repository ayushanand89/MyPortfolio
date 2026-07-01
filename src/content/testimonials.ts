export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

// Placeholder reviews — names/roles are illustrative; swap in real client
// quotes and attributions when available.
export const testimonials: Testimonial[] = [
  {
    quote:
      "Ayush took a rough idea and shipped a polished, fast product end to end. Clean code, clear communication, and delivered on time.",
    name: "Rohan Kapoor",
    role: "Founder, Brightloom",
  },
  {
    quote:
      "The site looks premium and just works — mobile, desktop, everything. He handled design and engineering without hand-holding.",
    name: "Aditya Rao",
    role: "Creator & Educator",
  },
  {
    quote:
      "Reliable, detail-obsessed and genuinely good at the hard parts — auth, payments, performance. Would hire again.",
    name: "Sana Qureshi",
    role: "Product Manager, Finhive",
  },
];

export const trustPoints: string[] = [
  "Fast communication",
  "Clean, maintainable code",
  "On-time delivery",
  "Mobile-first & responsive",
  "SEO-friendly structure",
  "Post-delivery support",
];
