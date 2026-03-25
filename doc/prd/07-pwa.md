# Feature PRD: Progressive Web App (PWA)

> **Epic:** NIKAHKU — Wedding Planner Platform
> **Feature:** PWA — Installable, Offline-capable, Push-ready
> **Version:** 1.0
> **Status:** Draft
> **Tech:** Serwist (@serwist/next) + Next.js 16.2 Built-in Manifest

---

## 1. Feature Name

**Progressive Web App (PWA)** — Menjadikan NIKAHKU installable di smartphone dan desktop, dengan offline access dan background sync.

## 2. Epic

- Parent: [NIKAHKU PRD](../PRD.md)

## 3. Goal

**Problem:** Target user NIKAHKU (pasangan muda Indonesia) dominan menggunakan smartphone Android mid-range. Mereka terbiasa menggunakan "app" dari Play Store, bukan website. Tanpa native app, engagement dan retention rendah. Membangun native app terpisah (iOS + Android) membutuhkan budget dan waktu 2–3x lipat.

**Solution:** Implementasi PWA menggunakan Serwist sehingga NIKAHKU bisa di-install langsung dari browser ke home screen, berjalan dalam standalone mode (tanpa address bar), mendukung offline viewing untuk data yang sudah ter-cache, dan siap untuk push notifications di fase berikutnya.

**Impact:**
- Engagement meningkat ~30% (PWA umumnya meningkatkan session frequency)
- Zero cost untuk app store listing dan maintenance
- Instant update tanpa menunggu review Play Store / App Store
- Akses offline saat survey venue di lokasi sinyal lemah

## 4. User Personas

- **Primary:** Calon Pengantin di smartphone Android — install ke home screen, akses cepat
- **Secondary:** Calon Pengantin di iPhone — install via Safari "Add to Home Screen"
- **Tertiary:** Desktop user — install sebagai desktop app

## 5. User Stories

**US-PWA1:** Sebagai calon pengantin, saya ingin meng-install NIKAHKU ke home screen HP saya agar bisa membuka langsung tanpa buka browser.

**US-PWA2:** Sebagai calon pengantin, saya ingin melihat data pernikahan saya (dashboard, vendor list, guest list) saat tidak ada internet agar tetap bisa review data saat di lokasi tanpa sinyal.

**US-PWA3:** Sebagai calon pengantin, saya ingin perubahan yang saya buat saat offline (e.g., update status tamu) otomatis tersinkronisasi saat internet kembali.

**US-PWA4:** Sebagai calon pengantin, saya ingin NIKAHKU terasa seperti native app (fullscreen, tanpa address bar, splash screen) agar pengalaman pengguna seamless.

**US-PWA5:** Sebagai calon pengantin, saya ingin app tetap cepat meskipun saya sudah lama tidak membuka (cache masih tersedia).

**US-PWA6 (v1.1):** Sebagai calon pengantin, saya ingin mendapat push notification untuk deadline yang mendekat meskipun app sedang tidak dibuka.

## 6. Requirements

### Functional Requirements

**6.1 Installability:**
- Web App Manifest (`app/manifest.ts`) dengan: name, short_name, icons (192px + 512px + maskable), theme_color, background_color, display: standalone, orientation: portrait-primary
- Service Worker registered dan active
- Served over HTTPS (Vercel default)
- Browser auto-show install prompt (Android Chrome) setelah engagement criteria terpenuhi
- Custom install banner/button di dalam app (opsional, untuk iOS user yang tidak mendapat native prompt)
- Splash screen otomatis dari manifest icons + colors

**6.2 Offline Support:**
- **App Shell precaching:** HTML layout, CSS, JS bundles, fonts, icons — loaded instantly tanpa network
- **Runtime caching strategies:**
  - Dashboard data → Stale-While-Revalidate (show cached, refresh background)
  - Vendor list, guest list → Network First (fallback ke cache jika offline)
  - Vendor images (Supabase Storage) → Cache First (7 hari)
  - Static assets (fonts, icons) → Cache First (30 hari)
- **Offline fallback page:** `/offline` — menampilkan pesan friendly "Kamu sedang offline" dengan opsi retry dan list data yang tersedia dari cache
- **Offline indicator:** Banner kecil di top/bottom saat koneksi terputus: "Kamu sedang offline. Data yang ditampilkan mungkin belum terbaru."

**6.3 Background Sync:**
- Jika user melakukan mutasi data saat offline (e.g., update RSVP, tambah expense), operasi di-queue
- Queue disimpan di IndexedDB via Serwist Background Sync
- Saat koneksi kembali, queue otomatis di-replay ke Supabase
- Conflict resolution: Last-Write-Wins dengan timestamp
- Notification in-app: "3 perubahan berhasil disinkronkan" saat sync selesai

**6.4 Standalone Mode UX:**
- `display: standalone` — tidak ada browser chrome (address bar, nav buttons)
- Status bar color sesuai `theme_color: #8B6F4E`
- Custom back navigation handling (karena tidak ada browser back button)
- `orientation: portrait-primary` untuk konsistensi layout mobile

**6.5 Service Worker Lifecycle:**
- Auto-update: Saat user membuka app, check for new SW version
- Skip waiting + claim clients: Update langsung aktif tanpa perlu close/reopen
- Precache versioning: Asset diversion otomatis oleh Serwist
- Max cache size management: Limit runtime cache 50MB, auto-evict oldest entries

**6.6 Push Notifications (v1.1 — Persiapan di MVP):**
- MVP: Infrastruktur VAPID keys dan subscription endpoint sudah disiapkan
- MVP: Tabel `push_subscriptions` di Supabase sudah dibuat
- v1.1: Aktifkan push untuk: Task deadline H-3, H-1; Vendor payment due; Weekly progress summary
- v1.1: Permission request UX: Tanya setelah user melakukan 3+ actions (bukan saat first visit)

### Non-Functional Requirements

- Service Worker registration < 2 detik setelah page load
- Precache total size < 5MB (app shell + critical assets)
- Offline page load < 1 detik
- Background sync queue capacity: 100 operations
- PWA Lighthouse score ≥ 90
- Kompatibilitas: Chrome 90+, Safari 16.4+ (iOS PWA), Edge 90+, Samsung Internet 15+
- Serwist config tidak boleh mengganggu Turbopack build (zero --webpack flag needed untuk production)

## 7. Acceptance Criteria

### US-PWA1: Install to Home Screen
- **Given** user membuka NIKAHKU di Chrome Android untuk pertama kali
- **When** user telah mengunjungi 2+ halaman
- **Then** browser menampilkan install prompt "Add NIKAHKU to Home Screen"
- **And** setelah install, NIKAHKU muncul di home screen dengan ikon dan nama "NIKAHKU"
- **And** membuka dari home screen → standalone mode (tanpa address bar)

### US-PWA2: Offline Dashboard
- **Given** user telah membuka dashboard sebelumnya saat online
- **When** user membuka NIKAHKU tanpa koneksi internet
- **Then** dashboard dimuat dari cache dengan data terakhir yang tersedia
- **And** banner "Offline mode" muncul di atas layar
- **And** semua navigasi ke halaman yang pernah dikunjungi tetap berfungsi

### US-PWA3: Background Sync
- **Given** user mengubah status RSVP tamu dari "Belum Konfirmasi" ke "Hadir" saat offline
- **When** koneksi internet kembali
- **Then** perubahan otomatis tersinkronkan ke Supabase dalam < 30 detik
- **And** notifikasi in-app muncul: "1 perubahan berhasil disinkronkan"

### US-PWA4: Standalone Mode
- **Given** user membuka NIKAHKU dari home screen icon
- **When** app dimuat
- **Then** splash screen muncul (background Warm Ivory + NIKAHKU logo)
- **And** app berjalan fullscreen tanpa browser UI
- **And** status bar berwarna Warm Gold (#8B6F4E)

## 8. Out of Scope

- Push notifications (v1.1)
- Periodic background sync (v1.2)
- Share Target API — share link toko langsung ke NIKAHKU (v2.0)
- Badging API — badge count di home screen icon (v2.0)
- File Handling API — open files dengan NIKAHKU (not planned)
- Payment Request API (not planned)
- Geolocation untuk "vendor terdekat" (not planned for MVP)
