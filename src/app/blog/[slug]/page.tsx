import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/shared/PageShell";
import { travelGuides } from "@/data/travelGuides";
import { pageMetadata } from "@/lib/seo";
export const dynamicParams = false;
export function generateStaticParams() { return travelGuides.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const guide = travelGuides.find(item => item.slug === slug); if (!guide) notFound(); return pageMetadata(guide.title, guide.description, "/blog/" + slug + "/"); }
export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const guide = travelGuides.find(item => item.slug === slug); if (!guide) notFound(); return <PageShell><section className="subpage-hero"><div className="shell"><nav className="seo-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/blog/">Guides</Link></nav><h1>{guide.title}</h1><p>{guide.description}</p></div></section><article className="section shell seo-article">{guide.sections.map(section => <section key={section.heading}><h2>{section.heading}</h2><p>{section.text}</p></section>)}<div className="seo-actions"><Link className="button button--lime" href={guide.servicePath}>{guide.serviceLabel}</Link><Link href="/blog/">All guides</Link></div></article></PageShell>; }
