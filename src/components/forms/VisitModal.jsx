import { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { uploadPhoto } from "../../services/photoStorage";
import StarPicker from "./StarPicker";

export default function VisitModal({ item, onConfirm, onClose }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(item.rating || null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(item.photoUrl || "");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleConfirm() {
    setLoading(true);
    try {
      let photoUrl = item.photoUrl || "";
      let photoPath = item.photoPath || "";
      if (photoFile && user) {
        ({ photoUrl, photoPath } = await uploadPhoto(user.uid, item.id, photoFile));
      }
      await onConfirm({ rating, photoUrl, photoPath });
    } catch {
      // silent, parent handles error
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="btn-icon modal-close" onClick={onClose}>✕</button>
        <div className="modal-title">Sudah dikunjungi! 🎉</div>
        <p className="text-sm text-muted" style={{ marginBottom: "1rem" }}>
          {item.name} — {item.city}
        </p>

        <div style={{ marginBottom: "1rem" }}>
          <div className="text-sm" style={{ marginBottom: ".4rem" }}>Kasih rating (opsional):</div>
          <StarPicker value={rating} onChange={setRating} />
        </div>

        <label className={`photo-upload-btn${photoPreview ? " has-photo" : ""}${!user ? " btn-disabled" : ""}`}
          style={{ marginBottom: "1rem" }} title={!user ? "Login untuk upload foto" : ""}>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} disabled={!user} />
          {photoPreview
            ? <><img src={photoPreview} alt="" style={{ width: 24, height: 24, borderRadius: 4, objectFit: "cover" }} /> {photoFile ? "Foto baru dipilih" : "Foto ada"}</>
            : <>{!user ? "🔒 Login untuk foto" : "📷 Upload foto kenangan"}</>
          }
        </label>

        <div className="form-actions" style={{ marginTop: 0 }}>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Batal</button>
          <button className="btn btn-primary btn-sm" onClick={handleConfirm} disabled={loading}>
            {loading ? "Menyimpan..." : "Konfirmasi"}
          </button>
        </div>
      </div>
    </div>
  );
}
