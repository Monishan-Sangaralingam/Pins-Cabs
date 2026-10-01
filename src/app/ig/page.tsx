import type { Metadata } from "next";
import { business } from "@/config/business";
import { ShortLinkPage } from "@/components/shared/ShortLinkPage";

const instagram = business.socialLinks.find((link) => link.label === "Instagram")!;

export const metadata: Metadata = {
  title: "Instagram | PINS Cabs",
  robots: { index: false, follow: false },
};

export default function InstagramShortLinkPage() {
  return <ShortLinkPage label={instagram.label} href={instagram.href} />;
}
