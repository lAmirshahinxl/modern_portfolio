import type { Metadata } from "next";
import { ExperienceDocument } from "@/components/portfolio/portfolio-documents";
import { buildPageMetadata, getSeoPage } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata(getSeoPage("/experience"));

export default function ExperiencePage() {
  return <ExperienceDocument />;
}
