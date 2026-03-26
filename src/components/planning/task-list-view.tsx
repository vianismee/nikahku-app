"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useDeleteTask } from "@/lib/hooks/use-tasks";
import { isOverdue, formatDateShort } from "@/lib/utils/date-utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
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

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  todo: { label: "To Do", color: "#6B7280", bgColor: "#6B728015" },
  in_progress: { label: "In Progress", color: "#2563EB", bgColor: "#2563EB15" },
  done: { label: "Selesai", color: "#16A34A", bgColor: "#16A34A15" },
  cancelled: { label: "Dibatalkan", color: "#DC2626", bgColor: "#DC262615" },
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

const STATUS_ORDER = ["todo", "in_progress", "done", "cancelled"];

interface TaskListViewProps {
  tasks: Tables<"tasks">[];
  weddingId: string;
  onEditTask: (task: Tables<"tasks">) => void;
}

export function TaskListView({
  tasks,
  weddingId,
  onEditTask,
}: TaskListViewProps) {
  const deleteTask = useDeleteTask();
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set()
  );

  const grouped = useMemo(() => {
    const map: Record<string, Tables<"tasks">[]> = {};
    for (const status of STATUS_ORDER) {
      map[status] = [];
    }
    for (const task of tasks) {
      if (map[task.status]) {
        map[task.status].push(task);
      }
    }
    return map;
  }, [tasks]);

  const toggleGroup = (status: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(status)) {
        next.delete(status);
      } else {
        next.add(status);
      }
      return next;
    });
  };

  const handleDelete = (taskId: string) => {
    deleteTask.mutate(
      { id: taskId, weddingId },
      {
        onSuccess: () => toast.success("Task berhasil dihapus"),
        onError: () => toast.error("Gagal menghapus task"),
      }
    );
  };

  return (
    <div className="space-y-4">
      {STATUS_ORDER.map((status) => {
        const statusTasks = grouped[status] ?? [];
        const config = STATUS_CONFIG[status];
        const isCollapsed = collapsedGroups.has(status);

        return (
          <div key={status} className="rounded-xl border">
            <button
              type="button"
              className="flex w-full items-center gap-2 p-3 hover:bg-muted/50 transition-colors"
              onClick={() => toggleGroup(status)}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
              <StatusBadge
                label={config.label}
                color={config.color}
                bgColor={config.bgColor}
              />
              <span className="text-xs text-muted-foreground">
                ({statusTasks.length})
              </span>
            </button>

            {!isCollapsed && statusTasks.length > 0 && (
              <div className="border-t divide-y">
                {statusTasks.map((task) => {
                  const priority =
                    PRIORITIES[task.priority] ?? PRIORITIES.medium;
                  const taskOverdue =
                    task.status !== "done" &&
                    task.status !== "cancelled" &&
                    isOverdue(task.due_date);

                  return (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {task.title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <Badge variant="secondary" className="text-[10px]">
                            {CATEGORY_LABELS[task.category] ?? task.category}
                          </Badge>
                          <StatusBadge
                            label={priority.label}
                            color={priority.color}
                            bgColor={priority.bgColor}
                            className="text-[10px]"
                          />
                        </div>
                      </div>

                      <span
                        className={cn(
                          "text-xs text-muted-foreground whitespace-nowrap hidden sm:block",
                          taskOverdue && "text-destructive font-medium"
                        )}
                      >
                        {formatDateShort(task.due_date)}
                      </span>

                      {task.assignee && (
                        <span className="text-xs text-muted-foreground truncate max-w-[80px] hidden md:block">
                          {task.assignee}
                        </span>
                      )}

                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onEditTask(task)}
                          aria-label="Edit task"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <ConfirmDialog
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label="Hapus task"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                          }
                          title="Hapus Task"
                          description={`Apakah kamu yakin ingin menghapus task "${task.title}"?`}
                          onConfirm={() => handleDelete(task.id)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!isCollapsed && statusTasks.length === 0 && (
              <div className="border-t px-3 py-6 text-center">
                <p className="text-xs text-muted-foreground">
                  Tidak ada task
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
