// Nominatim — OpenStreetMap official geocoder, no API key required
// Policy: max 1 req/s, identify via Referer (auto-set by browser)
// https://nominatim.org/release-docs/latest/api/Search/

const BASE = "https://nominatim.openstreetmap.org";
const _cache = new Map();

export const gmapsValid = true; // always available

export async function searchPlaces(input) {
  if (!input || input.length < 2) return [];
  try {
    const url = `${BASE}/search?q=${encodeURIComponent(input)}&format=jsonv2&limit=6&addressdetails=1`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();

    return (data || []).flatMap((f) => {
      if (!f.name) return [];
      const key = String(f.place_id);
      _cache.set(key, f);

      const addr = f.address || {};
      const city = addr.city || addr.town || addr.village || addr.county || "";
      const secondaryText = [city, addr.country].filter(Boolean).join(", ");

      return [{ placeId: key, mainText: f.name, secondaryText }];
    });
  } catch { return []; }
}

export async function getPlaceDetails(placeId) {
  const f = _cache.get(placeId);
  if (!f) return null;

  const addr = f.address || {};
  const city = addr.city || addr.town || addr.village || addr.county || addr.state || "";

  return {
    name: f.name,
    address: f.display_name || "",
    city,
    lat: parseFloat(f.lat),
    lng: parseFloat(f.lon),
    placeId,
    mapsUrl: `https://www.google.com/maps?q=${f.lat},${f.lon}`,
  };
}

export function staticMapUrl() { return null; }
