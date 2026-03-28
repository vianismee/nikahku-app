"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { VENDOR_STATUSES } from "@/lib/constants/vendor-statuses";
import { formatRupiah, getVendorPriceInfo } from "@/lib/utils/format-currency";
import { Star, MapPin, ChevronRight } from "lucide-react";
import { useUIStore } from "@/lib/stores/ui-store";
import type { VendorWithRelations } from "@/lib/hooks/use-vendors";

interface VendorCardProps {
  vendor: VendorWithRelations;
}

export function VendorCard({ vendor }: VendorCardProps) {
  const {
    vendorCompareIds,
    vendorCompareCategoryId,
    addVendorCompare,
    removeVendorCompare,
  } = useUIStore();
  const statusInfo = VENDOR_STATUSES[vendor.status];
  const isComparing = vendorCompareIds.includes(vendor.id);
  const category = vendor.vendor_categories;
  const categoryColor = category?.color ?? "#8B6F4E";

  // Disable checkbox if different category is already selected, or max reached
  const isDifferentCategory =
    vendorCompareCategoryId !== null &&
    vendor.category_id !== vendorCompareCategoryId;
  const isMaxReached =
    vendorCompareIds.length >= 4 && !isComparing;
  const isDisabled = isDifferentCategory || isMaxReached;

  const tooltipText = isDifferentCategory
    ? "Hanya bisa membandingkan vendor dengan kategori yang sama"
    : isMaxReached
      ? "Maksimal 4 vendor"
      : "";

  const checkbox = (
    <Checkbox
      checked={isComparing}
      disabled={isDisabled}
      onCheckedChange={(checked) => {
        if (checked) addVendorCompare(vendor.id, vendor.category_id);
        else removeVendorCompare(vendor.id);
      }}
      aria-label="Bandingkan"
    />
  );

  return (
    <Link href={`/vendor/${vendor.id}`}>
      <Card
        className={`group hover:border-primary/40 transition-all overflow-hidden ${
          isComparing ? "ring-2 ring-primary/40 border-primary/40" : ""
        }`}
      >
        {/* Category Header */}
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{ backgroundColor: `${categoryColor}10` }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center h-9 w-9 rounded-lg text-lg"
              style={{ backgroundColor: `${categoryColor}20` }}
            >
              {category?.icon ?? "📦"}
            </div>
            <div>
              <span className="text-xs font-medium" style={{ color: categoryColor }}>
                {category?.name ?? "Lainnya"}
              </span>
            </div>
          </div>
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {isDisabled && tooltipText ? (
              <Tooltip>
                <TooltipTrigger render={<span className="inline-flex" />}>
                  {checkbox}
                </TooltipTrigger>
                <TooltipContent>{tooltipText}</TooltipContent>
              </Tooltip>
            ) : (
              checkbox
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-4 py-3.5 space-y-3">
          {/* Name + City */}
          <div>
            <h3 className="font-heading font-semibold text-base group-hover:text-primary transition-colors line-clamp-1">
              {vendor.name}
            </h3>
            {vendor.city && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <MapPin className="h-3 w-3 shrink-0" />
                {vendor.city}
              </div>
            )}
          </div>

          {/* Rating */}
          {vendor.rating ? (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < vendor.rating!
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/20"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-number text-muted-foreground">{vendor.rating}/5</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 text-muted-foreground/20" />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">Belum dirating</span>
            </div>
          )}

          {/* Divider */}
          <hr className="border-border" />

          {/* Footer: Status + Price */}
          <div className="flex items-center justify-between gap-2">
            <StatusBadge {...statusInfo} />
            <div className="shrink-0 text-right min-w-0">
              {(() => {
                const info = getVendorPriceInfo(vendor);
                if (info.type === "deal") {
                  return (
                    <span className="font-number text-xs sm:text-sm font-bold whitespace-nowrap text-primary">
                      {formatRupiah(info.deal)}
                    </span>
                  );
                }
                if (info.type === "range") {
                  return info.min === info.max ? (
                    <span className="font-number text-xs font-semibold whitespace-nowrap">
                      {formatRupiah(info.min)}
                    </span>
                  ) : (
                    <span className="font-number text-[10px] sm:text-xs whitespace-nowrap text-muted-foreground">
                      {formatRupiah(info.min)} – {formatRupiah(info.max)}
                    </span>
                  );
                }
                return (
                  <span className="text-[10px] sm:text-xs text-muted-foreground italic whitespace-nowrap">
                    Belum ada harga
                  </span>
                );
              })()}
            </div>
          </div>

          {/* Detail Link Hint */}
          <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
            Lihat detail
            <ChevronRight className="h-3 w-3" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
