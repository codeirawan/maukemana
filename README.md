# Mau Ke Mana

**Wishlist tempat yang ingin kamu kunjungi** — resto, cafe, tempat wisata, hotel. Catat rencana, tandai yang sudah dikunjungi, simpan foto & rating, sync antar device.

🔗 **Live:** [maukemana.vercel.app](https://maukemana.vercel.app)

![OG Image](https://res.cloudinary.com/dtgzydbp2/image/upload/v1781064444/maukemana_og.png)

---

## Fitur

### Plans (Wishlist)
- Tambah tempat dengan nama, kategori, catatan, prioritas, jadwal kunjungan, link Google Maps
- Autocomplete nama tempat via Nominatim (OpenStreetMap, gratis)
- Filter berdasarkan kategori, kota, dan pencarian teks
- Sort: terbaru, terlama, nama A–Z, prioritas
- Tandai sebagai "Sudah Dikunjungi" — pindah ke Memories beserta rating & foto

### Memories (Archive)
- Grid foto 3-kolom bergaya Instagram
- Tap foto untuk lihat detail: catatan, jadwal, tanggal kunjungi, rating, link peta
- Filter & sort sama seperti Plans
- Kembalikan ke Plans jika ingin dikunjungi lagi

### Sync & Auth
- Login dengan Google (Firebase Auth) — data tersimpan di Firestore, sync lintas device
- Tanpa login — data tersimpan di localStorage (migrasi otomatis saat pertama login)
- Offline support via Firestore persistent cache

### Upload Foto
- Upload foto kenangan saat menandai sudah dikunjungi atau saat edit
- Resize & kompresi otomatis sebelum upload (maks 800px, 200KB)
- Disimpan di Cloudinary

### UX
- Dark / Light mode (ikut sistem, bisa toggle manual)
- PWA — bisa di-install di HP
- Toast notifikasi dengan icon
- Optimistic update — UI langsung berubah, rollback otomatis jika cloud gagal
- Error boundary — jika terjadi crash, tampil halaman error + tombol reload

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React 19 + Vite |
| Styling | CSS custom properties, dark mode |
| Auth | Firebase Authentication (Google OAuth) |
| Database | Cloud Firestore (offline persistence) |
| Storage foto | Cloudinary (unsigned upload) |
| Places search | Nominatim (OpenStreetMap) — gratis, tanpa API key |
| Deploy | Vercel |
| Font | Inter (body), Satisfy (dekoratif) |

---

## Struktur Folder

```
src/
├── App.jsx                    # Root shell, state global tab/form
├── main.jsx
├── index.css                  # Semua styling (CSS variables, komponen)
├── firebase.js                # Firebase init + config guard
│
├── context/
│   ├── AuthContext.jsx        # Firebase Auth state
│   └── ItemsContext.jsx       # Single source of truth untuk semua item
│                              # Optimistic update + rollback
│
├── hooks/
│   ├── useItems.js            # Re-export dari context (backward compat)
│   └── useToast.js            # Toast state dengan timer management
│
├── services/
│   ├── itemsCloud.js          # Firestore CRUD + onSnapshot subscription
│   ├── itemsLocal.js          # localStorage CRUD (tanpa login)
│   ├── photoStorage.js        # Cloudinary upload
│   └── googlePlaces.js        # Places autocomplete + detail + static map
│
├── utils/
│   ├── validate.js            # Validasi form item (duplikat, required)
│   └── resizeImage.js         # Canvas resize + kompresi sebelum upload
│
├── pages/
│   ├── WishlistPage.jsx       # Tab Plans — list + filter + visit modal
│   └── ArchivePage.jsx        # Tab Memories — grid foto + filter
│
├── components/
│   ├── forms/
│   │   ├── AddForm.jsx        # Form tambah / edit tempat
│   │   ├── VisitModal.jsx     # Modal konfirmasi kunjungan + rating + foto
│   │   ├── PlacesSearch.jsx   # Input autocomplete Google Places
│   │   └── StarPicker.jsx     # Komponen bintang rating
│   │
│   ├── items/
│   │   ├── ItemList.jsx       # List wishlist dengan pagination
│   │   ├── ItemRow.jsx        # Satu row item di wishlist
│   │   ├── ArchiveGrid.jsx    # Grid 3-kolom Instagram untuk memories
│   │   └── FilterBar.jsx      # Chip filter kategori + kota + sort
│   │
│   ├── layout/
│   │   └── AppHeader.jsx      # Header app + tombol info/support/theme/login
│   │
│   └── ui/
│       ├── DetailModal.jsx    # Modal detail item (wishlist & archive)
│       ├── InfoModal.jsx      # Modal tentang aplikasi
│       ├── CoffeeModal.jsx    # Modal support developer (QRIS)
│       ├── PhotoViewer.jsx    # Full-screen photo viewer
│       ├── Toast.jsx          # Notifikasi toast dengan icon
│       ├── ErrorBoundary.jsx  # Catch render error, tampil fallback UI
│       ├── EmptyState.jsx     # Komponen empty state reusable
│       ├── Icons.jsx          # Semua SVG icon (Lucide-style, stroke)
│       └── MaintenancePage.jsx
│
└── public/
    ├── favicon.svg            # Map-pin amber
    ├── icon-192.png           # PWA icon
    ├── icon-512.png           # PWA icon
    ├── manifest.json          # Web App Manifest
    ├── robots.txt
    ├── sitemap.xml
    └── sw.js                  # Service worker (cache)
```

---

## Setup Lokal

### 1. Clone & Install

```bash
git clone <repo-url>
cd maukemana
npm install
```

### 2. Environment Variables

Buat file `.env` berdasarkan `.env.example`:

```env
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

### 3. Firebase Setup

1. Buat project di [Firebase Console](https://console.firebase.google.com)
2. Aktifkan **Authentication** → Google provider
3. Aktifkan **Cloud Firestore** → mode production
4. Set Firestore Rules:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/items/{itemId} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

### 4. Cloudinary Setup

1. Buat akun di [Cloudinary](https://cloudinary.com)
2. Buat **Upload Preset** dengan mode `unsigned`
3. Isi `VITE_CLOUDINARY_CLOUD_NAME` dan `VITE_CLOUDINARY_UPLOAD_PRESET`

### 5. Run

```bash
npm run dev
```

---

## Deploy ke Vercel

```bash
vercel --prod
```

Tambahkan semua environment variables di Vercel dashboard → Project Settings → Environment Variables.

---

## Arsitektur

### State Management

Semua item dikelola di `ItemsContext` — satu provider, satu source of truth. Tiga instance `useItems()` terpisah (App, WishlistPage, ArchivePage) berbagi state yang sama tanpa sync manual.

```
AuthContext  →  ItemsContext  →  App / WishlistPage / ArchivePage
                    ↓
              Firestore (cloud)  atau  localStorage (local)
```

### Optimistic Update + Rollback

Update & delete langsung mengubah state UI sebelum menunggu Firestore. Jika Firestore gagal, state dikembalikan ke snapshot sebelumnya:

```js
const snapshot = cloudItems.find(i => i.id === id);
setCloudItems(prev => ...patch...);
try {
  await cloudUpdate(...);
} catch {
  setCloudItems(prev => ...restore snapshot...); // rollback
  throw;
}
```

### Modal Z-Index

Semua modal menggunakan `sheet-overlay` (`position: fixed; z-index: 500`). `.page` tidak punya `z-index` (bukan stacking context), sehingga semua modal selalu menutupi nav (`z-index: 100`).

### Foto Upload

Sebelum upload ke Cloudinary, gambar di-resize di browser menggunakan Canvas API — maks 800px di sisi terpanjang, kompresi JPEG iteratif sampai di bawah 200KB.

---

## Keterbatasan

- **Foto tidak terhapus dari Cloudinary** saat item dihapus — delete membutuhkan API secret yang tidak aman disimpan di frontend. Untuk cleanup, hapus manual via Cloudinary dashboard.
- **Limit 500 item** per user (Firestore query limit — cukup untuk pemakaian personal).
- **Nominatim rate limit** max 1 req/detik — ada debounce 500ms di PlacesSearch.
