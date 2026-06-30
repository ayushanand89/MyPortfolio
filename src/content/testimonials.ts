export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

// Placeholder reviews — swap in real client quotes when available.
export const testimonials: Testimonial[] = [
  {
    quote:
      "Ayush took a rough idea and shipped a polished, fast product end to end. Clean code, clear communication, and delivered on time.",
    name: "Client Name",
    role: "Founder, Startup",
  },
  {
    quote:
      "The site looks premium and just works — mobile, desktop, everything. He handled design and engineering without hand-holding.",
    name: "Client Name",
    role: "Creator",
  },
  {
    quote:
      "Reliable, detail-obsessed and genuinely good at the hard parts — auth, payments, performance. Would hire again.",
    name: "Client Name",
    role: "Product Manager",
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
