import SearchBox from "@/components/charters/SearchBox";
import Image from "next/image";

export default function SearchResultsHeader({
  title,
  count,
  subtitleSuffix = "trips",
}: {
  title: string; // e.g. "Jigging — Fishing Charters"
  count: number;
  subtitleSuffix?: string; // e.g. "trips" or "charters"
}) {
  return (
    <section className="relative w-full">
      <Image
        src="/images/hero/hero-wallpaper.png"
        alt="Fishing wallpaper"
        className="w-full h-[25vh] md:h-[30vh] object-cover"
        priority
      />
      <header className="absolute bottom-14 w-full flex justify-center">
        <div className="p-5 flex-col flex max-w-7xl w-full">
          <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
            {title}
          </h2>
          <p className="text-sm text-white drop-shadow-lg">
            Showing{" "}
            <span className="font-semibold text-white drop-shadow-lg">
              {count}
            </span>{" "}
            {subtitleSuffix}
          </p>
        </div>
      </header>
      <div className="absolute inset-x-0 -bottom-10 lg:-bottom-10 mx-auto px-3 max-w-7xl py-3">
        <SearchBox />
      </div>
    </section>
  );
}
