"use client";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function Chrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";

  // 1) Hide Navbar & Footer on main page
  const hideChrome = pathname === "/";

  // 2) Hide Chrome on dashboard pages (they have their own layout)
  const isDashboard = pathname.startsWith("/account");

  // 3) Transparent on top for hero pages (e.g., home pages)
  const transparentOnTop = pathname.startsWith("/home");

  if (hideChrome || isDashboard) return <> {children}</>;

  return (
    <>
      {transparentOnTop && <div aria-hidden className="fixed top-0 -mt-16" />}
      <Navbar transparentOnTop={transparentOnTop} />
      {/* Spacer for non-transparent navbar */}

      {children}
      {<Footer />}
    </>
  );
}
