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
import { useWedding } from "@/lib/hooks/use-wedding";
import { useGuests } from "@/lib/hooks/use-guests";
import { Users, Plus } from "lucide-react";
import type { Tables } from "@/lib/supabase/database.types";

type Guest = Tables<"guests">;

export default function GuestPage() {
  const { data: wedding, isLoading: weddingLoading } = useWedding();
  const weddingId = wedding?.id;
  const { data: rawGuests, isLoading: guestsLoading } = useGuests(weddingId);
  const [formOpen, setFormOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");
  const [categoryFilter, setCategoryFilter] = useState("semua");

  const guests = rawGuests as Guest[] | undefined;

  const filtered = useMemo(() => {
    if (!guests) return [] as Guest[];
    let result: Guest[] = guests;

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
          <Button size="sm" onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Tambah Tamu
          </Button>
        }
      />

      <GuestStats guests={guests ?? []} />

      <GuestFilters
        guests={guests ?? []}
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
      />

      {filtered.length === 0 && guests && guests.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Belum ada tamu"
          description="Tambahkan tamu untuk mulai mengelola daftar undangan"
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
            <GuestTable guests={filtered} weddingId={weddingId} />
          </div>

          {/* Mobile: Cards */}
          <div className="md:hidden">
            <GuestCardList guests={filtered} weddingId={weddingId} />
          </div>
        </>
      )}

      <GuestFormDialog
        weddingId={weddingId}
        open={formOpen}
        onOpenChange={setFormOpen}
      />
    </div>
  );
}
