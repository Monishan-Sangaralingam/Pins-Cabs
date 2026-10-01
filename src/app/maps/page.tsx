import type { Metadata } from "next";
import { business } from "@/config/business";
import { ShortLinkPage } from "@/components/shared/ShortLinkPage";

export const metadata: Metadata = {
  title: "Google Maps | PINS Cabs",
  robots: { index: false, follow: false },
};

export default function MapsShortLinkPage() {
  return <ShortLinkPage label="Google Maps" href={business.mapUrl} />;
}
