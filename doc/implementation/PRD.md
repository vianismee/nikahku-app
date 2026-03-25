# 📋 Product Requirements Document (PRD)
# **NIKAHKU — Wedding Planner Platform**

> **Version:** 1.1.0
> **Author:** Product Team
> **Last Updated:** 25 Maret 2026
> **Status:** Draft — Awaiting Stakeholder Review
> **Tech Stack:** Next.js 16.2 · Supabase · Shadcn/UI (Flat) · Serwist PWA

---

## Daftar Isi

1. [Executive Summary](#1-executive-summary)
2. [User Personas & Target Market](#2-user-personas--target-market)
3. [User Stories & Acceptance Criteria](#3-user-stories--acceptance-criteria)
4. [Feature Breakdown](#4-feature-breakdown)
5. [Information Architecture & User Flow](#5-information-architecture--user-flow)
6. [Technical Specifications](#6-technical-specifications)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [UI/UX Design Direction](#8-uiux-design-direction)
9. [Risks & Mitigations](#9-risks--mitigations)
10. [Phased Roadmap](#10-phased-roadmap)
11. [Expansion Features (Future)](#11-expansion-features-future)
12. [Out of Scope (v1.0)](#12-out-of-scope-v10)
13. [Success Metrics & KPIs](#13-success-metrics--kpis)
14. [Appendix](#14-appendix)

---

## 1. Executive Summary

### 1.1 Problem Statement

Pasangan yang merencanakan pernikahan di Indonesia menghadapi kompleksitas tinggi: mengelola budget yang terbatas, membandingkan puluhan vendor dari berbagai kategori (catering, attire, fotografi, dekorasi, dll.), melacak pembelian mahar & seserahan, mengkoordinasikan ratusan undangan tamu, dan menjalankan timeline persiapan selama 3–12 bulan — semuanya secara manual menggunakan spreadsheet terpisah, chat WhatsApp, dan catatan kertas yang tidak terintegrasi.

### 1.2 Proposed Solution

**NIKAHKU** adalah platform wedding planner all-in-one berbasis web **(PWA — Progressive Web App)** yang memungkinkan pasangan untuk:

- Mengelola **budget pernikahan** secara real-time dengan tracking pengeluaran otomatis
- Menyimpan, membandingkan, dan membooking **vendor** berdasarkan kategori dan paket harga
- Mengelola daftar **mahar & seserahan** lengkap dengan link toko online (Shopee/Tokopedia)
- Mengatur **daftar undangan & tamu** dengan RSVP tracking
- Merencanakan seluruh persiapan via **planning board** (Calendar, Gantt Chart, atau Kanban)
- Melihat ringkasan semua data di **interactive dashboard**
- **Install sebagai app di smartphone** tanpa melalui App Store/Play Store (PWA)
- **Akses offline** untuk melihat data yang sudah ter-cache

### 1.3 Success Criteria

| KPI | Target | Measurement |
|-----|--------|-------------|
| Task Completion Rate | ≥ 90% user dapat menyelesaikan setup awal dalam < 15 menit | Analytic event tracking |
| User Retention (30-day) | ≥ 60% user aktif kembali dalam 30 hari | Monthly Active Users |
| Budget Accuracy | ≥ 95% kalkulasi budget akurat vs input manual | Automated calculation tests |
| Vendor Comparison Time | Berkurang 70% vs metode manual (spreadsheet) | User survey pre/post |
| Page Load Time | < 2 detik untuk dashboard utama | Lighthouse Performance Score ≥ 90 |

---

## 2. User Personas & Target Market

### Persona 1: Calon Pengantin — "Rina & Adi"

| Attribute | Detail |
|-----------|--------|
| **Demografi** | Pasangan usia 24–35 tahun, tinggal di kota besar Indonesia |
| **Pekerjaan** | Profesional muda, dual income |
| **Budget** | Rp 50 juta – Rp 300 juta |
| **Pain Points** | Overwhelmed dengan banyaknya vendor, takut over-budget, kesulitan tracking progress, data tersebar di banyak tempat |
| **Goals** | Pernikahan terorganisir, transparan budget-nya, tidak ada yang terlewat |
| **Tech Savvy** | Aktif di smartphone, familiar dengan e-commerce (Shopee/Tokopedia) |

### Persona 2: Wedding Organizer — "Kak Dian"

| Attribute | Detail |
|-----------|--------|
| **Demografi** | Wanita usia 28–40, profesional WO |
| **Pekerjaan** | Freelance Wedding Organizer, handle 5–10 event/tahun |
| **Pain Points** | Klien sering berubah pikiran, kesulitan manage multiple projects, butuh profesional tools |
| **Goals** | Tools yang memudahkan presentasi ke klien, tracking progress efisien |
| **Tech Savvy** | Tinggi, terbiasa pakai project management tools |

### Persona 3: Keluarga/Orang Tua — "Ibu Sari"

| Attribute | Detail |
|-----------|--------|
| **Demografi** | Wanita usia 45–60, ibu dari calon pengantin |
| **Pekerjaan** | Ibu rumah tangga / PNS |
| **Pain Points** | Ingin terlibat tapi tidak tahu progress, khawatir budget membengkak |
| **Goals** | Bisa melihat progress dan budget secara read-only |
| **Tech Savvy** | Sedang, bisa pakai WhatsApp dan browser |

---

## 3. User Stories & Acceptance Criteria

### Epic 1: Budget Management

**US-1.1** — Sebagai calon pengantin, saya ingin menginput total budget pernikahan agar saya memiliki batasan jelas untuk pengeluaran.

**Acceptance Criteria:**
- [ ] User dapat input total budget dalam Rupiah
- [ ] Sistem menampilkan sisa budget secara real-time
- [ ] Budget otomatis terupdate saat vendor di-booking atau item dibeli
- [ ] Terdapat warning visual (merah) jika pengeluaran melebihi 90% budget
- [ ] Alert notification jika budget terlampaui

**US-1.2** — Sebagai calon pengantin, saya ingin melihat breakdown budget per kategori agar tahu alokasi terbesar.

**Acceptance Criteria:**
- [ ] Pie chart / donut chart menampilkan distribusi budget per kategori vendor
- [ ] Tabel detail menampilkan: Kategori, Alokasi, Terpakai, Sisa
- [ ] User dapat set alokasi budget per kategori (opsional)
- [ ] Data update otomatis saat ada perubahan booking/pembelian

**US-1.3** — Sebagai calon pengantin, saya ingin mencatat pengeluaran tambahan di luar vendor agar budget tracking tetap akurat.

**Acceptance Criteria:**
- [ ] Form input: Nama pengeluaran, Kategori, Jumlah, Tanggal, Catatan
- [ ] Pengeluaran tambahan masuk ke kalkulasi total budget
- [ ] Dapat diedit dan dihapus

---

### Epic 2: Vendor Management

**US-2.1** — Sebagai calon pengantin, saya ingin menambahkan data vendor beserta paket dan harganya agar tersimpan rapi di satu tempat.

**Acceptance Criteria:**
- [ ] Form input vendor: Nama Vendor, Kategori, Kontak (WA/Telp/Email), Alamat, Instagram, Website
- [ ] Setiap vendor dapat memiliki multiple paket: Nama Paket, Deskripsi, Harga, Catatan
- [ ] Upload foto/brosur vendor (max 5 gambar, masing-masing ≤ 5MB)
- [ ] Vendor tersimpan dan dapat diedit/dihapus

**US-2.2** — Sebagai calon pengantin, saya ingin mengkategorikan vendor agar mudah dicari berdasarkan kebutuhan.

**Acceptance Criteria:**
- [ ] Kategori default tersedia: Catering, Venue/Gedung, Attire & Make Up, Photo & Video, Dekorasi, Entertainment/MC, Undangan/Percetakan, Souvenir, Transportasi, Akomodasi, Henna/Mehendi, Lain-lain
- [ ] User dapat membuat kategori custom
- [ ] Filter dan search berdasarkan kategori
- [ ] Setiap kategori memiliki ikon visual yang distingtif

**US-2.3** — Sebagai calon pengantin, saya ingin membandingkan vendor dalam satu kategori secara side-by-side agar bisa memilih yang terbaik.

**Acceptance Criteria:**
- [ ] User dapat memilih 2–4 vendor dari kategori yang sama untuk komparasi
- [ ] Tabel komparasi menampilkan: Nama Vendor, Paket, Harga, Rating (user-input), Catatan Pro/Cons
- [ ] Highlight otomatis pada harga terendah dan rating tertinggi
- [ ] Opsi "Pilih Vendor Ini" yang langsung menandai sebagai vendor terpilih
- [ ] Vendor terpilih otomatis masuk ke dashboard booking

**US-2.4** — Sebagai calon pengantin, saya ingin menandai vendor yang sudah di-booking agar tahu progress pengadaan.

**Acceptance Criteria:**
- [ ] Status vendor: Shortlisted → Contacted → Negotiating → Booked → Paid (DP) → Paid (Full) → Completed
- [ ] Perubahan status ke "Booked" meminta input: Tanggal Booking, Nominal DP, Tanggal Pelunasan
- [ ] Vendor dengan status "Booked" atau "Paid" otomatis masuk ke kalkulasi budget
- [ ] Timeline pembayaran vendor muncul di planning board

---

### Epic 3: Mahar & Seserahan

**US-3.1** — Sebagai calon pengantin, saya ingin mencatat daftar mahar dan seserahan dalam bentuk tabel yang terstruktur.

**Acceptance Criteria:**
- [ ] Tabel dengan kolom: No, Nama Barang, Kategori (Mahar/Seserahan), Merek, Range Harga (Min–Max), Link Toko, Status Pembelian, Catatan
- [ ] Kolom "Link Toko" mendukung URL Shopee dan Tokopedia dengan ikon platform yang sesuai
- [ ] Link toko clickable dan membuka tab baru
- [ ] Status pembelian: Belum Dibeli, Sudah Dibeli, Sudah Diterima
- [ ] Auto-detect platform dari URL (shopee.co.id → ikon Shopee, tokopedia.com → ikon Tokopedia)

**US-3.2** — Sebagai calon pengantin, saya ingin melihat progress pembelian mahar & seserahan agar tahu mana yang belum terbeli.

**Acceptance Criteria:**
- [ ] Progress bar menampilkan persentase item yang sudah dibeli
- [ ] Filter berdasarkan status: Semua, Belum Dibeli, Sudah Dibeli, Sudah Diterima
- [ ] Total estimasi biaya mahar & seserahan (berdasarkan range harga)
- [ ] Barang yang sudah dibeli otomatis masuk ke kalkulasi budget

**US-3.3** — Sebagai calon pengantin, saya ingin bisa memisahkan item mahar dari seserahan agar lebih terorganisir.

**Acceptance Criteria:**
- [ ] Tab terpisah atau filter toggle: Mahar | Seserahan | Semua
- [ ] Summary card per kategori: total item, total sudah dibeli, estimasi biaya
- [ ] Drag-and-drop untuk reorder prioritas item

---

### Epic 4: Guest List & Undangan

**US-4.1** — Sebagai calon pengantin, saya ingin mencatat daftar tamu undangan agar tidak ada yang terlewat.

**Acceptance Criteria:**
- [ ] Form input: Nama Tamu, Kategori (Keluarga Pria/Wanita, Teman, Kantor, dll.), No. HP/WA, Email, Jumlah Orang (termasuk plus-one), Alamat, Catatan
- [ ] Import dari CSV/Excel
- [ ] Search dan filter berdasarkan kategori, status RSVP
- [ ] Total count tamu otomatis ter-update

**US-4.2** — Sebagai calon pengantin, saya ingin melacak status RSVP setiap tamu.

**Acceptance Criteria:**
- [ ] Status RSVP: Belum Diundang, Undangan Terkirim, Hadir, Tidak Hadir, Belum Konfirmasi
- [ ] Ringkasan: Total Undangan, Konfirmasi Hadir, Tidak Hadir, Belum Konfirmasi
- [ ] Estimasi jumlah tamu hadir (untuk koordinasi catering/venue)
- [ ] Bulk update status (select multiple → update status)

**US-4.3** — Sebagai calon pengantin, saya ingin mengelompokkan tamu berdasarkan sesi/acara.

**Acceptance Criteria:**
- [ ] User dapat membuat sesi: Akad Nikah, Resepsi Siang, Resepsi Malam, Pengajian, dll.
- [ ] Setiap tamu dapat di-assign ke satu atau lebih sesi
- [ ] Count tamu per sesi ditampilkan
- [ ] Warning jika total tamu melebihi kapasitas venue

---

### Epic 5: Planning Board

**US-5.1** — Sebagai calon pengantin, saya ingin merencanakan timeline pernikahan dalam format visual yang mudah dipahami.

**Acceptance Criteria:**
- [ ] Tiga mode view tersedia:
  - **Calendar View**: Tampilan kalender bulanan dengan event/task
  - **Gantt Chart**: Timeline horizontal dengan durasi dan dependencies
  - **Kanban Board**: Kolom status (To Do → In Progress → Done)
- [ ] User dapat switch antar view tanpa kehilangan data
- [ ] Setiap task memiliki: Judul, Deskripsi, Tanggal Mulai, Deadline, Assignee, Priority (Low/Medium/High/Urgent), Kategori, Status

**US-5.2** — Sebagai calon pengantin, saya ingin mendapatkan template checklist pernikahan default agar tidak mulai dari nol.

**Acceptance Criteria:**
- [ ] Template default berisi 50+ task umum pernikahan Indonesia (contoh: Booking gedung, Fitting baju, Cetak undangan, dll.)
- [ ] Template dikategorikan per timeline: 12 bulan, 6 bulan, 3 bulan, 1 bulan, 1 minggu, H-1, Hari-H
- [ ] User dapat menggunakan template as-is atau customize
- [ ] Task dari vendor booking otomatis muncul di planning board

**US-5.3** — Sebagai calon pengantin, saya ingin mendapatkan reminder untuk deadline yang mendekat.

**Acceptance Criteria:**
- [ ] Notification in-app untuk task H-7, H-3, H-1 dari deadline
- [ ] Badge count pada menu Planning Board untuk task overdue
- [ ] Overdue tasks ditandai warna merah
- [ ] Opsional: Email reminder (opt-in)

---

### Epic 6: Interactive Dashboard

**US-6.1** — Sebagai calon pengantin, saya ingin melihat ringkasan seluruh data pernikahan di satu halaman agar mendapatkan gambaran besar.

**Acceptance Criteria:**
- [ ] Dashboard menampilkan widget/card berikut:
  - **Budget Overview**: Total budget, terpakai, sisa, persentase — dengan progress bar
  - **Vendor Status**: Jumlah vendor per status (Shortlisted, Booked, Paid, dll.) — bar chart
  - **Vendor yang Sudah Di-Booking**: Tabel ringkas (Nama Vendor, Kategori, Status Pembayaran)
  - **Mahar & Seserahan Progress**: Progress bar + daftar item yang belum dibeli
  - **Guest Count**: Total undangan, konfirmasi hadir, belum konfirmasi — donut chart
  - **Upcoming Tasks**: 5 task terdekat dari planning board
  - **Countdown**: Hari menuju pernikahan
- [ ] Dashboard responsive (desktop, tablet, mobile)
- [ ] Data real-time (auto-refresh saat ada perubahan)
- [ ] Setiap widget clickable → navigasi ke halaman detail

**US-6.2** — Sebagai calon pengantin, saya ingin meng-customize layout dashboard sesuai prioritas saya.

**Acceptance Criteria:**
- [ ] Drag-and-drop widget untuk reorder
- [ ] Opsi hide/show widget tertentu
- [ ] Layout tersimpan per user

---

## 4. Feature Breakdown

### 4.1 Modul Inti (MVP)

```
NIKAHKU
├── 🏠 Dashboard (Interactive Overview)
│   ├── Budget Overview Widget
│   ├── Vendor Status Widget
│   ├── Mahar & Seserahan Progress Widget
│   ├── Guest Count Widget
│   ├── Upcoming Tasks Widget
│   └── Wedding Countdown Widget
│
├── 💰 Budget Manager
│   ├── Total Budget Input
│   ├── Budget per Kategori (Alokasi)
│   ├── Pengeluaran Tracker
│   ├── Budget vs Actual Chart
│   └── Expense History Log
│
├── 🏪 Vendor Management
│   ├── Vendor Database (CRUD)
│   ├── Vendor Categories
│   │   ├── Catering
│   │   ├── Venue / Gedung
│   │   ├── Attire & Make Up
│   │   ├── Photo & Video
│   │   ├── Dekorasi
│   │   ├── Entertainment / MC
│   │   ├── Undangan / Percetakan
│   │   ├── Souvenir
│   │   ├── Transportasi
│   │   ├── Akomodasi
│   │   ├── Henna / Mehendi
│   │   └── Custom Category
│   ├── Paket & Harga per Vendor
│   ├── Vendor Comparison (Side-by-Side)
│   ├── Vendor Booking Status Tracker
│   └── Payment Tracking
│
├── 💍 Mahar & Seserahan
│   ├── Tabel Data (Nama, Merek, Range Harga, Link Toko)
│   ├── Link Toko (Shopee / Tokopedia)
│   ├── Status Pembelian Tracker
│   ├── Kategori: Mahar vs Seserahan
│   └── Total Estimasi Biaya
│
├── 📨 Guest List & Undangan
│   ├── Daftar Tamu (CRUD)
│   ├── Kategori Tamu
│   ├── RSVP Tracking
│   ├── Session Assignment
│   ├── Import CSV/Excel
│   └── Guest Summary & Stats
│
└── 📅 Planning Board
    ├── Calendar View
    ├── Gantt Chart View
    ├── Kanban Board View
    ├── Wedding Checklist Template
    ├── Task Management (CRUD)
    ├── Deadline Reminders
    └── Auto-sync dari Vendor Booking
```

### 4.2 Vendor Category Detail

| Kategori | Ikon | Data Khusus yang Di-track |
|----------|------|--------------------------|
| Catering | 🍽️ | Jumlah porsi, menu tasting date, dietary options |
| Venue / Gedung | 🏛️ | Kapasitas, jam sewa, indoor/outdoor, parking |
| Attire & Make Up | 👰 | Fitting schedule, tema makeup, trial date |
| Photo & Video | 📸 | Jumlah crew, deliverables (album, video, drone), editing timeline |
| Dekorasi | 🌸 | Tema, warna, setup time, breakdown time |
| Entertainment / MC | 🎤 | Genre, durasi, sound system included/tidak |
| Undangan / Percetakan | 💌 | Jumlah cetak, desain approval date, delivery date |
| Souvenir | 🎁 | Jumlah pcs, personalisasi, delivery lead time |
| Transportasi | 🚗 | Jumlah mobil, rute, dekorasi mobil |
| Akomodasi | 🏨 | Jumlah kamar, check-in/out, untuk siapa |
| Henna / Mehendi | 🤲 | Jadwal, tipe henna, durasi |
| Lain-lain | ➕ | Custom fields |

### 4.3 Mahar & Seserahan Table Schema

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| No | Auto-increment | Nomor urut |
| Nama Barang | Text | e.g., "Al-Quran Custom Cover" |
| Kategori | Enum | Mahar / Seserahan |
| Sub-Kategori | Text | e.g., "Perlengkapan Ibadah", "Skincare", "Fashion" |
| Merek | Text | e.g., "Wardah", "Eiger" |
| Range Harga Min | Currency (IDR) | Harga minimum |
| Range Harga Max | Currency (IDR) | Harga maximum |
| Link Toko | URL | Shopee / Tokopedia URL |
| Platform | Auto-detect | Ikon Shopee / Tokopedia / Lainnya |
| Status | Enum | Belum Dibeli / Sudah Dibeli / Sudah Diterima |
| Tanggal Beli | Date | Diisi saat status = Sudah Dibeli |
| Harga Aktual | Currency (IDR) | Harga sebenarnya saat dibeli |
| Catatan | Text | Catatan tambahan |

---

## 5. Information Architecture & User Flow

### 5.1 Navigation Structure

```
┌─────────────────────────────────────────────┐
│  NIKAHKU          [🔔] [👤 Profile] [⚙️]   │
├────────┬────────────────────────────────────┤
│        │                                    │
│  📊    │   ┌──────────────────────────────┐ │
│  Dash  │   │     MAIN CONTENT AREA        │ │
│        │   │                              │ │
│  💰    │   │  Dashboard / Budget /        │ │
│  Budget│   │  Vendor / Mahar /            │ │
│        │   │  Guest / Planning            │ │
│  🏪    │   │                              │ │
│  Vendor│   │                              │ │
│        │   │                              │ │
│  💍    │   │                              │ │
│  Mahar │   │                              │ │
│        │   │                              │ │
│  📨    │   │                              │ │
│  Guest │   │                              │ │
│        │   │                              │ │
│  📅    │   │                              │ │
│  Plan  │   └──────────────────────────────┘ │
│        │                                    │
└────────┴────────────────────────────────────┘
```

### 5.2 Core User Flow

```
Onboarding Flow:
┌──────────┐    ┌───────────┐    ┌───────────┐    ┌──────────┐    ┌───────────┐
│  Sign Up │───▶│ Input     │───▶│ Set Budget│───▶│ Choose   │───▶│ Dashboard │
│  / Login │    │ Wedding   │    │ Total     │    │ Template │    │ Ready!    │
│          │    │ Date      │    │           │    │ Checklist│    │           │
└──────────┘    └───────────┘    └───────────┘    └──────────┘    └───────────┘

Daily Usage Flow:
┌───────────┐    ┌──────────────────────────────────────┐
│ Dashboard │───▶│ Quick Actions:                       │
│           │    │  + Tambah Vendor                     │
│           │    │  + Catat Pengeluaran                 │
│           │    │  + Update Status Tamu                │
│           │    │  + Tandai Task Selesai               │
│           │    └──────────────────────────────────────┘

Vendor Booking Flow:
┌─────────┐   ┌──────────┐   ┌──────────┐   ┌────────┐   ┌──────────┐   ┌──────────┐
│ Tambah  │──▶│ Input    │──▶│ Compare  │──▶│ Pilih  │──▶│ Booking  │──▶│ Payment  │
│ Vendor  │   │ Paket &  │   │ Vendor   │   │ Vendor │   │ & DP     │   │ Tracking │
│ Baru    │   │ Harga    │   │ (2-4)    │   │ Terbaik│   │ Input    │   │          │
└─────────┘   └──────────┘   └──────────┘   └────────┘   └──────────┘   └──────────┘
                                                              │
                                                              ▼
                                                   ┌──────────────────┐
                                                   │ Budget & Dashboard│
                                                   │ Auto-Update       │
                                                   └──────────────────┘
```

---

## 6. Technical Specifications

### 6.1 Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                   CLIENT (Browser / PWA Shell)                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Next.js 16.2 (App Router + Turbopack)                     │  │
│  │  ├── React 19.2 + React Compiler (auto-memoization)        │  │
│  │  ├── Tailwind CSS v4 + Shadcn/UI (Flat, No Shadow)         │  │
│  │  ├── Zustand + TanStack Query v5 (State Management)        │  │
│  │  ├── Recharts (Data Visualization — lightweight)            │  │
│  │  ├── @hello-pangea/dnd (Drag & Drop — Kanban)              │  │
│  │  ├── FullCalendar (Calendar View)                          │  │
│  │  ├── Frappe Gantt (Gantt Chart)                            │  │
│  │  └── Serwist / @serwist/next (PWA Service Worker)          │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  PWA Layer:                                                       │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Service Worker (Serwist)                                   │  │
│  │  ├── Precaching (App Shell, Static Assets)                  │  │
│  │  ├── Runtime Caching (API Responses — StaleWhileRevalidate) │  │
│  │  ├── Offline Fallback Page                                  │  │
│  │  ├── Background Sync (Queue offline mutations)              │  │
│  │  └── Web Push Notifications (Deadline Reminders)            │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              │ HTTPS / REST + Realtime (WebSocket)
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                  BACKEND (Next.js 16.2 Server)                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Next.js Server Actions + Route Handlers (App Router)       │  │
│  │  ├── proxy.ts (pengganti middleware.ts di Next.js 16)       │  │
│  │  ├── Supabase Auth (SSR helpers — @supabase/ssr)            │  │
│  │  ├── Supabase Storage (File Upload — vendor images)         │  │
│  │  ├── Resend (Email Service — React Email templates)         │  │
│  │  ├── Cache Components + use cache (Next.js 16 caching)      │  │
│  │  └── Web Push API (VAPID keys — push notifications)         │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                   SUPABASE (Backend-as-a-Service)                  │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │  PostgreSQL   │  │  Supabase    │  │  Supabase Storage      │  │
│  │  Database     │  │  Realtime    │  │  (S3-compatible)       │  │
│  │  ─────────── │  │  ───────────│  │  ──────────────────── │  │
│  │  • All tables │  │  • Live      │  │  • Vendor images       │  │
│  │  • RLS Policy │  │    dashboard │  │  • Upload brosur       │  │
│  │  • Functions  │  │    updates   │  │  • User avatars        │  │
│  │  • Triggers   │  │  • Presence  │  │  • Receipts/bukti      │  │
│  │  • Views      │  │    (online)  │  │  • Max 1GB (free tier) │  │
│  └──────────────┘  └──────────────┘  └────────────────────────┘  │
│                                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │  Supabase    │  │  Supabase    │  │  Supabase              │  │
│  │  Auth        │  │  Edge Func.  │  │  Cron (pg_cron)        │  │
│  │  ───────────│  │  ───────────│  │  ──────────────────── │  │
│  │  • Email/PW  │  │  • Webhooks  │  │  • Deadline reminders  │  │
│  │  • Google    │  │  • Scheduled │  │  • Link checker        │  │
│  │    OAuth 2.0 │  │    jobs      │  │  • Cleanup jobs        │  │
│  │  • Magic Link│  │  • Custom    │  │  • Daily backup verify │  │
│  │  • Session   │  │    logic     │  │                        │  │
│  └──────────────┘  └──────────────┘  └────────────────────────┘  │
│                                                                    │
│  FREE TIER LIMITS (Cukup untuk MVP):                               │
│  • Database: 500MB · Auth: 50.000 MAU · Storage: 1GB              │
│  • Realtime: 200 concurrent · Edge Functions: 500K invocations    │
│  • Bandwidth: 5GB · API Requests: Unlimited                       │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                       DEPLOYMENT                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Vercel (Free / Hobby Tier)                                 │  │
│  │  ├── Auto-deploy dari GitHub (CI/CD)                        │  │
│  │  ├── Edge Network (CDN Global — termasuk SGP region)        │  │
│  │  ├── Preview Deployments per PR                             │  │
│  │  ├── Serverless Functions (Next.js Route Handlers)          │  │
│  │  └── Analytics & Web Vitals Monitoring                      │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### 6.2 Tech Stack (Final Decision)

| Layer | Teknologi | Versi | Alasan |
|-------|-----------|-------|--------|
| **Framework** | Next.js (App Router) | 16.2 | Turbopack default (400% faster startup), Cache Components, proxy.ts, React 19.2, View Transitions |
| **Language** | TypeScript | 5.x | Type safety, better DX, auto-completion |
| **Runtime** | React | 19.2 | Server Components, React Compiler (auto-memo), useEffectEvent, View Transitions |
| **Bundler** | Turbopack | Built-in | Default di Next.js 16, 2–5x faster builds, File System Caching stable |
| **Styling** | Tailwind CSS + **Shadcn/UI (Flat Mode)** | v4 + latest | **Tanpa shadow/box-shadow** — mengurangi paint operations untuk performa mobile optimal |
| **State (Client)** | Zustand | 5.x | Minimal boilerplate, tiny bundle (1KB), devtools support |
| **State (Server)** | TanStack Query | v5 | Server state caching, background refetch, optimistic updates |
| **Database** | **Supabase (PostgreSQL)** | — | **Gratis**, 500MB DB, built-in Auth + Realtime + Storage + Edge Functions + RLS. Minim limitation untuk MVP |
| **ORM** | Supabase Client + Drizzle ORM | — | Supabase JS client untuk CRUD sederhana, Drizzle untuk complex queries + type-safe |
| **Auth** | **Supabase Auth** | — | Built-in, gratis 50K MAU, Google OAuth, Magic Link, session management via @supabase/ssr |
| **File Storage** | **Supabase Storage** | — | S3-compatible, 1GB free, public/private buckets, image transforms |
| **Realtime** | **Supabase Realtime** | — | WebSocket subscriptions, live dashboard updates, 200 concurrent connections (free) |
| **PWA** | **Serwist (@serwist/next)** | latest | Pengganti modern next-pwa, **kompatibel Turbopack** (Next.js 16), precaching + runtime caching + push notifications |
| **Charts** | Recharts | 2.x | React-native, lightweight (~45KB gzipped), customizable |
| **Calendar** | FullCalendar | 6.x | Feature-rich, drag-drop events, responsive |
| **Gantt** | Frappe Gantt | 0.7+ | Lightweight (~15KB), clean UI, touch-friendly |
| **Kanban DnD** | @hello-pangea/dnd | 16.x | Fork @atlaskit/pragmatic-drag-and-drop, performant |
| **Email** | Resend | — | Modern API, React Email templates, 100 emails/day free |
| **Deployment** | Vercel | — | Zero-config Next.js 16, Edge Network SGP, preview deploys |
| **Monitoring** | Vercel Analytics + Sentry | — | Web Vitals, error tracking, performance monitoring |

### 6.2.1 Kenapa Supabase?

```
┌───────────────────────────────────────────────────────────────┐
│                    SUPABASE FREE TIER                          │
│                                                               │
│  ✅ PostgreSQL Database         500 MB (cukup untuk 10K+ row) │
│  ✅ Auth                        50.000 Monthly Active Users    │
│  ✅ Storage                     1 GB (vendor images, receipts) │
│  ✅ Realtime                    200 concurrent connections     │
│  ✅ Edge Functions              500.000 invocations/bulan      │
│  ✅ API Requests                Unlimited                      │
│  ✅ Bandwidth                   5 GB                           │
│  ✅ Row Level Security (RLS)    Built-in (data isolation)      │
│  ✅ Database Backups            Daily (7-day retention)        │
│  ✅ Dashboard & SQL Editor      Included                       │
│  ✅ pg_cron (Scheduled Jobs)    Included                       │
│                                                               │
│  vs. Alternatives:                                            │
│  ├── Firebase: NoSQL (kurang cocok relational data wedding)   │
│  ├── PlanetScale: Free tier sunset, MySQL only                │
│  ├── Neon: 512MB free tapi tanpa Auth/Storage/Realtime        │
│  └── Railway: $5 credit/bulan habis cepat                     │
│                                                               │
│  Supabase = Database + Auth + Storage + Realtime              │
│             ALL-IN-ONE, GRATIS, MINIM LIMITATION              │
└───────────────────────────────────────────────────────────────┘
```

### 6.2.2 Shadcn/UI — Flat Mode (Tanpa Shadow)

Untuk mengoptimalkan performa di perangkat mobile (terutama Android mid-range yang umum di Indonesia), semua komponen Shadcn/UI dikonfigurasi **tanpa box-shadow**:

```css
/* globals.css — Override Shadcn/UI shadow variables */
@layer base {
  :root {
    /* Hapus semua shadow — flat design */
    --shadow-none: none;
    --shadow-sm: none;
    --shadow-md: none;
    --shadow-lg: none;
    --shadow-xl: none;
    --shadow-2xl: none;
    
    /* Ganti shadow dengan border tipis untuk visual separation */
    --border-subtle: 1px solid hsl(var(--border));
    
    /* Reduce motion untuk mobile low-end */
    --transition-fast: 100ms ease;
  }
  
  @media (prefers-reduced-motion: reduce) {
    * { transition-duration: 0ms !important; }
  }
}

/* Override semua Shadcn components */
.card, .dialog, .popover, .dropdown, .sheet, .toast {
  box-shadow: none !important;
  border: 1px solid hsl(var(--border));
}

.button {
  box-shadow: none !important;
}
```

**Dampak Performa:**
- Eliminasi ~200+ paint operations per halaman dashboard
- Reduce Composite Layers (GPU memory usage turun ~30%)
- FCP improvement ~200ms di device Android mid-range
- Jank-free scrolling pada tabel 500+ row (Guest List)

**Visual Compensation (pengganti shadow):**
- Border 1px solid `hsl(var(--border))` untuk card separation
- Background color differentiation (surface vs background)
- Subtle hover: background-color transition (bukan shadow grow)
- Divider lines antar section

### 6.2.3 PWA dengan Serwist (Pengganti next-pwa)

> **Kenapa Serwist, bukan next-pwa?**
> `next-pwa` memerlukan Webpack, sedangkan Next.js 16 menggunakan Turbopack sebagai default bundler. `@serwist/next` kompatibel dengan Turbopack dan actively maintained.

**Setup:**
```typescript
// next.config.ts
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

export default withSerwist({
  // Next.js 16.2 config
  reactCompiler: true,
  cacheComponents: true,
});
```

```typescript
// src/sw.ts (Service Worker)
import { defaultCache } from "@serwist/next/worker";
import { Serwist } from "serwist";

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();
```

```typescript
// app/manifest.ts (Built-in Next.js 16 manifest support)
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NIKAHKU — Wedding Planner",
    short_name: "NIKAHKU",
    description: "Rencanakan pernikahan impianmu dalam satu aplikasi",
    start_url: "/",
    display: "standalone",
    background_color: "#FDFBF7",
    theme_color: "#8B6F4E",
    orientation: "portrait-primary",
    categories: ["lifestyle", "productivity"],
    icons: [
      { src: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    screenshots: [
      { src: "/screenshots/dashboard.png", sizes: "1080x1920", type: "image/png", form_factor: "narrow" },
      { src: "/screenshots/desktop.png", sizes: "1920x1080", type: "image/png", form_factor: "wide" },
    ],
  };
}
```

**PWA Caching Strategy:**

| Resource | Strategy | Max Age | Alasan |
|----------|----------|---------|--------|
| App Shell (HTML/JS/CSS) | Precache | — | Instant load, offline app shell |
| Static Assets (fonts, icons) | Cache First | 30 hari | Jarang berubah |
| API: Dashboard Data | Stale While Revalidate | 5 menit | Show cached, refresh background |
| API: Vendor/Guest List | Network First | 1 jam | Data penting, harus fresh |
| Supabase Storage (images) | Cache First | 7 hari | Gambar vendor jarang berubah |
| Offline Fallback | Precache | — | Halaman "/offline" saat no network |

**PWA Features yang Diaktifkan:**

| Feature | Status | Keterangan |
|---------|--------|------------|
| Install to Home Screen | ✅ MVP | Android + iOS (16.4+) |
| Offline App Shell | ✅ MVP | Dashboard & cached data viewable offline |
| Background Sync | ✅ MVP | Queue mutations saat offline, sync saat online |
| Push Notifications | 🔄 v1.1 | Deadline reminder, vendor payment due |
| Periodic Sync | 🔄 v1.2 | Auto-refresh data di background |
| Share Target | 🔄 v2.0 | Share link toko langsung ke NIKAHKU |

### 6.2.4 Next.js 16 Specific Features yang Digunakan

| Feature | Penggunaan di NIKAHKU |
|---------|----------------------|
| **Turbopack (default)** | Dev server ~400% faster startup, production builds 2–5x faster |
| **Cache Components + `use cache`** | Dashboard widgets di-cache, instant navigation antar halaman |
| **React Compiler** | Auto-memoization semua komponen — zero manual `useMemo`/`useCallback` |
| **proxy.ts** | Pengganti middleware.ts — auth check, redirect logic, rate limiting |
| **View Transitions** | Smooth page transitions via `<Link transitionTypes={['slide']}>` |
| **Server Actions** | Form submissions (add vendor, update RSVP) tanpa API route terpisah |
| **React 19.2 Activity** | Background render planning board saat user di dashboard |
| **Partial Pre-Rendering (PPR)** | Static shell dashboard instant, dynamic widgets stream in |

### 6.3 Database Schema (Simplified ERD)

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   users       │     │   weddings       │     │   budgets       │
├──────────────┤     ├──────────────────┤     ├─────────────────┤
│ id (PK)      │──┐  │ id (PK)          │──┐  │ id (PK)         │
│ email        │  └─▶│ user_id (FK)     │  │  │ wedding_id (FK) │
│ name         │     │ partner_1_name   │  └─▶│ total_amount    │
│ avatar_url   │     │ partner_2_name   │     │ spent_amount    │
│ created_at   │     │ wedding_date     │     │ created_at      │
└──────────────┘     │ venue_city       │     └─────────────────┘
                     │ status           │
                     └──────────────────┘
                            │
           ┌────────────────┼────────────────┬──────────────────┐
           ▼                ▼                ▼                  ▼
┌──────────────────┐ ┌─────────────┐ ┌─────────────────┐ ┌──────────────┐
│   vendors        │ │   guests    │ │   seserahan     │ │   tasks      │
├──────────────────┤ ├─────────────┤ ├─────────────────┤ ├──────────────┤
│ id (PK)          │ │ id (PK)     │ │ id (PK)         │ │ id (PK)      │
│ wedding_id (FK)  │ │ wedding_id  │ │ wedding_id (FK) │ │ wedding_id   │
│ category_id (FK) │ │ name        │ │ item_name       │ │ title        │
│ name             │ │ phone       │ │ category        │ │ description  │
│ contact_phone    │ │ email       │ │ brand           │ │ start_date   │
│ contact_wa       │ │ category    │ │ price_min       │ │ due_date     │
│ email            │ │ pax_count   │ │ price_max       │ │ status       │
│ instagram        │ │ rsvp_status │ │ shop_url        │ │ priority     │
│ website          │ │ session_ids │ │ shop_platform   │ │ category     │
│ address          │ │ notes       │ │ purchase_status │ │ assignee     │
│ status           │ └─────────────┘ │ actual_price    │ │ board_view   │
│ rating           │                 │ purchase_date   │ └──────────────┘
│ notes            │                 │ notes           │
└──────────────────┘                 └─────────────────┘
        │
        ▼
┌──────────────────┐    ┌──────────────────┐
│ vendor_packages  │    │ vendor_categories│
├──────────────────┤    ├──────────────────┤
│ id (PK)          │    │ id (PK)          │
│ vendor_id (FK)   │    │ wedding_id (FK)  │
│ name             │    │ name             │
│ description      │    │ icon             │
│ price            │    │ is_default       │
│ notes            │    │ color            │
└──────────────────┘    └──────────────────┘

┌──────────────────┐    ┌──────────────────┐
│   expenses       │    │   sessions       │
├──────────────────┤    ├──────────────────┤
│ id (PK)          │    │ id (PK)          │
│ wedding_id (FK)  │    │ wedding_id (FK)  │
│ category         │    │ name             │
│ description      │    │ date             │
│ amount           │    │ time_start       │
│ date             │    │ time_end         │
│ vendor_id (FK)?  │    │ venue            │
│ notes            │    │ max_capacity     │
└──────────────────┘    └──────────────────┘
```

### 6.4 API Strategy: Supabase Client + Server Actions

> **Pendekatan Hybrid:**
> - **Supabase Client SDK** untuk CRUD operasi sederhana (langsung dari client via RLS)
> - **Next.js Server Actions** untuk business logic kompleks (booking flow, budget calculation)
> - **Route Handlers** hanya untuk webhook dan external integrations

```
-- Supabase RLS Policy Example (setiap user hanya akses wedding miliknya):
CREATE POLICY "Users can view own wedding data"
ON vendors FOR SELECT
USING (wedding_id IN (
  SELECT id FROM weddings WHERE user_id = auth.uid()
));

-- Supabase Realtime subscription (dashboard live update):
supabase.channel('dashboard')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'vendors' }, handleChange)
  .subscribe();
```

**Server Actions (app/actions/):**

```
Authentication:
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

Wedding:
POST   /api/weddings                    — Create wedding project
GET    /api/weddings/:id                — Get wedding detail
PUT    /api/weddings/:id                — Update wedding info
GET    /api/weddings/:id/dashboard      — Get dashboard summary

Budget:
GET    /api/weddings/:id/budget         — Get budget overview
PUT    /api/weddings/:id/budget         — Update total budget
GET    /api/weddings/:id/expenses       — List all expenses
POST   /api/weddings/:id/expenses       — Add expense
PUT    /api/weddings/:id/expenses/:eid  — Update expense
DELETE /api/weddings/:id/expenses/:eid  — Delete expense

Vendors:
GET    /api/weddings/:id/vendors                    — List vendors (filterable)
POST   /api/weddings/:id/vendors                    — Add vendor
GET    /api/weddings/:id/vendors/:vid               — Get vendor detail
PUT    /api/weddings/:id/vendors/:vid               — Update vendor
DELETE /api/weddings/:id/vendors/:vid               — Delete vendor
GET    /api/weddings/:id/vendors/compare?ids=1,2,3  — Compare vendors
PUT    /api/weddings/:id/vendors/:vid/status         — Update booking status

Vendor Packages:
GET    /api/vendors/:vid/packages       — List packages
POST   /api/vendors/:vid/packages       — Add package
PUT    /api/vendors/:vid/packages/:pid  — Update package
DELETE /api/vendors/:vid/packages/:pid  — Delete package

Vendor Categories:
GET    /api/weddings/:id/categories     — List categories
POST   /api/weddings/:id/categories     — Add custom category

Seserahan & Mahar:
GET    /api/weddings/:id/seserahan              — List all items
POST   /api/weddings/:id/seserahan              — Add item
PUT    /api/weddings/:id/seserahan/:sid         — Update item
DELETE /api/weddings/:id/seserahan/:sid         — Delete item
PUT    /api/weddings/:id/seserahan/:sid/status  — Update purchase status

Guests:
GET    /api/weddings/:id/guests                 — List guests (filterable)
POST   /api/weddings/:id/guests                 — Add guest
POST   /api/weddings/:id/guests/import          — Import CSV/Excel
PUT    /api/weddings/:id/guests/:gid            — Update guest
DELETE /api/weddings/:id/guests/:gid            — Delete guest
PUT    /api/weddings/:id/guests/:gid/rsvp       — Update RSVP
PUT    /api/weddings/:id/guests/bulk-rsvp       — Bulk update RSVP

Sessions:
GET    /api/weddings/:id/sessions       — List sessions
POST   /api/weddings/:id/sessions       — Add session
PUT    /api/weddings/:id/sessions/:sid  — Update session

Tasks (Planning):
GET    /api/weddings/:id/tasks                  — List tasks (filterable)
POST   /api/weddings/:id/tasks                  — Create task
PUT    /api/weddings/:id/tasks/:tid             — Update task
DELETE /api/weddings/:id/tasks/:tid             — Delete task
POST   /api/weddings/:id/tasks/from-template    — Generate from template
PUT    /api/weddings/:id/tasks/:tid/status      — Update task status
PUT    /api/weddings/:id/tasks/reorder          — Reorder tasks (Kanban)
```

---

## 7. Non-Functional Requirements

### 7.1 Performance

| Metric | Target |
|--------|--------|
| First Contentful Paint (FCP) | < 1.2 detik (Turbopack + PPR) |
| Largest Contentful Paint (LCP) | < 2.0 detik |
| Interaction to Next Paint (INP) | < 200ms (React Compiler auto-memo) |
| Time to Interactive (TTI) | < 2.5 detik |
| API Response Time (p95) | < 500ms (Supabase edge) |
| Dashboard Load (100+ vendor & 500+ tamu) | < 2 detik |
| Lighthouse Performance Score | ≥ 90 |
| Lighthouse PWA Score | ≥ 90 |
| PWA Install Prompt | Muncul < 3 detik setelah first visit |
| Offline Load Time (cached) | < 1 detik |
| Service Worker Activation | < 2 detik post-install |

### 7.2 Security

- Autentikasi: **Supabase Auth** — Email/password + Google OAuth 2.0 + Magic Link
- Otorisasi: **Row-Level Security (RLS)** via Supabase — user hanya bisa akses data wedding miliknya
- Session management: **@supabase/ssr** — secure httpOnly cookies, auto-refresh
- Request interception: **proxy.ts** (Next.js 16) — auth check sebelum route, redirect unauthenticated
- HTTPS everywhere (enforced via Vercel)
- Input validation & sanitization pada semua Server Actions
- Rate limiting: 100 req/menit per user via proxy.ts
- File upload: Supabase Storage policies, validasi tipe file (jpg, png, pdf), max 5MB
- PWA Security: Service Worker hanya di-serve via HTTPS, scope terbatas ke origin

### 7.3 Accessibility

- WCAG 2.1 Level AA compliance
- Keyboard navigable semua fitur
- Screen reader friendly (ARIA labels)
- Color contrast ratio ≥ 4.5:1
- Focus indicators visible
- Responsive: 320px – 2560px viewport

### 7.4 Scalability

- Target: 10.000 concurrent users (MVP → upgrade Supabase Pro jika perlu)
- Database: Supabase PostgreSQL connection pooling (Supavisor built-in)
- CDN: Static assets + PWA shell via Vercel Edge Network
- Image optimization: Next.js 16 `<Image>` component + Supabase Storage transforms
- Lazy loading untuk halaman Vendor Gallery
- PWA Precaching: App shell cached locally — instant repeat visits
- Supabase Free Tier cukup untuk: ~5.000 users, 500MB data, 200 realtime connections

### 7.5 Data & Privacy

- Compliance: UU PDP (Perlindungan Data Pribadi) Indonesia
- Data residency: Southeast Asia region (AWS ap-southeast-1 / Vercel SGP)
- User dapat menghapus semua data (Right to Delete)
- No data sharing ke third-party tanpa consent
- Backup: Daily automated backup (7-day retention)

---

## 8. UI/UX Design Direction

### 8.1 Design Philosophy

**Aesthetic Direction: "Elegant Warmth — Flat Edition"** — Perpaduan antara luxury wedding aesthetic dengan usability modern. Desain yang terasa personal, hangat, dan sophisticated. **Menggunakan flat design (tanpa shadow)** untuk performa optimal di mobile, mengandalkan border, spacing, dan color contrast sebagai visual hierarchy.

### 8.2 Visual Identity

```
Color Palette:
┌─────────────────────────────────────────────────┐
│  Primary:     #8B6F4E (Warm Gold)               │
│  Secondary:   #D4A574 (Soft Bronze)             │
│  Accent:      #C9917A (Rose Gold)               │
│  Background:  #FDFBF7 (Warm Ivory)              │
│  Surface:     #FFFFFF (White)                    │
│  Text:        #2C2418 (Deep Brown)              │
│  Muted:       #9C8E7E (Taupe)                   │
│  Success:     #5B8C5A (Sage Green)              │
│  Warning:     #D4A04E (Amber)                   │
│  Danger:      #C75C5C (Dusty Red)               │
│  Info:        #6B8DAE (Muted Blue)              │
└─────────────────────────────────────────────────┘

Typography:
┌─────────────────────────────────────────────────┐
│  Heading:  "Playfair Display" (Serif, Elegant)  │
│  Body:     "DM Sans" (Sans-serif, Clean)        │
│  Mono:     "JetBrains Mono" (Data/numbers)      │
└─────────────────────────────────────────────────┘

Border & Radius (Flat Design):
┌─────────────────────────────────────────────────┐
│  Cards:    border-radius: 16px                  │
│  Buttons:  border-radius: 12px                  │
│  Inputs:   border-radius: 10px                  │
│  Avatars:  border-radius: 50%                   │
│  Shadows:  NONE (flat design — no box-shadow)   │
│  Borders:  1px solid hsl(var(--border))         │
│  Hover:    background-color transition only     │
└─────────────────────────────────────────────────┘
```

### 8.3 Component Design Guidelines

**Dashboard Cards (Flat Design):**
- Setiap widget card memiliki border 1px `hsl(var(--border))` dengan **tanpa shadow**
- Header card menggunakan Playfair Display
- Data angka besar menggunakan JetBrains Mono
- Hover effect: background-color transition (bukan shadow grow)
- Visual separation via background color differentiation

**Tables (Mahar & Seserahan, Guest List):**
- Alternating row colors: #FDFBF7 dan #FFFFFF
- Sticky header
- Status badges dengan warna semantik (rounded pill shape)
- Link toko dengan ikon platform (Shopee: orange, Tokopedia: green)
- Inline editing support

**Vendor Cards (Flat Design):**
- Card-based layout (grid) dengan image thumbnail
- Kategori badge di corner
- Star rating display
- Status indicator (color-coded dot)
- Quick action buttons on hover
- Border 1px, **no shadow** — separation via spacing + background

**Planning Board (Flat Design):**
- Calendar: Clean monthly view, colored dots per kategori
- Gantt: Horizontal bars dengan color-coded categories, dependency arrows
- Kanban: 3-4 kolom, **flat cards with border** (no shadow), drag handle visible on hover

### 8.4 Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Single column, bottom nav, collapsible sidebar |
| Tablet | 640px – 1024px | Two-column, slide-out sidebar |
| Desktop | 1024px – 1440px | Sidebar + main content |
| Wide | > 1440px | Sidebar + main content (max-width: 1440px, centered) |

---

## 9. Risks & Mitigations

| # | Risk | Severity | Probability | Mitigation |
|---|------|----------|-------------|------------|
| R1 | Scope creep — fitur terus bertambah selama development | 🔴 High | 🟡 Medium | Strict MVP scope, fitur tambahan masuk backlog v1.1+ |
| R2 | Data loss — user kehilangan data pernikahan | 🔴 High | 🟢 Low | Daily backup, versioning, soft-delete semua data |
| R3 | Performance degradation dengan data besar | 🟡 Medium | 🟡 Medium | Pagination, virtual scrolling, indexed queries, caching |
| R4 | User adoption rendah — terlalu kompleks | 🟡 Medium | 🟡 Medium | Guided onboarding, default templates, progressive disclosure UI |
| R5 | Link toko (Shopee/Tokopedia) broken/berubah | 🟢 Low | 🟡 Medium | Validasi URL saat input, periodic link checker (background job) |
| R6 | Concurrent edit conflicts (multi-user) | 🟡 Medium | 🟢 Low | Optimistic locking, last-write-wins dengan conflict notification |
| R7 | Mobile UX kurang optimal untuk fitur kompleks (Gantt) | 🟡 Medium | 🟡 Medium | Simplified mobile view, progressive enhancement, Kanban as default mobile |

---

## 10. Phased Roadmap

### Phase 1: MVP (Minggu 1–8)

**Goal:** Core functionality, single-user, basic UI

| Minggu | Deliverables |
|--------|--------------|
| 1–2 | Project setup, auth, database schema, basic UI shell |
| 3–4 | Budget Manager + Vendor CRUD + Kategori |
| 5–6 | Mahar & Seserahan tabel + Guest List CRUD + RSVP |
| 7 | Planning Board (Kanban) + Dashboard |
| 8 | Testing, bug fixing, deployment, onboarding flow |

**MVP Scope:**
- ✅ Budget input & tracking
- ✅ Vendor CRUD + kategori + paket harga
- ✅ Vendor comparison (side-by-side)
- ✅ Vendor booking status
- ✅ Mahar & Seserahan tabel (dengan link Shopee/Tokopedia)
- ✅ Guest list + RSVP tracking
- ✅ Planning Board (Kanban only)
- ✅ Interactive Dashboard
- ✅ Responsive design (mobile + desktop)
- ✅ **PWA: Installable, offline app shell, background sync (Serwist)**
- ✅ **Shadcn/UI flat design (tanpa shadow) untuk performa mobile**
- ✅ **Supabase: Auth + Database + Storage + Realtime**

### Phase 2: v1.1 — Enhanced Planning (Minggu 9–12)

- Calendar View untuk Planning Board
- Gantt Chart View
- Default wedding checklist template (50+ tasks)
- Email reminder untuk deadline
- Guest import dari CSV/Excel
- Session/acara management untuk tamu
- Vendor image gallery

### Phase 3: v1.2 — Collaboration & Sharing (Minggu 13–16)

- Multi-user access (pasangan + WO + keluarga)
- Role-based permission (Admin, Editor, Viewer)
- Shareable read-only dashboard link
- Comment/notes pada setiap item
- Activity log / history

### Phase 4: v2.0 — Intelligence & Marketplace (Minggu 17–24)

- AI Budget Recommendation (berdasarkan kota & budget range)
- Vendor Marketplace (vendor bisa daftar dan tampilkan profil)
- Review & rating vendor oleh user lain
- Digital invitation (e-invitation) builder
- WhatsApp broadcast integration untuk undangan
- Seating arrangement planner
- Expense receipt scanning (OCR)
- Export report ke PDF

---

## 11. Expansion Features (Future)

Berikut fitur-fitur yang dapat di-ekspansi setelah v2.0:

### 11.1 Communication & Collaboration
- **WhatsApp Integration**: Kirim undangan digital via WhatsApp API
- **In-App Chat**: Chat langsung dengan vendor
- **Family Portal**: Portal read-only untuk keluarga melihat progress
- **Real-Time Collaboration**: Multi-cursor editing ala Google Docs

### 11.2 Intelligence & Automation
- **AI Vendor Recommendation**: Saran vendor berdasarkan budget, lokasi, dan preference
- **Smart Budget Allocator**: Auto-suggest pembagian budget per kategori berdasarkan data historis
- **Price Alert**: Notifikasi saat harga item seserahan turun di marketplace
- **Auto Checklist Generator**: Generate checklist berdasarkan tipe pernikahan (adat Jawa, Sunda, Minang, dll.)
- **Expense Prediction**: Prediksi total biaya berdasarkan trend pembelian

### 11.3 Content & Design
- **Digital Invitation Builder**: Drag-drop builder untuk e-invitation
- **Wedding Website Generator**: Microsite pernikahan (info, galeri, RSVP form)
- **Seating Arrangement**: Visual floor plan dengan drag-drop tamu ke meja
- **Mood Board**: Koleksi inspirasi visual (Pinterest-like)
- **Photo Gallery**: Upload foto prewedding, engagement, dll.

### 11.4 Operations & Logistics
- **Vendor Contract Management**: Upload dan track kontrak vendor
- **Payment Schedule Automation**: Auto-reminder jadwal pembayaran DP/pelunasan
- **Rundown Generator**: Timeline detail hari-H (menit per menit)
- **Weather Forecast Integration**: Prakiraan cuaca untuk tanggal pernikahan
- **Transportation Planner**: Rute dan jadwal kendaraan pengantin & tamu

### 11.5 Post-Wedding
- **Thank You Card Tracker**: Track pengiriman kartu terima kasih
- **Gift Registry & Tracking**: Catat hadiah yang diterima
- **Vendor Review System**: Review vendor setelah acara
- **Memory Book Generator**: Auto-generate album digital dari foto pernikahan
- **Budget Final Report**: Laporan akhir budget vs aktual (exportable PDF)

### 11.6 Business Model Expansion
- **Vendor Marketplace**: Platform listing vendor pernikahan
- **Premium Templates**: Template undangan & checklist premium (paid)
- **WO Dashboard**: Multi-project management untuk Wedding Organizer
- **Affiliate Revenue**: Komisi dari link toko (Shopee/Tokopedia affiliate)
- **Sponsorship Integration**: Vendor bisa "boost" listing mereka

---

## 12. Out of Scope (v1.0)

Berikut item yang secara eksplisit **TIDAK** termasuk dalam scope MVP:

- ❌ Vendor marketplace / vendor bisa mendaftar sendiri
- ❌ AI-powered recommendations
- ❌ Digital invitation builder
- ❌ WhatsApp API integration
- ❌ Wedding website generator
- ❌ Seating arrangement planner
- ❌ Multi-language support (hanya Bahasa Indonesia untuk MVP)
- ~~❌ Native mobile app (iOS/Android)~~ → ✅ **Diganti PWA (installable via browser)**
- ❌ Payment gateway integration (pembayaran tetap di luar platform)
- ❌ Vendor review/rating oleh publik
- ~~❌ Offline mode / PWA~~ → ✅ **PWA dengan Serwist sudah termasuk MVP**
- ❌ OCR receipt scanning
- ❌ Multi-wedding support per user
- ❌ Push notifications (masuk v1.1)

---

## 13. Success Metrics & KPIs

### 13.1 Product Metrics

| Metric | Target (3 bulan post-launch) | Tool |
|--------|------|------|
| Monthly Active Users (MAU) | 1.000+ | Mixpanel / PostHog |
| Weekly Active Users (WAU) | 500+ | Mixpanel / PostHog |
| Avg. Session Duration | > 5 menit | Mixpanel / PostHog |
| Feature Adoption Rate (setiap modul) | > 40% user pakai ≥ 3 modul | Event tracking |
| Onboarding Completion Rate | > 75% | Funnel analytics |
| Churn Rate (30-day) | < 40% | Cohort analysis |

### 13.2 Engineering Metrics

| Metric | Target |
|--------|--------|
| Uptime | 99.5% |
| Error Rate (5xx) | < 0.5% |
| API Latency (p95) | < 500ms (Supabase) |
| Deploy Frequency | ≥ 2x per minggu |
| Test Coverage | > 70% |
| Lighthouse Score (all categories) | > 85 |
| Lighthouse PWA Score | > 90 |
| PWA Install Rate | > 20% dari MAU |
| Offline Usage Sessions | Tracked via analytics |
| Service Worker Cache Hit Rate | > 80% untuk static assets |

### 13.3 Business Metrics (v2.0+)

| Metric | Target |
|--------|--------|
| User Acquisition Cost (CAC) | < Rp 25.000 per user |
| Net Promoter Score (NPS) | > 40 |
| Premium Conversion Rate | > 5% (jika ada tier berbayar) |
| Vendor Onboarding (marketplace) | 100+ vendor dalam 6 bulan |

---

## 14. Appendix

### 14.1 Glossary

| Term | Definisi |
|------|---------|
| **Mahar** | Pemberian wajib dari mempelai pria kepada mempelai wanita dalam pernikahan Islam |
| **Seserahan** | Barang-barang bawaan/hadiah dari pihak pria untuk pihak wanita (tradisi Indonesia) |
| **RSVP** | Répondez s'il vous plaît — konfirmasi kehadiran tamu |
| **DP** | Down Payment — uang muka pembayaran vendor |
| **WO** | Wedding Organizer |
| **Rundown** | Susunan acara dengan detail waktu |
| **Venue** | Tempat/gedung penyelenggaraan pernikahan |

### 14.2 Reference: Typical Indonesian Wedding Budget Breakdown

| Kategori | Persentase Budget |
|----------|------------------|
| Venue / Gedung | 25–35% |
| Catering | 20–30% |
| Dekorasi | 10–15% |
| Attire & Make Up | 8–12% |
| Photo & Video | 5–10% |
| Entertainment / MC | 3–5% |
| Undangan / Percetakan | 2–4% |
| Souvenir | 2–5% |
| Seserahan & Mahar | 3–5% |
| Lain-lain (buffer) | 5–10% |

### 14.3 Competitive Landscape

| Platform | Strengths | Weaknesses | NIKAHKU Differentiator |
|----------|-----------|------------|----------------------|
| Bridestory | Vendor marketplace besar | Fokus marketplace, bukan planning tool | Integrated planning + budget + vendor dalam satu platform |
| WedingKu | Konten inspirasi + vendor | UX outdated, tidak ada budget tool | Modern UX, budget tracking real-time |
| Google Sheets | Fleksibel, gratis | Tidak terintegrasi, manual semua | Automasi, visual dashboard, template Indonesia |
| Notion | Template wedding planner | Learning curve tinggi, tidak purpose-built | Purpose-built, zero learning curve, **PWA installable** |
| The Knot (US) | Fitur lengkap | Tidak relevan untuk pasar Indonesia | Lokalisasi Indonesia: seserahan, mahar, adat, vendor lokal |

**Key Competitive Advantages with Updated Tech Stack:**
- **PWA Installable** — Tidak ada kompetitor lokal yang menawarkan PWA, user bisa "install" tanpa Play Store
- **Offline Access** — Akses data cached tanpa internet (penting di area sinyal lemah saat survey venue)
- **Gratis Infrastructure** — Supabase free tier cukup untuk ribuan user, menekan burn rate
- **Mobile-First Flat Design** — Performa optimal di Android mid-range (mayoritas user Indonesia)
- **Next.js 16.2 + Turbopack** — Fastest possible load times dengan PPR + Cache Components

---

> **Document End**
>
> **PRD Version:** 1.1.0 — Updated with Next.js 16.2, Supabase, Shadcn Flat, Serwist PWA
> Prepared by: Product Team — NIKAHKU
> Review requested from: Engineering Lead, Design Lead, Business Stakeholder
> Next step: Stakeholder review meeting → Technical Architecture Design → Sprint Planning
