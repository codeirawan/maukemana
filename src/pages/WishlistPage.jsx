import { useState, useMemo } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, configValid } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useItems } from "../hooks/useItems";
import AddForm from "../components/forms/AddForm";
import VisitModal from "../components/forms/VisitModal";
import FilterBar from "../components/items/FilterBar";
import ItemList from "../components/items/ItemList";
import DetailModal from "../components/ui/DetailModal";

async function handleLogin() {
  try { await signInWithPopup(auth, new GoogleAuthProvider()); } catch { /* closed */ }
}

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

export default function WishlistPage({ showToast }) {
  const { user } = useAuth();
  const { items, addItem, markVisited, deleteItem } = useItems();
  const [showForm, setShowForm]       = useState(false);
  const [visitingItem, setVisiting]   = useState(null);
  const [selectedItem, setSelected]   = useState(null);
  const [catFilter, setCatFilter]     = useState("semua");
  const [cityFilter, setCityFilter]   = useState("semua");
  const [search, setSearch]           = useState("");
  const [sort, setSort]               = useState("newest");

  const wishlist = items.filter((i) => !i.archived);

  const filtered = useMemo(() => {
    let arr = wishlist;
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
  }, [wishlist, catFilter, cityFilter, search, sort]);

  const archiveCount = items.filter((i) => i.archived).length;
  const cities = [...new Set(items.map((i) => i.city).filter(Boolean))];

  async function handleVisitConfirm({ rating, photoUrl, photoPath }) {
    await markVisited(visitingItem.id, { rating, photoUrl, photoPath });
    setVisiting(null);
    showToast("Ditandai sudah dikunjungi! 🎉");
  }

  return (
    <div className="page-content">
      {configValid && !user && (
        <div className="login-banner">
          <span>☁️ Login untuk sync ke semua perangkat</span>
          <button className="btn btn-primary btn-sm" onClick={handleLogin}>Login</button>
        </div>
      )}

      <div className="page-header">
        <div className="page-eyebrow">Travel &amp; Kuliner</div>
        <div className="page-title">Mau Ke <em>Mana</em></div>
        <div className="page-sub">tempat yang ingin dikunjungi</div>
      </div>

      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-val">{wishlist.length}</div>
          <div className="stat-lbl">Wishlist</div>
        </div>
        <div className="stat-box">
          <div className="stat-val">{archiveCount}</div>
          <div className="stat-lbl">Sudah Visit</div>
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
            ? { icon: "🔍", title: "Tidak ada hasil", desc: "Coba ubah filter atau kata kunci." }
            : { icon: "🗺️", title: "Wishlist masih kosong", desc: "Tambah tempat yang ingin kamu kunjungi!", ctaLabel: "+ Tambah Tempat", onCta: () => setShowForm(true) }
        }
      />

      <button className="fab" onClick={() => setShowForm(true)} title="Tambah tempat">+</button>

      {showForm && (
        <div className="sheet-overlay" onClick={() => setShowForm(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <AddForm items={items} onAdd={addItem} onClose={() => setShowForm(false)} showToast={showToast} />
          </div>
        </div>
      )}

      {visitingItem && (
        <VisitModal item={visitingItem} onConfirm={handleVisitConfirm} onClose={() => setVisiting(null)} />
      )}

      {selectedItem && (
        <DetailModal
          item={selectedItem}
          mode="wishlist"
          onClose={() => setSelected(null)}
          onVisit={(item) => { setSelected(null); setVisiting(item); }}
          onRestore={() => {}}
          onDelete={async (id, path) => {
            await deleteItem(id, path);
            setSelected(null);
            showToast("Dihapus");
          }}
        />
      )}
    </div>
  );
}
