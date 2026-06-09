const KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
export const gmapsValid = !!KEY;

export async function searchPlaces(input) {
  if (!KEY || !input) return [];
  try {
    const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": KEY },
      body: JSON.stringify({ input, languageCode: "id" }),
    });
    const data = await res.json();
    return (data.suggestions || []).map((s) => ({
      placeId: s.placePrediction.placeId,
      mainText: s.placePrediction.structuredFormat.mainText.text,
      secondaryText: s.placePrediction.structuredFormat.secondaryText?.text || "",
    }));
  } catch { return []; }
}

export async function getPlaceDetails(placeId) {
  if (!KEY) return null;
  try {
    const fields = "displayName,formattedAddress,location,googleMapsUri,addressComponents";
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?fields=${fields}&languageCode=id`,
      { headers: { "X-Goog-Api-Key": KEY } }
    );
    const data = await res.json();

    // Extract city: prefer locality → administrative_area_level_2 → administrative_area_level_1
    let city = "";
    const priority = ["locality", "administrative_area_level_2", "administrative_area_level_1"];
    for (const type of priority) {
      const comp = (data.addressComponents || []).find((c) => c.types.includes(type));
      if (comp) { city = comp.longText; break; }
    }

    return {
      name: data.displayName?.text || "",
      address: data.formattedAddress || "",
      city,
      lat: data.location?.latitude ?? null,
      lng: data.location?.longitude ?? null,
      placeId,
      mapsUrl: data.googleMapsUri || "",
    };
  } catch { return null; }
}

export function staticMapUrl(lat, lng, zoom = 16) {
  if (!KEY || lat == null || lng == null) return null;
  const pin = encodeURIComponent(`color:0x0891B2|${lat},${lng}`);
  const style = [
    "feature:poi|visibility:off",
    "feature:transit|visibility:off",
    "feature:administrative|visibility:simplified",
  ].map((s) => `&style=${encodeURIComponent(s)}`).join("");
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=600x450&scale=2&markers=${pin}&key=${KEY}${style}`;
}
