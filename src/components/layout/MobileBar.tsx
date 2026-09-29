import Link from "next/link";
import { Phone } from "lucide-react";
import { business } from "@/config/business";

export function MobileBar() {
  return <div className="mobile-bar"><Link className="button button--lime" href="/plan-ride">Plan ride</Link><a className="mobile-call" href={`tel:${business.phoneHref}`} aria-label={`Call PINS Cabs on ${business.phoneDisplay}`}><Phone size={19}/>Call</a></div>;
}
