import type { MetadataRoute } from "next";
import { portfolio } from "@/data/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", priority: 1 },
    { path: "/experience", priority: 0.9 },
    { path: "/projects", priority: 0.9 },
    { path: "/skills", priority: 0.7 },
    { path: "/peer-reviews", priority: 0.7 },
    { path: "/coding-activity", priority: 0.7 },
    { path: "/contact", priority: 0.8 },
  ];

  return routes.map(({ path, priority }) => ({
    url: `${portfolio.site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  }));
}
