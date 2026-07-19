import type { Metadata } from "next";
import { ProjectsDocument } from "@/components/portfolio/portfolio-documents";
import { buildPageMetadata, getSeoPage } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata(getSeoPage("/projects"));

export default function ProjectsPage() {
  return <ProjectsDocument />;
}
