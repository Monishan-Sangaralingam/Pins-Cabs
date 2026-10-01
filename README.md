# PINS Cabs frontend

Next.js 16 App Router, React 19, TypeScript and Tailwind CSS. Pages are prerendered with `output: "export"`; deploy the generated `out/` directory to a static host.

## Development and verification

- `npm run dev` starts development.
- `npm run build` generates production HTML and assets.
- `npm run lint` checks source code.
- `node tests/seo-pages.mjs` checks the export with installed Microsoft Edge.
- `node tests/vehicle-suggestions.mjs` checks passenger and service matching.

## SEO maintenance

The canonical origin is https://www.pinscabs.com, defined in src/lib/seo.ts. Canonical and social URLs use HTTPS and trailing slashes. Hosting preview URLs and NEXT_PUBLIC_SITE_URL do not override it.

Use pageMetadata(title, description, path) from src/lib/seo.ts for each page. Titles omit the final brand suffix because the root layout supplies it. Landing pages live in src/data/landingPages.ts and guides in src/data/travelGuides.ts. Their routes and sitemap entries are generated from these records. Add standalone routes to src/app/sitemap.ts only after creating their page. No fabricated lastmod dates are emitted.

public/robots.txt is the sole robots file and points to /sitemap.xml. Public pages remain indexable. There is no PWA manifest. System font stacks require no external font downloads.

Business details are in src/config/business.ts. Keep address and postalAddress consistent. src/lib/structuredData.ts describes one LocalBusiness provider linked to one TaxiService, rendered only on the homepage. Hours reflect the published 24/7 availability. Do not add unverified ratings, prices, coordinates or profiles. Service-page BreadcrumbList markup is preserved and safely serialized. The existing 1200 × 630 sharing image is public/media/social/pins-cabs-share-v2.jpg.

The hero uses eager, high-priority loading with a mobile picture source. It avoids a desktop-only preload that could fetch both images on mobile. Below-fold Next Image elements keep lazy loading and dimensions; static export serves existing WebP assets without a Next image server.

## Optional integrations

Set these build environment variables using .env.example:

- GOOGLE_SITE_VERIFICATION: actual Search Console HTML token. Leave empty for DNS verification.
- NEXT_PUBLIC_GA_MEASUREMENT_ID: actual G- measurement ID. Empty or malformed IDs load no analytics script.

Rebuild and redeploy after changes. Analytics loads once after hydration and manually measures initial and client-side page views. Query strings, hashes, referrers and form values are excluded from these events. Before enabling, disable Enhanced Measurement in the GA4 web stream (including automatic history pageviews, outbound links and form events), so automatic collection cannot duplicate events or capture WhatsApp enquiry URLs. Review the privacy notice and consent requirements before activation. Do not also install this ID through GTM.

Conversion events are deferred: phone_click, whatsapp_click, book_ride_click and booking_start can be added without customer data. Never emit booking_complete for a WhatsApp handoff: the site cannot observe confirmed bookings.

## Hosting and manual checks

No hosting-provider configuration is checked in. Configure permanent HTTP-to-HTTPS and non-www-to-www redirects at the host, preserving path/query, normalize trailing slashes, and serve out/404.html with HTTP 404 for missing pages. Do not use an index.html fallback. Verify robots.txt is text and sitemap.xml is XML, both HTTP 200; ensure public pages have no X-Robots-Tag: noindex.

Submit the sitemap in Search Console, inspect indexing, validate schema in Schema.org Validator and Google Rich Results Test, and run mobile PageSpeed tests after deployment. Confirm business details and review the existing draft privacy notice. See SEO_REPORT.md for the audit and remaining actions.
