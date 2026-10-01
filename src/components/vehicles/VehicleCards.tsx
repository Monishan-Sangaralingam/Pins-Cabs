"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Users } from "lucide-react";
import { services } from "@/data/content";
import { suggestVehicles, suggestionReason } from "@/lib/vehicleSuggestions";
import { usePlanner } from "@/components/planner/PlannerProvider";

export function VehicleCards({ limit }: { limit?: number }) {
  const { state, update } = usePlanner();
  const eligible = suggestVehicles(state);
  const shown = typeof limit === "number" ? eligible.slice(0, limit) : eligible;
  return <><div className="fleet-filters">
    <div className="form-grid"><label><span>Journey type</span><select value={state.service} onChange={event => update({ service: event.target.value })}>{services.map(service => <option key={service.id} value={service.id}>{service.name}</option>)}</select></label>
    <label><span>Passengers (excluding driver)</span><input type="number" min="1" max="55" step="1" value={state.passengers || ""} onChange={event => update({ passengers: Number(event.target.value) })}/></label></div>
    <p role="status">{suggestionReason(state)}</p>
    {shown.length === 0 && <p>No listed vehicle fits these requirements. <Link href="/plan-ride" onClick={() => update({ vehicle: "assisted" })}>Request a suitable vehicle</Link>.</p>}
  </div><div className="vehicle-grid">{shown.map((vehicle) => {
    const selected = state.vehicle === vehicle.id;
    return <article className={`vehicle-card ${selected ? "is-selected" : ""}`} key={vehicle.id}>
      <div className="vehicle-image"><span className="sample-badge">Illustrative class</span><Image src={vehicle.image} alt={`Illustrative ${vehicle.name} vehicle class`} width={1200} height={900} sizes="(max-width: 760px) 92vw, 33vw" /></div>
      <div className="vehicle-copy"><div><span className="eyebrow">{vehicle.type}</span><h3>{vehicle.name}</h3><p>{vehicle.suitability}</p></div>
        <div className="vehicle-meta"><span><Users size={17}/>{vehicle.type === "Lorry" ? "Driver + 1 passenger" : `${vehicle.passengers} guests`}</span></div>
        <ul>{vehicle.features.map((feature) => <li key={feature}><Check size={15}/>{feature}</li>)}</ul>
        <Link className={`button ${selected ? "button--selected" : "button--outline"}`} href="/plan-ride" onClick={() => update({ vehicle: vehicle.id })}>{selected ? "Selected" : "Choose this class"}<ArrowUpRight size={17}/></Link>
      </div>
    </article>;
  })}</div></>;
}
