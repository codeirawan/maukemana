export function validateItem(fields, existing = [], editingId = null) {
  const { name, category, city } = fields;
  if (!name || !name.trim()) return "Nama tempat wajib diisi";
  if (!category) return "Kategori wajib dipilih";
  if (!city || !city.trim()) return "Kota wajib diisi";

  if (!editingId) {
    const dup = existing.find(
      (i) =>
        i.name.toLowerCase().trim() === name.toLowerCase().trim() &&
        i.city.toLowerCase().trim() === city.toLowerCase().trim()
    );
    if (dup) return `"${dup.name}" di ${dup.city} sudah ada dalam daftar`;
  }
  return null;
}
