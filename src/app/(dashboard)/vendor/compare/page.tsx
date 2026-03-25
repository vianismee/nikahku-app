"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VendorCompareTable } from "@/components/vendor/vendor-compare-table";
import { useVendor } from "@/lib/hooks/use-vendors";
import { useUIStore } from "@/lib/stores/ui-store";
import { ArrowLeft, GitCompareArrows, Trash2 } from "lucide-react";

function VendorQueryWrapper({ ids }: { ids: string[] }) {
  // Fetch each vendor individually
  const queries = ids.map((id) => useVendor(id));
  const isLoading = queries.some((q) => q.isLoading);
  const vendors = queries
    .map((q) => q.data)
    .filter(Boolean) as Parameters<typeof VendorCompareTable>[0]["vendors"];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {ids.map((id) => (
          <Skeleton key={id} className="h-64" />
        ))}
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

  return (
    <Card>
      <CardContent className="pt-6">
        <VendorCompareTable vendors={vendors} />
      </CardContent>
    </Card>
  );
}

export default function VendorComparePage() {
  const { vendorCompareIds, removeVendorCompare, clearVendorCompare } = useUIStore();

  if (vendorCompareIds.length < 2) {
    return (
      <div className="space-y-6">
        <Link href="/vendor" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Vendor
        </Link>
        <EmptyState
          icon={GitCompareArrows}
          title="Pilih minimal 2 vendor"
          description="Kembali ke daftar vendor dan centang vendor yang ingin dibandingkan"
          actionLabel="Ke Daftar Vendor"
          actionHref="/vendor"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/vendor" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Vendor
      </Link>

      <PageHeader
        title="Bandingkan Vendor"
        description={`Membandingkan ${vendorCompareIds.length} vendor`}
        actions={
          <Button variant="outline" size="sm" onClick={clearVendorCompare}>
            <Trash2 className="h-4 w-4 mr-1" />
            Hapus Semua
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2">
        {vendorCompareIds.map((id) => (
          <Button
            key={id}
            variant="outline"
            size="sm"
            onClick={() => removeVendorCompare(id)}
            className="gap-1"
          >
            {id.slice(0, 8)}...
            <Trash2 className="h-3 w-3" />
          </Button>
        ))}
      </div>

      <VendorQueryWrapper ids={vendorCompareIds} />
    </div>
  );
}
