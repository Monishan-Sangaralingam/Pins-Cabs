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
  alto: { id: "alto", src: "/media/fleet/alto.webp", alt: "Illustrative white Suzuki Alto compact car viewed from the front and side", width: 1200, height: 900, illustrative: true },
  aqua: { id: "aqua", src: "/media/fleet/aqua.webp", alt: "Illustrative white Toyota Aqua hybrid car viewed from the front and side", width: 1200, height: 900, illustrative: true },
  wagonR: { id: "wagon-r", src: "/media/fleet/wagon-r.webp", alt: "Illustrative white Suzuki Wagon R tall-roof compact car", width: 1200, height: 900, illustrative: true },
  nonAcVan: { id: "non-ac-van", src: "/media/fleet/non-ac-van.webp", alt: "Illustrative white Toyota Hiace-style non-AC passenger van", width: 1200, height: 900, illustrative: true },
  kdh9: { id: "kdh-9", src: "/media/fleet/kdh-9.webp", alt: "Illustrative white nine-seat KDH-style passenger van", width: 1200, height: 900, illustrative: true },
  kdh14: { id: "kdh-14", src: "/media/fleet/kdh-14.webp", alt: "Illustrative white fourteen-seat high-roof KDH-style van", width: 1200, height: 900, illustrative: true },
  bus29: { id: "bus-29", src: "/media/fleet/bus-29.webp", alt: "Illustrative white 29-seat passenger bus", width: 1200, height: 900, illustrative: true },
  bus35: { id: "bus-35", src: "/media/fleet/bus-35.webp", alt: "Illustrative white 35-seat coach bus", width: 1200, height: 900, illustrative: true },
  bus55: { id: "bus-55", src: "/media/fleet/bus-55.webp", alt: "Illustrative white 55-seat full-size coach bus", width: 1200, height: 900, illustrative: true },
  weddingLuxury: { id: "wedding-luxury", src: "/media/fleet/wedding-luxury.webp", alt: "Illustrative white luxury wedding sedan with restrained floral decoration", width: 1200, height: 900, illustrative: true },
  suzukiEvery: { id: "suzuki-every", src: "/media/fleet/suzuki-every.webp", alt: "Illustrative white Suzuki Every-style compact van", width: 1200, height: 900, illustrative: true },
  lorry: { id: "lorry", src: "/media/fleet/lorry.webp", alt: "Illustrative white enclosed light-duty lorry", width: 1200, height: 900, illustrative: true },
} satisfies Record<string, MediaAsset>;
