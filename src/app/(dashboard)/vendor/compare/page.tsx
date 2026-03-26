"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VendorCompareTable } from "@/components/vendor/vendor-compare-table";
import { useVendor } from "@/lib/hooks/use-vendors";
import { useUIStore } from "@/lib/stores/ui-store";
import { ArrowLeft, GitCompareArrows, Trash2, X } from "lucide-react";

function VendorChip({
  id,
  onRemove,
}: {
  id: string;
  onRemove: () => void;
}) {
  const { data: vendor, isLoading } = useVendor(id);

  return (
    <Badge
      variant="outline"
      className="gap-1.5 py-1.5 px-3 text-sm font-normal cursor-default"
    >
      {isLoading ? (
        <span className="text-muted-foreground">Memuat...</span>
      ) : (
        <>
          <span className="text-base">{vendor?.vendor_categories?.icon ?? "📦"}</span>
          <span className="font-medium">{vendor?.name ?? "Vendor"}</span>
        </>
      )}
      <button
        onClick={onRemove}
        className="ml-0.5 rounded-full p-0.5 hover:bg-muted transition-colors"
        aria-label={`Hapus ${vendor?.name ?? "vendor"}`}
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}

function VendorQueryWrapper({ ids }: { ids: string[] }) {
  const queries = ids.map((id) => useVendor(id));
  const isLoading = queries.some((q) => q.isLoading);
  const vendors = queries
    .map((q) => q.data)
    .filter(Boolean) as Parameters<typeof VendorCompareTable>[0]["vendors"];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (vendors.length < 2) {
    return (
      <p className="text-sm text-muted-foreground text-center py-12">
        Beberapa vendor tidak ditemukan
      </p>
    );
  }

  return <VendorCompareTable vendors={vendors} />;
}

export default function VendorComparePage() {
  const { vendorCompareIds, removeVendorCompare, clearVendorCompare } =
    useUIStore();

  if (vendorCompareIds.length < 2) {
    return (
      <div className="space-y-6">
        <Link
          href="/vendor"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Vendor
        </Link>
        <EmptyState
          icon={GitCompareArrows}
          title="Pilih minimal 2 vendor"
          description="Kembali ke daftar vendor dan centang vendor yang ingin dibandingkan (maksimal 4 vendor)"
          actionLabel="Ke Daftar Vendor"
          actionHref="/vendor"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/vendor"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Vendor
      </Link>

      <PageHeader
        title="Bandingkan Vendor"
        description={`Membandingkan ${vendorCompareIds.length} vendor secara berdampingan`}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={clearVendorCompare}
            className="gap-1.5 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Hapus Semua
          </Button>
        }
      />

      {/* Vendor chips with names */}
      <div className="flex flex-wrap gap-2">
        {vendorCompareIds.map((id) => (
          <VendorChip
            key={id}
            id={id}
            onRemove={() => removeVendorCompare(id)}
          />
        ))}
      </div>

      <VendorQueryWrapper ids={vendorCompareIds} />
    </div>
  );
}
