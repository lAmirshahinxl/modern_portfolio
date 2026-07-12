import type { Metadata } from "next";
import { SkillsDocument } from "@/components/portfolio/portfolio-documents";

export const metadata: Metadata = {
  title: "Skills",
  description: "Technical skills and stack used by Amir Abasi across Flutter, React, and full-stack projects.",
  alternates: { canonical: "/skills" },
  openGraph: { url: "/skills" },
};

export default function SkillsPage() {
  return <SkillsDocument />;
}
