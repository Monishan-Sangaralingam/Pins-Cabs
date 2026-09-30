export type LocationValue = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  source: "gps" | "search" | "map";
};

type NominatimPlace = { name?: string; display_name: string; lat: string; lon: string };
const endpoint = (process.env.NEXT_PUBLIC_NOMINATIM_URL || "https://nominatim.openstreetmap.org").replace(/\/$/, "");
const photonEndpoint = (process.env.NEXT_PUBLIC_PHOTON_URL || "https://photon.komoot.io").replace(/\/$/, "");
const searchProvider = process.env.NEXT_PUBLIC_LOCATION_SEARCH_PROVIDER || "photon";
// Public Nominatim is never used for typeahead. Photon supports it natively.
export const autocompleteEnabled = searchProvider === "photon"
  ? process.env.NEXT_PUBLIC_LOCATION_AUTOCOMPLETE !== "false"
  : new URL(endpoint).hostname !== "nominatim.openstreetmap.org" && process.env.NEXT_PUBLIC_LOCATION_AUTOCOMPLETE === "true";
type PhotonFeature = {
  geometry: { coordinates: [number, number] };
  properties: { name?: string; street?: string; housenumber?: string; city?: string; district?: string; state?: string; country?: string; countrycode?: string; postcode?: string };
};
const cache = new Map<string, unknown>();
let queue = Promise.resolve();
let lastRequest = 0;

async function request<T>(path: string, params: URLSearchParams, signal?: AbortSignal, base = endpoint): Promise<T> {
  const key = `${base}/${path}?${params}`;
  signal?.throwIfAborted();
  if (cache.has(key)) return cache.get(key) as T;
  const task = queue.then(async () => {
    signal?.throwIfAborted();
    if (cache.has(key)) return cache.get(key) as T;
    await new Promise((resolve) => setTimeout(resolve, Math.max(0, 1100 - (Date.now() - lastRequest))));
    signal?.throwIfAborted();
    lastRequest = Date.now();
    const controller = new AbortController();
    const abort = () => controller.abort();
    signal?.addEventListener("abort", abort, { once: true });
    const timeout = setTimeout(abort, 12000);
    let data: T;
    try {
      const response = await fetch(key, { signal: controller.signal, headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("Location service unavailable. Please try again.");
      data = await response.json() as T;
    } finally {
      clearTimeout(timeout);
      signal?.removeEventListener("abort", abort);
    }
    if (cache.size >= 100) cache.delete(cache.keys().next().value!);
    cache.set(key, data);
    return data;
  });
  queue = task.then(() => undefined, () => undefined);
  return task;
}
function convert(place: NominatimPlace, source: LocationValue["source"]): LocationValue {
  const latitude = Number(place.lat), longitude = Number(place.lon);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || !place.display_name) throw new Error("No address found here.");
  return { name: place.name || place.display_name.split(",")[0], address: place.display_name, latitude, longitude, source };
}
export async function searchLocations(query: string, signal?: AbortSignal) {
  const q = query.trim().replace(/\s+/g, " ").toLowerCase();
  if (q.length < 3) return [];
  if (searchProvider === "photon") {
    const data = await request<{ features: PhotonFeature[] }>("api/", new URLSearchParams({ q, limit: "5", lang: "en", countrycode: "LK", bbox: "79.5,5.8,82,10" }), signal, photonEndpoint);
    return data.features.filter((feature) => feature.properties.countrycode?.toUpperCase() === "LK").flatMap((feature): LocationValue[] => {
      const [longitude, latitude] = feature.geometry.coordinates;
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return [];
      const p = feature.properties;
      const street = [p.housenumber, p.street].filter(Boolean).join(" ");
      const name = p.name || street || p.city || p.district || "Selected location";
      const address = [...new Set([name, street, p.city, p.district, p.state, p.postcode, p.country || "Sri Lanka"].filter(Boolean))].join(", ");
      return [{ name, address, latitude, longitude, source: "search" }];
    }).slice(0, 5);
  }
  const data = await request<NominatimPlace[]>("search", new URLSearchParams({ format: "jsonv2", q, addressdetails: "1", limit: "5", countrycodes: "lk" }), signal);
  return data.map((place) => convert(place, "search"));
}
export async function reverseGeocode(latitude: number, longitude: number, source: "gps" | "map", signal?: AbortSignal): Promise<LocationValue> {
  const place = await request<NominatimPlace>("reverse", new URLSearchParams({ format: "jsonv2", lat: latitude.toFixed(5), lon: longitude.toFixed(5) }), signal);
  // Keep the actual pin/GPS coordinate, not the nearest OSM object's coordinate.
  return { ...convert(place, source), latitude, longitude };
}
export function coordinateLocation(latitude: number, longitude: number, source: "gps" | "map"): LocationValue {
  return { name: source === "gps" ? "Current location" : "Pinned location", address: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`, latitude, longitude, source };
}
export function getCurrentLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("Your browser cannot detect location. Search or choose on the map."));
    navigator.geolocation.getCurrentPosition(resolve, (error) => reject(new Error(
      error.code === 1 ? "Location permission was denied. Search or choose a location on the map." :
      error.code === 3 ? "Location detection took too long. Try again or choose your location manually." :
      "We couldn't detect your current location. Please search or choose a location on the map."
    )), { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 });
  });
}
// Session-only recents: precise locations are not persisted on shared devices.
let recentLocations: LocationValue[] = [];
export function getRecentLocations() { return recentLocations; }
export function rememberLocation(location: LocationValue) {
  recentLocations = [location, ...recentLocations.filter((item) => item.latitude !== location.latitude || item.longitude !== location.longitude)].slice(0, 5);
}
