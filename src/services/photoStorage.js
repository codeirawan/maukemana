import { resizeImage } from "../utils/resizeImage";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export async function uploadPhoto(_uid, _itemId, file) {
  const resized = await resizeImage(file, 800, 200 * 1024);

  const formData = new FormData();
  formData.append("file", resized);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) throw new Error("Upload foto gagal");
  const data = await res.json();

  return { photoUrl: data.secure_url, photoPath: data.public_id };
}

// Delete butuh API secret — tidak aman di frontend.
// Foto orphan saat item dihapus diabaikan (25GB free tier cukup untuk personal).
export async function deletePhoto(_publicId) {
  // no-op
}
