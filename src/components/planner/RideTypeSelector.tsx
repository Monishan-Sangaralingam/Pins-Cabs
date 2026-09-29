"use client";

import { useEffect, useRef } from "react";
import { services } from "@/data/content";
import { usePlanner } from "./PlannerProvider";

const rideServices = services;
const shortNames: Record<string, string> = {
  city: "City ride", outstation: "Outstation trips", airport: "Airport transfer", wedding: "Wedding & luxury",
  staff: "Staff transport", "long-trip": "Bus hire", lorry: "Lorry transport", custom: "Custom journey",
};

export function RideTypeSelector() {
  const { state, update } = usePlanner();
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    const selected = row?.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
    if (!row || !selected) return;
    const bounds = row.getBoundingClientRect();
    const button = selected.getBoundingClientRect();
    // Reveal the current selection without scrolling the page itself.
    if (button.left < bounds.left) row.scrollLeft += button.left - bounds.left;
    else if (button.right > bounds.right) row.scrollLeft += button.right - bounds.right;
  }, [state.service]);

  return <div ref={rowRef} className="quick-tabs" role="group" aria-label="Ride type">
    {rideServices.map((service) => {
      const Icon = service.icon;
      return <button key={service.id} type="button" aria-pressed={state.service === service.id}
        className={state.service === service.id ? "active" : ""}
        onClick={() => update({ service: service.id })}>
        <Icon size={20}/>{shortNames[service.id]}
      </button>;
    })}
  </div>;
}
