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
        <a href={business.mapUrl} target="_blank" rel="noreferrer"><MapPin size={16}/>{business.address}</a>
        <small>{business.hours}</small>
        <div className="footer-social" aria-label="Social links">
          {business.socialLinks.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"><span aria-hidden="true">{link.emoji}</span>{link.label}</a>)}
        </div>
      </div>
    </div>
  </footer>;
}
