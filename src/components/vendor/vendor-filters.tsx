"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVendorCategories } from "@/lib/hooks/use-vendors";
import { VENDOR_STATUSES, type VendorStatus } from "@/lib/constants/vendor-statuses";
import { useUIStore } from "@/lib/stores/ui-store";
import { Search, LayoutGrid, List, GitCompareArrows } from "lucide-react";
import Link from "next/link";

interface VendorFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

export function VendorFilters({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
}: VendorFiltersProps) {
  const { data: categories } = useVendorCategories();
  const { vendorViewMode, setVendorViewMode, vendorCompareIds } = useUIStore();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari vendor..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select
        value={categoryFilter}
        onValueChange={(v) => onCategoryChange(v ?? "all")}
        items={[
          { value: "all", label: "Semua Kategori" },
          ...(categories?.map((cat) => ({ value: cat.id, label: `${cat.icon} ${cat.name}` })) ?? []),
        ]}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Semua Kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Kategori</SelectItem>
          {categories?.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={(v) => onStatusChange(v ?? "all")}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Semua Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Status</SelectItem>
          {(Object.entries(VENDOR_STATUSES) as [VendorStatus, { label: string }][]).map(
            ([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2 ml-auto">
        {vendorCompareIds.length >= 2 && (
          <Link href="/vendor/compare">
            <Button variant="outline" size="sm">
              <GitCompareArrows className="h-4 w-4 mr-1" />
              Bandingkan ({vendorCompareIds.length})
            </Button>
          </Link>
        )}

        <div className="flex items-center border rounded-lg">
          <Button
            variant={vendorViewMode === "grid" ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => setVendorViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={vendorViewMode === "list" ? "secondary" : "ghost"}
            size="icon-sm"
            onClick={() => setVendorViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
