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
import { Badge } from "@/components/ui/badge";
import { CurrencyInput } from "@/components/shared/currency-input";
import { useCreateVendorPackage, useUpdateVendorPackage } from "@/lib/hooks/use-vendors";
import type { Tables } from "@/lib/supabase/database.types";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

interface VendorPackageDialogProps {
  vendorId: string;
  pkg?: Tables<"vendor_packages">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VendorPackageDialog({ vendorId, pkg, open, onOpenChange }: VendorPackageDialogProps) {
  const createPackage = useCreateVendorPackage();
  const updatePackage = useUpdateVendorPackage();
  const isEdit = !!pkg;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [includes, setIncludes] = useState<string[]>([]);
  const [excludes, setExcludes] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [includeInput, setIncludeInput] = useState("");
  const [excludeInput, setExcludeInput] = useState("");

  useEffect(() => {
    if (open && pkg) {
      setName(pkg.name);
      setDescription(pkg.description ?? "");
      setPrice(pkg.price);
      setIncludes(pkg.includes ?? []);
      setExcludes(pkg.excludes ?? []);
      setNotes(pkg.notes ?? "");
    } else if (open) {
      setName("");
      setDescription("");
      setPrice(0);
      setIncludes([]);
      setExcludes([]);
      setNotes("");
    }
  }, [open, pkg]);

  function addInclude() {
    if (includeInput.trim()) {
      setIncludes((prev) => [...prev, includeInput.trim()]);
      setIncludeInput("");
    }
  }

  function addExclude() {
    if (excludeInput.trim()) {
      setExcludes((prev) => [...prev, excludeInput.trim()]);
      setExcludeInput("");
    }
  }

  async function handleSubmit() {
    if (!name || price <= 0) {
      toast.error("Nama dan harga wajib diisi");
      return;
    }

    const payload = {
      name,
      description: description || null,
      price,
      includes: includes.length > 0 ? includes : null,
      excludes: excludes.length > 0 ? excludes : null,
      notes: notes || null,
    };

    try {
      if (isEdit) {
        await updatePackage.mutateAsync({ id: pkg.id, ...payload });
        toast.success("Paket berhasil diperbarui");
      } else {
        await createPackage.mutateAsync({ ...payload, vendor_id: vendorId });
        toast.success("Paket berhasil ditambahkan");
      }
      onOpenChange(false);
    } catch {
      toast.error("Gagal menyimpan paket");
    }
  }

  const isPending = createPackage.isPending || updatePackage.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Paket" : "Tambah Paket"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nama Paket *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Paket Gold" />
          </div>
          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Harga *</Label>
            <CurrencyInput value={price} onValueChange={setPrice} />
          </div>
          <div className="space-y-2">
            <Label>Termasuk</Label>
            <div className="flex gap-2">
              <Input
                value={includeInput}
                onChange={(e) => setIncludeInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInclude())}
                placeholder="Tambah item..."
              />
              <Button type="button" size="sm" variant="outline" onClick={addInclude}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {includes.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {includes.map((item, i) => (
                  <Badge key={i} variant="secondary" className="gap-1">
                    {item}
                    <button onClick={() => setIncludes((prev) => prev.filter((_, j) => j !== i))}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Tidak Termasuk</Label>
            <div className="flex gap-2">
              <Input
                value={excludeInput}
                onChange={(e) => setExcludeInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addExclude())}
                placeholder="Tambah item..."
              />
              <Button type="button" size="sm" variant="outline" onClick={addExclude}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {excludes.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {excludes.map((item, i) => (
                  <Badge key={i} variant="outline" className="gap-1">
                    {item}
                    <button onClick={() => setExcludes((prev) => prev.filter((_, j) => j !== i))}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Catatan</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
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
