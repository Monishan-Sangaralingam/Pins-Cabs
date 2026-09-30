import Link from "next/link";
import { PageShell } from "@/components/shared/PageShell";
import { travelGuides } from "@/data/travelGuides";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Journey Planning Guides", "Practical PINS Cabs guides to airport transfer enquiries, passenger capacity and luggage planning.", "/blog/");
export default function BlogPage() { return <PageShell><section className="subpage-hero"><div className="shell"><span className="eyebrow">PINS Cabs guides</span><h1>A little planning.<br/><em>A clearer journey.</em></h1><p>Practical details to prepare before you request a vehicle.</p></div></section><section className="section shell seo-guide-grid">{travelGuides.map(guide => <article key={guide.slug}><h2><Link href={"/blog/" + guide.slug + "/"}>{guide.title}</Link></h2><p>{guide.description}</p><Link href={"/blog/" + guide.slug + "/"}>Read the guide →</Link></article>)}</section></PageShell>; }
