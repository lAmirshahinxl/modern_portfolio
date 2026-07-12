import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { portfolio } from "@/data/portfolio";
import "./globals.css";

const siteUrl = portfolio.site.url;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Amir Abasi - Full Stack Developer | Flutter & React Specialist",
    template: "%s — Amir Abasi",
  },
  description: portfolio.intro.summary,
  keywords: [
    "Amir Abasi",
    "Full Stack Developer",
    "Flutter Developer",
    "React Developer",
    "Frontend Developer",
    "JavaScript Developer",
    "Mobile App Developer",
    "Web Developer",
  ],
  authors: [{ name: portfolio.brand.name, url: siteUrl }],
  creator: portfolio.brand.name,

  openGraph: {
    type: "website",
    locale: "en_US",

    siteName: "Amir Abasi Portfolio",
    title: "Amir Abasi - Full Stack Developer | Flutter & React Specialist",
    description:
      "Expert Full Stack Developer specializing in Flutter, React, JavaScript, and modern web technologies. 8+ years of experience building mobile apps, web applications, and crypto platforms.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@lamirabasil",
    creator: "@lamirabasil",
    title: "Amir Abasi - Full Stack Developer | Flutter & React Specialist",
    description:
      "Expert Full Stack Developer specializing in Flutter, React, JavaScript, and modern web technologies. 8+ years of experience.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfb" },
    { media: "(prefers-color-scheme: dark)", color: "#181918" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
