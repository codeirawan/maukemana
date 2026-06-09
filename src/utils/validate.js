export function validateItem(fields, existing = [], editingId = null) {
  const { name, category } = fields;
  if (!name || !name.trim()) return "Nama tempat wajib diisi";
  if (!category) return "Kategori wajib dipilih";

  if (!editingId) {
    const dup = existing.find(
      (i) => i.name.toLowerCase().trim() === name.toLowerCase().trim()
    );
    if (dup) return `"${dup.name}" sudah ada dalam daftar`;
  }
  return null;
}
