"use client";

import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";

const DesktopLandingPage = lazy(() =>
  import("@/components/portfolio/landing-page-desktop").then(({ DesktopLandingPage: Page }) => ({ default: Page })),
);

const desktopMotionQuery = "(min-width: 821px) and (prefers-reduced-motion: no-preference)";

export function DesktopLandingSwitcher({ children }: { children: ReactNode }) {
  const [showDesktopPage, setShowDesktopPage] = useState(false);
  const staticFallback = <div className="landing-static-fallback">{children}</div>;

  useEffect(() => {
    const media = window.matchMedia(desktopMotionQuery);
    const sync = () => setShowDesktopPage(media.matches);

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  if (!showDesktopPage) return staticFallback;

  return (
    <Suspense fallback={staticFallback}>
      <DesktopLandingPage />
    </Suspense>
  );
}
