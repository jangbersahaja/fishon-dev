const DESTINATION_ALIASES: Record<string, string[]> = {
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

function normalise(value: string): string {
  return value.trim().toLowerCase();
}

export function expandDestinationSearchTerms(raw?: string | null): string[] {
  const canonical = raw ? normalise(raw) : "";
  if (!canonical) return [];

  const entries = Object.entries(DESTINATION_ALIASES);

  const directAliases = entries
    .filter(([key]) => normalise(key) === canonical)
    .flatMap(([, aliases]) => aliases);

  const reverseAliases = entries
    .filter(([, aliases]) => aliases.some((alias) => normalise(alias) === canonical))
    .flatMap(([key, aliases]) => [normalise(key), ...aliases]);

  const terms = new Set<string>([
    canonical,
    ...directAliases.map(normalise),
    ...reverseAliases.map(normalise),
  ]);

  return Array.from(terms.values());
}

export default DESTINATION_ALIASES;
