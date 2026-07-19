import type { Metadata } from "next";
import { SkillsDocument } from "@/components/portfolio/portfolio-documents";
import { buildPageMetadata, getSeoPage } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata(getSeoPage("/skills"));

export default function SkillsPage() {
  return <SkillsDocument />;
}
