import { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { uploadPhoto } from "../../services/photoStorage";
import { validateItem } from "../../utils/validate";
import { gmapsValid } from "../../services/googlePlaces";
import PlacesSearch from "./PlacesSearch";
import StarPicker from "./StarPicker";
import { IconUtensils, IconCoffee, IconMapPin, IconBuilding, IconCamera, IconLock, IconMap, IconMessage } from "../ui/Icons";

const CATEGORIES = [
  { value: "resto",  label: "Resto",  Icon: IconUtensils },
  { value: "cafe",   label: "Cafe",   Icon: IconCoffee },
  { value: "tempat", label: "Tempat", Icon: IconMapPin },
  { value: "hotel",  label: "Hotel",  Icon: IconBuilding },
];
const PRIORITIES = [
  { value: "high", label: "Tinggi", dot: "#F87171" },
  { value: "med",  label: "Sedang", dot: "#D97706" },
  { value: "low",  label: "Rendah", dot: "#86EFAC" },
];

function defaultScheduledAt() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  d.setHours(12, 0, 0, 0);
  return d.toISOString().slice(0, 16);
}

export default function AddForm({ items, onAdd, editItem, onUpdate, onClose, showToast }) {
  const { user } = useAuth();
  const isEdit = !!editItem;

  const [name, setName]             = useState(editItem?.name || "");
  const [category, setCategory]     = useState(editItem?.category || "resto");
  const [notes, setNotes]           = useState(editItem?.notes || "");
  const [mapsUrl, setMapsUrl]       = useState(editItem?.mapsUrl || "");
  const [priority, setPriority]     = useState(editItem?.priority || null);
  const [scheduledAt, setScheduled] = useState(editItem?.scheduledAt || defaultScheduledAt());

  // Edit-only fields
  const [rating, setRating]         = useState(editItem?.rating || null);
  const [photoFile, setPhoto]       = useState(null);
  const [photoPreview, setPreview]  = useState(editItem?.photoUrl || "");

  // Google Maps
  const [lat, setLat]         = useState(editItem?.lat || null);
  const [lng, setLng]         = useState(editItem?.lng || null);
  const [placeId, setPlaceId] = useState(editItem?.placeId || "");
  const [address, setAddress] = useState(editItem?.address || "");

  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  function handlePlaceSelect(details) {
    setName(details.name);
    setMapsUrl(details.mapsUrl || "");
    setLat(details.lat);
    setLng(details.lng);
    setPlaceId(details.placeId);
    setAddress(details.address);
    setError("");

    const lower = details.name.toLowerCase();
    if (lower.includes("cafe") || lower.includes("kopi") || lower.includes("coffee")) setCategory("cafe");
    else if (lower.includes("hotel") || lower.includes("inn") || lower.includes("resort")) setCategory("hotel");
    else if (lower.includes("resto") || lower.includes("rumah makan") || lower.includes("warung") || lower.includes("makan")) setCategory("resto");
    else setCategory("tempat");
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validateItem({ name, category }, items, isEdit ? editItem.id : null);
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      if (isEdit) {
        let photoUrl = editItem.photoUrl || "";
        let photoPath = editItem.photoPath || "";
        if (photoFile && user) {
          ({ photoUrl, photoPath } = await uploadPhoto(user.uid, editItem.id, photoFile));
        }
        await onUpdate(editItem.id, {
          name, category, notes, priority, scheduledAt, mapsUrl,
          rating, photoUrl, photoPath, lat, lng, placeId, address,
        });
        showToast("Tempat diperbarui!");
      } else {
        await onAdd({ name, category, notes, priority, scheduledAt, mapsUrl, lat, lng, placeId, address });
        showToast("Ditambahkan ke itinerary!");
      }
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
      <div className="sheet-title">{isEdit ? "Edit Tempat" : "Tambah ke Itinerary"}</div>

      {/* Name */}
      <div className="field">
        {gmapsValid && !isEdit ? (
          <>
            <PlacesSearch onSelect={handlePlaceSelect} initialValue={name} />
            {name && (
              <input
                className="input"
                style={{ marginTop: ".5rem" }}
                placeholder="Edit nama (opsional)"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
              />
            )}
          </>
        ) : (
          <input
            className="input input-lg"
            placeholder="Nama tempat atau restoran *"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            autoFocus={!isEdit}
          />
        )}
      </div>

      {/* Kategori */}
      <div className="field">
        <div className="field-label">Kategori</div>
        <div className="chip-group">
          {CATEGORIES.map((c) => (
            <button key={c.value} type="button"
              className={`chip${category === c.value ? " active" : ""}`}
              onClick={() => setCategory(c.value)}
>
              <c.Icon size={12} />{c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Prioritas */}
      <div className="field">
        <div className="field-label">Prioritas (opsional)</div>
        <div className="chip-group">
          {PRIORITIES.map((p) => (
            <button key={p.value} type="button"
              className={`chip${priority === p.value ? " active" : ""}`}
              onClick={() => setPriority(priority === p.value ? null : p.value)}
>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.dot, flexShrink: 0 }} />
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tanggal & Jam */}
      <div className="field">
        <div className="field-label">Tanggal &amp; Jam Rencana</div>
        <input
          type="datetime-local"
          className="input"
          value={scheduledAt}
          onChange={(e) => setScheduled(e.target.value)}
        />
      </div>

      {/* Address dari Google (read-only) */}
      {address && (
        <div className="field">
          <div className="field-label">Alamat</div>
          <div className="address-hint">{address}</div>
        </div>
      )}

      {/* Catatan */}
      <div className="field">
        <div className="input-icon-wrap">
          <IconMessage size={14} />
          <input className="input input-with-icon" placeholder="Catatan (opsional)"
            value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
      </div>

      {/* Maps URL */}
      <div className="field">
        <div className="input-icon-wrap">
          <IconMap size={14} />
          <input className="input input-with-icon"
            placeholder="Link Google Maps (opsional)"
            value={mapsUrl} onChange={(e) => setMapsUrl(e.target.value)} />
        </div>
      </div>

      {/* Rating + Foto — edit only */}
      {isEdit && (
        <div className="field-row" style={{ alignItems: "center", gap: "1rem" }}>
          <div>
            <div className="field-label">Rating</div>
            <StarPicker value={rating} onChange={setRating} size="lg" />
          </div>
          <label className={`photo-upload-btn${photoPreview ? " has-photo" : ""}`} style={{ flex: 1 }}
            title={!user ? "Login untuk upload foto" : ""}>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={handlePhoto} disabled={!user} />
            {photoPreview
              ? <><img src={photoPreview} alt="" style={{ width: 24, height: 24, borderRadius: 4, objectFit: "cover" }} /> Foto dipilih</>
              : !user
                ? <><IconLock size={13} /> Login untuk foto</>
                : <><IconCamera size={13} /> Foto</>}
          </label>
        </div>
      )}

      {error && <div className="form-error">{error}</div>}

      <div className="sheet-actions">
        <button type="button" className="btn btn-ghost" onClick={onClose}>Batal</button>
        <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
          {loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Tempat"}
        </button>
      </div>
    </form>
  );
}
