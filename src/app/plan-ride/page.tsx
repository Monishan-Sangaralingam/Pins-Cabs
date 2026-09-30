import { pageMetadata } from "@/lib/seo";
import { PageShell } from "@/components/shared/PageShell";
import { PlanRideWizard } from "@/components/planner/PlanRideWizard";
export const metadata = pageMetadata("Plan a Ride Enquiry", "Prepare your PINS Cabs enquiry with pickup, destination, passengers, vehicle and contact details.", "/plan-ride/");
export default function PlanRidePage() { return <PageShell><div className="subpage-hero compact"><div className="shell"><span className="eyebrow">Ride enquiry</span><p>Availability and final pricing are confirmed directly by PINS Cabs.</p></div></div><PlanRideWizard/></PageShell>; }
