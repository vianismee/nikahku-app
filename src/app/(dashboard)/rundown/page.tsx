"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  ScrollText,
  Sparkles,
  Trash2,
  Download,
  LayoutList,
  TableProperties,
  Clock,
  User,
  MapPin,
  Pencil,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RundownEventDialog } from "@/components/rundown/rundown-event-dialog";
import { RundownTemplateDialog } from "@/components/rundown/rundown-template-dialog";
import { RundownTimeline } from "@/components/rundown/rundown-timeline";
import { useWedding } from "@/lib/hooks/use-wedding";
import {
  useRundownEvents,
  useCreateRundownEvent,
  useUpdateRundownEvent,
  useDeleteRundownEvent,
  useDeleteAllRundownEvents,
  useBulkCreateRundownEvents,
  useReorderRundownEvents,
} from "@/lib/hooks/use-rundown";
import { downloadCsv } from "@/lib/utils/export-csv";
import { toast } from "sonner";
import type { Tables } from "@/lib/supabase/database.types";
import type { RundownTemplate } from "@/lib/utils/rundown-templates";

export default function RundownPage() {
  const { data: wedding, isLoading: weddingLoading } = useWedding();
  const weddingId = wedding?.id;
  const { data: events = [], isLoading: eventsLoading } = useRundownEvents(weddingId);

  const createEvent = useCreateRundownEvent();
  const updateEvent = useUpdateRundownEvent();
  const deleteEvent = useDeleteRundownEvent();
  const deleteAllEvents = useDeleteAllRundownEvents();
  const bulkCreate = useBulkCreateRundownEvents();
  const reorder = useReorderRundownEvents();

  const [viewMode, setViewMode] = useState<"timeline" | "table">("timeline");
  const [formOpen, setFormOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Tables<"rundown_events"> | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<Tables<"rundown_events"> | null>(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const filteredEvents = useMemo(() => {
    if (!search) return events;
    const q = search.toLowerCase();
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.session.toLowerCase().includes(q) ||
        (e.pic ?? "").toLowerCase().includes(q) ||
        (e.location ?? "").toLowerCase().includes(q)
    );
  }, [events, search]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedEvents = filteredEvents.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const sessions = useMemo(() => {
    const seen = new Set<string>();
    for (const e of events) seen.add(e.session);
    return seen.size;
  }, [events]);

  const handleAdd = () => {
    setEditingEvent(null);
    setFormOpen(true);
  };

  const handleEdit = (event: Tables<"rundown_events">) => {
    setEditingEvent(event);
    setFormOpen(true);
  };

  const handleSubmitForm = async (values: {
    session: string;
    start_time: string;
    end_time: string;
    title: string;
    description: string;
    pic: string;
    location: string;
  }) => {
    if (!weddingId) return;
    const payload = {
      session: values.session,
      start_time: values.start_time,
      end_time: values.end_time || null,
      title: values.title,
      description: values.description || null,
      pic: values.pic || null,
      location: values.location || null,
    };
    try {
      if (editingEvent) {
        await updateEvent.mutateAsync({ id: editingEvent.id, ...payload });
        toast.success("Acara berhasil diperbarui");
      } else {
        await createEvent.mutateAsync({
          ...payload,
          wedding_id: weddingId,
          sort_order: events.length,
        });
        toast.success("Acara berhasil ditambahkan");
      }
    } catch {
      toast.error("Gagal menyimpan acara");
    }
  };

  const handleDelete = async () => {
    if (!deletingEvent || !weddingId) return;
    try {
      await deleteEvent.mutateAsync({ id: deletingEvent.id, weddingId });
      toast.success("Acara berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus acara");
    } finally {
      setDeletingEvent(null);
    }
  };

  const handleDeleteAll = async () => {
    if (!weddingId) return;
    try {
      await deleteAllEvents.mutateAsync({ weddingId });
      toast.success("Semua acara berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus semua acara");
    } finally {
      setConfirmDeleteAll(false);
    }
  };

  const handleApplyTemplate = async (template: RundownTemplate) => {
    if (!weddingId) return;
    try {
      await bulkCreate.mutateAsync({ weddingId, events: template.events });
      toast.success(`Template "${template.name}" berhasil diterapkan (${template.events.length} acara)`);
    } catch {
      toast.error("Gagal menerapkan template");
    }
  };

  const handleReorder = async (orderedIds: string[]) => {
    if (!weddingId) return;
    try {
      await reorder.mutateAsync({ weddingId, orderedIds });
    } catch {
      toast.error("Gagal menyimpan urutan");
    }
  };

  const handleExport = () => {
    const headers = ["Sesi", "Waktu Mulai", "Waktu Selesai", "Nama Acara", "Deskripsi", "PIC", "Lokasi"];
    const rows = events.map((e) => [
      e.session,
      e.start_time,
      e.end_time ?? "",
      e.title,
      e.description ?? "",
      e.pic ?? "",
      e.location ?? "",
    ]);
    downloadCsv(
      `rundown-${wedding?.partner_1_name ?? "nikah"}-${wedding?.partner_2_name ?? ""}.csv`,
      headers,
      rows
    );
  };

  if (weddingLoading || eventsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!wedding) {
    return (
      <EmptyState
        icon={ScrollText}
        title="Data pernikahan belum ada"
        description="Lengkapi data pernikahanmu terlebih dahulu sebelum membuat rundown."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rundown Acara"
        description="Susun jadwal acara pernikahanmu dari pagi hingga malam"
        actions={
          <div className="flex items-center gap-2">
            {events.length > 0 && (
              <>
                <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirmDeleteAll(true)}
                  className="gap-1.5 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Reset</span>
                </Button>
              </>
            )}
            <Button variant="outline" size="sm" onClick={() => setTemplateOpen(true)} className="gap-1.5">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Template</span>
            </Button>
            <Button size="sm" onClick={handleAdd} className="gap-1.5">
              <Plus className="h-4 w-4" />
              Tambah Acara
            </Button>
          </div>
        }
      />

      {/* Stats */}
      {events.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border bg-card p-4 text-center">
            <p className="text-2xl font-bold font-heading text-primary">{events.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total Acara</p>
          </div>
          <div className="rounded-xl border bg-card p-4 text-center">
            <p className="text-2xl font-bold font-heading text-primary">{sessions}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Sesi</p>
          </div>
          <div className="rounded-xl border bg-card p-4 text-center">
            <p className="text-2xl font-bold font-heading text-primary">
              {events[0]?.start_time ?? "--"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Mulai</p>
          </div>
        </div>
      )}

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="mx-auto w-14 h-14 rounded-full border-2 border-muted flex items-center justify-center mb-4">
            <ScrollText className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-heading font-semibold mb-1">Rundown belum ada</h3>
          <p className="text-sm text-muted-foreground max-w-sm mb-4">
            Mulai susun rundown acaramu. Gunakan template untuk mempercepat proses.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <Button onClick={() => setTemplateOpen(true)} variant="outline" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Pakai Template
            </Button>
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Manual
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Toolbar */}
          <div className="flex items-center gap-3 flex-wrap">
            <Input
              placeholder="Cari acara..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="h-8 max-w-xs text-sm"
            />
            <div className="flex items-center border rounded-lg p-0.5 gap-0.5 ml-auto">
              <Button
                variant={viewMode === "timeline" ? "default" : "ghost"}
                size="sm"
                className="h-7 px-2.5"
                onClick={() => setViewMode("timeline")}
              >
                <LayoutList className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                className="h-7 px-2.5"
                onClick={() => setViewMode("table")}
              >
                <TableProperties className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          {viewMode === "timeline" ? (
            <RundownTimeline
              events={filteredEvents}
              onEdit={handleEdit}
              onDelete={(event) => setDeletingEvent(event)}
              onReorder={handleReorder}
            />
          ) : (
            <div className="space-y-3">
              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-28">Waktu</TableHead>
                      <TableHead>Nama Acara</TableHead>
                      <TableHead className="hidden sm:table-cell">Sesi</TableHead>
                      <TableHead className="hidden md:table-cell">PIC</TableHead>
                      <TableHead className="hidden lg:table-cell">Lokasi</TableHead>
                      <TableHead className="w-20 text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagedEvents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-sm">
                          Tidak ada acara ditemukan
                        </TableCell>
                      </TableRow>
                    ) : (
                      pagedEvents.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-mono text-xs text-primary">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 shrink-0" />
                              <span>
                                {event.start_time}
                                {event.end_time ? ` – ${event.end_time}` : ""}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium text-sm">{event.title}</p>
                            {event.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {event.description}
                              </p>
                            )}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant="secondary" className="text-xs">
                              {event.session}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                            {event.pic ? (
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {event.pic}
                              </span>
                            ) : (
                              <span className="text-muted-foreground/40">—</span>
                            )}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                            {event.location ? (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </span>
                            ) : (
                              <span className="text-muted-foreground/40">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => handleEdit(event)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:text-destructive"
                                onClick={() => setDeletingEvent(event)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between gap-4 px-1">
                <p className="text-xs text-muted-foreground">
                  Menampilkan{" "}
                  <span className="font-medium text-foreground">
                    {filteredEvents.length === 0
                      ? 0
                      : (safePage - 1) * PAGE_SIZE + 1}
                    –{Math.min(safePage * PAGE_SIZE, filteredEvents.length)}
                  </span>{" "}
                  dari{" "}
                  <span className="font-medium text-foreground">{filteredEvents.length}</span>{" "}
                  acara
                </p>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setCurrentPage(1)}
                    disabled={safePage === 1}
                    aria-label="Halaman pertama"
                  >
                    <ChevronsLeft className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    aria-label="Halaman sebelumnya"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>

                  {/* Page number pills */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                      .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                        if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((item, idx) =>
                        item === "..." ? (
                          <span key={`ellipsis-${idx}`} className="px-1 text-xs text-muted-foreground">
                            …
                          </span>
                        ) : (
                          <Button
                            key={item}
                            variant={safePage === item ? "default" : "outline"}
                            size="icon"
                            className="h-7 w-7 text-xs"
                            onClick={() => setCurrentPage(item as number)}
                          >
                            {item}
                          </Button>
                        )
                      )}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                    aria-label="Halaman berikutnya"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={safePage === totalPages}
                    aria-label="Halaman terakhir"
                  >
                    <ChevronsRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Dialogs */}
      <RundownEventDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        event={editingEvent}
        onSubmit={handleSubmitForm}
        isLoading={createEvent.isPending || updateEvent.isPending}
      />

      <RundownTemplateDialog
        open={templateOpen}
        onOpenChange={setTemplateOpen}
        onApply={handleApplyTemplate}
        isLoading={bulkCreate.isPending}
      />

      {/* Delete single event confirm */}
      <Dialog open={!!deletingEvent} onOpenChange={(open) => !open && setDeletingEvent(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Acara</DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus &quot;{deletingEvent?.title}&quot;? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingEvent(null)}>Batal</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteEvent.isPending}>
              {deleteEvent.isPending ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete all confirm */}
      <Dialog open={confirmDeleteAll} onOpenChange={setConfirmDeleteAll}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Reset Semua Rundown</DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus semua acara? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteAll(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDeleteAll} disabled={deleteAllEvents.isPending}>
              {deleteAllEvents.isPending ? "Menghapus..." : "Reset Semua"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
