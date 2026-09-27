import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link className={`brand-logo ${light ? "brand-logo--light" : ""}`} href="/" aria-label="PINS Cabs home">
      <svg aria-hidden="true" viewBox="0 0 54 54">
        <circle className="logo-ring-red" cx="27" cy="27" r="22" />
        <path className="logo-ring-blue" d="M8 35A22 22 0 1 1 42 46" />
        <path className="logo-p" d="M16 42V17h17c9 0 11 14 1 16H24v9" />
        <circle className="logo-dot" cx="27" cy="26" r="3.7" />
      </svg>
      <span><strong>PINS</strong><small>CABS</small></span>
    </Link>
  );
}
