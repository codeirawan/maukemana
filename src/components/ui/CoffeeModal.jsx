export default function CoffeeModal({ onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ textAlign: "center" }}>
        <button className="btn-icon modal-close" onClick={onClose}>✕</button>
        <div style={{ fontSize: "2.5rem", marginBottom: ".5rem", animation: "bounce 1s infinite" }}>☕</div>
        <div className="modal-title">Support Developer</div>
        <p className="text-muted" style={{ marginBottom: "1rem" }}>
          Scan QRIS di bawah untuk traktir kopi
        </p>
        <img
          src="/qris.jpeg"
          alt="QRIS"
          style={{ width: "100%", maxWidth: 260, borderRadius: "var(--radius-sm)" }}
        />
        <p className="text-xs text-muted" style={{ marginTop: ".75rem" }}>Terima kasih! 🙏</p>
      </div>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}`}</style>
    </div>
  );
}
