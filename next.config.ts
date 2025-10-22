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
          ]),
    ],
  },
  // Avoid incorrect workspace root inference when multiple lockfiles exist
  // This ensures .next artifacts are generated under this project folder
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
