"use client";

import { useState } from "react";
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
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  useSessions,
  useCreateSession,
  useUpdateSession,
  useDeleteSession,
} from "@/lib/hooks/use-guests";
import { CalendarDays, Clock, MapPin, Users, Plus, Pencil, Trash2, Settings, AlertTriangle } from "lucide-react";
import type { Tables } from "@/lib/supabase/database.types";
import { toast } from "sonner";

type GuestWithSessions = Tables<"guests"> & {
  guest_sessions?: { session_id: string }[];
};

interface SessionManagerProps {
  weddingId: string;
  guests?: GuestWithSessions[];
}

interface SessionFormState {
  name: string;
  session_date: string;
  time_start: string;
  time_end: string;
  venue: string;
  max_capacity: string;
}

const EMPTY_FORM: SessionFormState = {
  name: "",
  session_date: "",
  time_start: "",
  time_end: "",
  venue: "",
  max_capacity: "",
};

export function SessionManager({ weddingId, guests }: SessionManagerProps) {
  const { data: sessions } = useSessions(weddingId);

  // Compute pax count per session
  const paxPerSession: Record<string, number> = {};
  for (const guest of guests ?? []) {
    for (const gs of guest.guest_sessions ?? []) {
      paxPerSession[gs.session_id] = (paxPerSession[gs.session_id] ?? 0) + (guest.pax_count ?? 1);
    }
  }
  const createSession = useCreateSession();
  const updateSession = useUpdateSession();
  const deleteSession = useDeleteSession();

  const [open, setOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Tables<"sessions"> | null>(null);
  const [form, setForm] = useState<SessionFormState>(EMPTY_FORM);

  function openCreate() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  }

  function openEdit(session: Tables<"sessions">) {
    setEditTarget(session);
    setForm({
      name: session.name,
      session_date: session.session_date ?? "",
      time_start: session.time_start ?? "",
      time_end: session.time_end ?? "",
      venue: session.venue ?? "",
      max_capacity: session.max_capacity != null ? String(session.max_capacity) : "",
    });
    setFormOpen(true);
  }

  async function handleSubmit() {
    if (!form.name.trim()) {
      toast.error("Nama sesi wajib diisi");
      return;
    }

    const payload = {
      name: form.name.trim(),
      session_date: form.session_date || null,
      time_start: form.time_start || null,
      time_end: form.time_end || null,
      venue: form.venue || null,
      max_capacity: form.max_capacity ? parseInt(form.max_capacity) : null,
    };

    try {
      if (editTarget) {
        await updateSession.mutateAsync({ id: editTarget.id, ...payload });
        toast.success("Sesi berhasil diperbarui");
      } else {
        await createSession.mutateAsync({
          ...payload,
          wedding_id: weddingId,
          sort_order: (sessions?.length ?? 0),
        });
        toast.success("Sesi berhasil ditambahkan");
      }
      setFormOpen(false);
    } catch {
      toast.error("Gagal menyimpan sesi");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteSession.mutateAsync({ id, weddingId });
      toast.success("Sesi berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus sesi");
    }
  }

  const isPending = createSession.isPending || updateSession.isPending;

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Settings className="h-4 w-4 mr-1.5" />
        Kelola Sesi
      </Button>

      {/* Session list dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Kelola Sesi Pernikahan</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {(!sessions || sessions.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-6">
                Belum ada sesi. Tambahkan sesi seperti Akad, Resepsi Siang, dll.
              </p>
            )}

            {sessions?.map((session) => (
              <div
                key={session.id}
                className="border rounded-lg p-3 space-y-2 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{session.name}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openEdit(session)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <ConfirmDialog
                      trigger={
                        <Button variant="ghost" size="icon-sm">
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      }
                      title="Hapus Sesi"
                      description={`Yakin ingin menghapus sesi "${session.name}"? Semua assignment tamu ke sesi ini akan ikut terhapus.`}
                      onConfirm={() => handleDelete(session.id)}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {session.session_date && (
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {new Date(session.session_date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  )}
                  {(session.time_start || session.time_end) && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {session.time_start ?? ""}
                      {session.time_end ? ` – ${session.time_end}` : ""}
                    </span>
                  )}
                  {session.venue && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {session.venue}
                    </span>
                  )}
                  {session.max_capacity != null && (() => {
                    const pax = paxPerSession[session.id] ?? 0;
                    const over = pax > session.max_capacity;
                    return (
                      <span className={`flex items-center gap-1 ${over ? "text-destructive font-medium" : ""}`}>
                        {over
                          ? <AlertTriangle className="h-3 w-3" />
                          : <Users className="h-3 w-3" />}
                        {pax}/{session.max_capacity} orang
                        {over && " (melebihi kapasitas!)"}
                      </span>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="justify-between sm:justify-between">
            <Button variant="outline" size="sm" onClick={openCreate}>
              <Plus className="h-4 w-4 mr-1" />
              Tambah Sesi
            </Button>
            <DialogClose render={<Button variant="ghost" size="sm">Tutup</Button>} />
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add / Edit session form dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editTarget ? "Edit Sesi" : "Tambah Sesi"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nama Sesi <span className="text-destructive">*</span></Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Contoh: Akad, Resepsi Siang, Resepsi Malam"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Tanggal</Label>
                <Input
                  type="date"
                  value={form.session_date}
                  onChange={(e) => setForm((f) => ({ ...f, session_date: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Kapasitas Maks</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.max_capacity}
                  onChange={(e) => setForm((f) => ({ ...f, max_capacity: e.target.value }))}
                  placeholder="Contoh: 500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Jam Mulai</Label>
                <Input
                  type="time"
                  value={form.time_start}
                  onChange={(e) => setForm((f) => ({ ...f, time_start: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Jam Selesai</Label>
                <Input
                  type="time"
                  value={form.time_end}
                  onChange={(e) => setForm((f) => ({ ...f, time_end: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Venue / Lokasi</Label>
              <Input
                value={form.venue}
                onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))}
                placeholder="Contoh: Gedung A, Masjid Al-Ikhlas"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline">Batal</Button>} />
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
