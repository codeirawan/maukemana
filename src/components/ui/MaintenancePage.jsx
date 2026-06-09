export default function MaintenancePage() {
  return (
    <div className="maintenance">
      <div className="maintenance-icon">🔧</div>
      <h1>Sedang Maintenance</h1>
      <p>Konfigurasi Firebase belum diisi.</p>
      <p className="text-xs text-muted">Salin <code>.env.example</code> ke <code>.env</code> dan isi API key.</p>
    </div>
  );
}
