import type { Metadata } from "next";
import { CodingActivityDocument } from "@/components/portfolio/portfolio-documents";

export const metadata: Metadata = {
  title: "Coding Activity",
  description: "Professional development activity and outcomes from Amir Abasi's résumé.",
  alternates: { canonical: "/coding-activity" },
  openGraph: { url: "/coding-activity" },
};

export default function CodingActivityPage() {
  return <CodingActivityDocument />;
}
