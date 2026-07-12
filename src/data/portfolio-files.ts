export type PortfolioFileId =
  | "profile"
  | "experience"
  | "projects"
  | "skills"
  | "peer-reviews"
  | "coding-activity"
  | "contact";

export type PortfolioFile = {
  id: PortfolioFileId;
  href: string;
  icon: string;
  label: string;
  pinned?: boolean;
};

export const portfolioFiles: PortfolioFile[] = [
  { id: "profile", href: "/", icon: "M", label: "profile.md", pinned: true },
  { id: "experience", href: "/experience", icon: "✳", label: "experience.tsx" },
  { id: "projects", href: "/projects", icon: "▸", label: "projects.dir" },
  { id: "skills", href: "/skills", icon: "{}", label: "skills.json" },
  { id: "peer-reviews", href: "/peer-reviews", icon: "≡", label: "peer_reviews.log" },
  { id: "coding-activity", href: "/coding-activity", icon: "≡", label: "coding_activity.log" },
  { id: "contact", href: "/contact", icon: "$", label: "contact.sh" },
];

export const defaultOpenTabs: PortfolioFileId[] = ["profile", "experience", "projects"];

export const portfolioFileById = Object.fromEntries(
  portfolioFiles.map((file) => [file.id, file]),
) as Record<PortfolioFileId, PortfolioFile>;

export function getFileIdFromPathname(pathname: string): PortfolioFileId {
  const match = portfolioFiles.find((file) => file.href === pathname);
  return match?.id ?? "profile";
}

export function ensureTabOpen(openTabs: PortfolioFileId[], id: PortfolioFileId): PortfolioFileId[] {
  return openTabs.includes(id) ? openTabs : [...openTabs, id];
}
