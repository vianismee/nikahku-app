# 🏗️ Implementation Plan
# **NIKAHKU — Wedding Planner Platform**

> **Version:** 1.0.0
> **Based on:** PRD v1.1.0
> **Created:** 25 Maret 2026
> **Tech Stack:** Next.js 16.2 · Supabase · Shadcn/UI (Flat) · Serwist PWA
> **Estimated Duration:** 16 minggu (4 bulan) — MVP + v1.1
> **Team Size Recommendation:** 2–3 Full-Stack Developers

---

## Daftar Isi

1. [Overview & Strategy](#1-overview--strategy)
2. [Project Setup & Foundation (Minggu 1)](#2-project-setup--foundation-minggu-1)
3. [Phase 1: Core Foundation (Minggu 1–2)](#3-phase-1-core-foundation-minggu-12)
4. [Phase 2: Budget & Vendor (Minggu 3–5)](#4-phase-2-budget--vendor-minggu-35)
5. [Phase 3: Mahar, Seserahan & Guest (Minggu 5–7)](#5-phase-3-mahar-seserahan--guest-minggu-57)
6. [Phase 4: Planning Board (Minggu 7–9)](#6-phase-4-planning-board-minggu-79)
7. [Phase 5: Dashboard & PWA (Minggu 9–11)](#7-phase-5-dashboard--pwa-minggu-911)
8. [Phase 6: Polish, Testing & Launch (Minggu 11–12)](#8-phase-6-polish-testing--launch-minggu-1112)
9. [Phase 7: v1.1 — Enhanced (Minggu 13–16)](#9-phase-7-v11--enhanced-minggu-1316)
10. [Database Schema & Migrations](#10-database-schema--migrations)
11. [File & Folder Structure](#11-file--folder-structure)
12. [Dependency List](#12-dependency-list)
13. [Testing Strategy](#13-testing-strategy)
14. [DevOps & CI/CD](#14-devops--cicd)
15. [Risk Register & Contingency](#15-risk-register--contingency)

---

## 1. Overview & Strategy

### 1.1 Implementation Approach

```
Strategi: VERTICAL SLICING + ITERATIVE DELIVERY
═══════════════════════════════════════════════

Setiap minggu menghasilkan fitur yang bisa di-demo dan di-test.
Bukan horizontal layering (semua backend dulu → semua frontend).

Minggu 1-2:   [Foundation] Auth + DB + Layout Shell + PWA Base
Minggu 3-5:   [Budget + Vendor] Full stack per fitur
Minggu 5-7:   [Mahar + Guest] Full stack per fitur
Minggu 7-9:   [Planning Board] Kanban → Calendar → Gantt
Minggu 9-11:  [Dashboard + PWA] Integration + offline
Minggu 11-12: [Polish] Testing, bug fix, performance, launch
Minggu 13-16: [v1.1] Calendar, Gantt, Reminders, Import
```

### 1.2 Sprint Structure

| Sprint | Durasi | Ceremony |
|--------|--------|----------|
| Sprint Length | 1 minggu | Monday start |
| Daily Standup | 15 menit | Async (Slack/Discord) atau sync |
| Sprint Planning | 1 jam | Setiap Senin pagi |
| Sprint Review | 30 menit | Setiap Jumat sore (demo) |
| Retrospective | 30 menit | Setiap 2 minggu (biweekly) |

### 1.3 Definition of Done (DoD)

Setiap task dianggap "Done" jika:
- [ ] Code sudah di-push ke branch feature
- [ ] Lulus code review (minimal 1 reviewer)
- [ ] Unit test coverage ≥ 70% untuk logic baru
- [ ] TypeScript strict mode — zero `any` type
- [ ] Responsive di 3 breakpoint: Mobile (375px), Tablet (768px), Desktop (1280px)
- [ ] Shadcn/UI flat mode — zero box-shadow di komponen baru
- [ ] Supabase RLS policy aktif untuk tabel baru
- [ ] Tidak ada console.log/error di production build
- [ ] Lighthouse Performance ≥ 85 pada halaman terkait
- [ ] PR merged ke `develop` branch

---

## 2. Project Setup & Foundation (Minggu 1)

### Task 2.1: Repository & Project Init

```
Estimated: 4 jam
Priority: CRITICAL — blocker untuk semua task lain
```

**Subtasks:**

- [ ] **2.1.1** Create GitHub repository `nikahku-app` (private)
- [ ] **2.1.2** Init Next.js 16.2 project:
  ```bash
  npx create-next-app@latest nikahku-app --yes
  # Default: TypeScript, Tailwind, ESLint, App Router, Turbopack, @/* alias
  ```
- [ ] **2.1.3** Setup branch strategy:
  ```
  main          — production (auto-deploy Vercel)
  develop       — staging (preview deploy)
  feature/*     — feature branches
  fix/*         — bugfix branches
  ```
- [ ] **2.1.4** Create `.env.local` template:
  ```env
  # Supabase
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  
  # App
  NEXT_PUBLIC_APP_URL=http://localhost:3000
  NEXT_PUBLIC_APP_NAME=NIKAHKU
  
  # Email (Resend)
  RESEND_API_KEY=
  
  # PWA VAPID Keys
  NEXT_PUBLIC_VAPID_PUBLIC_KEY=
  VAPID_PRIVATE_KEY=
  ```
- [ ] **2.1.5** Setup `.gitignore`, `.nvmrc` (Node 20 LTS), `AGENTS.md`

### Task 2.2: Supabase Project Setup

```
Estimated: 3 jam
Priority: CRITICAL
```

- [ ] **2.2.1** Create Supabase project (free tier, region: Southeast Asia — Singapore)
- [ ] **2.2.2** Enable Auth providers: Email/Password + Google OAuth
- [ ] **2.2.3** Create Storage buckets:
  - `vendor-images` (public, 5MB max per file, jpg/png/webp only)
  - `receipts` (private, 5MB max, jpg/png/pdf)
  - `avatars` (public, 2MB max, jpg/png/webp)
- [ ] **2.2.4** Run initial database migration (lihat [Section 10](#10-database-schema--migrations))
- [ ] **2.2.5** Setup RLS policies dasar (lihat Section 10)
- [ ] **2.2.6** Install Supabase packages:
  ```bash
  npm install @supabase/supabase-js @supabase/ssr
  ```
- [ ] **2.2.7** Create Supabase client utilities:
  - `lib/supabase/client.ts` — Browser client
  - `lib/supabase/server.ts` — Server Component client
  - `lib/supabase/middleware.ts` — For proxy.ts auth refresh
- [ ] **2.2.8** Generate TypeScript types dari Supabase schema:
  ```bash
  npx supabase gen types typescript --project-id <id> > lib/supabase/database.types.ts
  ```

### Task 2.3: Shadcn/UI Setup (Flat Mode)

```
Estimated: 3 jam
Priority: HIGH
```

- [ ] **2.3.1** Init Shadcn/UI:
  ```bash
  npx shadcn@latest init
  ```
- [ ] **2.3.2** Install base components:
  ```bash
  npx shadcn@latest add button card input label select textarea badge
  npx shadcn@latest add table tabs dialog sheet popover dropdown-menu
  npx shadcn@latest add toast progress avatar separator skeleton
  npx shadcn@latest add form checkbox radio-group switch tooltip
  ```
- [ ] **2.3.3** Override `globals.css` — remove ALL shadows:
  ```css
  @layer base {
    :root {
      --radius: 0.75rem;
      /* NIKAHKU Color Palette */
      --background: 40 33% 98%;      /* #FDFBF7 Warm Ivory */
      --foreground: 30 27% 12%;      /* #2C2418 Deep Brown */
      --primary: 30 29% 43%;         /* #8B6F4E Warm Gold */
      --primary-foreground: 40 33% 98%;
      --secondary: 25 40% 64%;       /* #D4A574 Soft Bronze */
      --accent: 15 35% 63%;          /* #C9917A Rose Gold */
      --muted: 25 10% 55%;           /* #9C8E7E Taupe */
      --destructive: 0 35% 57%;      /* #C75C5C Dusty Red */
      --border: 30 15% 85%;          /* Subtle warm border */
      --ring: 30 29% 43%;            /* Same as primary */
    }
    
    /* FLAT MODE: Kill all shadows globally */
    * { --tw-shadow: none !important; --tw-ring-shadow: none !important; }
  }
  ```
- [ ] **2.3.4** Create `components/ui/overrides.css` — flat card, button, input styles
- [ ] **2.3.5** Setup Google Fonts: Playfair Display (headings) + DM Sans (body) + JetBrains Mono (numbers)
- [ ] **2.3.6** Create Tailwind theme extension di `tailwind.config.ts`

### Task 2.4: Auth Flow

```
Estimated: 6 jam
Priority: CRITICAL
```

- [ ] **2.4.1** Create `proxy.ts` (pengganti middleware.ts):
  ```typescript
  // proxy.ts
  import { type NextRequest, NextResponse } from "next/server";
  import { createServerClient } from "@supabase/ssr";

  export default async function proxy(request: NextRequest) {
    const response = NextResponse.next();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { /* cookie handlers */ } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    
    const publicRoutes = ["/", "/login", "/register", "/offline"];
    if (!user && !publicRoutes.includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return response;
  }
  ```
- [ ] **2.4.2** Pages:
  - `app/(auth)/login/page.tsx` — Email/password + Google OAuth + Magic Link
  - `app/(auth)/register/page.tsx` — Registration form
  - `app/(auth)/callback/route.ts` — OAuth callback handler
- [ ] **2.4.3** Onboarding flow:
  - `app/(auth)/onboarding/page.tsx` — Input wedding date, partner names, city
  - `app/(auth)/onboarding/budget/page.tsx` — Set initial budget
  - `app/(auth)/onboarding/template/page.tsx` — Choose checklist template
- [ ] **2.4.4** Auth context: `providers/auth-provider.tsx`
- [ ] **2.4.5** Protected layout: `app/(dashboard)/layout.tsx` with auth guard
- [ ] **2.4.6** Logout action: Server Action `app/actions/auth.ts`

### Task 2.5: App Shell & Layout

```
Estimated: 8 jam
Priority: HIGH
```

- [ ] **2.5.1** Root layout `app/layout.tsx`:
  - Meta tags, viewport, theme-color
  - Font loading (Playfair Display, DM Sans, JetBrains Mono)
  - Toast provider, Auth provider, QueryClientProvider
- [ ] **2.5.2** Dashboard layout `app/(dashboard)/layout.tsx`:
  - Desktop: Sidebar (fixed 240px) + Main content
  - Mobile: Bottom navigation bar (5 icons) + collapsible hamburger menu
- [ ] **2.5.3** Sidebar component `components/layout/sidebar.tsx`:
  - Navigation items: Dashboard, Budget, Vendor, Mahar, Guest, Planning
  - Active state indicator
  - Wedding countdown mini-widget
  - User avatar + logout
- [ ] **2.5.4** Mobile bottom nav `components/layout/mobile-nav.tsx`:
  - 5 tabs: Dashboard, Vendor, Mahar, Guest, Plan
  - Active indicator (dot/line)
  - Smooth tab transitions
- [ ] **2.5.5** Header component `components/layout/header.tsx`:
  - Breadcrumb
  - Quick action button (+)
  - Notification bell (badge count)
  - User avatar dropdown
- [ ] **2.5.6** Loading states:
  - `app/(dashboard)/loading.tsx` — Full page skeleton
  - Per-section skeleton components

### Task 2.6: Serwist PWA Base Setup

```
Estimated: 4 jam
Priority: HIGH
```

- [ ] **2.6.1** Install Serwist:
  ```bash
  npm install @serwist/next @serwist/precaching @serwist/sw
  ```
- [ ] **2.6.2** Configure `next.config.ts`:
  ```typescript
  import withSerwistInit from "@serwist/next";
  const withSerwist = withSerwistInit({
    swSrc: "src/sw.ts",
    swDest: "public/sw.js",
    disable: process.env.NODE_ENV === "development",
  });
  export default withSerwist({ reactCompiler: true });
  ```
- [ ] **2.6.3** Create Service Worker `src/sw.ts`:
  - Precache entries (app shell)
  - Runtime caching rules (StaleWhileRevalidate for API, CacheFirst for images)
  - Offline fallback route
- [ ] **2.6.4** Create `app/manifest.ts`:
  - name, short_name, icons (192, 512, maskable), theme_color, display: standalone
- [ ] **2.6.5** Generate PWA icons (192x192, 512x512, maskable) → `public/icons/`
- [ ] **2.6.6** Create offline fallback page `app/offline/page.tsx`
- [ ] **2.6.7** Add PWA meta tags to root layout:
  ```tsx
  <meta name="application-name" content="NIKAHKU" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="theme-color" content="#8B6F4E" />
  ```
- [ ] **2.6.8** Create install prompt component `components/pwa/install-banner.tsx`

---

## 3. Phase 1: Core Foundation (Minggu 1–2)

> **Goal:** Auth berfungsi, layout responsive, PWA installable, database ready.

### Sprint 1 Deliverables (Minggu 1)

| # | Task | Estimasi | Assignee | Status |
|---|------|----------|----------|--------|
| 2.1 | Repository & Project Init | 4 jam | Dev 1 | ⬜ |
| 2.2 | Supabase Project Setup | 3 jam | Dev 1 | ⬜ |
| 2.3 | Shadcn/UI Flat Mode Setup | 3 jam | Dev 2 | ⬜ |
| 2.4 | Auth Flow (Login, Register, Onboarding) | 6 jam | Dev 1 | ⬜ |
| 2.5 | App Shell & Layout | 8 jam | Dev 2 | ⬜ |
| 2.6 | Serwist PWA Base Setup | 4 jam | Dev 1 | ⬜ |

**Sprint 1 Demo:** Login → Onboarding → Empty Dashboard (responsive) → PWA installable

### Sprint 2 Deliverables (Minggu 2)

| # | Task | Estimasi | Assignee | Status |
|---|------|----------|----------|--------|
| 3.1 | Shared components library | 6 jam | Dev 2 | ⬜ |
| 3.2 | Database full migration (semua tabel) | 4 jam | Dev 1 | ⬜ |
| 3.3 | RLS policies semua tabel | 3 jam | Dev 1 | ⬜ |
| 3.4 | Zustand stores setup | 3 jam | Dev 2 | ⬜ |
| 3.5 | TanStack Query setup + hooks | 3 jam | Dev 1 | ⬜ |
| 3.6 | Supabase Realtime subscription setup | 2 jam | Dev 1 | ⬜ |
| 3.7 | Error boundary + toast system | 2 jam | Dev 2 | ⬜ |
| 3.8 | E2E test setup (Playwright) | 3 jam | Dev 2 | ⬜ |

**Task 3.1 Detail — Shared Components:**
- [ ] `components/shared/currency-input.tsx` — Input Rupiah dengan format titik ribuan
- [ ] `components/shared/status-badge.tsx` — Reusable badge dengan warna per status
- [ ] `components/shared/confirm-dialog.tsx` — Konfirmasi delete/action
- [ ] `components/shared/empty-state.tsx` — Ilustrasi + CTA saat data kosong
- [ ] `components/shared/data-table.tsx` — Base table with sort, filter, search (Shadcn flat)
- [ ] `components/shared/page-header.tsx` — Title + description + action buttons
- [ ] `components/shared/stat-card.tsx` — Card angka besar (flat, border only)
- [ ] `components/shared/platform-icon.tsx` — Auto-detect Shopee/Tokopedia dari URL

**Sprint 2 Demo:** Full layout functional, semua halaman accessible (empty state), database schema complete

---

## 4. Phase 2: Budget & Vendor (Minggu 3–5)

### Sprint 3 (Minggu 3) — Budget Manager

| # | Task | Estimasi | Detail |
|---|------|----------|--------|
| 4.1 | Budget overview page | 6 jam | Total budget input, progress bar, stat cards |
| 4.2 | Budget per-kategori alokasi | 4 jam | Form alokasi, pie chart distribusi |
| 4.3 | Expense tracker (CRUD) | 6 jam | Tabel pengeluaran, form tambah, edit, hapus |
| 4.4 | Budget vs Actual chart | 4 jam | Bar chart per kategori (Recharts) |
| 4.5 | Budget alert system | 3 jam | Warning 80%, danger 90%, over-budget banner |
| 4.6 | Server Actions: budget | 3 jam | createExpense, updateBudget, deletExpense |
| 4.7 | Budget auto-calculation trigger | 3 jam | Supabase function: sum expenses + vendor bookings |

**Key Implementation Notes:**
```typescript
// lib/supabase/hooks/use-budget.ts
export function useBudget(weddingId: string) {
  return useQuery({
    queryKey: ["budget", weddingId],
    queryFn: () => supabase
      .from("budgets")
      .select("*, expenses(*), vendors(price_deal, status)")
      .eq("wedding_id", weddingId)
      .single(),
  });
}

// Budget auto-recalc: Supabase Database Function
// CREATE FUNCTION recalculate_budget() RETURNS TRIGGER
// → Fires on INSERT/UPDATE/DELETE on expenses, vendors (status change)
// → Updates budgets.spent_amount automatically
```

**Sprint 3 Demo:** Input budget → Alokasi per kategori → Catat pengeluaran → Chart + alerts

### Sprint 4 (Minggu 4) — Vendor Management Core

| # | Task | Estimasi | Detail |
|---|------|----------|--------|
| 4.8 | Vendor list page (grid/list toggle) | 6 jam | Card grid + list view, filter, search |
| 4.9 | Vendor categories (default + custom) | 4 jam | 12 default categories, icon, color, add custom |
| 4.10 | Vendor create/edit form | 6 jam | Multi-step form: info → paket → gambar |
| 4.11 | Vendor packages CRUD | 4 jam | Tambah/edit/hapus paket per vendor |
| 4.12 | Vendor image upload | 4 jam | Supabase Storage, compress, preview, max 5 |
| 4.13 | Vendor detail page | 4 jam | Info + paket + gambar + status + notes |
| 4.14 | Server Actions: vendor | 3 jam | CRUD actions, image upload handler |

**Sprint 4 Demo:** Tambah vendor → Pilih kategori → Input paket harga → Upload gambar → List view

### Sprint 5 (Minggu 5) — Vendor Comparison & Booking

| # | Task | Estimasi | Detail |
|---|------|----------|--------|
| 4.15 | Vendor comparison (side-by-side) | 8 jam | Select 2-4 vendor, tabel komparasi, highlight terbaik |
| 4.16 | Vendor booking status flow | 6 jam | Status pipeline: Shortlisted → Booked → Paid → Done |
| 4.17 | Booking form (DP, deadline) | 4 jam | Input saat status → Booked: tanggal, nominal DP, pelunasan |
| 4.18 | Payment tracking | 4 jam | DP paid, full paid, upload bukti transfer |
| 4.19 | Budget integration | 3 jam | Vendor booked → otomatis masuk budget spent |
| 4.20 | Planning board integration | 2 jam | Vendor booked → auto-create task "Pelunasan" |

**Comparison Component Key Logic:**
```typescript
// components/vendor/vendor-comparison.tsx
// Select vendors → fetch packages → render side-by-side table
// Auto-highlight: harga terendah (green badge), rating tertinggi (gold badge)
// Action: "Pilih Vendor Ini" → update status ke "Booked" → trigger booking form modal
```

**Sprint 5 Demo:** Compare 3 vendor catering → Pilih terbaik → Book + DP → Budget terupdate → Task pelunasan muncul

---

## 5. Phase 3: Mahar, Seserahan & Guest (Minggu 5–7)

### Sprint 5 (Lanjutan Minggu 5) + Sprint 6 (Minggu 6) — Mahar & Seserahan

| # | Task | Estimasi | Detail |
|---|------|----------|--------|
| 5.1 | Seserahan table page | 8 jam | Full CRUD table, inline editing, sticky header |
| 5.2 | Link toko (Shopee/Tokopedia) | 3 jam | URL input, auto-detect platform, ikon, clickable |
| 5.3 | Status pembelian tracker | 4 jam | Toggle status, harga aktual input, tanggal beli |
| 5.4 | Mahar vs Seserahan tabs/filter | 3 jam | Tab toggle, summary cards per kategori |
| 5.5 | Progress bar & summary | 3 jam | Items bought/total, estimasi biaya, budget link |
| 5.6 | Drag-and-drop reorder | 3 jam | Prioritas reorder via drag, auto-save |
| 5.7 | Budget integration | 2 jam | Item "Sudah Dibeli" → masuk budget kalkulasi |
| 5.8 | Mobile card view | 3 jam | Card layout untuk mobile (bukan tabel horizontal) |
| 5.9 | Server Actions: seserahan | 2 jam | CRUD + status update + budget sync |

**Platform Auto-Detection:**
```typescript
// lib/utils/platform-detect.ts
export function detectPlatform(url: string): "shopee" | "tokopedia" | "other" | null {
  if (!url) return null;
  if (url.includes("shopee.co.id")) return "shopee";
  if (url.includes("tokopedia.com")) return "tokopedia";
  return "other";
}
```

**Sprint 5–6 Demo:** Tambah item seserahan → Link Shopee → Tandai sudah dibeli → Progress bar update → Budget terupdate

### Sprint 6 (Lanjutan) + Sprint 7 (Minggu 7) — Guest List

| # | Task | Estimasi | Detail |
|---|------|----------|--------|
| 5.10 | Guest list page (data table) | 6 jam | Full CRUD, search, filter, sort, pagination |
| 5.11 | Guest categories | 3 jam | Default categories, custom add, color badges |
| 5.12 | RSVP status tracking | 4 jam | Status dropdown, bulk update, summary stats |
| 5.13 | RSVP summary dashboard | 3 jam | Donut chart, angka per status, per sesi |
| 5.14 | Session/acara management | 4 jam | CRUD sesi, assign tamu ke sesi, capacity warning |
| 5.15 | CSV/Excel import | 6 jam | Upload file, column mapping UI, preview, validate, import |
| 5.16 | Bulk operations | 4 jam | Multi-select, bulk RSVP update, bulk delete |
| 5.17 | Guest export (CSV) | 2 jam | Export filtered list ke CSV download |
| 5.18 | Mobile swipe actions | 3 jam | Swipe left: delete, swipe right: toggle RSVP |
| 5.19 | Server Actions: guest | 2 jam | CRUD + bulk + import handler |

**Import Flow:**
```
Upload CSV/Excel → Server Action parse (SheetJS) → Return preview (10 rows)
→ User maps columns → Confirm → Batch insert to Supabase → Report: X success, Y fail
```

**Sprint 6–7 Demo:** Import 200 tamu dari Excel → Assign ke sesi → Bulk update RSVP → Summary chart

---

## 6. Phase 4: Planning Board (Minggu 7–9)

### Sprint 7 (Lanjutan) + Sprint 8 (Minggu 8) — Kanban Board (MVP)

| # | Task | Estimasi | Detail |
|---|------|----------|--------|
| 6.1 | Task data model & CRUD | 4 jam | Task create/edit/delete, Server Actions |
| 6.2 | Kanban board layout | 8 jam | 3+ kolom, card components, column headers |
| 6.3 | Drag-and-drop (Kanban) | 6 jam | @hello-pangea/dnd, cross-column move, status auto-update |
| 6.4 | Task card design | 3 jam | Title, deadline, priority badge, category badge, assignee |
| 6.5 | Quick add task | 2 jam | Input field per kolom header, enter to add |
| 6.6 | Task detail modal | 4 jam | Full edit form: title, desc, dates, priority, category, assignee |
| 6.7 | Overdue highlighting | 2 jam | Red border + "Overdue X hari" badge |
| 6.8 | Filter & search | 3 jam | Filter: category, priority, assignee. Search by title |
| 6.9 | Vendor auto-sync tasks | 3 jam | Vendor booked → auto-create "Pelunasan" task |
| 6.10 | Wedding checklist template | 4 jam | Default 60+ tasks, generate relative to wedding date |

**Kanban DnD Architecture:**
```typescript
// components/planning/kanban-board.tsx
// Uses @hello-pangea/dnd
// onDragEnd → optimistic update (Zustand) → Server Action reorder + status update
// Columns stored in Zustand, tasks fetched via TanStack Query
// Real-time sync via Supabase Realtime (postgres_changes on tasks table)
```

**Sprint 7–8 Demo:** Generate template checklist → Kanban board → Drag task → Edit detail → Vendor task auto-created

### Sprint 9 (Minggu 9) — Calendar View (v1.1 Prep, tapi mulai di MVP)

| # | Task | Estimasi | Detail |
|---|------|----------|--------|
| 6.11 | View switcher (Kanban / Calendar / Gantt) | 2 jam | Toggle button, state persists |
| 6.12 | Calendar view (FullCalendar) | 6 jam | Month view, task events, color-coded, click → detail |
| 6.13 | Calendar drag-to-reschedule | 3 jam | Drag task to new date → update deadline |
| 6.14 | Hari-H highlight | 1 jam | Wedding date special marker |
| 6.15 | Gantt chart view (basic) | 6 jam | Frappe Gantt, horizontal bars, zoom month/week |
| 6.16 | Deadline reminder badge | 2 jam | Badge count di sidebar "Planning" menu |

**Sprint 9 Demo:** Switch Kanban → Calendar → Gantt → Drag reschedule → Reminder badge

---

## 7. Phase 5: Dashboard & PWA (Minggu 9–11)

### Sprint 9 (Lanjutan) + Sprint 10 (Minggu 10) — Interactive Dashboard

| # | Task | Estimasi | Detail |
|---|------|----------|--------|
| 7.1 | Dashboard page layout | 4 jam | Grid layout (2-3 col desktop, 1 col mobile) |
| 7.2 | Widget: Wedding Countdown | 3 jam | Hari menuju pernikahan, tanggal, animasi subtle |
| 7.3 | Widget: Budget Overview | 4 jam | Total/spent/remaining, progress bar, mini donut |
| 7.4 | Widget: Vendor Status | 4 jam | Stacked bar per status, total count |
| 7.5 | Widget: Booked Vendors table | 4 jam | Table ringkas, status badge, deadline highlight |
| 7.6 | Widget: Mahar & Seserahan Progress | 3 jam | Progress bar, top 5 unpurchased items, platform icons |
| 7.7 | Widget: Guest Count | 3 jam | Donut chart RSVP, per-sesi breakdown |
| 7.8 | Widget: Upcoming Tasks | 3 jam | List 5 nearest deadline, overdue first, quick "Done" |
| 7.9 | Widget: Quick Actions FAB | 2 jam | Floating button → modal: add vendor/expense/guest/task |
| 7.10 | Widget click → navigate | 2 jam | Setiap widget clickable → halaman detail |
| 7.11 | Skeleton loading per widget | 2 jam | Skeleton components saat data loading |
| 7.12 | Supabase Realtime dashboard | 3 jam | Subscribe to changes, auto-refresh widgets |

**Dashboard Data Aggregation:**
```typescript
// app/(dashboard)/dashboard/page.tsx — Server Component
// Uses Parallel Data Fetching with Promise.all
// Each widget = separate async function → stream via Suspense boundaries
// PPR: Static shell instant, dynamic widgets stream in

export default async function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Suspense fallback={<CountdownSkeleton />}>
        <CountdownWidget weddingId={weddingId} />
      </Suspense>
      <Suspense fallback={<BudgetSkeleton />}>
        <BudgetWidget weddingId={weddingId} />
      </Suspense>
      {/* ... more widgets */}
    </div>
  );
}
```

**Sprint 10 Demo:** Dashboard penuh dengan 8 widget → real-time update → click navigate → mobile responsive

### Sprint 10 (Lanjutan) + Sprint 11 (Minggu 11) — PWA Finalization

| # | Task | Estimasi | Detail |
|---|------|----------|--------|
| 7.13 | Service Worker caching tuning | 4 jam | Precache app shell, runtime cache API responses |
| 7.14 | Offline fallback experience | 3 jam | Offline page, cached data display, sync indicator |
| 7.15 | Background Sync queue | 4 jam | IndexedDB queue for offline mutations, auto-replay |
| 7.16 | Install prompt UX | 3 jam | Custom banner, iOS instructions, desktop prompt |
| 7.17 | Splash screen & icons | 2 jam | Apple touch icons, splash images, manifest screenshots |
| 7.18 | Offline indicator banner | 2 jam | "You are offline" bar, auto-dismiss on reconnect |
| 7.19 | PWA Lighthouse audit | 2 jam | Target ≥ 90, fix any issues |
| 7.20 | Push notification prep | 3 jam | VAPID keys, subscription table, endpoint — NOT active yet |

**Sprint 11 Demo:** Install PWA → Use offline → Come back online → Data synced → Lighthouse PWA ≥ 90

---

## 8. Phase 6: Polish, Testing & Launch (Minggu 11–12)

### Sprint 11 (Lanjutan) + Sprint 12 (Minggu 12) — QA & Launch

| # | Task | Estimasi | Detail |
|---|------|----------|--------|
| 8.1 | Cross-browser testing | 4 jam | Chrome, Safari, Firefox, Samsung Internet |
| 8.2 | Mobile device testing | 4 jam | Android (Chrome), iOS (Safari), tablet |
| 8.3 | Performance optimization | 6 jam | Bundle analysis, lazy loading, image optimization |
| 8.4 | Lighthouse audit (all pages) | 3 jam | Perf ≥ 85, Accessibility ≥ 90, PWA ≥ 90 |
| 8.5 | E2E test suite (Playwright) | 8 jam | Critical paths: auth, budget, vendor booking, RSVP |
| 8.6 | Security audit | 3 jam | RLS verification, auth flows, input sanitization |
| 8.7 | Seed data for demo | 2 jam | Script generate sample wedding with realistic data |
| 8.8 | Error tracking setup (Sentry) | 2 jam | Sentry integration, source maps, alerts |
| 8.9 | Analytics setup | 2 jam | Vercel Analytics, custom events, Web Vitals |
| 8.10 | Domain & DNS setup | 1 jam | nikahku.id / nikahku.app (or custom domain) |
| 8.11 | Production environment config | 2 jam | Env vars, Supabase prod project, Vercel prod deploy |
| 8.12 | Launch checklist verification | 2 jam | All MVP features functional, zero critical bugs |
| 8.13 | Documentation: README + CONTRIBUTING | 2 jam | Setup guide, contribution rules, architecture overview |

**Launch Checklist:**
```
□ Auth: Login, Register, Onboarding, Logout — works
□ Budget: Input, allocate, track, chart, alerts — works
□ Vendor: CRUD, categories, packages, compare, booking flow — works
□ Mahar: Table, links, status, progress, budget sync — works
□ Guest: CRUD, RSVP, sessions, import, bulk ops — works
□ Planning: Kanban, create/edit task, template, drag-drop — works
□ Dashboard: All 8 widgets, realtime, navigation — works
□ PWA: Installable, offline shell, sync, Lighthouse ≥ 90 — works
□ Mobile: All features responsive, bottom nav, card views — works
□ Performance: Lighthouse Perf ≥ 85 on all pages — verified
□ Security: RLS active, no data leaks, auth solid — verified
□ Zero critical/high bugs — confirmed
```

---

## 9. Phase 7: v1.1 — Enhanced (Minggu 13–16)

### Sprint 13–14 (Minggu 13–14)

| # | Task | Estimasi | Detail |
|---|------|----------|--------|
| 9.1 | Push notifications (web push) | 8 jam | VAPID, subscription, trigger from Supabase cron |
| 9.2 | Email reminders (Resend) | 6 jam | Weekly digest, deadline H-3/H-1 via Supabase Edge Function |
| 9.3 | Calendar View polish | 4 jam | Week view, better event styling, drag improvements |
| 9.4 | Gantt Chart polish | 6 jam | Zoom controls, milestone markers, today line |
| 9.5 | Vendor image gallery | 4 jam | Lightbox view, zoom, multiple images per vendor |

### Sprint 15–16 (Minggu 15–16)

| # | Task | Estimasi | Detail |
|---|------|----------|--------|
| 9.6 | Guest CSV/Excel import polish | 4 jam | Better error handling, duplicate detection, merge |
| 9.7 | Session capacity management | 3 jam | Visual capacity bar, over-capacity warning banner |
| 9.8 | Dashboard widget customization | 6 jam | Drag-reorder, show/hide toggle, persist layout |
| 9.9 | Export reports (PDF/CSV) | 6 jam | Budget report, guest list, vendor summary → downloadable |
| 9.10 | Dark mode (optional) | 4 jam | CSS variables swap, user preference toggle |
| 9.11 | Performance tuning round 2 | 4 jam | Based on real user data, optimize bottlenecks |
| 9.12 | User feedback integration | 3 jam | In-app feedback form, Sentry user feedback widget |

---

## 10. Database Schema & Migrations

### 10.1 Full Schema SQL

```sql
-- ==========================================
-- NIKAHKU Database Schema
-- Supabase PostgreSQL
-- ==========================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- ==========================================
-- CORE TABLES
-- ==========================================

-- Weddings (project per pasangan)
CREATE TABLE weddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_1_name TEXT NOT NULL,
  partner_2_name TEXT NOT NULL,
  wedding_date DATE NOT NULL,
  venue_city TEXT,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Budgets
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE UNIQUE,
  total_amount BIGINT NOT NULL DEFAULT 0, -- stored in smallest unit (Rupiah)
  spent_amount BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Budget Allocations per Category
CREATE TABLE budget_allocations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES vendor_categories(id) ON DELETE CASCADE,
  allocated_amount BIGINT NOT NULL DEFAULT 0,
  UNIQUE(wedding_id, category_id)
);

-- Expenses (manual pengeluaran)
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount BIGINT NOT NULL,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- VENDOR TABLES
-- ==========================================

-- Vendor Categories
CREATE TABLE vendor_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE, -- NULL = global default
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '➕',
  color TEXT NOT NULL DEFAULT '#8B6F4E',
  is_default BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Vendors
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES vendor_categories(id),
  name TEXT NOT NULL,
  contact_phone TEXT,
  contact_wa TEXT,
  email TEXT,
  instagram TEXT,
  website TEXT,
  address TEXT,
  city TEXT,
  rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
  status TEXT NOT NULL DEFAULT 'shortlisted' CHECK (status IN (
    'shortlisted', 'contacted', 'negotiating', 'booked', 
    'paid_dp', 'paid_full', 'completed', 'cancelled'
  )),
  pros TEXT,
  cons TEXT,
  notes TEXT,
  -- Booking fields (filled when status >= 'booked')
  booking_date DATE,
  selected_package_id UUID,
  price_deal BIGINT,
  dp_amount BIGINT,
  dp_paid_date DATE,
  full_paid_date DATE,
  payment_deadline DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Vendor Packages
CREATE TABLE vendor_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price BIGINT NOT NULL,
  includes TEXT[], -- array of included items
  excludes TEXT[], -- array of excluded items
  notes TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Vendor Images
CREATE TABLE vendor_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL, -- Supabase Storage path
  file_name TEXT NOT NULL,
  file_size INT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- MAHAR & SESERAHAN
-- ==========================================

CREATE TABLE seserahan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('mahar', 'seserahan')),
  sub_category TEXT,
  brand TEXT,
  price_min BIGINT NOT NULL DEFAULT 0,
  price_max BIGINT NOT NULL DEFAULT 0,
  shop_url TEXT,
  shop_platform TEXT, -- auto-detected: 'shopee', 'tokopedia', 'other'
  purchase_status TEXT NOT NULL DEFAULT 'belum_dibeli' CHECK (purchase_status IN (
    'belum_dibeli', 'sudah_dibeli', 'sudah_diterima'
  )),
  actual_price BIGINT,
  purchase_date DATE,
  priority TEXT NOT NULL DEFAULT 'sedang' CHECK (priority IN ('tinggi', 'sedang', 'rendah')),
  sort_order INT NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- GUEST LIST
-- ==========================================

-- Sessions / Acara
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  session_date DATE,
  time_start TIME,
  time_end TIME,
  venue TEXT,
  max_capacity INT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Guests
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'lainnya',
  phone TEXT,
  email TEXT,
  pax_count INT NOT NULL DEFAULT 1,
  address TEXT,
  rsvp_status TEXT NOT NULL DEFAULT 'belum_diundang' CHECK (rsvp_status IN (
    'belum_diundang', 'undangan_terkirim', 'hadir', 'tidak_hadir', 'belum_konfirmasi'
  )),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Guest-Session junction
CREATE TABLE guest_sessions (
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  PRIMARY KEY (guest_id, session_id)
);

-- ==========================================
-- PLANNING / TASKS
-- ==========================================

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'lainnya',
  start_date DATE,
  due_date DATE NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('urgent', 'high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done', 'cancelled')),
  assignee TEXT, -- 'pria', 'wanita', 'bersama', 'wo', 'keluarga'
  vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  column_id TEXT NOT NULL DEFAULT 'todo', -- for Kanban column mapping
  sort_order INT NOT NULL DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================
-- PWA / PUSH NOTIFICATIONS (prep for v1.1)
-- ==========================================

CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  keys_p256dh TEXT NOT NULL,
  keys_auth TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_weddings_user_id ON weddings(user_id);
CREATE INDEX idx_vendors_wedding_id ON vendors(wedding_id);
CREATE INDEX idx_vendors_category_id ON vendors(category_id);
CREATE INDEX idx_vendors_status ON vendors(status);
CREATE INDEX idx_expenses_wedding_id ON expenses(wedding_id);
CREATE INDEX idx_seserahan_wedding_id ON seserahan(wedding_id);
CREATE INDEX idx_seserahan_status ON seserahan(purchase_status);
CREATE INDEX idx_guests_wedding_id ON guests(wedding_id);
CREATE INDEX idx_guests_rsvp ON guests(rsvp_status);
CREATE INDEX idx_tasks_wedding_id ON tasks(wedding_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE seserahan ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy pattern: user can only access their own wedding data
CREATE POLICY "Users access own weddings" ON weddings
  FOR ALL USING (user_id = auth.uid());

-- For child tables, check via wedding ownership
CREATE POLICY "Users access own vendors" ON vendors
  FOR ALL USING (wedding_id IN (SELECT id FROM weddings WHERE user_id = auth.uid()));

-- Repeat pattern for all child tables...
-- (budgets, expenses, vendor_categories, vendor_packages, vendor_images,
--  seserahan, sessions, guests, guest_sessions, tasks)

CREATE POLICY "Users access own push_subscriptions" ON push_subscriptions
  FOR ALL USING (user_id = auth.uid());

-- ==========================================
-- DATABASE FUNCTIONS & TRIGGERS
-- ==========================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_weddings_updated_at BEFORE UPDATE ON weddings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_vendors_updated_at BEFORE UPDATE ON vendors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_seserahan_updated_at BEFORE UPDATE ON seserahan
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_guests_updated_at BEFORE UPDATE ON guests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-recalculate budget spent_amount
CREATE OR REPLACE FUNCTION recalculate_budget()
RETURNS TRIGGER AS $$
DECLARE
  v_wedding_id UUID;
  v_total BIGINT;
BEGIN
  -- Determine wedding_id based on trigger source
  IF TG_TABLE_NAME = 'expenses' THEN
    v_wedding_id := COALESCE(NEW.wedding_id, OLD.wedding_id);
  ELSIF TG_TABLE_NAME = 'vendors' THEN
    v_wedding_id := COALESCE(NEW.wedding_id, OLD.wedding_id);
  ELSIF TG_TABLE_NAME = 'seserahan' THEN
    v_wedding_id := COALESCE(NEW.wedding_id, OLD.wedding_id);
  END IF;
  
  -- Sum all sources
  SELECT 
    COALESCE((SELECT SUM(amount) FROM expenses WHERE wedding_id = v_wedding_id), 0) +
    COALESCE((SELECT SUM(price_deal) FROM vendors WHERE wedding_id = v_wedding_id AND status IN ('booked', 'paid_dp', 'paid_full', 'completed')), 0) +
    COALESCE((SELECT SUM(actual_price) FROM seserahan WHERE wedding_id = v_wedding_id AND purchase_status IN ('sudah_dibeli', 'sudah_diterima')), 0)
  INTO v_total;
  
  UPDATE budgets SET spent_amount = v_total WHERE wedding_id = v_wedding_id;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_expenses_budget AFTER INSERT OR UPDATE OR DELETE ON expenses
  FOR EACH ROW EXECUTE FUNCTION recalculate_budget();
CREATE TRIGGER tr_vendors_budget AFTER UPDATE OF status, price_deal ON vendors
  FOR EACH ROW EXECUTE FUNCTION recalculate_budget();
CREATE TRIGGER tr_seserahan_budget AFTER UPDATE OF purchase_status, actual_price ON seserahan
  FOR EACH ROW EXECUTE FUNCTION recalculate_budget();

-- ==========================================
-- SEED: Default Vendor Categories
-- ==========================================

INSERT INTO vendor_categories (name, icon, color, is_default, sort_order) VALUES
  ('Catering', '🍽️', '#E07A5F', true, 1),
  ('Venue / Gedung', '🏛️', '#3D405B', true, 2),
  ('Attire & Make Up', '👰', '#C9917A', true, 3),
  ('Photo & Video', '📸', '#81B29A', true, 4),
  ('Dekorasi', '🌸', '#F2CC8F', true, 5),
  ('Entertainment / MC', '🎤', '#8B6F4E', true, 6),
  ('Undangan / Percetakan', '💌', '#D4A574', true, 7),
  ('Souvenir', '🎁', '#6B8DAE', true, 8),
  ('Transportasi', '🚗', '#5B8C5A', true, 9),
  ('Akomodasi', '🏨', '#9C8E7E', true, 10),
  ('Henna / Mehendi', '🤲', '#C75C5C', true, 11),
  ('Lain-lain', '➕', '#2C2418', true, 12);
```

---

## 11. File & Folder Structure

```
nikahku-app/
├── public/
│   ├── icons/                      # PWA icons (192, 512, maskable)
│   ├── screenshots/                # PWA screenshots for manifest
│   ├── sw.js                       # Generated by Serwist (gitignore)
│   └── swe-worker-*.js             # Serwist workbox (gitignore)
│
├── src/
│   ├── sw.ts                       # Service Worker source (Serwist)
│   │
│   ├── app/
│   │   ├── layout.tsx              # Root layout (fonts, providers, meta)
│   │   ├── manifest.ts             # PWA manifest (dynamic)
│   │   ├── globals.css             # Tailwind + Shadcn flat overrides
│   │   ├── offline/
│   │   │   └── page.tsx            # Offline fallback page
│   │   │
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── callback/route.ts   # OAuth callback
│   │   │   └── onboarding/
│   │   │       ├── page.tsx        # Step 1: Wedding info
│   │   │       ├── budget/page.tsx # Step 2: Initial budget
│   │   │       └── template/page.tsx # Step 3: Choose checklist
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx          # Sidebar + header + bottom nav
│   │   │   ├── loading.tsx         # Full page skeleton
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx        # Interactive dashboard (all widgets)
│   │   │   │
│   │   │   ├── budget/
│   │   │   │   ├── page.tsx        # Budget overview + charts
│   │   │   │   └── expenses/page.tsx # Expense list & form
│   │   │   │
│   │   │   ├── vendor/
│   │   │   │   ├── page.tsx        # Vendor list (grid/list)
│   │   │   │   ├── [id]/page.tsx   # Vendor detail
│   │   │   │   ├── create/page.tsx # Add new vendor
│   │   │   │   ├── compare/page.tsx # Side-by-side comparison
│   │   │   │   └── categories/page.tsx # Manage categories
│   │   │   │
│   │   │   ├── seserahan/
│   │   │   │   └── page.tsx        # Mahar & Seserahan table
│   │   │   │
│   │   │   ├── guest/
│   │   │   │   ├── page.tsx        # Guest list table
│   │   │   │   ├── import/page.tsx # CSV/Excel import
│   │   │   │   └── sessions/page.tsx # Session management
│   │   │   │
│   │   │   ├── planning/
│   │   │   │   └── page.tsx        # Planning board (Kanban/Calendar/Gantt)
│   │   │   │
│   │   │   └── settings/
│   │   │       └── page.tsx        # User settings, PWA install, account
│   │   │
│   │   └── actions/                # Server Actions
│   │       ├── auth.ts
│   │       ├── budget.ts
│   │       ├── vendor.ts
│   │       ├── seserahan.ts
│   │       ├── guest.ts
│   │       └── task.ts
│   │
│   ├── components/
│   │   ├── ui/                     # Shadcn/UI components (flat overrides)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx            # Flat, no shadow
│   │   │   ├── ... (all shadcn)
│   │   │   └── overrides.css       # Global flat mode CSS
│   │   │
│   │   ├── layout/
│   │   │   ├── sidebar.tsx
│   │   │   ├── mobile-nav.tsx
│   │   │   ├── header.tsx
│   │   │   └── breadcrumb.tsx
│   │   │
│   │   ├── shared/
│   │   │   ├── currency-input.tsx
│   │   │   ├── status-badge.tsx
│   │   │   ├── confirm-dialog.tsx
│   │   │   ├── empty-state.tsx
│   │   │   ├── data-table.tsx
│   │   │   ├── page-header.tsx
│   │   │   ├── stat-card.tsx
│   │   │   └── platform-icon.tsx
│   │   │
│   │   ├── budget/
│   │   │   ├── budget-overview.tsx
│   │   │   ├── budget-chart.tsx
│   │   │   ├── expense-form.tsx
│   │   │   └── budget-alert.tsx
│   │   │
│   │   ├── vendor/
│   │   │   ├── vendor-card.tsx
│   │   │   ├── vendor-form.tsx
│   │   │   ├── vendor-comparison.tsx
│   │   │   ├── vendor-status-pipeline.tsx
│   │   │   ├── package-form.tsx
│   │   │   └── image-upload.tsx
│   │   │
│   │   ├── seserahan/
│   │   │   ├── seserahan-table.tsx
│   │   │   ├── seserahan-form.tsx
│   │   │   ├── seserahan-progress.tsx
│   │   │   └── shop-link.tsx
│   │   │
│   │   ├── guest/
│   │   │   ├── guest-table.tsx
│   │   │   ├── guest-form.tsx
│   │   │   ├── rsvp-summary.tsx
│   │   │   ├── import-wizard.tsx
│   │   │   └── session-manager.tsx
│   │   │
│   │   ├── planning/
│   │   │   ├── kanban-board.tsx
│   │   │   ├── kanban-card.tsx
│   │   │   ├── kanban-column.tsx
│   │   │   ├── calendar-view.tsx
│   │   │   ├── gantt-view.tsx
│   │   │   ├── task-form.tsx
│   │   │   └── view-switcher.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── countdown-widget.tsx
│   │   │   ├── budget-widget.tsx
│   │   │   ├── vendor-status-widget.tsx
│   │   │   ├── booked-vendors-widget.tsx
│   │   │   ├── seserahan-widget.tsx
│   │   │   ├── guest-widget.tsx
│   │   │   ├── upcoming-tasks-widget.tsx
│   │   │   └── quick-actions-fab.tsx
│   │   │
│   │   └── pwa/
│   │       ├── install-banner.tsx
│   │       ├── offline-indicator.tsx
│   │       └── sync-status.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser Supabase client
│   │   │   ├── server.ts           # Server Component client
│   │   │   ├── middleware.ts       # For proxy.ts
│   │   │   └── database.types.ts   # Auto-generated types
│   │   │
│   │   ├── hooks/
│   │   │   ├── use-budget.ts
│   │   │   ├── use-vendors.ts
│   │   │   ├── use-seserahan.ts
│   │   │   ├── use-guests.ts
│   │   │   ├── use-tasks.ts
│   │   │   ├── use-wedding.ts
│   │   │   └── use-realtime.ts     # Supabase realtime hook
│   │   │
│   │   ├── stores/
│   │   │   ├── ui-store.ts         # Sidebar state, view preferences
│   │   │   └── kanban-store.ts     # Kanban column/card state
│   │   │
│   │   ├── utils/
│   │   │   ├── format-currency.ts  # Rp 50.000.000
│   │   │   ├── platform-detect.ts  # Shopee / Tokopedia detect
│   │   │   ├── date-utils.ts       # Relative dates, countdown
│   │   │   └── csv-parser.ts       # CSV/Excel parse for import
│   │   │
│   │   └── constants/
│   │       ├── vendor-categories.ts # Default 12 categories
│   │       ├── wedding-template.ts  # 60+ default checklist tasks
│   │       ├── rsvp-statuses.ts
│   │       └── vendor-statuses.ts
│   │
│   └── providers/
│       ├── auth-provider.tsx
│       ├── query-provider.tsx       # TanStack Query
│       └── toast-provider.tsx
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql   # Full schema from Section 10
│
├── proxy.ts                         # Next.js 16 proxy (replaces middleware)
├── next.config.ts                   # Serwist + Next.js config
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── .env.local
├── .env.example
├── AGENTS.md                        # For AI coding assistants
└── README.md
```

---

## 12. Dependency List

### Production Dependencies

```json
{
  "dependencies": {
    "next": "^16.2.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    
    "@supabase/supabase-js": "^2.x",
    "@supabase/ssr": "^0.x",
    
    "@serwist/next": "latest",
    "@serwist/precaching": "latest",
    "@serwist/sw": "latest",
    
    "zustand": "^5.x",
    "@tanstack/react-query": "^5.x",
    
    "recharts": "^2.x",
    "@hello-pangea/dnd": "^16.x",
    "@fullcalendar/core": "^6.x",
    "@fullcalendar/daygrid": "^6.x",
    "@fullcalendar/interaction": "^6.x",
    "frappe-gantt": "^0.7.x",
    
    "xlsx": "^0.18.x",
    "resend": "^3.x",
    
    "zod": "^3.x",
    "date-fns": "^3.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x",
    "lucide-react": "latest",
    
    "class-variance-authority": "^0.7.x",
    "@radix-ui/react-*": "latest"
  }
}
```

### Dev Dependencies

```json
{
  "devDependencies": {
    "typescript": "^5.x",
    "@types/react": "^19.x",
    "@types/react-dom": "^19.x",
    "tailwindcss": "^4.x",
    "eslint": "^9.x",
    "eslint-config-next": "^16.2.x",
    "@playwright/test": "^1.x",
    "vitest": "^2.x",
    "@testing-library/react": "^16.x",
    "supabase": "latest",
    "@sentry/nextjs": "^8.x"
  }
}
```

---

## 13. Testing Strategy

### 13.1 Test Pyramid

```
            ┌──────────┐
            │   E2E    │  10% — Playwright
            │  (few)   │  Critical user journeys only
            ├──────────┤
            │Integrasi │  30% — Vitest + Testing Library
            │ (some)   │  Component + API integration
            ├──────────┤
            │  Unit    │  60% — Vitest
            │ (many)   │  Utils, hooks, business logic
            └──────────┘
```

### 13.2 E2E Critical Paths (Playwright)

| # | Test Suite | Scenarios |
|---|-----------|-----------|
| E1 | Auth Flow | Register → Onboarding → Dashboard |
| E2 | Budget Flow | Set budget → Add expense → Verify chart |
| E3 | Vendor Booking | Add vendor → Add packages → Compare → Book → Verify budget |
| E4 | Seserahan | Add item → Set link → Mark purchased → Verify budget |
| E5 | Guest Import | Upload CSV → Map columns → Import → Verify count |
| E6 | Kanban | Create task → Drag column → Verify status change |
| E7 | Dashboard | Load → Verify all 8 widgets → Click navigation |
| E8 | PWA | Install prompt visible → Manifest valid → Offline fallback |

### 13.3 Unit Test Priorities

| Module | Functions to Test |
|--------|------------------|
| `format-currency.ts` | IDR formatting, edge cases (0, negative, billions) |
| `platform-detect.ts` | Shopee, Tokopedia, other, null |
| `date-utils.ts` | Countdown, relative dates, deadline check |
| `csv-parser.ts` | Valid CSV, malformed, encoding issues |
| `recalculate_budget` | Sum from expenses + vendors + seserahan |
| Zustand stores | State mutations, selectors |
| Server Actions | Input validation (Zod), error handling |

---

## 14. DevOps & CI/CD

### 14.1 Vercel Deployment

```yaml
# Automatic via Vercel GitHub Integration
main branch    → Production  (nikahku.app)
develop branch → Preview     (staging.nikahku.app)
feature/*      → Preview     (auto-generated URL)
```

### 14.2 GitHub Actions CI

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run lint          # ESLint
      - run: npm run type-check    # tsc --noEmit
      - run: npm run test          # Vitest
      - run: npx playwright test   # E2E (on PR to main only)
```

### 14.3 Supabase Migration Workflow

```bash
# Local development
npx supabase start              # Local Supabase (Docker)
npx supabase migration new xxx  # Create migration
npx supabase db push            # Apply to local

# Deploy to production
npx supabase link --project-ref <id>
npx supabase db push            # Apply migrations to prod
npx supabase gen types typescript > lib/supabase/database.types.ts
```

---

## 15. Risk Register & Contingency

| # | Risk | Impact | Probability | Mitigation | Contingency |
|---|------|--------|-------------|------------|-------------|
| R1 | Supabase free tier limit tercapai (500MB DB) | 🟡 | 🟢 Low (MVP) | Monitor usage, efficient schema, no blob storage in DB | Upgrade ke Pro ($25/mo) |
| R2 | Serwist breaking change dengan Next.js update | 🟡 | 🟡 Medium | Pin versi, test sebelum upgrade | Fallback ke built-in SW (manual, tanpa library) |
| R3 | Turbopack incompatibility dengan dependency | 🟡 | 🟡 Medium | Test semua deps di Turbopack early | `--webpack` flag sebagai fallback |
| R4 | FullCalendar bundle size terlalu besar | 🟢 | 🟡 Medium | Dynamic import, lazy load kalau perlu | Ganti ke lightweight alternative (react-big-calendar) |
| R5 | Supabase Realtime 200 concurrent limit | 🟡 | 🟢 Low | Efficient subscription (1 channel per wedding) | Polling fallback, upgrade tier |
| R6 | PWA install not working iOS Safari | 🟡 | 🟡 Medium | Manual "Add to Home Screen" instruction | In-app banner dengan step-by-step guide iOS |
| R7 | Developer attrition mid-project | 🔴 | 🟢 Low | Good docs, clean code, type safety | Onboard new dev with AGENTS.md + README |
| R8 | Scope creep dari stakeholder | 🔴 | 🟡 Medium | Strict MVP scope, backlog v1.1+ | Point to PRD Out of Scope section |

---

## Summary Timeline

```
MINGGU  1  ████████  Foundation: Auth + Layout + DB + PWA Base
MINGGU  2  ████████  Shared Components + Schema + Stores + Tests Setup
MINGGU  3  ████████  Budget Manager (Full Stack)
MINGGU  4  ████████  Vendor CRUD + Categories + Packages
MINGGU  5  ████████  Vendor Compare + Booking + Mahar Start
MINGGU  6  ████████  Mahar & Seserahan (Full) + Guest Start
MINGGU  7  ████████  Guest List (Full) + Planning Start
MINGGU  8  ████████  Planning Board (Kanban + Task CRUD)
MINGGU  9  ████████  Calendar + Gantt View + Dashboard Start
MINGGU 10  ████████  Dashboard (All 8 Widgets) + PWA Finalize
MINGGU 11  ████████  PWA Offline + Sync + Polish
MINGGU 12  ████████  Testing + Performance + LAUNCH 🚀
─────────────────────────────────────────────────────
MINGGU 13  ░░░░░░░░  v1.1: Push Notifications + Email Reminders
MINGGU 14  ░░░░░░░░  v1.1: Calendar/Gantt Polish + Gallery
MINGGU 15  ░░░░░░░░  v1.1: Import Polish + Dashboard Customize
MINGGU 16  ░░░░░░░░  v1.1: Export Reports + Dark Mode + Polish

████ = MVP (12 minggu)
░░░░ = v1.1 Enhancement (4 minggu)
```

---

> **Document End**
>
> **Implementation Plan v1.0.0** — NIKAHKU Wedding Planner
> Based on PRD v1.1.0 (Next.js 16.2 + Supabase + Shadcn Flat + Serwist PWA)
> Total Estimated Effort: ~380 jam (MVP) + ~120 jam (v1.1) = ~500 jam
> Team: 2–3 Full-Stack Developers, 12–16 minggu
