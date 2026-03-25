# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Turbopack enabled)
npm run build    # Production build
npm start        # Run production server
npm run lint     # Run ESLint
```

No test runner is configured in this project.

## Architecture Overview

**NIKAHKU** is an Indonesian wedding planning platform built with **Next.js 16 App Router** and TypeScript. It uses Supabase as the backend (auth + PostgreSQL).

### Routing Structure

Two route groups under `src/app/`:
- `(auth)/` — Public routes: `/login`, `/register`, `/onboarding/*`
- `(dashboard)/` — Protected routes requiring auth: `/dashboard`, `/budget`, `/vendor`, `/vendor/[id]`, `/vendor/compare`, `/seserahan`

Root `/` redirects to `/dashboard`. Auth protection is handled in `src/middleware.ts` via Supabase SSR.

### State Management (Three Layers)

1. **React Context** (`src/providers/auth-provider.tsx`) — Auth state via Supabase, exposes `useAuth()` hook with `user` and `loading`.

2. **React Query** (`src/providers/query-provider.tsx`) — All server data. Custom hooks live in `src/lib/hooks/`: `useWedding`, `useBudget`, `useVendors`, `useGuests`, `useTasks`, `useSeserahan`. Each hook includes mutations with automatic cache invalidation. Stale time: 1 min, no refetch on window focus.

3. **Zustand** (`src/lib/stores/`) — Client UI state only:
   - `useUIStore` — sidebar state, grid/list view modes, active tabs, vendor comparison IDs. Persisted to `localStorage`.
   - `useKanbanStore` — kanban board state for planning checklist.

### Data Layer

- Supabase client-side: `src/lib/supabase/client.ts`
- Supabase server-side (Server Components/Actions): `src/lib/supabase/server.ts`
- Auto-generated DB types: `src/lib/supabase/database.types.ts`
- Server Actions: `src/app/actions/auth.ts`

Key tables: `weddings`, `budgets`, `expenses`, `budget_allocations`, `vendors`, `vendor_categories`, `guests`, `tasks`, `seserahan`.

### PWA

Service worker via **Serwist** configured in `next.config.ts`. The SW entry point is `src/sw.ts`. Offline fallback at `/offline`.

### Path Aliases

`@/*` maps to `src/*` — use this for all internal imports.

### UI Stack

- **Tailwind CSS v4** for styling
- **shadcn** + **@base-ui/react** for UI components (in `src/components/ui/`)
- **lucide-react** for icons
- **recharts** for charts (budget visualizations)
- **sonner** for toast notifications
- Theme color: `#8B6F4E` (warm brown/gold). Dark mode supported via `next-themes`.
- Currency formatted as Indonesian Rupiah (IDR).
