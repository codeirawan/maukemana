import { useState } from "react";
import StarPicker from "../forms/StarPicker";
import PhotoViewer from "../ui/PhotoViewer";

const CATEGORY_EMOJI = { resto: "🍽️", cafe: "☕", tempat: "📍", hotel: "🏨" };
const PRICE_LABELS   = { 1: "$", 2: "$$", 3: "$$$" };

export default function ItemRow({ item, mode, onVisit, onRestore, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const [viewPhoto, setViewPhoto]   = useState(false);

  return (
    <>
      <div className="item-card">
        {/* Thumbnail */}
        <div
          className="item-thumb"
          onClick={() => item.photoUrl && setViewPhoto(true)}
          style={{ cursor: item.photoUrl ? "zoom-in" : "default" }}
        >
          {item.photoUrl
            ? <img src={item.photoUrl} alt={item.name} />
            : <span>{CATEGORY_EMOJI[item.category] ?? "📌"}</span>}
        </div>

        {/* Body */}
        <div className="item-body">
          <div className="item-name">{item.name}</div>

          <div className="item-meta">
            <span className="item-cat-badge">{CATEGORY_EMOJI[item.category]} {item.category}</span>
            <span className="item-city">📍 {item.city}</span>
            {item.priceRange && (
              <span className="item-price">{PRICE_LABELS[item.priceRange]}</span>
            )}
          </div>

          {item.rating && (
            <div style={{ marginTop: ".25rem" }}>
              <StarPicker value={item.rating} onChange={() => {}} readonly />
            </div>
          )}

          {item.notes && <div className="item-notes">"{item.notes}"</div>}

          <div className="item-footer">
            {item.mapsUrl && (
              <a className="maps-link" href={item.mapsUrl} target="_blank" rel="noreferrer">
                🗺️ Lihat peta
              </a>
            )}
            {mode === "archive" && item.visitedAt && (
              <span className="visited-date">
                ✅ {new Date(item.visitedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="item-actions">
          {mode === "wishlist" && (
            <button className="btn-sudah" onClick={() => onVisit(item)}>
              Sudah!
            </button>
          )}

          {mode === "archive" && !confirming && (
            <>
              <button className="btn-icon" title="Kembalikan ke wishlist" onClick={() => onRestore(item.id)}>↩</button>
              <button className="btn-icon btn-icon-danger" title="Hapus" onClick={() => setConfirming(true)}>🗑</button>
            </>
          )}

          {mode === "archive" && confirming && (
            <div className="confirm-inline">
              <span className="text-xs">Hapus?</span>
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
