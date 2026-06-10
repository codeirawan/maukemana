import { useState } from "react";
import StarPicker from "../forms/StarPicker";
import { IconUtensils, IconCoffee, IconMapPin, IconBuilding, IconMap, IconCheck, IconRotateCCW, IconEdit, IconTrash, IconX } from "./Icons";

const CAT = {
  resto:  { Icon: IconUtensils, color: "#C84B31", label: "Resto" },
  cafe:   { Icon: IconCoffee,   color: "#8B5E3C", label: "Cafe" },
  tempat: { Icon: IconMapPin,   color: "#2D6A4F", label: "Tempat" },
  hotel:  { Icon: IconBuilding, color: "#1A5276", label: "Hotel" },
};
const DEFAULT_CAT = { Icon: IconMapPin, color: "#6B7280", label: "Lainnya" };
const PRIO_LBL    = { high: "Tinggi", med: "Sedang", low: "Rendah" };

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
  const cat = CAT[item.category] || DEFAULT_CAT;
  const { Icon } = cat;

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="sheet-head">
          <div className="sheet-handle" />
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            background: `${cat.color}22`, border: `1.5px solid ${cat.color}55`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: cat.color, marginBottom: ".5rem",
          }}>
            <Icon size={26} />
          </div>
          <div className="sheet-title" style={{ marginBottom: ".15rem" }}>{item.name}</div>
          <p className="sheet-subtitle">
            {cat.label}{item.city ? ` · ${item.city}` : ""}
          </p>
          <button className="sheet-close" onClick={onClose}><IconX size={16} /></button>
        </div>

        {/* Catatan */}
        {item.notes && (
          <div className="detail-note">"{item.notes}"</div>
        )}

        {/* Foto */}
        {item.photoUrl && (
          <img src={item.photoUrl} alt={item.name}
            style={{ width: "100%", borderRadius: 12, marginBottom: 16, objectFit: "cover", maxHeight: 200 }} />
        )}

        {/* Meta rows */}
        <div className="detail-meta">
          {item.scheduledAt && (
            <div className="detail-row">
              <span className="detail-key">Jadwal</span>
              <span className="detail-val">{fmtScheduled(item.scheduledAt)}</span>
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

        {/* Actions */}
        <div className="detail-actions">
          {item.mapsUrl?.startsWith("https://") && (
            <a className="maps-link-btn" href={item.mapsUrl} target="_blank" rel="noreferrer">
              <IconMap size={13} /> Lihat Peta
            </a>
          )}
          {mode === "wishlist" && (
            <button className="btn btn-action btn-sm" onClick={() => { onClose(); onVisit(item); }}>
              <IconCheck size={13} /> Sudah Dikunjungi!
            </button>
          )}
          {mode === "archive" && (
            <button className="btn btn-ghost btn-sm" onClick={() => { onRestore(item.id); onClose(); }}>
              <IconRotateCCW size={13} /> Kembalikan
            </button>
          )}
          {onEdit && (
            <button className="btn btn-ghost btn-sm" onClick={() => { onClose(); onEdit(item); }}>
              <IconEdit size={13} /> Edit
            </button>
          )}
          {!confirming ? (
            <button className="btn btn-ghost btn-sm" onClick={() => setConfirming(true)}>
              <IconTrash size={13} /> Hapus
            </button>
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
  );
}
