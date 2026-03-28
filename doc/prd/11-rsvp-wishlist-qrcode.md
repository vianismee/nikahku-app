# Feature PRD: RSVP Publik, Ucapan Real-time, QR Souvenir & Halaman Undangan

> **Epic:** NIKAHKU — Wedding Planner Platform
> **Feature:** Public RSVP Widget · Ucapan 1x per Tamu · QR Souvenir · Halaman Undangan Digital
> **Version:** 1.3
> **Status:** Draft
> **Dibuat:** 29 Maret 2026
> **Revisi:**
>
> - v1.1 — NanoID 5-char; sesi tidak dipilih tamu
> - v1.2 — Wishes 1x per tamu (terikat NanoID, bisa edit); tambah Halaman Undangan Digital
> - v1.3 — Klarifikasi edit halaman undangan: hanya tamu dengan NanoID yang dapat mengedit **data RSVP & ucapan mereka sendiri** di halaman undangan. Desain/konten undangan dikelola dari dashboard oleh pengantin.

---

## 1. Feature Name

**RSVP Publik & Digital Guest Experience** — Modul yang memungkinkan:

1. **Halaman Undangan Digital** — Halaman publik penuh yang dapat diakses tamu, diedit langsung oleh pengantin (inline edit mode)
2. **RSVP Widget Embeddable** — Tamu konfirmasi kehadiran via NanoID, dapat di-embed ke undangan digital manapun
3. **Ucapan & Doa Real-time** — 1 ucapan per tamu (terikat NanoID), dapat diedit, ditampilkan live
4. **QR Code Souvenir** — QR berisi NanoID per tamu, tracking pengambilan souvenir di hari-H
5. **QR Scanner** — Scanner untuk petugas di venue

---

## 2. Epic

- Parent: [NIKAHKU PRD](../PRD.md)
- Ekstensi dari: [Guest List & Undangan](04-guest-list.md)

---

## 3. Goal

**Problem:** Sistem tamu yang ada hanya diakses oleh pengantin (dashboard protected). Tidak ada cara bagi tamu untuk konfirmasi hadir, meninggalkan ucapan, atau melihat detail undangan secara digital.

**Solution:**

- **Halaman undangan** (`/i/[slug]`) — publik, berisi semua info pernikahan, dibuat & diedit langsung oleh pengantin dari halaman yang sama
- **RSVP via NanoID** — setiap tamu punya kode unik 5 karakter
- **Ucapan 1x per NanoID** — bisa diedit setelahnya, tidak bisa kirim lebih dari 1
- **Souvenir QR** — check-in terorganisir di venue

**Impact:**

- Pengantin punya undangan digital terintegrasi tanpa perlu layanan pihak ketiga
- Tamu bisa konfirmasi hadir & kirim ucapan dari 1 halaman yang sama
- Souvenir tercatat, anti-rangkap

---

## 4. NanoID Design

### Spesifikasi

| Parameter               | Nilai                                             |
| ----------------------- | ------------------------------------------------- |
| Panjang                 | 5 karakter                                        |
| Alphabet default        | `1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ` (36 chars) |
| Total kombinasi         | 36^5 = **60,466,176**                             |
| Kolisi untuk 1.000 tamu | ~0.008% — sangat aman                             |

### Catatan Alphabet

> **Jika tamu perlu ketik manual** (undangan cetak): karakter `0/O` dan `1/I` ambigu.
> Gunakan alphabet ketik-friendly: `23456789ACDEFGHJKLMNPQRSTUVWXYZ` (31 chars, 28.6 juta kombinasi).
>
> **Rekomendasi:** Default Opsi A (scan QR). Jika ada undangan cetak, pengantin bisa ganti ke Opsi B di settings.

Format display: **`A3K9Z`** — uppercase blok.

---

## 5. User Stories

### Halaman Undangan Digital

**US-I1:** Sebagai tamu, saya ingin membuka link undangan dan melihat halaman pernikahan lengkap (foto, nama, tanggal, venue, jadwal acara).

**US-I2:** Sebagai tamu, saya ingin memasukkan NanoID saya di halaman undangan untuk langsung mengisi/mengubah konfirmasi kehadiran dan ucapan saya — tanpa berpindah halaman.

**US-I3:** Sebagai tamu, saya ingin bisa kembali ke halaman undangan kapanpun dan mengedit RSVP atau ucapan saya selama batas waktu RSVP belum ditutup.

**US-I4:** Sebagai calon pengantin, saya ingin mengelola desain, konten, dan pengaturan halaman undangan dari **dashboard** (bukan dari halaman publik).

**US-I5:** Sebagai calon pengantin, saya ingin mengatur apakah halaman undangan sudah published atau masih draft.

### RSVP Publik

**US-R1:** Sebagai tamu, saya ingin memasukkan NanoID 5 karakter untuk mengakses form RSVP tanpa daftar akun.

**US-R2:** Sebagai tamu, saya ingin memilih hadir atau tidak hadir dan mengisi jumlah orang.

**US-R3:** Sebagai tamu, saya ingin melihat detail sesi yang ditetapkan untuk saya setelah konfirmasi (read-only).

**US-R4:** Sebagai calon pengantin, saya ingin mendapat iframe snippet untuk embed RSVP di undangan pihak ketiga.

**US-R6:** Sebagai calon pengantin, saya ingin setiap tamu yang diinput otomatis mendapat NanoID unik.

### Ucapan & Doa

**US-W1:** Sebagai tamu, saya ingin mengirimkan 1 ucapan untuk pengantin (terikat ke NanoID saya).

**US-W2:** Sebagai tamu, saya ingin mengedit ucapan saya jika ada kesalahan — selama halaman RSVP masih dibuka di browser yang sama.

**US-W3:** Sebagai pengunjung, saya ingin melihat ucapan dari tamu lain secara real-time.

**US-W4:** Sebagai calon pengantin, saya ingin menampilkan feed ucapan fullscreen di venue.

**US-W5:** Sebagai calon pengantin, saya ingin memoderasi (hide/delete) ucapan yang tidak pantas.

### QR Souvenir

**US-Q1:** Sebagai calon pengantin, saya ingin men-generate QR code untuk setiap tamu (berisi NanoID).

**US-Q2:** Sebagai calon pengantin, saya ingin download QR individual atau bulk ZIP.

**US-Q3:** Sebagai petugas, saya ingin scan QR tamu menggunakan kamera HP.

**US-Q4:** Sebagai petugas, saya ingin melihat nama, pax, sesi, dan status souvenir setelah scan.

**US-Q5:** Sebagai petugas, saya ingin menandai souvenir "sudah diambil" dengan 1 tap.

**US-Q6:** Sebagai calon pengantin, saya ingin laporan souvenir: diambil vs belum.

---

## 6. Feasibility Analysis

| Fitur                                  | Feasibility | Pendekatan                                                                    | Complexity |
| -------------------------------------- | ----------- | ----------------------------------------------------------------------------- | ---------- |
| Halaman Undangan publik                | ✅ Ready    | Route `/i/[slug]`, data dari tabel `invitations`                              | Low        |
| Desain undangan dikelola dari dashboard| ✅ Ready    | Form settings biasa di `/dashboard/invitation` — tidak perlu inline edit      | Low        |
| Edit RSVP via NanoID di halaman undangan | ✅ Ready  | Tamu input NanoID → `sessionStorage` simpan state → form edit muncul in-page | Low        |
| Edit ucapan via NanoID                 | ✅ Ready    | Setelah NanoID di-unlock, cek `wishes` — tampilkan form edit jika sudah ada   | Low        |
| Wishes 1x per NanoID                   | ✅ Ready    | UNIQUE constraint `(wedding_id, guest_id)` di tabel `wishes`                  | Low        |
| Realtime ucapan                        | ✅ Ready    | Supabase Realtime `postgres_changes`                                          | Low        |
| QR Generate                            | ✅ Ready    | Library `qrcode`                                                              | Low        |
| QR Scanner                             | ✅ Ready    | Library `html5-qrcode`                                                        | Medium     |
| Souvenir tracking                      | ✅ Ready    | 3 kolom baru di `guests`                                                      | Low        |

---

## 7. Requirements

### 7.1 NanoID — Kolom di `guests`

```sql
ALTER TABLE guests ADD COLUMN nano_id char(5) UNIQUE;
CREATE UNIQUE INDEX guests_nano_id_idx ON guests(nano_id);
```

```typescript
import { customAlphabet } from "nanoid";
const generateNanoId = customAlphabet(
  "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  5
);
// ketik-friendly: customAlphabet('23456789ACDEFGHJKLMNPQRSTUVWXYZ', 5)
```

Generate otomatis saat insert tamu baru. Batch generate untuk tamu existing.

---

### 7.2 Halaman Undangan Digital

#### Tabel Database: `invitations` (baru)

```sql
CREATE TABLE invitations (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id      uuid REFERENCES weddings(id) ON DELETE CASCADE NOT NULL UNIQUE,
  slug            text UNIQUE NOT NULL,       -- URL: /i/[slug]
  published       boolean DEFAULT false NOT NULL,

  -- Konten
  headline        text DEFAULT 'Undangan Pernikahan',
  opening_text    text,                       -- "Dengan memohon ridho Allah SWT..."
  closing_text    text,                       -- "Merupakan suatu kehormatan..."
  groom_full_name text,                       -- "Muhammad Arif Setiawan, S.T."
  bride_full_name text,                       -- "Siti Rahmawati Putri, S.Pd."
  groom_nickname  text,                       -- "Arif"
  bride_nickname  text,                       -- "Siti"
  groom_parents   text,                       -- "Putra dari Bpk. ... & Ibu ..."
  bride_parents   text,

  -- Media
  hero_photo_url  text,
  gallery_urls    text[] DEFAULT '{}',        -- max 10 foto

  -- Tema
  template        text DEFAULT 'classic',     -- 'classic' | 'modern' | 'rustic'
  theme_color     text DEFAULT '#8B6F4E',
  font_heading    text DEFAULT 'playfair',    -- 'playfair' | 'cormorant' | 'montserrat'

  -- Social
  hashtag         text,                       -- "#ArifDanSiti2026"
  love_story_text text,                       -- Cerita singkat pasangan (opsional)

  -- Settings
  show_rsvp       boolean DEFAULT true,       -- tampilkan section RSVP di halaman undangan
  show_wishes     boolean DEFAULT true,       -- tampilkan feed ucapan di halaman undangan
  rsvp_section_title text DEFAULT 'Konfirmasi Kehadiran',

  updated_at      timestamptz DEFAULT now() NOT NULL
);
```

> **Catatan:** Jadwal acara (tanggal, waktu, venue) diambil dari tabel `sessions` yang sudah ada — tidak duplikasi data.

#### Route & Akses

| Route          | Akses  | Keterangan                                                     |
| -------------- | ------ | -------------------------------------------------------------- |
| `/i/[slug]`    | Publik | Semua orang bisa melihat undangan                              |
| `/i/[slug]`    | Tamu   | Tamu input NanoID → bisa edit RSVP & ucapan mereka sendiri     |
| `/dashboard/invitation` | Owner | Pengantin kelola desain, konten, template, publish/unpublish |

> ⚠️ **Tidak ada `?edit=true` mode khusus owner di halaman publik.** Pengantin mengelola konten undangan sepenuhnya dari dashboard. Halaman `/i/[slug]` murni untuk tamu.

#### Konten Halaman (Semua Read-Only Kecuali Section RSVP + Ucapan)

Halaman lengkap berisi:

1. **Hero** — foto + nama pengantin + tanggal + countdown hari
2. **Pembukaan** — teks pembuka + ayat/hadits (opsional)
3. **Profil Pasangan** — foto + nama lengkap + orang tua
4. **Jadwal Acara** — dari tabel `sessions` (Akad, Resepsi, dll.)
5. **Lokasi** — nama venue + link Google Maps
6. **RSVP Section** — interaktif: tamu input NanoID → edit data mereka sendiri
7. **Feed Ucapan** — realtime feed + form submit/edit ucapan (setelah NanoID di-unlock)
8. **Penutup** — teks penutup + hashtag

> Section 6 & 7 adalah satu-satunya bagian yang **interaktif/editable** — dan hanya bisa diakses dengan NanoID yang valid.

#### Mekanisme Edit via NanoID di Halaman Undangan

```
Tamu buka /i/[slug]
        │
        ▼
Scroll ke "Konfirmasi Kehadiran"
        │
        ▼
Input NanoID (5 char) → lookup ke DB
        │
        ├── Tidak valid → error "Kode tidak ditemukan"
        │
        ▼
NanoID valid → simpan {guestId, guestName} ke sessionStorage
        │
        ▼
RSVP section berubah menjadi mode EDIT:
  - Tampilkan data current (hadir/tidak, pax)
  - Tombol "Ubah Konfirmasi" jika ingin update
  - Form terbuka → submit → update DB
        │
        ▼
Ucapan section juga ter-unlock:
  - Jika belum ada ucapan → form kirim ucapan baru
  - Jika sudah ada → tampilkan ucapan + tombol "Edit Ucapan"
        │
        ▼
Selama tab browser tidak ditutup, NanoID tetap aktif
(sessionStorage cleared saat tab/browser ditutup)
```

**Re-unlock:** Jika tamu menutup browser dan kembali lagi, mereka cukup input NanoID lagi. Tidak ada token persisten / cookie.

#### Dashboard — Kelola Undangan

Rute: `/dashboard/invitation` (baru, protected)

- Pengaturan konten: nama pengantin, teks pembuka/penutup, orang tua, hashtag, love story
- Upload foto hero + galeri (Supabase Storage)
- Pilih template: `classic` | `modern` | `rustic`
- Pilih warna aksen + font heading
- Toggle: tampilkan RSVP section / tampilkan feed ucapan
- Publish / Unpublish (draft = tamu tidak bisa akses `/i/[slug]`)
- Preview link: "Buka Halaman Undangan →"

#### Template Options (v1.0)

| Template  | Deskripsi                          | Palet               |
| --------- | ---------------------------------- | ------------------- |
| `classic` | Elegan, serif, dekorasi floral     | Krem + gold         |
| `modern`  | Minimalis, sans-serif, clean       | Putih + hitam       |
| `rustic`  | Earthy, hangat, dekorasi botanical | Coklat + hijau sage |

---

### 7.3 RSVP Publik Widget

#### Wedding RSVP Config

```sql
ALTER TABLE weddings ADD COLUMN rsvp_enabled boolean DEFAULT false NOT NULL;
ALTER TABLE weddings ADD COLUMN rsvp_slug text UNIQUE;
ALTER TABLE weddings ADD COLUMN rsvp_closes_at timestamptz;
ALTER TABLE weddings ADD COLUMN rsvp_max_pax_per_guest integer DEFAULT 5;
ALTER TABLE weddings ADD COLUMN scanner_pin char(4);
```

#### Flow RSVP

```
Input NanoID (5 char)
      │
      ▼
Lookup → Nama ditemukan
      │
      ├─ Tidak ditemukan → Error "Kode tidak valid"
      │
      ▼
Form: Hadir / Tidak Hadir + Jumlah Orang
      │
      ▼
Halaman konfirmasi → tampilkan detail sesi (read-only)
      │
      ▼
[Opsional] Form ucapan (jika belum pernah kirim)
```

> Tamu **tidak memilih sesi** — ditampilkan sebagai informasi saja setelah konfirmasi.

#### Embed Snippet

```html
<iframe
  src="https://nikahku.app/rsvp/[slug]?embed=true"
  width="100%"
  height="560"
  frameborder="0"
  style="border-radius:12px"
  allow="camera"
></iframe>
```

Params: `?embed=true` (compact mode), `?theme=dark|light`, `?accent=[hex]`

---

### 7.4 Ucapan & Doa (Wishes) — 1x per Tamu

#### Tabel Database: `wishes` (baru)

```sql
CREATE TABLE wishes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id  uuid REFERENCES weddings(id) ON DELETE CASCADE NOT NULL,
  guest_id    uuid REFERENCES guests(id) ON DELETE SET NULL,  -- terikat NanoID
  guest_name  text NOT NULL,
  message     text NOT NULL CHECK (char_length(message) <= 500),
  is_visible  boolean DEFAULT true NOT NULL,
  created_at  timestamptz DEFAULT now() NOT NULL,
  updated_at  timestamptz DEFAULT now() NOT NULL,

  -- 1 ucapan per tamu per wedding
  CONSTRAINT wishes_one_per_guest UNIQUE (wedding_id, guest_id)
);

CREATE INDEX wishes_wedding_id_idx ON wishes(wedding_id);
CREATE INDEX wishes_created_at_idx ON wishes(created_at DESC);
```

#### Aturan 1x per NanoID

- Tamu yang sudah melakukan RSVP (NanoID valid) → form ucapan muncul
- Jika `wishes` row dengan `guest_id` sudah ada → tampilkan ucapan existing dengan tombol **"Edit Ucapan"**
- Jika belum ada → tampilkan form kosong + tombol **"Kirim Ucapan"**
- Tamu **tidak bisa mengirim ucapan kedua** — hanya bisa edit yang sudah ada
- Edit hanya bisa dari browser/session yang sama (tidak ada auth, validasi via `guest_id` dari state setelah NanoID lookup)

#### Flow Ucapan

```
Setelah RSVP berhasil → cek wishes WHERE guest_id = [id]
      │
      ├── Belum ada → form kosong → Submit → INSERT
      │
      └── Sudah ada → tampilkan teks existing + tombol Edit
                            │
                            └── Edit → UPDATE (hanya message + updated_at)
```

#### Feed Real-time

- Subscribe Supabase Realtime: `INSERT` dan `UPDATE` pada `wishes` filter `wedding_id`
- Tampilkan: Nama + Pesan + waktu relatif
- Animasi: slide-down untuk ucapan baru, highlight singkat untuk yang diedit
- Pagination: 20 per load, "Lihat lebih banyak"

#### Display Mode — Venue Screen

- Route: `/rsvp/[slug]/wishes-display`
- Fullscreen, read-only, auto-scroll, cocok diproyeksikan

#### Moderasi (Dashboard)

- Tab "Ucapan" di halaman `/guest`
- Soft-delete: `is_visible = false`
- Pengantin bisa hide/delete individual

---

### 7.5 QR Code Souvenir

#### Kolom Baru di `guests`

```sql
ALTER TABLE guests ADD COLUMN souvenir_taken boolean DEFAULT false NOT NULL;
ALTER TABLE guests ADD COLUMN souvenir_taken_at timestamptz;
ALTER TABLE guests ADD COLUMN souvenir_taken_by text;
```

#### QR Content

QR berisi NanoID saja (5 karakter — compact, cepat di-scan):

```
A3K9Z
```

#### Generate QR (Dashboard)

- Per-row: tombol "QR" → modal preview + download PNG
- Bulk: "Download Semua QR" → ZIP (`[NanoID]_[NamaTamu].png`)
- **QR Card template:**
  ```
  ┌──────────────────────┐
  │  Ahmad ❤️ Siti       │
  │  15 Juni 2026        │
  │                      │
  │  [████ QR ████]      │
  │                      │
  │  Budi Santoso        │
  │  Kode: A3K9Z         │
  │  2 Orang             │
  └──────────────────────┘
  ```

#### Scanner App

- Route: `/rsvp/[slug]/scanner` (public + optional 4-digit PIN)
- Scan → resolve NanoID → tampilkan: nama, pax, sesi, status souvenir
- Tombol **"Tandai Sudah Ambil"** → update DB → feedback visual
- Jika scan ulang: warning "Sudah diambil [jam] oleh [petugas]" + tombol disabled

---

## 8. Technical Architecture

### 8.1 Routing Structure

```
src/app/
├── (dashboard)/
│   └── guest/
│       └── page.tsx              # Existing + tab Ucapan, NanoID col, QR actions, laporan souvenir
│
├── i/
│   └── [slug]/
│       └── page.tsx              # Halaman undangan publik + inline edit mode (owner)
│
└── rsvp/
    └── [slug]/
        ├── page.tsx              # Public RSVP form (NanoID → konfirmasi → ucapan)
        ├── wishes-display/
        │   └── page.tsx          # Venue screen (fullscreen, realtime, read-only)
        └── scanner/
            └── page.tsx          # QR Scanner petugas
```

### 8.2 Full DB Schema Changes

```sql
-- ═══════════════════════════════════════
-- 1. guests.nano_id
-- ═══════════════════════════════════════
ALTER TABLE guests ADD COLUMN nano_id char(5);
CREATE UNIQUE INDEX guests_nano_id_idx ON guests(nano_id);

-- ═══════════════════════════════════════
-- 2. guests souvenir
-- ═══════════════════════════════════════
ALTER TABLE guests ADD COLUMN souvenir_taken boolean DEFAULT false NOT NULL;
ALTER TABLE guests ADD COLUMN souvenir_taken_at timestamptz;
ALTER TABLE guests ADD COLUMN souvenir_taken_by text;

-- ═══════════════════════════════════════
-- 3. weddings RSVP config
-- ═══════════════════════════════════════
ALTER TABLE weddings ADD COLUMN rsvp_enabled boolean DEFAULT false NOT NULL;
ALTER TABLE weddings ADD COLUMN rsvp_slug text UNIQUE;
ALTER TABLE weddings ADD COLUMN rsvp_closes_at timestamptz;
ALTER TABLE weddings ADD COLUMN rsvp_max_pax_per_guest integer DEFAULT 5;
ALTER TABLE weddings ADD COLUMN scanner_pin char(4);

-- ═══════════════════════════════════════
-- 4. invitations (NEW)
-- ═══════════════════════════════════════
CREATE TABLE invitations (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id      uuid REFERENCES weddings(id) ON DELETE CASCADE NOT NULL UNIQUE,
  slug            text UNIQUE NOT NULL,
  published       boolean DEFAULT false NOT NULL,
  headline        text DEFAULT 'Undangan Pernikahan',
  opening_text    text,
  closing_text    text,
  groom_full_name text,
  bride_full_name text,
  groom_nickname  text,
  bride_nickname  text,
  groom_parents   text,
  bride_parents   text,
  hero_photo_url  text,
  gallery_urls    text[] DEFAULT '{}',
  template        text DEFAULT 'classic',
  theme_color     text DEFAULT '#8B6F4E',
  font_heading    text DEFAULT 'playfair',
  hashtag         text,
  love_story_text text,
  show_rsvp       boolean DEFAULT true NOT NULL,
  show_wishes     boolean DEFAULT true NOT NULL,
  rsvp_section_title text DEFAULT 'Konfirmasi Kehadiran',
  updated_at      timestamptz DEFAULT now() NOT NULL
);

-- ═══════════════════════════════════════
-- 5. wishes (NEW)
-- ═══════════════════════════════════════
CREATE TABLE wishes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id  uuid REFERENCES weddings(id) ON DELETE CASCADE NOT NULL,
  guest_id    uuid REFERENCES guests(id) ON DELETE SET NULL,
  guest_name  text NOT NULL,
  message     text NOT NULL CHECK (char_length(message) <= 500),
  is_visible  boolean DEFAULT true NOT NULL,
  created_at  timestamptz DEFAULT now() NOT NULL,
  updated_at  timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT wishes_one_per_guest UNIQUE (wedding_id, guest_id)
);
CREATE INDEX wishes_wedding_id_idx ON wishes(wedding_id);
CREATE INDEX wishes_created_at_idx ON wishes(created_at DESC);

-- ═══════════════════════════════════════
-- 6. RLS Policies
-- ═══════════════════════════════════════

-- invitations: public read jika published; owner full access
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "invitations_public_read" ON invitations
  FOR SELECT USING (published = true);
CREATE POLICY "invitations_owner_all" ON invitations
  FOR ALL USING (
    wedding_id IN (SELECT id FROM weddings WHERE user_id = auth.uid())
  );

-- guests: public read (nama, pax, sesi) untuk RSVP + scanner
CREATE POLICY "guests_public_rsvp_read" ON guests
  FOR SELECT USING (
    wedding_id IN (SELECT id FROM weddings WHERE rsvp_enabled = true)
  );

-- wishes: public read (visible only), insert; owner full
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wishes_public_read" ON wishes
  FOR SELECT USING (is_visible = true);
CREATE POLICY "wishes_public_insert" ON wishes
  FOR INSERT WITH CHECK (true);
CREATE POLICY "wishes_public_update_own" ON wishes
  FOR UPDATE USING (true) WITH CHECK (true); -- validasi guest_id di application layer
CREATE POLICY "wishes_owner_manage" ON wishes
  FOR ALL USING (
    wedding_id IN (SELECT id FROM weddings WHERE user_id = auth.uid())
  );
```

### 8.3 Server Actions

```typescript
// src/app/actions/invitation.ts (NEW)
getInvitation(slug: string): Promise<InvitationWithSessions | null>
updateInvitation(weddingId: string, data: Partial<Invitation>): Promise<void>
publishInvitation(weddingId: string, publish: boolean): Promise<void>
uploadInvitationPhoto(weddingId: string, file: File, type: 'hero' | 'gallery'): Promise<string>

// src/app/actions/rsvp.ts (NEW)
lookupGuestByNanoId(slug: string, nanoId: string): Promise<GuestPublic | null>
updateGuestRsvpPublic(slug: string, nanoId: string, data: RsvpUpdate): Promise<void>
getExistingWish(guestId: string, weddingId: string): Promise<Wish | null>
submitWish(weddingId: string, guestId: string, guestName: string, message: string): Promise<void>
updateWish(wishId: string, guestId: string, message: string): Promise<void>  // validasi guestId
getGuestForScanner(slug: string, nanoId: string): Promise<GuestScanResult | null>
markSouvenirTaken(slug: string, nanoId: string, takenBy: string): Promise<SouvenirResult>
```

### 8.4 Arsitektur Komponen Halaman Undangan

```
/i/[slug] — InvitationPage (Server Component, publik)
  │
  ├── InvitationHero          (read-only)
  ├── InvitationOpening       (read-only)
  ├── InvitationCouple        (read-only)
  ├── InvitationSchedule      (read-only, data dari sessions table)
  ├── InvitationLocation      (read-only)
  │
  ├── InvitationRsvpSection   (Client Component — interaktif)
  │     ├── [state: locked]  → NanoID input form
  │     └── [state: unlocked] → RsvpEditForm
  │           ├── Tampilkan data existing (hadir/tidak, pax)
  │           └── Tombol "Ubah" → form update → submit
  │
  └── InvitationWishesSection (Client Component — interaktif)
        ├── WishesFeed (realtime, selalu tampil)
        ├── [state: locked]   → pesan "Masukkan kode undangan di atas untuk kirim ucapan"
        └── [state: unlocked] → WishForm
              ├── Belum ada wish → form baru
              └── Sudah ada wish → tampilkan teks + tombol "Edit"

State "locked/unlocked" dikelola di React state (tidak disimpan ke DB).
sessionStorage menyimpan {guestId, guestName} agar tidak perlu input ulang
saat scroll naik-turun di halaman yang sama.
```

**Dashboard `/dashboard/invitation` (protected):**
```
InvitationSettingsPage
  ├── Form konten (nama, teks, hashtag, dll.)
  ├── Upload foto (hero + galeri)
  ├── Template picker
  ├── Toggle RSVP section / Wishes section
  └── Publish / Unpublish + preview link
```

### 8.5 Realtime (Supabase)

```typescript
// WishesFeed — subscribe INSERT + UPDATE
supabase
  .channel(`wishes:${weddingId}`)
  .on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "wishes",
      filter: `wedding_id=eq.${weddingId}`,
    },
    (payload) => setWishes((prev) => [payload.new, ...prev])
  )
  .on(
    "postgres_changes",
    {
      event: "UPDATE",
      schema: "public",
      table: "wishes",
      filter: `wedding_id=eq.${weddingId}`,
    },
    (payload) =>
      setWishes((prev) =>
        prev.map((w) => (w.id === payload.new.id ? payload.new : w))
      )
  )
  .subscribe();
```

### 8.6 Next.js Config

```typescript
// next.config.ts
async headers() {
  return [
    {
      source: '/rsvp/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'ALLOWALL' },
        { key: 'Content-Security-Policy', value: "frame-ancestors *" },
        { key: 'Permissions-Policy', value: 'camera=*' }
      ]
    },
    {
      source: '/i/:path*',
      headers: [
        // Undangan tidak boleh di-iframe oleh pihak lain (anti-clickjacking)
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' }
      ]
    }
  ]
}
```

### 8.7 New Dependencies

```json
{
  "nanoid": "^5.0.7",
  "qrcode": "^1.5.3",
  "@types/qrcode": "^1.5.5",
  "html5-qrcode": "^2.3.8",
  "jszip": "^3.10.1",
  "file-saver": "^2.0.5"
}
```

> Cek dulu: `nanoid` mungkin sudah terinstall sebagai transitive dependency.

---

## 9. UI/UX Specifications

### 9.1 Halaman Undangan (`/i/[slug]`)

```
┌─────────────────────────────────────────┐
│  [FOTO HERO — full width]               │
│                                         │
│        Ahmad & Siti                     │
│     Sabtu, 15 Juni 2026                 │
│         Bandung                         │
│                                         │
│  [Countdown: 87 hari lagi]              │
├─────────────────────────────────────────┤
│  "Dengan memohon ridho Allah SWT..."    │
├─────────────────────────────────────────┤
│  [Foto Groom]     [Foto Bride]          │
│  Ahmad Setiawan   Siti Rahmawati        │
│  Putra dari...    Putri dari...         │
├─────────────────────────────────────────┤
│  JADWAL ACARA                           │
│  🕐 Akad — 08:00 WIB — Masjid Al-Nur   │
│  🍽️ Resepsi — 11:00 WIB — Gedung X     │
│  [Lihat di Maps]                        │
├─────────────────────────────────────────┤
│  KONFIRMASI KEHADIRAN                   │
│  [Form NanoID — embedded RsvpForm]      │
├─────────────────────────────────────────┤
│  UCAPAN & DOA                           │
│  [WishesFeed realtime]                  │
├─────────────────────────────────────────┤
│  #ArifDanSiti2026                       │
│  "Merupakan suatu kehormatan..."        │
└─────────────────────────────────────────┘
```

### 9.2 Edit Mode Overlay (`?edit=true`)

```
┌─ EDIT TOOLBAR (sticky) ─────────────────┐
│ [👁 Preview] [🎨 Template] [🌐 Publish] │
│ Status: Draft · Auto-saved 3s ago       │
└─────────────────────────────────────────┘

Di setiap section saat hover:
┌───────────────────────────────── [✏️] ──┐  ← tombol edit muncul
│  Ahmad & Siti                           │
│  Sabtu, 15 Juni 2026                    │
└─────────────────────────────────────────┘

Side panel saat ✏️ diklik:
┌──────────────────────┐
│  Edit Hero           │
│                      │
│  Nama Pengantin Pria │
│  [Ahmad Setiawan   ] │
│                      │
│  Nama Pengantin Wnt. │
│  [Siti Rahmawati   ] │
│                      │
│  Tanggal             │
│  [15 Juni 2026     ] │
│                      │
│  Upload Foto Hero    │
│  [📷 Pilih Foto    ] │
│                      │
│  [Simpan]  [Batal]   │
└──────────────────────┘
```

### 9.3 RSVP Form (dalam undangan)

Step 1 — Input NanoID:

```
┌─────────────────────────────────┐
│  KONFIRMASI KEHADIRAN           │
│                                 │
│  Kode undangan Anda:            │
│  [ A ][ 3 ][ K ][ 9 ][ Z ]     │  ← 5 kotak auto-advance
│                                 │
│  [ CARI DATA SAYA ]             │
└─────────────────────────────────┘
```

Step 2 — Konfirmasi + Ucapan:

```
┌─────────────────────────────────┐
│  Halo, Budi Santoso!            │
│                                 │
│  ● Hadir  ○ Tidak Hadir         │
│  Jumlah orang: [2] ▲▼           │
│                                 │
│  [ KONFIRMASI ]                 │
├─────────────────────────────────┤
│  Tinggalkan Ucapan (opsional)   │
│  [Budi Santoso          ]       │
│  [Semoga bahagia...     ]       │
│  [500 karakter tersisa  ]       │
│  [ KIRIM UCAPAN ]               │
│                                 │
│  ── atau ──                     │
│  [✏️ Edit ucapan saya]  ← jika sudah ada
└─────────────────────────────────┘
```

### 9.4 Venue Screen (`/rsvp/[slug]/wishes-display`)

```
┌────────────────────────────────────────────┐
│           Ahmad ❤️ Siti                    │
│                                            │
│  ┌────────────────────────────────────┐    │
│  │  🌸  Budi Santoso                  │    │
│  │  "Semoga menjadi keluarga yang     │    │
│  │   sakinah, mawaddah, warahmah."    │    │
│  │                       2 menit lalu │    │
│  └────────────────────────────────────┘    │
│                                            │
│  [ucapan berikutnya...]                    │
└────────────────────────────────────────────┘
```

### 9.5 Scanner UI

```
┌─────────────────────────────────┐
│  SCAN SOUVENIR          [⚙️]   │
│  Ahmad & Siti                   │
├─────────────────────────────────┤
│  [  AREA KAMERA  ]              │
├─────────────────────────────────┤
│  ✅ Budi Santoso                │
│     👥 2 orang · 🎫 Resepsi     │
│     📦 BELUM DIAMBIL            │
│                                 │
│  [ ✅ TANDAI SUDAH AMBIL ]      │  ← hijau, tap sekali
├─ jika scan ulang: ──────────────┤
│  ⚠️  Sudah diambil 10:32 WIB   │
│     oleh: Dewi                  │
│  [Tandai Sudah Ambil] DISABLED  │
└─────────────────────────────────┘
```

---

## 10. Acceptance Criteria

### Halaman Undangan

- **Given** undangan di-publish
- **When** tamu buka `/i/nikah-ahmad-siti`
- **Then** halaman tampil dengan nama, tanggal, jadwal acara, form RSVP, dan feed ucapan

- **Given** owner login dan buka `/i/[slug]?edit=true`
- **When** hover di section Hero dan klik ✏️
- **Then** side panel edit muncul; perubahan auto-save dan reflect langsung di halaman

### Wishes 1x

- **Given** Budi (NanoID: A3K9Z) sudah submit ucapan sebelumnya
- **When** Budi selesai RSVP dan form ucapan tampil
- **Then** ucapan existing tampil dalam mode edit (bukan form kosong); tidak ada tombol "Kirim Baru"

- **Given** Budi edit ucapannya
- **When** klik "Simpan"
- **Then** DB ter-update (`message` + `updated_at`); feed realtime menampilkan versi terbaru

### QR Scanner

- **Given** `souvenir_taken = false`
- **When** scan QR tamu → tap "Tandai Sudah Ambil"
- **Then** DB: `souvenir_taken=true`, `souvenir_taken_at=now()`, `souvenir_taken_by=[petugas]`

- **When** QR yang sama di-scan lagi
- **Then** warning + tombol disabled; tidak ada update DB kedua

---

## 11. Security Considerations

| Risk                   | Mitigation                                                                                                 |
| ---------------------- | ---------------------------------------------------------------------------------------------------------- |
| Enumeration NanoID     | Rate limit 10 gagal/IP/10 menit                                                                            |
| Spam ucapan            | Tidak mungkin — 1 ucapan per `guest_id` (DB UNIQUE constraint)                                             |
| Edit ucapan orang lain | Validasi `guest_id` match di server action sebelum UPDATE                                                  |
| Akses edit undangan    | Server component cek `session.user.id === wedding.user_id`; `?edit=true` redirect ke login jika belum auth |
| Akses scanner          | Optional 4-digit PIN di wedding settings                                                                   |
| Data exposure via RSVP | RLS: public hanya read `nama`, `pax_count`, `nano_id` — bukan `email`/`phone`                              |
| Souvenir scan ulang    | DB: hanya update jika `souvenir_taken = false`; warning jika `true`                                        |

---

## 12. Out of Scope (v1.0)

- WhatsApp blast / broadcast undangan
- Multiple template custom (hanya 3 template bawaan)
- Drag-and-drop page builder
- Seating arrangement
- Check-in pintu masuk (terpisah dari souvenir)
- Walk-in RSVP (tanpa NanoID — pengantin harus input manual dulu)
- Offline scanner (scanner butuh koneksi untuk validasi DB)
- Amplop digital / transfer uang

---

## 13. Implementation Phases

### Phase 1 — NanoID + RSVP Publik (3-4 hari)

1. Migrasi: `guests.nano_id`, `weddings` RSVP config
2. Update `useCreateGuest`: auto-generate NanoID saat insert
3. Batch generate NanoID untuk tamu existing
4. RLS policies RSVP
5. Server Actions: `lookupGuestByNanoId`, `updateGuestRsvpPublic`
6. Halaman `/rsvp/[slug]` — 3-step flow
7. `next.config.ts` headers untuk iframe embed
8. Dashboard: RSVP Settings (aktifkan, copy link, iframe snippet)
9. Tampilkan NanoID + QR icon di tabel tamu dashboard

### Phase 2 — Ucapan Real-time 1x (2-3 hari)

1. Migrasi: tabel `wishes` + UNIQUE constraint + RLS
2. Server Actions: `getExistingWish`, `submitWish`, `updateWish`
3. Komponen `<WishesFeed>` + Supabase Realtime (INSERT + UPDATE)
4. Integrasi ke halaman RSVP (post-konfirmasi)
5. Halaman `/rsvp/[slug]/wishes-display` (venue screen)
6. Dashboard: tab "Ucapan" + moderasi

### Phase 3 — Halaman Undangan Digital (3-5 hari)

1. Migrasi: tabel `invitations` + RLS
2. Server Actions: `getInvitation`, `updateInvitation`, `publishInvitation`, `uploadInvitationPhoto`
3. Halaman `/i/[slug]` — view mode (3 template)
4. `isOwner` detection di server component
5. `EditToolbar` + `EditSectionPanel` (per section)
6. Auto-save debounce
7. Dashboard: link "Buka & Edit Undangan" → `/i/[slug]?edit=true`
8. Supabase Storage setup untuk foto undangan

### Phase 4 — QR Souvenir + Scanner (3-4 hari)

1. Migrasi: kolom souvenir di `guests`
2. QR generator + QR Card PNG template
3. Download individual + bulk ZIP
4. Halaman `/rsvp/[slug]/scanner` dengan `html5-qrcode`
5. Server Actions: `getGuestForScanner`, `markSouvenirTaken`
6. Dashboard: laporan souvenir, filter, export CSV

### Total Estimasi: 11-16 hari kerja
