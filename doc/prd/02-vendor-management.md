# Feature PRD: Vendor Management

> **Epic:** NIKAHKU — Wedding Planner Platform
> **Feature:** Vendor Management Module
> **Version:** 1.0
> **Status:** Draft

---

## 1. Feature Name

**Vendor Management** — Modul pengelolaan data vendor, paket harga, komparasi, dan tracking booking.

## 2. Epic

- Parent: [NIKAHKU PRD](../PRD.md)

## 3. Goal

**Problem:** Calon pengantin harus membandingkan puluhan vendor dari berbagai kategori melalui chat WhatsApp, brosur fisik, dan Instagram. Data tersebar, tidak terstruktur, dan sulit dibandingkan secara objektif. Proses ini memakan waktu berminggu-minggu.

**Solution:** Database vendor terpusat dengan kategorisasi, input paket & harga, komparasi side-by-side, dan status tracking dari shortlist hingga pembayaran lunas.

**Impact:**
- Waktu seleksi vendor berkurang 70% (dari ~4 minggu menjadi ~1 minggu)
- Keputusan lebih objektif dengan data terstruktur
- Zero missed payment deadlines dengan status tracking

## 4. User Personas

- **Primary:** Calon Pengantin — mencari, membandingkan, dan memilih vendor
- **Secondary:** Wedding Organizer — mengelola vendor untuk multiple klien

## 5. User Stories

**US-V1:** Sebagai calon pengantin, saya ingin menambahkan vendor baru lengkap dengan informasi kontak dan media sosial agar semua data vendor tersimpan di satu tempat.

**US-V2:** Sebagai calon pengantin, saya ingin mengkategorikan vendor (Catering, Venue, Photo Video, dll.) agar mudah dikelompokkan dan dicari.

**US-V3:** Sebagai calon pengantin, saya ingin mencatat paket dan harga dari setiap vendor agar mudah dibandingkan.

**US-V4:** Sebagai calon pengantin, saya ingin membandingkan 2–4 vendor dalam satu kategori secara side-by-side agar bisa memilih yang paling sesuai.

**US-V5:** Sebagai calon pengantin, saya ingin mengubah status vendor dari shortlist hingga fully paid agar progress booking terlihat jelas.

**US-V6:** Sebagai calon pengantin, saya ingin upload foto/brosur vendor agar bisa review visual tanpa buka aplikasi lain.

**US-V7:** Sebagai calon pengantin, saya ingin membuat kategori vendor custom agar bisa menambahkan jenis vendor yang belum tersedia.

## 6. Requirements

### Functional Requirements

**Vendor CRUD:**
- Form input: Nama Vendor, Kategori (select), Sub-kategori (optional), Kontak (WA, Telp, Email), Instagram Handle, Website URL, Alamat, Kota, Rating (1-5 star, user input), Catatan Pro, Catatan Cons
- Upload foto/brosur: max 5 file, format jpg/png/pdf, max 5MB each
- Edit dan delete vendor dengan konfirmasi
- Search vendor by nama dan filter by kategori, kota, status, rating

**Vendor Categories:**
- 12 kategori default: Catering, Venue/Gedung, Attire & Make Up, Photo & Video, Dekorasi, Entertainment/MC, Undangan/Percetakan, Souvenir, Transportasi, Akomodasi, Henna/Mehendi, Lain-lain
- Setiap kategori memiliki ikon dan warna unik
- User dapat membuat kategori custom (nama + ikon + warna)
- Kategori default tidak dapat dihapus, hanya di-hide

**Vendor Packages:**
- Setiap vendor bisa punya 1–10 paket
- Data paket: Nama Paket, Deskripsi (rich text), Harga (IDR), Termasuk (list items), Tidak Termasuk (list items), Catatan
- Paket bisa di-reorder (drag-drop)

**Vendor Comparison:**
- User memilih 2–4 vendor dari kategori yang sama
- Tabel komparasi menampilkan semua field side-by-side
- Auto-highlight: Harga terendah (hijau), Rating tertinggi (hijau)
- Setiap kolom ada tombol "Pilih Vendor Ini"
- Perbandingan bisa di-save sebagai snapshot

**Vendor Booking Status:**
- Status flow: `Shortlisted` → `Contacted` → `Negotiating` → `Booked` → `Paid (DP)` → `Paid (Full)` → `Completed` → `Cancelled`
- Transisi ke "Booked": input Tanggal Booking, Paket Dipilih, Harga Deal, DP Amount, Deadline Pelunasan
- Transisi ke "Paid (DP)": input Tanggal Bayar, Bukti Transfer (upload)
- Transisi ke "Paid (Full)": input Tanggal Pelunasan, Bukti Transfer
- Status "Booked"+ otomatis masuk kalkulasi budget
- Status "Cancelled" mengembalikan budget (dengan catatan alasan cancel)

### Non-Functional Requirements

- Vendor list page load < 2 detik untuk 50+ vendor
- Image upload dengan progress indicator dan compression otomatis
- Optimistic UI update untuk status change
- Mobile: Card-based layout (bukan tabel) di viewport < 768px
- Vendor data exportable ke CSV

## 7. Acceptance Criteria

### US-V2: Kategori Vendor
- **Given** user membuka halaman "Tambah Vendor"
- **When** user klik dropdown "Kategori"
- **Then** 12 kategori default muncul dengan ikon masing-masing, plus opsi "Buat Kategori Baru"

### US-V4: Vendor Comparison
- **Given** user memiliki 3 vendor catering dengan paket berbeda
- **When** user memilih ketiga vendor dan klik "Bandingkan"
- **Then** tabel side-by-side muncul dengan highlight harga terendah (hijau) dan rating tertinggi (hijau)
- **And** tombol "Pilih Vendor Ini" ada di setiap kolom

### US-V5: Booking Status Flow
- **Given** vendor "ABC Catering" berstatus "Negotiating"
- **When** user mengubah status ke "Booked" dan mengisi form (Paket: Gold, Harga: Rp 30.000.000, DP: Rp 15.000.000)
- **Then** vendor status berubah ke "Booked", budget terpakai bertambah Rp 30.000.000, dan task "Pelunasan ABC Catering" otomatis muncul di Planning Board

## 8. Out of Scope

- Vendor dapat mendaftarkan diri sendiri (marketplace)
- Review/rating vendor oleh publik
- Chat langsung dengan vendor via platform
- Vendor recommendation engine (AI)
- Kontrak/agreement management
- Payment gateway untuk bayar vendor langsung
