// Photon by Komoot — OpenStreetMap geocoding, no API key required
// https://photon.komoot.io

const _cache = new Map();

export const gmapsValid = true; // always available

export async function searchPlaces(input) {
  if (!input || input.length < 2) return [];
  try {
    const res = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(input)}&limit=6&lang=id`,
      { headers: { "User-Agent": "maukemana-app/1.0" } }
    );
    if (!res.ok) return [];
    const data = await res.json();

    return (data.features || []).flatMap((f, i) => {
      const props = f.properties;
      const mainText = props.name || props.street;
      if (!mainText) return [];

      const id = `${props.osm_type || "X"}${props.osm_id ?? i}`;
      _cache.set(id, f);

      const cityPart = props.city || props.town || props.village || props.county || "";
      const secondaryText = [cityPart, props.country].filter(Boolean).join(", ");

      return [{ placeId: id, mainText, secondaryText }];
    });
  } catch { return []; }
}

export async function getPlaceDetails(placeId) {
  const f = _cache.get(placeId);
  if (!f) return null;

  const props = f.properties;
  const [lng, lat] = f.geometry.coordinates;

  const streetPart = [props.street, props.housenumber].filter(Boolean).join(" ");
  const city = props.city || props.town || props.village || props.county || props.state || "";
  const address = [streetPart, city, props.state, props.country].filter(Boolean).join(", ");

  return {
    name: props.name || props.street || "",
    address,
    city,
    lat,
    lng,
    placeId,
    mapsUrl: `https://www.google.com/maps?q=${lat},${lng}`,
  };
}

export function staticMapUrl() { return null; }
