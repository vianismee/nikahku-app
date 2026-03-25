"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBudgetAllocations, useExpenses } from "@/lib/hooks/use-budget";
import { useVendorCategories } from "@/lib/hooks/use-vendors";
import { formatRupiah } from "@/lib/utils/format-currency";

interface ChartDataItem {
  name: string;
  Alokasi: number;
  Aktual: number;
}

const BudgetBarChart = dynamic(
  () => import("recharts").then((mod) => {
    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = mod;

    function Chart({ data }: { data: ChartDataItem[] }) {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11 }}
              angle={-30}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(v: number) =>
                v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)}jt` : `${(v / 1_000).toFixed(0)}rb`
              }
            />
            <Tooltip formatter={(value) => formatRupiah(Number(value))} />
            <Legend />
            <Bar dataKey="Alokasi" fill="#8B6F4E" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Aktual" fill="#D4A574" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    return Chart;
  }),
  { ssr: false, loading: () => <Skeleton className="h-[300px] w-full" /> }
);

interface BudgetVsActualChartProps {
  weddingId: string;
}

export function BudgetVsActualChart({ weddingId }: BudgetVsActualChartProps) {
  const { data: categories } = useVendorCategories();
  const { data: allocations } = useBudgetAllocations(weddingId);
  const { data: expenses } = useExpenses(weddingId);

  const chartData: ChartDataItem[] = (categories
    ?.map((cat) => {
      const allocation = allocations?.find((a) => a.category_id === cat.id);
      const actual = expenses
        ?.filter((e) => e.category === cat.name)
        .reduce((sum, e) => sum + e.amount, 0) ?? 0;
      const allocated = allocation?.allocated_amount ?? 0;

      if (allocated === 0 && actual === 0) return null;

      return {
        name: cat.name,
        Alokasi: allocated,
        Aktual: actual,
      };
    })
    .filter(Boolean) ?? []) as ChartDataItem[];

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Aktual</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-12">
            Belum ada data untuk ditampilkan
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs Aktual</CardTitle>
      </CardHeader>
      <CardContent>
        <BudgetBarChart data={chartData} />
      </CardContent>
    </Card>
  );
}
