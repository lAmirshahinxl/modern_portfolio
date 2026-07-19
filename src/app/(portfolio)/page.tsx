import type { Metadata } from "next";
import { ProfileDocument } from "@/components/portfolio/portfolio-documents";
import { buildPageMetadata, getSeoPage } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata(getSeoPage("/"));

export default function ProfilePage() {
  return <ProfileDocument />;
}
