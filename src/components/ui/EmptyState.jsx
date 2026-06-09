export default function EmptyState({ icon, title, desc, ctaLabel, onCta }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <div className="empty-state-title">{title}</div>
      {desc && <p>{desc}</p>}
      {ctaLabel && (
        <button className="btn btn-primary" onClick={onCta}>
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
