const CAT_PILLS = [
  { value: "semua",  label: "Semua" },
  { value: "resto",  label: "🍽️ Resto" },
  { value: "cafe",   label: "☕ Cafe" },
  { value: "tempat", label: "📍 Tempat" },
  { value: "hotel",  label: "🏨 Hotel" },
];

export default function FilterBar({ items, catFilter, setCatFilter, cityFilter, setCityFilter }) {
  const cities = ["semua", ...new Set(items.map((i) => i.city).filter(Boolean))].sort((a, b) =>
    a === "semua" ? -1 : b === "semua" ? 1 : a.localeCompare(b)
  );

  return (
    <>
      {/* Category pills — horizontal scroll */}
      <div className="cat-pills-wrap">
        <div className="cat-pills">
          {CAT_PILLS.map((c) => (
            <button
              key={c.value}
              className={`cat-pill${catFilter === c.value ? " active" : ""}`}
              onClick={() => setCatFilter(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* City filter — only if more than 1 city */}
      {cities.length > 2 && (
        <div className="city-row">
          <select className="input" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
            {cities.map((c) => (
              <option key={c} value={c}>{c === "semua" ? "Semua Kota" : c}</option>
            ))}
          </select>
        </div>
      )}
    </>
  );
}
