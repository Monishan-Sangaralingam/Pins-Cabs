# Responsive and ride-enquiry implementation review

Implemented locally; no production deployment and no real enquiries sent.

## Root causes confirmed in source

- Successive global/theme rules coupled a mobile hero height of `clamp(590px,155vw,660px)` to a later content height of `clamp(630px,150vw,1040px)` (and another 640px narrow-screen height).
- The planner inherited a -96px mobile margin; service facts used absolute positioning and negative side offsets.
- Header, hero, planner and page shells each had different widths, padding and breakpoint overrides. The header also changed dimensions between its default, scrolled and open states.
- Service selectors alternated between hidden, grid and scrolling flex rules; later two-column field rules defeated earlier stacking rules.
- The fixed wizard footer used a 69px offset while the action bar separately added safe-area padding.
- Page-wide overflow clipping masked potential layout defects.
- Shared journey state already existed. Vehicle entry links lacked a validated URL fallback, while the message formatter had a separate, incomplete vehicle-name map.

These are source findings. The original visual failures were **not reproduced in a browser**: the browser connector returned no available browser. The live site was also unavailable through the web reader.

## Changes

- Replaced accumulated layout overrides with one mobile-first `globals.css`; `coastal-theme.css` now supplies colours and image treatments. Kept existing logo, dark palette, lime accents and coastal artwork.
- Shared 18px mobile gutters and 1240px maximum container; zero-minimum grid tracks and wrapping for long content. No page-level horizontal clipping.
- Content-driven hero, normal-flow facts, full-width mobile actions and planner. Pickup/destination are full-width below desktop; date/passengers share columns from 390px, with all fields stacked below that.
- One native radio service selector with all choices visible. Native journey and vehicle radios support keyboard selection and visible focus.
- Stable header geometry, navigation breakpoint at 1100px, internally scrolling mobile menu, Escape/focus trapping/body scroll locking, and automatic menu closure when resizing to desktop.
- Mobile action-bar spacing is measured with ResizeObserver, including safe-area padding and enlarged text. Hide the bar while editing fields; omit it on the full planner. Wizard Back/Continue remains in normal flow.
- Consistent “Request a ride,” “Continue to enquiry” and availability/price wording.
- Preserved the existing in-memory provider. Known service/vehicle URL parameters merge without clearing journey details; contact parameters are ignored. Selected vehicles survive passenger edits and are checked for suitability on continuation.
- Optional airport pickup, staff schedule, wedding timing, group-trip and goods/load/access fields. Requirements persist separately for each service; only the active service's requirements enter the message.
- Colombo-time validation, separate return date/time errors, invalid-field focus, step-heading focus, improved phone validation and editable review with full-message preview.
- Catalogue-based message names fix Suzuki Every and lorry enquiries. WhatsApp URL uses digits-only destination; message remains unsent until the user sends it in WhatsApp. Clipboard/manual-copy fallback retained.
- Homepage: six services, four vehicle classes, full-catalogue links, illustrative labels, existing contact/coverage/process/FAQ content. Development credit moved to the footer's bottom line.
- Removed reveal/pointer effects and their observers; retained progress and back-to-top with reduced-motion support. Existing image dimensions and lazy below-fold images remain. The picture-selected hero image uses eager loading and high fetch priority without preloading the desktop crop on mobile.

## Files changed

- `src/app/globals.css`, `src/app/coastal-theme.css`
- `src/app/page.tsx`, `src/app/contact/page.tsx`, `src/app/vehicles/page.tsx`, `src/app/plan-ride/page.tsx`
- `src/components/home/QuickPlanner.tsx`
- `src/components/layout/SiteHeader.tsx`, `SiteFooter.tsx`, `MobileBar.tsx`, `ExperienceLayer.tsx`
- `src/components/planner/PlanRideWizard.tsx`, `RideTypeSelector.tsx`, `TripTypeSelector.tsx`
- `src/components/vehicles/VehicleCards.tsx`
- `src/lib/enquiry.ts`, new `src/lib/planner-validation.ts`
- `package.json`, new `scripts/enquiry.test.mjs`, this report

The original stylesheets are retained outside the repository in `../qa-baseline/` for comparison. Existing asset-source files were untouched.

## Automated verification

- `npm run build`: passed (production compilation, TypeScript and static export).
- `npm run lint`: passed.
- `npm test`: 10 regression tests passed; no new dependency.
- `git diff --check`: passed.
- Static-export inspection: homepage has six service cards and four vehicle cards; full vehicle catalogue has ten; no missing referenced media on Home, Services, Vehicles, Contact or the initial planner page.

Regression coverage: known/unknown entry IDs, ignored contact URL parameters, journey merging, Colombo midnight rollover, past/current pickup rejection, return ordering and separate errors, free-text locations, passenger range, vehicle capacity/recommendation, phone/email errors, all catalogue vehicle names, service-specific message filtering and lossless WhatsApp message encoding. These are module tests, **not browser interaction tests**.

## Visual/browser checks still pending

No connected browser was exposed during this session, including after the user offered to connect one. No before/after screenshots were captured. Do not interpret the build or source review as a visual pass.

| Width | Home | Services | Vehicles | Contact | Wizard steps 1–4 |
| --- | --- | --- | --- | --- | --- |
| 320 | Pending | Pending | Pending | Pending | Pending |
| 360 | Pending | Pending | Pending | Pending | Pending |
| 375 | Pending | Pending | Pending | Pending | Pending |
| 390 | Pending | Pending | Pending | Pending | Pending |
| 430 | Pending | Pending | Pending | Pending | Pending |
| 768 | Pending | Pending | Pending | Pending | Pending |
| 1024 | Pending | Pending | Pending | Pending | Pending |
| 1440 | Pending | Pending | Pending | Pending | Pending |

For each width, check horizontal scroll, overlaps, matching container edges, long locations/vehicle names, readable labels, footer and controls. Also check:

1. Menu before/after scroll, Escape, tab wrap, scroll lock and widths 1099/1100/1101.
2. Home quick-planner → full planner and vehicle-card → planner persistence; Back/Continue and Edit preserve data.
3. Every invalid field, first-error focus, optional service requirements, stale vehicle suitability and reset from later steps.
4. Review message, clipboard success and permission-denied fallback. Do not send WhatsApp messages.
5. 200% text, reduced motion and landscape.
6. Real iPhone Safari: native date controls, keyboard, focus scrolling and safe-area insets. No real iPhone/Safari verification was available.

The main remaining risk is the unverified browser rendering of the stylesheet consolidation. Complete this matrix before deployment.
