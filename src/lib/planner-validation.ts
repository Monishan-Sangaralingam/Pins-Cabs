import { business } from "@/config/business";
import { vehicles } from "@/data/content";
import type { PlannerState } from "./enquiry";

export function sriLankaNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: business.timezone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now);
  return Object.fromEntries(parts.map((p) => [p.type, p.value]));
}

export function validatePlannerStep(step: number, data: PlannerState, timestamp = new Date()) {
  const errors: Record<string,string> = {};
  if (step === 0) {
    if (!data.pickup.trim()) errors.pickup = "Enter a pickup location.";
    if (!data.destination.trim()) errors.destination = "Enter a destination.";
    if (data.pickup.trim().toLowerCase() === data.destination.trim().toLowerCase() && data.pickup.trim()) errors.destination = "Pickup and destination must be different.";
    if (!data.date) errors.date = "Choose a pickup date.";
    if (!data.time) errors.time = "Choose a pickup time.";
    if (!Number.isInteger(data.passengers) || data.passengers < 1 || data.passengers > 50) errors.passengers = "Enter between 1 and 50 passengers.";
    if (data.date && data.time) {
      const now = sriLankaNow(timestamp); const current = `${now.year}-${now.month}-${now.day}T${now.hour}:${now.minute}`;
      if (`${data.date}T${data.time}` <= current) errors.date = "Pickup time must be in the future (Sri Lanka time).";
    }
    if (data.tripType === "return") {
      if (!data.returnDate) errors.returnDate = "Add the return date.";
      if (!data.returnTime) errors.returnTime = "Add the return time.";
      if (data.returnDate && data.returnTime && `${data.returnDate}T${data.returnTime}` <= `${data.date}T${data.time}`) errors.returnDate = "Return must be after pickup.";
    }
  }
  if (step === 1 && data.vehicle !== "assisted" && !vehicles.some((vehicle) => vehicle.id === data.vehicle && vehicle.passengers >= data.passengers)) errors.vehicle = "Choose a class suitable for your passenger count, or ask us to recommend one.";
  if (step === 2) {
    if (!data.name.trim()) errors.name = "Enter your name.";
    if (!/^\+?[0-9 ()-]+$/.test(data.phone.trim()) || !/^[0-9]{7,15}$/.test(data.phone.replace(/\D/g, ""))) errors.phone = "Enter a valid phone number with country code if outside Sri Lanka.";
    if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) errors.email = "Enter a valid email or leave it blank.";
  }
  return errors;
}

