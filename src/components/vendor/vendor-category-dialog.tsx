"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateVendorCategory } from "@/lib/hooks/use-vendors";
import { toast } from "sonner";

const PRESET_COLORS = [
  "#E07A5F", "#3D405B", "#C9917A", "#81B29A", "#F2CC8F",
  "#8B6F4E", "#D4A574", "#6B8DAE", "#5B8C5A", "#9C8E7E",
  "#C75C5C", "#2C2418",
];

interface VendorCategoryDialogProps {
  weddingId: string;
  trigger: React.ReactNode;
}

export function VendorCategoryDialog({ weddingId, trigger }: VendorCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("📌");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const createCategory = useCreateVendorCategory();

  async function handleSubmit() {
    if (!name.trim()) {
      toast.error("Nama kategori wajib diisi");
      return;
    }

    try {
      await createCategory.mutateAsync({
        name: name.trim(),
        icon,
        color,
        wedding_id: weddingId,
        is_default: false,
        sort_order: 99,
      });
      toast.success("Kategori berhasil ditambahkan");
      setName("");
      setIcon("📌");
      setColor(PRESET_COLORS[0]);
      setOpen(false);
    } catch {
      toast.error("Gagal menambahkan kategori");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Kategori Vendor</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nama Kategori *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Wedding Organizer" />
          </div>
          <div className="space-y-2">
            <Label>Ikon (emoji)</Label>
            <Input value={icon} onChange={(e) => setIcon(e.target.value)} className="w-20 text-center text-lg" />
          </div>
          <div className="space-y-2">
            <Label>Warna</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-7 w-7 rounded-full border-2 ${color === c ? "border-foreground" : "border-transparent"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Batal</Button>} />
          <Button onClick={handleSubmit} disabled={createCategory.isPending}>
            {createCategory.isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
