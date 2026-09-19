import type { MetadataRoute } from "next";
import { SITE_URL, navLinks } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", ...navLinks.map((l) => l.href), "/chapters/apply", "/events/support", "/code-of-conduct"];
  return paths.map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    changeFrequency: path === "/events" || path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
