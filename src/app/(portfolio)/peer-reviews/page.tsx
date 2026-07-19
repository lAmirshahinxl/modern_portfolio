import type { Metadata } from "next";
import { PeerReviewsDocument } from "@/components/portfolio/portfolio-documents";
import { buildPageMetadata, getSeoPage } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata(getSeoPage("/peer-reviews"));

export default function PeerReviewsPage() {
  return <PeerReviewsDocument />;
}
