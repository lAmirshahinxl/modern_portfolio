import type { Metadata } from "next";
import { CodingActivityDocument } from "@/components/portfolio/portfolio-documents";
import { buildPageMetadata, getSeoPage } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata(getSeoPage("/coding-activity"));

export default function CodingActivityPage() {
  return <CodingActivityDocument />;
}
