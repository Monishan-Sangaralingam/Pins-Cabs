import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MobileBar } from "@/components/layout/MobileBar";
import { ExperienceLayer } from "@/components/layout/ExperienceLayer";

export function PageShell({ children }: { children: React.ReactNode }) {
  return <>
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <ExperienceLayer />
    <SiteHeader />
    <main id="main-content">{children}</main>
    <SiteFooter />
    <MobileBar />
  </>;
}
