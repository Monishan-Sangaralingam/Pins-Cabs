import Link from "next/link";
import { ArrowLeft, CarFront } from "lucide-react";
export default function NotFound() { return <main className="not-found"><CarFront/><span className="eyebrow">404 · Wrong turn</span><h1>This road doesn’t go anywhere.</h1><p>Let’s get you back to the PINS Cabs journey planner.</p><Link className="button button--lime" href="/"><ArrowLeft/>Back home</Link></main>; }
