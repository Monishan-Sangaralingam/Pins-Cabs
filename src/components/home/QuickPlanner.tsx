"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, MapPin, Users } from "lucide-react";
import { usePlanner } from "@/components/planner/PlannerProvider";
import { locations, services } from "@/data/content";

export function QuickPlanner() {
  const router = useRouter();
  const { state, update } = usePlanner();
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Colombo", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  return <form className="quick-planner" onSubmit={(event) => { event.preventDefault(); router.push("/plan-ride"); }}>
    <div className="planner-title"><span>Quick trip planner</span><small>Availability & price confirmed after enquiry</small></div>
    <label><span>Ride type</span><select value={state.service} onChange={(e) => update({ service: e.target.value })}>{services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}</select></label>
    <label><span><MapPin size={15}/>Pickup</span><input list="quick-locations" placeholder="Where from?" value={state.pickup} onChange={(e) => update({ pickup: e.target.value })}/></label>
    <label><span><MapPin size={15}/>Destination</span><input list="quick-locations" placeholder="Where to?" value={state.destination} onChange={(e) => update({ destination: e.target.value })}/></label>
    <datalist id="quick-locations">{locations.map((location) => <option key={location} value={location}/>)}</datalist>
    <label><span><CalendarDays size={15}/>Date</span><input type="date" min={today} value={state.date} onChange={(e) => update({ date: e.target.value })}/></label>
    <label><span><Users size={15}/>Guests</span><select value={state.passengers} onChange={(e) => update({ passengers: Number(e.target.value), vehicle: "" })}>{[1,2,3,4,5,6,7,8,9,10,12,14,20,29,40].map((n) => <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>)}</select></label>
    <button className="button button--dark" type="submit">Continue <ArrowRight size={18}/></button>
  </form>;
}
