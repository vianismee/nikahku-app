"use client";

import { useState, useMemo } from "react";
import { Plus, ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PlanningStats } from "@/components/planning/planning-stats";
import { PlanningFilters } from "@/components/planning/planning-filters";
import { KanbanBoard } from "@/components/planning/kanban-board";
import { TaskListView } from "@/components/planning/task-list-view";
import { TaskFormDialog } from "@/components/planning/task-form-dialog";
import { useWedding } from "@/lib/hooks/use-wedding";
import { useTasks } from "@/lib/hooks/use-tasks";
import { useKanbanStore } from "@/lib/stores/kanban-store";
import type { Tables } from "@/lib/supabase/database.types";

export default function PlanningPage() {
  const { data: wedding, isLoading: weddingLoading } = useWedding();
  const weddingId = wedding?.id;
  const { data: tasks = [], isLoading: tasksLoading } = useTasks(weddingId);

  const { searchQuery, filterCategory, filterPriority } = useKanbanStore();

  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Tables<"tasks"> | null>(null);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (
        searchQuery &&
        !task.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (filterCategory && task.category !== filterCategory) {
        return false;
      }
      if (filterPriority && task.priority !== filterPriority) {
        return false;
      }
      return true;
    });
  }, [tasks, searchQuery, filterCategory, filterPriority]);

  const handleEditTask = (task: Tables<"tasks">) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setFormOpen(true);
  };

  if (weddingLoading || tasksLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!weddingId) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Belum ada pernikahan"
        description="Buat pernikahan terlebih dahulu untuk mengelola planning"
        actionLabel="Ke Dashboard"
        actionHref="/dashboard"
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Planning"
        description="Kelola checklist pernikahan"
        actions={
          <Button onClick={handleAddTask}>
            <Plus className="h-4 w-4 mr-1.5" />
            Tambah Task
          </Button>
        }
      />

      <PlanningStats tasks={tasks} />

      <PlanningFilters viewMode={viewMode} onViewModeChange={setViewMode} />

      {filteredTasks.length === 0 && tasks.length > 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">
            Tidak ada task yang sesuai filter
          </p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Belum ada task"
          description="Mulai buat checklist pernikahan kamu"
          actionLabel="Tambah Task"
          onAction={handleAddTask}
        />
      ) : viewMode === "kanban" ? (
        <KanbanBoard tasks={filteredTasks} onEditTask={handleEditTask} />
      ) : (
        <TaskListView
          tasks={filteredTasks}
          weddingId={weddingId}
          onEditTask={handleEditTask}
        />
      )}

      <TaskFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        weddingId={weddingId}
        task={editingTask}
      />
    </div>
  );
}
