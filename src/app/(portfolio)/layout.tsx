"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { PortfolioPage } from "@/components/portfolio/portfolio-page";

export default function PortfolioLayout({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();

  if (pathname === "/") return children;

  return <PortfolioPage>{children}</PortfolioPage>;
}
