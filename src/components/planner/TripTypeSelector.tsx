"use client";

import { ArrowRight, ArrowLeftRight } from "lucide-react";
import { usePlanner } from "./PlannerProvider";

export function TripTypeSelector() {
  const { state, update } = usePlanner();

  return <fieldset className="trip-type-selector">
    <legend>Journey type</legend>
    <div className="trip-type-options">
      <button type="button" aria-pressed={state.tripType === "one-way"} onClick={() => update({ tripType: "one-way" })}><ArrowRight size={16}/>One-way</button>
      <button type="button" aria-pressed={state.tripType === "return"} onClick={() => update({ tripType: "return" })}><ArrowLeftRight size={16}/>Return trip</button>
    </div>
  </fieldset>;
}
