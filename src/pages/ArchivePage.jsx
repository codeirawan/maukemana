import { useState } from "react";
import { useItems } from "../hooks/useItems";
import FilterBar from "../components/items/FilterBar";
import ItemList from "../components/items/ItemList";

export default function ArchivePage({ showToast }) {
  const { items, restoreItem, deleteItem } = useItems();
  const [catFilter, setCatFilter] = useState("semua");
  const [cityFilter, setCityFilter] = useState("semua");
  const [search, setSearch]       = useState("");

  const archive = items.filter((i) => i.archived);
  const filtered = archive.filter((i) => {
    if (catFilter !== "semua" && i.category !== catFilter) return false;
    if (cityFilter !== "semua" && i.city !== cityFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!i.name.toLowerCase().includes(q) && !i.city.toLowerCase().includes(q) && !(i.notes || "").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const hasFilter = catFilter !== "semua" || cityFilter !== "semua" || search;

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
      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input className="input" placeholder="Cari nama, kota, atau catatan…"
          value={search} onChange={(e) => setSearch(e.target.value)} />
        {search && <button className="search-clear" onClick={() => setSearch("")}>✕</button>}
      </div>

      {archive.length > 0 && (
        <FilterBar items={archive}
          catFilter={catFilter} setCatFilter={setCatFilter}
          cityFilter={cityFilter} setCityFilter={setCityFilter} />
      )}

      {hasFilter && archive.length > 0 && (
        <div className="stats-bar">
          <span>{filtered.length} dari {archive.length} tempat</span>
        </div>
      )}

      <ItemList items={filtered} mode="archive"
        onVisit={() => {}} onRestore={handleRestore} onDelete={handleDelete}
        emptyState={
          hasFilter
            ? { icon: "🔍", title: "Tidak ada hasil", desc: "Coba ubah filter atau kata kunci." }
            : { icon: "✅", title: "Belum ada yang dikunjungi", desc: "Klik 'Sudah!' di tab Wishlist setelah berkunjung." }
        }
      />
    </div>
  );
}
