"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";

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

  return <>
    <div className="scroll-progress" aria-hidden="true"><span ref={progressRef}/></div>
    <button
      type="button"
      className={`back-to-top ${showBackToTop ? "is-visible" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })}
      aria-label="Back to top"
      tabIndex={showBackToTop ? 0 : -1}
    >
      <ArrowUp size={18}/>
    </button>
  </>;
}
