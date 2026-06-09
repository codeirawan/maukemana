import { resizeImage } from "../utils/resizeImage";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export async function uploadPhoto(uid, itemId, file) {
  const resized = await resizeImage(file, 800, 200 * 1024);

  // deterministic public_id → re-upload otomatis menimpa foto lama
  const publicId = `mkm_${uid}_${itemId}`;

  const formData = new FormData();
  formData.append("file", resized);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("public_id", publicId);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) throw new Error("Upload foto gagal");
  const data = await res.json();

  return { photoUrl: data.secure_url, photoPath: publicId };
}

// Cloudinary delete butuh API secret (tidak aman di frontend).
// Public_id deterministik → foto lama tertimpa saat re-upload.
// Foto orphan saat item dihapus diabaikan (25GB free tier cukup untuk personal).
export async function deletePhoto(_publicId) {
  // no-op
}
