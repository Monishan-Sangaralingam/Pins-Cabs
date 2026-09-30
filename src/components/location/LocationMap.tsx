"use client";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LocationValue } from "@/services/locationService";

type Props = { center?: LocationValue | null; pickup?: LocationValue | null; destination?: LocationValue | null; onMove?: (latitude: number, longitude: number) => void; onMoving?: () => void };
export default function LocationMap({ center, pickup, destination, onMove, onMoving }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const move = useRef(onMove), moving = useRef(onMoving);
  const [tileError, setTileError] = useState(false);
  useEffect(() => { move.current = onMove; moving.current = onMoving; });
  useEffect(() => {
    if (!container.current) return;
    const map = L.map(container.current, { scrollWheelZoom: false }).setView([center?.latitude ?? 6.0329, center?.longitude ?? 80.2168], 15);
    const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(map);
    tiles.on("tileerror", () => setTileError(true));
    const points: L.LatLngTuple[] = [];
    for (const [value, label] of [[pickup, "P"], [destination, "D"]] as const) {
      if (!value) continue;
      const point: L.LatLngTuple = [value.latitude, value.longitude]; points.push(point);
      L.marker(point, { icon: L.divIcon({ className: "location-marker", html: `<b class="location-marker-${label}">${label}</b>`, iconSize: [32, 40], iconAnchor: [16, 40] }), title: `${label === "P" ? "Pickup" : "Destination"}: ${value.name}` }).addTo(map).bindTooltip(label === "P" ? "Pickup" : "Destination");
    }
    if (!onMove && points.length) map.fitBounds(L.latLngBounds(points), { padding: [45, 45], maxZoom: 15 });
    map.on("movestart", () => moving.current?.());
    map.on("moveend", () => { const point = map.getCenter(); move.current?.(point.lat, point.lng); });
    const observer = new ResizeObserver(() => map.invalidateSize()); observer.observe(container.current);
    return () => { observer.disconnect(); map.remove(); };
  // Recreate only when the selected coordinates change, not callback identities.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center?.latitude, center?.longitude, pickup?.latitude, pickup?.longitude, destination?.latitude, destination?.longitude, Boolean(onMove)]);
  return <div className="location-map-wrap"><div ref={container} className="location-map" aria-label={onMove ? "Move map with arrow keys or drag to adjust location" : "Pickup and destination map"}/>{onMove && <div className="location-center-pin" aria-hidden="true">📍</div>}{tileError && <p className="location-tile-error" role="status">Map tiles could not load. Search for a location or try again later.</p>}</div>;
}
