"use client";

import React, { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GuestStats } from "@/components/guest/guest-stats";
import { GuestFilters } from "@/components/guest/guest-filters";
import { GuestTable } from "@/components/guest/guest-table";
import { GuestCardList } from "@/components/guest/guest-card-list";
import { GuestFormDialog } from "@/components/guest/guest-form-dialog";
import { SessionManager } from "@/components/guest/session-manager";
import { GuestImportDialog } from "@/components/guest/guest-import-dialog";
import { WishModeration } from "@/components/guest/wish-moderation";
import { RsvpSettingsPanel } from "@/components/guest/rsvp-settings-panel";
import { useWedding } from "@/lib/hooks/use-wedding";
import { useGuests, useSessions } from "@/lib/hooks/use-guests";
import { TablePagination } from "@/components/shared/table-pagination";
import { downloadAllQrZip } from "@/lib/utils/qr-download";
import { Users, Plus, Upload, QrCode, Heart, Settings } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/lib/supabase/database.types";

const MOBILE_PAGE_SIZE = 10;

type GuestWithSessions = Tables<"guests"> & {
  guest_sessions?: { session_id: string }[];
};

type TabValue = "tamu" | "ucapan" | "souvenir" | "rsvp";

export default function GuestPage() {
  const { data: wedding, isLoading: weddingLoading } = useWedding();
  const weddingId = wedding?.id;
  const { data: rawGuests, isLoading: guestsLoading } = useGuests(weddingId);
  const { data: sessions } = useSessions(weddingId);
  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [bulkQrLoading, setBulkQrLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabValue>("tamu");

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

  // Souvenir stats
  const souvenirTaken = guests?.filter((g) => g.souvenir_taken).length ?? 0;
  const souvenirTotal = guests?.length ?? 0;

  async function handleDownloadAllQr() {
    if (!guests?.length || !wedding) return;
    setBulkQrLoading(true);
    try {
      const coupleName = `${wedding.partner_1_name} & ${wedding.partner_2_name}`;
      await downloadAllQrZip(
        guests.map((g) => ({ nano_id: g.nano_id, name: g.name })),
        coupleName
      );
      toast.success("ZIP semua QR berhasil didownload");
    } catch {
      toast.error("Gagal mendownload QR");
    }
    setBulkQrLoading(false);
  }

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

  const rsvpSlug = wedding?.rsvp_slug ?? "";
  const coupleName = wedding ? `${wedding.partner_1_name} & ${wedding.partner_2_name}` : "";
  const weddingDate = wedding?.wedding_date ?? null;

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
        description="Kelola daftar tamu, RSVP, ucapan, dan souvenir"
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

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
        {/* ── Mobile tab switcher (grid 2×2) ── */}
        <div className="grid grid-cols-2 gap-2 sm:hidden">
          {(
            [
              { value: "tamu",     icon: Users,    label: "Tamu",      badge: guests?.length },
              { value: "ucapan",   icon: Heart,    label: "Ucapan" },
              { value: "souvenir", icon: QrCode,   label: "QR & Souvenir" },
              { value: "rsvp",     icon: Settings, label: "Pengaturan RSVP" },
            ] as { value: TabValue; icon: React.ElementType; label: string; badge?: number }[]
          ).map(({ value, icon: Icon, label, badge }) => (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
              className={`flex items-center gap-2.5 rounded-xl border px-3 py-3 text-left transition-colors ${
                activeTab === value
                  ? "border-primary/40 bg-primary/8 text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-muted/60"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="text-xs font-medium leading-tight">{label}</span>
              {badge ? (
                <Badge variant="secondary" className="ml-auto text-xs h-4 px-1.5 shrink-0">{badge}</Badge>
              ) : null}
            </button>
          ))}
        </div>

        {/* ── Desktop TabsList ── */}
        <TabsList className="hidden sm:inline-flex">
          <TabsTrigger value="tamu" className="gap-1.5">
            <Users className="w-3.5 h-3.5" />
            Tamu
            {guests?.length ? (
              <Badge variant="secondary" className="text-xs h-4 px-1.5">{guests.length}</Badge>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="ucapan" className="gap-1.5">
            <Heart className="w-3.5 h-3.5" />
            Ucapan
          </TabsTrigger>
          <TabsTrigger value="souvenir" className="gap-1.5">
            <QrCode className="w-3.5 h-3.5" />
            QR &amp; Souvenir
          </TabsTrigger>
          <TabsTrigger value="rsvp" className="gap-1.5">
            <Settings className="w-3.5 h-3.5" />
            Pengaturan RSVP
          </TabsTrigger>
        </TabsList>

        {/* ── Tab: Tamu ─────────────────────────────────────────── */}
        <TabsContent value="tamu" className="space-y-4 mt-4">
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
              <div className="hidden md:block">
                <GuestTable guests={filtered} weddingId={weddingId} sessions={sessions} rsvpSlug={rsvpSlug} coupleName={coupleName} weddingDate={weddingDate} />
              </div>
              <div className="md:hidden space-y-4">
                <GuestCardList guests={pagedMobile as Tables<"guests">[]} weddingId={weddingId} rsvpSlug={rsvpSlug} coupleName={coupleName} weddingDate={weddingDate} />
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
        </TabsContent>

        {/* ── Tab: Ucapan ───────────────────────────────────────── */}
        <TabsContent value="ucapan" className="mt-4">
          <WishModeration weddingId={weddingId} />
        </TabsContent>

        {/* ── Tab: QR & Souvenir ────────────────────────────────── */}
        <TabsContent value="souvenir" className="mt-4 space-y-4">
          {/* Souvenir stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{souvenirTaken}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Souvenir Diambil</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{souvenirTotal - souvenirTaken}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Belum Diambil</div>
            </div>
          </div>

          {souvenirTotal > 0 && (
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${Math.round((souvenirTaken / souvenirTotal) * 100)}%` }}
              />
            </div>
          )}

          {/* Bulk QR download */}
          <div className="flex items-center justify-between gap-3 p-4 border rounded-xl">
            <div>
              <p className="text-sm font-medium">Download Semua QR</p>
              <p className="text-xs text-muted-foreground">
                ZIP berisi PNG per tamu ({guests?.length ?? 0} file)
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadAllQr}
              disabled={bulkQrLoading || !guests?.length}
            >
              <QrCode className="w-3.5 h-3.5 mr-1.5" />
              {bulkQrLoading ? "Generating..." : "Download ZIP"}
            </Button>
          </div>

          {/* Table: souvenir status per guest */}
          {guests && guests.length > 0 && (
            <div className="border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 text-left">
                    <th className="px-4 py-2.5 font-medium">Tamu</th>
                    <th className="px-4 py-2.5 font-medium">Kode</th>
                    <th className="px-4 py-2.5 font-medium">Souvenir</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {guests.map((g) => (
                    <tr key={g.id} className="hover:bg-muted/30">
                      <td className="px-4 py-2.5">{g.name}</td>
                      <td className="px-4 py-2.5 font-mono text-xs">{g.nano_id}</td>
                      <td className="px-4 py-2.5">
                        {g.souvenir_taken ? (
                          <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                            Sudah Diambil
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">Belum</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        {/* ── Tab: Pengaturan RSVP ──────────────────────────────── */}
        <TabsContent value="rsvp" className="mt-4">
          {wedding && <RsvpSettingsPanel wedding={wedding as Tables<"weddings">} />}
        </TabsContent>
      </Tabs>

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
