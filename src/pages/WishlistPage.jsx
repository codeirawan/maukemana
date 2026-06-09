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
  const [showForm, setShowForm] = useState(false);
  const [visitingItem, setVisitingItem] = useState(null);
  const [catFilter, setCatFilter] = useState("semua");
  const [cityFilter, setCityFilter] = useState("semua");

  const wishlist = items.filter((i) => !i.archived);

  const filtered = wishlist.filter((i) => {
    if (catFilter !== "semua" && i.category !== catFilter) return false;
    if (cityFilter !== "semua" && i.city !== cityFilter) return false;
    return true;
  });

  async function handleVisitConfirm({ rating, photoUrl, photoPath }) {
    await markVisited(visitingItem.id, { rating, photoUrl, photoPath });
    setVisitingItem(null);
    showToast("Ditandai sudah dikunjungi!");
  }

  return (
    <div className="page-content">
      {!user && (
        <div className="auth-prompt">
          <p>Login untuk sync data ke semua perangkat</p>
        </div>
      )}

      {showForm
        ? <AddForm items={items} onAdd={addItem} onCancel={() => setShowForm(false)} showToast={showToast} />
        : (
          <button className="btn btn-primary" style={{ width: "100%", marginBottom: "1rem" }} onClick={() => setShowForm(true)}>
            + Tambah Tempat
          </button>
        )
      }

      {wishlist.length > 0 && (
        <FilterBar
          items={wishlist}
          catFilter={catFilter} setCatFilter={(v) => { setCatFilter(v); }}
          cityFilter={cityFilter} setCityFilter={(v) => { setCityFilter(v); }}
        />
      )}

      <ItemList
        items={filtered}
        mode="wishlist"
        onVisit={setVisitingItem}
        onRestore={() => {}}
        onDelete={() => {}}
        emptyState={
          catFilter !== "semua" || cityFilter !== "semua"
            ? { icon: "🔍", title: "Tidak ada hasil", desc: "Coba ubah filter kategori atau kota." }
            : { icon: "🗺️", title: "Daftar masih kosong", desc: "Tambah tempat yang ingin kamu kunjungi.", ctaLabel: "+ Tambah Sekarang", onCta: () => setShowForm(true) }
        }
      />

      {visitingItem && (
        <VisitModal item={visitingItem} onConfirm={handleVisitConfirm} onClose={() => setVisitingItem(null)} />
      )}
    </div>
  );
}
