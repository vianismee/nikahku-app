# Feature PRD: Planning Board

> **Epic:** NIKAHKU — Wedding Planner Platform
> **Feature:** Planning Board (Calendar, Gantt Chart, Kanban)
> **Version:** 1.0
> **Status:** Draft

---

## 1. Feature Name

**Planning Board** — Modul perencanaan dan tracking timeline persiapan pernikahan dengan tiga mode tampilan: Calendar, Gantt Chart, dan Kanban Board.

## 2. Epic

- Parent: [NIKAHKU PRD](../PRD.md)

## 3. Goal

**Problem:** Persiapan pernikahan melibatkan 50–100+ task selama 3–12 bulan. Tanpa tools yang tepat, pasangan lupa deadline, tidak tahu prioritas, dan kesulitan melihat big picture timeline.

**Solution:** Planning board multi-view (Calendar, Gantt, Kanban) dengan template checklist pernikahan Indonesia, deadline reminder, dan auto-sync dari data vendor booking.

**Impact:**
- Zero missed deadlines dengan reminder system
- Visibilitas progress 100% melalui 3 mode view
- Waktu planning berkurang 50% dengan default template

## 4. User Personas

- **Primary:** Calon Pengantin — merencanakan dan tracking progress
- **Secondary:** Wedding Organizer — manage timeline untuk klien

## 5. User Stories

**US-P1:** Sebagai calon pengantin, saya ingin melihat seluruh task persiapan pernikahan dalam tampilan Kanban agar mudah melihat status setiap task.

**US-P2:** Sebagai calon pengantin, saya ingin melihat timeline persiapan dalam Gantt Chart agar tahu durasi dan overlap antar task.

**US-P3:** Sebagai calon pengantin, saya ingin melihat jadwal persiapan dalam Calendar View agar tahu apa yang harus dikerjakan di tanggal tertentu.

**US-P4:** Sebagai calon pengantin, saya ingin menggunakan template checklist pernikahan agar tidak mulai dari nol.

**US-P5:** Sebagai calon pengantin, saya ingin mendapat reminder untuk task yang deadline-nya mendekat.

**US-P6:** Sebagai calon pengantin, saya ingin task pembayaran vendor otomatis muncul di planning board saat vendor di-booking.

## 6. Requirements

### Functional Requirements

**Task Data — Fields:**
- Judul (text, required)
- Deskripsi (rich text, optional)
- Kategori (select: Budget, Vendor, Seserahan, Undangan, Dekorasi, Attire, Dokumen, Lainnya)
- Tanggal Mulai (date, optional)
- Deadline (date, required)
- Priority (enum: Urgent, High, Medium, Low)
- Status (enum: To Do, In Progress, Done, Cancelled)
- Assignee (text: Pria / Wanita / Bersama / WO / Keluarga)
- Tags (multi-select, user-defined)
- Linked Vendor (FK, optional — auto-linked saat vendor di-booking)
- Catatan (text)

**Kanban Board View:**
- Kolom default: To Do | In Progress | Done
- User bisa tambah kolom custom (e.g., "Waiting for Vendor", "Need Review")
- Drag-and-drop card antar kolom → auto-update status
- Card menampilkan: Judul, Deadline, Priority badge, Kategori badge, Assignee avatar
- Overdue cards: border merah + "Overdue X hari"
- Quick add: input field di setiap kolom header
- Filter: by Kategori, Priority, Assignee
- Sort within column: by Deadline, Priority

**Gantt Chart View:**
- Timeline horizontal: scroll kiri-kanan per bulan
- Setiap task = 1 bar horizontal (dari start date ke deadline)
- Bar color-coded by kategori
- Milestone markers (diamond shape) untuk tanggal penting (e.g., Hari-H)
- Zoom levels: Bulan, Minggu
- Hari ini ditandai garis vertikal merah
- Hover tooltip: detail task
- Click bar → open task detail
- Drag bar edges → adjust dates

**Calendar View:**
- Month view (default) + Week view
- Task ditampilkan sebagai event dot / chip pada tanggal deadline
- Color-coded by kategori
- Click tanggal → list semua task pada tanggal tersebut
- Click task → open task detail
- Drag task antar tanggal → update deadline
- Hari ini di-highlight
- Hari-H pernikahan di-highlight spesial (ikon ring)

**Template Checklist:**
- Template default: "Persiapan Pernikahan Indonesia" berisi 60+ task, terbagi per periode:
  - 12 bulan sebelum: Tentukan tanggal, Budget planning, Survey venue, dll.
  - 9 bulan: Booking venue, Pilih WO, Engagement/lamaran
  - 6 bulan: Booking catering, Pilih fotografer, Fitting baju
  - 3 bulan: Cetak undangan, Booking entertainment, Seserahan shopping
  - 1 bulan: Kirim undangan, Rehearsal, Final fitting
  - 1 minggu: Confirm semua vendor, Briefing crew, Manicure/pedicure
  - H-1: Setup venue, Rehearsal dinner
  - Hari-H: Auto-generated rundown placeholder
- User klik "Gunakan Template" → semua task ter-generate dengan deadline relatif terhadap tanggal pernikahan
- User bisa edit/hapus/tambah task setelah generate

**Auto-Sync dari Vendor Booking:**
- Saat vendor di-booking, auto-create task: "Pelunasan [Nama Vendor]" dengan deadline = tanggal pelunasan
- Saat vendor status = "Paid (Full)", task auto-mark "Done"
- Task linked → klik "Lihat Vendor" navigasi ke vendor detail

**Reminder System:**
- In-app notification badge pada menu Planning Board
- Pop-up reminder saat login jika ada task overdue
- Summary: "X task overdue, Y task deadline minggu ini"
- Opsional: Email digest mingguan (opt-in)

**View Switching:**
- Toggle button: [Kanban] [Gantt] [Calendar]
- Data konsisten di semua view (single source of truth)
- Perubahan di satu view langsung refleksi di view lain
- Last active view tersimpan per user

### Non-Functional Requirements

- Kanban drag-drop response < 200ms
- Gantt chart render < 2 detik untuk 100 tasks
- Calendar load < 1 detik per bulan
- Optimistic UI: status update instant, sync background
- Mobile: Kanban default (paling mobile-friendly), Calendar tersedia, Gantt hidden (terlalu kompleks untuk mobile)
- Keyboard shortcuts: N = new task, E = edit, D = done, Arrow keys = navigate

## 7. Acceptance Criteria

### US-P1: Kanban Board
- **Given** user memiliki 20 tasks dengan berbagai status
- **When** user membuka Planning Board
- **Then** Kanban board menampilkan cards terdistribusi di kolom sesuai status
- **And** user bisa drag card dari "To Do" ke "In Progress" dan status otomatis update

### US-P2: Gantt Chart
- **Given** user memiliki tasks dengan start date dan deadline
- **When** user switch ke Gantt view
- **Then** horizontal timeline menampilkan bars per task, color-coded by kategori, dengan garis merah hari ini

### US-P4: Template Checklist
- **Given** user baru membuat project dengan tanggal pernikahan 1 Januari 2027
- **When** user klik "Gunakan Template Checklist"
- **Then** 60+ tasks ter-generate dengan deadline dihitung mundur dari 1 Jan 2027 (e.g., "Survey Venue" deadline = 1 Jan 2026)

### US-P6: Auto-Sync Vendor
- **Given** user mengubah vendor "Studio XYZ" ke status "Booked" dengan pelunasan 15 Nov 2026
- **When** user membuka Planning Board
- **Then** task "Pelunasan Studio XYZ" otomatis ada dengan deadline 15 Nov 2026

## 8. Out of Scope

- Gantt chart dependencies (task A must finish before task B)
- Resource allocation / workload balancing
- Time tracking per task
- Collaboration: multiple users editing simultaneously
- Mobile app push notifications (hanya in-app dan email)
- Recurring tasks
- Integration dengan Google Calendar / Apple Calendar
