"use client";

import { useId } from "react";
import { services } from "@/data/content";
import { usePlanner } from "./PlannerProvider";

export function RideTypeSelector() {
  const { state, update } = usePlanner();
  const id = useId();
  return <fieldset className="ride-type-selector">
    <legend>Service</legend>
    <div className="quick-tabs">
      {services.map((service) => {
        const Icon = service.icon;
        return <label key={service.id} className="service-choice">
          <input type="radio" name={`${id}-service`} value={service.id} checked={state.service === service.id} onChange={() => update({ service: service.id })}/>
          <Icon size={18}/><span>{service.name}</span>
        </label>;
      })}
    </div>
  </fieldset>;
}
