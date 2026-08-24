import type { Metadata } from "next";
import { LandingPage } from "@/components/portfolio/landing-page";
import { buildPageMetadata, getSeoPage } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata(getSeoPage("/"));

export default function ProfilePage() {
  return <LandingPage />;
}
