"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/lib/stores/ui-store";
import { GitCompareArrows, X } from "lucide-react";

export function VendorCompareBar() {
  const { vendorCompareIds, clearVendorCompare } = useUIStore();

  if (vendorCompareIds.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 lg:bottom-6 lg:left-1/2 lg:right-auto lg:-translate-x-1/2 lg:w-auto">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/95 backdrop-blur-sm shadow-lg px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <GitCompareArrows className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm font-medium truncate">
            {vendorCompareIds.length} vendor dipilih
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
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
