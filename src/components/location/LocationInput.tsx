"use client";
import { useId, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, X } from "lucide-react";
import { usePlanner } from "@/components/planner/PlannerProvider";
const LocationSearchModal = dynamic(() => import("./LocationSearchModal"), { ssr: false });
const LocationMap = dynamic(() => import("./LocationMap"), { ssr: false, loading: () => <div className="location-map-loading">Loading map…</div> });
export function LocationInput({ kind, quick = false, error }: { kind: "pickup" | "destination"; quick?: boolean; error?: string }) {
  const { state, update } = usePlanner();
  const [open, setOpen] = useState(false);
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const key = kind === "pickup" ? "pickupLocation" : "destinationLocation";
  const value = state[key];
  const label = kind === "pickup" ? "Pickup location" : "Destination";
  return <div className={`location-field ${quick ? `quick-field quick-field--${kind}` : ""}`}>
    <span className="location-label" id={id}><MapPin size={15}/>{label}</span>
    <div className="location-field-controls"><button type="button" ref={trigger} className="location-field-trigger" aria-labelledby={id} aria-describedby={`${id}-value${error ? ` ${id}-error` : ""}`} data-invalid={Boolean(error)} aria-haspopup="dialog" onClick={() => setOpen(true)}><span id={`${id}-value`}>{value?.address || (kind === "pickup" ? "Current location / Search pickup" : "Where are you going?")}</span></button>{value && <button type="button" className="location-clear" aria-label={`Clear ${label.toLowerCase()}`} onClick={() => update({ [kind]: "", [key]: null })}><X size={17}/></button>}</div>
    {error && <small id={`${id}-error`} className="field-error">{error}</small>}
    {open && <LocationSearchModal kind={kind} value={value} onClose={() => { setOpen(false); requestAnimationFrame(() => trigger.current?.focus()); }} onSelect={(location) => update({ [kind]: location.address, [key]: location })}/>}
  </div>;
}
export function JourneyMap() {
  const { state } = usePlanner();
  const [open, setOpen] = useState(false);
  if (!state.pickupLocation || !state.destinationLocation) return null;
  return <div className="journey-map"><button type="button" className="text-button" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? "Hide" : "Show"} pickup & destination map</button>{open && <><p>P · Pickup &nbsp; D · Destination</p><LocationMap pickup={state.pickupLocation} destination={state.destinationLocation}/></>}</div>;
}
