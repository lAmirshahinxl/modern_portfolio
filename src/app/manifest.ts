import type { MetadataRoute } from "next";
import { portfolio } from "@/data/portfolio";
import { seo } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: `${seo.brandName} — Full Stack Developer`,
    short_name: seo.brandName,
    description: seo.defaultDescription,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    lang: portfolio.site.language,
    dir: "ltr",
    background_color: "#fbfbfb",
    theme_color: seo.themeColor,
    categories: ["business", "productivity", "portfolio"],
    icons: [
      {
        src: "/brand-mark.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
