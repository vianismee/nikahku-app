"use client";

import { useMemo, useState, useCallback } from "react";
import { useKanbanStore } from "@/lib/stores/kanban-store";
import { useUpdateTask } from "@/lib/hooks/use-tasks";
import { TaskCard } from "@/components/planning/task-card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Tables } from "@/lib/supabase/database.types";

interface KanbanBoardProps {
  tasks: Tables<"tasks">[];
  onEditTask: (task: Tables<"tasks">) => void;
}

export function KanbanBoard({ tasks, onEditTask }: KanbanBoardProps) {
  const { columns, draggedTaskId, setDraggedTaskId } = useKanbanStore();
  const updateTask = useUpdateTask();
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const tasksByColumn = useMemo(() => {
    const map: Record<string, Tables<"tasks">[]> = {};
    for (const col of columns) {
      map[col.id] = [];
    }
    for (const task of tasks) {
      const colId = task.column_id || task.status;
      if (map[colId]) {
        map[colId].push(task);
      } else if (map["todo"]) {
        map["todo"].push(task);
      }
    }
    // Sort by sort_order within each column
    for (const colId of Object.keys(map)) {
      map[colId].sort((a, b) => a.sort_order - b.sort_order);
    }
    return map;
  }, [tasks, columns]);

  const handleDrop = useCallback(
    (columnId: string) => {
      if (!draggedTaskId) return;
      const task = tasks.find((t) => t.id === draggedTaskId);
      if (!task || task.column_id === columnId) {
        setDraggedTaskId(null);
        setDragOverColumn(null);
        return;
      }

      // Map column_id to status
      const statusMap: Record<string, "todo" | "in_progress" | "done"> = {
        todo: "todo",
        in_progress: "in_progress",
        done: "done",
      };
      const newStatus = statusMap[columnId] ?? "todo";

      updateTask.mutate(
        {
          id: task.id,
          column_id: columnId,
          status: newStatus,
        },
        {
          onError: () => {
            toast.error("Gagal memindahkan task");
          },
        }
      );

      setDraggedTaskId(null);
      setDragOverColumn(null);
    },
    [draggedTaskId, tasks, updateTask, setDraggedTaskId]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((column) => {
        const columnTasks = tasksByColumn[column.id] ?? [];
        return (
          <div
            key={column.id}
            className={cn(
              "rounded-xl border bg-muted/30 p-3 transition-colors flex flex-col",
              dragOverColumn === column.id && "ring-2 ring-primary/40 bg-primary/5"
            )}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
              setDragOverColumn(column.id);
            }}
            onDragLeave={() => setDragOverColumn(null)}
            onDrop={(e) => {
              e.preventDefault();
              handleDrop(column.id);
            }}
          >
            <div className="flex items-center justify-between mb-3 shrink-0">
              <h3 className="text-sm font-semibold">{column.title}</h3>
              <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                {columnTasks.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[60vh] space-y-2 pr-1 -mr-1 scrollbar-thin">
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => onEditTask(task)}
                />
              ))}
              {columnTasks.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-8">
                  Tidak ada task
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
