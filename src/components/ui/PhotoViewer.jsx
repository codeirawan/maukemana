export default function PhotoViewer({ url, name, onClose }) {
  if (!url) return null;
  return (
    <div className="sheet-overlay" style={{ alignItems: "center", background: "rgba(0,0,0,.88)" }} onClick={onClose}>
      <img
        src={url}
        alt={name}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "92vw", maxHeight: "88vh", borderRadius: 12, objectFit: "contain" }}
      />
    </div>
  );
}
