# Feature PRD: Budget Management

> **Epic:** NIKAHKU — Wedding Planner Platform
> **Feature:** Budget Manager Module
> **Version:** 1.0
> **Status:** Draft

---

## 1. Feature Name

**Budget Manager** — Modul pengelolaan dan tracking budget pernikahan secara real-time.

## 2. Epic

- Parent: [NIKAHKU PRD](../PRD.md)

## 3. Goal

**Problem:** Pasangan sering kehilangan kontrol atas pengeluaran pernikahan karena tracking manual di spreadsheet yang tidak terintegrasi dengan data vendor dan pembelian seserahan. Akibatnya, 60%+ pasangan mengalami over-budget.

**Solution:** Modul Budget Manager yang secara otomatis mengagregasi semua pengeluaran dari vendor booking, pembelian mahar/seserahan, dan expense tambahan ke dalam satu dashboard budget yang real-time.

**Impact:**
- Mengurangi kejadian over-budget sebesar 50%
- User menghabiskan 70% lebih sedikit waktu untuk kalkulasi manual
- Meningkatkan confidence pasangan dalam pengelolaan keuangan pernikahan

## 4. User Personas

- **Primary:** Calon Pengantin (Rina & Adi) — pasangan yang merencanakan pernikahan sendiri
- **Secondary:** Wedding Organizer (Kak Dian) — membantu klien manage budget

## 5. User Stories

**US-B1:** Sebagai calon pengantin, saya ingin menginput total budget pernikahan agar saya memiliki batas atas pengeluaran yang jelas.

**US-B2:** Sebagai calon pengantin, saya ingin melihat sisa budget secara real-time setelah setiap pengeluaran agar saya tahu kapasitas tersisa.

**US-B3:** Sebagai calon pengantin, saya ingin mengalokasikan budget per kategori vendor agar distribusi pengeluaran terkontrol.

**US-B4:** Sebagai calon pengantin, saya ingin mencatat pengeluaran tambahan (di luar vendor) agar semua biaya ter-record.

**US-B5:** Sebagai calon pengantin, saya ingin melihat grafik perbandingan budget vs aktual per kategori agar mudah identifikasi kategori yang over-budget.

**US-B6:** Sebagai calon pengantin, saya ingin mendapat peringatan jika pengeluaran mendekati atau melebihi budget agar saya bisa segera adjust.

## 6. Requirements

### Functional Requirements

- User dapat menginput total budget dalam IDR (min: Rp 1.000.000, max: Rp 10.000.000.000)
- Sistem menampilkan: Total Budget, Total Terpakai, Sisa Budget, Persentase Terpakai
- User dapat mengalokasikan budget per kategori vendor (opsional) dengan total alokasi ≤ total budget
- Budget "Terpakai" otomatis teragregasi dari: Vendor booking (status ≥ Booked), Pembelian seserahan (status = Sudah Dibeli, ambil harga aktual), Pengeluaran tambahan manual
- Form pengeluaran tambahan: Nama, Kategori, Jumlah (IDR), Tanggal, Vendor terkait (opsional), Catatan
- Visualisasi: Donut chart distribusi budget per kategori, Bar chart budget vs actual per kategori, Line chart trend pengeluaran over time, Summary cards dengan angka besar
- Alert system: Warning (kuning) saat pengeluaran ≥ 80% budget, Danger (merah) saat pengeluaran ≥ 90% budget, Critical banner saat over-budget (> 100%)
- History log semua transaksi (penambahan, perubahan, penghapusan)
- Export budget report ke PDF/CSV

### Non-Functional Requirements

- Kalkulasi budget update dalam < 500ms setelah perubahan data
- Angka currency diformat dengan pemisah ribuan Indonesia (titik) — e.g., Rp 50.000.000
- Presisi: Tidak ada pembulatan, semua kalkulasi exact
- Aksesibilitas: Chart harus punya text alternative / data table fallback
- Mobile: Semua fitur accessible di viewport 320px+

## 7. Acceptance Criteria

### US-B1: Input Total Budget
- **Given** user baru membuat project pernikahan
- **When** user mengisi form budget dengan angka "150000000"
- **Then** sistem menyimpan Rp 150.000.000 sebagai total budget dan menampilkannya di dashboard

### US-B2: Real-time Budget Tracking
- **Given** total budget Rp 150.000.000 dan vendor catering di-booking Rp 30.000.000
- **When** user membuka halaman budget
- **Then** sistem menampilkan: Total Rp 150.000.000 | Terpakai Rp 30.000.000 | Sisa Rp 120.000.000 | 20%

### US-B3: Alokasi per Kategori
- **Given** user memiliki budget Rp 150.000.000
- **When** user set alokasi Catering = Rp 40.000.000, Venue = Rp 50.000.000
- **Then** sistem menampilkan alokasi per kategori dan warning jika total alokasi > total budget

### US-B5: Chart Budget vs Actual
- **Given** user memiliki data booking vendor di beberapa kategori
- **When** user membuka tab "Budget vs Actual"
- **Then** bar chart menampilkan setiap kategori dengan 2 bar (alokasi vs aktual) dan highlight merah jika aktual > alokasi

### US-B6: Alert System
- **Given** total budget Rp 100.000.000 dan total terpakai Rp 85.000.000 (85%)
- **When** dashboard dimuat
- **Then** banner warning kuning muncul: "Pengeluaran sudah mencapai 85% dari total budget"

## 8. Out of Scope

- Integrasi dengan bank/payment gateway
- Multi-currency support (hanya IDR)
- Fitur split payment antar keluarga
- AI budget recommendation
- OCR scanning struk/receipt
