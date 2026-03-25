"use client";

import { Wallet, TrendingDown, PiggyBank, PieChart, Pencil } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils/format-currency";
import { useBudget, useBudgetAllocations } from "@/lib/hooks/use-budget";
import { BudgetAlertBanner } from "./budget-alert-banner";
import { TotalBudgetDialog } from "./total-budget-dialog";

interface BudgetOverviewProps {
  weddingId: string;
}

export function BudgetOverview({ weddingId }: BudgetOverviewProps) {
  const { data: budget } = useBudget(weddingId);
  const { data: allocations } = useBudgetAllocations(weddingId);

  const total = budget?.total_amount ?? 0;
  const spent = budget?.spent_amount ?? 0;
  const remaining = total - spent;
  const allocatedTotal = allocations?.reduce((sum, a) => sum + a.allocated_amount, 0) ?? 0;
  const spentPct = total > 0 ? Math.round((spent / total) * 100) : 0;
  const allocatedPct = total > 0 ? Math.round((allocatedTotal / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Budget"
          value={formatRupiah(total)}
          icon={Wallet}
          description={
            total > 0 ? undefined : "Belum diatur"
          }
        />
        <StatCard
          label="Sudah Dikeluarkan"
          value={formatRupiah(spent)}
          icon={TrendingDown}
          description={total > 0 ? `${spentPct}% dari total` : undefined}
        />
        <StatCard
          label="Sisa Budget"
          value={formatRupiah(remaining)}
          icon={PiggyBank}
          className={remaining < 0 ? "border-red-200" : undefined}
        />
        <StatCard
          label="Teralokasi"
          value={formatRupiah(allocatedTotal)}
          icon={PieChart}
          description={total > 0 ? `${allocatedPct}% dari total` : undefined}
        />
      </div>

      {total > 0 && (
        <div className="space-y-2">
          <Progress value={spentPct}>
            <ProgressLabel>Penggunaan Budget</ProgressLabel>
            <ProgressValue />
          </Progress>
        </div>
      )}

      <BudgetAlertBanner totalAmount={total} spentAmount={spent} />

      <div className="flex justify-end">
        <TotalBudgetDialog
          weddingId={weddingId}
          currentAmount={total}
          trigger={
            <Button variant="outline" size="sm">
              <Pencil className="h-4 w-4 mr-1" />
              {total > 0 ? "Ubah Total Budget" : "Atur Total Budget"}
            </Button>
          }
        />
      </div>
    </div>
  );
}
