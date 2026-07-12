import type { Metadata } from "next";
import { ExperienceDocument } from "@/components/portfolio/portfolio-documents";

export const metadata: Metadata = {
  title: "Experience",
  description: "Amir Abasi's full-stack development experience, technical stack, delivery record, and working principles.",
  alternates: { canonical: "/experience" },
  openGraph: { url: "/experience" },
};

export default function ExperiencePage() {
  return <ExperienceDocument />;
}
