# AI Prompt: Ekstraksi Price List Vendor ke JSON

> **Tujuan:** Prompt siap pakai untuk dimasukkan ke Claude.ai / ChatGPT bersama foto atau PDF price list vendor. Output JSON langsung bisa di-paste ke fitur Import JSON di halaman vendor NIKAHKU.
> **Created:** 28 Maret 2026

---

## Prompt (Copy-Paste Langsung)

```
Ekstrak data price list vendor pernikahan dari dokumen/foto yang aku lampirkan.
Output HARUS berupa JSON murni — tidak ada teks penjelasan sebelum atau sesudah JSON.

ATURAN WAJIB (jangan dilanggar):
1. Hanya tulis data yang BENAR-BENAR ADA di dokumen. Jangan mengarang, jangan mengisi field yang tidak ada informasinya dengan asumsi.
2. Jika suatu informasi tidak ada di dokumen, isi dengan null — jangan mengarang nilai.
3. Semua harga dalam angka integer IDR tanpa titik/koma (contoh: 750000, bukan "Rp 750.000").
4. Jika harga bertipe "mulai dari" / "start from", gunakan angka minimumnya dan tulis keterangan "mulai dari Rp X" di field "description".
5. Jika item gratis (free / free charge / Rp 0), tulis price: 0 dan tulis "Gratis" di field "description".
6. Jangan duplikasi: item yang sudah masuk di packages[].includes JANGAN dimasukkan lagi ke additionals.
7. Satuan (unit) harus salah satu dari: "item", "orang", "set", "jam", "meja", "sesi", "km". Jika tidak ada satuan eksplisit di dokumen, gunakan "item".
8. Untuk additionals: TIDAK ADA field "notes". Semua keterangan tambahan (syarat, kondisi, info "mulai dari", dsb.) ditulis di field "description".

CARA MEMBEDAKAN packages vs additionals:
- packages  → bundling layanan dengan daftar isi (termasuk/tidak termasuk), dijual sebagai satu kesatuan
- additionals → item satuan yang dijual terpisah / bisa ditambahkan di luar paket

FORMAT JSON OUTPUT:

{
  "packages": [
    {
      "name": "string — nama paket persis seperti di dokumen",
      "description": "string | null — deskripsi singkat jika ada",
      "price": 0,
      "includes": ["string", "..."] | null,
      "excludes": ["string", "..."] | null,
      "notes": "string | null — catatan khusus, syarat, atau harga promo asal jika relevan"
    }
  ],
  "additionals": [
    {
      "name": "string — nama item persis seperti di dokumen",
      "description": "string | null — deskripsi + semua keterangan tambahan (mulai dari, kondisi, syarat, dsb.)",
      "price": 0,
      "unit": "item | orang | set | jam | meja | sesi | km"
    }
  ]
}

Lampirkan dokumen/foto price list vendor sekarang.
```

---

## Cara Pakai

1. Buka Claude.ai atau ChatGPT
2. Copy seluruh prompt di atas
3. Lampirkan foto / PDF price list vendor
4. Kirim → tunggu output JSON
5. Copy output JSON → paste ke fitur Import JSON di halaman detail vendor NIKAHKU

---

## Contoh Output yang Diharapkan

Dari price list **Shofi Wedding**:

```json
{
  "packages": [
    {
      "name": "Paket Lengkap",
      "description": null,
      "price": 14000000,
      "includes": [
        "Make-up pengantin 1 kali untuk akad dan resepsi 1 hari",
        "3 set baju pengantin wanita",
        "3 set baju pengantin pria",
        "Dekorasi pelaminan premium 4 meter bunga mix",
        "Dokumentasi foto unlimited full day (maks jam 8 malam)",
        "Album magnetic, cetak 120 foto + all file",
        "Melati segar (adat / non adat)",
        "Make-up & sewa baju 2 ibu dan 2 bapak",
        "Hijabdo",
        "Retouch by asisten",
        "Softlens",
        "Nail art",
        "Prosesi panggih",
        "Make-up dan sewa baju 2 pager ayu 2 pager bagus"
      ],
      "excludes": ["Hairdo"],
      "notes": "Harga normal Rp 16.500.000 (promo diskon Rp 2.500.000). Item free jika tidak dipakai tidak mengurangi harga dan tidak bisa ditukar."
    },
    {
      "name": "Paket Dasar C (Akad & Resepsi)",
      "description": null,
      "price": 8500000,
      "includes": [
        "Make-up pengantin 1 kali untuk akad dan resepsi 1 hari",
        "2 set baju pengantin wanita",
        "2 set baju pengantin pria",
        "Make-up & sewa baju 2 ibu dan 2 bapak",
        "Softlens",
        "Nail art",
        "Prosesi panggih",
        "Retouch by asisten",
        "Hijabdo"
      ],
      "excludes": ["Hairdo"],
      "notes": null
    }
  ],
  "additionals": [
    {
      "name": "Foto Unlimited Full Day",
      "description": "Album magnetic, cetak 120 foto + all file, maks jam 8 malam",
      "price": 1900000,
      "unit": "item"
    },
    {
      "name": "Hairdo Modern",
      "description": null,
      "price": 750000,
      "unit": "item"
    },
    {
      "name": "Hijabdo Jawa + Paes",
      "description": null,
      "price": 850000,
      "unit": "item"
    },
    {
      "name": "Hijabdo Simple / Modern",
      "description": "Gratis",
      "price": 0,
      "unit": "item"
    },
    {
      "name": "Rias Tamu / Among Tamu",
      "description": "Tambahan hairdo Rp 175.000 per orang",
      "price": 200000,
      "unit": "orang"
    },
    {
      "name": "Baju Tamu Wanita",
      "description": "Inc: baju atasan, manset, jarik, kerudung, aksesoris",
      "price": 150000,
      "unit": "orang"
    },
    {
      "name": "Cucuk Lampah",
      "description": "mulai dari Rp 550.000",
      "price": 550000,
      "unit": "item"
    },
    {
      "name": "Dekorasi Pelaminan 4m Premium",
      "description": "Kursi pelaminan, background, bunga, hiasan, lampu lighting, panggung, karpet, free standing photo. Tidak termasuk gate pintu masuk, karpet jalan, terop.",
      "price": 3000000,
      "unit": "item"
    }
  ]
}
```

---

## Tips Menghindari Halusinasi

| Situasi                                        | Yang Benar                                                                       |
| ---------------------------------------------- | -------------------------------------------------------------------------------- |
| Harga tidak terbaca jelas di foto              | Tulis `price: 0`, `description`: "harga tidak terbaca"                           |
| Ada item tapi tanpa harga                      | Tulis `price: 0`, `description`: "harga tidak tercantum"                         |
| Item "free" di dalam paket                     | Masuk ke `packages[].includes` saja, **jangan** ke `additionals`                 |
| Item add-on gratis / free charge               | `price: 0`, `description`: "Gratis"                                              |
| Harga "mulai dari Rp X"                        | `price: X`, `description`: "mulai dari Rp X"                                     |
| Add-on dengan syarat atau keterangan tambahan  | Tulis syarat/keterangan di `description` — **tidak ada field `notes` di add-on** |
| Dokumen 2 halaman, halaman 2 tidak terbaca     | Ekstrak yang ada, jangan karang sisanya                                           |
| Nama paket ambigu                              | Salin persis dari dokumen, jangan parafrase                                       |
