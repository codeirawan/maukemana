import { useState, useMemo } from "react";
import { useItems } from "../hooks/useItems";
import FilterBar from "../components/items/FilterBar";
import ItemList from "../components/items/ItemList";
import DetailModal from "../components/ui/DetailModal";

function sortItems(arr, sort) {
  const copy = [...arr];
  if (sort === "oldest")   return copy.sort((a, b) => (a.addedAt || "").localeCompare(b.addedAt || ""));
  if (sort === "name_az")  return copy.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "rating")   return copy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  if (sort === "priority") {
    const order = { high: 0, med: 1, low: 2 };
    return copy.sort((a, b) => (order[a.priority] ?? 3) - (order[b.priority] ?? 3));
  }
  return copy.sort((a, b) => (b.addedAt || "").localeCompare(a.addedAt || ""));
}

export default function ArchivePage({ showToast }) {
  const { items, restoreItem, deleteItem } = useItems();
  const [catFilter, setCatFilter]   = useState("semua");
  const [cityFilter, setCityFilter] = useState("semua");
  const [search, setSearch]         = useState("");
  const [sort, setSort]             = useState("newest");
  const [selectedItem, setSelected] = useState(null);

  const archive = items.filter((i) => i.archived);

  const filtered = useMemo(() => {
    let arr = archive;
    if (catFilter !== "semua") arr = arr.filter((i) => i.category === catFilter);
    if (cityFilter !== "semua") arr = arr.filter((i) => i.city === cityFilter);
    if (search) {
      const q = search.toLowerCase();
      arr = arr.filter((i) =>
        i.name.toLowerCase().includes(q) ||
        i.city.toLowerCase().includes(q) ||
        (i.notes || "").toLowerCase().includes(q)
      );
    }
    return sortItems(arr, sort);
  }, [archive, catFilter, cityFilter, search, sort]);

  const wishlistCount = items.filter((i) => !i.archived).length;
  const cities = [...new Set(items.map((i) => i.city).filter(Boolean))];

  async function handleRestore(id) {
    await restoreItem(id);
    showToast("Dipindahkan kembali ke wishlist");
  }

  async function handleDelete(id, photoPath) {
    await deleteItem(id, photoPath);
    showToast("Dihapus");
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div className="page-eyebrow">Kenangan Perjalanan</div>
        <div className="page-title">Sudah <em>Dikunjungi</em></div>
        <div className="page-sub">tempat yang telah kamu jelajahi</div>
      </div>

      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-val">{archive.length}</div>
          <div className="stat-lbl">Dikunjungi</div>
        </div>
        <div className="stat-box">
          <div className="stat-val">{wishlistCount}</div>
          <div className="stat-lbl">Wishlist</div>
        </div>
        <div className="stat-box">
          <div className="stat-val">{cities.length}</div>
          <div className="stat-lbl">Kota</div>
        </div>
      </div>

      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input className="input" placeholder="Cari nama, kota, atau catatan…"
          value={search} onChange={(e) => setSearch(e.target.value)} />
        {search && <button className="search-clear" onClick={() => setSearch("")}>✕</button>}
      </div>

      {archive.length > 0 && (
        <FilterBar
          items={archive}
          catFilter={catFilter} setCatFilter={setCatFilter}
          cityFilter={cityFilter} setCityFilter={setCityFilter}
          sort={sort} setSort={setSort}
          totalFiltered={filtered.length}
        />
      )}

      <ItemList
        items={filtered} mode="archive"
        onVisit={() => {}} onRestore={handleRestore} onDelete={handleDelete}
        onCardClick={setSelected}
        emptyState={
          search || catFilter !== "semua" || cityFilter !== "semua"
            ? { icon: "🔍", title: "Tidak ada hasil", desc: "Coba ubah filter atau kata kunci." }
            : { icon: "✅", title: "Belum ada yang dikunjungi", desc: "Klik 'Sudah!' di tab Wishlist setelah berkunjung." }
        }
      />

      {selectedItem && (
        <DetailModal
          item={selectedItem}
          mode="archive"
          onClose={() => setSelected(null)}
          onVisit={() => {}}
          onRestore={async (id) => { await handleRestore(id); setSelected(null); }}
          onDelete={async (id, path) => { await handleDelete(id, path); setSelected(null); }}
        />
      )}
    </div>
  );
}
