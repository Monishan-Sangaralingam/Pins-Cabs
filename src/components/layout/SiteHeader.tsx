"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navItems } from "@/config/business";
import { Logo } from "./Logo";

export function SiteHeader() {
  const pathname = usePathname();
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    mobileMenuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        requestAnimationFrame(() => menuButtonRef.current?.focus());
      }
      if (event.key === "Tab") {
        const focusable = [menuButtonRef.current, ...(mobileMenuRef.current?.querySelectorAll<HTMLElement>("a") ?? [])].filter(Boolean) as HTMLElement[];
        const first = focusable[0]; const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", onKeyDown); };
  }, [open]);
  const headerClasses = ["site-header", scrolled && "is-scrolled", open && "menu-open"]
    .filter(Boolean)
    .join(" ");
  const pageLabels: Record<string, string> = {
    "/": "Home",
    "/services": "Services",
    "/vehicles": "Vehicles",
    "/plan-ride": "Plan a ride",
    "/contact": "Contact",
    "/privacy": "Privacy",
  };
  const currentPage = pageLabels[normalizedPath] ?? "PINS Cabs";

  function handleHeaderNavigation(event: MouseEvent<HTMLAnchorElement>, href: string) {
    setOpen(false);
    if (href.includes("#")) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const resetScroll = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    resetScroll();
    window.requestAnimationFrame(() => window.requestAnimationFrame(resetScroll));
  }

  return (
    <header className={headerClasses}>
      <div className="header-inner">
        <Logo light />
        <span className="header-page-label" aria-label={`Current page: ${currentPage}`}><small>Current page</small>{currentPage}</span>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => {
            const route = item.href.split("#")[0];
            const active = route !== "/" && normalizedPath === route;
            return <Link key={item.href} href={item.href} scroll={item.href.includes("#")} className={active ? "is-active" : undefined} aria-current={active ? "page" : undefined} onClick={(event) => handleHeaderNavigation(event, item.href)}>{item.label}</Link>;
          })}
        </nav>
        <Link className={`button button--lime header-cta ${normalizedPath === "/plan-ride" ? "is-active" : ""}`} aria-current={normalizedPath === "/plan-ride" ? "page" : undefined} href="/plan-ride#main-content" onClick={(event) => handleHeaderNavigation(event, "/plan-ride#main-content")}>Plan my ride <span>↗</span></Link>
        <button ref={menuButtonRef} className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav ref={mobileMenuRef} id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation">
        {navItems.map((item) => {
          const route = item.href.split("#")[0];
          const active = route !== "/" && normalizedPath === route;
          return <Link key={item.href} href={item.href} scroll={item.href.includes("#")} className={active ? "is-active" : undefined} aria-current={active ? "page" : undefined} onClick={(event) => handleHeaderNavigation(event, item.href)}>{item.label}<span>↗</span></Link>;
        })}
        <Link className="button button--lime" href="/plan-ride#main-content" onClick={(event) => handleHeaderNavigation(event, "/plan-ride#main-content")}>Plan my ride</Link>
      </nav>}
    </header>
  );
}
