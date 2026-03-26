"use client";

import { useMemo } from "react";
import { ListChecks, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { isOverdue } from "@/lib/utils/date-utils";
import type { Tables } from "@/lib/supabase/database.types";

interface PlanningStatsProps {
  tasks: Tables<"tasks">[];
}

export function PlanningStats({ tasks }: PlanningStatsProps) {
  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === "done").length;
    const inProgress = tasks.filter((t) => t.status === "in_progress").length;
    const overdue = tasks.filter(
      (t) =>
        t.status !== "done" &&
        t.status !== "cancelled" &&
        isOverdue(t.due_date)
    ).length;
    const donePercent = total > 0 ? Math.round((done / total) * 100) : 0;

    return { total, done, inProgress, overdue, donePercent };
  }, [tasks]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Task"
        value={stats.total}
        icon={ListChecks}
      />
      <StatCard
        label="Selesai"
        value={stats.done}
        description={`${stats.donePercent}% dari total`}
        icon={CheckCircle2}
      />
      <StatCard
        label="Dalam Proses"
        value={stats.inProgress}
        icon={Clock}
      />
      <StatCard
        label="Overdue"
        value={stats.overdue}
        icon={AlertTriangle}
      />
    </div>
  );
}
