import { DesktopLandingSwitcher } from "@/components/portfolio/desktop-landing-switcher";
import { LandingPageStatic } from "@/components/portfolio/landing-page-static";

export function LandingPage() {
  return (
    <DesktopLandingSwitcher>
      <LandingPageStatic />
    </DesktopLandingSwitcher>
  );
}
