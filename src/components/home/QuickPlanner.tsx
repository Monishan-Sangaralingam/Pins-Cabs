"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, MapPin, Users } from "lucide-react";
import { usePlanner } from "@/components/planner/PlannerProvider";
import { TripTypeSelector } from "@/components/planner/TripTypeSelector";
import { RideTypeSelector } from "@/components/planner/RideTypeSelector";
import { locations } from "@/data/content";

export function QuickPlanner() {
  const router = useRouter();
  const { state, update } = usePlanner();
  return <><form className="quick-planner" onSubmit={(event) => { event.preventDefault(); router.push("/plan-ride"); }}>
    <RideTypeSelector/>
    <TripTypeSelector/>
    <label className="quick-field quick-field--pickup"><span><MapPin size={15}/>Pickup</span><input list="quick-locations" placeholder="Where from?" value={state.pickup} onChange={(e) => update({ pickup: e.target.value })}/></label>
    <label className="quick-field quick-field--destination"><span><MapPin size={15}/>Destination</span><input list="quick-locations" placeholder="Where to?" value={state.destination} onChange={(e) => update({ destination: e.target.value })}/></label>
    <datalist id="quick-locations">{locations.map((location) => <option key={location} value={location}/>)}</datalist>
    <label className="quick-field quick-field--date"><span><CalendarDays size={15}/>Date</span><input type="date" value={state.date} onFocus={(event) => { event.currentTarget.min = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Colombo", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()); }} onChange={(e) => update({ date: e.target.value })}/></label>
    <label className="quick-field quick-field--passengers"><span><Users size={15}/>Passengers</span><input type="number" inputMode="numeric" min="1" max="50" step="1" value={state.passengers || ""} placeholder="How many?" onChange={(event) => { const value = event.target.value; update({ passengers: value === "" ? 0 : Math.min(50, Number(value)), vehicle: "" }); }} onBlur={() => { if (!Number.isInteger(state.passengers) || state.passengers < 1) update({ passengers: 1 }); }}/></label>
    <button className="button button--lime" type="submit">Find my ride <ArrowRight size={18}/></button>
  </form><p className="quick-planner-note">All rides are confirmed directly after enquiry.</p></>;
}
