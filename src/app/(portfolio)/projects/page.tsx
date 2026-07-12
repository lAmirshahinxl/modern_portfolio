import type { Metadata } from "next";
import { ProjectsDocument } from "@/components/portfolio/portfolio-documents";

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore mobile, web, crypto, AI, streaming, and full-stack projects built by Amir Abasi.",
  alternates: { canonical: "/projects" },
  openGraph: { url: "/projects" },
};

export default function ProjectsPage() {
  return <ProjectsDocument />;
}
