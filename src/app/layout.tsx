import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PlannerProvider } from "@/components/planner/PlannerProvider";

export const metadata: Metadata = {
  title: { default: "PINS Cabs | Plan your journey", template: "%s | PINS Cabs" },
  description: "Plan a ride with PINS Cabs in Wattala. Choose a journey and vehicle class, then send a clear enquiry by WhatsApp.",
  openGraph: { title: "PINS Cabs", description: "Your next journey, made simple." },
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
      <body className="min-h-full flex flex-col"><PlannerProvider>{children}</PlannerProvider></body>
    </html>
  );
}
