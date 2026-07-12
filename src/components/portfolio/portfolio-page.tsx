"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import {
  defaultOpenTabs,
  ensureTabOpen,
  getFileIdFromPathname,
  portfolioFileById,
  type PortfolioFileId,
} from "@/data/portfolio-files";
import { portfolio } from "@/data/portfolio";

type Theme = "light" | "dark";

const lineNumbers = Array.from({ length: 64 }, (_, index) => index + 1);
const pinnedTabId: PortfolioFileId = "profile";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function Explorer({
  activeTarget,
  onNavigate,
}: {
  activeTarget: PortfolioFileId;
  onNavigate: () => void;
}) {
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
        <Link className={activeTarget === "profile" ? "active" : undefined} href="/" onClick={onNavigate}>
          <i>M</i> profile.md
        </Link>
        <Link className={activeTarget === "experience" ? "active" : undefined} href="/experience" onClick={onNavigate}>
          <i>✳</i> experience.tsx
        </Link>
        <p><span>⌄</span> work/</p>
        <Link className={activeTarget === "projects" ? "active" : undefined} href="/projects" onClick={onNavigate}>
          <i>▸</i> projects.dir
        </Link>
        <Link className={activeTarget === "skills" ? "active" : undefined} href="/skills" onClick={onNavigate}>
          <i>{`{}`}</i> skills.json
        </Link>
        <Link className={activeTarget === "peer-reviews" ? "active" : undefined} href="/peer-reviews" onClick={onNavigate}>
          <i>≡</i> peer_reviews.log
        </Link>
        <p><span>⌄</span> meta/</p>
        <Link className={activeTarget === "coding-activity" ? "active" : undefined} href="/coding-activity" onClick={onNavigate}>
          <i>≡</i> coding_activity.log
        </Link>
        <Link className={activeTarget === "contact" ? "active" : undefined} href="/contact" onClick={onNavigate}>
          <i>$</i> contact.sh
        </Link>
      </nav>
      <div className="terminal-line"><span>$</span><i /></div>
    </div>
  );
}

export function PortfolioPage({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const activeTarget = getFileIdFromPathname(pathname);
  const activeTab = portfolioFileById[activeTarget];
  const editorScrollRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeOverride, setThemeOverride] = useState<Theme | null>(null);
  const [systemTheme, setSystemTheme] = useState<Theme>("light");
  const [openTabs, setOpenTabs] = useState<PortfolioFileId[]>(() =>
    ensureTabOpen(defaultOpenTabs, getFileIdFromPathname(pathname)),
  );
  const [tabHistory, setTabHistory] = useState<PortfolioFileId[]>(() => [
    getFileIdFromPathname(pathname),
  ]);
  const [trackedTarget, setTrackedTarget] = useState(activeTarget);

  if (trackedTarget !== activeTarget) {
    setTrackedTarget(activeTarget);
    setOpenTabs((current) => ensureTabOpen(current, activeTarget));
    setTabHistory((current) => {
      if (current[current.length - 1] === activeTarget) return current;
      return [...current.filter((id) => id !== activeTarget), activeTarget];
    });
  }

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystemTheme = () => setSystemTheme(media.matches ? "dark" : "light");
    syncSystemTheme();
    media.addEventListener("change", syncSystemTheme);
    return () => media.removeEventListener("change", syncSystemTheme);
  }, []);

  useEffect(() => {
    if (themeOverride) {
      document.documentElement.dataset.theme = themeOverride;
      return;
    }

    delete document.documentElement.dataset.theme;
  }, [themeOverride]);

  useEffect(() => {
    editorScrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  const resolvedTheme = themeOverride ?? systemTheme;
  const visibleTabs = openTabs
    .map((id) => portfolioFileById[id])
    .filter(Boolean);

  function toggleTheme() {
    const current = themeOverride ?? getSystemTheme();
    setThemeOverride(current === "dark" ? "light" : "dark");
  }

  function closeTab(id: PortfolioFileId, event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (id === pinnedTabId) return;

    const remaining = openTabs.filter((tabId) => tabId !== id);
    const nextOpen = remaining.length > 0 ? remaining : [pinnedTabId];
    setOpenTabs(nextOpen);

    const nextHistory = tabHistory.filter((tabId) => tabId !== id && nextOpen.includes(tabId));
    setTabHistory(nextHistory.length > 0 ? nextHistory : [pinnedTabId]);

    if (activeTarget !== id) return;

    const previous = nextHistory[nextHistory.length - 1] ?? pinnedTabId;
    router.push(portfolioFileById[previous].href);
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
        <p className="window-title">
          {portfolio.site.windowTitle} <span>›</span>{" "}
          <AnimatePresence mode="wait" initial={false}>
            <motion.strong
              key={activeTab.label}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeTab.label}
            </motion.strong>
          </AnimatePresence>
        </p>
        <nav className="title-actions" aria-label="Quick links">
          <a className="hire-pill" href={`mailto:${portfolio.contact.email}`}><i /> <span className="wide-label">available_for_</span>hire<span className="wide-label">: true</span></a>
          <a href={portfolio.site.blogUrl} target="_blank" rel="noreferrer">blog</a>
          <a className="resume" href={portfolio.resume.href} target="_blank" rel="noreferrer">{portfolio.resume.label}</a>
          <Link className="terminal-action" aria-label="Open contact terminal" href="/contact">&gt;_</Link>
          <button aria-label="Toggle color theme" aria-pressed={resolvedTheme === "dark"} onClick={toggleTheme}>
            {resolvedTheme === "dark" ? "☼" : "☾"}
          </button>
        </nav>
      </header>

      <aside className="explorer desktop-explorer">
        <Explorer activeTarget={activeTarget} onNavigate={() => setMenuOpen(false)} />
      </aside>

      <AnimatePresence>
        {menuOpen ? (
          <>
            <motion.button className="drawer-backdrop" aria-label="Close explorer" onClick={() => setMenuOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.aside className="explorer mobile-explorer" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}>
              <Explorer activeTarget={activeTarget} onNavigate={() => setMenuOpen(false)} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <nav className="editor-tabs" role="tablist" aria-label="Open files">
        <AnimatePresence initial={false}>
          {visibleTabs.map((tab) => {
            const isActive = activeTarget === tab.id;

            return (
              <motion.div
                key={tab.id}
                className={isActive ? "editor-tab active" : "editor-tab"}
                role="tab"
                aria-selected={isActive}
                layout={!prefersReducedMotion}
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.96, y: -4 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.28,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href={tab.href}
                  aria-current={isActive ? "page" : undefined}
                >
                  <i>{tab.icon}</i>
                  <span>{tab.label}</span>
                </Link>
                {tab.pinned ? null : (
                  <button
                    type="button"
                    className="tab-close"
                    aria-label={`Close ${tab.label}`}
                    onClick={(event) => closeTab(tab.id, event)}
                  >
                    ×
                  </button>
                )}
                {isActive && !prefersReducedMotion ? (
                  <motion.span
                    className="tab-indicator"
                    layoutId="active-tab-indicator"
                    transition={{ type: "spring", stiffness: 380, damping: 34, mass: 0.7 }}
                  />
                ) : isActive ? (
                  <span className="tab-indicator" />
                ) : null}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </nav>

      <main className="editor" id="main-content">
        <aside className="line-numbers" aria-hidden="true">
          {lineNumbers.map((line) => <span key={line}>{line}</span>)}
        </aside>
        <div className="editor-scroll" ref={editorScrollRef}>
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={pathname}
              className="route-transition"
              initial={prefersReducedMotion ? false : {
                opacity: 0,
                y: 18,
                filter: "blur(8px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: prefersReducedMotion
                  ? { duration: 0 }
                  : {
                      opacity: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
                      y: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
                      filter: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
                    },
              }}
              exit={prefersReducedMotion ? undefined : {
                opacity: 0,
                y: -12,
                filter: "blur(5px)",
                transition: {
                  duration: 0.26,
                  ease: [0.4, 0, 0.2, 1],
                },
              }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="statusbar">
        <div><span>⌘ main</span><span>♨ Flutter · React</span><span className="desktop-status">⌁ 130+ projects</span></div>
        <div><span className="desktop-status">TypeScript</span><span className="desktop-status">UTF-8</span><span className="desktop-status">LF</span><span>{portfolio.intro.timezone}</span></div>
      </footer>
    </div>
  );
}
