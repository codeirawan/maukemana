import { useState } from "react";
import StarPicker from "../forms/StarPicker";

const CAT_EMOJI  = { resto: "🍽️", cafe: "☕", tempat: "📍", hotel: "🏨" };
const CAT_STRIP  = { resto: "var(--cat-resto)", cafe: "var(--cat-cafe)", tempat: "var(--cat-tempat)", hotel: "var(--cat-hotel)" };
const PRICE_LBL  = { 1: "$ — Murah", 2: "$$ — Sedang", 3: "$$$ — Mahal" };
const PRIO_LBL   = { high: "Tinggi", med: "Sedang", low: "Rendah" };

export default function DetailModal({ item, mode, onClose, onVisit, onRestore, onDelete }) {
  const [confirming, setConfirming] = useState(false);

  function handleOverlay(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="detail-overlay" onClick={handleOverlay}>
      <div className="detail-sheet">
        <div className="detail-strip" style={{ background: CAT_STRIP[item.category] ?? "#64748B" }} />

        <div className="detail-head">
          <button className="detail-close" onClick={onClose}>✕</button>
          <span className="detail-icon">{CAT_EMOJI[item.category] ?? "📌"}</span>
          <div className="detail-name">{item.name}</div>
        </div>

        <div className="detail-body">
          {item.notes && <div className="detail-note">"{item.notes}"</div>}

          <div className="detail-meta">
            <div className="detail-row">
              <span className="detail-key">Kota</span>
              <span className="detail-val">{item.city}</span>
            </div>
            <div className="detail-row">
              <span className="detail-key">Kategori</span>
              <span className="detail-val">{item.category}</span>
            </div>
            {item.priority && (
              <div className="detail-row">
                <span className="detail-key">Prioritas</span>
                <span className="detail-val">{PRIO_LBL[item.priority]}</span>
              </div>
            )}
            {item.priceRange && (
              <div className="detail-row">
                <span className="detail-key">Harga</span>
                <span className="detail-val">{PRICE_LBL[item.priceRange]}</span>
              </div>
            )}
            {item.rating && (
              <div className="detail-row">
                <span className="detail-key">Rating</span>
                <span className="detail-val"><StarPicker value={item.rating} onChange={() => {}} readonly /></span>
              </div>
            )}
            {item.address && (
              <div className="detail-row">
                <span className="detail-key">Alamat</span>
                <span className="detail-val" style={{ fontSize: ".8rem" }}>{item.address}</span>
              </div>
            )}
            {mode === "archive" && item.visitedAt && (
              <div className="detail-row">
                <span className="detail-key">Dikunjungi</span>
                <span className="detail-val">
                  {new Date(item.visitedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
            )}
            <div className="detail-row">
              <span className="detail-key">Ditambah</span>
              <span className="detail-val">
                {new Date(item.addedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
          </div>

          <div className="detail-actions">
            {item.mapsUrl && (
              <a className="maps-link-btn" href={item.mapsUrl} target="_blank" rel="noreferrer">
                🗺️ Lihat Peta
              </a>
            )}
            {mode === "wishlist" && (
              <button className="btn btn-action btn-sm" onClick={() => { onClose(); onVisit(item); }}>
                ✅ Sudah Dikunjungi!
              </button>
            )}
            {mode === "archive" && (
              <button className="btn btn-ghost btn-sm" onClick={() => { onRestore(item.id); onClose(); }}>
                ↩ Kembalikan
              </button>
            )}
            {!confirming ? (
              <button className="btn btn-ghost btn-sm" onClick={() => setConfirming(true)}>🗑 Hapus</button>
            ) : (
              <div className="detail-confirm">
                <span>Hapus permanen?</span>
                <button className="btn btn-danger btn-sm" onClick={() => { onDelete(item.id, item.photoPath); onClose(); }}>Ya</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setConfirming(false)}>Tidak</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
