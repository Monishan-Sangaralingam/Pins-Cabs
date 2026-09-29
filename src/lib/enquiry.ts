import { business } from "@/config/business";
import { services, vehicles } from "@/data/content";

export type PlannerState = {
  service: string;
  tripType: "one-way" | "return";
  pickup: string;
  destination: string;
  date: string;
  time: string;
  returnDate: string;
  returnTime: string;
  passengers: number;
  luggage: number;
  flight: string;
  vehicle: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  requirements: Record<string, string>;
};

export const initialPlannerState: PlannerState = {
  service: "city", tripType: "one-way", pickup: "", destination: "", date: "", time: "", returnDate: "", returnTime: "", passengers: 1, luggage: 0, flight: "", vehicle: "", name: "", phone: "", email: "", notes: "", requirements: {},
};

export const serviceRequirements: Record<string, { label: string; placeholder: string }> = {
  airport: { label: "Airport pickup requirements", placeholder: "Arrivals or departures, terminal, meeting point or assistance needed" },
  staff: { label: "Schedule and recurring travel", placeholder: "Work days, shift times, pickup stops and how often you need transport" },
  wedding: { label: "Wedding timing and special requests", placeholder: "Ceremony and arrival times, waiting time, stops or styling requests" },
  "long-trip": { label: "Group and trip details", placeholder: "Group size, stops, trip duration and any accessibility needs" },
  lorry: { label: "Goods, load size and access", placeholder: "Goods description, approximate dimensions or weight, stairs and loading access" },
};

export function plannerLinkValues(search: string): Partial<PlannerState> {
  const params = new URLSearchParams(search);
  const result: Partial<PlannerState> = {};
  const service = params.get("service");
  const vehicle = params.get("vehicle");
  if (services.some((item) => item.id === service)) result.service = service!;
  if (vehicles.some((item) => item.id === vehicle)) result.vehicle = vehicle!;
  return result;
}

export function formatEnquiry(data: PlannerState) {
  const lines = [
    "Hello PINS Cabs, I would like to enquire about a ride.",
    `Service: ${services.find((item) => item.id === data.service)?.name ?? "Custom journey"}`,
    `Journey: ${data.tripType === "return" ? "Return" : "One-way"}`,
    `Pickup: ${data.pickup.trim()}`,
    `Destination: ${data.destination.trim()}`,
    `Pickup time: ${data.date} at ${data.time} (${business.timezone})`,
  ];
  if (data.tripType === "return") lines.push(`Return time: ${data.returnDate} at ${data.returnTime} (${business.timezone})`);
  lines.push(`Passengers / luggage: ${data.passengers} / ${data.luggage}`);
  lines.push(`Requested vehicle: ${vehicles.find((item) => item.id === data.vehicle)?.name ?? "Please recommend a suitable vehicle"}`);
  if (data.service === "airport" && data.flight.trim()) lines.push(`Flight number: ${data.flight.trim()}`);
  if (data.requirements[data.service]?.trim()) lines.push(`${serviceRequirements[data.service]?.label ?? "Service requirements"}: ${data.requirements[data.service].trim()}`);
  lines.push(`Name: ${data.name.trim()}`, `Contact: ${data.phone.trim()}`);
  if (data.email.trim()) lines.push(`Email: ${data.email.trim()}`);
  if (data.notes.trim()) lines.push(`Additional requirements: ${data.notes.trim()}`);
  lines.push("Please confirm availability and the final price.");
  return lines.join("\n");
}

export function whatsappUrl(data: PlannerState) {
  return `https://wa.me/${business.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(formatEnquiry(data))}`;
}
