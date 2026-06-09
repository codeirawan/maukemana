import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, configValid } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useItems } from "../hooks/useItems";
import AddForm from "../components/forms/AddForm";
import VisitModal from "../components/forms/VisitModal";
import FilterBar from "../components/items/FilterBar";
import ItemList from "../components/items/ItemList";

async function handleLogin() {
  try { await signInWithPopup(auth, new GoogleAuthProvider()); } catch { /* closed */ }
}

export default function WishlistPage({ showToast }) {
  const { user } = useAuth();
  const { items, addItem, markVisited } = useItems();
  const [showForm, setShowForm]     = useState(false);
  const [visitingItem, setVisiting] = useState(null);
  const [catFilter, setCatFilter]   = useState("semua");
  const [cityFilter, setCityFilter] = useState("semua");
  const [search, setSearch]         = useState("");

  const wishlist = items.filter((i) => !i.archived);
  const filtered = wishlist.filter((i) => {
    if (catFilter !== "semua" && i.category !== catFilter) return false;
    if (cityFilter !== "semua" && i.city !== cityFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!i.name.toLowerCase().includes(q) && !i.city.toLowerCase().includes(q) && !(i.notes || "").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const hasFilter = catFilter !== "semua" || cityFilter !== "semua" || search;

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

      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input className="input" placeholder="Cari nama, kota, atau catatan…"
          value={search} onChange={(e) => setSearch(e.target.value)} />
        {search && <button className="search-clear" onClick={() => setSearch("")}>✕</button>}
      </div>

      {wishlist.length > 0 && (
        <FilterBar items={wishlist}
          catFilter={catFilter} setCatFilter={setCatFilter}
          cityFilter={cityFilter} setCityFilter={setCityFilter} />
      )}

      {hasFilter && wishlist.length > 0 && (
        <div className="stats-bar">
          <span>{filtered.length} dari {wishlist.length} tempat</span>
        </div>
      )}

      <ItemList items={filtered} mode="wishlist"
        onVisit={setVisiting} onRestore={() => {}} onDelete={() => {}}
        emptyState={
          hasFilter
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
    </div>
  );
}
