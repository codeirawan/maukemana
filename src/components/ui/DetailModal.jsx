import { useState } from "react";
import StarPicker from "../forms/StarPicker";

const CAT_EMOJI = { resto: "🍽️", cafe: "☕", tempat: "📍", hotel: "🏨" };
const CAT_COLOR = { resto: "#C84B31", cafe: "#8B5E3C", tempat: "#2D6A4F", hotel: "#1A5276" };
const PRIO_LBL  = { high: "Tinggi", med: "Sedang", low: "Rendah" };

function fmtScheduled(val) {
  if (!val) return null;
  try {
    return new Date(val).toLocaleString("id-ID", {
      weekday: "short", day: "numeric", month: "long",
      year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  } catch { return val; }
}

export default function DetailModal({ item, mode, onClose, onVisit, onRestore, onDelete, onEdit }) {
  const [confirming, setConfirming] = useState(false);

  function handleOverlay(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="detail-overlay" onClick={handleOverlay}>
      <div className="detail-sheet">
        <div className="detail-strip" style={{ background: CAT_COLOR[item.category] ?? "#64748B" }} />

        <div className="detail-head">
          <button className="detail-close" onClick={onClose}>✕</button>
          <span className="detail-icon">{CAT_EMOJI[item.category] ?? "📌"}</span>
          <div className="detail-name">{item.name}</div>
        </div>

        <div className="detail-body">
          {item.notes && <div className="detail-note">"{item.notes}"</div>}

          <div className="detail-meta">
            <div className="detail-row">
              <span className="detail-key">Kategori</span>
              <span className="detail-val">{item.category}</span>
            </div>
            {item.scheduledAt && (
              <div className="detail-row">
                <span className="detail-key">Jadwal</span>
                <span className="detail-val">{fmtScheduled(item.scheduledAt)}</span>
              </div>
            )}
            {item.city && (
              <div className="detail-row">
                <span className="detail-key">Kota</span>
                <span className="detail-val">{item.city}</span>
              </div>
            )}
            {item.priority && (
              <div className="detail-row">
                <span className="detail-key">Prioritas</span>
                <span className="detail-val">{PRIO_LBL[item.priority]}</span>
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

          {item.photoUrl && (
            <img src={item.photoUrl} alt={item.name}
              style={{ width: "100%", borderRadius: 12, marginBottom: 16, objectFit: "cover", maxHeight: 200 }} />
          )}

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
            {onEdit && (
              <button className="btn btn-ghost btn-sm" onClick={() => { onClose(); onEdit(item); }}>
                ✏️ Edit
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
