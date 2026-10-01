# SEO implementation report

## 1. SEO audit before changes

Audited on 2026-10-01 before implementation.

- [Existing] Next.js 16.3 App Router, React 19, TypeScript, Tailwind CSS, static export with trailingSlash enabled. Server-rendered HTML is generated at build time; this is not a client-only indexing implementation.
- [Existing] 19 indexable routes: /, /services/, /vehicles/, /plan-ride/, /contact/, /privacy/, /about/, /blog/, nine service/local landing pages, and two guide articles.
- [Existing] Route-specific title, description, canonical, Open Graph and Twitter metadata through src/lib/seo.ts and Next Metadata API.
- [Existing] src/app/sitemap.ts generates routes from landing-page and guide data, without fake modification dates. public/robots.txt permits crawling and references the canonical sitemap.
- [Existing] Service BreadcrumbList JSON-LD, crawlable Next Links, FAQs, custom 404 page, skip link, navigation landmarks, labelled forms, modal focus handling, and telephone/WhatsApp integrations.
- [Existing] Central business contact configuration, verified against visible source content. No official social profiles found.
- [Existing] WebP media, decorative empty alt text, descriptive service image alt text, image dimensions, lazy loading below the fold, and dynamically loaded location maps.
- [Existing] Local system font stacks, favicon and Apple touch icon, theme color and mobile viewport. No manifest/PWA or external font download is needed.
- [Missing] Business/service structured data, analytics integration, and HTML Search Console configuration. DNS verification cannot be determined from source.
- [Needs improvement] Root metadataBase could diverge from canonical domain through deployment variables; homepage primary heading was only a slogan; fleet cards skipped a heading level on the vehicles page; vehicle alt text was generic; footer lacked a planner link; service JSON serialization did not actually escape less-than characters.
- [Needs improvement] Desktop hero preload could compete with the separate mobile picture source. Existing artwork is modest in size (desktop ~195 KB, mobile ~156 KB), so no asset regeneration or visual redesign is necessary.
- [Needs improvement] README described obsolete origin fallbacks and fonts.
- [Not available] Hosting-provider redirect/header configuration. Live www, non-www, robots and sitemap retrieval failed through the web tool; no production HTTP behavior is asserted.

## 2. Changes implemented

| File | Change and purpose |
| --- | --- |
| src/app/layout.tsx | Uses the shared canonical origin for metadataBase; adds optional Search Console verification and one analytics component. |
| src/lib/structuredData.ts | Adds a single graph with a LocalBusiness provider linked by ID to TaxiService, using existing contact details and published hours. Adds safe JSON serialization. |
| src/config/business.ts | Adds structured postal fields alongside the existing displayed address. |
| src/app/page.tsx | Renders the business graph, improves local title/description and copy, makes the visible eyebrow the descriptive H1 while keeping the slogan, uses eager high-priority hero loading without a conflicting desktop preload. |
| src/app/globals.css; src/app/coastal-theme.css | Transfers slogan styles and animations to its class so the visual hierarchy is retained independently of heading semantics. Reserves mobile panel space so the sticky Continue bar does not cover the final form control. |
| src/app/services/page.tsx | Clarifies Sri Lanka service metadata. |
| src/app/vehicles/page.tsx | Clarifies car/KDH/bus metadata and adds an H2 before H3 vehicle cards. |
| src/components/vehicles/VehicleCards.tsx | Describes the named illustrative vehicle class in alt text. |
| src/components/layout/SiteFooter.tsx | Adds a crawlable Plan a ride link. |
| src/app/[slug]/page.tsx | Reuses safe JSON-LD serialization for existing breadcrumbs; no second breadcrumb entity. |
| src/lib/enquiry.ts | Normalizes the verified WhatsApp number to digits for the wa.me link; preserves prepared enquiry content. |
| src/components/Analytics.tsx | Optional GA4, after hydration, one initialization and manual page views for client navigation. Explicit event fields exclude query/hash/referrer/form data. |
| .env.example; .gitignore | Documents empty optional integration settings and permits committing the example only. |
| README.md | Documents metadata, schema, sitemap, integration setup, static hosting and maintenance. |
| tests/seo-pages.mjs | Extends production-output coverage for static metadata, assets, links, robots, sitemap, schema, mobile navigation and enquiry handoff. |
| tests/seo-analytics.mjs | Verifies enabled analytics and verification with network interception and disposable build settings. |

TaxiService is a Service rather than the physical business. Provider details belong on the linked LocalBusiness, following https://schema.org/TaxiService. Manual page-view configuration follows https://developers.google.com/analytics/devguides/collection/ga4/views.

## 3. Existing features preserved

Kept the existing sitemap and robots implementation, canonical URL format, 19 routes, social image, favicons, page metadata helper, service breadcrumbs, FAQs, business phone/email/address, form validation, vehicle filtering, maps, WhatsApp enquiry preparation, responsive navigation and animation behavior. No ratings, reviews, coordinates, prices, social profiles, analytics credentials, additional tracking system, or thin landing pages were invented. No deployment was performed.

## 4. Issues found and remaining limits

Fixed the WhatsApp URL number format and an existing mobile sticky-footer overlap that blocked the suitable-vehicle request, plus domain fallback inconsistency, weak homepage H1, missing business graph, generic fleet alt text, vehicles heading hierarchy and unsafe breadcrumb escaping. No duplicate page titles/descriptions or broken local links/assets were found by final export checks. Public pages are not noindexed; the exported 404 is noindexed.

The existing privacy page is explicitly an owner-review draft, and fleet artwork remains labelled illustrative. Keep these factual limitations visible. Business opening hours describe published availability and do not guarantee a particular vehicle.

Static exports cannot configure HTTP status codes, redirects or headers by themselves. Browser tests use a local static test server; its 404 status does not prove the production host is configured correctly. Schema JSON and graph checks do not substitute for third-party rich-result validation. Core Web Vitals need deployment/field measurements; no measured ranking or performance gain is claimed.

## 5. Manual actions required

1. Deploy the tested out/ export through the existing hosting process.
2. Confirm permanent HTTP-to-HTTPS, non-www-to-www and trailing-slash handling; unknown paths must return HTTP 404, not the homepage. Check production X-Robots-Tag headers.
3. Supply a real GA4 measurement ID only when ready. Disable Enhanced Measurement before enabling this implementation, including history pageviews, outbound links and form interactions, to avoid duplicates or automatic collection of WhatsApp message URLs. Review privacy/consent configuration. Do not install the same ID through GTM.
4. Supply the actual Search Console HTML token if using that method; DNS verification needs no token. Submit https://www.pinscabs.com/sitemap.xml and inspect important routes.
5. Validate deployed structured data with Schema.org Validator and Google Rich Results Test, and run mobile PageSpeed/field monitoring.
6. Confirm business contact/hours information, complete owner review of the privacy notice and maintain Google Business Profile information.
7. Future conversion events can measure phone_click, whatsapp_click, book_ride_click and booking_start without personal data. booking_complete must wait for a real confirmation system; a WhatsApp enquiry is not a confirmed booking.

## 6. Future SEO pages

Already implemented before this task: /airport-transfer/, /taxi-wattala/, /kdh-van-hire/, /bus-hire/, /outstation-taxi/, /wedding-car-hire/, /staff-transport/, /lorry-transport/, /taxi-colombo/. Prioritize improving these with verified operational content, starting with airport, Wattala, KDH and bus pages.

A future /taxi-negombo/ page is a recommendation only, contingent on verified coverage and distinct useful information. It was not created or added to the sitemap. Existing guides cover airport enquiry preparation and vehicle/passenger/luggage planning.

## 7. Test results

- Production build: PASS, all 19 public pages prerendered, plus framework/system output.
- ESLint: PASS.
- Vehicle suggestion boundary, service isolation, reconciliation and enquiry checks: PASS.
- All 19 routes: HTTP 200 locally, unique title/description, one H1, canonical/Open Graph URL agreement, static HTML metadata, no public noindex, no duplicate checked head tags.
- Sitemap: valid XML, 19 unique HTTPS www canonical URLs, no query strings, real exported pages only. Robots: accessible and references the same sitemap.
- Assets and links: all rendered image/icon/share asset paths and root-relative anchor targets exist; every image has an alt attribute.
- JSON-LD: parseable, correct context, linked provider identity, no duplicate business graph; service breadcrumbs preserved.
- Mobile/desktop: overflow checks at 390 and 1280 pixels on all routes; mobile menu and Escape focus restoration pass. Updated homepage screenshot visually reviewed.
- Booking: airport/bus/lorry preselection checked; full mobile enquiry-to-WhatsApp-link check recorded by tests/seo-pages.mjs. No external message is sent.
- Analytics enabled test: PASS with fake test-only build values and intercepted network. Exactly one script/config, one pageview per initial/client navigation, sensitive URL parts absent, one verification token.
- Final export rebuilt without test analytics ID or verification token; integrations remain disabled by default.

Run the analytics test only against an export built with test variables NEXT_PUBLIC_GA_MEASUREMENT_ID=G-SEO12345 and GOOGLE_SITE_VERIFICATION=seo-test-token, then rebuild without them. Never deploy that temporary test export.
