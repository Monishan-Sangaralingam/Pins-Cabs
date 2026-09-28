"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";

const revealSelector = [
  ".section-heading",
  ".service-card",
  ".vehicle-card",
  ".how-intro",
  ".steps-list article",
  ".contact-strip .shell > *",
  ".contact-details > *",
  ".checklist-section > *",
  ".checklist span",
  ".faq-section > *",
  ".faq-list details",
  ".closing .shell > *",
  ".subpage-hero .shell > *",
  ".content-note",
  ".service-list article",
  ".contact-card",
  ".legal-copy > *",
  ".planner-intro",
  ".stepper",
  ".wizard-card",
  ".trip-summary",
  ".footer-top > *",
  ".footer-bottom",
].join(",");

export function ExperienceLayer() {
  const pathname = usePathname();
  const progressRef = useRef<HTMLSpanElement>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    let frame = 0;
    let backToTopVisible = false;

    const updateScrollState = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
      progressRef.current?.style.setProperty("transform", `scaleX(${progress})`);

      const nextVisible = window.scrollY > 720;
      if (nextVisible !== backToTopVisible) {
        backToTopVisible = nextVisible;
        setShowBackToTop(nextVisible);
      }
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateScrollState);
    };

    updateScrollState();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let observer: IntersectionObserver | undefined;
    const frame = window.requestAnimationFrame(() => {
      const targets = Array.from(document.querySelectorAll<HTMLElement>(revealSelector));
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer?.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -8%", threshold: 0.08 });

      targets.forEach((target, index) => {
        target.classList.add("reveal-item");
        target.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
        if (target.getBoundingClientRect().top < window.innerHeight * 0.94) target.classList.add("is-visible");
        else observer?.observe(target);
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let frame = 0;
    const onPointerMove = (event: PointerEvent) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
        document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
        frame = 0;
      });
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return <>
    <div className="scroll-progress" aria-hidden="true"><span ref={progressRef}/></div>
    <div className="pointer-ambient" aria-hidden="true"/>
    <button
      type="button"
      className={`back-to-top ${showBackToTop ? "is-visible" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      tabIndex={showBackToTop ? 0 : -1}
    >
      <ArrowUp size={18}/>
    </button>
  </>;
}
