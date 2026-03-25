# Feature PRD: Guest List & Undangan

> **Epic:** NIKAHKU — Wedding Planner Platform
> **Feature:** Guest List & Invitation Management
> **Version:** 1.0
> **Status:** Draft

---

## 1. Feature Name

**Guest List & Undangan** — Modul pengelolaan daftar tamu, RSVP tracking, dan manajemen sesi acara.

## 2. Epic

- Parent: [NIKAHKU PRD](../PRD.md)

## 3. Goal

**Problem:** Mengelola ratusan hingga ribuan tamu undangan secara manual (Excel/kertas) menyebabkan: tamu terlewat, duplikasi undangan, tidak tahu jumlah pasti yang hadir (penting untuk catering & venue), dan kesulitan mengkategorikan tamu berdasarkan sesi.

**Solution:** Database tamu terpusat dengan RSVP tracking, pengelompokan per kategori dan sesi, import massal dari Excel, dan ringkasan statistik real-time.

**Impact:**
- Zero tamu terlewat dengan database terpusat
- Estimasi kehadiran akurat untuk koordinasi vendor catering/venue
- Waktu pengelolaan undangan berkurang 60%

## 4. User Personas

- **Primary:** Calon Pengantin — input dan manage guest list
- **Secondary:** Keluarga/Orang Tua — membantu menambahkan daftar tamu keluarga besar

## 5. User Stories

**US-G1:** Sebagai calon pengantin, saya ingin mencatat semua tamu undangan dengan data kontak lengkap agar tidak ada yang terlewat.

**US-G2:** Sebagai calon pengantin, saya ingin mengkategorikan tamu (Keluarga Pria, Keluarga Wanita, Teman, Kantor, dll.) agar mudah dikelompokkan.

**US-G3:** Sebagai calon pengantin, saya ingin melacak status RSVP setiap tamu agar tahu perkiraan jumlah hadir.

**US-G4:** Sebagai calon pengantin, saya ingin meng-assign tamu ke sesi acara tertentu (Akad, Resepsi Siang, Resepsi Malam) agar capacity planning akurat.

**US-G5:** Sebagai calon pengantin, saya ingin mengimport daftar tamu dari file Excel/CSV agar tidak perlu input satu per satu.

**US-G6:** Sebagai calon pengantin, saya ingin melihat statistik tamu (total, hadir, tidak hadir, belum konfirmasi) di dashboard.

**US-G7:** Sebagai calon pengantin, saya ingin melakukan bulk update status RSVP agar proses update lebih cepat.

## 6. Requirements

### Functional Requirements

**Guest Data — Fields:**
- Nama Tamu (text, required)
- Kategori (enum: Keluarga Pria, Keluarga Wanita, Teman Pria, Teman Wanita, Rekan Kerja Pria, Rekan Kerja Wanita, Tetangga, VIP, Lainnya — customizable)
- No. HP / WhatsApp (text, optional)
- Email (text, optional)
- Jumlah Orang (integer, default: 1, termasuk plus-one)
- Alamat (text, optional)
- Sesi (multi-select: assign ke 1+ sesi)
- Status RSVP (enum)
- Catatan (text, optional)

**RSVP Status Flow:**
`Belum Diundang` → `Undangan Terkirim` → `Hadir` / `Tidak Hadir` / `Belum Konfirmasi`

**Guest Categories:**
- Kategori default yang bisa di-customize
- User bisa tambah/edit/hapus kategori
- Warna badge per kategori

**Sesi / Acara Management:**
- User dapat membuat sesi: Nama Sesi, Tanggal, Waktu Mulai, Waktu Selesai, Venue, Kapasitas Max
- Setiap tamu bisa di-assign ke 1 atau lebih sesi
- Warning jika total tamu assigned ke sesi > kapasitas max
- Count tamu per sesi real-time

**Import Feature:**
- Upload CSV atau Excel (.xlsx)
- Mapping kolom: UI untuk mapping kolom file ke field system
- Preview 10 baris pertama sebelum import
- Validasi: duplikasi nama, format nomor HP
- Report: X berhasil, Y gagal, Z duplikat

**Statistik & Summary:**
- Total Undangan (jumlah entry)
- Total Orang (sum jumlah_orang)
- Per RSVP status: Hadir (X orang), Tidak Hadir (X), Belum Konfirmasi (X)
- Per Kategori: breakdown count
- Per Sesi: breakdown count vs kapasitas
- Donut chart RSVP distribution

**Bulk Operations:**
- Multi-select via checkbox
- Bulk update: RSVP status, Kategori, Sesi assignment
- Bulk delete dengan konfirmasi
- Select all / deselect all

**Search & Filter:**
- Search by nama tamu
- Filter by: Kategori, Status RSVP, Sesi
- Sort by: Nama (A-Z/Z-A), Kategori, Status

### Non-Functional Requirements

- Tabel mendukung 2.000+ tamu tanpa degradasi performa (virtual scrolling)
- Import CSV/Excel hingga 5.000 baris dalam < 30 detik
- Bulk update hingga 500 record dalam < 5 detik
- Mobile: Card-based list view, swipe actions untuk quick RSVP update
- Export ke CSV/Excel/PDF

## 7. Acceptance Criteria

### US-G3: RSVP Tracking
- **Given** 100 tamu telah diinput dengan status "Undangan Terkirim"
- **When** user mengubah 30 tamu ke "Hadir" (masing-masing +1 orang) dan 10 tamu ke "Tidak Hadir"
- **Then** dashboard menampilkan: Hadir 60 orang, Tidak Hadir 10 orang, Belum Konfirmasi 120 orang

### US-G4: Session Assignment
- **Given** sesi "Resepsi Malam" dengan kapasitas 500 orang
- **When** total tamu yang di-assign ke sesi tersebut mencapai 520 orang
- **Then** warning badge merah muncul: "Melebihi kapasitas 20 orang"

### US-G5: Import Excel
- **Given** user memiliki file Excel berisi 200 tamu dengan kolom: Nama, No HP, Kategori
- **When** user upload file dan mapping kolom
- **Then** preview 10 baris pertama muncul, user konfirmasi, dan 200 tamu berhasil ditambahkan

## 8. Out of Scope

- Digital invitation (e-invitation) builder dan pengiriman
- WhatsApp broadcast / blast
- RSVP form online yang bisa diisi tamu sendiri
- Seating arrangement / denah meja
- QR Code check-in di hari-H
- Integrasi kontak HP / Google Contacts
