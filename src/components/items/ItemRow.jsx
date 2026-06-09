import { useState } from "react";
import StarPicker from "../forms/StarPicker";
import PhotoViewer from "../ui/PhotoViewer";

const CATEGORY_EMOJI = { resto: "🍽️", cafe: "☕", tempat: "📍", hotel: "🏨" };
const PRICE_LABELS = { 1: "$", 2: "$$", 3: "$$$" };

export default function ItemRow({ item, mode, onVisit, onRestore, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const [viewPhoto, setViewPhoto] = useState(false);

  const thumb = (
    <div className="item-thumb" onClick={() => item.photoUrl && setViewPhoto(true)}
      title={item.photoUrl ? "Lihat foto" : ""}>
      {item.photoUrl
        ? <img src={item.photoUrl} alt={item.name} />
        : CATEGORY_EMOJI[item.category] ?? "📌"}
    </div>
  );

  return (
    <>
      <div className="item-card">
        {thumb}

        <div className="item-body">
          <div className="item-name">{item.name}</div>
          <div className="item-meta">
            <span className="badge badge-purple">{item.category}</span>
            <span className="badge badge-muted">📍 {item.city}</span>
            {item.priceRange && <span className="price-range">{PRICE_LABELS[item.priceRange]}</span>}
            {item.rating && <StarPicker value={item.rating} onChange={() => {}} readonly />}
            {item.mapsUrl && (
              <a className="maps-link" href={item.mapsUrl} target="_blank" rel="noreferrer">
                🗺️ Maps
              </a>
            )}
          </div>
          {item.notes && <div className="item-notes">{item.notes}</div>}
          {mode === "archive" && item.visitedAt && (
            <div className="visited-date">
              Dikunjungi {new Date(item.visitedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
            </div>
          )}
        </div>

        <div className="item-actions">
          {mode === "wishlist" && (
            <button className="btn btn-primary btn-sm" onClick={() => onVisit(item)}>
              Sudah!
            </button>
          )}

          {mode === "archive" && !confirming && (
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => onRestore(item.id)}>
                ↩ Batal
              </button>
              <button className="btn btn-ghost btn-sm" style={{ color: "#ef4444" }} onClick={() => setConfirming(true)}>
                ✕
              </button>
            </>
          )}

          {mode === "archive" && confirming && (
            <div className="confirm-row">
              <span>Hapus?</span>
              <button className="btn btn-danger btn-sm" onClick={() => onDelete(item.id, item.photoPath)}>Ya</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setConfirming(false)}>Tidak</button>
            </div>
          )}
        </div>
      </div>

      {viewPhoto && <PhotoViewer url={item.photoUrl} name={item.name} onClose={() => setViewPhoto(false)} />}
    </>
  );
}
