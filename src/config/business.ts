export const business = {
  name: "PINS Cabs",
  legalName: "PINS Cabs",
  phoneDisplay: "072 800 0400",
  phoneHref: "+94728000400",
  whatsappNumber: "+94728000400",
  emailDisplay: "pinscabs777@gmail.com",
  emailHref: "mailto:pinscabs777@gmail.com",
  address: "No. 133, Negombo–Colombo Main Road, Wattala 11300",
  postalAddress: {
    streetAddress: "No. 133, Negombo–Colombo Main Road",
    addressLocality: "Wattala",
    postalCode: "11300",
    addressCountry: "LK",
  },
  mapUrl: "https://maps.app.goo.gl/zkNQj2m6AbRFXWcV6?g_st=ic",
  mapShortHref: "/maps/",
  socialLinks: [
    { label: "Instagram", href: "https://www.instagram.com/pins_cabs/", shortHref: "/ig/", icon: "instagram" },
    { label: "Facebook", href: "https://www.facebook.com/pinscabs", shortHref: "/fb/", icon: "facebook" },
    { label: "WhatsApp", href: "https://wa.me/94728000400", shortHref: "/wa/", icon: "whatsapp" },
  ],
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
