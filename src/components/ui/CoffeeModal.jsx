import { IconX } from "./Icons";

export default function CoffeeModal({ onClose }) {
  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="bottom-sheet"
        style={{ textAlign: "center", width: "calc(100% - 48px)", maxWidth: 420, borderRadius: 20, marginBottom: "max(16px, env(safe-area-inset-bottom))", paddingBottom: "1.5rem" }}
        onClick={e => e.stopPropagation()}>

        <div className="sheet-head">
          <div className="sheet-handle" />
          <div style={{ fontSize: "2.2rem", marginBottom: ".5rem", animation: "bounce 1s infinite" }}>☕</div>
          <div className="sheet-title">Support Developer</div>
          <p className="sheet-subtitle">Scan QRIS di bawah untuk traktir kopi</p>
          <button className="sheet-close" onClick={onClose}><IconX size={16} /></button>
        </div>

        <img
          src="/qris.jpeg"
          alt="QRIS"
          style={{ width: "100%", maxWidth: 260, borderRadius: 12, marginBottom: ".75rem" }}
        />
        <p style={{ fontSize: ".78rem", color: "var(--muted)" }}>Terima kasih! 🙏</p>

      </div>
    </div>
  );
}
