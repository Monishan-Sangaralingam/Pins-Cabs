import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { business, navItems } from "@/config/business";
import { Logo } from "./Logo";

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-top shell">
      <div><Logo light /><p>Clear journeys start with a clear plan. Tell us where you’re going and we’ll confirm the rest.</p><p className="developer-credit">Developed by <a href="https://hyzantech.com" target="_blank" rel="noopener noreferrer">hyzantech.com</a></p></div>
      <div><span className="footer-label">Explore</span>{navItems.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}<Link href="/plan-ride/">Plan a ride</Link><Link href="/about/">About PINS Cabs</Link><Link href="/blog/">Journey guides</Link><Link href="/taxi-colombo/">Colombo taxi enquiries</Link><Link href="/kdh-van-hire/">KDH van hire</Link><Link href="/privacy">Privacy</Link></div>
      <div><span className="footer-label">Contact</span><a href={`tel:${business.phoneHref}`}><Phone size={16}/>{business.phoneDisplay}</a><a href={business.emailHref}><Mail size={16}/>{business.emailDisplay}</a><a href={business.mapUrl} target="_blank" rel="noreferrer"><MapPin size={16}/>{business.address}</a><small>{business.hours}</small></div>
    </div>
  </footer>;
}
