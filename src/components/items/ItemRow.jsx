import { useState } from "react";
import StarPicker from "../forms/StarPicker";
import { IconUtensils, IconCoffee, IconMapPin, IconBuilding } from "../ui/Icons";

const CAT = {
  resto:  { Icon: IconUtensils, color: "#C84B31", label: "Resto" },
  cafe:   { Icon: IconCoffee,   color: "#8B5E3C", label: "Cafe" },
  tempat: { Icon: IconMapPin,   color: "#2D6A4F", label: "Tempat" },
  hotel:  { Icon: IconBuilding, color: "#1A5276", label: "Hotel" },
};
const DEFAULT_CAT = { Icon: IconMapPin, color: "#6B7280", label: "Lainnya" };

const PRIO_LBL   = { high: "Tinggi", med: "Sedang", low: "Rendah" };
const PRIO_COLOR = { high: "#F87171", med: "#D97706", low: "#94A3B8" };

function fmtDate(val) {
  if (!val) return null;
  try { return new Date(val).toLocaleDateString("id-ID", { day: "numeric", month: "short" }); }
  catch { return null; }
}

export default function ItemRow({ item, mode, onVisit, onRestore, onDelete, onCardClick }) {
  const [confirming, setConfirming] = useState(false);
  const cat = CAT[item.category] || DEFAULT_CAT;
  const { Icon } = cat;

  const badgeBg  = `${cat.color}22`;
  const badgeBdr = `1.5px solid ${cat.color}44`;

  function handleClick(e) {
    if (e.target.closest(".item-card-right")) return;
    onCardClick?.(item);
  }

  return (
    <div className="item-card" onClick={handleClick}>
      {/* Icon badge */}
      <div style={{
        width: 42, height: 42, borderRadius: 13, flexShrink: 0,
        background: badgeBg, border: badgeBdr,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: cat.color,
      }}>
        <Icon size={20} />
      </div>

      {/* Body */}
      <div className="item-card-body">
        <div className="item-name">{item.name}</div>
        <div className="item-meta">
          <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 50, background: badgeBg, color: cat.color, letterSpacing: .5 }}>
            {cat.label}
          </span>
          {item.city && <span className="item-city-label">📍 {item.city}</span>}
          {item.scheduledAt && (
            <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 50, background: "rgba(217,119,6,.12)", color: "#D97706", letterSpacing: .5 }}>
              📅 {fmtDate(item.scheduledAt)}
            </span>
          )}
          {item.priority && (
            <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 50, background: `${PRIO_COLOR[item.priority]}22`, color: PRIO_COLOR[item.priority], letterSpacing: .5 }}>
              {PRIO_LBL[item.priority]}
            </span>
          )}
          {mode === "archive" && item.visitedAt && (
            <span className="visited-badge">✓ Sudah</span>
          )}
        </div>
        {item.rating && <div style={{ marginTop: 3 }}><StarPicker value={item.rating} onChange={() => {}} readonly /></div>}
        {item.notes && <div className="item-note">"{item.notes}"</div>}
      </div>

      {/* Right actions */}
      <div className="item-card-right" onClick={e => e.stopPropagation()}>
        {mode === "wishlist" && !confirming && (
          <button className="item-sudah-btn" onClick={() => onVisit(item)}>Sudah!</button>
        )}

        {mode === "archive" && !confirming && (
          <>
            <button className="item-action-btn" title="Kembalikan ke rencana" onClick={() => onRestore(item.id)}>↩</button>
            <button className="item-action-btn item-action-btn-del" title="Hapus" onClick={() => setConfirming(true)}>×</button>
          </>
        )}

        {confirming && (
          <div className="item-confirm-inline">
            <span className="item-confirm-label">Hapus?</span>
            <button className="btn-danger" onClick={() => onDelete(item.id, item.photoPath)}>Ya</button>
            <button style={{ padding: "4px 10px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--muted)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }} onClick={() => setConfirming(false)}>Tidak</button>
          </div>
        )}
      </div>
    </div>
  );
}
