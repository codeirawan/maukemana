const CATEGORIES = ["semua", "resto", "cafe", "tempat", "hotel"];

export default function FilterBar({ items, catFilter, setCatFilter, cityFilter, setCityFilter }) {
  const cities = ["semua", ...new Set(items.map((i) => i.city).filter(Boolean))].sort((a, b) =>
    a === "semua" ? -1 : b === "semua" ? 1 : a.localeCompare(b)
  );

  return (
    <div className="filter-bar">
      <select className="input" value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c === "semua" ? "Semua Kategori" : c}</option>)}
      </select>
      <select className="input" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
        {cities.map((c) => <option key={c} value={c}>{c === "semua" ? "Semua Kota" : c}</option>)}
      </select>
    </div>
  );
}
