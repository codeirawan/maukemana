import { useState, useRef, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { uploadPhoto } from "../../services/photoStorage";
import StarPicker from "./StarPicker";
import { IconCamera, IconLock, IconX } from "../ui/Icons";

export default function VisitModal({ item, onConfirm, onClose }) {
  const { user } = useAuth();
  const [rating, setRating]             = useState(item.rating || null);
  const [photoFile, setPhotoFile]       = useState(null);
  const [photoPreview, setPhotoPreview] = useState(item.photoUrl || "");
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const fileRef  = useRef();
  const submitting = useRef(false);

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleConfirm() {
    if (submitting.current) return;
    submitting.current = true;
    setLoading(true);
    setError("");
    try {
      let photoUrl = item.photoUrl || "";
      let photoPath = item.photoPath || "";
      if (photoFile && user) {
        try {
          ({ photoUrl, photoPath } = await uploadPhoto(user.uid, item.id, photoFile));
        } catch {
          setError("Foto gagal diupload — kunjungan disimpan tanpa foto.");
        }
      }
      await onConfirm({ rating, photoUrl, photoPath });
    } catch {
      setError("Gagal menyimpan, coba lagi.");
      submitting.current = false;
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Header */}
      <div className="sheet-head">
        <div className="sheet-handle" />
        <div className="sheet-title">Sudah dikunjungi!</div>
        <p className="sheet-subtitle">{item.name}{item.city ? ` — ${item.city}` : ""}</p>
        <button className="sheet-close" type="button" onClick={onClose}>
          <IconX size={16} />
        </button>
      </div>

      {/* Rating */}
      <div className="field">
        <div className="field-label">Rating (opsional)</div>
        <StarPicker value={rating} onChange={setRating} size="lg" />
      </div>

      {/* Foto */}
      <div className="field">
        <div className="field-label">Foto kenangan (opsional)</div>
        <label className={`photo-upload-btn${photoPreview ? " has-photo" : ""}${!user ? " btn-disabled" : ""}`}
          style={{ width: "100%" }} title={!user ? "Login untuk upload foto" : ""}>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
            onChange={handlePhoto} disabled={!user} />
          {photoPreview
            ? <><img src={photoPreview} alt="" style={{ width: 24, height: 24, borderRadius: 4, objectFit: "cover" }} /> {photoFile ? "Foto baru dipilih" : "Foto ada"}</>
            : !user
              ? <><IconLock size={13} /> Login untuk foto</>
              : <><IconCamera size={13} /> Upload foto kenangan</>
          }
        </label>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="sheet-actions">
        <button className="btn btn-primary" style={{ width: "100%" }}
          onClick={handleConfirm} disabled={loading}>
          {loading ? "Menyimpan..." : "Konfirmasi Kunjungan"}
        </button>
      </div>
    </>
  );
}
