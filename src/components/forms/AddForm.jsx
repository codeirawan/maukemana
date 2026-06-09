import { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { uploadPhoto } from "../../services/photoStorage";
import { validateItem } from "../../utils/validate";
import StarPicker from "./StarPicker";

const CATEGORIES = [
  { value: "resto",  label: "🍽️ Resto" },
  { value: "cafe",   label: "☕ Cafe" },
  { value: "tempat", label: "📍 Tempat" },
  { value: "hotel",  label: "🏨 Hotel" },
];
const PRICES = [
  { value: 1, label: "$" },
  { value: 2, label: "$$" },
  { value: 3, label: "$$$" },
];

export default function AddForm({ items, onAdd, onClose, showToast }) {
  const { user } = useAuth();
  const [name, setName]         = useState("");
  const [category, setCategory] = useState("resto");
  const [city, setCity]         = useState("");
  const [notes, setNotes]       = useState("");
  const [priceRange, setPrice]  = useState(null);
  const [mapsUrl, setMapsUrl]   = useState("");
  const [rating, setRating]     = useState(null);
  const [photoFile, setPhoto]   = useState(null);
  const [photoPreview, setPreview] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const fileRef = useRef();

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validateItem({ name, category, city }, items);
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      let photoUrl = "", photoPath = "";
      if (photoFile && user) {
        ({ photoUrl, photoPath } = await uploadPhoto(user.uid, Date.now(), photoFile));
      }
      await onAdd({ name, category, city, notes, priceRange, mapsUrl, rating, photoUrl, photoPath });
      showToast("Tempat ditambahkan!");
      onClose();
    } catch {
      setError("Gagal menyimpan, coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="sheet-handle" />
      <div className="sheet-title">Tambah Tempat</div>

      {/* Nama */}
      <div className="field">
        <input
          className="input input-lg"
          placeholder="Nama tempat atau restoran *"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(""); }}
          autoFocus
        />
      </div>

      {/* Kategori chips */}
      <div className="field">
        <div className="field-label">Kategori</div>
        <div className="chip-group">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              className={`chip${category === c.value ? " active" : ""}`}
              onClick={() => setCategory(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Kota + Harga */}
      <div className="field-row">
        <div className="field" style={{ flex: 1 }}>
          <input
            className="input"
            placeholder="Kota *"
            value={city}
            onChange={(e) => { setCity(e.target.value); setError(""); }}
          />
        </div>
        <div className="field" style={{ flexShrink: 0 }}>
          <div className="chip-group">
            {PRICES.map((p) => (
              <button
                key={p.value}
                type="button"
                className={`chip chip-price${priceRange === p.value ? " active" : ""}`}
                onClick={() => setPrice(priceRange === p.value ? null : p.value)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Catatan */}
      <div className="field">
        <input
          className="input"
          placeholder="💬 Catatan (opsional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Maps */}
      <div className="field">
        <input
          className="input"
          placeholder="🗺️ Link Google Maps (opsional)"
          value={mapsUrl}
          onChange={(e) => setMapsUrl(e.target.value)}
        />
      </div>

      {/* Rating + Foto */}
      <div className="field-row" style={{ alignItems: "center", gap: "1rem" }}>
        <div>
          <div className="field-label">Rating awal</div>
          <StarPicker value={rating} onChange={setRating} size="lg" />
        </div>

        <label
          className={`photo-upload-btn${photoPreview ? " has-photo" : ""}`}
          style={{ flex: 1 }}
          title={!user ? "Login untuk upload foto" : ""}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handlePhoto}
            disabled={!user}
          />
          {photoPreview ? (
            <>
              <img src={photoPreview} alt="" style={{ width: 24, height: 24, borderRadius: 4, objectFit: "cover" }} />
              Foto dipilih
            </>
          ) : !user ? "🔒 Login untuk foto" : "📷 Foto"}
        </label>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="sheet-actions">
        <button type="button" className="btn btn-ghost" onClick={onClose}>Batal</button>
        <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Tempat"}
        </button>
      </div>
    </form>
  );
}
