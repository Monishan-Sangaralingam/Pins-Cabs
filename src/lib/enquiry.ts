import type { LocationValue } from "@/services/locationService";
import { business } from "@/config/business";

export type PlannerState = {
  service: string;
  tripType: "one-way" | "return";
  pickupLocation: LocationValue | null;
  destinationLocation: LocationValue | null;
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
};

export const initialPlannerState: PlannerState = {
  pickupLocation: null, destinationLocation: null,
  service: "city", tripType: "one-way", pickup: "", destination: "", date: "", time: "", returnDate: "", returnTime: "", passengers: 1, luggage: 0, flight: "", vehicle: "", name: "", phone: "", email: "", notes: "",
};

const serviceNames: Record<string, string> = { airport: "Airport transfer", city: "City ride", outstation: "Outstation trip", wedding: "Wedding & luxury car", staff: "Staff transport", "long-trip": "Long-trip bus hire", custom: "Custom journey" };
const vehicleNames: Record<string, string> = { alto: "Suzuki Alto", aqua: "Toyota Aqua", "suzuki-every": "Suzuki Every", van: "Group Van", "kdh-9": "KDH Van · 9 Seater", "kdh-14": "KDH High Roof · 14 Seater", "bus-29": "29 Seater Bus", "bus-35": "35 Seater Bus", "bus-55": "55 Seater Bus", "wedding-luxury": "Luxury Wedding Car", lorry: "Enclosed Goods Lorry", assisted: "Please recommend a suitable vehicle" };

export function formatEnquiry(data: PlannerState) {
  const lines = [
    "Hello PINS Cabs, I would like to enquire about a ride.",
    `Service: ${serviceNames[data.service] ?? data.service}`,
    `Journey: ${data.tripType === "return" ? "Return" : "One-way"}`,
    `Pickup: ${data.pickup.trim()}`,
    `Destination: ${data.destination.trim()}`,
    `Pickup time: ${data.date} at ${data.time} (${business.timezone})`,
  ];
  for (const [label, location] of [["Pickup", data.pickupLocation], ["Destination", data.destinationLocation]] as const) {
    if (location) lines.push(`${label} coordinates: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)} (https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}#map=17/${location.latitude}/${location.longitude})`);
  }
  if (data.tripType === "return") lines.push(`Return time: ${data.returnDate} at ${data.returnTime} (${business.timezone})`);
  lines.push(`Passengers / luggage: ${data.passengers} / ${data.luggage}`);
  lines.push(`Requested vehicle: ${vehicleNames[data.vehicle] ?? "Please recommend"}`);
  if (data.flight.trim()) lines.push(`Flight number: ${data.flight.trim()}`);
  lines.push(`Name: ${data.name.trim()}`, `Contact: ${data.phone.trim()}`);
  if (data.email.trim()) lines.push(`Email: ${data.email.trim()}`);
  if (data.notes.trim()) lines.push(`Additional requirements: ${data.notes.trim()}`);
  lines.push("Please confirm availability and the final price.");
  return lines.join("\n");
}

export function whatsappUrl(data: PlannerState) {
  return `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(formatEnquiry(data))}`;
}
