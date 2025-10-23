"use client";

import { useAuthModal } from "@/components/auth/AuthModalContext";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";

type NavbarProps = {
  /** When true, navbar is transparent at the top and becomes solid on scroll. */
  transparentOnTop?: boolean;
};

export default function Navbar({ transparentOnTop = false }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname() || "/";
  const { data: session } = useSession();
  const isAuthed = !!session?.user;
  const lastY = useRef(0);
  const { openModal } = useAuthModal();

  useEffect(() => {
    // Initialize values on mount
    lastY.current = window.scrollY;
    setScrolled(window.scrollY > 8);

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;

      if (transparentOnTop) {
        setScrolled(y > 8);
      }

      // Hide on scroll down, show on scroll up
      if (y < 8) {
        setHidden(false);
      } else if (delta > 10) {
        setHidden(true);
      } else if (delta < -10) {
        setHidden(false);
      }

      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparentOnTop]);

  // If mobile menu is open, keep navbar visible
  useEffect(() => {
    if (open) setHidden(false);
  }, [open]);

  // Expose nav offset for sticky elements below to avoid gap when hidden
  useEffect(() => {
    const offset = hidden ? "0px" : "64px"; // h-16
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--nav-offset", offset);
    }
  }, [hidden]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  // Always fixed; choose color based on variant/state
  const base =
    "fixed top-0 z-40 w-full text-white transition-colors transition-transform duration-300 transform-gpu";
  const solid =
    "bg-[#ec2227] backdrop-blur supports-[backdrop-filter]:bg-[#ec2227]";
  const visibility = hidden ? "-translate-y-full" : "translate-y-0";
  const headerClass = !transparentOnTop
    ? `${base} ${solid} ${visibility}`
    : open || scrolled
    ? `${base} ${solid} ${visibility}`
    : `${base} bg-transparent ${visibility}`;

  return (
    <header className={headerClass}>
      <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl sm:px-6">
        {/* Logo */}
        <Link
          href="/home"
          className="flex items-center gap-2"
          aria-label="Fishon.my home"
        >
          <span className="relative h-14 w-28">
            <Image
              src="/fishonLogoWhite.png"
              alt="Fishon"
              fill
              className="object-contain"
              priority
            />
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="items-center hidden gap-6 md:flex" aria-label="Primary">
          {isAuthed ? (
            <>
              <Link
                href="/account"
                aria-current={isActive("/account") ? "page" : undefined}
                className={`text-sm font-medium underline-offset-4 decoration-white/40 ${
                  isActive("/account")
                    ? "underline"
                    : "hover:underline hover:decoration-white"
                }`}
              >
                Account
              </Link>
              <button
                onClick={() =>
                  signOut({
                    callbackUrl:
                      window.location.pathname + window.location.search,
                  })
                }
                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-[#ec2227] hover:translate-y-px transition"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => openModal("signin", pathname)}
                className="text-sm font-medium underline-offset-4 decoration-white/40 hover:underline hover:decoration-white"
              >
                Sign in
              </button>
              <button
                onClick={() => openModal("register", pathname)}
                className="text-sm font-medium underline-offset-4 decoration-white/40 hover:underline hover:decoration-white"
              >
                Register
              </button>
            </>
          )}
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
          className="inline-flex items-center justify-center p-2 rounded-md md:hidden"
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
          className="flex flex-col gap-1 px-4 py-3 mx-auto max-w-7xl"
          aria-label="Mobile"
        >
          {isAuthed ? (
            <>
              <Link
                href="/account"
                aria-current={isActive("/account") ? "page" : undefined}
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  isActive("/account") ? "bg-white/15" : "hover:bg-white/10"
                }`}
                onClick={() => setOpen(false)}
              >
                Account
              </Link>
              <button
                onClick={() => {
                  setOpen(false);
                  signOut({
                    callbackUrl:
                      window.location.pathname + window.location.search,
                  });
                }}
                className="mt-1 rounded-md bg-white px-3 py-2 text-sm font-semibold text-[#ec2227] text-left"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setOpen(false);
                  openModal("signin", pathname);
                }}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-white/10 text-left"
              >
                Sign in
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  openModal("register", pathname);
                }}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-white/10 text-left"
              >
                Register
              </button>
            </>
          )}
          <Link
            href="https://fishon-captain.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-[#ec2227] text-center hover:translate-y-px transition"
          >
            List Your Charter
          </Link>
        </nav>
      </div>
    </header>
  );
}
