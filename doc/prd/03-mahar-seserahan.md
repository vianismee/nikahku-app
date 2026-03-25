# Feature PRD: Mahar & Seserahan

> **Epic:** NIKAHKU — Wedding Planner Platform
> **Feature:** Mahar & Seserahan Tracker
> **Version:** 1.0
> **Status:** Draft

---

## 1. Feature Name

**Mahar & Seserahan Tracker** — Modul pencatatan, tracking pembelian, dan manajemen daftar mahar serta seserahan dengan integrasi link toko online.

## 2. Epic

- Parent: [NIKAHKU PRD](../PRD.md)

## 3. Goal

**Problem:** Persiapan mahar dan seserahan melibatkan belasan hingga puluhan item yang harus dibeli dari berbagai toko (online dan offline). Pasangan sering lupa item mana yang sudah dibeli, kehilangan link produk, atau tidak tahu estimasi total biaya.

**Solution:** Tabel terstruktur untuk seluruh item mahar dan seserahan dengan kolom merek, range harga, link toko (Shopee/Tokopedia), dan status pembelian — sehingga pasangan memiliki satu sumber kebenaran untuk seluruh persiapan.

**Impact:**
- Zero item terlewat (checklist digital)
- Estimasi biaya akurat sebelum belanja
- Link toko tersimpan rapi, tidak hilang di chat

## 4. User Personas

- **Primary:** Calon Pengantin Wanita — biasanya yang mengurusi detail seserahan
- **Secondary:** Calon Pengantin Pria — terutama untuk mahar
- **Tertiary:** Keluarga/Orang Tua — sering membantu belanja

## 5. User Stories

**US-S1:** Sebagai calon pengantin, saya ingin mencatat semua item mahar dan seserahan dalam tabel yang rapi agar tidak ada yang terlewat.

**US-S2:** Sebagai calon pengantin, saya ingin menyimpan link produk Shopee/Tokopedia untuk setiap item agar mudah dibuka saat mau beli.

**US-S3:** Sebagai calon pengantin, saya ingin melihat range harga setiap item agar bisa memperkirakan total biaya sebelum belanja.

**US-S4:** Sebagai calon pengantin, saya ingin menandai item yang sudah dibeli agar tahu progress pembelian.

**US-S5:** Sebagai calon pengantin, saya ingin memisahkan daftar mahar dan seserahan agar lebih terorganisir.

**US-S6:** Sebagai calon pengantin, saya ingin mengurutkan item berdasarkan prioritas agar tahu mana yang harus dibeli duluan.

## 6. Requirements

### Functional Requirements

**Tabel Utama — Kolom:**
- No (auto-increment)
- Nama Barang (text, required)
- Kategori (enum: Mahar / Seserahan, required)
- Sub-Kategori (text, optional — e.g., "Perlengkapan Ibadah", "Skincare Set", "Tas & Sepatu")
- Merek (text, optional)
- Range Harga Min (currency IDR, required)
- Range Harga Max (currency IDR, required, ≥ min)
- Link Toko (URL, optional)
- Platform (auto-detect dari URL: Shopee / Tokopedia / Lainnya / Manual)
- Status Pembelian (enum: Belum Dibeli / Sudah Dibeli / Sudah Diterima)
- Harga Aktual (currency IDR, diisi saat status = Sudah Dibeli)
- Tanggal Pembelian (date, diisi saat status = Sudah Dibeli)
- Prioritas (enum: Tinggi / Sedang / Rendah)
- Catatan (text, optional)

**Platform Auto-Detection:**
- URL mengandung "shopee.co.id" → Ikon Shopee (orange)
- URL mengandung "tokopedia.com" → Ikon Tokopedia (green)
- URL lainnya → Ikon globe generic
- Tidak ada URL → Teks "Belum ada link"

**Link Behavior:**
- Link clickable → buka di tab baru
- Ikon platform ditampilkan di samping link
- Tombol "Copy Link" di setiap row
- Validasi URL format saat input

**Filter & View:**
- Tab toggle: Semua | Mahar | Seserahan
- Filter status: Semua | Belum Dibeli | Sudah Dibeli | Sudah Diterima
- Sort by: Prioritas, Harga (asc/desc), Status, Tanggal
- Search by nama barang

**Summary Cards:**
- Total Item: X items (Y mahar, Z seserahan)
- Progress: X dari Y sudah dibeli (progress bar)
- Estimasi Biaya: Rp XX.XXX.XXX – Rp XX.XXX.XXX (berdasarkan range harga item yang belum dibeli)
- Total Aktual: Rp XX.XXX.XXX (berdasarkan harga aktual item yang sudah dibeli)
- Sisa Budget Seserahan: (jika user set alokasi budget untuk kategori ini)

**Integrasi Budget:**
- Total harga aktual item yang sudah dibeli otomatis masuk ke Budget Manager sebagai pengeluaran kategori "Seserahan & Mahar"
- Estimasi biaya (rata-rata range harga) ditampilkan sebagai "projected spending"

**Drag & Drop:**
- User bisa reorder item (prioritas)
- Nomor urut auto-update

### Non-Functional Requirements

- Tabel mendukung hingga 100 item tanpa degradasi performa
- Inline editing: klik cell → edit langsung (tanpa modal/popup untuk field sederhana)
- Mobile view: Card-based layout (bukan tabel horizontal) di viewport < 768px
- Sticky header pada tabel saat scroll
- Alternating row colors untuk readability
- Export ke CSV/Excel

## 7. Acceptance Criteria

### US-S1: Tabel Mahar & Seserahan
- **Given** user membuka halaman Mahar & Seserahan
- **When** user klik "Tambah Item" dan mengisi: Nama = "Al-Quran Custom", Kategori = "Mahar", Merek = "Syaamil", Range Harga = Rp 200.000 – Rp 500.000
- **Then** item muncul di tabel dengan nomor urut otomatis dan status "Belum Dibeli"

### US-S2: Link Toko
- **Given** user menambahkan item dengan link "https://shopee.co.id/product/12345"
- **When** tabel dimuat
- **Then** kolom Link Toko menampilkan ikon Shopee (orange) + teks link yang bisa diklik ke tab baru

### US-S4: Status Pembelian
- **Given** item "Skincare Set Wardah" berstatus "Belum Dibeli"
- **When** user mengubah status ke "Sudah Dibeli" dan mengisi Harga Aktual = Rp 350.000
- **Then** status badge berubah hijau, harga aktual tersimpan, dan Budget Manager otomatis terupdate +Rp 350.000

### US-S5: Filter Mahar vs Seserahan
- **Given** user memiliki 5 item Mahar dan 15 item Seserahan
- **When** user klik tab "Mahar"
- **Then** hanya 5 item Mahar yang ditampilkan dengan summary card khusus Mahar

## 8. Out of Scope

- Scraping harga otomatis dari Shopee/Tokopedia
- Price alert jika harga turun
- Rekomendasi item seserahan berdasarkan adat
- Integrasi checkout langsung ke marketplace
- Template daftar seserahan per adat (Jawa, Sunda, Minang, dll.)
- Foto item upload per row
