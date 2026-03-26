"use client";

import { Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { isOverdue, formatDateShort } from "@/lib/utils/date-utils";
import { useKanbanStore } from "@/lib/stores/kanban-store";
import { cn } from "@/lib/utils";
import type { Tables } from "@/lib/supabase/database.types";

const PRIORITIES: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  urgent: { label: "Urgent", color: "#DC2626", bgColor: "#DC262615" },
  high: { label: "High", color: "#EA580C", bgColor: "#EA580C15" },
  medium: { label: "Medium", color: "#2563EB", bgColor: "#2563EB15" },
  low: { label: "Low", color: "#6B7280", bgColor: "#6B728015" },
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

interface TaskCardProps {
  task: Tables<"tasks">;
  onClick: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const { setDraggedTaskId } = useKanbanStore();
  const priority = PRIORITIES[task.priority] ?? PRIORITIES.medium;
  const overdue =
    task.status !== "done" &&
    task.status !== "cancelled" &&
    isOverdue(task.due_date);

  return (
    <Card
      draggable
      onDragStart={(e) => {
        setDraggedTaskId(task.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      onDragEnd={() => setDraggedTaskId(null)}
      onClick={onClick}
      className="cursor-pointer p-3 hover:ring-1 hover:ring-primary/30 transition-shadow"
    >
      <div className="space-y-2">
        <p className="text-sm font-medium leading-tight line-clamp-2">
          {task.title}
        </p>

        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant="secondary" className="text-[10px]">
            {CATEGORY_LABELS[task.category] ?? task.category}
          </Badge>
          <Badge
            variant="outline"
            className="text-[10px] border-0"
            style={{ color: priority.color, backgroundColor: priority.bgColor }}
          >
            {priority.label}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span
            className={cn(
              "flex items-center gap-1",
              overdue && "text-destructive font-medium"
            )}
          >
            <Calendar className="h-3 w-3" />
            {formatDateShort(task.due_date)}
          </span>
          {task.assignee && (
            <span className="flex items-center gap-1 truncate max-w-[100px]">
              <User className="h-3 w-3" />
              {task.assignee}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
