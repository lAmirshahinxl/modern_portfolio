import type { Metadata } from "next";
import { PeerReviewsDocument } from "@/components/portfolio/portfolio-documents";

export const metadata: Metadata = {
  title: "Peer Reviews",
  description: "Client and collaborator feedback from projects delivered by Amir Abasi.",
  alternates: { canonical: "/peer-reviews" },
  openGraph: { url: "/peer-reviews" },
};

export default function PeerReviewsPage() {
  return <PeerReviewsDocument />;
}
