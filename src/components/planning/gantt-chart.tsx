"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { isOverdue, formatDateShort } from "@/lib/utils/date-utils";
import {
  addDays,
  addWeeks,
  addMonths,
  startOfWeek,
  startOfMonth,
  endOfWeek,
  endOfMonth,
  differenceInDays,
  format,
  isToday,
  isSameMonth,
  isSameWeek,
} from "date-fns";
import { id as localeId } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tables } from "@/lib/supabase/database.types";

type ViewMode = "week" | "month";

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "#DC2626",
  high: "#EA580C",
  medium: "#2563EB",
  low: "#6B7280",
};

const STATUS_BG: Record<string, string> = {
  todo: "bg-muted",
  in_progress: "bg-blue-100 dark:bg-blue-950",
  done: "bg-green-100 dark:bg-green-950",
  cancelled: "bg-red-100 dark:bg-red-950 opacity-50",
};

const CATEGORY_LABELS: Record<string, string> = {
  venue: "Venue",
  catering: "Catering",
  dekorasi: "Dekorasi",
  fotografi: "Fotografi",
  busana: "Busana",
  undangan: "Undangan",
  lainnya: "Lainnya",
};

interface GanttChartProps {
  tasks: Tables<"tasks">[];
  onEditTask: (task: Tables<"tasks">) => void;
}

export function GanttChart({ tasks, onEditTask }: GanttChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [offset, setOffset] = useState(0); // navigation offset
  const scrollRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLDivElement>(null);

  // Calculate the timeline range
  const { timelineStart, timelineEnd, columns, cellWidth } = useMemo(() => {
    const now = new Date();
    let start: Date;
    let end: Date;
    const cols: { date: Date; label: string; subLabel: string }[] = [];

    if (viewMode === "week") {
      // Show 12 weeks from offset
      start = startOfWeek(addWeeks(now, offset - 2), { locale: localeId });
      end = addWeeks(start, 12);
      let cursor = start;
      while (cursor < end) {
        const weekEnd = endOfWeek(cursor, { locale: localeId });
        cols.push({
          date: new Date(cursor),
          label: format(cursor, "d MMM", { locale: localeId }),
          subLabel: format(weekEnd, "d MMM", { locale: localeId }),
        });
        cursor = addWeeks(cursor, 1);
      }
      return { timelineStart: start, timelineEnd: end, columns: cols, cellWidth: 120 };
    } else {
      // Show 8 months from offset
      start = startOfMonth(addMonths(now, offset - 1));
      end = endOfMonth(addMonths(start, 7));
      let cursor = start;
      while (cursor <= end) {
        cols.push({
          date: new Date(cursor),
          label: format(cursor, "MMM", { locale: localeId }),
          subLabel: format(cursor, "yyyy"),
        });
        cursor = addMonths(cursor, 1);
      }
      return { timelineStart: start, timelineEnd: end, columns: cols, cellWidth: 150 };
    }
  }, [viewMode, offset]);

  const totalDays = differenceInDays(timelineEnd, timelineStart);
  const totalWidth = columns.length * cellWidth;

  // Sort tasks by due_date
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      // Group by category, then sort by due_date
      if (a.category !== b.category) return a.category.localeCompare(b.category);
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });
  }, [tasks]);

  // Scroll to today on mount
  useEffect(() => {
    if (todayRef.current && scrollRef.current) {
      const todayLeft = todayRef.current.offsetLeft;
      const containerWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollLeft = todayLeft - containerWidth / 3;
    }
  }, [viewMode, offset]);

  const getBarPosition = (dueDate: string) => {
    const due = new Date(dueDate);
    const dayOffset = differenceInDays(due, timelineStart);
    const left = (dayOffset / totalDays) * totalWidth;
    return Math.max(0, Math.min(left, totalWidth - 8));
  };

  const getTodayPosition = () => {
    const dayOffset = differenceInDays(new Date(), timelineStart);
    return (dayOffset / totalDays) * totalWidth;
  };

  const isColumnCurrent = (colDate: Date) => {
    if (viewMode === "week") return isSameWeek(colDate, new Date(), { locale: localeId });
    return isSameMonth(colDate, new Date());
  };

  const ROW_HEIGHT = 40;
  const HEADER_HEIGHT = 56;
  const LABEL_WIDTH = 200;

  return (
    <div className="space-y-3">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 border rounded-lg p-0.5">
          <Button
            variant={viewMode === "week" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => { setViewMode("week"); setOffset(0); }}
            className="text-xs h-7"
          >
            Minggu
          </Button>
          <Button
            variant={viewMode === "month" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => { setViewMode("month"); setOffset(0); }}
            className="text-xs h-7"
          >
            Bulan
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setOffset((o) => o - (viewMode === "week" ? 4 : 2))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOffset(0)}
            className="text-xs h-7"
          >
            Hari Ini
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setOffset((o) => o + (viewMode === "week" ? 4 : 2))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Gantt Container */}
      <div className="rounded-xl border border-border overflow-hidden bg-background">
        <div className="flex">
          {/* Fixed task label column */}
          <div className="shrink-0 border-r border-border z-10 bg-background" style={{ width: LABEL_WIDTH }}>
            {/* Header */}
            <div
              className="border-b border-border px-3 flex items-center text-xs font-medium text-muted-foreground"
              style={{ height: HEADER_HEIGHT }}
            >
              Task ({sortedTasks.length})
            </div>
            {/* Task labels */}
            {sortedTasks.map((task) => {
              const overdue =
                task.status !== "done" &&
                task.status !== "cancelled" &&
                isOverdue(task.due_date);
              return (
                <div
                  key={task.id}
                  className="border-b border-border px-3 flex items-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
                  style={{ height: ROW_HEIGHT }}
                  onClick={() => onEditTask(task)}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: PRIORITY_COLORS[task.priority] ?? PRIORITY_COLORS.medium }}
                  />
                  <span
                    className={cn(
                      "text-xs truncate flex-1",
                      task.status === "done" && "line-through text-muted-foreground",
                      task.status === "cancelled" && "line-through text-muted-foreground opacity-50",
                      overdue && "text-destructive"
                    )}
                  >
                    {task.title}
                  </span>
                </div>
              );
            })}
            {sortedTasks.length === 0 && (
              <div className="px-3 py-8 text-xs text-muted-foreground text-center">
                Tidak ada task
              </div>
            )}
          </div>

          {/* Scrollable timeline */}
          <div className="flex-1 overflow-x-auto" ref={scrollRef}>
            <div style={{ width: totalWidth, position: "relative" }}>
              {/* Column headers */}
              <div className="flex border-b border-border" style={{ height: HEADER_HEIGHT }}>
                {columns.map((col, i) => (
                  <div
                    key={i}
                    className={cn(
                      "shrink-0 border-r border-border px-2 flex flex-col items-center justify-center",
                      isColumnCurrent(col.date) && "bg-primary/5"
                    )}
                    style={{ width: cellWidth }}
                  >
                    <span className={cn(
                      "text-xs font-medium",
                      isColumnCurrent(col.date) && "text-primary"
                    )}>
                      {col.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {viewMode === "week" ? `- ${col.subLabel}` : col.subLabel}
                    </span>
                  </div>
                ))}
              </div>

              {/* Task rows with bars */}
              {sortedTasks.map((task) => {
                const barLeft = getBarPosition(task.due_date);
                const overdue =
                  task.status !== "done" &&
                  task.status !== "cancelled" &&
                  isOverdue(task.due_date);
                const barColor = task.status === "done"
                  ? "#16A34A"
                  : task.status === "cancelled"
                    ? "#9CA3AF"
                    : overdue
                      ? "#DC2626"
                      : PRIORITY_COLORS[task.priority] ?? PRIORITY_COLORS.medium;

                return (
                  <div
                    key={task.id}
                    className="relative border-b border-border"
                    style={{ height: ROW_HEIGHT }}
                  >
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex">
                      {columns.map((col, i) => (
                        <div
                          key={i}
                          className={cn(
                            "shrink-0 border-r border-border/50",
                            isColumnCurrent(col.date) && "bg-primary/[0.02]"
                          )}
                          style={{ width: cellWidth }}
                        />
                      ))}
                    </div>

                    {/* Task bar */}
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <div
                            className="absolute top-1/2 -translate-y-1/2 cursor-pointer"
                            style={{ left: barLeft }}
                            onClick={() => onEditTask(task)}
                          />
                        }
                      >
                        <div
                          className="flex items-center gap-1 rounded-md px-2 py-1 text-white text-[10px] font-medium whitespace-nowrap shadow-sm hover:shadow-md transition-shadow"
                          style={{
                            backgroundColor: barColor,
                            minWidth: 60,
                            maxWidth: cellWidth * 1.5,
                          }}
                        >
                          <span className="truncate">{task.title}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          <p className="font-medium">{task.title}</p>
                          <p className="text-xs opacity-80">
                            {CATEGORY_LABELS[task.category] ?? task.category} &middot;{" "}
                            {formatDateShort(task.due_date)}
                          </p>
                          {overdue && (
                            <p className="text-xs text-red-300">Overdue!</p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                );
              })}

              {/* Today line */}
              {(() => {
                const todayPos = getTodayPosition();
                if (todayPos < 0 || todayPos > totalWidth) return null;
                return (
                  <div
                    ref={todayRef}
                    className="absolute top-0 bottom-0 w-0.5 bg-primary z-20 pointer-events-none"
                    style={{ left: todayPos }}
                  >
                    <div className="absolute -top-0 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[9px] font-medium px-1.5 py-0.5 rounded-b-md whitespace-nowrap">
                      Hari Ini
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="font-medium">Prioritas:</span>
        {Object.entries(PRIORITY_COLORS).map(([key, color]) => (
          <div key={key} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
            <span className="capitalize">{key}</span>
          </div>
        ))}
        <span className="mx-1">|</span>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-sm bg-green-600" />
          <span>Selesai</span>
        </div>
      </div>
    </div>
  );
}
