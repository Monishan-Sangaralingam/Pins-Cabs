import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { business, navItems } from "@/config/business";
import { Logo } from "./Logo";

const planningLinks = [
  { label: "Plan a ride", href: "/plan-ride/" },
  { label: "About PINS Cabs", href: "/about/" },
  { label: "Journey guides", href: "/blog/" },
  { label: "Privacy", href: "/privacy" },
];

const localLinks = [
  { label: "Colombo taxi enquiries", href: "/taxi-colombo/" },
  { label: "KDH van hire", href: "/kdh-van-hire/" },
];

function SocialIcon({ icon }: { icon: (typeof business.socialLinks)[number]["icon"] }) {
  if (icon === "instagram") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.1"/></svg>;
  if (icon === "facebook") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8.4V7c0-.8.6-1.4 1.4-1.4H17V3h-2.4C12.1 3 10.5 4.7 10.5 7.2v1.2H8v3h2.5V21H14v-9.6h2.5l.5-3z"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.1 18.9 6.2 15A8 8 0 1 1 9 17.8z"/><path d="M9.2 8.4c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4 0 .6l-.5.7c-.1.1-.1.3 0 .5.5 1 1.4 1.8 2.5 2.3.2.1.3.1.5-.1l.7-.8c.2-.2.4-.2.6-.1l1.6.8c.2.1.4.3.4.5-.1.7-.4 1.3-.9 1.6-.5.3-1.6.3-3.1-.4-2.6-1.1-4.4-3-5.1-5.1-.4-1.1-.2-1.8.4-2.7z"/></svg>;
}

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-top shell">
      <div className="footer-brand">
        <Logo light />
        <p>Clear journeys start with a clear plan. Tell us where you’re going and we’ll confirm the rest.</p>
        <p className="developer-credit">Developed by <a href="https://hyzantech.com" target="_blank" rel="noopener noreferrer">hyzantech.com</a></p>
      </div>
      <nav className="footer-nav" aria-label="Footer navigation">
        <span className="footer-label">Explore</span>
        <div className="footer-link-grid">
          <div>
            {navItems.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
            {planningLinks.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          </div>
          <div>
            {localLinks.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          </div>
        </div>
      </nav>
      <div className="footer-contact">
        <span className="footer-label">Contact</span>
        <a href={`tel:${business.phoneHref}`}><Phone size={16}/>{business.phoneDisplay}</a>
        <a href={business.emailHref}><Mail size={16}/>{business.emailDisplay}</a>
        <a href={business.mapShortHref} target="_blank" rel="noreferrer"><MapPin size={16}/>{business.address}</a>
        <small>{business.hours}</small>
        <div className="footer-social" aria-label="Social links">
          {business.socialLinks.map((link) => <a key={link.href} href={link.shortHref} target="_blank" rel="noopener noreferrer" aria-label={link.label}><SocialIcon icon={link.icon}/><span className="sr-only">{link.label}</span></a>)}
        </div>
      </div>
    </div>
  </footer>;
}
