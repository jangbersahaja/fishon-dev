// Optionally tighten Blob image host via env (exact hostname, no protocol)
const blobHost = process.env.NEXT_PUBLIC_BLOB_HOST?.replace(
  /^https?:\/\//,
  ""
)?.replace(/\/$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...(blobHost
        ? [
            // Tight, exact bucket host
            { protocol: "https", hostname: blobHost },
          ]
        : [
            // Fallback: allow any Vercel Blob host (dev convenience)
            {
              protocol: "https",
              hostname: "**.public.blob.vercel-storage.com",
            },
            { protocol: "https", hostname: "**.blob.vercel-storage.com" },
            { protocol: "https", hostname: "lh3.googleusercontent.com" },
          ]),
    ],
  },
  // Avoid incorrect workspace root inference when multiple lockfiles exist
  // This ensures .next artifacts are generated under this project folder
  turbopack: {
    root: __dirname,
  },
  // Redirects for old URLs after route restructuring
  async redirects() {
    return [
      {
        source: "/book",
        destination: "/home",
        permanent: true,
      },
      {
        source: "/mybooking",
        destination: "/account/bookings",
        permanent: true,
      },
      {
        source: "/charters/view",
        destination: "/charters",
        permanent: true,
      },
      {
        source: "/charters/view/:id",
        destination: "/charters/:id",
        permanent: true,
      },
      // Booking system redirects
      {
        source: "/checkout",
        destination: "/home",
        permanent: true,
      },
      {
        source: "/checkout/confirmation",
        destination: "/book/confirm",
        permanent: true,
      },
      {
        source: "/pay/:id",
        destination: "/book/payment/:id",
        permanent: true,
      },
      {
        source: "/booking/:id",
        destination: "/book/confirm",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
