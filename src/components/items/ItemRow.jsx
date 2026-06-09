import { useState } from "react";
import StarPicker from "../forms/StarPicker";

const CAT_EMOJI = { resto: "🍽️", cafe: "☕", tempat: "📍", hotel: "🏨" };
const CAT_STRIP = { resto: "var(--cat-resto)", cafe: "var(--cat-cafe)", tempat: "var(--cat-tempat)", hotel: "var(--cat-hotel)" };
const CAT_MB    = { resto: "mb-resto", cafe: "mb-cafe", tempat: "mb-tempat", hotel: "mb-hotel" };
const PRICE_LBL = { 1: "$", 2: "$$", 3: "$$$" };
const PRIO_LBL  = { high: "Tinggi", med: "Sedang", low: "Rendah" };
const PRIO_CLS  = { high: "prio-high", med: "prio-med", low: "prio-low" };

export default function ItemRow({ item, mode, onVisit, onRestore, onDelete, onCardClick }) {
  const [confirming, setConfirming] = useState(false);

  function handleClick(e) {
    if (e.target.closest(".item-card-actions")) return;
    onCardClick?.(item);
  }

  return (
    <div className="item-card" onClick={handleClick}>
      <div className="item-strip" style={{ background: CAT_STRIP[item.category] ?? "#64748B" }} />

      <div className="item-card-body">
        <div className="item-card-head">
          <span className="item-cat-icon">{CAT_EMOJI[item.category] ?? "📌"}</span>
          <span className="item-name">{item.name}</span>
        </div>

        <div className="item-meta">
          <span className="meta-city">{item.city}</span>
          <span className="meta-dot">·</span>
          <span className={`meta-badge ${CAT_MB[item.category] ?? ""}`}>{item.category}</span>
          {item.priority && (
            <>
              <span className="meta-dot">·</span>
              <span className={`meta-badge ${PRIO_CLS[item.priority] ?? ""}`}>{PRIO_LBL[item.priority]}</span>
            </>
          )}
          {item.priceRange && (
            <>
              <span className="meta-dot">·</span>
              <span className="meta-badge mb-price">{PRICE_LBL[item.priceRange]}</span>
            </>
          )}
          {mode === "archive" && item.visitedAt && (
            <>
              <span className="meta-dot">·</span>
              <span className="meta-badge mb-visited">✓ Sudah</span>
            </>
          )}
        </div>

        {item.rating && <StarPicker value={item.rating} onChange={() => {}} readonly />}

        {item.notes && <div className="item-note">"{item.notes}"</div>}
      </div>

      <div className="item-card-actions">
        {mode === "wishlist" && (
          <button className="btn-sudah" onClick={(e) => { e.stopPropagation(); onVisit(item); }}>
            Sudah!
          </button>
        )}

        {mode === "archive" && !confirming && (
          <>
            <button className="btn-icon" title="Kembalikan ke wishlist"
              onClick={(e) => { e.stopPropagation(); onRestore(item.id); }}>↩</button>
            <button className="btn-icon btn-icon-danger" title="Hapus"
              onClick={(e) => { e.stopPropagation(); setConfirming(true); }}>🗑</button>
          </>
        )}

        {mode === "archive" && confirming && (
          <div className="confirm-inline" onClick={(e) => e.stopPropagation()}>
            <span className="text-xs">Hapus?</span>
            <button className="btn btn-danger btn-sm" onClick={() => onDelete(item.id, item.photoPath)}>Ya</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setConfirming(false)}>Tdk</button>
          </div>
        )}
      </div>
    </div>
  );
}
