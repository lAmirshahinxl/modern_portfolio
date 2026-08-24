import { notFound } from "next/navigation";
import {
  CodingActivityDocument,
  ContactDocument,
  ExperienceDocument,
  PeerReviewsDocument,
  ProfileDocument,
  ProjectsDocument,
  SkillsDocument,
} from "@/components/portfolio/portfolio-documents";

const documents = {
  "": ProfileDocument,
  experience: ExperienceDocument,
  projects: ProjectsDocument,
  skills: SkillsDocument,
  "peer-reviews": PeerReviewsDocument,
  "coding-activity": CodingActivityDocument,
  contact: ContactDocument,
} as const;

type DeveloperViewPageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function DeveloperViewPage({ params }: DeveloperViewPageProps) {
  const { slug = [] } = await params;
  const key = slug.join("/") as keyof typeof documents;
  const Document = documents[key];

  if (!Document) notFound();

  return <Document />;
}
