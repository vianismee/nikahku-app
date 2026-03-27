"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Tables } from "@/lib/supabase/database.types";

interface FormValues {
  session: string;
  start_time: string;
  end_time: string;
  title: string;
  description: string;
  pic: string;
  location: string;
}

interface RundownEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Tables<"rundown_events"> | null;
  onSubmit: (values: FormValues) => Promise<void>;
  isLoading?: boolean;
}

const EMPTY: FormValues = {
  session: "",
  start_time: "",
  end_time: "",
  title: "",
  description: "",
  pic: "",
  location: "",
};

export function RundownEventDialog({
  open,
  onOpenChange,
  event,
  onSubmit,
  isLoading,
}: RundownEventDialogProps) {
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});

  useEffect(() => {
    if (open) {
      setValues({
        session: event?.session ?? "",
        start_time: event?.start_time ?? "",
        end_time: event?.end_time ?? "",
        title: event?.title ?? "",
        description: event?.description ?? "",
        pic: event?.pic ?? "",
        location: event?.location ?? "",
      });
      setErrors({});
    }
  }, [open, event]);

  function set(field: keyof FormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Partial<Record<keyof FormValues, string>> = {};
    if (!values.session.trim()) newErrors.session = "Sesi wajib diisi";
    if (!values.start_time) newErrors.start_time = "Waktu mulai wajib diisi";
    if (!values.title.trim()) newErrors.title = "Nama acara wajib diisi";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    await onSubmit(values);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Acara" : "Tambah Acara"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rd-session">
              Sesi / Kategori <span className="text-destructive">*</span>
            </Label>
            <Input
              id="rd-session"
              placeholder="cth: Akad Nikah, Resepsi, Hiburan"
              value={values.session}
              onChange={(e) => set("session", e.target.value)}
            />
            {errors.session && (
              <p className="text-xs text-destructive">{errors.session}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="rd-start">
                Mulai <span className="text-destructive">*</span>
              </Label>
              <Input
                id="rd-start"
                type="time"
                value={values.start_time}
                onChange={(e) => set("start_time", e.target.value)}
              />
              {errors.start_time && (
                <p className="text-xs text-destructive">{errors.start_time}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="rd-end">Selesai</Label>
              <Input
                id="rd-end"
                type="time"
                value={values.end_time}
                onChange={(e) => set("end_time", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rd-title">
              Nama Acara <span className="text-destructive">*</span>
            </Label>
            <Input
              id="rd-title"
              placeholder="cth: Prosesi Ijab Kabul"
              value={values.title}
              onChange={(e) => set("title", e.target.value)}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rd-desc">Deskripsi</Label>
            <Textarea
              id="rd-desc"
              placeholder="Deskripsi singkat acara..."
              rows={2}
              value={values.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="rd-pic">Penanggung Jawab (PIC)</Label>
              <Input
                id="rd-pic"
                placeholder="cth: MC, WO"
                value={values.pic}
                onChange={(e) => set("pic", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rd-loc">Lokasi</Label>
              <Input
                id="rd-loc"
                placeholder="cth: Ruang Akad"
                value={values.location}
                onChange={(e) => set("location", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : event ? "Simpan Perubahan" : "Tambah Acara"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
