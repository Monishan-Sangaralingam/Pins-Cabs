import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Users } from "lucide-react";
import { vehicles } from "@/data/content";

export function VehicleCards() {
  return <div className="vehicle-grid">{vehicles.map((vehicle) => {
    return <article className="vehicle-card" key={vehicle.id}>
      <div className="vehicle-image"><span className="sample-badge">Illustrative class</span><Image src={vehicle.image} alt={`Illustrative ${vehicle.name} vehicle class`} width={1200} height={900} sizes="(max-width: 760px) 92vw, 33vw" /></div>
      <div className="vehicle-copy"><div><span className="eyebrow">{vehicle.type}</span><h3>{vehicle.name}</h3><p>{vehicle.suitability}</p></div>
        <div className="vehicle-meta"><span><Users size={17}/>{vehicle.type === "Lorry" ? "Driver + 1 passenger" : `${vehicle.passengers} guests`}</span></div>
        <ul>{vehicle.features.map((feature) => <li key={feature}><Check size={15}/>{feature}</li>)}</ul>
        <Link className="button button--outline" href="/plan-ride">Plan your ride<ArrowUpRight size={17}/></Link>
      </div>
    </article>;
  })}</div>;
}
