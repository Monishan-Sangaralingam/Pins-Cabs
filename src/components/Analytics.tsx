"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { siteOrigin } from "@/lib/seo";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

export function Analytics() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!ready || lastPath.current === pathname) return;
    lastPath.current = pathname;
    // Never send query strings, hashes, referrers or enquiry form values.
    const pageLocation = `${siteOrigin}${pathname}`;
    window.gtag?.("set", { page_location: pageLocation, page_referrer: "" });
    window.gtag?.("event", "page_view", { page_location: pageLocation, page_referrer: "" });
  }, [pathname, ready]);

  if (!/^G-[A-Z0-9]+$/.test(measurementId)) return null;
  return <Script
    id="pins-google-analytics"
    src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
    strategy="afterInteractive"
    onReady={() => {
      window.dataLayer = window.dataLayer || [];
      // gtag expects an Arguments object, not an array.
      // eslint-disable-next-line prefer-rest-params
      window.gtag = function () { window.dataLayer!.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", measurementId, {
        send_page_view: false,
        page_location: `${siteOrigin}${window.location.pathname}`,
        page_referrer: "",
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      });
      setReady(true);
    }}
  />;
}
