import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth, configValid } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import CoffeeModal from "../ui/CoffeeModal";
import InfoModal from "../ui/InfoModal";
import { IconSun, IconMoon, IconUser } from "../ui/Icons";

const GoogleIcon = () => (
  <svg width="13" height="13" viewBox="0 0 18 18">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.705 17.64 9.2z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

export default function AppHeader({ dark, onToggle }) {
  const { user, authLoading } = useAuth();
  const [coffeeOpen, setCoffeeOpen] = useState(false);
  const [infoOpen, setInfoOpen]     = useState(false);

  const btnStyle = {
    background: dark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.06)",
    border: "1px solid var(--border)", borderRadius: 50,
    padding: "7px 10px", display: "flex", alignItems: "center",
    color: "var(--muted)", cursor: "pointer", transition: "opacity .15s",
    fontFamily: "inherit",
  };

  async function handleLogin() {
    try { await signInWithPopup(auth, new GoogleAuthProvider()); } catch { }
  }

  return (
    <>
      <div className="app-header">
        <div>
          <div className="app-header-eyebrow">Itinerary</div>
          <div className="app-header-title">Mau Ke <span>Mana</span></div>
        </div>
        <div className="app-header-actions">
          <button onClick={() => setInfoOpen(true)} title="Tentang Aplikasi"
            style={{ ...btnStyle, fontWeight: 800, fontSize: 14, minWidth: 32 }}>
            ?
          </button>
          <button onClick={() => setCoffeeOpen(true)} title="Support Developer"
            style={{ ...btnStyle, fontWeight: 800, fontSize: 15, letterSpacing: "-.5px", minWidth: 34 }}>
            $
          </button>
          <button onClick={onToggle} title={dark ? "Mode Terang" : "Mode Gelap"} style={btnStyle}>
            {dark ? <IconSun size={15} /> : <IconMoon size={15} />}
          </button>
          {configValid && !authLoading && (
            user
              ? (
                <button onClick={() => signOut(auth)} title="Logout"
                  style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid var(--border)", overflow: "hidden", padding: 0, cursor: "pointer", background: "var(--surface)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {user.photoURL
                    ? <img src={user.photoURL} alt="" referrerPolicy="no-referrer" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <IconUser size={16} />}
                </button>
              )
              : (
                <button onClick={handleLogin} disabled={authLoading}
                  style={{ ...btnStyle, fontSize: 12, fontWeight: 600, gap: 6 }}>
                  <GoogleIcon /> Sync
                </button>
              )
          )}
        </div>
      </div>
      {coffeeOpen && <CoffeeModal onClose={() => setCoffeeOpen(false)} />}
      {infoOpen   && <InfoModal  onClose={() => setInfoOpen(false)} />}
    </>
  );
}
