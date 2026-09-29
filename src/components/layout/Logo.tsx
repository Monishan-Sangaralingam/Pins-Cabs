import Image from "next/image";
import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link className={`brand-logo ${light ? "brand-logo--light" : ""}`} href="/#home-top" aria-label="PINS Cabs home">
      <Image className="brand-logo-image" src="/media/brand/pins-cabs-logo.png" alt="" width={1200} height={305} sizes="(max-width: 760px) 150px, 190px" />
    </Link>
  );
}
