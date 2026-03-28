"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { GuestStats } from "@/components/guest/guest-stats";
import { GuestFilters } from "@/components/guest/guest-filters";
import { GuestTable } from "@/components/guest/guest-table";
import { GuestCardList } from "@/components/guest/guest-card-list";
import { GuestFormDialog } from "@/components/guest/guest-form-dialog";
import { SessionManager } from "@/components/guest/session-manager";
import { GuestImportDialog } from "@/components/guest/guest-import-dialog";
import { useWedding } from "@/lib/hooks/use-wedding";
import { useGuests, useSessions } from "@/lib/hooks/use-guests";
import { TablePagination } from "@/components/shared/table-pagination";
import { Users, Plus, Upload } from "lucide-react";
import type { Tables } from "@/lib/supabase/database.types";

const MOBILE_PAGE_SIZE = 10;

type GuestWithSessions = Tables<"guests"> & {
  guest_sessions?: { session_id: string }[];
};

export default function GuestPage() {
  const { data: wedding, isLoading: weddingLoading } = useWedding();
  const weddingId = wedding?.id;
  const { data: rawGuests, isLoading: guestsLoading } = useGuests(weddingId);
  const { data: sessions } = useSessions(weddingId);
  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");
  const [categoryFilter, setCategoryFilter] = useState("semua");
  const [mobilePage, setMobilePage] = useState(1);

  const guests = rawGuests as GuestWithSessions[] | undefined;

  const filtered = useMemo(() => {
    if (!guests) return [] as GuestWithSessions[];
    let result: GuestWithSessions[] = guests;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((g) => g.name.toLowerCase().includes(q));
    }

    if (statusFilter !== "semua") {
      result = result.filter((g) => g.rsvp_status === statusFilter);
    }

    if (categoryFilter !== "semua") {
      result = result.filter((g) => g.category === categoryFilter);
    }

    return result;
  }, [guests, search, statusFilter, categoryFilter]);

  const mobileTotalPages = Math.max(1, Math.ceil(filtered.length / MOBILE_PAGE_SIZE));
  const safeMobilePage = Math.min(mobilePage, mobileTotalPages);
  const pagedMobile = filtered.slice(
    (safeMobilePage - 1) * MOBILE_PAGE_SIZE,
    safeMobilePage * MOBILE_PAGE_SIZE
  );

  if (weddingLoading || guestsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!weddingId) {
    return (
      <EmptyState
        icon={Users}
        title="Belum ada pernikahan"
        description="Buat pernikahan terlebih dahulu"
        actionLabel="Ke Dashboard"
        actionHref="/dashboard"
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daftar Tamu"
        description="Kelola daftar tamu dan RSVP pernikahan"
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <SessionManager weddingId={weddingId} guests={guests} />
            <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}>
              <Upload className="h-4 w-4 mr-1.5" />
              Import CSV
            </Button>
            <Button size="sm" onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Tambah Tamu
            </Button>
          </div>
        }
      />

      <GuestStats guests={(guests ?? []) as Tables<"guests">[]} />

      <GuestFilters
        guests={(guests ?? []) as Tables<"guests">[]}
        search={search}
        onSearchChange={(v) => { setSearch(v); setMobilePage(1); }}
        statusFilter={statusFilter}
        onStatusFilterChange={(v) => { setStatusFilter(v); setMobilePage(1); }}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={(v) => { setCategoryFilter(v); setMobilePage(1); }}
      />

      {filtered.length === 0 && guests && guests.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Belum ada tamu"
          description="Tambahkan tamu atau import dari file CSV"
          actionLabel="Tambah Tamu"
          onAction={() => setFormOpen(true)}
        />
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">
          Tidak ada tamu yang sesuai filter
        </p>
      ) : (
        <>
          {/* Desktop: Table */}
          <div className="hidden md:block">
            <GuestTable guests={filtered} weddingId={weddingId} sessions={sessions} />
          </div>

          {/* Mobile: Cards */}
          <div className="md:hidden space-y-4">
            <GuestCardList guests={pagedMobile as Tables<"guests">[]} weddingId={weddingId} />
            <TablePagination
              currentPage={safeMobilePage}
              totalPages={mobileTotalPages}
              totalItems={filtered.length}
              pageSize={MOBILE_PAGE_SIZE}
              onPageChange={setMobilePage}
              itemLabel="tamu"
            />
          </div>
        </>
      )}

      <GuestFormDialog
        weddingId={weddingId}
        open={formOpen}
        onOpenChange={setFormOpen}
      />

      <GuestImportDialog
        weddingId={weddingId}
        open={importOpen}
        onOpenChange={setImportOpen}
      />
    </div>
  );
}
