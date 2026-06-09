export default function TabBar({ tab, onTab, wishlistCount, archiveCount }) {
  return (
    <nav className="tabbar">
      <button className={`tab-btn${tab === "wishlist" ? " active" : ""}`} onClick={() => onTab("wishlist")}>
        🗺️ Ingin Dikunjungi
        {wishlistCount > 0 && (
          <span className="badge badge-primary">{wishlistCount}</span>
        )}
      </button>
      <button className={`tab-btn${tab === "archive" ? " active" : ""}`} onClick={() => onTab("archive")}>
        ✅ Sudah Dikunjungi
        {archiveCount > 0 && (
          <span className="badge badge-muted">{archiveCount}</span>
        )}
      </button>
    </nav>
  );
}
