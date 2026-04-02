"use client";

import { VendorCard } from "./vendor-card";
import type { VendorWithRelations } from "@/lib/hooks/use-vendors";

interface VendorGridProps {
  vendors: VendorWithRelations[];
  weddingId: string;
}

export function VendorGrid({ vendors, weddingId }: VendorGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {vendors.map((vendor) => (
        <VendorCard key={vendor.id} vendor={vendor} weddingId={weddingId} />
      ))}
    </div>
  );
}
