export const portfolio = {
  brand: {
    shortName: "AA",
    name: "Amir Abasi",
    legalName: "",
  },
  site: {
    url: "https://amirabasi.info",
    windowTitle: "~/amirabasi.info",
    blogUrl: "https://amirabasi.info/blog",
  },
  contact: {
    email: "contact@amirabasi.info",
  },
  social: {
    linkedin: "https://www.linkedin.com/in/amir-abasi-661b381b7/",
    twitter: "https://x.com/lamirabasil",
    instagram: "https://www.instagram.com/amirabasi___/",
  },
  resume: {
    href: "/AmirAbasi.pdf",
    label: "AmirAbasi.pdf",
  },
  intro: {
    eyebrow: "Full Stack Developer",
    headline:
      "I build mobile and web products with Flutter, React, and modern full-stack tools.",
    summary:
      "Full Stack Developer specializing in Flutter, React, JavaScript, and modern web technologies. 8+ years building mobile apps, web applications, and crypto platforms. Open to new opportunities.",
    statement:
      "Building Apps | Code Artist | Flutter Dev. Full-stack developer specializing in mobile development — particularly Flutter — with experience in Python, Node.js, and Angular.",
    location: "Tehran, Iran · Tbilisi, Georgia",
    experience: "8+ years experience",
    availability: "Available immediately",
    timezone: "GMT+3:30",
  },
  about: {
    paragraphs: [
      "Building Apps | Code Artist | Amir, Flutter Dev. I'm a full-stack developer specializing in mobile development, particularly Flutter. With experience in Python, Node.js, and Angular, I ship cross-platform apps and web products that people actually use.",
      "Over 8+ years I've delivered 130+ projects — from crypto wallets and exchanges to AI tools and super-apps. Available immediately for mobile development and Flutter roles.",
    ],
  },
  statistics: [
    { value: "8+", label: "Years Experience", detail: "Mobile, web & full-stack" },
    { value: "130+", label: "Projects Complete", detail: "Shipped for clients worldwide" },
    { value: "99%", label: "Client Satisfaction", detail: "Committed delivery & communication" },
    { value: "90+", label: "Global Clients", detail: "Apps, wallets & web platforms" },
  ],
  principles: [
    "Ship mobile experiences that feel native on both Android and iOS.",
    "Crypto and fintech products need security and clarity — not just flashy UI.",
    "Full-stack means owning the path from API to pixel, not handing off half the problem.",
    "Fast delivery only counts when the work stays maintainable after launch.",
  ],
  projects: [
    {
      title: "Bitimen",
      detail: "Android & iOS cryptocurrency trading app",
      href: "https://bitimen.com/application-download",
    },
    {
      title: "Aqila Wallet",
      detail: "Secure multi-crypto wallet with blockchain integration",
      href: "https://www.aquila.ch/en/bank/",
    },
    {
      title: "Catchup AI",
      detail: "AI platform for multi-source data analytics",
      href: "https://thecatchup.ai/",
    },
    {
      title: "Nobitex",
      detail: "Iran's largest digital currency exchange (web)",
      href: "https://nobitex.ir/en/",
    },
  ],
} as const;

export type Portfolio = typeof portfolio;
