"use client";

import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BudgetOverview } from "@/components/budget/budget-overview";
import { BudgetAllocationList } from "@/components/budget/budget-allocation-list";
import { BudgetAllocationChart } from "@/components/budget/budget-allocation-chart";
import { BudgetVsActualChart } from "@/components/budget/budget-vs-actual-chart";
import { ExpenseTable } from "@/components/budget/expense-table";
import { TotalBudgetDialog } from "@/components/budget/total-budget-dialog";
import { useWedding } from "@/lib/hooks/use-wedding";
import { useBudget } from "@/lib/hooks/use-budget";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

export default function BudgetPage() {
  const { data: wedding, isLoading: weddingLoading } = useWedding();
  const weddingId = wedding?.id;
  const { data: budget, isLoading: budgetLoading } = useBudget(weddingId);

  if (weddingLoading || budgetLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!weddingId) {
    return (
      <EmptyState
        icon={Wallet}
        title="Belum ada pernikahan"
        description="Buat pernikahan terlebih dahulu untuk mengelola budget"
        actionLabel="Ke Dashboard"
        actionHref="/dashboard"
      />
    );
  }

  const hasBudget = budget && budget.total_amount > 0;

  if (!hasBudget) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Budget"
          description="Kelola anggaran pernikahan"
        />
        <EmptyState
          icon={Wallet}
          title="Belum ada budget"
          description="Atur total budget untuk mulai mengelola anggaran pernikahan"
        />
        <div className="flex justify-center">
          <TotalBudgetDialog
            weddingId={weddingId}
            currentAmount={0}
            trigger={<Button>Atur Total Budget</Button>}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Budget"
        description="Kelola anggaran pernikahan"
      />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Ringkasan</TabsTrigger>
          <TabsTrigger value="allocation">Alokasi</TabsTrigger>
          <TabsTrigger value="expenses">Pengeluaran</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-6">
            <BudgetOverview weddingId={weddingId} />
            <BudgetVsActualChart weddingId={weddingId} />
          </div>
        </TabsContent>

        <TabsContent value="allocation">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BudgetAllocationList weddingId={weddingId} />
            <BudgetAllocationChart weddingId={weddingId} />
          </div>
        </TabsContent>

        <TabsContent value="expenses">
          <ExpenseTable weddingId={weddingId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
