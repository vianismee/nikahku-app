"use client";

import { useState, useMemo } from "react";
import { Plus, ClipboardList, Sparkles, Trash2, AlertTriangle, Clock, Download } from "lucide-react";
import { downloadCsv } from "@/lib/utils/export-csv";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PlanningStats } from "@/components/planning/planning-stats";
import { PlanningFilters } from "@/components/planning/planning-filters";
import { KanbanBoard } from "@/components/planning/kanban-board";
import { TaskListView } from "@/components/planning/task-list-view";
import { TaskFormDialog } from "@/components/planning/task-form-dialog";
import { TaskTemplateDialog } from "@/components/planning/task-template-dialog";
import { GanttChart } from "@/components/planning/gantt-chart";
import { CalendarView } from "@/components/planning/calendar-view";
import { useWedding } from "@/lib/hooks/use-wedding";
import { useTasks, useDeleteAllTasks } from "@/lib/hooks/use-tasks";
import { useKanbanStore } from "@/lib/stores/kanban-store";
import { toast } from "sonner";
import type { Tables } from "@/lib/supabase/database.types";

export default function PlanningPage() {
  const { data: wedding, isLoading: weddingLoading } = useWedding();
  const weddingId = wedding?.id;
  const { data: tasks = [], isLoading: tasksLoading } = useTasks(weddingId);
  const deleteAllTasks = useDeleteAllTasks();

  const { searchQuery, filterCategory, filterPriority } = useKanbanStore();

  const [viewMode, setViewMode] = useState<"kanban" | "list" | "gantt" | "calendar">("kanban");
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

  const handleDeleteAll = async () => {
    if (!weddingId) return;
    try {
      await deleteAllTasks.mutateAsync({ weddingId });
      toast.success("Semua task berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus semua task");
    }
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
          <div className="flex items-center gap-2">
            {tasks.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const headers = ["Judul", "Kategori", "Prioritas", "Status", "Deadline", "Deskripsi"];
                  const rows = tasks.map((t) => [
                    t.title,
                    t.category ?? "",
                    t.priority ?? "",
                    t.status,
                    t.due_date ?? "",
                    t.description ?? "",
                  ]);
                  downloadCsv("daftar-task.csv", headers, rows);
                }}
              >
                <Download className="h-4 w-4 mr-1.5" />
                Export
              </Button>
            )}
            <TaskTemplateDialog
              weddingId={weddingId}
              hasExistingTasks={tasks.length > 0}
              trigger={
                <Button variant="outline" size="sm">
                  <Sparkles className="h-4 w-4 mr-1.5" />
                  Template
                </Button>
              }
            />
            {tasks.length > 0 && (
              <ConfirmDialog
                trigger={
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4 mr-1.5" />
                    Hapus Semua
                  </Button>
                }
                title="Hapus Semua Task"
                description={`Yakin ingin menghapus semua ${tasks.length} task? Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel="Hapus Semua"
                onConfirm={handleDeleteAll}
              />
            )}
            <Button size="sm" onClick={handleAddTask}>
              <Plus className="h-4 w-4 mr-1.5" />
              Tambah Task
            </Button>
          </div>
        }
      />

      <PlanningStats tasks={tasks} />

      {/* Reminder banners */}
      {(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const in7 = new Date(now);
        in7.setDate(now.getDate() + 7);
        const overdue = tasks.filter(
          (t) =>
            t.status !== "done" &&
            t.status !== "cancelled" &&
            t.due_date &&
            new Date(t.due_date) < now
        );
        const upcoming = tasks.filter(
          (t) =>
            t.status !== "done" &&
            t.status !== "cancelled" &&
            t.due_date &&
            new Date(t.due_date) >= now &&
            new Date(t.due_date) <= in7
        );
        if (overdue.length === 0 && upcoming.length === 0) return null;
        return (
          <div className="space-y-2">
            {overdue.length > 0 && (
              <div className="flex items-center gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2.5 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>
                  <strong>{overdue.length} task</strong> sudah melewati deadline
                </span>
              </div>
            )}
            {upcoming.length > 0 && (
              <div className="flex items-center gap-2.5 rounded-lg border border-amber-300/50 bg-amber-50 dark:bg-amber-950/20 px-4 py-2.5 text-sm text-amber-700 dark:text-amber-400">
                <Clock className="h-4 w-4 shrink-0" />
                <span>
                  <strong>{upcoming.length} task</strong> jatuh tempo dalam 7 hari ke depan
                </span>
              </div>
            )}
          </div>
        );
      })()}

      <PlanningFilters viewMode={viewMode} onViewModeChange={setViewMode} />

      {filteredTasks.length === 0 && tasks.length > 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">
            Tidak ada task yang sesuai filter
          </p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="space-y-4">
          <EmptyState
            icon={ClipboardList}
            title="Belum ada task"
            description="Mulai dari template atau buat checklist sendiri"
            actionLabel="Tambah Task"
            onAction={handleAddTask}
          />
          <div className="flex justify-center">
            <TaskTemplateDialog
              weddingId={weddingId}
              hasExistingTasks={false}
              trigger={
                <Button variant="outline" className="gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  Gunakan Template
                </Button>
              }
            />
          </div>
        </div>
      ) : viewMode === "kanban" ? (
        <KanbanBoard tasks={filteredTasks} onEditTask={handleEditTask} />
      ) : viewMode === "gantt" ? (
        <GanttChart tasks={filteredTasks} onEditTask={handleEditTask} />
      ) : viewMode === "calendar" ? (
        <CalendarView tasks={filteredTasks} onEditTask={handleEditTask} />
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
