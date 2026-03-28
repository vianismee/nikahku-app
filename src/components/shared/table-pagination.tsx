"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  itemLabel = "data",
}: TablePaginationProps) {
  const safePage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));
  const start = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, totalItems);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
    .reduce<(number | "...")[]>((acc, p, idx, arr) => {
      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
      acc.push(p);
      return acc;
    }, []);

  return (
    <div className="flex items-center justify-between gap-4 px-1">
      <p className="text-xs text-muted-foreground">
        Menampilkan{" "}
        <span className="font-medium text-foreground">
          {start}–{end}
        </span>{" "}
        dari{" "}
        <span className="font-medium text-foreground">{totalItems}</span>{" "}
        {itemLabel}
      </p>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => onPageChange(1)}
            disabled={safePage === 1}
            aria-label="Halaman pertama"
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => onPageChange(safePage - 1)}
            disabled={safePage === 1}
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>

          <div className="flex items-center gap-1">
            {pageNumbers.map((item, idx) =>
              item === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-1 text-xs text-muted-foreground"
                >
                  …
                </span>
              ) : (
                <Button
                  key={item}
                  variant={safePage === item ? "default" : "outline"}
                  size="icon"
                  className="h-7 w-7 text-xs"
                  onClick={() => onPageChange(item as number)}
                >
                  {item}
                </Button>
              )
            )}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => onPageChange(safePage + 1)}
            disabled={safePage === totalPages}
            aria-label="Halaman berikutnya"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => onPageChange(totalPages)}
            disabled={safePage === totalPages}
            aria-label="Halaman terakhir"
          >
            <ChevronsRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
