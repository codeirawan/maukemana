import { useState, useMemo } from "react";
import { useItems } from "../context/ItemsContext";
import FilterBar from "../components/items/FilterBar";
import ArchiveGrid from "../components/items/ArchiveGrid";
import DetailModal from "../components/ui/DetailModal";
import { IconSearchX, IconCheck } from "../components/ui/Icons";

function sortItems(arr, sort) {
  const copy = [...arr];
  if (sort === "oldest")   return copy.sort((a, b) => (a.addedAt || "").localeCompare(b.addedAt || ""));
  if (sort === "name_az")  return copy.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "rating")   return copy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  if (sort === "priority") {
    const order = { high: 0, med: 1, low: 2 };
    return copy.sort((a, b) => (order[a.priority] ?? 3) - (order[b.priority] ?? 3));
  }
  return copy.sort((a, b) => (b.visitedAt || b.addedAt || "").localeCompare(a.visitedAt || a.addedAt || ""));
}

export default function ArchivePage({ showToast, onEditItem }) {
  const { items, restoreItem, deleteItem } = useItems();
  const [catFilter, setCatFilter]   = useState("semua");
  const [cityFilter, setCityFilter] = useState("semua");
  const [search, setSearch]         = useState("");
  const [sort, setSort]             = useState("newest");
  const [selectedItem, setSelected] = useState(null);

  const archive = items.filter(i => i.archived);

  const filtered = useMemo(() => {
    let arr = archive;
    if (catFilter !== "semua") arr = arr.filter(i => i.category === catFilter);
    if (cityFilter !== "semua") arr = arr.filter(i => i.city === cityFilter);
    if (search) {
      const q = search.toLowerCase();
      arr = arr.filter(i =>
        i.name.toLowerCase().includes(q) ||
        (i.city || "").toLowerCase().includes(q) ||
        (i.notes || "").toLowerCase().includes(q)
      );
    }
    return sortItems(arr, sort);
  }, [archive, catFilter, cityFilter, search, sort]);

  async function handleRestore(id) {
    await restoreItem(id);
    showToast("Dipindahkan kembali ke rencana");
  }

  async function handleDelete(id, photoPath) {
    await deleteItem(id, photoPath);
    showToast("Dihapus");
  }

  return (
    <>
      <div style={{ position: "relative" }}>
        <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input className="input" style={{ paddingLeft: 34 }} placeholder="Cari nama, kota, atau catatan…"
          value={search} onChange={e => setSearch(e.target.value)} />
        {search && <button style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: "1rem" }} onClick={() => setSearch("")}>✕</button>}
      </div>

      <div style={{ marginBottom: 10 }} />

      {archive.length > 0 && (
        <FilterBar
          items={archive}
          catFilter={catFilter} setCatFilter={setCatFilter}
          cityFilter={cityFilter} setCityFilter={setCityFilter}
          sort={sort} setSort={setSort}
          totalFiltered={filtered.length}
        />
      )}

      <ArchiveGrid
        items={filtered}
        onCardClick={setSelected}
        emptyState={
          search || catFilter !== "semua" || cityFilter !== "semua"
            ? { icon: <IconSearchX size={48} />, title: "Tidak ada hasil", desc: "Coba ubah filter atau kata kunci." }
            : { icon: <IconCheck size={48} />, title: "Belum ada yang dikunjungi", desc: "Klik 'Sudah!' setelah berkunjung ke suatu tempat." }
        }
      />

      {selectedItem && (
        <DetailModal
          item={selectedItem}
          mode="archive"
          onClose={() => setSelected(null)}
          onVisit={() => {}}
          onEdit={onEditItem ? item => { setSelected(null); onEditItem(item); } : null}
          onRestore={async id => { await handleRestore(id); setSelected(null); }}
          onDelete={async (id, path) => { await handleDelete(id, path); setSelected(null); }}
        />
      )}
    </>
  );
}
