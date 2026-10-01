import type { Metadata } from "next";
import { business } from "@/config/business";
import { ShortLinkPage } from "@/components/shared/ShortLinkPage";

const facebook = business.socialLinks.find((link) => link.label === "Facebook")!;

export const metadata: Metadata = {
  title: "Facebook | PINS Cabs",
  robots: { index: false, follow: false },
};

export default function FacebookShortLinkPage() {
  return <ShortLinkPage label={facebook.label} href={facebook.href} />;
}
