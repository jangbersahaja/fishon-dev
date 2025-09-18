"use client";

import FishonLogo from "@/aset/img/fishonLogoWhite.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";

type NavbarProps = {
  /** When true, navbar is transparent at the top and becomes solid on scroll. */
  transparentOnTop?: boolean;
};

const links = [
  { href: "/login", label: "Log In" },
  { href: "/signup", label: "Sign Up" },
];

export default function Navbar({ transparentOnTop = false }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname() || "/";

  useEffect(() => {
    if (!transparentOnTop) return;
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll(); // initialize on mount
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparentOnTop]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  // Always fixed; choose color based on variant/state
  const base = "top-0 z-40 w-full text-white transition-colors duration-300";
  const solid =
    "bg-[#ec2227] backdrop-blur supports-[backdrop-filter]:bg-[#ec2227]";

  // If transparentOnTop is true, stay transparent at very top, become solid once scrolled or when menu is open.
  // If transparentOnTop is false, stay solid always.
  const headerClass = !transparentOnTop
    ? `${base} ${solid} `
    : open || scrolled
    ? `${base} ${solid} `
    : `${base} bg-transparent absolute`;

  return (
    <header className={headerClass}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="Fishon.my home"
        >
          <span className="relative h-14 w-28">
            <Image
              src={FishonLogo}
              alt="Fishon"
              fill
              className="object-contain"
              priority
            />
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`text-sm font-medium underline-offset-4 decoration-white/40 ${
                isActive(l.href)
                  ? "underline"
                  : "hover:underline hover:decoration-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/list-your-business"
            aria-current={isActive("/list-your-business") ? "page" : undefined}
            className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
              isActive("/list-your-business")
                ? "bg-white/90 text-[#ec2227]"
                : "bg-white text-[#ec2227] hover:translate-y-px"
            }`}
          >
            List Your Charter
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
          className="inline-flex items-center justify-center rounded-md p-2 md:hidden"
        >
          {open ? <IoClose size={22} /> : <GiHamburgerMenu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`md:hidden ${
          open ? "block bg-[#ec2227]" : "hidden"
        } border-t border-white/20`}
      >
        <nav
          className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3"
          aria-label="Mobile"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                isActive(l.href) ? "bg-white/15" : "hover:bg-white/10"
              }`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/list-your-business"
            aria-current={isActive("/list-your-business") ? "page" : undefined}
            className={`mt-1 rounded-md px-3 py-2 text-sm font-semibold ${
              isActive("/list-your-business")
                ? "bg-white text-[#ec2227]"
                : "bg-white text-[#ec2227]"
            }`}
            onClick={() => setOpen(false)}
          >
            List Your Charter
          </Link>
        </nav>
      </div>
    </header>
  );
}
