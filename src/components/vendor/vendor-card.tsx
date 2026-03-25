"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Checkbox } from "@/components/ui/checkbox";
import { VENDOR_STATUSES } from "@/lib/constants/vendor-statuses";
import { formatRupiah } from "@/lib/utils/format-currency";
import { Star, MapPin, ChevronRight } from "lucide-react";
import { useUIStore } from "@/lib/stores/ui-store";
import type { VendorWithRelations } from "@/lib/hooks/use-vendors";

interface VendorCardProps {
  vendor: VendorWithRelations;
}

export function VendorCard({ vendor }: VendorCardProps) {
  const { vendorCompareIds, addVendorCompare, removeVendorCompare } = useUIStore();
  const statusInfo = VENDOR_STATUSES[vendor.status];
  const isComparing = vendorCompareIds.includes(vendor.id);
  const category = vendor.vendor_categories;
  const categoryColor = category?.color ?? "#8B6F4E";

  return (
    <Link href={`/vendor/${vendor.id}`}>
      <Card className="group hover:border-primary/40 transition-all overflow-hidden">
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
            <Checkbox
              checked={isComparing}
              onCheckedChange={(checked) => {
                if (checked) addVendorCompare(vendor.id);
                else removeVendorCompare(vendor.id);
              }}
              aria-label="Bandingkan"
            />
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
          <div className="flex items-center justify-between">
            <StatusBadge {...statusInfo} />
            <div className="text-right">
              {vendor.price_deal ? (
                <span className="font-number text-sm font-bold">
                  {formatRupiah(vendor.price_deal)}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground italic">Belum ada harga</span>
              )}
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
