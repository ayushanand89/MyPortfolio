import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";
import { SEO_DESCRIPTION } from "@/lib/seo";

/** Web app manifest: the site's name and colours for browsers and devices. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name} | Full-Stack Engineer`,
    short_name: profile.name,
    description: SEO_DESCRIPTION,
    start_url: "/",
    display: "browser",
    background_color: "#0c0b0a",
    theme_color: "#0c0b0a",
    icons: [{ src: "/icon", sizes: "32x32", type: "image/png" }],
  };
}
