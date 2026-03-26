"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateTask, useUpdateTask } from "@/lib/hooks/use-tasks";
import { toast } from "sonner";
import type { Tables } from "@/lib/supabase/database.types";

const TASK_CATEGORIES = [
  { value: "venue", label: "Venue" },
  { value: "catering", label: "Catering" },
  { value: "dekorasi", label: "Dekorasi" },
  { value: "fotografi", label: "Fotografi" },
  { value: "busana", label: "Busana" },
  { value: "undangan", label: "Undangan" },
  { value: "lainnya", label: "Lainnya" },
];

const PRIORITY_OPTIONS = [
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const STATUS_OPTIONS = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
];

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weddingId: string;
  task?: Tables<"tasks"> | null;
}

export function TaskFormDialog({
  open,
  onOpenChange,
  weddingId,
  task,
}: TaskFormDialogProps) {
  const isEdit = !!task;
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("lainnya");
  const [dueDate, setDueDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [priority, setPriority] = useState<string>("medium");
  const [status, setStatus] = useState<string>("todo");
  const [assignee, setAssignee] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? "");
      setCategory(task.category);
      setDueDate(task.due_date);
      setStartDate(task.start_date ?? "");
      setPriority(task.priority);
      setStatus(task.status);
      setAssignee(task.assignee ?? "");
    } else {
      setTitle("");
      setDescription("");
      setCategory("lainnya");
      setDueDate("");
      setStartDate("");
      setPriority("medium");
      setStatus("todo");
      setAssignee("");
    }
  }, [task, open]);

  const isPending = createTask.isPending || updateTask.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Judul task wajib diisi");
      return;
    }
    if (!dueDate) {
      toast.error("Tanggal deadline wajib diisi");
      return;
    }

    // Map status to column_id
    const columnMap: Record<string, string> = {
      todo: "todo",
      in_progress: "in_progress",
      done: "done",
      cancelled: "todo",
    };

    if (isEdit && task) {
      updateTask.mutate(
        {
          id: task.id,
          title: title.trim(),
          description: description.trim() || null,
          category,
          due_date: dueDate,
          start_date: startDate || null,
          priority: priority as "urgent" | "high" | "medium" | "low",
          status: status as "todo" | "in_progress" | "done" | "cancelled",
          column_id: columnMap[status] ?? "todo",
          assignee: assignee.trim() || null,
        },
        {
          onSuccess: () => {
            toast.success("Task berhasil diperbarui");
            onOpenChange(false);
          },
          onError: () => {
            toast.error("Gagal memperbarui task");
          },
        }
      );
    } else {
      createTask.mutate(
        {
          wedding_id: weddingId,
          title: title.trim(),
          description: description.trim() || null,
          category,
          due_date: dueDate,
          start_date: startDate || null,
          priority: priority as "urgent" | "high" | "medium" | "low",
          status: "todo",
          column_id: "todo",
          assignee: assignee.trim() || null,
          sort_order: 0,
        },
        {
          onSuccess: () => {
            toast.success("Task berhasil dibuat");
            onOpenChange(false);
          },
          onError: () => {
            toast.error("Gagal membuat task");
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Task" : "Tambah Task"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="task-title">
              Judul <span className="text-destructive">*</span>
            </Label>
            <Input
              id="task-title"
              placeholder="Nama task"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="task-desc">Deskripsi</Label>
            <Textarea
              id="task-desc"
              placeholder="Deskripsi task (opsional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Kategori</Label>
              <Select value={category} onValueChange={(val) => setCategory(val ?? "lainnya")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Prioritas</Label>
              <Select value={priority} onValueChange={(val) => setPriority(val ?? "medium")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="task-start">Tanggal Mulai</Label>
              <Input
                id="task-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="task-due">
                Deadline <span className="text-destructive">*</span>
              </Label>
              <Input
                id="task-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
          </div>

          {isEdit && (
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(val) => setStatus(val ?? "todo")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="task-assignee">Penanggung Jawab</Label>
            <Input
              id="task-assignee"
              placeholder="Nama penanggung jawab (opsional)"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            />
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline">Batal</Button>} />
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Menyimpan..."
                : isEdit
                  ? "Simpan Perubahan"
                  : "Tambah Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
