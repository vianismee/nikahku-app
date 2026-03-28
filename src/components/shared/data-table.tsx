"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TablePagination } from "@/components/shared/table-pagination";
import { Search, ChevronUp, ChevronDown } from "lucide-react";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: string[];
  emptyMessage?: string;
  actions?: React.ReactNode;
  pageSize?: number;
  itemLabel?: string;
}

type SortDirection = "asc" | "desc" | null;

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  searchable = false,
  searchPlaceholder = "Cari...",
  searchKeys = [],
  emptyMessage = "Tidak ada data",
  actions,
  pageSize = 10,
  itemLabel = "data",
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter
  let filtered = data;
  if (search && searchKeys.length > 0) {
    const lower = search.toLowerCase();
    filtered = data.filter((item) =>
      searchKeys.some((key) => {
        const val = item[key];
        return typeof val === "string" && val.toLowerCase().includes(lower);
      })
    );
  }

  // Sort
  if (sortKey && sortDir) {
    filtered = [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = String(aVal).localeCompare(String(bVal), "id", { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }

  // Pagination
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  function handleSort(key: string) {
    setCurrentPage(1);
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : sortDir === "desc" ? null : "asc");
      if (sortDir === "desc") setSortKey(null);
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <div className="space-y-4">
      {(searchable || actions) && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {searchable && (
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="pl-9"
              />
            </div>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.sortable ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3 h-8 font-medium"
                      onClick={() => handleSort(col.key)}
                    >
                      {col.header}
                      {sortKey === col.key && sortDir === "asc" && (
                        <ChevronUp className="ml-1 h-3 w-3" />
                      )}
                      {sortKey === col.key && sortDir === "desc" && (
                        <ChevronDown className="ml-1 h-3 w-3" />
                      )}
                    </Button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8 text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paged.map((item, i) => (
                <TableRow key={(item.id as string) ?? i}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.render
                        ? col.render(item)
                        : (item[col.key] as React.ReactNode) ?? "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentPage={safePage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        itemLabel={itemLabel}
      />
    </div>
  );
}
