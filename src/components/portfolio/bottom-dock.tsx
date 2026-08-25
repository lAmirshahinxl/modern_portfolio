'use client';

import {
  Activity,
  Component,
  HomeIcon,
  Mail,
  Package,
  ScrollText,
} from 'lucide-react';
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

export function BottomDock() {
  return (
    <nav className="landing-dock-nav" aria-label="Primary navigation">
      <Dock className="landing-dock-panel">
        {navigationItems.map((item) => (
          <DockItem
            key={item.title}
            href={item.href}
            aria-label={`Go to ${item.title}`}
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
