import type { MetadataRoute } from "next";
import { portfolio } from "@/data/portfolio";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Amir Abasi — Full Stack Developer",
    short_name: "Amir Abasi",
    description: portfolio.intro.summary,
    start_url: "/",
    display: "standalone",
    background_color: "#fbfbfb",
    theme_color: "#11bd88",
    icons: [
      {
        src: "/brand-mark.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
