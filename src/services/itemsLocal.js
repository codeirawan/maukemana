const KEY = "mkm_items";

export function localGetAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function localSaveAll(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function localAdd(item) {
  const items = localGetAll();
  items.unshift(item);
  localSaveAll(items);
}

export function localUpdate(id, patch) {
  const items = localGetAll().map((i) => (i.id === id ? { ...i, ...patch } : i));
  localSaveAll(items);
}

export function localDelete(id) {
  localSaveAll(localGetAll().filter((i) => i.id !== id));
}
