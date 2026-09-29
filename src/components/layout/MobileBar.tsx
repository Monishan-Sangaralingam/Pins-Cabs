"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import { business } from "@/config/business";

export function MobileBar() {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const bar = barRef.current;
    const root = document.documentElement;
    if (!bar) return;
    const measure = () => root.style.setProperty("--mobile-action-height", `${bar.getBoundingClientRect().height}px`);
    const observer = new ResizeObserver(measure);
    observer.observe(bar);
    measure();
    return () => { observer.disconnect(); root.style.removeProperty("--mobile-action-height"); };
  }, [pathname]);
  if (pathname.replace(/\/+$/, "") === "/plan-ride") return null;
  return <div ref={barRef} className="mobile-bar"><Link className="button button--lime" href="/plan-ride">Request a ride</Link><a className="mobile-call" href={`tel:${business.phoneHref}`} aria-label={`Call PINS Cabs on ${business.phoneDisplay}`}><Phone size={19}/>Call</a></div>;
}
