"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TASK_TEMPLATES,
  calculateDueDate,
  type TaskTemplate,
} from "@/lib/constants/task-templates";
import { useBulkCreateTasks } from "@/lib/hooks/use-tasks";
import { useWedding } from "@/lib/hooks/use-wedding";
import { toast } from "sonner";
import {
  Loader2,
  CheckCircle2,
  Sparkles,
  FileText,
  AlertTriangle,
} from "lucide-react";

interface TaskTemplateDialogProps {
  weddingId: string;
  hasExistingTasks: boolean;
  trigger: React.ReactNode;
}

export function TaskTemplateDialog({
  weddingId,
  hasExistingTasks,
  trigger,
}: TaskTemplateDialogProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<TaskTemplate | null>(null);
  const [step, setStep] = useState<"select" | "confirm">("select");

  const { data: wedding } = useWedding();
  const bulkCreate = useBulkCreateTasks();

  const handleSelect = (template: TaskTemplate) => {
    setSelected(template);
    setStep("confirm");
  };

  const handleApply = async () => {
    if (!selected || !wedding) return;

    try {
      const tasks = selected.tasks.map((t) => ({
        title: t.title,
        category: t.category,
        priority: t.priority,
        status: "todo" as const,
        column_id: "todo",
        due_date: calculateDueDate(wedding.wedding_date, t.monthsBefore),
      }));

      await bulkCreate.mutateAsync({ weddingId, tasks });
      toast.success(
        `${selected.tasks.length} task dari template "${selected.name}" berhasil ditambahkan`
      );
      setOpen(false);
      setStep("select");
      setSelected(null);
    } catch {
      toast.error("Gagal menerapkan template");
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setStep("select");
      setSelected(null);
    }
  };

  const categoryCount = (template: TaskTemplate) => {
    const cats: Record<string, number> = {};
    template.tasks.forEach((t) => {
      cats[t.category] = (cats[t.category] ?? 0) + 1;
    });
    return cats;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent className="sm:max-w-lg">
        {step === "select" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Pilih Template Checklist
              </DialogTitle>
              <DialogDescription>
                Template akan menambahkan task dengan deadline otomatis
                berdasarkan tanggal pernikahan Anda
                {hasExistingTasks && (
                  <span className="block mt-1 text-yellow-600">
                    Task yang sudah ada tidak akan dihapus
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {TASK_TEMPLATES.map((template) => {
                const cats = categoryCount(template);
                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => handleSelect(template)}
                    className="w-full text-left rounded-xl border border-border p-4 hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-sm">{template.name}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {template.description}
                        </p>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {template.tasks.length} task
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Object.entries(cats).map(([cat, count]) => (
                        <span
                          key={cat}
                          className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground"
                        >
                          {cat} ({count})
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Konfirmasi Template
              </DialogTitle>
              <DialogDescription>
                Terapkan template &ldquo;{selected?.name}&rdquo;?
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div className="rounded-lg border border-border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{selected?.name}</span>
                  <Badge variant="secondary">
                    {selected?.tasks.length} task
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {selected?.description}
                </p>
              </div>

              {hasExistingTasks && (
                <div className="flex items-start gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-900 dark:bg-yellow-950">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-yellow-700 dark:text-yellow-400">
                    Anda sudah memiliki task. Template akan <strong>menambahkan</strong>{" "}
                    task baru tanpa menghapus yang lama. Jika ingin memulai dari awal,
                    hapus semua task terlebih dahulu.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Deadline dihitung otomatis dari tanggal pernikahan:{" "}
                <strong>{wedding?.wedding_date}</strong>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("select")}>
                Kembali
              </Button>
              <Button
                onClick={handleApply}
                disabled={bulkCreate.isPending}
                className="gap-1.5"
              >
                {bulkCreate.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Terapkan Template
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
