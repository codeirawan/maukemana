import { useState, useEffect } from "react";
import { configValid } from "./firebase";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useItems } from "./hooks/useItems";
import { useToast } from "./hooks/useToast";
import TopBar from "./components/layout/TopBar";
import TabBar from "./components/layout/TabBar";
import WishlistPage from "./pages/WishlistPage";
import ArchivePage from "./pages/ArchivePage";
import Toast from "./components/ui/Toast";
import MaintenancePage from "./components/ui/MaintenancePage";

function getInitialTheme() {
  const saved = localStorage.getItem("mkm_theme");
  if (saved) return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function AppShell() {
  const { authLoading } = useAuth();
  const { items } = useItems();
  const { toast, showToast } = useToast();
  const [tab, setTab] = useState("wishlist");
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("mkm_theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  if (!configValid) return <MaintenancePage />;
  if (authLoading) return null;

  const wishlistCount = items.filter((i) => !i.archived).length;
  const archiveCount = items.filter((i) => i.archived).length;

  return (
    <>
      <TopBar theme={theme} onToggleTheme={toggleTheme} />
      <TabBar tab={tab} onTab={setTab} wishlistCount={wishlistCount} archiveCount={archiveCount} />
      {tab === "wishlist"
        ? <WishlistPage showToast={showToast} />
        : <ArchivePage showToast={showToast} />
      }
      <Toast message={toast} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
