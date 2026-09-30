"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, Users } from "lucide-react";
import { usePlanner } from "@/components/planner/PlannerProvider";
import { TripTypeSelector } from "@/components/planner/TripTypeSelector";
import { RideTypeSelector } from "@/components/planner/RideTypeSelector";
import { LocationInput, JourneyMap } from "@/components/location/LocationInput";

export function QuickPlanner() {
  const router = useRouter();
  const { state, update } = usePlanner();
  return <><form className="quick-planner" onSubmit={(event) => { event.preventDefault(); router.push("/plan-ride"); }}>
    <RideTypeSelector/>
    <TripTypeSelector/>
    <LocationInput kind="pickup" quick/>
    <LocationInput kind="destination" quick/>
    <label className="quick-field quick-field--date"><span><CalendarDays size={15}/>Date</span><input type="date" value={state.date} onFocus={(event) => { event.currentTarget.min = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Colombo", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()); }} onChange={(e) => update({ date: e.target.value })}/></label>
    <label className="quick-field quick-field--passengers"><span><Users size={15}/>Passengers</span><input type="number" inputMode="numeric" min="1" max="55" step="1" value={state.passengers || ""} placeholder="How many?" onChange={(event) => { const value = event.target.value; update({ passengers: value === "" ? 0 : Math.min(55, Number(value)), vehicle: "" }); }} onBlur={() => { if (!Number.isInteger(state.passengers) || state.passengers < 1) update({ passengers: 1 }); }}/></label>
    <button className="button button--lime" type="submit">Find my ride <ArrowRight size={18}/></button>
  </form><JourneyMap/><p className="quick-planner-note">All rides are confirmed directly after enquiry.</p></>;
}
