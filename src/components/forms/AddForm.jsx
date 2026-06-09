import { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { uploadPhoto } from "../../services/photoStorage";
import { validateItem } from "../../utils/validate";
import StarPicker from "./StarPicker";

const CATEGORIES = ["resto", "cafe", "tempat", "hotel"];
const PRICE_LABELS = { 1: "$", 2: "$$", 3: "$$$" };

export default function AddForm({ items, onAdd, onCancel, showToast }) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("resto");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [priceRange, setPriceRange] = useState(null);
  const [mapsUrl, setMapsUrl] = useState("");
  const [rating, setRating] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validateItem({ name, category, city }, items);
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      let photoUrl = "", photoPath = "";
      if (photoFile && user) {
        const tempId = Date.now();
        ({ photoUrl, photoPath } = await uploadPhoto(user.uid, tempId, photoFile));
      }
      await onAdd({ name, category, city, notes, priceRange, mapsUrl, rating, photoUrl, photoPath });
      showToast("Tempat ditambahkan!");
      onCancel();
    } catch {
      setError("Gagal menyimpan, coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <div className="add-form-title">+ Tambah Tempat</div>

      <div className="form-row">
        <input className="input" placeholder="Nama tempat / resto *" value={name} onChange={(e) => { setName(e.target.value); setError(""); }} />
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="form-row">
        <input className="input" placeholder="Kota *" value={city} onChange={(e) => { setCity(e.target.value); setError(""); }} />
        <select className="input" value={priceRange ?? ""} onChange={(e) => setPriceRange(e.target.value ? Number(e.target.value) : null)}>
          <option value="">Harga (opsional)</option>
          {[1, 2, 3].map((n) => <option key={n} value={n}>{PRICE_LABELS[n]}</option>)}
        </select>
      </div>

      <input className="input" placeholder="Catatan (opsional)" value={notes} onChange={(e) => setNotes(e.target.value)} style={{ marginBottom: ".5rem" }} />
      <input className="input" placeholder="Link Google Maps (opsional)" value={mapsUrl} onChange={(e) => setMapsUrl(e.target.value)} />

      <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: ".75rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
          <span className="text-sm text-muted">Rating:</span>
          <StarPicker value={rating} onChange={setRating} />
        </div>

        <label className={`photo-upload-btn${photoPreview ? " has-photo" : ""}${!user ? " btn-disabled" : ""}`}
          title={!user ? "Login untuk upload foto" : ""}>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} disabled={!user} />
          {photoPreview
            ? <><img src={photoPreview} alt="" style={{ width: 24, height: 24, borderRadius: 4, objectFit: "cover" }} /> Foto dipilih</>
            : <>{!user ? "🔒 Login untuk foto" : "📷 Upload foto"}</>
          }
        </label>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="form-actions">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>Batal</button>
        <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}
