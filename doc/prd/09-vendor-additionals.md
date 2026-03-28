# Feature PRD: Vendor Additional Costs

> **Epic:** NIKAHKU — Wedding Planner Platform
> **Feature:** Vendor Additional Costs (Biaya Tambahan di Luar Paket)
> **Version:** 1.1
> **Created:** 28 Maret 2026
> **Last Updated:** 28 Maret 2026
> **Status:** Draft — Ready for Development

---

## 1. Feature Name

**Vendor Additional Costs** — Fitur pencatatan katalog add-on vendor dan kalkulator estimasi biaya awal (gambaran dari customer), terpisah dari `price_deal` yang tetap diinput manual sesuai kesepakatan.

---

## 2. Problem Statement

### Konteks Nyata

Berdasarkan contoh price list **Shofi Wedding** (MUA + Dekorasi + Foto), struktur harga vendor pernikahan terdiri dari:

**Paket Utama (Base Packages):**
| Paket | Harga Normal | Harga Promo |
|---|---|---|
| Paket Lengkap | Rp 16.500.000 | Rp 14.000.000 |
| Paket Unduh Mantu | Rp 14.000.000 | Rp 12.500.000 |
| Paket Dasar A (Akad) | — | Rp 7.000.000 |
| Paket Dasar C (Akad + Resepsi) | — | Rp 8.500.000 |

**Add-on di Luar Paket (halaman "Tambahan Lain"):**
| Add-on | Harga | Satuan |
|---|---|---|
| Foto Unlimited Full Day (album + 120 foto) | Rp 1.900.000 | item |
| Foto Unlimited Half Day (album + 80 foto) | Rp 1.500.000 | item |
| Video Paket A | Rp 1.500.000 | item |
| Video Paket B | Rp 2.000.000 | item |
| Hena | Rp 350.000 | item |
| Hairdo Modern | Rp 750.000 | item |
| Hairdo Jawa + Paes | Rp 750.000 | item |
| Hijabdo Jawa + Paes | Rp 850.000 | item |
| Melati Non-Adat | Rp 300.000 | item |
| Melati Adat Sunda/Jawa | Rp 400.000 | item |
| Cucuk Lampah | Rp 550.000 | item |
| MC Gedung | Rp 650.000 | item |
| Rias Tamu | Rp 200.000 | orang |
| Baju Tamu Wanita | Rp 150.000 | orang |
| Baju Tamu Pria (Jas) | Rp 150.000 | orang |
| Dekorasi 4m Premium | Rp 3.000.000 | item |
| Dekorasi 6m Premium | Rp 4.000.000 | item |
| Meja Set Akad | Rp 850.000 | item |
| Tambahan Baju Pengantin Wanita | Rp 1.000.000 | set |
| Tambahan Baju Pengantin Pria | Rp 500.000 | set |

### Pain Point

Saat ini customer harus:
1. Buka price list fisik / foto brosur secara terpisah
2. Hitung manual: Paket X + add-on A + add-on B × qty = total estimasi
3. Bandingkan estimasi antar vendor secara manual
4. Baru negosiasi dengan vendor → menghasilkan `price_deal` final

Tidak ada tools terintegrasi untuk **estimasi awal** sebelum angka deal disepakati.

### Clarification Penting — Scope Fitur

> **`price_deal` TETAP diinput manual** sesuai kesepakatan antara customer dan vendor. Fitur ini BUKAN invoice generator atau automation booking.
>
> Fitur ini adalah **kalkulator estimasi awal dari perspektif customer** — customer bisa simulate: *"Kalau aku ambil Paket C + Hairdo + Video B + Rias 5 tamu, kira-kira berapa totalnya?"* sebelum negosiasi dilakukan.

**Alur yang diinginkan:**
```
Lihat katalog add-on vendor
  ↓
Pilih paket + centang add-on yang diinginkan + isi kuantitas
  ↓
Lihat total estimasi real-time
  ↓
Gunakan sebagai referensi saat negosiasi dengan vendor
  ↓
Input price_deal MANUAL sesuai hasil kesepakatan
```

---

## 3. User Personas

- **Primary:** Calon Pengantin — ingin memperkirakan total biaya vendor sebelum negosiasi
- **Secondary:** Wedding Organizer — membantu klien memahami potensi biaya di luar paket

---

## 4. User Stories

**US-VA1:** Sebagai calon pengantin, saya ingin menambahkan daftar add-on untuk setiap vendor dari price list mereka, agar semua opsi biaya tercatat terstruktur di satu tempat.

**US-VA2:** Sebagai calon pengantin, saya ingin melihat daftar add-on beserta harga satuan, satuan pengukuran, dan deskripsi singkat, agar mudah dipahami tanpa membuka brosur terpisah.

**US-VA3:** Sebagai calon pengantin, saya ingin mensimulasikan total estimasi biaya dengan memilih paket + add-on tertentu beserta kuantitasnya, agar punya gambaran biaya sebelum negosiasi.

**US-VA4:** Sebagai calon pengantin, saya ingin melihat breakdown estimasi: Paket + Add-on terpilih + Total, agar kalkulasi transparan dan bisa dijadikan referensi diskusi.

**US-VA5:** Sebagai calon pengantin, saya ingin menyimpan kombinasi add-on yang saya estimasi sebagai "wishlist/catatan estimasi" agar tidak perlu input ulang setiap kali buka halaman vendor.

---

## 5. Data Model

### 5.1 Tabel Baru: `vendor_additionals`

Menyimpan **katalog add-on** yang tersedia untuk setiap vendor.

```sql
CREATE TABLE vendor_additionals (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id   uuid NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  name        text NOT NULL,         -- "Hairdo Modern"
  description text,                  -- "Hairdo modern untuk pengantin wanita"
  price       integer NOT NULL DEFAULT 0,   -- harga per unit (IDR); 0 = free/gratis
  unit        text NOT NULL DEFAULT 'item', -- "item", "orang", "set", "jam", "meja", "sesi"
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_vendor_additionals_vendor_id ON vendor_additionals(vendor_id);
```

**Contoh rows berdasarkan Shofi Wedding:**

| name | price | unit | description |
|---|---|---|---|
| Foto Unlimited Full Day | 1.900.000 | item | Album magnetic, cetak 120 foto + all file |
| Foto Unlimited Half Day | 1.500.000 | item | Album magnetic, cetak 80 foto + all file |
| Video Paket A | 1.500.000 | item | — |
| Video Paket B | 2.000.000 | item | — |
| Hairdo Modern | 750.000 | item | — |
| Hairdo Jawa + Paes | 750.000 | item | — |
| Hijabdo Jawa + Paes | 850.000 | item | — |
| Hena | 350.000 | item | — |
| Melati Non-Adat | 300.000 | item | — |
| Melati Adat Sunda/Jawa | 400.000 | item | — |
| MC Gedung | 650.000 | item | — |
| Rias Tamu | 200.000 | orang | Tambahan hairdo +Rp 175.000/orang |
| Baju Tamu Wanita | 150.000 | orang | Inc: baju, manset, jarik, kerudung, aksesoris |
| Dekorasi 4m Premium | 3.000.000 | item | Kursi, background, bunga, lighting, panggung |
| Dekorasi 6m Premium | 4.000.000 | item | — |
| Meja Set Akad | 850.000 | item | — |
| Tambahan Baju Pengantin Wanita | 1.000.000 | set | — |

> **Catatan:** `is_optional` dihapus dari skema — semua add-on bersifat opsional (customer yang pilih sendiri mana yang akan diambil). Info item yang "gratis di paket tertentu" cukup dicatat di `description`.

---

### 5.2 Kolom Estimasi di Tabel `vendors`

Untuk menyimpan estimasi terakhir yang dipilih customer (agar tidak hilang saat halaman di-refresh).

```sql
ALTER TABLE vendors
ADD COLUMN estimated_additionals jsonb DEFAULT NULL;
-- Menyimpan add-on yang dipilih di kalkulator estimasi (bukan deal final)
-- price_deal tetap diisi manual, TIDAK otomatis dari kalkulasi ini
```

**Struktur JSON `estimated_additionals`:**

```json
{
  "package_id": "uuid-paket-c",
  "package_name": "Paket Dasar C (Akad & Resepsi)",
  "package_price": 8500000,
  "items": [
    {
      "id": "uuid-addon-1",
      "name": "Hairdo Modern",
      "price": 750000,
      "unit": "item",
      "qty": 1,
      "subtotal": 750000
    },
    {
      "id": "uuid-addon-2",
      "name": "Video Paket B",
      "price": 2000000,
      "unit": "item",
      "qty": 1,
      "subtotal": 2000000
    },
    {
      "id": "uuid-addon-3",
      "name": "Rias Tamu",
      "price": 200000,
      "unit": "orang",
      "qty": 5,
      "subtotal": 1000000
    }
  ],
  "additionals_total": 3750000,
  "grand_total": 12250000,
  "saved_at": "2026-03-28T10:00:00Z"
}
```

**Hubungan dengan `price_deal`:**

```
estimated_additionals.grand_total  ← kalkulasi estimasi customer (gambaran awal)
                  ↕ (referensi saja, bisa berbeda)
           price_deal               ← diinput MANUAL sesuai kesepakatan vendor
```

---

## 6. Functional Requirements

### 6.1 Manajemen Katalog Add-on (Vendor Detail Page)

- **Tab "Add-on"** di halaman detail vendor (sejajar dengan tab Paket, Gambar)
- CRUD add-on:
  - **Tambah:** form inline/sheet — Nama*, Deskripsi, Harga*, Satuan (dropdown)
  - **Edit:** inline edit per row
  - **Hapus:** dengan konfirmasi
  - **Reorder:** drag-drop (sama seperti vendor packages)
- Field satuan yang tersedia: `item`, `orang`, `set`, `jam`, `meja`, `sesi`, `lainnya`
- List ditampilkan sebagai tabel atau card list

### 6.2 Kalkulator Estimasi (Vendor Detail Page)

- Section **"Estimasi Biaya"** di halaman detail vendor (bisa tab tersendiri atau dalam tab Add-on)
- UI Kalkulator:
  1. **Dropdown pilih paket** (dari `vendor_packages`) → auto-show harga paket
  2. **Checklist add-on** — centang add-on yang diinginkan
  3. **Input kuantitas** — muncul saat add-on dicentang; default = 1
  4. **Summary real-time** yang selalu terlihat (sticky bottom atau sidebar card):
     ```
     Paket Dasar C (Akad & Resepsi)    Rp  8.500.000
     + Hairdo Modern (1x)              Rp    750.000
     + Video Paket B (1x)              Rp  2.000.000
     + Rias Tamu (5 orang)             Rp  1.000.000
     ──────────────────────────────────────────────────
     Estimasi Total                    Rp 12.250.000
     ```
  5. **Tombol "Simpan Estimasi"** — menyimpan ke `estimated_additionals` (tidak mengubah `price_deal`)
  6. Label jelas: **"Ini adalah estimasi. Harga deal final diinput sesuai kesepakatan."**

### 6.3 Tampilan Estimasi Tersimpan

- Di section pembayaran vendor detail, tampilkan estimasi terakhir yang tersimpan sebagai card collapsible
- Tampilkan badge status yang membedakan: "Estimasi" vs "Deal Final (Rp X)"
- Tombol **"Reset Estimasi"** untuk menghapus `estimated_additionals`

### 6.4 Tidak Ada Perubahan pada Booking Flow

- Form booking / perubahan status vendor **tidak berubah**
- `price_deal` tetap diinput manual di form yang sudah ada
- Estimasi hanya tampil sebagai referensi informasi, bukan bagian dari proses booking

---

## 7. UI/UX Specification

### 7.1 Tab Add-on — Daftar Katalog

```
┌─────────────────────────────────────────────────────────┐
│ Add-on Tersedia                          [+ Tambah]     │
├─────────────────────────────────────────────────────────┤
│  Foto Unlimited Full Day                                 │
│  Album magnetic, cetak 120 foto          Rp 1.900.000   │
│  per item                              [Edit] [Hapus]   │
├─────────────────────────────────────────────────────────┤
│  Hairdo Modern                                          │
│  —                                       Rp   750.000  │
│  per item                              [Edit] [Hapus]   │
├─────────────────────────────────────────────────────────┤
│  Rias Tamu                                              │
│  Tambahan hairdo +Rp 175.000/orang       Rp   200.000  │
│  per orang                             [Edit] [Hapus]   │
└─────────────────────────────────────────────────────────┘
```

### 7.2 Tab/Section Estimasi — Kalkulator

```
┌─────────────────────────────────────────────────────────┐
│ Kalkulator Estimasi Biaya                               │
│ ⓘ Estimasi ini tidak mempengaruhi harga deal final     │
├─────────────────────────────────────────────────────────┤
│ Paket Dasar: [Paket Dasar C (Akad & Resepsi) ▼]        │
│              Rp 8.500.000                               │
├─────────────────────────────────────────────────────────┤
│ Add-on:                                                 │
│                                                         │
│ ☑  Hairdo Modern           Rp 750.000 / item           │
│    Qty: [─ 1 +]            Sub: Rp 750.000             │
│                                                         │
│ ☑  Video Paket B           Rp 2.000.000 / item         │
│    Qty: [─ 1 +]            Sub: Rp 2.000.000           │
│                                                         │
│ ☑  Rias Tamu               Rp 200.000 / orang          │
│    Qty: [─ 5 +]            Sub: Rp 1.000.000           │
│                                                         │
│ ☐  Hena                    Rp 350.000 / item           │
│                                                         │
│ ☐  Dekorasi 4m Premium     Rp 3.000.000 / item         │
├─────────────────────────────────────────────────────────┤
│ Paket Dasar C              Rp  8.500.000                │
│ Add-on (3 item)            Rp  3.750.000                │
│ ─────────────────────────────────────────              │
│ Estimasi Total             Rp 12.250.000               │
│                                        [Simpan Estimasi]│
└─────────────────────────────────────────────────────────┘
```

### 7.3 Estimasi Tersimpan (di Section Pembayaran)

```
┌─────────────────────────────────────────────────────────┐
│ 📊 Estimasi Biaya (disimpan 28 Mar 2026)     [Reset]    │
│                                                         │
│ Paket: Paket Dasar C                   Rp  8.500.000   │
│ Add-on:                                                 │
│   • Hairdo Modern (1x)                 Rp    750.000   │
│   • Video Paket B (1x)                 Rp  2.000.000   │
│   • Rias Tamu (5 orang)                Rp  1.000.000   │
│ ──────────────────────────────────────────────────────  │
│ Estimasi Total                         Rp 12.250.000   │
│                                                         │
│ ⓘ Harga deal final sesuai kesepakatan: Rp 11.500.000   │
└─────────────────────────────────────────────────────────┘
```

---

## 8. Acceptance Criteria

### US-VA1: Tambah Add-on
- **Given** user membuka detail vendor "Shofi Wedding"
- **When** user membuka tab "Add-on" dan tambah: Hairdo Modern, Rp 750.000, per item
- **Then** add-on muncul di daftar katalog
- **And** add-on tersedia di checklist kalkulator estimasi

### US-VA3: Kalkulasi Estimasi Real-time
- **Given** vendor memiliki 3 paket dan 10 add-on
- **When** user pilih Paket C + centang 3 add-on + set qty masing-masing
- **Then** summary estimasi terupdate real-time tanpa page reload
- **And** grand total = harga paket + jumlah subtotal add-on terpilih

### US-VA5: Simpan Estimasi
- **Given** user sudah memilih paket + add-on di kalkulator
- **When** user klik "Simpan Estimasi"
- **Then** `estimated_additionals` tersimpan di database
- **And** estimasi tersimpan muncul di section pembayaran sebagai referensi
- **And** `price_deal` TIDAK berubah

### Isolation Test: price_deal tidak terpengaruh
- **Given** vendor berstatus "booked" dengan `price_deal = Rp 11.500.000`
- **When** user mengubah pilihan di kalkulator estimasi dan simpan
- **Then** `price_deal` tetap Rp 11.500.000 (tidak berubah)
- **And** hanya `estimated_additionals` yang berubah

---

## 9. Database Migration

```sql
-- 1. Tabel katalog add-on vendor
CREATE TABLE vendor_additionals (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id   uuid NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  name        text NOT NULL,
  description text,
  price       integer NOT NULL DEFAULT 0,
  unit        text NOT NULL DEFAULT 'item',
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_vendor_additionals_vendor_id ON vendor_additionals(vendor_id);

-- 2. Kolom estimasi di tabel vendors
ALTER TABLE vendors
ADD COLUMN estimated_additionals jsonb DEFAULT NULL;

-- 3. RLS (ikuti pola vendor_packages)
ALTER TABLE vendor_additionals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own vendor additionals"
ON vendor_additionals
USING (
  vendor_id IN (
    SELECT v.id FROM vendors v
    JOIN weddings w ON v.wedding_id = w.id
    WHERE w.user_id = auth.uid() OR w.partner_user_id = auth.uid()
  )
);
```

---

## 10. TypeScript Types

```typescript
// Tambahkan ke database.types.ts
vendor_additionals: {
  Row: {
    id: string;
    vendor_id: string;
    name: string;
    description: string | null;
    price: number;
    unit: string;
    sort_order: number;
    created_at: string;
  };
  Insert: {
    id?: string;
    vendor_id: string;
    name: string;
    description?: string | null;
    price: number;
    unit?: string;
    sort_order?: number;
    created_at?: string;
  };
  Update: {
    id?: string;
    vendor_id?: string;
    name?: string;
    description?: string | null;
    price?: number;
    unit?: string;
    sort_order?: number;
    created_at?: string;
  };
};

// Tipe untuk JSON estimated_additionals
export type EstimatedAdditionalItem = {
  id: string;
  name: string;
  price: number;
  unit: string;
  qty: number;
  subtotal: number;
};

export type EstimatedAdditionals = {
  package_id: string | null;
  package_name: string | null;
  package_price: number;
  items: EstimatedAdditionalItem[];
  additionals_total: number;
  grand_total: number;
  saved_at: string;
};
```

---

## 11. Implementation Plan

### Phase 1 — Data Layer (2–3 jam)
1. Jalankan migration SQL
2. Update `database.types.ts`
3. Tambah hooks di `use-vendors.ts`:
   - `useVendorAdditionals(vendorId)`
   - `useCreateVendorAdditional()`
   - `useUpdateVendorAdditional()`
   - `useDeleteVendorAdditional()`
4. Tambah `estimated_additionals` ke type `VendorDetail`
5. Update `useUpdateVendor()` — sudah ada, cukup kirim field baru

### Phase 2 — Katalog Add-on UI (3–4 jam)
6. Buat `vendor-additionals-tab.tsx` — list + CRUD (referensi: `vendor-packages-tab`)
7. Tambahkan tab "Add-on" di detail page vendor

### Phase 3 — Kalkulator Estimasi (4–5 jam)
8. Buat `vendor-addon-estimator.tsx`:
   - State: `selectedPackageId`, `selectedItems: Record<string, {checked, qty}>`
   - Computed: `grandTotal = packagePrice + sum(item.price * item.qty)`
   - Props: `packages`, `additionals`, `initialEstimate`, `onSave`
9. Embed di vendor detail page (tab tersendiri atau section di bawah tab Add-on)
10. Handler `handleSaveEstimate()` — update `estimated_additionals` via `useUpdateVendor`
11. Tampilkan estimasi tersimpan di section pembayaran (`vendor-detail-payments.tsx`)

### Phase 4 — Polish (1–2 jam)
12. Info banner "Estimasi ini tidak mempengaruhi harga deal"
13. Tombol Reset estimasi
14. Mobile responsive: accordion untuk list add-on agar tidak overflow

### Estimasi Effort Total: 10–14 jam

---

## 12. Out of Scope (v1.0)

- Add-on yang otomatis ter-include/ter-exclude berdasarkan paket yang dipilih
- Multi-scenario estimasi (simpan beberapa skenario sekaligus, "Skenario A vs B")
- Export estimasi ke PDF
- Share estimasi ke partner/WO
- Add-on dengan harga bertingkat (tier pricing)
- Auto-populate `price_deal` dari estimasi (intentionally excluded — deal tetap manual)

---

## 13. Dependencies

| Dependency | Status | Keterangan |
|---|---|---|
| `vendor_packages` schema | ✅ Ada | Referensi pola implementasi |
| `vendor_packages` tab UI | ✅ Ada | Referensi komponen |
| `price_deal` di `vendors` | ✅ Ada | **Tidak berubah** |
| `selected_package_id` di `vendors` | ✅ Ada | Digunakan di kalkulator sebagai initial value |
| `useUpdateVendor()` hook | ✅ Ada | Digunakan untuk simpan `estimated_additionals` |
| Booking flow / status change | ✅ Ada | **Tidak berubah** |
