import {
  collection, doc, setDoc, updateDoc, deleteDoc,
  onSnapshot, query, orderBy, limit, writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";

function col(uid) {
  return collection(db, "users", uid, "items");
}

export function subscribeItems(uid, callback) {
  const q = query(col(uid), orderBy("addedAt", "desc"), limit(500));
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map((d) => d.data());
    data.sort((a, b) => b.addedAt.localeCompare(a.addedAt) || b.id - a.id);
    callback(data);
  });
}

export async function cloudAdd(uid, item) {
  await setDoc(doc(col(uid), String(item.id)), item);
}

export async function cloudUpdate(uid, id, patch) {
  await updateDoc(doc(col(uid), String(id)), patch);
}

export async function cloudDelete(uid, id) {
  await deleteDoc(doc(col(uid), String(id)));
}

export async function cloudMigrate(uid, localItems) {
  if (localItems.length === 0) return;
  const batch = writeBatch(db);
  localItems.forEach((item) => {
    batch.set(doc(col(uid), String(item.id)), item);
  });
  await batch.commit();
}
