# Feature PRD: Vendor Marketplace & Vendor Account

> **Epic:** NIKAHKU — Wedding Planner Platform
> **Feature:** Vendor Marketplace (B2B Platform)
> **Version:** 0.1 — Draft
> **Status:** Draft — Awaiting Review
> **Target Phase:** v2.0 (Phase 4)
> **Dependencies:** Vendor Management Module (02)

---

## 1. Feature Name

**Vendor Marketplace** — Platform B2B yang mempertemukan vendor pernikahan dengan calon pengantin. Vendor dapat membuat akun, mengelola profil & paket, dan menjangkau customer. Calon pengantin dapat menemukan, membandingkan, dan mereview vendor dari marketplace.

## 2. Epic

- Parent: [NIKAHKU PRD](../PRD.md)
- Related: [Vendor Management](./02-vendor-management.md)

## 3. Goal

### Problem

Saat ini, data vendor di NIKAHKU diinput secara manual oleh calon pengantin. Ini menimbulkan beberapa masalah:

1. **Bagi Vendor:** Tidak ada channel digital terpusat untuk menjangkau calon pengantin. Marketing bergantung pada Instagram, WA broadcast, dan referral mulut ke mulut. Tidak ada cara untuk menampilkan portofolio & paket secara terstruktur.

2. **Bagi Calon Pengantin:** Harus mencari vendor satu per satu di Instagram/Google, menghubungi via WA untuk tanya harga, dan menginput data secara manual ke NIKAHKU. Proses ini memakan waktu berminggu-minggu.

3. **Bagi NIKAHKU:** Tidak ada revenue model dari sisi vendor. Data vendor tidak terstandarisasi karena diinput manual oleh user yang berbeda-beda.

### Solution

Mengubah NIKAHKU menjadi **two-sided platform**:

- **Vendor Side:** Vendor mendaftar, membuat profil bisnis, mengelola paket & harga, upload portofolio, dan menerima inquiry dari calon pengantin.
- **Customer Side:** Calon pengantin dapat browse, search, filter, dan membandingkan vendor langsung dari marketplace. Data vendor terverifikasi dan terstandarisasi.
- **NIKAHKU sebagai Jembatan:** Platform menjadi matchmaker antara supply (vendor) dan demand (calon pengantin).

### Impact

| Metric | Current | Target |
|--------|---------|--------|
| Waktu cari vendor per kategori | ~7 hari | < 1 hari |
| Data vendor per kategori | 0 (manual input) | 50+ vendor/kategori |
| Vendor acquisition cost | N/A | < Rp 50.000/vendor |
| Revenue dari vendor | Rp 0 | Recurring subscription/commission |
| Customer conversion (browse → shortlist) | N/A | > 15% |

---

## 4. User Personas

### Persona A: Vendor — "Mas Budi" (Fotografer Pernikahan)

| Attribute | Detail |
|-----------|--------|
| **Demografi** | Pria 30 tahun, pemilik studio foto di Jakarta |
| **Bisnis** | 2–3 karyawan, handle 30–50 event/tahun |
| **Pain Points** | Bergantung pada Instagram & referral, sulit menampilkan paket secara terstruktur, tidak tahu demand dari calon pengantin |
| **Goals** | Jangkau lebih banyak customer, tampilkan portofolio profesional, terima inquiry langsung |
| **Tech Savvy** | Familiar dengan sosmed bisnis, punya website sederhana |

### Persona B: Vendor — "Bu Sari" (Catering)

| Attribute | Detail |
|-----------|--------|
| **Demografi** | Wanita 45 tahun, pemilik catering di Surabaya |
| **Bisnis** | 10+ karyawan, handle 80+ event/tahun |
| **Pain Points** | Tim marketing kecil, portfolio hanya di brosur fisik, sulit bersaing dengan vendor yang aktif di sosmed |
| **Goals** | Channel marketing baru yang cost-effective, showcase menu & paket secara digital |
| **Tech Savvy** | Sedang, bisa pakai smartphone tapi tidak aktif manage sosmed |

### Persona C: Calon Pengantin — "Rina & Adi" (existing persona)

| Attribute | Detail |
|-----------|--------|
| **Kebutuhan Baru** | Browse vendor yang sudah terverifikasi, lihat portofolio & review, bandingkan langsung tanpa harus input manual |

---

## 5. User Stories

### Vendor Account & Profile

**US-VM1:** Sebagai vendor, saya ingin mendaftar akun vendor di NIKAHKU agar saya dapat menampilkan bisnis saya ke calon pengantin.

**US-VM2:** Sebagai vendor, saya ingin membuat profil bisnis lengkap (nama, deskripsi, logo, banner, kontak, alamat, area layanan) agar calon pengantin mendapat informasi yang jelas tentang bisnis saya.

**US-VM3:** Sebagai vendor, saya ingin menambahkan dan mengelola paket harga saya (nama, deskripsi, harga, termasuk/tidak termasuk, foto) agar calon pengantin dapat membandingkan penawaran saya.

**US-VM4:** Sebagai vendor, saya ingin mengupload portofolio (foto & video dari event sebelumnya) agar calon pengantin dapat melihat kualitas kerja saya.

**US-VM5:** Sebagai vendor, saya ingin melihat statistik profil saya (views, shortlisted, inquiry) agar saya tahu seberapa efektif profil saya.

### Vendor Dashboard

**US-VM6:** Sebagai vendor, saya ingin melihat dashboard dengan ringkasan performa (views, inquiries, conversion rate) agar saya dapat mengoptimalkan profil.

**US-VM7:** Sebagai vendor, saya ingin menerima notifikasi saat ada calon pengantin yang menambahkan saya ke shortlist atau mengirim inquiry.

**US-VM8:** Sebagai vendor, saya ingin mengelola inquiry/pesan dari calon pengantin dalam satu tempat.

### Marketplace — Customer Side

**US-VM9:** Sebagai calon pengantin, saya ingin browse vendor dari marketplace berdasarkan kategori agar saya tidak perlu mencari manual di luar platform.

**US-VM10:** Sebagai calon pengantin, saya ingin filter vendor berdasarkan kategori, kota/area, range harga, dan rating agar saya menemukan vendor yang sesuai kebutuhan.

**US-VM11:** Sebagai calon pengantin, saya ingin melihat detail profil vendor (deskripsi, paket, portofolio, review) sebelum menambahkannya ke shortlist.

**US-VM12:** Sebagai calon pengantin, saya ingin menambahkan vendor dari marketplace ke daftar vendor saya (shortlist) dengan satu klik, tanpa perlu input data manual.

**US-VM13:** Sebagai calon pengantin, saya ingin membandingkan vendor dari marketplace secara side-by-side menggunakan fitur komparasi yang sudah ada.

### Review & Rating

**US-VM14:** Sebagai calon pengantin yang sudah selesai menggunakan vendor, saya ingin memberikan review dan rating agar membantu calon pengantin lain.

**US-VM15:** Sebagai vendor, saya ingin merespon review dari customer agar saya bisa menjelaskan atau berterima kasih.

---

## 6. Requirements

### 6.1 Vendor Registration & Authentication

**Vendor Sign Up Flow:**
1. Vendor mengakses halaman `/vendor-register` (terpisah dari customer register)
2. Input: Email, Password, Nama Bisnis, Kategori Utama, Nomor WhatsApp
3. Email verification → akun aktif dalam status "Pending Verification"
4. Admin NIKAHKU mereview → status menjadi "Verified" atau "Rejected"
5. Vendor verified mendapat badge ✓ di profil

**Vendor Roles:**
- `vendor_owner` — Full access, manage profil & paket, lihat analytics
- `vendor_staff` — Limited access, respond inquiries, update availability (future)

**Auth Separation:**
- Vendor dan Customer menggunakan tabel auth yang sama (Supabase Auth) tetapi dibedakan oleh role di tabel `profiles`
- Satu email hanya bisa menjadi vendor ATAU customer, tidak keduanya
- Vendor login redirect ke `/vendor/dashboard`, Customer ke `/dashboard`

### 6.2 Vendor Profile Management

**Basic Info:**
- Nama Bisnis (required, unique display name)
- Slug/URL (auto-generated dari nama, editable: `/marketplace/vendor/{slug}`)
- Kategori Utama (1 kategori wajib) + Kategori Tambahan (max 3)
- Deskripsi Bisnis (rich text, max 2000 karakter)
- Tahun Berdiri
- Logo (1 file, max 2MB, rasio 1:1)
- Banner/Cover (1 file, max 5MB, rasio 16:9)

**Contact & Location:**
- WhatsApp (required, format validasi +62)
- Telepon
- Email Bisnis
- Instagram Handle (auto-link ke profil IG)
- Website URL
- Alamat Lengkap
- Kota/Kabupaten (dropdown dari daftar kota Indonesia)
- Area Layanan (multi-select kota, "Seluruh Indonesia" option)

**Operational Info:**
- Hari Operasional (multi-select Sen–Min)
- Jam Operasional (start–end)
- Minimum Order / Minimum Pax (untuk catering)
- Lead Time (berapa hari/minggu sebelum event harus booking)

### 6.3 Package Management (Vendor Side)

**Package CRUD:**
- Nama Paket (required)
- Deskripsi (rich text, max 1000 karakter)
- Harga (IDR, required) — opsi "Mulai dari" untuk harga dinamis
- Termasuk (list items, max 20)
- Tidak Termasuk (list items, max 10)
- Foto Paket (max 5 foto per paket)
- Status: Aktif / Nonaktif
- Max 10 paket per vendor

**Package Display:**
- Sorted by harga ascending by default
- "Paket Populer" badge (auto berdasarkan jumlah shortlist)
- Harga ditampilkan dalam format Rupiah: "Mulai dari Rp 15.000.000"

### 6.4 Portfolio Management

**Gallery:**
- Upload foto: max 50 foto, max 5MB each, format JPG/PNG/WebP
- Upload video: link YouTube/Vimeo (embed), max 10 video
- Foto dapat di-tag dengan kategori event (Akad, Resepsi, Pre-wedding, dll.)
- Foto dapat di-reorder (drag-drop)
- Auto-compress dan generate thumbnail

**Testimonial Highlights:**
- Vendor dapat pin max 5 review terbaik ke bagian atas profil

### 6.5 Vendor Analytics Dashboard

**Metrics (30 hari terakhir):**

| Metric | Deskripsi |
|--------|-----------|
| Profile Views | Jumlah unique visitor ke halaman profil vendor |
| Package Views | Jumlah klik ke detail paket |
| Shortlisted | Berapa kali vendor ditambahkan ke shortlist customer |
| Inquiries | Jumlah pesan/inquiry masuk |
| Conversion Rate | Inquiry / Profile Views × 100% |
| Compare Appearances | Berapa kali muncul di tabel komparasi |

**Charts:**
- Line chart: Views trend 30 hari
- Bar chart: Shortlist per paket
- Funnel: Views → Shortlist → Inquiry → Booked

### 6.6 Marketplace — Customer Experience

**Marketplace Page (`/marketplace`):**
- Hero section: search bar + kategori populer
- Grid vendor cards dengan: logo, nama, kategori, kota, rating, harga mulai dari, jumlah review
- Infinite scroll atau pagination (20 vendor per load)
- Sort by: Relevansi (default), Rating Tertinggi, Harga Terendah, Harga Tertinggi, Terbaru, Review Terbanyak

**Search & Filters:**
- Full-text search: nama vendor, deskripsi
- Filter Kategori (multi-select dari 12+ kategori)
- Filter Kota/Area (multi-select)
- Filter Range Harga (slider: Rp 0 – Rp 500.000.000)
- Filter Rating Minimum (1–5 bintang)
- Filter Status: Semua / Verified Only
- Filter Availability: Tersedia di tanggal pernikahan (future enhancement)

**Vendor Detail Page (`/marketplace/vendor/{slug}`):**
- Sections: Header (banner + logo + info), Tentang, Paket & Harga, Portofolio, Review, FAQ
- CTA Buttons: "Tambah ke Shortlist", "Hubungi via WhatsApp", "Kirim Inquiry"
- Related vendors sidebar (same category, same city)
- Breadcrumb: Marketplace > {Kategori} > {Vendor Name}

**Shortlist Integration:**
- Tombol "Tambah ke Shortlist" di card dan detail page
- Saat ditambahkan, vendor otomatis masuk ke `/vendor` user dengan data pre-filled dari marketplace
- Status awal: `Shortlisted`
- Data paket yang dipilih juga ter-copy

### 6.7 Review & Rating System

**Review Structure:**
- Rating: 1–5 bintang (required)
- Judul Review (optional, max 100 karakter)
- Isi Review (required, min 50 karakter, max 1000 karakter)
- Aspek Rating (optional): Kualitas, Harga, Komunikasi, Ketepatan Waktu — masing-masing 1–5
- Foto Review (optional, max 5 foto)
- Tanggal Event

**Review Rules:**
- Hanya customer yang status vendor-nya "Completed" yang bisa review
- 1 review per vendor per customer
- Review bisa di-edit dalam 7 hari setelah submit
- Review tidak bisa dihapus oleh customer (bisa request ke admin)
- Vendor bisa reply 1x per review

**Review Display:**
- Aggregate rating (rata-rata + jumlah review)
- Rating breakdown bar (5★: 60%, 4★: 25%, dst.)
- Sort by: Terbaru, Rating Tertinggi, Rating Terendah, Paling Helpful
- "Helpful" voting oleh user lain

### 6.8 Inquiry / Messaging System

**Basic Inquiry (v2.0):**
- Form: Nama, Tanggal Event, Jumlah Tamu, Pesan, Budget Range
- Inquiry masuk ke dashboard vendor sebagai "lead"
- Vendor reply via platform (simple thread, bukan real-time chat)
- Email notification ke kedua pihak

**Catatan:** Real-time chat ditunda ke versi selanjutnya. Untuk v2.0, inquiry bersifat form-based dan async.

---

## 7. Database Schema (Draft)

### New Tables

```
vendor_profiles
├── id (uuid, PK)
├── user_id (uuid, FK → auth.users)
├── business_name (text, unique)
├── slug (text, unique)
├── description (text)
├── logo_url (text)
├── banner_url (text)
├── category_id (uuid, FK → vendor_categories)
├── additional_categories (uuid[])
├── whatsapp (text)
├── phone (text)
├── email (text)
├── instagram (text)
├── website (text)
├── address (text)
├── city (text)
├── service_areas (text[])
├── year_established (int)
├── operating_days (text[])
├── operating_hours_start (time)
├── operating_hours_end (time)
├── min_order (int)
├── lead_time_days (int)
├── verification_status (enum: pending, verified, rejected, suspended)
├── is_featured (boolean, default false)
├── created_at (timestamptz)
└── updated_at (timestamptz)

vendor_packages
├── id (uuid, PK)
├── vendor_profile_id (uuid, FK → vendor_profiles)
├── name (text)
├── description (text)
├── price (bigint, IDR)
├── price_type (enum: fixed, starting_from)
├── includes (jsonb[])
├── excludes (jsonb[])
├── photos (text[])
├── is_active (boolean, default true)
├── sort_order (int)
├── created_at (timestamptz)
└── updated_at (timestamptz)

vendor_portfolio
├── id (uuid, PK)
├── vendor_profile_id (uuid, FK → vendor_profiles)
├── type (enum: photo, video)
├── url (text)
├── thumbnail_url (text)
├── caption (text)
├── event_type (text)
├── sort_order (int)
├── created_at (timestamptz)
└── updated_at (timestamptz)

vendor_reviews
├── id (uuid, PK)
├── vendor_profile_id (uuid, FK → vendor_profiles)
├── user_id (uuid, FK → auth.users)
├── wedding_id (uuid, FK → weddings)
├── rating (int, 1-5)
├── title (text)
├── content (text)
├── quality_rating (int, 1-5, nullable)
├── price_rating (int, 1-5, nullable)
├── communication_rating (int, 1-5, nullable)
├── punctuality_rating (int, 1-5, nullable)
├── photos (text[])
├── event_date (date)
├── vendor_reply (text, nullable)
├── vendor_reply_at (timestamptz, nullable)
├── helpful_count (int, default 0)
├── created_at (timestamptz)
└── updated_at (timestamptz)

vendor_inquiries
├── id (uuid, PK)
├── vendor_profile_id (uuid, FK → vendor_profiles)
├── user_id (uuid, FK → auth.users)
├── name (text)
├── event_date (date)
├── guest_count (int)
├── budget_range (text)
├── message (text)
├── status (enum: new, read, replied, closed)
├── created_at (timestamptz)
└── updated_at (timestamptz)

vendor_inquiry_replies
├── id (uuid, PK)
├── inquiry_id (uuid, FK → vendor_inquiries)
├── sender_type (enum: vendor, customer)
├── message (text)
├── created_at (timestamptz)
└── updated_at (timestamptz)

vendor_analytics (materialized / cron-updated)
├── id (uuid, PK)
├── vendor_profile_id (uuid, FK → vendor_profiles)
├── date (date)
├── profile_views (int)
├── package_views (int)
├── shortlist_count (int)
├── inquiry_count (int)
├── compare_count (int)
├── created_at (timestamptz)
└── updated_at (timestamptz)

review_helpful_votes
├── id (uuid, PK)
├── review_id (uuid, FK → vendor_reviews)
├── user_id (uuid, FK → auth.users)
├── created_at (timestamptz)
└── UNIQUE(review_id, user_id)
```

### Modified Tables

```
profiles (existing)
├── ... existing fields ...
└── role (enum: customer, vendor, admin)  ← NEW FIELD

vendors (existing, user's personal vendor list)
├── ... existing fields ...
└── marketplace_vendor_id (uuid, FK → vendor_profiles, nullable)  ← NEW FIELD
    // Links user's shortlisted vendor to marketplace source
```

---

## 8. Routing Structure

### Vendor Routes (Protected — vendor role)

```
/vendor-register          → Vendor registration page
/vendor/dashboard         → Vendor analytics dashboard
/vendor/profile           → Edit vendor profile
/vendor/packages          → Manage packages (CRUD)
/vendor/portfolio         → Manage portfolio (photo/video)
/vendor/inquiries         → Inquiry inbox
/vendor/reviews           → View & respond to reviews
/vendor/settings          → Vendor account settings
```

### Marketplace Routes (Public + Protected)

```
/marketplace              → Marketplace homepage (public)
/marketplace/search       → Search results with filters (public)
/marketplace/category/:id → Category listing (public)
/marketplace/vendor/:slug → Vendor detail page (public)
/marketplace/vendor/:slug/review → Write review (protected — customer)
```

### Integration Points with Existing Routes

```
/vendor                   → User's vendor list — adds "Browse Marketplace" CTA
/vendor/compare           → Compare page — can include marketplace vendors
/dashboard                → Quick stat: "X vendor tersedia di kotamu"
```

---

## 9. UI/UX Wireframe Notes

### Marketplace Homepage (`/marketplace`)

```
┌─────────────────────────────────────────────┐
│  🔍 Cari vendor pernikahan...          [🔎] │
│                                             │
│  Kategori Populer:                          │
│  [📸 Foto] [🍽 Catering] [🏛 Venue] [💐 Dekorasi] │
│  [👗 Busana] [🎤 MC] [💌 Undangan] [•••]   │
├─────────────────────────────────────────────┤
│  Vendor Pilihan ──────────── Lihat Semua →  │
│  ┌────────┐ ┌────────┐ ┌────────┐          │
│  │ [Logo] │ │ [Logo] │ │ [Logo] │          │
│  │ Nama   │ │ Nama   │ │ Nama   │          │
│  │ ⭐ 4.8 │ │ ⭐ 4.9 │ │ ⭐ 4.7 │          │
│  │ Jakarta│ │ Bandung│ │ Surabay│          │
│  │ Rp 15jt│ │ Rp 20jt│ │ Rp 12jt│          │
│  └────────┘ └────────┘ └────────┘          │
├─────────────────────────────────────────────┤
│  Vendor Terbaru ──────────── Lihat Semua →  │
│  ... (same card layout)                     │
└─────────────────────────────────────────────┘
```

### Vendor Detail Page

```
┌─────────────────────────────────────────────┐
│  [═══════ BANNER IMAGE ═══════════════════] │
│  [Logo] Nama Vendor ✓                       │
│         ⭐ 4.8 (124 review) · Jakarta       │
│         Fotografi & Videografi              │
│                                             │
│  [Tambah ke Shortlist] [Chat WA] [Inquiry]  │
├─────────────────────────────────────────────┤
│  [Tentang] [Paket] [Portofolio] [Review]    │
├─────────────────────────────────────────────┤
│  Tentang                                    │
│  Lorem ipsum dolor sit amet...              │
│                                             │
│  📍 Jakarta Selatan                         │
│  📅 Berdiri sejak 2018                      │
│  ⏰ Sen–Sab, 09:00–18:00                    │
│  🕐 Booking min. 30 hari sebelum event      │
├─────────────────────────────────────────────┤
│  Paket & Harga                              │
│  ┌──────────────────────────────────┐       │
│  │ 📦 Paket Silver — Rp 15.000.000 │       │
│  │ ✅ 8 jam dokumentasi              │       │
│  │ ✅ 200 foto edited               │       │
│  │ ✅ 1 video cinematic             │       │
│  │ [Pilih Paket Ini]               │       │
│  └──────────────────────────────────┘       │
│  ┌──────────────────────────────────┐       │
│  │ 📦 Paket Gold — Rp 25.000.000   │       │
│  │ ... (more details)               │       │
│  └──────────────────────────────────┘       │
├─────────────────────────────────────────────┤
│  Review (124)            Sort: Terbaru ▼    │
│  ⭐⭐⭐⭐⭐ Sangat profesional!               │
│  "Tim foto nya ramah dan hasilnya bagus..." │
│  — Rina, 15 Mar 2026       [👍 Helpful 12] │
│                                             │
│  ↳ Vendor: Terima kasih Rina! 🙏            │
└─────────────────────────────────────────────┘
```

### Vendor Dashboard

```
┌─────────────────────────────────────────────┐
│  Dashboard Vendor                           │
│                                             │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │
│  │ 1.2K │ │  45  │ │  12  │ │ 8.3% │      │
│  │Views │ │Short │ │Inqui │ │Conv. │      │
│  └──────┘ └──────┘ └──────┘ └──────┘      │
│                                             │
│  📈 Views Trend (30 hari)                   │
│  [═══ LINE CHART ═══════════════════]       │
│                                             │
│  📬 Inquiry Terbaru                         │
│  ┌──────────────────────────────────┐       │
│  │ 🔴 Rina — Catering 200 pax      │       │
│  │    15 Mar 2026 · Budget 50–80jt  │       │
│  │    "Halo, apakah bisa untuk..."  │       │
│  │                      [Balas →]   │       │
│  └──────────────────────────────────┘       │
└─────────────────────────────────────────────┘
```

---

## 10. Business Model

### Revenue Streams

| Model | Deskripsi | Target Price |
|-------|-----------|-------------|
| **Freemium Listing** | Profil dasar + 3 paket + 10 foto portfolio | Gratis |
| **Premium Listing** | Unlimited paket, 50 foto, priority ranking, analytics dashboard, badge "Premium" | Rp 150.000–300.000/bulan |
| **Featured Placement** | Muncul di "Vendor Pilihan" di homepage & kategori | Rp 500.000–1.000.000/minggu |
| **Commission** | % dari setiap booking yang terjadi via NIKAHKU (future) | 3–5% per transaksi |
| **Lead Generation** | Vendor bayar per inquiry yang masuk (future) | Rp 10.000–25.000/inquiry |

### Free vs Premium Comparison

| Feature | Free | Premium |
|---------|------|---------|
| Profil Bisnis | ✅ | ✅ |
| Jumlah Paket | Max 3 | Unlimited |
| Foto Portfolio | Max 10 | Max 50 |
| Video Embed | Max 2 | Max 10 |
| Analytics Dashboard | Basic (views only) | Full (views, funnel, trends) |
| Reply Review | ✅ | ✅ |
| Priority di Search | ❌ | ✅ (muncul lebih atas) |
| Badge "Premium" | ❌ | ✅ |
| Featured Placement | ❌ | Beli terpisah |
| Inquiry Notification | Email only | Email + Push + WA |

---

## 11. Acceptance Criteria

### US-VM1: Vendor Registration
- **Given** user mengakses `/vendor-register`
- **When** user mengisi form (email, password, nama bisnis, kategori, WA) dan submit
- **Then** akun vendor terbuat dengan status "Pending Verification", email verifikasi terkirim
- **And** setelah email verified, vendor bisa login dan mengisi profil
- **And** admin mendapat notifikasi untuk review vendor baru

### US-VM9: Browse Marketplace
- **Given** calon pengantin membuka `/marketplace`
- **When** halaman dimuat
- **Then** tampil search bar, kategori populer, vendor pilihan, dan vendor terbaru
- **And** setiap vendor card menampilkan: logo, nama, kategori, kota, rating, harga mulai dari

### US-VM10: Filter Vendor
- **Given** calon pengantin di halaman marketplace dengan 100+ vendor
- **When** user memilih filter: Kategori = "Fotografi", Kota = "Jakarta", Rating ≥ 4
- **Then** hanya vendor fotografi di Jakarta dengan rating ≥ 4 yang muncul
- **And** filter count ditampilkan: "12 vendor ditemukan"

### US-VM12: Add to Shortlist
- **Given** calon pengantin melihat vendor "Studio ABC" di marketplace
- **When** user klik "Tambah ke Shortlist"
- **Then** vendor otomatis masuk ke daftar vendor user (`/vendor`) dengan data pre-filled
- **And** status awal = "Shortlisted", `marketplace_vendor_id` ter-link
- **And** toast notification: "Studio ABC ditambahkan ke shortlist"

### US-VM14: Write Review
- **Given** user memiliki vendor "Studio ABC" dengan status "Completed"
- **When** user klik "Tulis Review" dan mengisi rating 5, judul, isi review 100 karakter, dan 2 foto
- **Then** review tersimpan dan muncul di profil vendor
- **And** aggregate rating vendor ter-update
- **And** vendor mendapat notifikasi review baru

---

## 12. Security & Privacy

### Data Protection
- Vendor hanya bisa melihat nama depan + kota customer yang inquiry (bukan email/telepon)
- Kontak lengkap customer baru terlihat saat customer memilih "Share Contact"
- Review bersifat publik tetapi hanya first name yang ditampilkan
- Vendor tidak bisa melihat shortlist count per customer

### Abuse Prevention
- Rate limiting: max 10 inquiries per customer per hari
- Spam detection: review dengan kata-kata yang sama diblokir
- Vendor tidak bisa review vendor lain
- Report button untuk review yang tidak sesuai
- Admin moderation queue untuk review yang di-flag

### Row Level Security (Supabase RLS)
- `vendor_profiles`: Public read (verified only), owner write
- `vendor_packages`: Public read (active only), vendor owner write
- `vendor_reviews`: Public read, authenticated customer write (own review only)
- `vendor_inquiries`: Vendor owner + inquiry creator read/write
- `vendor_analytics`: Vendor owner read only

---

## 13. Implementation Phases

### Phase 4A: Vendor Account Foundation (4 minggu)

- [ ] Vendor registration & authentication flow
- [ ] Vendor profile CRUD (basic info, contact, location)
- [ ] Package management (CRUD + reorder)
- [ ] Portfolio upload (photos only)
- [ ] Database schema + RLS policies
- [ ] Vendor dashboard (basic stats)

### Phase 4B: Marketplace Customer Side (4 minggu)

- [ ] Marketplace homepage (`/marketplace`)
- [ ] Search & filter system
- [ ] Vendor detail page
- [ ] "Add to Shortlist" integration with existing vendor list
- [ ] Breadcrumb navigation
- [ ] SEO optimization (SSR, meta tags, structured data)

### Phase 4C: Reviews & Inquiry (3 minggu)

- [ ] Review & rating system (write, display, aggregate)
- [ ] Vendor reply to reviews
- [ ] Inquiry form + inbox
- [ ] Inquiry reply thread
- [ ] Email notifications
- [ ] Helpful voting

### Phase 4D: Analytics & Monetization (3 minggu)

- [ ] Vendor analytics dashboard (full metrics)
- [ ] Charts (views trend, funnel)
- [ ] Premium tier implementation
- [ ] Featured placement system
- [ ] Admin panel: vendor verification, content moderation
- [ ] Payment integration for vendor subscriptions

---

## 14. Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Cold start — tidak ada vendor saat launch | Customer tidak tertarik browse marketplace kosong | Tinggi | Onboard 50–100 vendor secara manual sebelum launch. Offer free premium 3 bulan untuk early adopters |
| Vendor spam / profil berkualitas rendah | Menurunkan trust customer | Sedang | Admin verification wajib sebelum go-live. Quality checklist (min foto, deskripsi lengkap) |
| Fake reviews | Merusak integritas rating | Sedang | Review hanya dari customer yang status "Completed". Anti-spam detection. Report + moderation |
| Vendor churn (berhenti bayar premium) | Revenue drop | Sedang | Provide value via analytics & leads. Low free tier agar vendor tetap terlihat |
| Conflict of interest — vendor merasa bersaing tidak adil | Vendor protes ranking | Rendah | Transparansi algoritma ranking. Free tier tetap bisa ditemukan. Premium hanya boost, bukan monopoli |

---

## 15. Success Metrics

| Metric | Target (6 bulan post-launch) |
|--------|------------------------------|
| Registered Vendors | 500+ |
| Verified Vendors | 300+ (60% conversion) |
| Vendor with Complete Profile | 200+ (foto, paket, deskripsi lengkap) |
| Monthly Marketplace Visitors | 10.000+ unique |
| Shortlist from Marketplace | 2.000+/bulan |
| Inquiry Sent | 500+/bulan |
| Reviews Written | 100+/bulan |
| Vendor Premium Conversion | 10% (30 vendors) |
| Average Vendor Rating | ≥ 4.0 |
| Customer Satisfaction (marketplace) | NPS > 40 |

---

## 16. Out of Scope (v2.0)

- ❌ Real-time chat antara vendor dan customer
- ❌ Payment gateway untuk bayar vendor langsung via platform
- ❌ AI-powered vendor recommendation
- ❌ Vendor bidding system (vendor menawar project customer)
- ❌ Multi-branch vendor (1 vendor = beberapa lokasi)
- ❌ Kontrak/agreement digital
- ❌ Video call consultation
- ❌ Vendor mobile app (native)
- ❌ Multi-language support

---

## 17. Competitive Analysis

| Platform | Model | Strengths | Weakness vs NIKAHKU |
|----------|-------|-----------|---------------------|
| **Bridestory** | Marketplace-first | 30K+ vendor, established brand | Tidak punya planning/budget tool. Vendor data tidak bisa di-manage oleh user |
| **WeddingKu** | Content + directory | Banyak konten inspirasi | UX outdated, tidak ada komparasi side-by-side |
| **The Bride Dept** | Media + vendor listing | High-quality editorial | Hanya listing, tidak ada booking tracking |
| **NIKAHKU** | **Planning-first + Marketplace** | **Integrated: plan + budget + vendor + marketplace dalam satu platform. Data vendor dari marketplace langsung masuk ke planning tool user** | Needs vendor onboarding momentum |

**NIKAHKU Differentiator:** Satu-satunya platform yang mengintegrasikan wedding planning tools (budget, checklist, guest list) dengan vendor marketplace. Customer tidak perlu copy-paste data vendor — cukup klik "Tambah ke Shortlist" dan data vendor lengkap langsung masuk ke planning flow mereka.
