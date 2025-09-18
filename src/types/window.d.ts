export {};

type MarkerClustererConstructor = new (opts: object) => unknown;

declare global {
  interface Window {
    __gmapReady?: boolean;
    google?: typeof google;
    markerClusterer?: {
      MarkerClusterer: MarkerClustererConstructor;
    };
  }
}
