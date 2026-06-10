import { useState, useMemo } from "react";
import { useItems } from "../context/ItemsContext";
import VisitModal from "../components/forms/VisitModal";
import FilterBar from "../components/items/FilterBar";
import ItemList from "../components/items/ItemList";
import DetailModal from "../components/ui/DetailModal";
import { IconSearchX, IconCompass } from "../components/ui/Icons";

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

export default function WishlistPage({ showToast, onEditItem }) {
  const { items, markVisited, deleteItem } = useItems();
  const [visitingItem, setVisiting]  = useState(null);
  const [selectedItem, setSelected]  = useState(null);
  const [catFilter, setCatFilter]    = useState("semua");
  const [cityFilter, setCityFilter]  = useState("semua");
  const [search, setSearch]          = useState("");
  const [sort, setSort]              = useState("newest");

  const wishlist = useMemo(() => items.filter(i => !i.archived), [items]);

  const filtered = useMemo(() => {
    let arr = wishlist;
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
  }, [wishlist, catFilter, cityFilter, search, sort]);

  async function handleVisitConfirm({ rating, photoUrl, photoPath }) {
    await markVisited(visitingItem.id, { rating, photoUrl, photoPath });
    setVisiting(null);
    showToast("Ditandai sudah dikunjungi!");
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

      <FilterBar
        items={wishlist}
        catFilter={catFilter} setCatFilter={setCatFilter}
        cityFilter={cityFilter} setCityFilter={setCityFilter}
        sort={sort} setSort={setSort}
        totalFiltered={filtered.length}
      />

      <ItemList
        items={filtered} mode="wishlist"
        onVisit={setVisiting} onRestore={() => {}} onDelete={() => {}}
        onCardClick={setSelected}
        emptyState={
          search || catFilter !== "semua" || cityFilter !== "semua"
            ? { icon: <IconSearchX size={48} />, title: "Tidak ada hasil", desc: "Coba ubah filter atau kata kunci." }
            : { icon: <IconCompass size={48} />, title: "Itinerary masih kosong", desc: "Tambah tempat yang ingin kamu kunjungi!" }
        }
      />

      {visitingItem && (
        <div className="sheet-overlay" onClick={() => setVisiting(null)}>
          <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
            <VisitModal item={visitingItem} onConfirm={handleVisitConfirm} onClose={() => setVisiting(null)} />
          </div>
        </div>
      )}

      {selectedItem && (
        <DetailModal
          item={selectedItem}
          mode="wishlist"
          onClose={() => setSelected(null)}
          onVisit={item => { setSelected(null); setVisiting(item); }}
          onRestore={() => {}}
          onEdit={onEditItem ? item => { setSelected(null); onEditItem(item); } : null}
          onDelete={async (id, path) => {
            await deleteItem(id, path);
            setSelected(null);
            showToast("Tempat berhasil dihapus!");
          }}
        />
      )}
    </>
  );
}
