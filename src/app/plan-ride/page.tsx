import type { Metadata } from "next";
import { PageShell } from "@/components/shared/PageShell";
import { PlanRideWizard } from "@/components/planner/PlanRideWizard";
export const metadata: Metadata = { title: "Plan a ride", description: "Prepare a clear PINS Cabs ride enquiry in four simple steps." };
export default function PlanRidePage() { return <PageShell><div className="subpage-hero compact"><div className="shell"><span className="eyebrow">Ride enquiry</span><p>Availability and price confirmed by our team.</p></div></div><PlanRideWizard/></PageShell>; }
