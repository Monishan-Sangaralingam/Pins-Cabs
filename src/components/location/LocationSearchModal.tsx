"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { ArrowLeft, LocateFixed, Map, MapPin, Search } from "lucide-react";
import { autocompleteEnabled, coordinateLocation, getCurrentLocation, getRecentLocations, rememberLocation, reverseGeocode, searchLocations, type LocationValue } from "@/services/locationService";
const LocationMap = dynamic(() => import("./LocationMap"), { ssr: false, loading: () => <div className="location-map-loading">Loading map…</div> });

type Props = { kind: "pickup" | "destination"; value: LocationValue | null; onSelect: (location: LocationValue) => void; onClose: () => void };
export default function LocationSearchModal({ kind, value, onSelect, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const operation = useRef<AbortController | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationValue[] | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [mapOpen, setMapOpen] = useState(false);
  const [anchor, setAnchor] = useState<LocationValue | null>(value);
  const [selected, setSelected] = useState<LocationValue | null>(value);
  const [busy, setBusy] = useState(false);
  const [recents] = useState(getRecentLocations);
  const title = kind === "pickup" ? "Select pickup location" : "Select destination";
  const cancel = useCallback(() => {
    operation.current?.abort();
    if (timer.current) clearTimeout(timer.current);
  }, []);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.showModal();
    return () => { cancel(); document.body.style.overflow = overflow; previous?.focus(); };
  }, [cancel]);
  function choose(location: LocationValue) { rememberLocation(location); onSelect(location); onClose(); }
  const search = useCallback(async (text: string) => {
    cancel();
    if (text.trim().length < 3) return;
    const controller = new AbortController(); operation.current = controller;
    setBusy(true); setError(""); setStatus("Searching locations…"); setResults(null);
    try {
      const matches = await searchLocations(text, controller.signal);
      if (!controller.signal.aborted) { setResults(matches); setStatus(matches.length ? `${matches.length} locations found` : "No locations found. Try another name or choose on the map."); }
    } catch { if (!controller.signal.aborted) { setError("We couldn't search locations right now. Try again or choose on the map."); setStatus(""); } }
    finally { if (!controller.signal.aborted) setBusy(false); }
  }, [cancel]);
  function changeQuery(text: string) {
    cancel(); setQuery(text); setResults(null); setError(""); setStatus(""); setBusy(false);
    if (autocompleteEnabled && text.trim().length >= 3) timer.current = setTimeout(() => void search(text), 500);
  }
  const resolvePoint = useCallback((latitude: number, longitude: number, source: "map" | "gps") => {
    cancel();
    const controller = new AbortController(); operation.current = controller;
    const fallback = coordinateLocation(latitude, longitude, source);
    setSelected(fallback); setBusy(true); setError(""); setStatus("Finding address…");
    timer.current = setTimeout(async () => {
      try {
        const location = await reverseGeocode(latitude, longitude, source, controller.signal);
        if (!controller.signal.aborted) { setSelected(location); setStatus(source === "gps" ? "Location detected. Confirm the pin below." : "Location ready to confirm."); }
      } catch {
        if (!controller.signal.aborted) { setStatus(""); setError("We couldn't find an address. You can still confirm these exact coordinates."); }
      } finally { if (!controller.signal.aborted) setBusy(false); }
    }, 500);
  }, [cancel]);
  async function locate() {
    cancel(); const controller = new AbortController(); operation.current = controller;
    setBusy(true); setError(""); setStatus("Getting your location…");
    try {
      const position = await getCurrentLocation();
      if (controller.signal.aborted) return;
      const location = coordinateLocation(position.coords.latitude, position.coords.longitude, "gps");
      setAnchor(location); setMapOpen(true); resolvePoint(location.latitude, location.longitude, "gps");
    } catch (cause) { if (!controller.signal.aborted) { setError((cause as Error).message); setStatus(""); setBusy(false); } }
  }
  function openMap() {
    const point = value || coordinateLocation(6.0329, 80.2168, "map");
    setAnchor(point); setMapOpen(true); resolvePoint(point.latitude, point.longitude, "map");
  }
  return createPortal(<dialog ref={dialog} className="location-dialog" aria-labelledby="location-title" onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="location-panel" data-lenis-prevent>
      <header><button type="button" className="location-icon-button" aria-label={mapOpen ? "Back to location search" : "Close location selection"} onClick={() => { if (mapOpen) { cancel(); setMapOpen(false); setBusy(false); setStatus(""); setError(""); } else onClose(); }}><ArrowLeft size={22}/></button><h2 id="location-title">{title}</h2></header>
      {!mapOpen ? <>
        <form className="location-search" onSubmit={(event) => { event.preventDefault(); event.stopPropagation(); void search(query); }}><label className="sr-only" htmlFor="location-query">Search {kind} location</label><Search size={19}/><input id="location-query" autoFocus autoComplete="off" value={query} onChange={(event) => changeQuery(event.target.value)} placeholder={`Search ${kind} location…`}/><button type="submit" disabled={query.trim().length < 3 || busy}>Search</button></form>
        <div className="location-actions"><button type="button" onClick={locate} disabled={busy}><LocateFixed size={20}/>Use my current location</button><button type="button" onClick={openMap}><Map size={20}/>Choose on map</button></div>
        <div className="location-results" aria-busy={busy}>
          {!query && recents.length > 0 && <h3>Recent locations</h3>}
          {(results || (!query ? recents : [])).map((location) => <button type="button" className="location-result" key={`${location.latitude},${location.longitude}`} onClick={() => { cancel(); setAnchor(location); setSelected(location); setMapOpen(true); setBusy(false); setStatus("Location found. Confirm below or move the pin to adjust."); }}><MapPin size={21}/><span><b>{location.name}</b><small>{location.address}</small></span></button>)}
          {!results && !busy && <p className="location-hint">Search Sri Lanka by place or address. Enter at least 3 characters{autocompleteEnabled ? "." : " and press Search."}</p>}
        </div>
      </> : <>
        <p className="location-hint">Move the map to adjust the pin. Arrow keys also move the map.</p>
        <LocationMap center={anchor} onMoving={() => { cancel(); setBusy(true); setStatus("Move the map to adjust location…"); }} onMove={(lat, lon) => resolvePoint(lat, lon, "map")}/>
        <div className="location-selected"><small>Selected location</small><strong>{selected?.name || "Choose a point"}</strong><p>{selected?.address}</p></div>
      </>}
      <div className="location-feedback" aria-live="polite"><p>{status}</p>{error && <p className="location-error">{error}</p>}{error && !mapOpen && query.trim().length >= 3 && <button type="button" onClick={() => void search(query)}>Try again</button>}</div>
      {mapOpen && <button type="button" className="button button--lime location-confirm" disabled={!selected || busy} onClick={() => selected && choose(selected)}>Confirm {kind === "pickup" ? "pickup" : "destination"}</button>}
      <footer>Search and addresses © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a></footer>
    </div>
  </dialog>, document.body);
}

