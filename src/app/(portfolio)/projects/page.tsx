import type { Metadata } from "next";
import { PortfolioPage } from "@/components/portfolio/portfolio-page";
import { ProjectsDocument } from "@/components/portfolio/portfolio-documents";
import { buildPageMetadata, getSeoPage } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata(getSeoPage("/projects"));

export default function ProjectsPage() {
  return <PortfolioPage><ProjectsDocument /></PortfolioPage>;
}
