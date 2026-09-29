"use client";

import { useId } from "react";
import { ArrowRight, ArrowLeftRight } from "lucide-react";
import { usePlanner } from "./PlannerProvider";

export function TripTypeSelector() {
  const { state, update } = usePlanner();
  const id = useId();
  return <fieldset className="trip-type-selector">
    <legend>Journey type</legend>
    <div className="trip-type-options">
      <label><input type="radio" name={`${id}-journey`} checked={state.tripType === "one-way"} onChange={() => update({ tripType: "one-way" })}/><ArrowRight size={16}/>One-way</label>
      <label><input type="radio" name={`${id}-journey`} checked={state.tripType === "return"} onChange={() => update({ tripType: "return" })}/><ArrowLeftRight size={16}/>Return trip</label>
    </div>
  </fieldset>;
}
