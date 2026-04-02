"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { VendorFormSheet } from "@/components/vendor/vendor-form-sheet";
import { VENDOR_STATUSES, VENDOR_STATUS_PIPELINE } from "@/lib/constants/vendor-statuses";
import { formatRupiah } from "@/lib/utils/format-currency";
import { useDeleteVendor, useUpdateVendor } from "@/lib/hooks/use-vendors";
import { Pencil, Trash2, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { toast } from "sonner";
import type { VendorWithRelations, VendorDetail } from "@/lib/hooks/use-vendors";
import type { VendorStatus } from "@/lib/constants/vendor-statuses";

interface VendorCardProps {
  vendor: VendorWithRelations;
  weddingId: string;
}

export function VendorCard({ vendor, weddingId }: VendorCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const deleteVendor = useDeleteVendor();
  const updateVendor = useUpdateVendor();

  const category = vendor.vendor_categories;

  // Estimasi: price range from packages
  const packagePrices = (vendor.vendor_packages ?? [])
    .map((p) => p.price)
    .filter((p) => p > 0)
    .sort((a, b) => a - b);
  const estimasi =
    packagePrices.length === 0
      ? "–"
      : packagePrices.length === 1 || packagePrices[0] === packagePrices[packagePrices.length - 1]
        ? formatRupiah(packagePrices[0])
        : `${formatRupiah(packagePrices[0])} – ${formatRupiah(packagePrices[packagePrices.length - 1])}`;

  // Deal: price_deal
  const deal = formatRupiah(vendor.price_deal ?? 0);

  // Contact
  const contact = vendor.contact_wa ?? vendor.contact_phone ?? "–";

  // Status pipeline navigation
  const isCancelled = vendor.status === "cancelled";
  const currentIdx = VENDOR_STATUS_PIPELINE.indexOf(vendor.status as VendorStatus);
  const prevStatus = !isCancelled && currentIdx > 0 ? VENDOR_STATUS_PIPELINE[currentIdx - 1] : null;
  const nextStatus =
    !isCancelled && currentIdx >= 0 && currentIdx < VENDOR_STATUS_PIPELINE.length - 1
      ? VENDOR_STATUS_PIPELINE[currentIdx + 1]
      : null;
  const nextLabel = nextStatus
    ? VENDOR_STATUSES[nextStatus].label
    : VENDOR_STATUSES[vendor.status as VendorStatus].label;

  async function handleDelete() {
    try {
      await deleteVendor.mutateAsync({ id: vendor.id, weddingId });
      toast.success("Vendor berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus vendor");
    }
  }

  function handleStatusChange(newStatus: VendorStatus) {
    updateVendor.mutate({ id: vendor.id, status: newStatus });
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-xl border border-border/60 p-3.5 space-y-2.5 hover:shadow-md transition-all bg-gradient-to-br from-rose-soft/25 via-card to-muted/15">
        {/* Header: Name + Category badge | Edit + Delete buttons */}
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <Link href={`/vendor/${vendor.id}`}>
              <p className="font-heading font-semibold text-sm break-words hover:text-primary transition-colors">
                {vendor.name}
              </p>
            </Link>
            {category && (
              <Badge variant="outline" className="h-6 font-normal text-xs mt-1">
                {category.name}
              </Badge>
            )}
          </div>
          <div className="flex gap-0.5 shrink-0">
            <button
              className="p-1.5 rounded-lg hover:bg-accent"
              onClick={() => setEditOpen(true)}
              aria-label="Edit vendor"
            >
              <Pencil className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            </button>
            <ConfirmDialog
              trigger={
                <button
                  className="p-1.5 rounded-lg hover:bg-destructive/10"
                  aria-label="Hapus vendor"
                >
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" aria-hidden="true" />
                </button>
              }
              title="Hapus Vendor"
              description={`Yakin ingin menghapus vendor "${vendor.name}"? Tindakan ini tidak dapat dibatalkan.`}
              onConfirm={handleDelete}
            />
          </div>
        </div>

        {/* Price Grid */}
        <div className="grid grid-cols-2 gap-x-3 text-sm">
          <div>
            <p className="text-[10px] text-muted-foreground">Estimasi</p>
            <p className="font-number font-medium tabular-nums text-xs">{estimasi}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Deal</p>
            <p className="font-number font-semibold tabular-nums text-xs text-primary">{deal}</p>
          </div>
        </div>

        {/* Contact + Rating */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40">
          <p className="text-xs text-muted-foreground">{contact}</p>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  vendor.rating && i < vendor.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground/20"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Status Navigation */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40">
          <button
            disabled={!prevStatus}
            onClick={() => prevStatus && handleStatusChange(prevStatus)}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition-colors text-muted-foreground hover:bg-accent hover:text-foreground disabled:text-muted-foreground/20 disabled:cursor-default disabled:pointer-events-none"
            aria-label="Status sebelumnya"
          >
            <ChevronLeft className="h-3 w-3" aria-hidden="true" />
          </button>
          <button
            disabled={!nextStatus}
            onClick={() => nextStatus && handleStatusChange(nextStatus)}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition-colors text-muted-foreground hover:bg-accent hover:text-foreground disabled:text-muted-foreground/20 disabled:cursor-default disabled:pointer-events-none"
          >
            {nextLabel}
            <ChevronRight className="h-3 w-3" aria-hidden="true" />
          </button>
        </div>
      </div>

      <VendorFormSheet
        weddingId={weddingId}
        vendor={vendor as unknown as VendorDetail}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}
