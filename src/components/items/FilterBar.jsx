import { IconUtensils, IconCoffee, IconMapPin, IconBuilding } from "../ui/Icons";

const TYPE_PILLS = [
  { value: "semua",  label: "Semua",   icon: null,                cls: "t-semua" },
  { value: "resto",  label: "Resto",   icon: <IconUtensils size={12} />, cls: "t-resto" },
  { value: "cafe",   label: "Cafe",    icon: <IconCoffee size={12} />,   cls: "t-cafe" },
  { value: "tempat", label: "Tempat",  icon: <IconMapPin size={12} />,   cls: "t-tempat" },
  { value: "hotel",  label: "Hotel",   icon: <IconBuilding size={12} />, cls: "t-hotel" },
];

const SORT_OPTIONS = [
  { value: "newest",   label: "Terbaru" },
  { value: "oldest",   label: "Terlama" },
  { value: "name_az",  label: "Nama A-Z" },
  { value: "rating",   label: "Rating" },
  { value: "priority", label: "Prioritas" },
];

export default function FilterBar({
  items, catFilter, setCatFilter,
  cityFilter, setCityFilter,
  sort, setSort, totalFiltered,
}) {
  const cities = [...new Set(items.map((i) => i.city).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  );

  return (
    <div className="filter-bar">
      <div className="type-pills-wrap">
        <div className="type-pills">
          {TYPE_PILLS.map((p) => (
            <button
              key={p.value}
              className={`type-pill ${p.cls}${catFilter === p.value ? " active" : ""}`}
              onClick={() => setCatFilter(p.value)}
            >
              {p.icon && <span style={{ display: "flex", alignItems: "center" }}>{p.icon}</span>}
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {cities.length > 1 && (
        <div className="city-chips-wrap">
          <div className="city-chips">
            <button className={`city-chip${cityFilter === "semua" ? " active" : ""}`} onClick={() => setCityFilter("semua")}>
              Semua
            </button>
            {cities.map((c) => (
              <button key={c} className={`city-chip${cityFilter === c ? " active" : ""}`} onClick={() => setCityFilter(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="filter-bottom-row">
        <span className="filter-count">{totalFiltered} tempat</span>
        <div className="sort-wrap">
          <span className="sort-label">Urut</span>
          <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
