'use client';

import {
  Activity,
  Component,
  HomeIcon,
  Mail,
  Package,
  ScrollText,
} from 'lucide-react';
import { useEffect, useState, type MouseEvent } from 'react';
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/dock';

const navigationItems = [
  {
    title: 'Home',
    href: '#top',
    icon: <HomeIcon aria-hidden="true" />,
  },
  {
    title: 'Work',
    href: '#selected-work',
    icon: <Package aria-hidden="true" />,
  },
  {
    title: 'Capabilities',
    href: '#capabilities',
    icon: <Component aria-hidden="true" />,
  },
  {
    title: 'Experience',
    href: '#experience',
    icon: <Activity aria-hidden="true" />,
  },
  {
    title: 'About',
    href: '#about',
    icon: <ScrollText aria-hidden="true" />,
  },
  {
    title: 'Contact',
    href: '#contact',
    icon: <Mail aria-hidden="true" />,
  },
] as const;

const navigationSectionIds = navigationItems.map((item) => item.href.slice(1));

export function BottomDock() {
  const [activeSection, setActiveSection] = useState('top');

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;

    const visibleSections = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleSections.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        const nextSection = [...visibleSections.entries()]
          .filter(([, ratio]) => ratio > 0)
          .sort(([, firstRatio], [, secondRatio]) => secondRatio - firstRatio)[0];

        if (nextSection) setActiveSection(nextSection[0]);
      },
      { rootMargin: '-30% 0px -52% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    navigationSectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section))
      .forEach((section) => observer.observe(section));

    const syncHash = () => {
      const hash = window.location.hash.slice(1);
      if (navigationSectionIds.includes(hash)) setActiveSection(hash);
    };

    window.addEventListener('hashchange', syncHash);
    window.addEventListener('popstate', syncHash);

    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', syncHash);
      window.removeEventListener('popstate', syncHash);
    };
  }, []);

  function handleNavigation(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const sectionId = href.slice(1);
    const section = document.getElementById(sectionId);
    if (!section) return;

    event.preventDefault();
    setActiveSection(sectionId);
    window.history.pushState(null, '', href);
    section.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
  }

  return (
    <nav className="landing-dock-nav" aria-label="Primary navigation">
      <Dock className="landing-dock-panel">
        {navigationItems.map((item) => (
          <DockItem
            key={item.title}
            href={item.href}
            aria-label={`Go to ${item.title}`}
            aria-current={activeSection === item.href.slice(1) ? 'location' : undefined}
            onClick={(event) => handleNavigation(event, item.href)}
            className="landing-dock-item"
          >
            <DockLabel>{item.title}</DockLabel>
            <DockIcon className="landing-dock-icon-wrap">
              <span className="landing-dock-icon">{item.icon}</span>
            </DockIcon>
          </DockItem>
        ))}
      </Dock>
    </nav>
  );
}
