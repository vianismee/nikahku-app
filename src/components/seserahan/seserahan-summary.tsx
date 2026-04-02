"use client";

import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { formatRupiah } from "@/lib/utils/format-currency";
import { cn } from "@/lib/utils";
import type { Tables } from "@/lib/supabase/database.types";

interface SeserahanSummaryProps {
  items: Tables<"seserahan">[];
}

function SummaryCard({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-card border border-border/60 relative overflow-hidden p-4",
        className,
      )}
    >
      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2">
        {label}
      </p>
      {children}
    </div>
  );
}

export function SeserahanSummary({ items }: SeserahanSummaryProps) {
  const total = items.length;
  const bought = items.filter(
    (i) =>
      i.purchase_status === "sudah_dibeli" ||
      i.purchase_status === "sudah_diterima",
  ).length;
  const estimatedCost = items.reduce((sum, i) => sum + i.price_max, 0);
  const actualSpent = items
    .filter((i) => i.purchase_status !== "belum_dibeli" && i.actual_price)
    .reduce((sum, i) => sum + (i.actual_price ?? 0), 0);
  const progressPct = total > 0 ? Math.round((bought / total) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Estimasi Biaya — full width on mobile (card "panjang") */}
        <SummaryCard
          label="Estimasi Biaya"
          className="col-span-2 lg:col-span-1"
        >
          <p className="font-number text-lg font-bold tabular-nums break-all">
            {formatRupiah(estimatedCost)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Berdasarkan harga maks
          </p>
        </SummaryCard>

        {/* Sudah Dibeli — half width, sejajar dengan Sudah Dikeluarkan */}
        <SummaryCard label="Sudah Dibeli" className="col-span-1">
          <p className="font-number text-xl font-bold tabular-nums">
            {bought} / {total}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{progressPct}%</p>
        </SummaryCard>

        {/* Sudah Dikeluarkan — half width, sejajar dengan Sudah Dibeli */}
        <SummaryCard label="Sudah Dikeluarkan" className="col-span-1">
          <p className="font-number text-sm font-bold tabular-nums break-all text-primary">
            {formatRupiah(actualSpent)}
          </p>
          {estimatedCost > 0 && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {Math.round((actualSpent / estimatedCost) * 100)}% estimasi
            </p>
          )}
        </SummaryCard>
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
