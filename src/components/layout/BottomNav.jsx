export default function BottomNav({ tab, onTab, wishlistCount, archiveCount }) {
  return (
    <nav className="bottom-nav">
      <button
        className={`bottom-nav-btn${tab === "wishlist" ? " active" : ""}`}
        onClick={() => onTab("wishlist")}
      >
        <span className="bottom-nav-icon">🗺️</span>
        <span className="bottom-nav-label">Wishlist</span>
        {wishlistCount > 0 && (
          <span className="bottom-nav-badge">{wishlistCount > 99 ? "99+" : wishlistCount}</span>
        )}
      </button>
      <button
        className={`bottom-nav-btn${tab === "archive" ? " active" : ""}`}
        onClick={() => onTab("archive")}
      >
        <span className="bottom-nav-icon">✅</span>
        <span className="bottom-nav-label">Sudah</span>
        {archiveCount > 0 && (
          <span className="bottom-nav-badge">{archiveCount > 99 ? "99+" : archiveCount}</span>
        )}
      </button>
    </nav>
  );
}
