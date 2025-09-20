"use client";

import type { MapItem } from "@/utils/mapItems";
import { Map } from "lucide-react";
import { useEffect, useRef } from "react";

export default function ResultsMap({
  idBase = "search",
  items,
  initialCenter,
}: {
  idBase?: string;
  items: MapItem[];
  initialCenter: { lat: number; lng: number };
  sectionTitle?: string;
}) {
  const mapInitRan = useRef(false); // prevents double init on Fast Refresh
  const fsInitRan = useRef(false);

  const mapId = `${idBase}-gmap`;
  const mapFsId = `${idBase}-gmap-fullscreen`;
  const overlayId = `${idBase}-map-overlay`;
  const recenterId = `${idBase}-recenter`;
  const openBtnId = `${idBase}-open-map`;
  const closeBtnId = `${idBase}-close-map`;

  // ---- styles for InfoWindow & controls (unchanged from your version) ----
  // (kept exactly to preserve your look & feel)
  // ------------------------------------------------------------------------

  const styles = (
    <style jsx global>{`
      + .gm-style .gm-style-iw-c {
        padding: 0 !important;
        border-radius: 15px !important;
        overflow: hidden !important; /* <-- clip any child bleed */
      }
      .gm-style .gm-ui-hover-effect {
        display: none !important;
      }
      .gm-style .gm-style-iw-d {
        overflow: hidden !important;
      }
      .fo-iw {
        position: relative;
        width: 320px;
        max-width: 90vw;
        background: #fff;
        border-radius: 15px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.14);
      }
      .fo-iw-close {
        position: absolute;
        top: -8px;
        right: 8px;
        width: 28px;
        height: 28px;
        line-height: 26px;
        border: 0;
        border-radius: 9999px;
        background: rgba(255, 255, 255, 0.9);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
        font-size: 18px;
        font-weight: 600;
        color: #111;
        cursor: pointer;
      }
      .fo-iw-body {
        display: flex;
        gap: 12px;
        align-items: center;
        padding: 0px 5px 15px 5px;
      }
      .fo-iw-img {
        width: 96px;
        height: 96px;
        object-fit: cover;
        border-radius: 8px;
        flex: 0 0 auto;
      }
      .fo-iw-meta {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .fo-iw-title {
        font-weight: 700;
        line-height: 1.2;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .fo-iw-row {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .fo-iw-pill {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 9999px;
        background: #ec2227;
        color: #fff;
        font-weight: 600;
        font-size: 12px;
      }
      .fo-iw-link {
        color: #ec2227;
        font-weight: 600;
        text-decoration: none;
      }
      .fo-iw-link:hover {
        text-decoration: underline;
      }
      .fo-iw-rating {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: #111;
      }
      .fo-iw-star {
        color: #f59e0b;
        font-size: 14px;
        line-height: 1;
      }
    `}</style>
  );

  // Helper funcs ported from your inline <Script>
  function kmBetween(
    a: { lat: number; lng: number },
    b: { lat: number; lng: number }
  ) {
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const la1 = (a.lat * Math.PI) / 180;
    const la2 = (b.lat * Math.PI) / 180;
    const x =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const y = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
    return R * y;
  }

  function jitterDuplicates(list: MapItem[]) {
    const byKey: Record<string, MapItem[]> = {};
    list.forEach((it) => {
      const key = `${it.lat.toFixed(5)},${it.lng.toFixed(5)}`;
      byKey[key] = byKey[key] || [];
      byKey[key].push(it);
    });
    const out: MapItem[] = [];
    Object.keys(byKey).forEach((k) => {
      const arr = byKey[k];
      if (arr.length === 1) {
        out.push(arr[0]);
        return;
      }
      const base = arr[0];
      for (let i = 0; i < arr.length; i++) {
        const angle = (i / arr.length) * 2 * Math.PI;
        const d = 0.00025;
        out.push({
          ...arr[i],
          lat: base.lat + d * Math.cos(angle),
          lng: base.lng + d * Math.sin(angle),
        });
      }
    });
    return out;
  }

  // replace your current makePriceIcon with this:
  function makePriceIcon(price?: number) {
    const label = price ? `RM${price}` : "RM–";
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="32">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.25)"/>
        </filter>
      </defs>
      <g filter="url(#shadow)">
        <rect x="1" y="1" rx="16" ry="16" width="94" height="30" fill="#ec2227"/>
        <text x="48" y="22" text-anchor="middle" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto" font-size="13" font-weight="500" fill="#ffffff">${label}</text>
      </g>
    </svg>`;
    return {
      url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
      size: new google.maps.Size(96, 32),
      anchor: new google.maps.Point(48, 16),
      scaledSize: new google.maps.Size(96, 32),
    } as google.maps.Icon;
  }

  function waitForGoogle(): Promise<void> {
    return new Promise((resolve) => {
      const poll = () => {
        if (window.__gmapReady && window.google && google.maps) {
          resolve();
        } else {
          setTimeout(poll, 50);
        }
      };
      poll();
    });
  }

  useEffect(() => {
    let map: google.maps.Map | null = null;
    let fsMap: google.maps.Map | null = null;
    let clusterer: any = null;
    let fsClusterer: any = null;
    let infoWindow: google.maps.InfoWindow | null = null;
    let fsInfoWindow: google.maps.InfoWindow | null = null;

    function clearMarkers(cluster: any) {
      if (!cluster) return;
      try {
        cluster.clearMarkers();
      } catch {}
      try {
        cluster.setMap(null);
      } catch {}
    }

    function mountMap(targetId: string, center: { lat: number; lng: number }) {
      const el: HTMLElement | null = document.getElementById(targetId);
      if (!el) return null;

      const m = new google.maps.Map(el, {
        center,
        zoom: 10,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: false, // we hide default buttons per your spec
      });
      return m;
    }

    function render(
      m: google.maps.Map,
      iw: google.maps.InfoWindow,
      setCluster: (c: unknown) => void,
      fitOnFirst = false
    ) {
      const center = m.getCenter();
      const bounds = m.getBounds();
      if (!center || !bounds) return;

      // radius based on viewport (NE corner)
      const ne = bounds.getNorthEast();
      const radiusKm = kmBetween(
        { lat: center.lat(), lng: center.lng() },
        { lat: ne.lat(), lng: ne.lng() }
      );

      const nearby = items.filter(
        (it) =>
          kmBetween(
            { lat: center.lat(), lng: center.lng() },
            { lat: it.lat, lng: it.lng }
          ) <= radiusKm
      );
      const renderList = jitterDuplicates(
        nearby.length ? nearby : items.slice(0, 12)
      );

      const markers: google.maps.Marker[] = [];
      const fitBounds = new google.maps.LatLngBounds();

      renderList.forEach((it) => {
        const marker = new google.maps.Marker({
          position: { lat: it.lat, lng: it.lng },
          icon: makePriceIcon(it.price), // <-- object literal, not a constructor
          title: it.name,
        });
        marker.addListener("click", () => {
          iw.setContent(`
            <div class="fo-iw">
              <button type="button" class="fo-iw-close" aria-label="Close">&times;</button>
              <div class="fo-iw-body">
                ${
                  it.image
                    ? `<img src="${it.image}" alt="${it.name}" class="fo-iw-img">`
                    : ""
                }
                <div class="fo-iw-meta">
                  <div class="fo-iw-title">${it.name}</div>
                  <div class="fo-iw-rating">
                    <span class="fo-iw-star">★</span>
                    <span>${it.ratingAvg ? it.ratingAvg.toFixed(1) : "—"} (${
            it.ratingCount || 0
          } reviews)</span>
                  </div>
                  <div class="fo-iw-row">
                    <a href="${
                      it.href
                    }" target="_blank" rel="noopener" class="fo-iw-link">View details →</a>
                  </div>
                </div>
              </div>
            </div>
          `);
          iw.open({ map: m, anchor: marker });
          // wire close
          setTimeout(() => {
            const btn = document.querySelector(
              ".fo-iw-close"
            ) as HTMLButtonElement | null;
            if (btn)
              btn.addEventListener("click", () => iw.close(), { once: true });
          }, 0);
        });
        markers.push(marker);
        fitBounds.extend(marker.getPosition()!);
      });

      if (window.markerClusterer && window.markerClusterer.MarkerClusterer) {
        const BrandRenderer = {
          render: ({
            count,
            position,
          }: {
            count: number;
            position: google.maps.LatLng | google.maps.LatLngLiteral;
          }) => {
            const size = count < 10 ? 40 : count < 100 ? 48 : 56;
            const svg = `
              <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
                <defs><filter id="s" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.25)"/></filter></defs>
                <g filter="url(#s)">
                  <rect x="1" y="1" rx="${size / 2}" ry="${size / 2}" width="${
              size - 2
            }" height="${size - 2}" fill="#ec2227"/>
                  <text x="${size / 2}" y="${
              size / 2 + 5
            }" text-anchor="middle" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto" font-size="${
              size / 2.5
            }" font-weight="600" fill="#ffffff">${count}</text>
                </g>
              </svg>`;

            return new google.maps.Marker({
              position,
              icon: {
                url:
                  "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
                size: new google.maps.Size(size, size),
                anchor: new google.maps.Point(size / 2, size / 2),
                scaledSize: new google.maps.Size(size, size),
              },

              zIndex: google.maps.Marker.MAX_ZINDEX + count,
            });
          },
        };
        const cluster = new window.markerClusterer.MarkerClusterer({
          map: m,
          markers,
          renderer: BrandRenderer,
        });
        setCluster(cluster);
      } else {
        markers.forEach((mk) => mk.setMap(m));
      }

      if (fitOnFirst) {
        if (renderList.length) m.fitBounds(fitBounds, 40);
        else {
          m.setCenter(initialCenter);
          m.setZoom(10);
        }
      }
    }

    function boot() {
      if (!mapInitRan.current) {
        // desktop map
        mapInitRan.current = true;

        map = mountMap(mapId, initialCenter);
        if (map) {
          infoWindow = new google.maps.InfoWindow({
            pixelOffset: new google.maps.Size(0, -8),
          });
          // fit and render on first idle

          google.maps.event.addListenerOnce(map, "idle", () =>
            render(map!, infoWindow!, (c) => (clusterer = c), true)
          );
          // drag + zoom update

          google.maps.event.addListener(map, "dragend", () =>
            render(map!, infoWindow!, (c) => (clusterer = c))
          );

          google.maps.event.addListener(map, "zoom_changed", () => {
            google.maps.event.addListenerOnce(map!, "idle", () =>
              render(map!, infoWindow!, (c) => (clusterer = c))
            );
          });
        }
      }

      // recenter buttons (both desktop + fullscreen share same id, delegated click)
      const recenter = (center: { lat: number; lng: number }) => {
        if (map) {
          map.setCenter(center);
          map.setZoom(10);
        }
        if (fsMap) {
          fsMap.setCenter(center);
          fsMap.setZoom(10);
        }
      };

      const onDocClick = (e: MouseEvent) => {
        const tgt = e.target as HTMLElement;
        const recenterBtn = tgt.closest(`#${recenterId}`);
        const openBtn = tgt.closest(`#${openBtnId}`);
        const closeBtn = tgt.closest(`#${closeBtnId}`);

        if (recenterBtn) {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (pos) =>
                recenter({
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude,
                }),
              () => recenter(initialCenter),
              { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
            );
          } else {
            recenter(initialCenter);
          }
        }

        if (openBtn) {
          const overlay = document.getElementById(overlayId);
          overlay?.classList.remove("hidden");

          if (!fsInitRan.current) {
            fsInitRan.current = true;
            fsMap = mountMap(mapFsId, initialCenter);
            if (fsMap) {
              fsInfoWindow = new google.maps.InfoWindow({
                pixelOffset: new google.maps.Size(0, -8),
              });
              google.maps.event.addListenerOnce(fsMap, "idle", () =>
                render(fsMap!, fsInfoWindow!, (c) => (fsClusterer = c), true)
              );
              google.maps.event.addListener(fsMap, "dragend", () =>
                render(fsMap!, fsInfoWindow!, (c) => (fsClusterer = c))
              );
              google.maps.event.addListener(fsMap, "zoom_changed", () => {
                google.maps.event.addListenerOnce(fsMap!, "idle", () =>
                  render(fsMap!, fsInfoWindow!, (c) => (fsClusterer = c))
                );
              });
            }
          }
        }

        if (closeBtn) {
          document.getElementById(overlayId)?.classList.add("hidden");
        }
      };

      document.addEventListener("click", onDocClick);
      return () => document.removeEventListener("click", onDocClick);
    }

    let removeDelegates: (() => void) | undefined;

    waitForGoogle().then(() => {
      removeDelegates = boot();
    });

    // cleanup on unmount / route change
    return () => {
      try {
        clearMarkers(clusterer);
        clearMarkers(fsClusterer);

        if (map) google.maps.event.clearInstanceListeners(map);

        if (fsMap) google.maps.event.clearInstanceListeners(fsMap);
      } catch {}
      removeDelegates?.();
    };
  }, [
    idBase,
    initialCenter,
    initialCenter.lat,
    initialCenter.lng,
    items,
    mapId,
    mapFsId,
    overlayId,
    recenterId,
    openBtnId,
    closeBtnId,
  ]);

  return (
    <>
      {styles}

      {/* Mobile skeleton/preview */}
      <div className="z-30 fixed bottom-5 left-0 mx-auto w-full flex justify-center lg:hidden">
        <button
          id={openBtnId}
          type="button"
          className="flex flex-col items-center rounded-3xl bg-[#ec2227] text-white px-5 py-2 text-sm shadow-lg "
        >
          <Map />
          <span className="text-[10px]">View On Map</span>
        </button>
        {/* <div className="h-64 w-full overflow-hidden rounded-xl relative">
          <Image
            src={screenshotSrc}
            alt="Map preview"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 0px"
            priority
          />
        </div> */}
      </div>

      {/* Desktop map */}
      <div className="hidden lg:block">
        <div className="relative mb-8">
          <div
            id={mapId}
            className="h-80 w-full overflow-hidden md:h-80 lg:h-[32rem]"
            aria-label="Map of nearby charters"
          />
          {/* Recenter control */}
          <button
            id={recenterId}
            type="button"
            className="absolute right-2.5 bottom-5.5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-gray-900 shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/10"
            aria-label="Recenter to my location"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M16.3 7.7l2.1-2.1M5.6 18.4l2.1-2.1"></path>
            </svg>
            <span className="text-sm font-semibold">Recenter</span>
          </button>
        </div>
      </div>

      {/* Fullscreen overlay */}
      <div
        id={overlayId}
        className="fixed inset-0 z-50 hidden bg-white"
        role="dialog"
        aria-modal="true"
      >
        <button
          id={closeBtnId}
          type="button"
          className="absolute right-2.5 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-gray-900 shadow-lg ring-1 ring-black/10 hover:bg-gray-50"
          aria-label="Close map"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
          <span className="text-sm font-medium">Close</span>
        </button>

        <button
          id={recenterId}
          type="button"
          className="absolute right-2.5 bottom-5.5 z-10 inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-gray-900 shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/10"
          aria-label="Recenter to my location"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M16.3 7.7l2.1-2.1M5.6 18.4l2.1-2.1"></path>
          </svg>
          <span className="text-sm font-semibold">Recenter</span>
        </button>

        <div id={mapFsId} className="absolute inset-0" />
      </div>
    </>
  );
}
