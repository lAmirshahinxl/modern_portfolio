import type { ReactNode } from "react";
import { PortfolioPage } from "@/components/portfolio/portfolio-page";

export default function PortfolioLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <PortfolioPage>{children}</PortfolioPage>;
}
