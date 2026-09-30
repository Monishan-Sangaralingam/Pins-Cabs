import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/shared/PageShell";
import { landingPages } from "@/data/landingPages";
import { vehicles } from "@/data/content";
import { business } from "@/config/business";
import { pageMetadata, siteOrigin } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() { return landingPages.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = landingPages.find(page => page.slug === slug);
  if (!page) notFound();
  return pageMetadata(page.title, page.description, page.slug);
}
export default async function ServiceLanding({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = landingPages.find(page => page.slug === slug);
  if (!page) notFound();
  const fleet = vehicles.filter(vehicle => page.vehicleIds.includes(vehicle.id));
  const booking = "/plan-ride?service=" + page.service;
  const schema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteOrigin + "/" },
    { "@type": "ListItem", position: 2, name: "Services", item: siteOrigin + "/services/" },
    { "@type": "ListItem", position: 3, name: page.title, item: siteOrigin + "/" + slug + "/" },
  ] };
  return <PageShell>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\u003c") }}/>
    <section className="subpage-hero"><div className="shell"><nav className="seo-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/services/">Services</Link></nav><span className="eyebrow">PINS Cabs · Plan your journey</span><h1>{page.title}</h1><p>{page.intro}</p><div className="seo-actions"><Link className="button button--lime" href={booking}>Plan this journey</Link><a className="button button--outline" href={"tel:" + business.phoneHref}>Call {business.phoneDisplay}</a></div></div></section>
    <section className="section shell seo-content"><div>{page.sections.map(section => <article key={section.heading}><h2>{section.heading}</h2><p>{section.text}</p></article>)}</div><aside className="seo-checklist"><h2>Include in your enquiry</h2><ul>{page.checklist.map(item => <li key={item}>{item}</li>)}</ul><p>Send your prepared message on WhatsApp. Availability, the vehicle and the final price are confirmed directly before booking.</p><Link href={booking}>Start your enquiry →</Link></aside></section>
    <section className="section shell"><div className="section-heading"><div><span className="eyebrow">Vehicle guidance</span><h2>Options to discuss</h2></div><p>Images illustrate vehicle classes. Confirm the exact vehicle, capacity and luggage or load fit with PINS Cabs.</p></div><div className="seo-fleet">{fleet.map(vehicle => <article key={vehicle.id}><Image src={vehicle.image} alt={"Illustrative " + vehicle.name} width={1200} height={900} sizes="(max-width: 700px) 90vw, 30vw"/><h3>{vehicle.name}</h3><p>{vehicle.suitability}</p><ul>{vehicle.features.map(feature => <li key={feature}>{feature}</li>)}</ul></article>)}</div><p><Link href="/vehicles/">Compare vehicle classes →</Link></p></section>
    <section className="section shell faq-section"><div><span className="eyebrow">Before booking</span><h2>Your questions</h2></div><div className="faq-list">{page.faqs.map(([question, answer]) => <details key={question}><summary><span>{question}</span><i>+</i></summary><p>{answer}</p></details>)}</div></section>
    <section className="section shell"><h2>Explore other journeys</h2><nav className="seo-links" aria-label="Related services">{landingPages.filter(item => item.slug !== slug).map(item => <Link key={item.slug} href={"/" + item.slug + "/"}>{item.title}</Link>)}</nav><p><Link href="/blog/">Read our journey planning guides</Link> · <Link href="/about/">About PINS Cabs</Link></p></section>
    <section className="closing mini"><div className="shell"><h2>Share your travel plans.</h2><p>Tell us your date, route and requirements.</p><Link className="button button--lime" href={booking}>Plan your ride</Link></div></section>
  </PageShell>;
}
