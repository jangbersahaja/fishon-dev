"use client";

import Script from "next/script";

export default function MapScriptLoader() {
  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&v=quarterly`}
        strategy="afterInteractive"
        onLoad={() => {
          // Flag so maps can wait for it deterministically
          window.__gmapReady = true;
        }}
      />
      <Script
        src="https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          // clusterer attaches to window.markerClusterer
        }}
      />
    </>
  );
}
