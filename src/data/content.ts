import { BriefcaseBusiness, BusFront, CarFront, Gem, Building2, Map, Plane, type LucideIcon } from "lucide-react";

export type Service = {
  id: string;
  name: string;
  kicker: string;
  description: string;
  icon: LucideIcon;
  image: string;
  imageAlt: string;
};

export const services: Service[] = [
  { id: "airport", name: "Airport transfers", kicker: "Arrivals & departures", description: "Share your flight and pickup details, then confirm timing directly with our team.", icon: Plane, image: "/media/fleet/sedan.webp", imageAlt: "Illustrative white sedan" },
  { id: "city", name: "City rides", kicker: "Simple local journeys", description: "Plan pickups, drop-offs, passenger needs and luggage in one clear enquiry.", icon: Building2, image: "/media/fleet/suv.webp", imageAlt: "Illustrative white SUV" },
  { id: "outstation", name: "Outstation trips", kicker: "Beyond the city", description: "Tell us where you are heading and we will confirm coverage, availability and price.", icon: Map, image: "/media/fleet/kdh-9.webp", imageAlt: "Illustrative nine-seat KDH-style van" },
  { id: "wedding", name: "Wedding & luxury cars", kicker: "A special arrival", description: "Request an elegant wedding car or luxury vehicle and share your ceremony schedule, route and styling needs.", icon: Gem, image: "/media/fleet/wedding-luxury.webp", imageAlt: "Illustrative white luxury wedding sedan" },
  { id: "staff", name: "Staff transport", kicker: "Reliable work journeys", description: "Prepare an enquiry for regular employee pickups, shift transport or one-off workplace travel.", icon: BriefcaseBusiness, image: "/media/fleet/kdh-14.webp", imageAlt: "Illustrative fourteen-seat KDH-style van" },
  { id: "long-trip", name: "Long-trip bus hire", kicker: "Groups going further", description: "Plan long-distance group travel with AC or non-AC bus options, subject to route and vehicle confirmation.", icon: BusFront, image: "/media/fleet/ac-bus.webp", imageAlt: "Illustrative air-conditioned private coach" },
  { id: "custom", name: "Custom journeys", kicker: "Made around your plans", description: "Need a return or multi-purpose ride? Add the details and let us help match a vehicle.", icon: CarFront, image: "/media/fleet/van.webp", imageAlt: "Illustrative white passenger van" },
];

export type Vehicle = {
  id: string;
  name: string;
  type: string;
  passengers: number;
  luggage: number;
  image: string;
  suitability: string;
  features: string[];
};

export const vehicles: Vehicle[] = [
  { id: "sedan", name: "Comfort Sedan", type: "Sedan", passengers: 3, luggage: 2, image: "/media/fleet/sedan.webp", suitability: "Solo travellers, couples and light city travel.", features: ["Up to 3 guests", "Light luggage", "Air-conditioned"] },
  { id: "suv", name: "Flexible SUV", type: "SUV", passengers: 4, luggage: 3, image: "/media/fleet/suv.webp", suitability: "Families and journeys with a little more luggage.", features: ["Up to 4 guests", "Flexible storage", "Air-conditioned"] },
  { id: "van", name: "Group Van", type: "Van", passengers: 7, luggage: 5, image: "/media/fleet/van.webp", suitability: "Small groups and airport journeys with more bags.", features: ["Up to 7 guests", "Group luggage", "Air-conditioned"] },
  { id: "kdh-9", name: "KDH Van · 9 Seater", type: "KDH Van", passengers: 9, luggage: 6, image: "/media/fleet/kdh-9.webp", suitability: "Family tours, airport transfers and compact group travel.", features: ["Up to 9 guests", "Luggage space", "Air-conditioned"] },
  { id: "kdh-14", name: "KDH High Roof · 14 Seater", type: "KDH Van", passengers: 14, luggage: 10, image: "/media/fleet/kdh-14.webp", suitability: "Larger families, work teams and multi-day group journeys.", features: ["Up to 14 guests", "High-roof cabin", "Air-conditioned"] },
  { id: "ac-bus", name: "AC Coach Bus", type: "Bus", passengers: 29, luggage: 20, image: "/media/fleet/ac-bus.webp", suitability: "Long-distance tours, staff outings and comfortable group events.", features: ["Approx. 29 seats", "Group luggage", "Air-conditioned"] },
  { id: "non-ac-bus", name: "Non-AC Bus", type: "Bus", passengers: 40, luggage: 10, image: "/media/fleet/non-ac-bus.webp", suitability: "Economical staff transport, events and larger local groups.", features: ["Approx. 40 seats", "Opening windows", "Value group travel"] },
  { id: "wedding-luxury", name: "Luxury Wedding Car", type: "Wedding Car", passengers: 3, luggage: 1, image: "/media/fleet/wedding-luxury.webp", suitability: "Wedding arrivals, couple transport and special occasions.", features: ["Luxury class", "Wedding enquiries", "Schedule coordination"] },
];

export const locations = ["PINS Cabs, Wattala", "Bandaranaike International Airport", "Colombo Fort", "Negombo", "Wattala", "Kandy", "Galle"];

export const faqs = [
  ["How do I request a ride?", "Add your journey, choose a preferred vehicle class, and send the prepared enquiry by WhatsApp or copy it to contact us another way."],
  ["When is my booking confirmed?", "Opening WhatsApp or sending an enquiry is not a booking confirmation. PINS Cabs will confirm availability and the final price with you directly."],
  ["How do I choose a vehicle?", "Use the passenger and luggage guidance as a starting point. These classes are illustrative until the business confirms its exact fleet; we will help if you are unsure."],
  ["Can I request a custom destination?", "Yes. Pickup and destination fields accept free text. Coverage is confirmed after the enquiry."],
  ["How is pricing confirmed?", "There is no automated fare estimate on this site. PINS Cabs confirms the final price after reviewing your journey details."],
] as const;
