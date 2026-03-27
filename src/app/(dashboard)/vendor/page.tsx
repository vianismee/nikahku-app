"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { VendorGrid } from "@/components/vendor/vendor-grid";
import { VendorListTable } from "@/components/vendor/vendor-list-table";
import { VendorFilters } from "@/components/vendor/vendor-filters";
import { VendorFormSheet } from "@/components/vendor/vendor-form-sheet";
import { VendorCategoryDialog } from "@/components/vendor/vendor-category-dialog";
import { VendorCompareBar } from "@/components/vendor/vendor-compare-bar";
import { useWedding } from "@/lib/hooks/use-wedding";
import { useVendors } from "@/lib/hooks/use-vendors";
import { useUIStore } from "@/lib/stores/ui-store";
import { Store, Plus, FolderPlus, Download } from "lucide-react";
import { downloadCsv } from "@/lib/utils/export-csv";
import { VENDOR_STATUSES } from "@/lib/constants/vendor-statuses";

export default function VendorPage() {
  const { data: wedding, isLoading: weddingLoading } = useWedding();
  const weddingId = wedding?.id;
  const { data: vendors, isLoading: vendorsLoading } = useVendors(weddingId);
  const { vendorViewMode } = useUIStore();

  const [formOpen, setFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    if (!vendors) return [];
    let result = [...vendors];

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.name.toLowerCase().includes(lower) ||
          (v.city?.toLowerCase().includes(lower) ?? false)
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((v) => v.category_id === categoryFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((v) => v.status === statusFilter);
    }

    return result;
  }, [vendors, search, categoryFilter, statusFilter]);

  if (weddingLoading || vendorsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (!weddingId) {
    return (
      <EmptyState
        icon={Store}
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
        title="Vendor"
        description="Cari & kelola vendor pernikahan"
        actions={
          <div className="flex items-center gap-2">
            <VendorCategoryDialog
              weddingId={weddingId}
              trigger={
                <Button variant="outline" size="sm">
                  <FolderPlus className="h-4 w-4 mr-1" />
                  Kategori
                </Button>
              }
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const headers = ["Nama", "Kategori", "Status", "Harga Deal", "Kota", "Telepon", "WhatsApp", "Rating"];
                const rows = (vendors ?? []).map((v) => [
                  v.name,
                  v.vendor_categories?.name ?? "",
                  VENDOR_STATUSES[v.status as keyof typeof VENDOR_STATUSES]?.label ?? v.status,
                  v.price_deal ?? "",
                  v.city ?? "",
                  v.contact_phone ?? "",
                  v.contact_wa ?? "",
                  v.rating ?? "",
                ]);
                downloadCsv("daftar-vendor.csv", headers, rows);
              }}
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button size="sm" onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Tambah Vendor
            </Button>
          </div>
        }
      />

      <VendorFilters
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {filtered.length === 0 && vendors && vendors.length === 0 ? (
        <EmptyState
          icon={Store}
          title="Belum ada vendor"
          description="Tambahkan vendor untuk mulai mengelola"
          actionLabel="Tambah Vendor"
          onAction={() => setFormOpen(true)}
        />
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">
          Tidak ada vendor yang sesuai filter
        </p>
      ) : vendorViewMode === "grid" ? (
        <VendorGrid vendors={filtered} />
      ) : (
        <VendorListTable vendors={filtered} />
      )}

      <VendorFormSheet
        weddingId={weddingId}
        open={formOpen}
        onOpenChange={setFormOpen}
      />

      <VendorCompareBar />
    </div>
  );
}
