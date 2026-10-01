"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";

// Reveal content groups, never the planner, its inputs, or sticky containers.
const revealSelector = [
  ".section-heading", ".service-card", ".vehicle-card", ".how-intro",
  ".steps-list article", ".contact-strip .shell > *", ".checklist-section > *",
  ".faq-section > *", ".closing .shell > *", ".service-list article",
  ".contact-card", ".legal-copy > *", ".footer-top > *",
  ".seo-content > *", ".seo-fleet > article", ".seo-guide-grid > article",
  ".seo-article > section", ".section.shell > h2", ".section.shell > .seo-links",
].join(",");

export function ExperienceLayer() {
  const pathname = usePathname();
  const progressRef = useRef<HTMLSpanElement>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const hero = document.querySelector<HTMLElement>(".hero--sunset");
    const picture = hero?.querySelector<HTMLElement>(":scope > picture");
    let frame = 0;
    let heroHeight = hero?.offsetHeight || 1;
    let pageHeight = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    let backToTopVisible = false;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      progressRef.current?.style.setProperty("transform", `scaleX(${Math.min(y / pageHeight, 1)})`);
      if (picture) {
        const progress = Math.min(Math.max(y / heroHeight, 0), 1);
        picture.style.transform = !reduced.matches && desktop.matches && y < heroHeight
          ? `translate3d(0,${progress * 18}px,0) scale(${1 + progress * .025})`
          : "";
      }
      const visible = y > 720;
      if (visible !== backToTopVisible) { backToTopVisible = visible; setShowBackToTop(visible); }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const measure = () => {
      heroHeight = hero?.offsetHeight || 1;
      pageHeight = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      schedule();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(document.body);
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    reduced.addEventListener("change", schedule);
    desktop.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      reduced.removeEventListener("change", schedule);
      desktop.removeEventListener("change", schedule);
      if (picture) picture.style.transform = "";
    };
  }, [pathname]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 760px)");
    const seen = new WeakSet<Element>();
    const active = new Map<HTMLElement, Animation>();
    const finish = (element: HTMLElement) => {
      active.get(element)?.cancel();
      active.delete(element);
    };
    const reveal = (element: HTMLElement, delay: number) => {
      if (reduced.matches || element.contains(document.activeElement)) return;
      const animation = element.animate([
        { opacity: 0, transform: `translate3d(0,${compact.matches ? 16 : 30}px,0)` },
        { opacity: 1, transform: "translate3d(0,0,0)" },
      ], { duration: compact.matches ? 560 : 820, delay, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" });
      active.set(element, animation);
      animation.onfinish = () => finish(element);
    };
    const observer = new IntersectionObserver(entries => {
      const groups = new Map<Element | null, number>();
      entries.filter(entry => entry.isIntersecting).sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top).forEach(entry => {
        const element = entry.target as HTMLElement;
        observer.unobserve(element);
        const count = groups.get(element.parentElement) || 0;
        groups.set(element.parentElement, count + 1);
        // Fast scrolling and tall groups never hold up content already in view.
        const delay = entry.boundingClientRect.top < innerHeight * .35 ? 0 : Math.min(count, 3) * (compact.matches ? 45 : 75);
        reveal(element, delay);
      });
    }, { rootMargin: "0px 0px -5% 0px", threshold: 0 });

    const register = () => {
      document.querySelectorAll<HTMLElement>(revealSelector).forEach(element => {
        if (seen.has(element)) return;
        seen.add(element);
        // Never animate nested groups twice or hide content on an anchor landing.
        if (element.parentElement?.closest(revealSelector)) return;
        if (element.getBoundingClientRect().top < innerHeight * .95 || reduced.matches) return;
        observer.observe(element);
      });
    };
    register();
    const mutations = new MutationObserver(register);
    const main = document.getElementById("main-content");
    if (main) mutations.observe(main, { childList: true, subtree: true });
    const onFocus = (event: FocusEvent) => {
      for (const element of active.keys()) if (element.contains(event.target as Node)) finish(element);
    };
    const onPreference = () => {
      if (reduced.matches) { observer.disconnect(); for (const element of active.keys()) finish(element); }
    };
    document.addEventListener("focusin", onFocus);
    reduced.addEventListener("change", onPreference);
    return () => {
      observer.disconnect(); mutations.disconnect();
      for (const element of active.keys()) finish(element);
      document.removeEventListener("focusin", onFocus);
      reduced.removeEventListener("change", onPreference);
    };
  }, [pathname]);

  return <>
    <div className="scroll-progress" aria-hidden="true"><span ref={progressRef}/></div>
    <button
      type="button"
      className={`back-to-top ${showBackToTop ? "is-visible" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })}
      aria-label="Back to top"
      tabIndex={showBackToTop ? 0 : -1}
    ><ArrowUp size={18}/></button>
  </>;
}
