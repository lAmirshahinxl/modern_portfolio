"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type ReactNode } from "react";
import { ParallaxComponent } from "@/components/ui/parallax-scrolling";
import { AuroraBackground, BorderBeam, CountUp, MagneticLink, PointerGlow, ScrollProgress, TextReveal, TracingBeam, useSpotlight } from "@/components/ui/motion-primitives";
import { portfolio } from "@/data/portfolio";

const capabilities = [
  {
    index: "01",
    title: "Mobile products",
    description: "Native-feeling experiences for Android and iOS, built with Flutter and shipped with care.",
    stack: "Flutter / Dart / iOS / Android",
  },
  {
    index: "02",
    title: "Web interfaces",
    description: "Fast, clear product surfaces that turn complex workflows into interfaces people understand.",
    stack: "React / TypeScript / Angular",
  },
  {
    index: "03",
    title: "Product systems",
    description: "The connective tissue from API to pixel: architecture, integrations, performance, and delivery.",
    stack: "Node.js / Python / REST / PWA",
  },
] as const;

const projectAccents = ["blue", "coral", "lime", "violet", "sand", "blue"] as const;
const projectImages = [
  "/projects/bitimen.svg",
  "/projects/aqila.svg",
  "/projects/catchup.svg",
  "/projects/etlo.svg",
  "/projects/hiddify.svg",
  "/projects/vibez.svg",
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

function RevealSection({
  children,
  className,
  id,
  labelledBy,
}: {
  children: ReactNode;
  className: string;
  id?: string;
  labelledBy: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.section
      className={className}
      id={id}
      aria-labelledby={labelledBy}
      data-scroll-section
      initial={reducedMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18, margin: "0px 0px -8% 0px" }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.72, ease }}
    >
      {children}
    </motion.section>
  );
}

function SpotlightProject({
  project,
  index,
  accent,
  image,
  reducedMotion,
}: {
  project: (typeof portfolio.projects)[number];
  index: number;
  accent: (typeof projectAccents)[number];
  image: (typeof projectImages)[number];
  reducedMotion: boolean | null;
}) {
  const spotlight = useSpotlight({ tilt: true, tiltStrength: 4.5 });

  return (
    <motion.article
      {...spotlight}
      className={`landing-project landing-project-${accent}`}
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.58, ease, delay: index * 0.06 }}
      whileHover={reducedMotion ? undefined : { y: -6 }}
      whileTap={reducedMotion ? undefined : { scale: 0.992 }}
    >
      <div className="project-art">
        <Image className="project-art-image" src={image} alt={`${project.title} project preview`} fill sizes="(max-width: 560px) calc(100vw - 32px), 50vw" />
        <span>{String(index + 1).padStart(2, "0")}</span>
        <div className="project-art-shape" />
        <b>{project.tags[0]}</b>
      </div>
      <div className="landing-project-body">
        <div className="project-meta"><span>{project.category}</span><span className="project-status"><i /> {project.status}</span></div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="project-card-footer">
          <div className="project-tags">{project.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
          <MagneticLink href={project.href} target="_blank" rel="noreferrer" aria-label={`View ${project.title}`}>View <span>↗</span></MagneticLink>
        </div>
      </div>
    </motion.article>
  );
}

function SpotlightCapability({
  capability,
  index,
  reducedMotion,
}: {
  capability: (typeof capabilities)[number];
  index: number;
  reducedMotion: boolean | null;
}) {
  const spotlight = useSpotlight({ tilt: true, tiltStrength: 3.5 });

  return (
    <motion.article
      {...spotlight}
      className="capability-card"
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.5, ease, delay: index * 0.1 }}
    >
      <span className="capability-index">{capability.index}</span>
      <h3>{capability.title}</h3>
      <p>{capability.description}</p>
      <span className="capability-stack">{capability.stack}</span>
    </motion.article>
  );
}

export function LandingPage() {
  const reducedMotion = useReducedMotion();
  const landingRootRef = useRef<HTMLDivElement>(null);
  const signalTilt = useSpotlight({ tilt: true, tiltStrength: 3.5 });
  const featuredProjects = portfolio.projects.slice(0, 6);
  const recentExperience = portfolio.resume.experience.slice(0, 4);

  useEffect(() => {
    const root = landingRootRef.current;
    if (!root || reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const layers = gsap.utils.toArray<HTMLElement>("[data-scroll-layer]");

      layers.forEach((layer) => {
        const speed = Number(layer.dataset.scrollSpeed ?? 8);
        const section = layer.closest<HTMLElement>("[data-scroll-section]") ?? layer;

        gsap.fromTo(
          layer,
          { yPercent: speed * -0.35 },
          {
            yPercent: speed,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    }, root);

    const handleRefresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", handleRefresh);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("load", handleRefresh);
      context.revert();
    };
  }, [reducedMotion]);

  return (
    <div className="landing-shell" ref={landingRootRef}>
      <PointerGlow className="landing-pointer-glow" />
      <ScrollProgress className="landing-scroll-progress" />
      <a className="landing-skip-link" href="#main-content">Skip to content</a>

      <header className="landing-nav">
        <Link className="landing-brand" href="#top" aria-label="Amir Abasi home">
          <span className="landing-brand-mark"><Image src="/brand-mark.svg" alt="" width={30} height={30} /></span>
          <span><strong>Amir Abasi</strong><small>product engineer</small></span>
        </Link>
        <nav aria-label="Primary navigation">
          <a href="#selected-work">Work</a>
          <a href="#capabilities">Capabilities</a>
          <a href="#about">About</a>
        </nav>
        <MagneticLink className="landing-nav-cta" href={`mailto:${portfolio.contact.email}`}><span>Let&apos;s talk</span><b>↗</b></MagneticLink>
      </header>

      <main id="main-content">
        <ParallaxComponent className="landing-hero-parallax" id="top" labelledBy="landing-title">
          <div className="landing-hero-grid">
            <AuroraBackground />
            <motion.div
              className="landing-hero-copy"
              initial={reducedMotion ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.8, ease, delay: 0.1 }}
            >
              <p className="eyebrow"><span className="eyebrow-dot" /> {portfolio.intro.availability} <span className="eyebrow-slash">/</span> {portfolio.intro.location}</p>
              <p className="hero-kicker">FULL-STACK / MOBILE / WEB</p>
              <motion.h1 id="landing-title" initial={reducedMotion ? false : { opacity: 1 }} animate={{ opacity: 1 }} transition={reducedMotion ? { duration: 0 } : { duration: 0.7, ease, delay: 0.22 }}><TextReveal text="I build software that" delay={0.22} /> <em><TextReveal text="feels clear." delay={0.42} /></em></motion.h1>
              <p className="hero-lede">{portfolio.intro.headline} From crypto wallets to AI platforms, I bring the product from first screen to dependable launch.</p>
              <motion.div className="hero-actions" initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={reducedMotion ? { duration: 0 } : { duration: 0.55, ease, delay: 0.36 }}>
                <MagneticLink className="button button-primary" href="#selected-work">See selected work <span>↓</span></MagneticLink>
                <Link className="button button-ghost" href="/developer-view">Open developer view <span>↗</span></Link>
              </motion.div>
              <div className="hero-signature"><span>available_for_hire</span><strong>true</strong><i /></div>
            </motion.div>

            <motion.aside
              {...signalTilt}
              className="hero-signal-panel"
              aria-label="Profile snapshot"
              initial={reducedMotion ? false : { opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.9, ease, delay: 0.3 }}
            >
              <BorderBeam />
              <div className="signal-panel-top"><span>signal / 2026</span><span>AA—01</span></div>
              <div className="signal-orbit" aria-hidden="true"><div /><div /><span>AA</span></div>
              <div className="signal-panel-bottom">
                <p>Building apps<br />Code artist<br />Flutter dev.</p>
                <span>{portfolio.intro.timezone}</span>
              </div>
            </motion.aside>
          </div>
          <div className="hero-footnote"><span>scroll to explore</span><span className="hero-line" /><span>01 / 05</span></div>
        </ParallaxComponent>

        <div className="signal-marquee" aria-label="Core stack">
          <div className="signal-marquee-track">
            {["Flutter", "React", "TypeScript", "Node.js", "Python", "Product thinking", "Flutter", "React", "TypeScript", "Node.js", "Python", "Product thinking"].map((item, index) => (
              <span key={`${item}-${index}`}><i /> {item}</span>
            ))}
          </div>
        </div>

        <RevealSection className="landing-section intro-section" id="about" labelledBy="about-title">
          <div className="section-marker"><span>02</span><span>ABOUT / THE SHORT VERSION</span></div>
          <div className="intro-grid" data-scroll-layer data-scroll-speed="-8">
            <h2 id="about-title">A calm hand for <span>complex products.</span></h2>
            <div className="intro-copy">
              {portfolio.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <Link className="text-link" href="/developer-view/experience">More about how I work <span>↗</span></Link>
            </div>
          </div>
          <div className="stat-ribbon" aria-label="Career highlights" data-scroll-layer data-scroll-speed="9">
            {portfolio.statistics.slice(0, 4).map((stat) => (
              <div className="stat-ribbon-item" key={stat.label}>
                <strong><CountUp value={stat.value} /></strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </RevealSection>

        <RevealSection className="landing-section work-section" id="selected-work" labelledBy="work-title">
          <div className="section-marker"><span>03</span><span>SELECTED WORK / 130+ SHIPPED</span></div>
          <div className="section-heading-row" data-scroll-layer data-scroll-speed="-5">
            <h2 id="work-title">Things I&apos;ve helped <span>ship.</span></h2>
            <p>Mobile, web, AI, crypto, and everything in between.</p>
          </div>
          <div className="project-grid" data-scroll-layer data-scroll-speed="7">
            {featuredProjects.map((project, index) => <SpotlightProject key={project.title} project={project} index={index} accent={projectAccents[index]} image={projectImages[index]} reducedMotion={reducedMotion} />)}
          </div>
          <div className="section-end-link"><Link className="text-link" href="/developer-view/projects">See all projects <span>↗</span></Link></div>
        </RevealSection>

        <RevealSection className="landing-section capabilities-section" id="capabilities" labelledBy="capabilities-title">
          <div className="section-marker light-marker"><span>04</span><span>CAPABILITIES / FROM API TO PIXEL</span></div>
          <div className="section-heading-row capabilities-heading" data-scroll-layer data-scroll-speed="-6">
            <h2 id="capabilities-title">Useful at every <span>layer.</span></h2>
            <p>Good product work is a chain of small, considered decisions. I like owning the whole chain.</p>
          </div>
          <div className="capability-grid" data-scroll-layer data-scroll-speed="8">
            {capabilities.map((capability, index) => <SpotlightCapability key={capability.index} capability={capability} index={index} reducedMotion={reducedMotion} />)}
          </div>
        </RevealSection>

        <RevealSection className="landing-section experience-section" labelledBy="experience-title">
          <div className="section-marker"><span>05</span><span>RECENTLY / THE WORK LOG</span></div>
          <TracingBeam className="experience-tracing-beam" />
          <div className="experience-grid" data-scroll-layer data-scroll-speed="-7">
            <div>
              <h2 id="experience-title">A track record of <span>shipping.</span></h2>
              <p className="experience-note">{portfolio.intro.experience} across teams in {portfolio.intro.location} and beyond.</p>
              <Link className="text-link" href="/developer-view/coding-activity">Open the full work log <span>↗</span></Link>
            </div>
            <ol className="experience-list">
              {recentExperience.map((entry, index) => (
                <motion.li
                  key={`${entry.company}-${entry.role}`}
                  initial={reducedMotion ? false : { opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={reducedMotion ? { duration: 0 } : { duration: 0.48, ease, delay: index * 0.07 }}
                >
                  <span className="experience-period">{entry.period ?? "Earlier"}</span>
                  <div><strong>{entry.role}</strong><span>{entry.company} · {entry.location}</span></div>
                  <span className="experience-arrow">↗</span>
                </motion.li>
              ))}
            </ol>
          </div>
        </RevealSection>

        <RevealSection className="landing-cta-section" labelledBy="cta-title">
          <div className="cta-bracket cta-bracket-left" aria-hidden="true" data-scroll-layer data-scroll-speed="14" />
          <div className="cta-bracket cta-bracket-right" aria-hidden="true" data-scroll-layer data-scroll-speed="-14" />
          <p className="eyebrow"><span className="eyebrow-dot" /> currently available</p>
          <h2 id="cta-title">Have a good problem?<br /><em>Let&apos;s make it useful.</em></h2>
          <MagneticLink className="button button-primary" href={`mailto:${portfolio.contact.email}`}>Start a conversation <span>↗</span></MagneticLink>
          <p className="cta-email">{portfolio.contact.email}</p>
        </RevealSection>
      </main>

      <footer className="landing-footer">
        <div><strong>Amir Abasi</strong><span>Product engineer / Full-stack developer</span></div>
        <div className="footer-links"><a href={portfolio.social.linkedin} target="_blank" rel="noreferrer">LinkedIn</a><a href={portfolio.social.twitter} target="_blank" rel="noreferrer">X</a><Link href="/developer-view">Developer view</Link></div>
        <span>© {new Date().getFullYear()} AA</span>
      </footer>
    </div>
  );
}
