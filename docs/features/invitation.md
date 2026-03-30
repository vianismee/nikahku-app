# Feature: Digital Invitation (Undangan Digital)

## Overview

Fitur Undangan Digital memungkinkan pasangan untuk memilih, membeli, dan mengkustomisasi template undangan pernikahan digital yang dapat dibagikan kepada tamu via link. Setiap template dikategorikan berdasarkan tier harga, dan sebagian template mendukung kustomisasi visual oleh pengguna.

---

## Core Concepts

### 1. Template

Template adalah desain undangan digital yang sudah jadi. Setiap template memiliki:

| Field | Tipe | Keterangan |
|---|---|---|
| `id` | `uuid` | Primary key |
| `name` | `string` | Nama template |
| `slug` | `string` | URL-friendly identifier |
| `category_id` | `uuid` | Relasi ke `invitation_categories` |
| `preview_image_url` | `string` | Thumbnail untuk halaman browse |
| `demo_url` | `string` | Link preview template tanpa data asli |
| `is_customizable` | `boolean` | Apakah template mendukung kustomisasi |
| `customization_options` | `jsonb` | Daftar opsi kustomisasi yang tersedia |
| `is_active` | `boolean` | Status aktif template |

### 2. Kategori & Harga

Harga undangan ditentukan berdasarkan **kategori template**, bukan per-template. Satu kategori bisa berisi banyak template.

```
invitation_categories
├── Free               → Rp 0         (kustomisasi terbatas / tidak ada)
├── Basic              → Rp 49.000    (kustomisasi terbatas)
├── Premium            → Rp 99.000    (kustomisasi penuh)
└── Exclusive          → Rp 199.000   (kustomisasi penuh + animasi eksklusif)
```

> Harga kategori bersifat **one-time payment per pernikahan**, bukan subscription.

### 3. Undangan Pengguna (User Invitation)

Setelah user membeli/mengaktifkan template, sistem membuat record `user_invitations` yang menyimpan:
- Template yang dipilih
- Data pernikahan (dari tabel `weddings`)
- Kustomisasi yang diterapkan (jika ada)
- Unique share URL

---

## Database Schema

```sql
-- Kategori undangan beserta harga
CREATE TABLE invitation_categories (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,           -- e.g. "Premium"
  description   text,
  price         integer NOT NULL,        -- harga dalam IDR (0 = gratis)
  sort_order    integer DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

-- Template undangan
CREATE TABLE invitation_templates (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id           uuid REFERENCES invitation_categories(id),
  name                  text NOT NULL,
  slug                  text UNIQUE NOT NULL,
  preview_image_url     text,
  demo_url              text,
  is_customizable       boolean DEFAULT false,
  customization_options jsonb DEFAULT '[]',   -- lihat struktur di bawah
  tags                  text[],               -- e.g. ["floral", "modern", "jawa"]
  is_active             boolean DEFAULT true,
  created_at            timestamptz DEFAULT now()
);

-- Undangan milik user
CREATE TABLE user_invitations (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id      uuid REFERENCES weddings(id) ON DELETE CASCADE,
  template_id     uuid REFERENCES invitation_templates(id),
  share_slug      text UNIQUE NOT NULL,       -- untuk URL publik: /i/{share_slug}
  customizations  jsonb DEFAULT '{}',         -- nilai kustomisasi yang disimpan
  is_published    boolean DEFAULT false,
  view_count      integer DEFAULT 0,
  purchased_at    timestamptz,
  payment_id      text,                       -- referensi ke payment gateway
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);
```

### Struktur `customization_options` (per template)

```json
[
  {
    "key": "accent_color",
    "label": "Warna Aksen",
    "type": "color",
    "default": "#8B6F4E"
  },
  {
    "key": "font_heading",
    "label": "Font Judul",
    "type": "font_picker",
    "options": ["Playfair Display", "Cormorant Garamond", "Great Vibes"],
    "default": "Playfair Display"
  },
  {
    "key": "hero_image",
    "label": "Foto Utama",
    "type": "image_upload",
    "max_size_mb": 5,
    "aspect_ratio": "16:9"
  },
  {
    "key": "background_pattern",
    "label": "Motif Latar",
    "type": "select",
    "options": ["floral", "batik", "minimalist", "none"],
    "default": "floral"
  }
]
```

### Tipe kustomisasi yang didukung

| Tipe | Deskripsi |
|---|---|
| `color` | Color picker untuk warna aksen, teks, dsb |
| `font_picker` | Pilihan font dari daftar yang tersedia |
| `image_upload` | Upload gambar (foto pasangan, dll) |
| `select` | Pilihan dari opsi yang sudah ditentukan |
| `text` | Input teks bebas (e.g. quote, pesan) |
| `toggle` | On/off untuk elemen tertentu (e.g. animasi, musik) |

---

## User Flow

```
Browse Templates
      │
      ▼
Pilih Template → Lihat Preview / Demo
      │
      ▼
      ├── [Free] ──────────────────────────────→ Aktifkan langsung
      │
      └── [Berbayar] → Halaman Pembayaran (Midtrans/Xendit)
                              │
                              ▼
                       Pembayaran Berhasil
                              │
                              ▼
                   Template diaktifkan untuk wedding user
                              │
                              ▼
                    Editor Kustomisasi (jika is_customizable = true)
                              │
                              ├── Upload foto
                              ├── Pilih font
                              ├── Atur warna aksen
                              └── Atur konten tambahan
                              │
                              ▼
                    Publish & Dapatkan Share Link
                    /i/{share_slug}
```

---

## Routing

```
src/app/
├── (dashboard)/
│   └── invitation/
│       ├── page.tsx              # Browse & pilih template (dengan kategori filter)
│       ├── [templateSlug]/
│       │   └── page.tsx          # Detail template + tombol beli/aktifkan
│       ├── editor/
│       │   └── page.tsx          # Halaman kustomisasi undangan aktif
│       └── preview/
│           └── page.tsx          # Preview undangan sebelum publish
│
└── i/
    └── [shareSlug]/
        └── page.tsx              # Halaman undangan publik (no auth required)
```

---

## Komponen UI

```
src/components/invitation/
├── TemplateGrid.tsx          # Grid browse semua template
├── TemplateCard.tsx          # Card per template (preview, nama, badge kategori, harga)
├── CategoryFilter.tsx        # Filter by kategori/harga
├── TemplatePreviewModal.tsx  # Modal preview / demo template
├── InvitationEditor.tsx      # Editor kustomisasi (hanya untuk template customizable)
├── CustomizationPanel.tsx    # Panel samping editor berisi semua opsi kustomisasi
├── InvitationPreview.tsx     # Live preview undangan saat kustomisasi
└── ShareModal.tsx            # Modal setelah publish: share link, QR code
```

---

## Kustomisasi: Aturan Pembatasan

Tidak semua template mendukung semua jenis kustomisasi. Aturannya:

| Kategori | Kustomisasi yang tersedia |
|---|---|
| **Free** | Tidak ada kustomisasi |
| **Basic** | Upload foto, ubah warna aksen |
| **Premium** | Semua tipe kustomisasi |
| **Exclusive** | Semua tipe kustomisasi + opsi eksklusif (animasi, musik background) |

Field `is_customizable` pada template menentukan apakah editor kustomisasi ditampilkan. Field `customization_options` menentukan **opsi apa saja** yang muncul di editor — ini dikontrol per-template, bukan hanya per-kategori.

> **Catatan:** Dua template dalam kategori yang sama bisa memiliki opsi kustomisasi yang berbeda. Misalnya, template "Jawa Klasik" (Premium) mungkin hanya menawarkan pilihan motif batik, sementara "Modern Minimalist" (Premium) menawarkan pilihan font dan warna penuh.

---

## Halaman Publik Undangan (`/i/[shareSlug]`)

- Tidak memerlukan autentikasi
- Menampilkan template yang dirender dengan data pernikahan dari `weddings` dan kustomisasi dari `user_invitations.customizations`
- Menampilkan info: nama pasangan, tanggal, lokasi, RSVP (integrasi dengan fitur RSVP yang sudah ada)
- Mencatat `view_count` setiap kali diakses
- Dioptimalkan untuk mobile dan shareable via WhatsApp

---

## Integrasi dengan Fitur Lain

| Fitur | Integrasi |
|---|---|
| **RSVP** | Tombol RSVP di halaman undangan publik mengarah ke form RSVP yang sudah ada |
| **Wedding Data** | Data nama, tanggal, venue diambil otomatis dari tabel `weddings` |
| **WhatsApp Template** | Share link undangan dapat dimasukkan ke template pesan WhatsApp |
| **Souvenir Scanner** | Opsional: QR code di undangan bisa sekaligus sebagai tiket souvenir |

---

## State Management

Mengikuti pola yang sudah ada di project:

- **React Query** — fetch daftar template, kategori, dan `user_invitations`
- **Zustand** (`useInvitationStore`) — state editor kustomisasi (perubahan live sebelum disimpan)
- **Server Actions** — publish undangan, simpan kustomisasi

```ts
// src/lib/stores/invitation-store.ts
interface InvitationStore {
  activeCustomizations: Record<string, unknown>
  isDirty: boolean
  setCustomization: (key: string, value: unknown) => void
  resetCustomizations: () => void
}
```

---

## Open Items / TBD

- [ ] Payment gateway yang digunakan (Midtrans / Xendit / manual transfer)
- [ ] Apakah satu wedding bisa memiliki lebih dari satu undangan aktif?
- [ ] Batas ukuran upload foto (saat ini diusulkan maks 5 MB per gambar)
- [ ] CDN / storage untuk aset template dan foto upload (Supabase Storage?)
- [ ] Apakah undangan bisa diubah templatenya setelah dibeli?
- [ ] Expired date untuk undangan publik (setelah tanggal pernikahan?)
- [ ] Apakah ada fitur analytics per undangan (view count, RSVP rate)?
