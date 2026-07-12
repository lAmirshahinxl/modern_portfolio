"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { portfolio } from "@/data/portfolio";

type Target = "profile" | "experience" | "projects" | "contact";
type Theme = "light" | "dark";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const tabs: Array<{ id: Target; icon: string; label: string }> = [
  { id: "profile", icon: "M", label: "profile.md" },
  { id: "experience", icon: "✳", label: "experience.tsx" },
  { id: "projects", icon: "▸", label: "projects.dir" },
  { id: "contact", icon: "$", label: "contact.sh" },
];

const lineNumbers = Array.from({ length: 48 }, (_, index) => index + 1);

function scrollToTarget(id: Target) {
  const container = document.getElementById("editor-scroll");
  const target = document.querySelector<HTMLElement>(`[data-section="${id}"]`);
  if (!container || !target) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top =
    target.getBoundingClientRect().top -
    container.getBoundingClientRect().top +
    container.scrollTop -
    30;

  container.scrollTo({
    top: Math.max(0, top),
    behavior: prefersReduced ? "auto" : "smooth",
  });
}

function ProfileDocument() {
  return (
    <article className="profile-document">
      <div className="command-row" data-section="profile">
        <p><span>$</span> cat <strong>profile.md</strong></p>
        <time dateTime="2026-07-12">— 2026-07-12</time>
      </div>

      <section className="document-section about-document" aria-labelledby="about-title">
        <p className="document-label">01 · ABOUT</p>
        <h1 id="about-title">{portfolio.brand.name}.</h1>
        {portfolio.brand.legalName ? (
          <p className="legal-name">{portfolio.brand.legalName}</p>
        ) : null}
        <p className="document-headline">{portfolio.intro.headline}</p>
        <div className="document-meta">
          <span>{portfolio.intro.eyebrow}</span>
          <i>·</i>
          <span>{portfolio.intro.location}</span>
          <i>·</i>
          <span>{portfolio.intro.timezone}</span>
          <i>·</i>
          <span className="available"><b /> available</span>
        </div>
      </section>

      <hr />

      <section className="document-section biography" data-section="experience">
        {portfolio.about.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <hr />

      <section className="document-section numbers" data-section="projects" aria-labelledby="numbers-title">
        <h2 className="document-label" id="numbers-title">02 · BY THE NUMBERS</h2>
        <div className="numbers-grid">
          {portfolio.statistics.map((stat) => (
            <div className="number-item" key={stat.label}>
              <strong>{stat.value}</strong>
              <p>{stat.label}</p>
              <small>{stat.detail}</small>
            </div>
          ))}
        </div>
        <ul className="project-links" aria-label="Featured projects">
          {portfolio.projects.map((project) => (
            <li key={project.title}>
              <a href={project.href} target="_blank" rel="noreferrer">
                <strong>{project.title}</strong>
                <span> — {project.detail}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <hr />

      <section className="document-section principles" aria-labelledby="principles-title">
        <h2 className="document-label" id="principles-title">03 · HOW I WORK</h2>
        <ol>
          {portfolio.principles.map((principle, index) => (
            <li key={principle}>
              <span>0{index + 1}</span>
              <p>{principle}</p>
            </li>
          ))}
        </ol>
      </section>

      <hr />

      <section className="document-section contact-document" data-section="contact" aria-labelledby="contact-title">
        <h2 className="document-label" id="contact-title">04 · CONTACT</h2>
        <p>Have a project in mind or just want to say hi? My inbox is always open.</p>
        <a href={`mailto:${portfolio.contact.email}`}>$ mail {portfolio.contact.email}</a>
        <div className="social-links">
          <a href={portfolio.social.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={portfolio.social.twitter} target="_blank" rel="noreferrer">X</a>
          <a href={portfolio.social.instagram} target="_blank" rel="noreferrer">Instagram</a>
        </div>
      </section>
    </article>
  );
}

function Explorer({ onSelect }: { onSelect: (id: Target) => void }) {
  return (
    <div className="explorer-content">
      <div className="explorer-title"><span>⌄</span> EXPLORER</div>
      <div className="profile-card">
        <Image src="/brand-mark.svg" alt={`${portfolio.brand.name} logo`} width={34} height={34} />
        <div>
          <strong>{portfolio.brand.name}</strong>
          <small>{portfolio.intro.eyebrow}</small>
        </div>
      </div>

      <nav className="file-tree" aria-label="Portfolio files">
        <p><span>⌄</span> about/</p>
        <button className="active" onClick={() => onSelect("profile")}><i>M</i> profile.md</button>
        <button onClick={() => onSelect("experience")}><i>✳</i> experience.tsx</button>
        <p><span>⌄</span> work/</p>
        <button onClick={() => onSelect("projects")}><i>▸</i> projects.dir</button>
        <button onClick={() => onSelect("projects")}><i>{`{}`}</i> skills.json</button>
        <button onClick={() => onSelect("experience")}><i>≡</i> peer_reviews.log</button>
        <p><span>⌄</span> meta/</p>
        <button onClick={() => onSelect("projects")}><i>≡</i> coding_activity.log</button>
        <button onClick={() => onSelect("contact")}><i>$</i> contact.sh</button>
      </nav>
      <div className="terminal-line"><span>$</span><i /></div>
    </div>
  );
}

export function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<Target>("profile");
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeOverride, setThemeOverride] = useState<Theme | null>(null);
  const [systemTheme, setSystemTheme] = useState<Theme>("light");

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystemTheme = () => setSystemTheme(media.matches ? "dark" : "light");
    syncSystemTheme();
    media.addEventListener("change", syncSystemTheme);
    return () => media.removeEventListener("change", syncSystemTheme);
  }, []);

  const resolvedTheme = themeOverride ?? systemTheme;

  useEffect(() => {
    if (themeOverride) {
      document.documentElement.dataset.theme = themeOverride;
      return;
    }

    delete document.documentElement.dataset.theme;
  }, [themeOverride]);

  function selectSection(id: Target) {
    setActiveTab(id);
    setMenuOpen(false);
    scrollToTarget(id);
  }

  function toggleTheme() {
    const current = themeOverride ?? getSystemTheme();
    setThemeOverride(current === "dark" ? "light" : "dark");
  }

  return (
    <div className="ide" data-theme={themeOverride ?? undefined}>
      <div className="sr-only">
        <p>{portfolio.brand.name} — {portfolio.intro.eyebrow}</p>
        <p>{portfolio.intro.headline}</p>
        <p>{portfolio.intro.summary}</p>
        <p>{portfolio.intro.statement}</p>
        <p>{portfolio.intro.location} · {portfolio.intro.experience} · {portfolio.intro.availability}</p>
      </div>

      <header className="titlebar">
        <div className="traffic-lights" aria-hidden="true"><i /><i /><i /></div>
        <button className="mobile-menu" aria-label="Toggle explorer" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>☰</button>
        <p className="window-title">{portfolio.site.windowTitle} <span>›</span> <strong>profile.md</strong></p>
        <nav className="title-actions" aria-label="Quick links">
          <a className="hire-pill" href={`mailto:${portfolio.contact.email}`}><i /> <span className="wide-label">available_for_</span>hire<span className="wide-label">: true</span></a>
          <a href={portfolio.site.blogUrl} target="_blank" rel="noreferrer">blog</a>
          <a className="resume" href={portfolio.resume.href} target="_blank" rel="noreferrer">{portfolio.resume.label}</a>
          <button aria-label="Open contact terminal" onClick={() => selectSection("contact")}>&gt;_</button>
          <button aria-label="Toggle color theme" aria-pressed={resolvedTheme === "dark"} onClick={toggleTheme}>
            {resolvedTheme === "dark" ? "☼" : "☾"}
          </button>
        </nav>
      </header>

      <aside className="explorer desktop-explorer"><Explorer onSelect={selectSection} /></aside>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button className="drawer-backdrop" aria-label="Close explorer" onClick={() => setMenuOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.aside className="explorer mobile-explorer" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}><Explorer onSelect={selectSection} /></motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="editor-tabs" role="tablist" aria-label="Open files">
        {tabs.map((tab) => (
          <button key={tab.id} className={activeTab === tab.id ? "active" : ""} role="tab" aria-selected={activeTab === tab.id} onClick={() => selectSection(tab.id)}>
            <i>{tab.icon}</i><span>{tab.label}</span><b aria-hidden="true">×</b>
          </button>
        ))}
      </div>

      <main className="editor">
        <aside className="line-numbers" aria-hidden="true">
          {lineNumbers.map((line) => <span key={line}>{line}</span>)}
        </aside>
        <div className="editor-scroll" id="editor-scroll"><ProfileDocument /></div>
      </main>

      <footer className="statusbar">
        <div><span>⌘ main</span><span>♨ Flutter · React</span><span className="desktop-status">⌁ 130+ projects</span></div>
        <div><span className="desktop-status">TypeScript</span><span className="desktop-status">UTF-8</span><span className="desktop-status">LF</span><span>{portfolio.intro.timezone}</span></div>
      </footer>
    </div>
  );
}
