"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/lib/supabase/database.types";

interface CalendarViewProps {
  tasks: Tables<"tasks">[];
  onEditTask: (task: Tables<"tasks">) => void;
}

const DAY_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

const STATUS_COLORS: Record<string, string> = {
  done: "bg-green-100 text-green-800",
  in_progress: "bg-blue-100 text-blue-800",
  cancelled: "bg-muted text-muted-foreground line-through",
  todo: "bg-primary/10 text-primary",
};

export function CalendarView({ tasks, onEditTask }: CalendarViewProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  // Group tasks by due_date (YYYY-MM-DD)
  const tasksByDate = useMemo(() => {
    const map: Record<string, Tables<"tasks">[]> = {};
    for (const task of tasks) {
      if (!task.due_date) continue;
      const d = task.due_date.slice(0, 10);
      if (!map[d]) map[d] = [];
      map[d].push(task);
    }
    return map;
  }, [tasks]);

  // Build calendar grid: start from Monday
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun
  const startOffset = (firstDayOfMonth + 6) % 7; // Mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const monthLabel = new Date(year, month).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-lg border overflow-hidden">
      {/* Month navigation */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
        <Button variant="ghost" size="icon-sm" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-medium capitalize">{monthLabel}</span>
        <Button variant="ghost" size="icon-sm" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day-of-week header */}
      <div className="grid grid-cols-7 border-b bg-muted/20">
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-medium text-muted-foreground py-2"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar cells */}
      <div className="grid grid-cols-7 divide-x divide-y">
        {cells.map((day, i) => {
          if (!day) {
            return (
              <div
                key={i}
                className="min-h-[90px] bg-muted/10"
              />
            );
          }

          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayTasks = tasksByDate[dateStr] ?? [];
          const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day;

          return (
            <div key={i} className="min-h-[90px] p-1 space-y-0.5">
              {/* Day number */}
              <div
                className={[
                  "text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1",
                  isToday
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground",
                ].join(" ")}
              >
                {day}
              </div>

              {/* Task pills */}
              {dayTasks.slice(0, 3).map((task) => (
                <button
                  key={task.id}
                  onClick={() => onEditTask(task)}
                  title={task.title}
                  className={[
                    "w-full text-left text-[10px] leading-tight px-1.5 py-0.5 rounded truncate transition-opacity hover:opacity-80",
                    STATUS_COLORS[task.status] ?? STATUS_COLORS.todo,
                  ].join(" ")}
                >
                  {task.title}
                </button>
              ))}

              {dayTasks.length > 3 && (
                <p className="text-[10px] text-muted-foreground pl-1">
                  +{dayTasks.length - 3} lagi
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-2 border-t bg-muted/10 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-primary/20 inline-block" />
          To Do
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-blue-100 inline-block" />
          In Progress
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded bg-green-100 inline-block" />
          Done
        </span>
      </div>
    </div>
  );
}
