"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBudgetAllocations } from "@/lib/hooks/use-budget";
import { formatRupiah } from "@/lib/utils/format-currency";

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

const AllocationPieChart = dynamic(
  () => import("recharts").then((mod) => {
    const { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } = mod;

    function Chart({ data }: { data: ChartDataItem[] }) {
      return (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatRupiah(Number(value))} />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    return Chart;
  }),
  { ssr: false, loading: () => <Skeleton className="h-[280px] w-full" /> }
);

interface BudgetAllocationChartProps {
  weddingId: string;
}

export function BudgetAllocationChart({ weddingId }: BudgetAllocationChartProps) {
  const { data: allocations, isLoading } = useBudgetAllocations(weddingId);

  const chartData: ChartDataItem[] = allocations
    ?.filter((a) => a.allocated_amount > 0)
    .map((a) => ({
      name: a.vendor_categories?.name ?? "Lainnya",
      value: a.allocated_amount,
      color: a.vendor_categories?.color ?? "#8B6F4E",
    })) ?? [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distribusi Alokasi</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distribusi Alokasi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-12">
            Belum ada alokasi budget
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribusi Alokasi</CardTitle>
      </CardHeader>
      <CardContent>
        <AllocationPieChart data={chartData} />
        <div className="grid grid-cols-2 gap-2 mt-4">
          {chartData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs truncate">{entry.name}</span>
              <span className="text-xs font-number text-muted-foreground ml-auto">
                {formatRupiah(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
