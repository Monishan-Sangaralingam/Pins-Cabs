# Location selection

Both the home booking card and Journey step share the location selector. Structured pickup/destination values live in PlannerProvider; address strings remain for existing summaries. Enquiries include exact coordinates and OpenStreetMap links. Swap, reset and clear update both representations.

## Free default configuration

Leaflet + OpenStreetMap tiles + public Nominatim. No API key or billing account. Geolocation requires HTTPS (localhost also works) and browser permission.

Public Nominatim explicitly forbids autocomplete, regardless of debounce: https://operations.osmfoundation.org/policies/nominatim/

Therefore default search runs only on Search/Enter, requires 3 characters, and restricts results to Sri Lanka (maximum 5). Requests are cancelled when input changes, cached (100 entries), serialized, and spaced at least 1.1 seconds apart within a browser session. Reverse lookup runs 500 ms after map movement stops. Failed reverse lookup preserves the selected coordinates for confirmation.

This project exports a static site. The browser queue cannot enforce a service-wide request limit across visitors. Before scaling beyond light usage, use an operator-controlled geocoder or gateway with a shared rate limit/cache. Public Nominatim has no availability guarantee. Do not use the public endpoint for a high-traffic deployment.

## Optional self-hosted autocomplete

Set these at build time, only for an endpoint whose operator permits autocomplete:

```
NEXT_PUBLIC_NOMINATIM_URL=https://your-own-nominatim.example
NEXT_PUBLIC_LOCATION_AUTOCOMPLETE=true
```

The endpoint must expose Nominatim-compatible search/reverse JSON and permit browser CORS. Typeahead is debounced 500 ms; it is forcibly disabled for the public Nominatim hostname. Provider behavior is isolated in `src/services/locationService.ts`.

Recent locations are session-only, limited to 5; no precise location persistence. Searches and selected coordinates are sent to the configured geocoder; map tiles go to OpenStreetMap. Attribution is visible in search and maps.

## Verification

- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- Run the app at localhost:3000, then `node tests/location-flows.mjs` (installed Microsoft Edge required). Uses mocked geocoder/GPS/tile failures, avoiding public test traffic. Checks widths 320, 360, 375, 390, 393, 412, 430, 768, 1280; search parameters/caching, empty/error responses, GPS success/denied/unavailable/timeout, map interactions, selection, markers, navigation, swapping, clearing, and focus restoration.

Real-device Safari, physical GPS accuracy, live search relevance and actual tile availability require manual verification. Open both selectors, search or select a map point, deny/allow GPS, pan/zoom, confirm, swap, clear/reset, then inspect the prepared enquiry. Do not send the enquiry during QA.
