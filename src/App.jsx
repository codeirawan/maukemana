import { useState, useEffect } from "react";
import { configValid } from "./firebase";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ItemsProvider, useItems } from "./context/ItemsContext";
import { useToast } from "./hooks/useToast";
import AppHeader from "./components/layout/AppHeader";
import WishlistPage from "./pages/WishlistPage";
import ArchivePage from "./pages/ArchivePage";
import AddForm from "./components/forms/AddForm";
import Toast from "./components/ui/Toast";
import MaintenancePage from "./components/ui/MaintenancePage";

const RencanaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const SudahIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

function AppShell() {
  const { authLoading } = useAuth();
  const { items, addItem, updateItem } = useItems();
  const { toast, showToast } = useToast();
  const [tab, setTab]           = useState("wishlist");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [dark, setDark]         = useState(() => {
    const s = localStorage.getItem("mkm_theme");
    if (s) return s === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("mkm_theme", dark ? "dark" : "light");
  }, [dark]);

  if (!configValid) return <MaintenancePage />;
  if (authLoading) return (
    <div className="app-wrap">
      <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid var(--border)", borderTopColor: "#D97706", animation: "spin .8s linear infinite", margin: "0 auto 12px" }} />
      </div>
    </div>
  );

  const wishlistCount   = items.filter(i => !i.archived).length;
  const scheduledCount  = items.filter(i => !i.archived && i.scheduledAt).length;
  const archiveCount    = items.filter(i => i.archived).length;

  return (
    <div className="app-wrap">
      <div className="orb-a" /><div className="orb-b" />

      <div className="page">
        <AppHeader dark={dark} onToggle={() => setDark(d => !d)} />

        <div className="stats-strip">
          <div className="stat-card" style={{ background: "linear-gradient(135deg, #D97706, #F97316)", boxShadow: "0 4px 16px rgba(217,119,6,.3)" }}>
            <div className="stat-card-label">Rencana</div>
            <div className="stat-card-val">{wishlistCount}</div>
          </div>
          <div className="stat-card" style={{ background: "linear-gradient(135deg, #0284C7, #38BDF8)", boxShadow: "0 4px 16px rgba(2,132,199,.25)" }}>
            <div className="stat-card-label">Terjadwal</div>
            <div className="stat-card-val">{scheduledCount}</div>
          </div>
          <div className="stat-card" style={{ background: "linear-gradient(135deg, #059669, #34D399)", boxShadow: "0 4px 16px rgba(5,150,105,.25)" }}>
            <div className="stat-card-label">Sudah Visit</div>
            <div className="stat-card-val">{archiveCount}</div>
          </div>
        </div>

        {tab === "wishlist"
          ? <WishlistPage showToast={showToast} onEditItem={setEditItem} />
          : <ArchivePage showToast={showToast} onEditItem={setEditItem} />
        }
      </div>

      <nav className="nav">
        <button className="nav-item" onClick={() => setTab("wishlist")}
          style={{ color: tab === "wishlist" ? "#D97706" : "var(--dim)" }}>
          <span className="nav-item-icon"><RencanaIcon /></span>
          <span className={tab === "wishlist" ? "nav-label-active" : "nav-label"}>Plans</span>
        </button>
        <button className="nav-fab" onClick={() => setShowForm(true)}>+</button>
        <button className="nav-item" onClick={() => setTab("archive")}
          style={{ color: tab === "archive" ? "#D97706" : "var(--dim)" }}>
          <span className="nav-item-icon"><SudahIcon /></span>
          <span className={tab === "archive" ? "nav-label-active" : "nav-label"}>Memories</span>
        </button>
      </nav>

      {showForm && (
        <div className="sheet-overlay" onClick={() => setShowForm(false)}>
          <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
            <AddForm items={items} onAdd={addItem} onClose={() => setShowForm(false)} showToast={showToast} />
          </div>
        </div>
      )}

      {editItem && (
        <div className="sheet-overlay" onClick={() => setEditItem(null)}>
          <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
            <AddForm items={items} editItem={editItem} onUpdate={updateItem} onClose={() => setEditItem(null)} showToast={showToast} />
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ItemsProvider>
        <AppShell />
      </ItemsProvider>
    </AuthProvider>
  );
}
