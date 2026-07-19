import type { Metadata } from "next";
import { portfolio } from "@/data/portfolio";

const siteUrl = portfolio.site.url;
const brandName = portfolio.brand.name;
const defaultTitle = `${brandName} — Full Stack Developer | Flutter & React Specialist`;
const defaultDescription = portfolio.intro.summary;
const ogImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${brandName} — Full Stack Developer portfolio`,
} as const;

export const seo = {
  siteUrl,
  brandName,
  defaultTitle,
  defaultDescription,
  ogImage,
  twitterHandle: "@lamirabasil",
  themeColor: "#0092E0",
  keywords: [
    brandName,
    "Full Stack Developer",
    "Flutter Developer",
    "React Developer",
    "Dart Developer",
    "TypeScript Developer",
    "JavaScript Developer",
    "Frontend Developer",
    "Mobile App Developer",
    "Android Developer",
    "iOS Developer",
    "Web Developer",
    "Crypto App Developer",
    "PWA Developer",
    "Angular Developer",
    "Node.js Developer",
    "Portfolio",
    "Hire Flutter Developer",
    "Tehran",
    "Tbilisi",
    ...portfolio.skills,
  ],
  sameAs: [
    portfolio.social.linkedin,
    portfolio.social.twitter,
    portfolio.social.instagram,
    portfolio.site.blogUrl,
  ].filter(Boolean),
} as const;

export type SeoPage = {
  path: string;
  title: string;
  description: string;
  priority: number;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  absoluteTitle?: boolean;
};

export const seoPages: SeoPage[] = [
  {
    path: "/",
    title: defaultTitle,
    description: defaultDescription,
    priority: 1,
    changeFrequency: "weekly",
    absoluteTitle: true,
  },
  {
    path: "/experience",
    title: "Experience",
    description: `${brandName}'s professional experience as a senior Flutter and full-stack developer — roles, delivery record, and working principles across 8+ years.`,
    priority: 0.9,
    changeFrequency: "monthly",
  },
  {
    path: "/projects",
    title: "Projects",
    description: `Explore ${brandName}'s portfolio of Flutter, React, crypto, AI, streaming, and full-stack products — including Bitimen, Catchup, Etlo, Hiddify, and more.`,
    priority: 0.9,
    changeFrequency: "weekly",
  },
  {
    path: "/skills",
    title: "Skills",
    description: `Technical skills used by ${brandName}: Flutter, Dart, React, TypeScript, Angular, Node.js, Python, MongoDB, REST APIs, Android, iOS, and PWA development.`,
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/peer-reviews",
    title: "Peer Reviews",
    description: `Client and collaborator feedback for ${brandName} from shipped Flutter, mobile, and full-stack projects.`,
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/coding-activity",
    title: "Coding Activity",
    description: `Professional development activity and outcomes from ${brandName}'s résumé and recent engineering work.`,
    priority: 0.7,
    changeFrequency: "weekly",
  },
  {
    path: "/contact",
    title: "Contact",
    description: `Contact ${brandName} about Flutter, React, mobile, web, crypto, and full-stack development opportunities. Available immediately.`,
    priority: 0.85,
    changeFrequency: "yearly",
  },
];

export function getSeoPage(path: string): SeoPage {
  const page = seoPages.find((entry) => entry.path === path);
  if (!page) {
    throw new Error(`Missing SEO page config for path: ${path}`);
  }
  return page;
}

export function absoluteUrl(path = "/"): string {
  if (path === "/") return siteUrl;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildPageMetadata(page: SeoPage): Metadata {
  const canonical = page.path;
  const openGraphTitle = page.absoluteTitle ? page.title : `${page.title} — ${brandName}`;

  return {
    title: page.absoluteTitle ? { absolute: page.title } : page.title,
    description: page.description,
    alternates: {
      canonical,
      languages: {
        en: canonical,
        "x-default": canonical,
      },
    },
    openGraph: {
      type: "website",
      locale: portfolio.site.locale,
      url: canonical,
      siteName: `${brandName} Portfolio`,
      title: openGraphTitle,
      description: page.description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      site: seo.twitterHandle,
      creator: seo.twitterHandle,
      title: openGraphTitle,
      description: page.description,
      images: [ogImage.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export function getRootMetadata(): Metadata {
  const googleVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: defaultTitle,
      template: `%s — ${brandName}`,
    },
    description: defaultDescription,
    applicationName: `${brandName} Portfolio`,
    keywords: [...seo.keywords],
    authors: [{ name: brandName, url: siteUrl }],
    creator: brandName,
    publisher: brandName,
    category: "technology",
    referrer: "origin-when-cross-origin",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: "/",
      languages: {
        en: "/",
        "x-default": "/",
      },
    },
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      shortcut: ["/icon.svg"],
      apple: [{ url: "/brand-mark.svg", type: "image/svg+xml" }],
    },
    manifest: "/manifest.webmanifest",
    openGraph: {
      type: "website",
      locale: portfolio.site.locale,
      url: siteUrl,
      siteName: `${brandName} Portfolio`,
      title: defaultTitle,
      description: defaultDescription,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      site: seo.twitterHandle,
      creator: seo.twitterHandle,
      title: defaultTitle,
      description: defaultDescription,
      images: [ogImage.url],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    ...(googleVerification ? { verification: { google: googleVerification } } : {}),
  };
}

export function getPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: brandName,
    url: siteUrl,
    image: absoluteUrl("/brand-mark.svg"),
    email: `mailto:${portfolio.contact.email}`,
    jobTitle: portfolio.intro.eyebrow,
    description: defaultDescription,
    knowsAbout: [...portfolio.skills],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tehran",
      addressCountry: "IR",
    },
    sameAs: [...seo.sameAs],
    worksFor: {
      "@type": "Organization",
      name: "Catchup",
    },
  };
}

export function getWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: `${brandName} Portfolio`,
    url: siteUrl,
    description: defaultDescription,
    inLanguage: portfolio.site.language,
    publisher: {
      "@id": `${siteUrl}/#person`,
    },
  };
}

export function getProfilePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteUrl}/#profilepage`,
    url: siteUrl,
    name: defaultTitle,
    description: defaultDescription,
    dateModified: portfolio.site.contentUpdatedAt,
    mainEntity: {
      "@id": `${siteUrl}/#person`,
    },
    about: {
      "@id": `${siteUrl}/#person`,
    },
    isPartOf: {
      "@id": `${siteUrl}/#website`,
    },
  };
}

export function getBreadcrumbJsonLd(page: SeoPage) {
  const items: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }> = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteUrl,
    },
  ];

  if (page.path !== "/") {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: page.title,
      item: absoluteUrl(page.path),
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

export function getJsonLdGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [getPersonJsonLd(), getWebsiteJsonLd(), getProfilePageJsonLd()],
  };
}
