export const business = {
  name: "PINS Cabs",
  legalName: "PINS Cabs",
  phoneDisplay: "077 788 0288",
  phoneHref: "+94777880288",
  whatsappNumber: "94777880288",
  address: "No. 133, Negombo–Colombo Main Road, Wattala 11300",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=No.+133+Negombo+Colombo+Main+Road+Wattala+11300",
  hours: "Available 24/7",
  timezone: "Asia/Colombo",
  currency: "LKR",
  previewContent: true,
} as const;

export const navItems = [
  { label: "Services", href: "/services" },
  { label: "Vehicles", href: "/vehicles" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Contact", href: "/contact" },
] as const;
