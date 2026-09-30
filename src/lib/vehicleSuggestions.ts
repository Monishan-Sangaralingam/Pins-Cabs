import { vehicles } from "../data/content";
import type { PlannerState } from "./enquiry";

type Requirements = Pick<PlannerState, "service" | "passengers">;

export function suggestVehicles({ service, passengers }: Requirements) {
  if (!Number.isInteger(passengers) || passengers < 1 || passengers > 55) return [];
  const fitting = vehicles.filter(vehicle => vehicle.passengers >= passengers);
  if (service === "lorry") return fitting.filter(vehicle => vehicle.type === "Lorry");
  if (service === "long-trip" || passengers > 14) return fitting.filter(vehicle => vehicle.type === "Bus");
  if (service === "wedding" && passengers <= 3) return fitting.filter(vehicle => vehicle.type === "Wedding Car");
  const types = passengers <= 4 ? ["Compact Car", "Hybrid Car", "Compact Van"] : ["Van", "KDH Van"];
  return fitting.filter(vehicle => types.includes(vehicle.type)).sort((a, b) => a.passengers - b.passengers);
}

export function suggestionReason({ service, passengers }: Requirements) {
  if (service === "lorry") return "Goods vehicles only. One accompanying passenger; describe the load, weight, dimensions and access in your requirements. Payload is confirmed by PINS Cabs.";
  if (service === "long-trip") return "Buses with enough seats for your group, as requested for bus hire.";
  if (passengers > 14) return "Buses with enough seats for your group. Our largest listed van seats 14 guests.";
  if (service === "wedding" && passengers <= 3) return "Wedding cars suited to your party size. For guest transport, increase the passenger count.";
  if (passengers > 4) return "Vans with enough seats for everyone, ordered by capacity.";
  return "Cars and compact vans suited to your party size. Luggage space and the final vehicle are confirmed before booking.";
}

export function reconcileVehicle(state: PlannerState): PlannerState {
  if (state.vehicle && state.vehicle !== "assisted" && !suggestVehicles(state).some(vehicle => vehicle.id === state.vehicle)) return { ...state, vehicle: "" };
  return state;
}
