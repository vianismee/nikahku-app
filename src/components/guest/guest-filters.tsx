"use client";

import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/lib/stores/ui-store";
import { RSVP_STATUSES, type RsvpStatus } from "@/lib/constants/rsvp-statuses";
import { Search, LayoutGrid, List } from "lucide-react";
import type { Tables } from "@/lib/supabase/database.types";

interface GuestFiltersProps {
  guests: Tables<"guests">[];
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
}

export function GuestFilters({
  guests,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
}: GuestFiltersProps) {
  const { guestViewMode, setGuestViewMode } = useUIStore();

  const categories = useMemo(() => {
    const cats = new Set(guests.map((g) => g.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [guests]);

  const statusItems = [
    { value: "semua", label: "Semua Status" },
    ...Object.entries(RSVP_STATUSES).map(([key, { label }]) => ({
      value: key,
      label,
    })),
  ];

  const categoryItems = [
    { value: "semua", label: "Semua Kategori" },
    ...categories.map((c) => ({ value: c, label: c })),
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama tamu..."
          className="pl-9"
        />
      </div>

      <Select
        value={statusFilter}
        onValueChange={(v) => onStatusFilterChange(v ?? "semua")}
        items={statusItems}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Semua Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="semua">Semua Status</SelectItem>
          {(Object.entries(RSVP_STATUSES) as [RsvpStatus, { label: string }][]).map(
            ([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>

      <Select
        value={categoryFilter}
        onValueChange={(v) => onCategoryFilterChange(v ?? "semua")}
        items={categoryItems}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Semua Kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="semua">Semua Kategori</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="hidden sm:flex items-center gap-1 border border-border rounded-md p-1">
        <Button
          variant={guestViewMode === "list" ? "secondary" : "ghost"}
          size="icon-sm"
          onClick={() => setGuestViewMode("list")}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={guestViewMode === "grid" ? "secondary" : "ghost"}
          size="icon-sm"
          onClick={() => setGuestViewMode("grid")}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
