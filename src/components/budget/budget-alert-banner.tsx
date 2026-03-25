"use client";

import { AlertTriangle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils/format-currency";
import { cn } from "@/lib/utils";

interface BudgetAlertBannerProps {
  totalAmount: number;
  spentAmount: number;
}

export function BudgetAlertBanner({ totalAmount, spentAmount }: BudgetAlertBannerProps) {
  if (totalAmount <= 0) return null;

  const pct = Math.round((spentAmount / totalAmount) * 100);

  if (pct < 80) return null;

  const overage = spentAmount - totalAmount;
  const isOver = pct >= 100;
  const isDanger = pct >= 90;

  return (
    <Card
      className={cn(
        "flex items-center gap-3 p-4 border-l-4",
        isOver
          ? "border-l-red-500 bg-red-50"
          : isDanger
            ? "border-l-orange-500 bg-orange-50"
            : "border-l-yellow-500 bg-yellow-50"
      )}
    >
      {isOver ? (
        <XCircle className="h-5 w-5 text-red-500 shrink-0" />
      ) : (
        <AlertTriangle
          className={cn(
            "h-5 w-5 shrink-0",
            isDanger ? "text-orange-500" : "text-yellow-500"
          )}
        />
      )}
      <p className="text-sm font-medium">
        {isOver
          ? `Budget terlampaui! Pengeluaran melebihi budget sebesar ${formatRupiah(overage)}`
          : isDanger
            ? `Peringatan! Budget hampir habis (${pct}%)`
            : `Pengeluaran sudah mencapai ${pct}% dari total budget`}
      </p>
    </Card>
  );
}
