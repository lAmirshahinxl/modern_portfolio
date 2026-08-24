import type { ReactNode } from "react";
import { PortfolioPage } from "@/components/portfolio/portfolio-page";

export default function DeveloperViewLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <PortfolioPage basePath="/developer-view">{children}</PortfolioPage>;
}
