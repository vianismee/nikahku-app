"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, X, Check } from "lucide-react";
import { VENDOR_STATUSES, type VendorStatus } from "@/lib/constants/vendor-statuses";
import type { VendorWithRelations } from "@/lib/hooks/use-vendors";

interface VendorPickerProps {
  vendors: VendorWithRelations[];
  value: string; // vendor id or ""
  onValueChange: (id: string) => void;
}

export function VendorPicker({ vendors, value, onValueChange }: VendorPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    } else {
      setSearch("");
      setCatFilter("all");
    }
  }, [open]);

  const selectedVendor = vendors.find((v) => v.id === value);

  // Unique categories derived from vendor list
  const categories = useMemo(() => {
    const seen = new Map<string, string>(); // name → icon
    for (const v of vendors) {
      if (v.vendor_categories) {
        seen.set(v.vendor_categories.name, v.vendor_categories.icon);
      }
    }
    return Array.from(seen.entries()).map(([name, icon]) => ({ name, icon }));
  }, [vendors]);

  const filtered = useMemo(() => {
    let list = vendors;
    if (catFilter !== "all") {
      list = list.filter((v) => v.vendor_categories?.name === catFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.vendor_categories?.name.toLowerCase().includes(q)
      );
    }
    return list;
  }, [vendors, catFilter, search]);

  function select(id: string) {
    onValueChange(id);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <PopoverTrigger
        render={
          <button
            type="button"
            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm ring-offset-background hover:bg-accent/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
          >
            {selectedVendor ? (
              <span className="flex items-center gap-2 truncate min-w-0">
                <span className="text-base shrink-0">
                  {selectedVendor.vendor_categories?.icon ?? "🏢"}
                </span>
                <span className="truncate font-medium">{selectedVendor.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {selectedVendor.vendor_categories?.name}
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground">Pilih vendor (opsional)</span>
            )}
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
          </button>
        }
      />

      {/* Dropdown content */}
      <PopoverContent align="start" side="bottom" className="w-[380px] p-0 overflow-hidden">
        {/* Search bar */}
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama vendor..."
              className="pl-8 h-8 text-sm"
            />
          </div>
        </div>

        {/* Category filter chips */}
        {categories.length > 0 && (
          <div className="flex gap-1.5 px-2 py-2 border-b overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setCatFilter("all")}
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                catFilter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setCatFilter((prev) => (prev === cat.name ? "all" : cat.name))}
                className={`shrink-0 flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                  catFilter === cat.name
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Vendor list */}
        <div className="max-h-56 overflow-y-auto">
          {/* "No vendor" option */}
          <button
            type="button"
            onClick={() => select("")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-muted/50 transition-colors text-left border-b ${
              value === "" ? "bg-muted/20" : ""
            }`}
          >
            {value === "" ? (
              <Check className="h-3.5 w-3.5 text-primary shrink-0" />
            ) : (
              <span className="w-3.5 shrink-0" />
            )}
            <span className="text-muted-foreground italic">Tidak ada / input manual</span>
          </button>

          {filtered.length === 0 && (
            <p className="text-center text-xs text-muted-foreground py-8">
              Vendor tidak ditemukan
            </p>
          )}

          {filtered.map((vendor) => {
            const isSelected = vendor.id === value;
            const status = VENDOR_STATUSES[vendor.status as VendorStatus];

            return (
              <button
                key={vendor.id}
                type="button"
                onClick={() => select(vendor.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-muted/50 transition-colors text-left ${
                  isSelected ? "bg-primary/5" : ""
                }`}
              >
                {isSelected ? (
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                ) : (
                  <span className="w-3.5 shrink-0" />
                )}

                {/* Category icon */}
                <span className="text-base shrink-0 leading-none">
                  {vendor.vendor_categories?.icon ?? "🏢"}
                </span>

                {/* Name + category */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate leading-tight">{vendor.name}</p>
                  {vendor.vendor_categories && (
                    <p className="text-xs text-muted-foreground truncate leading-tight">
                      {vendor.vendor_categories.name}
                    </p>
                  )}
                </div>

                {/* Status badge */}
                {status && (
                  <span
                    className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                    style={{ color: status.color, backgroundColor: status.bgColor }}
                  >
                    {status.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer: selected vendor quick info + clear */}
        {value && selectedVendor && (
          <div className="flex items-center justify-between px-3 py-2 border-t bg-muted/20 text-xs">
            <span className="text-muted-foreground truncate">
              Dipilih:{" "}
              <strong className="text-foreground">{selectedVendor.name}</strong>
            </span>
            <button
              type="button"
              onClick={() => select("")}
              className="ml-2 shrink-0 text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Hapus pilihan vendor"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
