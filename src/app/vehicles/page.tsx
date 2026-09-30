import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/shared/PageShell";
import { VehicleCards } from "@/components/vehicles/VehicleCards";
export const metadata: Metadata = { title: "Vehicles", description: "Compare illustrative vehicle classes for your PINS Cabs journey." };
export default function VehiclesPage() { return <PageShell><section className="subpage-hero"><div className="shell"><span className="eyebrow">Our vehicles</span><h1>Room for the journey.<br/><em>And everyone in it.</em></h1><p>Choose your journey type and passenger count to see suitable cars, vans, buses or goods lorries, including the KAMA mini truck. PINS Cabs confirms the exact vehicle and luggage fit before booking.</p></div></section><section className="section shell"><VehicleCards/></section><section className="closing mini"><div className="shell"><h2>Not sure what fits?</h2><p>Choose “Request a suitable vehicle” in the planner and tell us your passenger, luggage, comfort and route needs.</p><Link className="button button--lime" href="/plan-ride">Plan your ride <ArrowRight/></Link></div></section></PageShell>; }
