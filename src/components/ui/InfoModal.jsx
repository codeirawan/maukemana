import { IconX, IconMapPin, IconCamera, IconCompass, IconCheck } from "./Icons";

const FEATURES = [
  { Icon: IconCompass, text: "Simpan tempat & resto yang ingin dikunjungi" },
  { Icon: IconMapPin,  text: "Atur kategori, prioritas, dan jadwal kunjungan" },
  { Icon: IconCamera,  text: "Foto & rating setelah berkunjung" },
  { Icon: IconCheck,   text: "Arsip otomatis ke Sudah Dikunjungi" },
];

export default function InfoModal({ onClose }) {
  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={e => e.stopPropagation()}>

        <div className="sheet-head">
          <div className="sheet-handle" />
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            background: "linear-gradient(135deg, #D97706, #F97316)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: ".5rem", fontSize: 24,
          }}>
            📍
          </div>
          <div className="sheet-title">Mau Ke Mana?</div>
          <p className="sheet-subtitle">Wishlist tempat & resto favoritmu</p>
          <button className="sheet-close" onClick={onClose}><IconX size={16} /></button>
        </div>

        <p style={{ fontSize: ".85rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
          Catat semua tempat yang pengin kamu datangi — dari resto hits, cafe estetik, sampai destinasi wisata. Tandai sudah dikunjungi, kasih rating, dan upload foto kenangannya.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "1.5rem" }}>
          {FEATURES.map(({ Icon, text }, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                background: "rgba(217,119,6,.12)", border: "1px solid rgba(217,119,6,.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#D97706",
              }}>
                <Icon size={16} />
              </div>
              <span style={{ fontSize: ".83rem", color: "var(--text)" }}>{text}</span>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: ".75rem", color: "var(--dim)" }}>v1.0 · dibuat dengan ☕</span>
          <button className="btn btn-primary btn-sm" onClick={onClose}>Oke, siap!</button>
        </div>

      </div>
    </div>
  );
}
