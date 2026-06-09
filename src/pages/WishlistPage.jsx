import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useItems } from "../hooks/useItems";
import AddForm from "../components/forms/AddForm";
import VisitModal from "../components/forms/VisitModal";
import FilterBar from "../components/items/FilterBar";
import ItemList from "../components/items/ItemList";

export default function WishlistPage({ showToast }) {
  const { user } = useAuth();
  const { items, addItem, markVisited } = useItems();
  const [showForm, setShowForm]       = useState(false);
  const [visitingItem, setVisiting]   = useState(null);
  const [catFilter, setCatFilter]     = useState("semua");
  const [cityFilter, setCityFilter]   = useState("semua");

  const wishlist = items.filter((i) => !i.archived);
  const filtered = wishlist.filter((i) => {
    if (catFilter !== "semua" && i.category !== catFilter) return false;
    if (cityFilter !== "semua" && i.city !== cityFilter) return false;
    return true;
  });

  async function handleVisitConfirm({ rating, photoUrl, photoPath }) {
    await markVisited(visitingItem.id, { rating, photoUrl, photoPath });
    setVisiting(null);
    showToast("Ditandai sudah dikunjungi! 🎉");
  }

  return (
    <div className="page-content">
      {!user && (
        <div className="sync-hint">
          <span>☁️ Login untuk sync ke semua perangkat</span>
        </div>
      )}

      {wishlist.length > 0 && (
        <FilterBar
          items={wishlist}
          catFilter={catFilter} setCatFilter={setCatFilter}
          cityFilter={cityFilter} setCityFilter={setCityFilter}
        />
      )}

      <ItemList
        items={filtered}
        mode="wishlist"
        onVisit={setVisiting}
        onRestore={() => {}}
        onDelete={() => {}}
        emptyState={
          catFilter !== "semua" || cityFilter !== "semua"
            ? { icon: "🔍", title: "Tidak ada hasil", desc: "Coba ubah filter kategori atau kota." }
            : { icon: "🗺️", title: "Daftar masih kosong", desc: "Tambah tempat yang ingin kamu kunjungi.", ctaLabel: "+ Tambah Sekarang", onCta: () => setShowForm(true) }
        }
      />

      {/* FAB */}
      <button className="fab" onClick={() => setShowForm(true)} title="Tambah tempat">
        +
      </button>

      {/* Bottom sheet form */}
      {showForm && (
        <div className="sheet-overlay" onClick={() => setShowForm(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <AddForm
              items={items}
              onAdd={addItem}
              onClose={() => setShowForm(false)}
              showToast={showToast}
            />
          </div>
        </div>
      )}

      {visitingItem && (
        <VisitModal
          item={visitingItem}
          onConfirm={handleVisitConfirm}
          onClose={() => setVisiting(null)}
        />
      )}
    </div>
  );
}
