import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/shared/PageShell";
import { VehicleCards } from "@/components/vehicles/VehicleCards";
export const metadata = pageMetadata("Cars, KDH Vans & Bus Hire in Sri Lanka", "Compare PINS Cabs vehicle classes by passenger count and service, including Wagon R, KDH vans, buses and goods lorries.", "/vehicles/");
export default function VehiclesPage() { return <PageShell><section className="subpage-hero"><div className="shell"><span className="eyebrow">Our vehicles</span><h1>Room for the journey.<br/><em>And everyone in it.</em></h1><p>Choose your journey type and passenger count to see suitable cars, vans, buses or goods lorries, including the KAMA mini truck. PINS Cabs confirms the exact vehicle and luggage fit before booking.</p></div></section><section className="section shell"><h2>Compare available vehicle classes</h2><VehicleCards/></section><section className="closing mini"><div className="shell"><h2>Not sure what fits?</h2><p>Choose “Request a suitable vehicle” in the planner and tell us your passenger, luggage, comfort and route needs.</p><Link className="button button--lime" href="/plan-ride">Plan your ride <ArrowRight/></Link></div></section></PageShell>; }
