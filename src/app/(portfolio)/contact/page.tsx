import type { Metadata } from "next";
import { PortfolioPage } from "@/components/portfolio/portfolio-page";
import { ContactDocument } from "@/components/portfolio/portfolio-documents";
import { buildPageMetadata, getSeoPage } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata(getSeoPage("/contact"));

export default function ContactPage() {
  return <PortfolioPage><ContactDocument /></PortfolioPage>;
}
