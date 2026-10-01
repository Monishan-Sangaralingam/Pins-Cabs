import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./coastal-theme.css";
import "./location.css";
import "./cinematic.css";
import { PlannerProvider } from "@/components/planner/PlannerProvider";
import { siteOrigin } from "@/lib/seo";
import { Analytics } from "@/components/Analytics";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

const sharingImage = {
  url: "/media/social/pins-cabs-share-v2.jpg",
  width: 1200,
  height: 630,
  alt: "PINS Cabs — Ride smarter. Arrive better. Coastal rides at sunset.",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined },
  title: { default: "PINS Cabs | Plan your journey", template: "%s | PINS Cabs" },
  description: "Plan a ride with PINS Cabs in Wattala. Choose a journey and vehicle class, then send a clear enquiry by WhatsApp.",
  openGraph: { type: "website", siteName: "PINS Cabs", title: "PINS Cabs", description: "Your next journey, made simple.", images: [sharingImage] },
  twitter: { card: "summary_large_image", title: "PINS Cabs", description: "Your next journey, made simple.", images: [sharingImage] },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/media/brand/favicon-32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/media/brand/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#101412",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col"><PlannerProvider>{children}</PlannerProvider><Analytics /><VercelAnalytics /></body>
    </html>
  );
}
