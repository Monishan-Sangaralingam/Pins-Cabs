export type MediaAsset = {
  id: string;
  src: string;
  mobileSrc?: string;
  alt: string;
  width: number;
  height: number;
  illustrative: boolean;
};

export const media = {
  hero: { id: "hero-v2", src: "/media/hero/hero-desktop-v2.webp", mobileSrc: "/media/hero/hero-mobile-v2.webp", alt: "", width: 1920, height: 1080, illustrative: true },
  sedan: { id: "sedan", src: "/media/fleet/sedan.webp", alt: "Illustrative white sedan viewed from the front and side", width: 1200, height: 900, illustrative: true },
  suv: { id: "suv", src: "/media/fleet/suv.webp", alt: "Illustrative white SUV viewed from the front and side", width: 1200, height: 900, illustrative: true },
  van: { id: "van", src: "/media/fleet/van.webp", alt: "Illustrative white passenger van viewed from the front and side", width: 1200, height: 900, illustrative: true },
  kdh9: { id: "kdh-9", src: "/media/fleet/kdh-9.webp", alt: "Illustrative white nine-seat KDH-style passenger van", width: 1200, height: 900, illustrative: true },
  kdh14: { id: "kdh-14", src: "/media/fleet/kdh-14.webp", alt: "Illustrative white fourteen-seat high-roof KDH-style van", width: 1200, height: 900, illustrative: true },
  acBus: { id: "ac-bus", src: "/media/fleet/ac-bus.webp", alt: "Illustrative white air-conditioned private coach bus", width: 1200, height: 900, illustrative: true },
  nonAcBus: { id: "non-ac-bus", src: "/media/fleet/non-ac-bus.webp", alt: "Illustrative white non-air-conditioned private bus", width: 1200, height: 900, illustrative: true },
  weddingLuxury: { id: "wedding-luxury", src: "/media/fleet/wedding-luxury.webp", alt: "Illustrative white luxury wedding sedan with restrained floral decoration", width: 1200, height: 900, illustrative: true },
  suzukiEvery: { id: "suzuki-every", src: "/media/fleet/suzuki-every.webp", alt: "Illustrative white Suzuki Every-style compact van", width: 1200, height: 900, illustrative: true },
  lorry: { id: "lorry", src: "/media/fleet/lorry.webp", alt: "Illustrative white enclosed light-duty lorry", width: 1200, height: 900, illustrative: true },
} satisfies Record<string, MediaAsset>;
