import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PageShell } from "@/components/shared/PageShell";
import { services } from "@/data/content";
export const metadata: Metadata = { title: "Services", description: "Explore PINS Cabs ride enquiry types." };
export default function ServicesPage() { return <PageShell><section className="subpage-hero"><div className="shell"><span className="eyebrow">Ride types</span><h1>One contact.<br/><em>Many ways to go.</em></h1><p>Every trip begins as an enquiry—from wedding arrivals and daily staff routes to long-distance group buses. We’ll confirm the suitable vehicle, availability and final price.</p></div></section><section className="section shell"><div className="service-list">{services.map((service, index) => { const Icon=service.icon; return <article key={service.id}><span className="service-number">0{index+1}</span><div className="service-list-image"><Image src={service.image} alt={service.imageAlt} width={1200} height={900}/><Icon/></div><div><span className="eyebrow">{service.kicker}</span><h2>{service.name}</h2><p>{service.description}</p><ul><li><Check/>Free-text pickup and destination</li><li><Check/>Vehicle preference in one enquiry</li><li><Check/>Direct availability and price confirmation</li></ul></div><Link className="button button--outline" href={`/plan-ride?service=${service.id}`}>Plan this trip <ArrowRight/></Link></article>; })}</div></section></PageShell>; }
