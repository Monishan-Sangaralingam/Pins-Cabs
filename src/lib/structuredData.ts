import { business } from "@/config/business";
import { siteOrigin } from "@/lib/seo";

// TaxiService is a Service; address and telephone belong to its business provider.
export const businessSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${siteOrigin}/#organization`,
      name: business.name,
      url: `${siteOrigin}/`,
      telephone: business.phoneHref,
      email: business.emailDisplay,
      logo: `${siteOrigin}/media/brand/pins-cabs-logo.png`,
      address: { "@type": "PostalAddress", ...business.postalAddress },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00", closes: "23:59",
      },
    },
    {
      "@type": "TaxiService",
      "@id": `${siteOrigin}/#taxi-service`,
      name: `${business.name} taxi service`,
      url: `${siteOrigin}/`,
      provider: { "@id": `${siteOrigin}/#organization` },
      areaServed: ["Wattala", "Colombo", "Sri Lanka"],
    },
  ],
};

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
