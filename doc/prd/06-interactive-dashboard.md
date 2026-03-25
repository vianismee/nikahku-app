# Feature PRD: Interactive Dashboard

> **Epic:** NIKAHKU — Wedding Planner Platform
> **Feature:** Interactive Dashboard
> **Version:** 1.0
> **Status:** Draft

---

## 1. Feature Name

**Interactive Dashboard** — Halaman utama yang menampilkan ringkasan seluruh data pernikahan dalam widget interaktif.

## 2. Epic

- Parent: [NIKAHKU PRD](../PRD.md)

## 3. Goal

**Problem:** Dengan data yang tersebar di 5 modul berbeda (Budget, Vendor, Seserahan, Guest, Planning), pasangan harus membuka halaman berbeda untuk memahami progress keseluruhan. Tidak ada "bird's eye view."

**Solution:** Dashboard interaktif yang mengagregasi data dari semua modul ke dalam widget visual (charts, progress bars, summary cards, tables) di satu halaman — memberikan gambaran instan tentang status keseluruhan persiapan pernikahan.

**Impact:**
- Waktu untuk memahami progress keseluruhan berkurang dari ~10 menit (buka 5 halaman) menjadi < 30 detik (1 halaman)
- Identifikasi bottleneck dan item yang membutuhkan perhatian secara instan
- Meningkatkan motivasi pasangan dengan visual progress yang jelas

## 4. User Personas

- **Primary:** Calon Pengantin — quick overview setiap login
- **Secondary:** Keluarga/Orang Tua — melihat progress (read-only, future)
- **Tertiary:** Wedding Organizer — presentasi progress ke klien

## 5. User Stories

**US-D1:** Sebagai calon pengantin, saya ingin melihat countdown hari menuju pernikahan setiap kali membuka aplikasi.

**US-D2:** Sebagai calon pengantin, saya ingin melihat ringkasan budget (total, terpakai, sisa) dalam satu widget.

**US-D3:** Sebagai calon pengantin, saya ingin melihat status semua vendor (berapa yang booked, berapa yang belum) dalam satu pandangan.

**US-D4:** Sebagai calon pengantin, saya ingin melihat daftar vendor yang sudah di-booking lengkap dengan status pembayaran.

**US-D5:** Sebagai calon pengantin, saya ingin melihat progress pembelian mahar & seserahan.

**US-D6:** Sebagai calon pengantin, saya ingin melihat statistik tamu (hadir, tidak hadir, belum konfirmasi).

**US-D7:** Sebagai calon pengantin, saya ingin melihat task yang deadline-nya terdekat agar tahu apa yang harus dikerjakan.

**US-D8:** Sebagai calon pengantin, saya ingin bisa navigasi langsung dari widget ke halaman detail terkait.

## 6. Requirements

### Functional Requirements

**Widget 1: Wedding Countdown**
- Menampilkan: X hari menuju pernikahan (format besar dan bold)
- Sub-info: Tanggal pernikahan, Hari (e.g., "Sabtu, 1 Januari 2027")
- Visual: Animasi ring/heart subtle
- Jika tanggal sudah lewat: "Selamat! Pernikahan sudah berlangsung X hari yang lalu"

**Widget 2: Budget Overview**
- Card: Total Budget, Total Terpakai, Sisa Budget
- Progress bar dengan persentase
- Warna: Hijau (< 70%), Kuning (70–89%), Merah (≥ 90%)
- Mini donut chart: distribusi pengeluaran per kategori (top 5)
- Click → navigasi ke halaman Budget Manager

**Widget 3: Vendor Status Summary**
- Horizontal stacked bar atau badge group menampilkan jumlah vendor per status
- Status: Shortlisted (abu), Contacted (biru), Negotiating (kuning), Booked (hijau), Paid DP (teal), Paid Full (hijau tua), Completed (emas)
- Total vendor count
- Click → navigasi ke halaman Vendor Management

**Widget 4: Vendor yang Sudah Di-Booking**
- Tabel ringkas: Nama Vendor, Kategori (dengan ikon), Paket, Harga, Status Pembayaran, Deadline Pelunasan
- Highlight merah jika deadline pelunasan < 7 hari
- Max 10 row, link "Lihat Semua" jika lebih
- Click row → navigasi ke vendor detail

**Widget 5: Mahar & Seserahan Progress**
- Progress bar: X dari Y item sudah dibeli
- Daftar 5 item teratas yang belum dibeli (berdasarkan prioritas)
- Total estimasi biaya sisa
- Platform ikon (Shopee/Tokopedia) di samping setiap item
- Click → navigasi ke halaman Mahar & Seserahan

**Widget 6: Guest Count**
- Donut chart: Hadir vs Tidak Hadir vs Belum Konfirmasi
- Angka total di tengah donut
- Tabel ringkas per sesi: Nama Sesi, Kapasitas, Confirmed, Remaining
- Click → navigasi ke halaman Guest List

**Widget 7: Upcoming Tasks**
- List 5 task dengan deadline terdekat
- Setiap task: Judul, Deadline, Priority badge, Kategori badge
- Overdue tasks ditampilkan pertama dengan highlight merah
- Quick action: Checkbox "Done" langsung dari dashboard
- Click → navigasi ke halaman Planning Board

**Widget 8: Quick Actions**
- Floating action button atau action bar dengan shortcut:
  - "+ Tambah Vendor"
  - "+ Catat Pengeluaran"
  - "+ Tambah Tamu"
  - "+ Buat Task"

**Dashboard Customization:**
- Drag-and-drop widget untuk reorder posisi
- Toggle show/hide widget tertentu
- Layout tersimpan di localStorage + database
- Reset ke default layout

**Responsiveness:**
- Desktop: 2–3 column grid
- Tablet: 2 column grid
- Mobile: Single column stack, most important widgets first (Countdown → Budget → Tasks)

### Non-Functional Requirements

- Dashboard full load < 2 detik (semua widget rendered)
- Data freshness: Real-time (optimistic update saat ada perubahan di modul lain)
- Lazy load: Widget di bawah fold dimuat saat scroll mendekati
- Skeleton loading: Setiap widget menampilkan skeleton saat data loading
- Chart animations: Fade-in saat pertama kali rendered
- Accessibility: Semua chart memiliki data-table alternative untuk screen readers
- Print-friendly layout (optional)

## 7. Acceptance Criteria

### US-D2: Budget Overview Widget
- **Given** total budget Rp 150.000.000, terpakai Rp 90.000.000 (60%)
- **When** user membuka dashboard
- **Then** Budget widget menampilkan: "Rp 150.000.000 Total | Rp 90.000.000 Terpakai | Rp 60.000.000 Sisa" dengan progress bar hijau 60%

### US-D4: Booked Vendor Table
- **Given** 3 vendor sudah di-booking: Catering (Paid DP), Venue (Paid Full), Fotografer (Booked)
- **When** user membuka dashboard
- **Then** Widget "Vendor Booked" menampilkan tabel 3 row dengan status badge masing-masing

### US-D7: Upcoming Tasks
- **Given** user memiliki 2 overdue tasks dan 8 upcoming tasks
- **When** user membuka dashboard
- **Then** 2 overdue tasks muncul pertama (highlight merah), diikuti 3 upcoming tasks terdekat

### US-D8: Navigation
- **Given** user melihat Budget Overview widget
- **When** user klik widget
- **Then** navigasi ke halaman Budget Manager dengan smooth transition

## 8. Out of Scope

- Real-time collaboration indicator (siapa sedang melihat)
- Dashboard PDF export
- Custom widget creation
- Third-party widget embedding
- Notification center (separate feature)
- Dark mode toggle (global setting, bukan per-dashboard)
