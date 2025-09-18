import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>{children}</body>
    </html>
  );
}
