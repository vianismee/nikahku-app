# Chat Backup: Invitation Feature — Pendekatan Teknis

**Tanggal:** 2026-03-30
**Topik:** Diskusi pendekatan implementasi fitur Undangan Digital (Invitation)

---

## Konteks Awal

Fitur Undangan Digital dirancang agar user bisa memilih, membeli, dan mengkustomisasi template undangan pernikahan digital yang dapat dibagikan via link. Template dikategorikan berdasarkan tier harga, sebagian mendukung kustomisasi visual.

---

## Pertanyaan 1: Template dari Elementor Slicing?

**User:** Pengen ambil template dari Elementor lalu di-slicing, tapi khawatir soal manajemen aset (ornamen bunga, dll).

**Kesimpulan diskusi:**

### Pendekatan yang Ditolak: React Component Templates

Awalnya diusulkan setiap template dibangun sebagai React component dengan ornamen SVG inline. Keuntungannya bersih dan maintainable, tapi kelemahannya:
- Tidak cocok dengan ekspektasi pasar (pasar ingin PNG berat, GIF animasi)
- Harus rebuild ulang dari Elementor ke React — effort besar
- Ornamen harus dikonversi ke SVG

---

## Pertanyaan 2: Apakah Ada Pendekatan Lain?

**User:** Yang laku di pasaran adalah template dengan banyak PNG, animasi GIF, dan rata-rata menggunakan Elementor.

**Kesimpulan diskusi:**

### Pendekatan yang Dipilih: HTML Token Injection

Template tetap berupa **HTML biasa hasil slicing Elementor**, ditambah lapisan injeksi data dan kustomisasi di atasnya.

#### Cara Kerja

1. Template HTML disimpan di `/public/templates/[slug]/index.html`
2. Field yang bisa diganti ditandai dengan token: `{{NAMA_PRIA}}`, `{{TANGGAL_LENGKAP}}`, dll
3. Server membaca HTML, replace semua token dengan data user, return sebagai full HTML page
4. Kustomisasi warna/font di-inject via `<style>` block dengan CSS variables
5. Halaman undangan disajikan di `nikahku.com/i/[shareSlug]` sebagai full-page HTML

#### Struktur File Template

```
public/
└── templates/
    └── floral-romance/
        ├── index.html          ← HTML utama dari slicing Elementor
        ├── style.css
        ├── script.js           ← animasi, scroll effects
        ├── assets/
        │   ├── ornament-top.png
        │   ├── ornament-divider.gif
        │   ├── background.jpg
        │   └── music.mp3
        └── manifest.json       ← metadata: token, opsi kustomisasi
```

#### Token System di HTML

```html
<h1>{{NAMA_PRIA}} & {{NAMA_WANITA}}</h1>
<p>{{HARI}}, {{TANGGAL_LENGKAP}}</p>
<img src="{{FOTO_UTAMA}}" />

<style id="custom-overrides">
  :root {
    --accent-color: {{ACCENT_COLOR}};
    --heading-font: '{{HEADING_FONT}}', serif;
  }
</style>
{{GOOGLE_FONTS_LINK}}
```

#### Next.js Route Handler (bypass React rendering)

```ts
// src/app/i/[shareSlug]/route.ts
export async function GET(req, { params }) {
  const invitation = await getInvitationBySlug(params.shareSlug)
  const templateHtml = await readTemplateFile(invitation.template.slug)
  const rendered = replaceTokens(templateHtml, {
    NAMA_PRIA: invitation.wedding.groom_name,
    NAMA_WANITA: invitation.wedding.bride_name,
    ACCENT_COLOR: invitation.customizations.accent_color ?? "#8B6F4E",
    // ...dst
  })
  return new Response(rendered, {
    headers: { "Content-Type": "text/html" }
  })
}
```

#### Preview di Editor (iframe + postMessage)

```tsx
// Editor page — iframe load URL undangan
<iframe src={`/i/${shareSlug}?preview=true`} className="w-full h-full" />
```

```js
// Di script.js template — listen perubahan kustomisasi live
window.addEventListener("message", (e) => {
  if (e.data.type === "UPDATE_CUSTOMIZATION") {
    document.getElementById("custom-overrides").textContent = `
      :root { --accent-color: ${e.data.accentColor}; }
    `
  }
})
```

#### manifest.json per Template

```json
{
  "name": "Floral Romance",
  "category": "Premium",
  "tokens": ["NAMA_PRIA", "NAMA_WANITA", "TANGGAL_LENGKAP", "NAMA_VENUE", "KOTA", "FOTO_UTAMA"],
  "customization_options": [
    { "key": "ACCENT_COLOR", "type": "color", "default": "#8B6F4E" },
    { "key": "HEADING_FONT", "type": "font_picker", "default": "Playfair Display" },
    { "key": "FOTO_UTAMA", "type": "image_upload" }
  ],
  "features": ["musik", "countdown", "maps", "rsvp", "galeri"]
}
```

#### Manajemen Aset

| Jenis Aset | Simpan Di | Alasan |
|---|---|---|
| Ornamen PNG, GIF animasi | `/public/templates/[slug]/assets/` | Static, langsung serve, edge cached |
| Background texture | `/public/templates/[slug]/assets/` | Sama |
| Musik background | Supabase Storage | File besar |
| Foto upload user | Supabase Storage | User-generated content |

#### Perbandingan Pendekatan

| | React Component | HTML Token Injection |
|---|---|---|
| Sesuai ekspektasi pasar | Kurang | **Ya** |
| Elementor slicing langsung pakai | Tidak | **Ya** |
| Kustomisasi warna/font | Mudah | Mudah (CSS var injection) |
| PNG/GIF berat langsung pakai | Susah | **Ya** |
| Animasi kompleks | Terbatas | **Ya (JS/CSS bebas)** |
| Maintainability | Tinggi | Sedang |
| Waktu bikin 1 template baru | Lama | **Cepat** |

---

## Pertanyaan 3: Bisa Slicing dari Inspect Element?

**User:** Kalau ambil source page dari inspect element, apakah bisa dilakukan slicing?

**Jawaban:** Bisa, dengan catatan:

### Yang Aku Bisa Lakukan dari HTML Inspect Element
- Bersihkan markup Elementor yang berantakan
- Identifikasi dan pasang token system
- Inject CSS variable untuk kustomisasi
- Susun jadi standalone HTML file
- Buat `manifest.json`

### Masalah yang Muncul
1. **CSS tidak ikut** — ada di file eksternal, perlu di-copy terpisah dari tab Sources/Network
2. **Gambar masih URL eksternal** — perlu di-download dan re-path ke lokal
3. **Font** — biasanya sudah ada `<link>` Google Fonts, tinggal dibiarkan

### Cara Terbaik Ambil Source
```
Klik kanan halaman → Save as → Webpage, Complete (*.htm)
```
Ini download HTML + semua aset (CSS, PNG, GIF, JS) sekaligus dalam satu folder.

### Workflow Slicing
```
Input dari user:
├── HTML (dari Save as / Copy outerHTML)
├── CSS files
└── Folder aset (PNG, GIF, JS)

Output dari Claude:
├── index.html (bersih + token system terpasang)
├── style.css (dibersihkan)
├── script.js
├── assets/ (aset yang sudah di-path ulang)
└── manifest.json
```

---

## Keputusan Final

- Pendekatan: **HTML Token Injection**
- Template design dari: Elementor / referensi pasar
- Aset template: `/public/templates/[slug]/assets/` (PNG, GIF langsung)
- User uploads: Supabase Storage
- Serving: Next.js Route Handler return full HTML (bypass React)
- Editor preview: `<iframe>` + `postMessage` untuk live update
- Proof of concept: mulai dari 1 template dulu via Save as → paste ke Claude

---

## Referensi

- Doc fitur lengkap: `docs/features/invitation.md`
- Template akan disimpan di: `public/templates/`
- Route handler: `src/app/i/[shareSlug]/route.ts`
