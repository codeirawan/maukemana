import { useState } from "react";
import { useItems } from "../hooks/useItems";
import FilterBar from "../components/items/FilterBar";
import ItemList from "../components/items/ItemList";

export default function ArchivePage({ showToast }) {
  const { items, restoreItem, deleteItem } = useItems();
  const [catFilter, setCatFilter] = useState("semua");
  const [cityFilter, setCityFilter] = useState("semua");

  const archive = items.filter((i) => i.archived);

  const filtered = archive.filter((i) => {
    if (catFilter !== "semua" && i.category !== catFilter) return false;
    if (cityFilter !== "semua" && i.city !== cityFilter) return false;
    return true;
  });

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
      {archive.length > 0 && (
        <FilterBar
          items={archive}
          catFilter={catFilter} setCatFilter={setCatFilter}
          cityFilter={cityFilter} setCityFilter={setCityFilter}
        />
      )}

      <ItemList
        items={filtered}
        mode="archive"
        onVisit={() => {}}
        onRestore={handleRestore}
        onDelete={handleDelete}
        emptyState={
          catFilter !== "semua" || cityFilter !== "semua"
            ? { icon: "🔍", title: "Tidak ada hasil", desc: "Coba ubah filter." }
            : { icon: "✅", title: "Belum ada yang dikunjungi", desc: "Klik 'Sudah!' di tab Wishlist setelah berkunjung." }
        }
      />
    </div>
  );
}
