"use client";

import { ShoppingBag, CheckCircle2, Wallet, TrendingDown } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { formatRupiah } from "@/lib/utils/format-currency";
import type { Tables } from "@/lib/supabase/database.types";

interface SeserahanSummaryProps {
  items: Tables<"seserahan">[];
}

export function SeserahanSummary({ items }: SeserahanSummaryProps) {
  const total = items.length;
  const bought = items.filter(
    (i) => i.purchase_status === "sudah_dibeli" || i.purchase_status === "sudah_diterima"
  ).length;
  const estimatedCost = items.reduce((sum, i) => sum + i.price_max, 0);
  const actualSpent = items
    .filter((i) => i.purchase_status !== "belum_dibeli" && i.actual_price)
    .reduce((sum, i) => sum + (i.actual_price ?? 0), 0);
  const progressPct = total > 0 ? Math.round((bought / total) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Item"
          value={String(total)}
          icon={ShoppingBag}
        />
        <StatCard
          label="Sudah Dibeli"
          value={`${bought} / ${total}`}
          icon={CheckCircle2}
          description={total > 0 ? `${progressPct}%` : undefined}
        />
        <StatCard
          label="Estimasi Biaya"
          value={formatRupiah(estimatedCost)}
          icon={Wallet}
          description="Harga max"
        />
        <StatCard
          label="Sudah Dikeluarkan"
          value={formatRupiah(actualSpent)}
          icon={TrendingDown}
          description={estimatedCost > 0
            ? `${Math.round((actualSpent / estimatedCost) * 100)}% dari estimasi`
            : undefined}
        />
      </div>

      {total > 0 && (
        <Progress value={progressPct}>
          <ProgressLabel>Progress Pembelian</ProgressLabel>
          <ProgressValue />
        </Progress>
      )}
    </div>
  );
}
