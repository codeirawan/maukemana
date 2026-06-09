import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth, configValid } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import CoffeeModal from "../ui/CoffeeModal";

export default function TopBar({ theme, onToggleTheme }) {
  const { user, authLoading } = useAuth();
  const [coffeeOpen, setCoffeeOpen] = useState(false);

  async function handleLogin() {
    try { await signInWithPopup(auth, new GoogleAuthProvider()); }
    catch { /* user closed popup */ }
  }

  return (
    <>
      <header className="topbar">
        <span className="topbar-logo">Mau Ke <em>Mana</em> 🧭</span>
        <div className="topbar-actions">
          <button className="btn-icon" onClick={onToggleTheme} title="Toggle tema">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button className="btn-icon" onClick={() => setCoffeeOpen(true)} title="Support developer">
            ☕
          </button>
          {configValid && !authLoading && (
            user
              ? <button className="btn btn-ghost btn-sm" onClick={() => signOut(auth)}>Keluar</button>
              : <button className="btn btn-primary btn-sm" onClick={handleLogin}>Login</button>
          )}
        </div>
      </header>
      {coffeeOpen && <CoffeeModal onClose={() => setCoffeeOpen(false)} />}
    </>
  );
}
