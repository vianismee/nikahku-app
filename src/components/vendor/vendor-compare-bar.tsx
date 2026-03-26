"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/lib/stores/ui-store";
import { GitCompareArrows, X } from "lucide-react";

export function VendorCompareBar() {
  const { vendorCompareIds, clearVendorCompare } = useUIStore();

  if (vendorCompareIds.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 lg:bottom-6">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-background/95 backdrop-blur-sm shadow-lg px-4 py-3">
        <div className="flex items-center gap-2">
          <GitCompareArrows className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">
            {vendorCompareIds.length} vendor dipilih
          </span>
        </div>

        <div className="flex items-center gap-2">
          {vendorCompareIds.length >= 2 ? (
            <Link href="/vendor/compare">
              <Button size="sm" className="gap-1.5">
                <GitCompareArrows className="h-3.5 w-3.5" />
                Bandingkan
              </Button>
            </Link>
          ) : (
            <span className="text-xs text-muted-foreground">
              Pilih min. 2 vendor
            </span>
          )}

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={clearVendorCompare}
            aria-label="Hapus semua"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
