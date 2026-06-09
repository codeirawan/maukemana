export default function PhotoViewer({ url, name, onClose }) {
  if (!url) return null;
  return (
    <div className="overlay" onClick={onClose}>
      <img
        src={url}
        alt={name}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "90vw", maxHeight: "85vh", borderRadius: "var(--radius)", objectFit: "contain" }}
      />
    </div>
  );
}
