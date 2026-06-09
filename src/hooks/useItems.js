import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { configValid } from "../firebase";
import {
  localGetAll, localAdd, localUpdate, localDelete,
} from "../services/itemsLocal";
import {
  subscribeItems, cloudAdd, cloudUpdate, cloudDelete, cloudMigrate,
} from "../services/itemsCloud";
import { deletePhoto } from "../services/photoStorage";

export function useItems() {
  const { user } = useAuth();
  const [localItems, setLocalItems] = useState(() => localGetAll());
  const [cloudItems, setCloudItems] = useState([]);
  const [cloudReady, setCloudReady] = useState(false);
  const migrationDone = useRef(false);

  // subscribe cloud when logged in
  useEffect(() => {
    if (!user || !configValid) return;
    const unsub = subscribeItems(user.uid, (data) => {
      setCloudItems(data);
      setCloudReady(true);
    });
    return unsub;
  }, [user]);

  // auto-migrate local → cloud on first login
  useEffect(() => {
    if (!user || !cloudReady || migrationDone.current) return;
    migrationDone.current = true;
    if (cloudItems.length === 0 && localItems.length > 0) {
      cloudMigrate(user.uid, localItems);
    }
  }, [user, cloudReady, cloudItems.length, localItems]);

  const items = user ? cloudItems : localItems;

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
      await cloudAdd(user.uid, item);
    } else {
      localAdd(item);
      setLocalItems(localGetAll());
    }
  }

  async function updateItem(id, patch) {
    if (user) {
      await cloudUpdate(user.uid, id, patch);
    } else {
      localUpdate(id, patch);
      setLocalItems(localGetAll());
    }
  }

  async function markVisited(id, { rating, photoUrl, photoPath }) {
    const patch = {
      visitedAt: new Date().toISOString(),
      archived: true,
      ...(rating && { rating }),
      ...(photoUrl && { photoUrl, photoPath }),
    };
    await updateItem(id, patch);
  }

  async function restoreItem(id) {
    await updateItem(id, { archived: false, visitedAt: null });
  }

  async function deleteItem(id, photoPath) {
    if (photoPath) {
      await deletePhoto(photoPath);
    }
    if (user) {
      await cloudDelete(user.uid, id);
    } else {
      localDelete(id);
      setLocalItems(localGetAll());
    }
  }

  return {
    items,
    cloudReady,
    addItem,
    updateItem,
    markVisited,
    restoreItem,
    deleteItem,
  };
}
