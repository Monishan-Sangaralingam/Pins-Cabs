import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { business, navItems } from "@/config/business";
import { Logo } from "./Logo";

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-top shell">
      <div><Logo light /><p>Clear journeys start with a clear plan. Tell us where you’re going and we’ll confirm the rest.</p></div>
      <div><span className="footer-label">Explore</span>{navItems.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</div>
      <div><span className="footer-label">Contact</span><a href={`tel:${business.phoneHref}`}><Phone size={16}/>{business.phoneDisplay}</a><a href={business.emailHref}><Mail size={16}/>{business.emailDisplay}</a><a href={business.mapUrl} target="_blank" rel="noreferrer"><MapPin size={16}/>{business.address}</a><small>{business.hours}</small></div>
    </div>
    <div className="footer-bottom shell"><span>© {new Date().getFullYear()} PINS Cabs</span><span>Ride enquiries · Wattala, Sri Lanka</span><Link href="/privacy">Privacy</Link></div>
  </footer>;
}
