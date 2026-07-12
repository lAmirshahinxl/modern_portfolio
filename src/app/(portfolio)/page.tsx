import type { Metadata } from "next";
import { ProfileDocument } from "@/components/portfolio/portfolio-documents";

export const metadata: Metadata = {
  title: "Profile",
  description: "Meet Amir Abasi, a full-stack developer specializing in Flutter, React, and modern web products.",
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default function ProfilePage() {
  return <ProfileDocument />;
}
