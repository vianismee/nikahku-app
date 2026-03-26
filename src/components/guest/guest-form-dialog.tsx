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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateGuest, useUpdateGuest } from "@/lib/hooks/use-guests";
import { RSVP_STATUSES, type RsvpStatus } from "@/lib/constants/rsvp-statuses";
import type { Tables } from "@/lib/supabase/database.types";
import { toast } from "sonner";

const CATEGORY_SUGGESTIONS = ["Keluarga", "Teman", "Kantor", "Tetangga"];

interface GuestFormDialogProps {
  weddingId: string;
  guest?: Tables<"guests">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GuestFormDialog({ weddingId, guest, open, onOpenChange }: GuestFormDialogProps) {
  const isEdit = !!guest;

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [paxCount, setPaxCount] = useState(1);
  const [rsvpStatus, setRsvpStatus] = useState<RsvpStatus>("belum_diundang");
  const [notes, setNotes] = useState("");

  const createGuest = useCreateGuest();
  const updateGuest = useUpdateGuest();

  useEffect(() => {
    if (open && guest) {
      setName(guest.name);
      setCategory(guest.category);
      setPhone(guest.phone ?? "");
      setEmail(guest.email ?? "");
      setPaxCount(guest.pax_count);
      setRsvpStatus(guest.rsvp_status);
      setNotes(guest.notes ?? "");
    } else if (open) {
      setName("");
      setCategory("");
      setPhone("");
      setEmail("");
      setPaxCount(1);
      setRsvpStatus("belum_diundang");
      setNotes("");
    }
  }, [open, guest]);

  async function handleSubmit() {
    if (!name.trim()) {
      toast.error("Nama tamu wajib diisi");
      return;
    }

    const payload = {
      name: name.trim(),
      category: category || "Lainnya",
      phone: phone || null,
      email: email || null,
      pax_count: paxCount,
      rsvp_status: rsvpStatus,
      notes: notes || null,
    };

    try {
      if (isEdit) {
        await updateGuest.mutateAsync({ id: guest.id, ...payload });
        toast.success("Tamu berhasil diperbarui");
      } else {
        await createGuest.mutateAsync({ ...payload, wedding_id: weddingId });
        toast.success("Tamu berhasil ditambahkan");
      }
      onOpenChange(false);
    } catch {
      toast.error("Gagal menyimpan data tamu");
    }
  }

  const isPending = createGuest.isPending || updateGuest.isPending;

  const rsvpItems = Object.entries(RSVP_STATUSES).map(([key, { label }]) => ({
    value: key,
    label,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Tamu" : "Tambah Tamu"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nama <span className="text-destructive">*</span></Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap tamu"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Kategori</Label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Contoh: Keluarga, Teman, Kantor"
              list="category-suggestions"
            />
            <datalist id="category-suggestions">
              {CATEGORY_SUGGESTIONS.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>No. Telepon</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08xxxxxxxxxx"
                type="tel"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@contoh.com"
                type="email"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Jumlah Pax</Label>
              <Input
                type="number"
                min={1}
                value={paxCount}
                onChange={(e) => setPaxCount(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Status RSVP</Label>
              <Select
                value={rsvpStatus}
                onValueChange={(v) => setRsvpStatus((v as RsvpStatus) ?? "belum_diundang")}
                items={rsvpItems}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(RSVP_STATUSES) as [RsvpStatus, { label: string }][]).map(
                    ([key, { label }]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Catatan</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan tambahan..."
              rows={2}
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
  );
}
