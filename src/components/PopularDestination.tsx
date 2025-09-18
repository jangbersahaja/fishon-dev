import charters, { Charter } from "@/dummy/charter";
import destinations from "@/dummy/destination";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

type Destination = {
  name: string;
  trips: number;
  image: StaticImageData;
};

function countTripsForDestination(destName: string) {
  const name = destName.trim();
  if (!name) return 0;
  const needle = name.toLowerCase();

  // Aliases to improve matching between destination labels and charter locations/addresses
  const ALIASES: Record<string, string[]> = {
    Klang: ["klang", "port klang", "pulau ketam", "pulau indah"],
    "Port Klang": ["port klang", "klang", "pulau ketam", "pulau indah"],
    "Pulau Indah": ["pulau indah", "port klang", "klang"],
    "Kuala Selangor": [
      "kuala selangor",
      "tanjong karang",
      "sekinchan",
      "jeram",
    ],
    "Tanjong Karang": ["tanjong karang", "kuala selangor"],
    "Sabak Bernam": ["sabak bernam", "sungai besar"],
    "Sungai Besar": ["sungai besar", "sabak bernam"],
    "Carey Island": ["carey island", "pulau carey", "teluk panglima garang"],
    "Teluk Panglima Garang": [
      "teluk panglima garang",
      "pulau carey",
      "carey island",
    ],
    Sepang: ["sepang", "bagan lalang"],
    Kajang: ["kajang", "bangi"],
    "Shah Alam": ["shah alam", "jelutong"],
    "Subang Jaya": ["subang", "subang jaya"],
    Petaling: ["petaling", "subang"],
    Puchong: ["puchong", "tasik prima"],
    Gombak: ["gombak", "ampang jaya", "ampang"],
    "Ampang Jaya": ["ampang jaya", "gombak", "ampang"],
    Cyberjaya: ["cyberjaya"],
  };

  const terms = new Set<string>([
    needle,
    ...((ALIASES[name] || []) as string[]),
  ]);

  const matches = (c: Charter) => {
    const hay = `${c.location || ""} ${c.address || ""}`.toLowerCase();
    for (const t of terms) {
      if (t && hay.includes(t)) return true;
    }
    return false;
  };

  // Sum all trips across matching charters
  return (charters as Charter[])
    .filter(matches)
    .reduce((sum, c) => sum + (Array.isArray(c.trip) ? c.trip.length : 0), 0);
}

const Card = ({ name, trips, image }: Destination) => (
  <Link
    href={`/search?destination=${encodeURIComponent(name)}`}
    className="flex flex-col gap-2 group"
    title={`Find trips in ${name}`}
  >
    <div className="h-48 bg-gray-200 relative rounded-lg overflow-hidden">
      <Image
        src={image}
        alt={`${name} fishing destinations`}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
        priority={false}
      />
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-bold">{name}</span>
      <span className="text-xs">
        {trips} Trip{trips === 1 ? "" : "s"} Available
      </span>
    </div>
  </Link>
);

const PopularDestination = () => {
  return (
    <div className="flex px-2 md:px-0 w-full max-w-6xl items-center justify-center mx-auto">
      <div className="w-full flex flex-col px-5">
        <h2 className="text-xl font-bold mb-5">Popular Destinations</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {destinations.map((d) => {
            const trips = countTripsForDestination(d.name);
            return (
              <Card key={d.name} name={d.name} trips={trips} image={d.image} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PopularDestination;
