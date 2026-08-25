"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRightIcon,
  CameraIcon,
  Code2Icon,
  FileTextIcon,
  FrameIcon,
  Globe2Icon,
  MailIcon,
  MessageCircleIcon,
  type LucideIcon,
} from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { portfolio } from "@/data/portfolio";

interface FooterLink {
  title: string;
  href: string;
  icon?: LucideIcon;
  external?: boolean;
}

interface FooterSection {
  label: string;
  links: FooterLink[];
}

const footerLinks: FooterSection[] = [
  {
    label: "Explore",
    links: [
      { title: "Selected work", href: "#selected-work" },
      { title: "Capabilities", href: "#capabilities" },
      { title: "About", href: "#about" },
      { title: "Experience", href: "#experience" },
      { title: "Developer view", href: "/developer-view", icon: Code2Icon },
    ],
  },
  {
    label: "Background",
    links: [
      { title: "Projects", href: "#selected-work" },
      { title: "Skills", href: "#toolkit" },
      { title: "Peer reviews", href: "#reviews" },
      { title: "Résumé", href: portfolio.resume.href, icon: FileTextIcon },
    ],
  },
  {
    label: "Contact",
    links: [
      { title: "Send an email", href: `mailto:${portfolio.contact.email}`, icon: MailIcon },
      { title: "LinkedIn", href: portfolio.social.linkedin, icon: Globe2Icon, external: true },
      { title: "Instagram", href: portfolio.social.instagram, icon: CameraIcon, external: true },
      { title: "X / Twitter", href: portfolio.social.twitter, icon: MessageCircleIcon, external: true },
      { title: "Blog", href: portfolio.site.blogUrl, icon: Globe2Icon, external: true },
    ],
  },
  {
    label: "Availability",
    links: [
      { title: "Open to opportunities", href: `mailto:${portfolio.contact.email}`, icon: ArrowUpRightIcon },
      { title: portfolio.intro.location, href: "#top" },
      { title: "GMT+3:30", href: "#top" },
      { title: "Available immediately", href: `mailto:${portfolio.contact.email}` },
    ],
  },
];

export function Footer() {
  return (
    <footer className="footer-section" aria-label="Site footer">
      <div className="footer-section-rule" aria-hidden="true" />

      <div className="footer-section-inner">
        <div className="footer-section-grid">
          <AnimatedContainer className="footer-section-brand">
            <FrameIcon className="footer-section-mark" aria-hidden="true" />
            <div className="footer-section-brand-copy">
              <strong>{portfolio.brand.name}</strong>
              <span>Product engineer / full-stack developer</span>
            </div>
            <p className="footer-section-note">
              Clear products, from the first screen to a dependable launch.
            </p>
            <p className="footer-section-copyright">
              © {new Date().getFullYear()} {portfolio.brand.name}. All rights reserved.
            </p>
          </AnimatedContainer>

          <div className="footer-section-links">
            {footerLinks.map((section, index) => (
              <AnimatedContainer key={section.label} delay={0.1 + index * 0.08} className="footer-section-column">
                <h3>{section.label}</h3>
                <ul>
                  {section.links.map((link) => {
                    const LinkIcon = link.icon;

                    return (
                      <li key={link.title}>
                        <a
                          href={link.href}
                          target={link.external ? "_blank" : undefined}
                          rel={link.external ? "noreferrer" : undefined}
                        >
                          {LinkIcon ? <LinkIcon className="footer-section-link-icon" aria-hidden="true" /> : null}
                          <span>{link.title}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </AnimatedContainer>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

type ViewAnimationProps = {
  delay?: number;
  className?: ComponentProps<typeof motion.div>["className"];
  children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { filter: "blur(4px)", y: -8, opacity: 0 }}
      whileInView={{ filter: "blur(0px)", y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={shouldReduceMotion ? { duration: 0 } : { delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
