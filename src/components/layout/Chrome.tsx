"use client";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function Chrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";

  // 1) Hide Navbar & Footer on main page
  const hideChrome = pathname === "/";

  // 2) Default: solid (#EC2227) background via Navbar default
  // 3) Transparent on top for hero pages (e.g., home pages)
  const transparentOnTop = pathname.startsWith("/home");

  if (hideChrome) return <>{children}</>;

  return (
    <>
      <Navbar transparentOnTop={transparentOnTop} />
      {/* Dynamic spacer: uses --nav-offset (set by Navbar) to avoid gap when navbar hides */}
      {!transparentOnTop && (
        <div aria-hidden style={{ height: "var(--nav-offset, 64px)" }} />
      )}
      {children}
      <Footer />
    </>
  );
}
