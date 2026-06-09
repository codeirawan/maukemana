import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../firebase";
import { resizeImage } from "../utils/resizeImage";

export async function uploadPhoto(uid, itemId, file) {
  const resized = await resizeImage(file, 800, 200 * 1024);
  const path = `users/${uid}/places/${itemId}.jpg`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, resized, { contentType: "image/jpeg" });
  const url = await getDownloadURL(storageRef);
  return { photoUrl: url, photoPath: path };
}

export async function deletePhoto(path) {
  try {
    await deleteObject(ref(storage, path));
  } catch {
    // ignore not-found errors on delete
  }
}
