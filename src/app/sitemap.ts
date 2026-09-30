import type { MetadataRoute } from "next";
import { landingPages } from "@/data/landingPages";
import { travelGuides } from "@/data/travelGuides";
import { siteOrigin } from "@/lib/seo";

export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/services/", "/vehicles/", "/plan-ride/", "/contact/", "/privacy/", "/about/", "/blog/",
    ...landingPages.map(page => `/${page.slug}/`),
    ...travelGuides.map(guide => `/blog/${guide.slug}/`),
  ];
  return paths.map(path => ({ url: `${siteOrigin}${path}` }));
}
