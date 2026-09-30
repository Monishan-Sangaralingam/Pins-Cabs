import type { Metadata } from "next";

export const siteOrigin = "https://www.pinscabs.com";
export function pageMetadata(title: string, description: string, path: string): Metadata {
  const url = `${siteOrigin}${path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}/`}`;
  return {
    title, description, alternates: { canonical: url },
    openGraph: { title: `${title} | PINS Cabs`, description, url, type: "website", siteName: "PINS Cabs", images: [{ url: `${siteOrigin}/media/social/pins-cabs-share-v2.jpg`, width: 1200, height: 630, alt: "PINS Cabs" }] },
    twitter: { card: "summary_large_image", title: `${title} | PINS Cabs`, description, images: [`${siteOrigin}/media/social/pins-cabs-share-v2.jpg`] },
  };
}
