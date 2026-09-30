# Location selection

Both the home booking card and Journey step share the location selector. Structured pickup/destination values live in PlannerProvider; address strings remain for existing summaries. Enquiries include exact coordinates and OpenStreetMap links. Swap, reset and clear update both representations.

## Free default configuration

Leaflet + OpenStreetMap tiles + Photon search + Nominatim reverse geocoding. No API key or billing account. Geolocation requires HTTPS (localhost also works) and browser permission.

Suggestions appear automatically after at least 3 characters and a 500 ms typing pause. Search/Enter remains available. Photon queries use a Sri Lanka bounding box and country filter; returned results are also checked for LK and limited to 5. Requests are cancelled when input changes, cached (100 entries), serialized, and spaced at least 1.1 seconds apart within a browser session. Reverse lookup runs 500 ms after map movement stops. Failed reverse lookup preserves the selected coordinates for confirmation.

Photon supports search-as-you-type; its public server permits reasonable usage, with no availability guarantee: https://github.com/komoot/photon
Public Nominatim forbids autocomplete and receives only reverse lookups in the default configuration: https://operations.osmfoundation.org/policies/nominatim/

This static site's browser queue cannot enforce a shared limit across visitors. Before scaling beyond light usage, configure operator-controlled services or a gateway with shared rate limiting/cache.

## Optional build-time configuration

No environment variables are needed for the default setup. To use your own Photon server:

```
NEXT_PUBLIC_PHOTON_URL=https://your-own-photon.example
```

To disable automatic suggestions, set `NEXT_PUBLIC_LOCATION_AUTOCOMPLETE=false`.
To return to Nominatim search, set `NEXT_PUBLIC_LOCATION_SEARCH_PROVIDER=nominatim`. Public Nominatim always uses explicit Search/Enter. An operator-controlled Nominatim-compatible service can opt into autocomplete with `NEXT_PUBLIC_NOMINATIM_URL` and `NEXT_PUBLIC_LOCATION_AUTOCOMPLETE=true`; only do this where permitted by its operator. The Nominatim URL also controls reverse lookup. Custom endpoints must permit browser CORS. Restart/rebuild after changing these variables.

Provider behavior is isolated in `src/services/locationService.ts`.

Recent locations are session-only, limited to 5; no precise location persistence. Searches and selected coordinates are sent to the configured geocoder; map tiles go to OpenStreetMap. Attribution is visible in search and maps.

## Verification

- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- Run the app at localhost:3000, then `node tests/location-flows.mjs` (installed Microsoft Edge required). Uses mocked geocoder/GPS/tile failures, avoiding public test traffic. Checks widths 320, 360, 375, 390, 393, 412, 430, 768, 1280; search parameters/caching, empty/error responses, GPS success/denied/unavailable/timeout, map interactions, selection, markers, navigation, swapping, clearing, and focus restoration.

Real-device Safari, physical GPS accuracy, live search relevance and actual tile availability require manual verification. Open both selectors, search or select a map point, deny/allow GPS, pan/zoom, confirm, swap, clear/reset, then inspect the prepared enquiry. Do not send the enquiry during QA.
