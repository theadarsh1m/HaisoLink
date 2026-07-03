interface GeocodingResult {
  placeId: string;
  displayName: string;
  lat: number;
  lng: number;
  address: {
    road?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

const cache = new Map<string, { data: GeocodingResult[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function getCached(key: string): GeocodingResult[] | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: GeocodingResult[]) {
  cache.set(key, { data, timestamp: Date.now() });
}

export async function searchAddress(query: string): Promise<GeocodingResult[]> {
  if (!query || query.length < 3) return [];

  const cacheKey = `search:${query.toLowerCase().trim()}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const params = new URLSearchParams({
      q: query,
      format: "json",
      addressdetails: "1",
      limit: "5",
      countrycodes: "in",
    });

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      {
        headers: {
          "User-Agent": "HaisoLink/1.0 (delivery-tracker)",
        },
      }
    );

    if (!res.ok) return [];

    const data = await res.json();
    const results: GeocodingResult[] = data.map((item: any) => ({
      placeId: item.place_id?.toString() || "",
      displayName: item.display_name || "",
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      address: {
        road: item.address?.road || item.address?.suburb || "",
        city:
          item.address?.city ||
          item.address?.town ||
          item.address?.village ||
          "",
        state: item.address?.state || "",
        postcode: item.address?.postcode || "",
        country: item.address?.country || "",
      },
    }));

    setCache(cacheKey, results);
    return results;
  } catch {
    return [];
  }
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<GeocodingResult | null> {
  const cacheKey = `reverse:${lat.toFixed(5)},${lng.toFixed(5)}`;
  const cached = getCached(cacheKey);
  if (cached && cached.length > 0) return cached[0];

  try {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lng.toString(),
      format: "json",
      addressdetails: "1",
    });

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${params}`,
      {
        headers: {
          "User-Agent": "HaisoLink/1.0 (delivery-tracker)",
        },
      }
    );

    if (!res.ok) return null;

    const item = await res.json();
    if (item.error) return null;

    const result: GeocodingResult = {
      placeId: item.place_id?.toString() || "",
      displayName: item.display_name || "",
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      address: {
        road: item.address?.road || item.address?.suburb || "",
        city:
          item.address?.city ||
          item.address?.town ||
          item.address?.village ||
          "",
        state: item.address?.state || "",
        postcode: item.address?.postcode || "",
        country: item.address?.country || "",
      },
    };

    setCache(cacheKey, [result]);
    return result;
  } catch {
    return null;
  }
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

export function debouncedSearch(
  query: string,
  callback: (results: GeocodingResult[]) => void,
  delay = 300
) {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    const results = await searchAddress(query);
    callback(results);
  }, delay);
}

export type { GeocodingResult };
