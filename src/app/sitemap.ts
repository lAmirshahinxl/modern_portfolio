import type { MetadataRoute } from "next";
import { portfolio } from "@/data/portfolio";
import { absoluteUrl, seoPages } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(portfolio.site.contentUpdatedAt);

  return seoPages.map((page) => ({
    url: absoluteUrl(page.path),
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
    images: page.path === "/" ? [absoluteUrl("/opengraph-image"), absoluteUrl("/brand-mark.svg")] : undefined,
  }));
}
