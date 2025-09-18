export {};

type MarkerClustererConstructor = new (opts: object) => unknown;

declare global {
  interface Window {
    __gmapReady?: boolean;
    markerClusterer?: {
      MarkerClusterer: MarkerClustererConstructor;
    };
  }
}
