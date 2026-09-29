"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Users } from "lucide-react";
import { vehicles } from "@/data/content";
import { usePlanner } from "@/components/planner/PlannerProvider";

export function VehicleCards({ limit }: { limit?: number }) {
  const { state, update } = usePlanner();
  const shown = typeof limit === "number" ? vehicles.slice(0, limit) : vehicles;
  return <div className="vehicle-grid">{shown.map((vehicle) => {
    const selected = state.vehicle === vehicle.id;
    return <article className={`vehicle-card ${selected ? "is-selected" : ""}`} key={vehicle.id}>
      <div className="vehicle-image"><span className="sample-badge">Illustrative class</span><Image src={vehicle.image} alt={`Illustrative ${vehicle.type.toLowerCase()} class`} width={1200} height={900} sizes="(max-width: 760px) 92vw, 33vw" /></div>
      <div className="vehicle-copy"><div><span className="eyebrow">{vehicle.type}</span><h3>{vehicle.name}</h3><p>{vehicle.suitability}</p></div>
        <div className="vehicle-meta"><span><Users size={17}/>{vehicle.type === "Lorry" ? "Driver + 1 passenger" : `${vehicle.passengers} guests`}</span></div>
        <ul>{vehicle.features.map((feature) => <li key={feature}><Check size={15}/>{feature}</li>)}</ul>
        <Link className={`button ${selected ? "button--selected" : "button--outline"}`} href={`/plan-ride?vehicle=${vehicle.id}`} onClick={() => update({ vehicle: vehicle.id })}>{selected ? "Selected" : "Choose this class"}<ArrowUpRight size={17}/></Link>
      </div>
    </article>;
  })}</div>;
}
