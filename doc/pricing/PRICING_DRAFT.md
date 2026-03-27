# NIKAHKU — Draft Skema Pricing (One Time Purchase)

> Versi: Draft v1.0 | Tanggal: 2026-03-27

---

## Filosofi Pricing

- **Free tier permanen** — bukan trial, tidak ada batasan waktu
- **One Time Purchase** — bayar sekali, akses selamanya (bukan subscription)
- Target: pasangan yang hanya butuh platform ini 1x untuk 1 pernikahan

---

## Tier Pricing

### 🆓 Gratis — Rp 0 (Selamanya)

Fitur sudah cukup untuk pernikahan sederhana hingga menengah.

| Fitur | Limit |
|-------|-------|
| Manajemen budget | Dasar (input, kategorisasi) |
| Tamu undangan | Hingga **100 tamu** |
| Vendor | Hingga **3 kategori** vendor |
| Checklist planning | Template standar |
| Seserahan tracker | ✅ Tersedia |
| Kolaborasi pasangan | ✅ 1 pasangan (2 user) |
| Export data | ❌ |
| Laporan budget detail | ❌ |
| Perbandingan vendor | ❌ |
| Custom checklist | ❌ |

---

### 💍 Seumur Hidup — Rp 149.000 *(One Time)*

Bayar sekali, akses semua fitur untuk **1 akun pasangan selamanya**.

| Fitur | Limit |
|-------|-------|
| Semua fitur Gratis | ✅ |
| Tamu undangan | **Unlimited** |
| Vendor | **Unlimited** kategori & item |
| Perbandingan vendor | ✅ Side-by-side |
| Laporan budget detail | ✅ |
| Export data (tamu, budget, seserahan) | ✅ PDF / CSV |
| Custom checklist template | ✅ |
| Multi-event support | ✅ (hingga 2 event) |
| Priority support | ✅ |
| Akses fitur baru selamanya | ✅ |

**CTA:** "Beli Sekarang — Rp 149.000"

---

## Pertimbangan Penetapan Harga

| Faktor | Keterangan |
|--------|-----------|
| Siklus pakai | Pernikahan terjadi 1x → subscription tidak ideal secara psikologis |
| Referensi harga | Rp 99K/bulan = ~Rp 300–600K jika dipakai 3–6 bulan; OTP Rp 149K lebih menarik |
| Willingness to pay | Target segmen menengah, terbiasa bayar app mobile Rp 50–200K sekali |
| Kompetitor | Notion (gratis/template), Bridestory (vendor-only, gratis) |
| Anchor | Tampilkan "setara Rp 24.000/bulan" untuk 6 bulan perencanaan |

---

## Hal yang Perlu Dikonfirmasi

- [ ] Apakah "multi-event support" perlu dibatasi (misal: max 2) atau dipisah ke tier tersendiri?
- [ ] Apakah harga Rp 149.000 sudah tepat, atau perlu A/B test Rp 99K vs Rp 149K vs Rp 199K?
- [ ] Payment gateway yang akan dipakai (Midtrans, Xendit, atau Stripe)?
- [ ] Apakah perlu masa garansi refund (misal: 7 hari)?
- [ ] Apakah akses "fitur baru selamanya" perlu dibatasi secara jangka panjang (misal: fitur v3.0+)?

---

## Alternatif Tier (Opsional, Jika Diperlukan)

Jika ingin ada opsi lebih lengkap untuk Wedding Organizer:

| Tier | Harga | Target |
|------|-------|--------|
| Gratis | Rp 0 | Pasangan individual |
| Seumur Hidup | Rp 149.000 | Pasangan yang butuh fitur lengkap |
| WO Edition *(future)* | Rp 499.000 | Wedding Organizer, multi-project, client management |

---

## Update ke `landing-page.json`

Perubahan yang perlu dilakukan pada `src/data/landing-page.json` bagian `pricing`:

```json
{
  "pricing": {
    "badge": "Harga",
    "headline": "Pilih Paket yang Tepat Untukmu",
    "subheadline": "Mulai gratis, upgrade sekali bayar — akses selamanya.",
    "plans": [
      {
        "name": "Gratis",
        "price": "Rp 0",
        "period": "selamanya",
        "description": "Sempurna untuk memulai perencanaan pernikahan.",
        "features": [
          "Manajemen budget dasar",
          "Hingga 100 tamu undangan",
          "3 kategori vendor",
          "Checklist planning standar",
          "Seserahan tracker",
          "Kolaborasi pasangan"
        ],
        "cta": {
          "label": "Mulai Gratis",
          "href": "/register"
        }
      },
      {
        "name": "Seumur Hidup",
        "price": "Rp 149K",
        "period": "sekali bayar",
        "badge": "Terbaik",
        "description": "Bayar sekali, akses semua fitur untuk pernikahan impianmu.",
        "features": [
          "Semua fitur Gratis",
          "Tamu undangan unlimited",
          "Vendor unlimited + perbandingan",
          "Laporan budget detail & export",
          "Custom checklist template",
          "Multi-event (hingga 2 event)",
          "Priority support",
          "Akses fitur baru selamanya"
        ],
        "cta": {
          "label": "Beli Sekarang",
          "href": "/register"
        },
        "highlighted": true
      }
    ]
  }
}
```
