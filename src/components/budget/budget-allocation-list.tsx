"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CurrencyInput } from "@/components/shared/currency-input";
import { formatRupiah } from "@/lib/utils/format-currency";
import { useVendorCategories } from "@/lib/hooks/use-vendors";
import { useBudgetAllocations, useUpsertAllocation, useBudget, useExpenses } from "@/lib/hooks/use-budget";
import { toast } from "sonner";
import { Save } from "lucide-react";

interface BudgetAllocationListProps {
  weddingId: string;
}

export function BudgetAllocationList({ weddingId }: BudgetAllocationListProps) {
  const { data: categories } = useVendorCategories();
  const { data: allocations } = useBudgetAllocations(weddingId);
  const { data: budget } = useBudget(weddingId);
  const { data: expenses } = useExpenses(weddingId);
  const upsertAllocation = useUpsertAllocation();

  const [localAllocations, setLocalAllocations] = useState<Record<string, number>>({});
  const [dirty, setDirty] = useState(false);

  const getAllocation = useCallback(
    (categoryId: string) => {
      if (categoryId in localAllocations) return localAllocations[categoryId];
      const existing = allocations?.find((a) => a.category_id === categoryId);
      return existing?.allocated_amount ?? 0;
    },
    [localAllocations, allocations]
  );

  const getSpentByCategory = useCallback(
    (categoryName: string) => {
      return (
        expenses
          ?.filter((e) => e.category === categoryName)
          .reduce((sum, e) => sum + e.amount, 0) ?? 0
      );
    },
    [expenses]
  );

  function handleChange(categoryId: string, value: number) {
    setLocalAllocations((prev) => ({ ...prev, [categoryId]: value }));
    setDirty(true);
  }

  async function handleSave() {
    try {
      const promises = Object.entries(localAllocations).map(([categoryId, amount]) =>
        upsertAllocation.mutateAsync({
          wedding_id: weddingId,
          category_id: categoryId,
          allocated_amount: amount,
        })
      );
      await Promise.all(promises);
      setDirty(false);
      setLocalAllocations({});
      toast.success("Alokasi budget berhasil disimpan");
    } catch {
      toast.error("Gagal menyimpan alokasi");
    }
  }

  const totalAllocated = categories?.reduce(
    (sum, cat) => sum + getAllocation(cat.id),
    0
  ) ?? 0;
  const totalBudget = budget?.total_amount ?? 0;
  const overAllocated = totalAllocated > totalBudget && totalBudget > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Alokasi per Kategori</CardTitle>
        {dirty && (
          <Button size="sm" onClick={handleSave} disabled={upsertAllocation.isPending}>
            <Save className="h-4 w-4 mr-1" />
            Simpan
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {categories?.map((cat) => {
          const allocated = getAllocation(cat.id);
          const spent = getSpentByCategory(cat.name);
          const pct = allocated > 0 ? Math.min(Math.round((spent / allocated) * 100), 100) : 0;

          return (
            <div key={cat.id} className="space-y-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-base sm:text-lg shrink-0">{cat.icon}</span>
                <span className="text-sm font-medium flex-1 min-w-0 truncate">{cat.name}</span>
                <div className="w-32 sm:w-48 shrink-0">
                  <CurrencyInput
                    value={allocated}
                    onValueChange={(v) => handleChange(cat.id, v)}
                  />
                </div>
              </div>
              <div className="ml-7 sm:ml-9 space-y-1">
                <Progress value={pct} />
                <p className="text-[10px] sm:text-xs text-muted-foreground font-number text-right">
                  {formatRupiah(spent)} / {formatRupiah(allocated)}
                </p>
              </div>
            </div>
          );
        })}

        <div className="pt-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span className="text-sm font-medium">Total Alokasi</span>
          <span className={`text-xs sm:text-sm font-number font-bold ${overAllocated ? "text-red-500" : ""}`}>
            {formatRupiah(totalAllocated)} / {formatRupiah(totalBudget)}
          </span>
        </div>
        {overAllocated && (
          <p className="text-xs text-red-500">
            Alokasi melebihi total budget sebesar {formatRupiah(totalAllocated - totalBudget)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
