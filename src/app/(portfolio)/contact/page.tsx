import type { Metadata } from "next";
import { ContactDocument } from "@/components/portfolio/portfolio-documents";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Amir Abasi about Flutter, React, mobile, web, and full-stack development opportunities.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact" },
};

export default function ContactPage() {
  return <ContactDocument />;
}
