import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { configValid } from "../firebase";
import { localGetAll, localAdd, localUpdate, localDelete } from "../services/itemsLocal";
import { subscribeItems, cloudAdd, cloudUpdate, cloudDelete, cloudMigrate } from "../services/itemsCloud";
import { deletePhoto } from "../services/photoStorage";

const ItemsContext = createContext(null);

export function ItemsProvider({ children }) {
  const { user } = useAuth();
  const [localItems, setLocalItems] = useState(() => localGetAll());
  const [cloudItems, setCloudItems] = useState([]);
  const [cloudReady, setCloudReady] = useState(false);
  const migrationDone = useRef(false);

  useEffect(() => {
    if (!user || !configValid) return;
    const unsub = subscribeItems(user.uid, (data) => {
      setCloudItems(data);
      setCloudReady(true);
    });
    return unsub;
  }, [user]);

  useEffect(() => {
    if (!user || !cloudReady || migrationDone.current) return;
    migrationDone.current = true;
    if (cloudItems.length === 0 && localItems.length > 0) {
      cloudMigrate(user.uid, localItems);
    }
  }, [user, cloudReady, cloudItems.length, localItems]);

  const items = user ? cloudItems : localItems;

  function syncLocal() { setLocalItems(localGetAll()); }

  async function addItem(data) {
    const item = {
      id: Date.now(),
      name: data.name.trim(),
      category: data.category,
      city: data.city?.trim() || "",
      notes: data.notes?.trim() || "",
      priceRange: data.priceRange || null,
      priority: data.priority || null,
      scheduledAt: data.scheduledAt || null,
      mapsUrl: data.mapsUrl?.trim() || "",
      rating: data.rating || null,
      photoUrl: data.photoUrl || "",
      photoPath: data.photoPath || "",
      lat: data.lat ?? null,
      lng: data.lng ?? null,
      placeId: data.placeId || "",
      address: data.address || "",
      addedAt: new Date().toISOString(),
      visitedAt: null,
      archived: false,
    };
    if (user) {
      setCloudItems(prev => [item, ...prev]);
      await cloudAdd(user.uid, item);
    } else {
      localAdd(item); syncLocal();
    }
  }

  async function updateItem(id, patch) {
    if (user) {
      const snapshot = cloudItems.find(i => i.id === id);
      setCloudItems(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i));
      try {
        await cloudUpdate(user.uid, id, patch);
      } catch (err) {
        if (snapshot) setCloudItems(prev => prev.map(i => i.id === id ? snapshot : i));
        throw err;
      }
    } else {
      localUpdate(id, patch); syncLocal();
    }
  }

  async function markVisited(id, { rating, photoUrl, photoPath }) {
    await updateItem(id, {
      visitedAt: new Date().toISOString(),
      archived: true,
      ...(rating && { rating }),
      ...(photoUrl && { photoUrl, photoPath }),
    });
  }

  async function restoreItem(id) {
    await updateItem(id, { archived: false, visitedAt: null });
  }

  async function deleteItem(id, photoPath) {
    if (photoPath) await deletePhoto(photoPath);
    if (user) {
      const snapshot = cloudItems.find(i => i.id === id);
      setCloudItems(prev => prev.filter(i => i.id !== id));
      try {
        await cloudDelete(user.uid, id);
      } catch (err) {
        if (snapshot) setCloudItems(prev => [snapshot, ...prev.filter(i => i.id !== id)]);
        throw err;
      }
    } else {
      localDelete(id); syncLocal();
    }
  }

  return (
    <ItemsContext.Provider value={{ items, cloudReady, addItem, updateItem, markVisited, restoreItem, deleteItem }}>
      {children}
    </ItemsContext.Provider>
  );
}

export function useItems() {
  return useContext(ItemsContext);
}
