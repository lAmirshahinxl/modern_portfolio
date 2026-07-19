import type { Metadata } from "next";
import { ContactDocument } from "@/components/portfolio/portfolio-documents";
import { buildPageMetadata, getSeoPage } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata(getSeoPage("/contact"));

export default function ContactPage() {
  return <ContactDocument />;
}
