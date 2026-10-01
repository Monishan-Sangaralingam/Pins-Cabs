import type { Metadata } from "next";
import { business } from "@/config/business";
import { ShortLinkPage } from "@/components/shared/ShortLinkPage";

const whatsapp = business.socialLinks.find((link) => link.label === "WhatsApp")!;

export const metadata: Metadata = {
  title: "WhatsApp | PINS Cabs",
  robots: { index: false, follow: false },
};

export default function WhatsAppShortLinkPage() {
  return <ShortLinkPage label={whatsapp.label} href={whatsapp.href} />;
}
