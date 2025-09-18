import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fishon — Malaysia’s Fishing & Charter Booking (Coming Soon)",
  description:
    "Fishon is Malaysia’s first fishing & charter booking platform. We’re reeling in something exciting — launching soon!",
  metadataBase: new URL("https://your-domain-here.com"),
  robots: { index: false, follow: false }, // keep out of search until launch
  openGraph: {
    title: "Fishon — Coming Soon",
    description:
      "Malaysia’s first fishing & charter booking platform. Launching soon.",
    url: "https://your-domain-here.com",
    siteName: "Fishon",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
  
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar transparentOnTop />
      {children}
      <Footer />
    </>
  );
}
