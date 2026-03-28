"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SeserahanSummary } from "@/components/seserahan/seserahan-summary";
import { SeserahanTable } from "@/components/seserahan/seserahan-table";
import { SeserahanCardList } from "@/components/seserahan/seserahan-card-list";
import { SeserahanFormDialog } from "@/components/seserahan/seserahan-form-dialog";
import { useWedding } from "@/lib/hooks/use-wedding";
import { useSeserahan } from "@/lib/hooks/use-seserahan";
import { useUIStore } from "@/lib/stores/ui-store";
import { TablePagination } from "@/components/shared/table-pagination";
import { Gift, Plus, Download } from "lucide-react";
import { downloadCsv } from "@/lib/utils/export-csv";
import { SESERAHAN_CATEGORIES, type SeserahanCategory } from "@/lib/constants/seserahan-statuses";

const MOBILE_PAGE_SIZE = 10;

export default function SeserahanPage() {
  const { data: wedding, isLoading: weddingLoading } = useWedding();
  const weddingId = wedding?.id;
  const { data: items, isLoading: itemsLoading } = useSeserahan(weddingId);
  const { seserahanTab, setSeserahanTab } = useUIStore();
  const [formOpen, setFormOpen] = useState(false);
  const [mobilePage, setMobilePage] = useState(1);

  const filtered = useMemo(() => {
    if (!items) return [];
    if (seserahanTab === "semua") return items;
    return items.filter((i) => i.category === seserahanTab);
  }, [items, seserahanTab]);

  const mobileTotalPages = Math.max(1, Math.ceil(filtered.length / MOBILE_PAGE_SIZE));
  const safeMobilePage = Math.min(mobilePage, mobileTotalPages);
  const pagedMobile = filtered.slice(
    (safeMobilePage - 1) * MOBILE_PAGE_SIZE,
    safeMobilePage * MOBILE_PAGE_SIZE
  );

  const defaultCategory: SeserahanCategory | undefined =
    seserahanTab === "mahar" || seserahanTab === "seserahan" ? seserahanTab : undefined;

  if (weddingLoading || itemsLoading) {
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
        icon={Gift}
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
        title="Mahar & Seserahan"
        description="Kelola daftar mahar dan seserahan pernikahan"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const headers = ["Nama Item", "Kategori", "Merek", "Harga Min", "Harga Maks", "Status", "Toko"];
                const rows = (items ?? []).map((i) => [
                  i.item_name,
                  SESERAHAN_CATEGORIES[i.category as SeserahanCategory] ?? i.category,
                  i.brand ?? "",
                  i.price_min,
                  i.price_max,
                  i.purchase_status,
                  i.shop_url ?? "",
                ]);
                downloadCsv("mahar-seserahan.csv", headers, rows);
              }}
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button size="sm" onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Tambah Item
            </Button>
          </div>
        }
      />

      <Tabs
        value={seserahanTab}
        onValueChange={(v) => { setSeserahanTab(v as "semua" | "mahar" | "seserahan"); setMobilePage(1); }}
      >
        <TabsList>
          <TabsTrigger value="semua">Semua</TabsTrigger>
          <TabsTrigger value="mahar">Mahar</TabsTrigger>
          <TabsTrigger value="seserahan">Seserahan</TabsTrigger>
        </TabsList>

        <TabsContent value={seserahanTab}>
          <div className="space-y-6">
            <SeserahanSummary items={filtered} />

            {filtered.length === 0 && items && items.length === 0 ? (
              <EmptyState
                icon={Gift}
                title="Belum ada item"
                description="Tambahkan mahar atau seserahan untuk mulai mengelola"
                actionLabel="Tambah Item"
                onAction={() => setFormOpen(true)}
              />
            ) : filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12">
                Tidak ada item dalam kategori ini
              </p>
            ) : (
              <>
                {/* Desktop: Table */}
                <div className="hidden md:block">
                  <SeserahanTable items={filtered} weddingId={weddingId} />
                </div>

                {/* Mobile: Cards */}
                <div className="md:hidden space-y-4">
                  <SeserahanCardList items={pagedMobile} weddingId={weddingId} />
                  <TablePagination
                    currentPage={safeMobilePage}
                    totalPages={mobileTotalPages}
                    totalItems={filtered.length}
                    pageSize={MOBILE_PAGE_SIZE}
                    onPageChange={setMobilePage}
                    itemLabel="item"
                  />
                </div>
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <SeserahanFormDialog
        weddingId={weddingId}
        open={formOpen}
        onOpenChange={setFormOpen}
        defaultCategory={defaultCategory}
      />
    </div>
  );
}
