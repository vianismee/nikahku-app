"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { CurrencyInput } from "@/components/shared/currency-input";
import {
  useCreateVendorAdditional,
  useUpdateVendorAdditional,
  useDeleteVendorAdditional,
  useDeleteAllVendorAdditionals,
} from "@/lib/hooks/use-vendors";
import { formatRupiah } from "@/lib/utils/format-currency";
import type { Tables } from "@/lib/supabase/database.types";
import { Plus, Pencil, Trash2, Check, X, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

const UNITS = ["item", "orang", "set", "jam", "meja", "sesi", "km"] as const;

interface VendorAdditionalsTabProps {
  vendorId: string;
  additionals: Tables<"vendor_additionals">[];
}

interface AdditionalFormState {
  name: string;
  description: string;
  price: number;
  unit: string;
}

const defaultForm = (): AdditionalFormState => ({
  name: "",
  description: "",
  price: 0,
  unit: "item",
});

function AdditionalForm({
  initial,
  onSave,
  onCancel,
  isPending,
  title,
}: {
  initial: AdditionalFormState;
  onSave: (form: AdditionalFormState) => void;
  onCancel: () => void;
  isPending: boolean;
  title: string;
}) {
  const [form, setForm] = useState<AdditionalFormState>(initial);

  function set(field: keyof AdditionalFormState, value: string | number | null) {
    setForm((prev) => ({ ...prev, [field]: value ?? "" }));
  }

  function handleSubmit() {
    if (!form.name.trim()) {
      toast.error("Nama add-on wajib diisi");
      return;
    }
    if (form.price < 0) {
      toast.error("Harga tidak boleh negatif");
      return;
    }
    onSave(form);
  }

  return (
    <div className="rounded-xl border border-primary/40 bg-primary/5 p-4 space-y-3">
      <p className="text-xs font-medium text-primary uppercase tracking-wide">{title}</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1.5">
          <Label className="text-xs">Nama Add-on *</Label>
          <Input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Contoh: Hairdo Modern"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Harga (IDR)</Label>
          <CurrencyInput value={form.price} onValueChange={(v) => set("price", v)} />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Satuan</Label>
          <Select value={form.unit} onValueChange={(v) => set("unit", v)}>
            <SelectTrigger className="w-full">
              <SelectValue>{form.unit}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {UNITS.map((u) => (
                <SelectItem key={u} value={u}>
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2 space-y-1.5">
          <Label className="text-xs">Deskripsi</Label>
          <Textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={2}
            placeholder="Deskripsi singkat (opsional)"
          />
        </div>

      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Button variant="outline" size="sm" onClick={onCancel}>
          <X className="h-3.5 w-3.5 mr-1.5" />
          Batal
        </Button>
        <Button size="sm" onClick={handleSubmit} disabled={isPending}>
          <Check className="h-3.5 w-3.5 mr-1.5" />
          {isPending ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </div>
  );
}

export function VendorAdditionalsTab({ vendorId, additionals }: VendorAdditionalsTabProps) {
  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const createAdditional = useCreateVendorAdditional();
  const updateAdditional = useUpdateVendorAdditional();
  const deleteAdditional = useDeleteVendorAdditional();
  const deleteAllAdditionals = useDeleteAllVendorAdditionals();

  async function handleCreate(form: AdditionalFormState) {
    try {
      await createAdditional.mutateAsync({
        vendor_id: vendorId,
        name: form.name.trim(),
        description: form.description.trim() || null,
        price: form.price,
        unit: form.unit,
        sort_order: additionals.length,
      });
      toast.success("Add-on berhasil ditambahkan");
      setAddOpen(false);
    } catch {
      toast.error("Gagal menambahkan add-on");
    }
  }

  async function handleUpdate(id: string, form: AdditionalFormState) {
    try {
      await updateAdditional.mutateAsync({
        id,
        name: form.name.trim(),
        description: form.description.trim() || null,
        price: form.price,
        unit: form.unit,
      });
      toast.success("Add-on berhasil diperbarui");
      setEditId(null);
    } catch {
      toast.error("Gagal memperbarui add-on");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteAdditional.mutateAsync({ id, vendorId });
      toast.success("Add-on berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus add-on");
    }
  }

  async function handleDeleteAll() {
    try {
      await deleteAllAdditionals.mutateAsync(vendorId);
      toast.success("Semua add-on berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus semua add-on");
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Add-on / Biaya Tambahan</CardTitle>
        {!addOpen && (
          <div className="flex items-center gap-2">
            {additionals.length > 0 && (
              <ConfirmDialog
                trigger={
                  <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                }
                title="Hapus Semua Add-on"
                description={`Yakin ingin menghapus semua ${additionals.length} add-on? Tindakan ini tidak bisa dibatalkan.`}
                confirmLabel="Hapus Semua"
                onConfirm={handleDeleteAll}
              />
            )}
            <Button size="sm" variant="outline" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Tambah
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Add form */}
        {addOpen && (
          <AdditionalForm
            title="Add-on Baru"
            initial={defaultForm()}
            onSave={handleCreate}
            onCancel={() => setAddOpen(false)}
            isPending={createAdditional.isPending}
          />
        )}

        {/* List */}
        {additionals.length === 0 && !addOpen ? (
          <div className="text-center py-8">
            <ShoppingBag className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Belum ada add-on</p>
            <p className="text-xs text-muted-foreground mt-1">
              Tambahkan biaya di luar paket yang bisa dipilih customer
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {additionals.map((item) =>
              editId === item.id ? (
                <AdditionalForm
                  key={item.id}
                  title="Edit Add-on"
                  initial={{
                    name: item.name,
                    description: item.description ?? "",
                    price: item.price,
                    unit: item.unit,
                  }}
                  onSave={(form) => handleUpdate(item.id, form)}
                  onCancel={() => setEditId(null)}
                  isPending={updateAdditional.isPending}
                />
              ) : (
                <AdditionalRow
                  key={item.id}
                  item={item}
                  onEdit={() => setEditId(item.id)}
                  onDelete={() => handleDelete(item.id)}
                />
              )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AdditionalRow({
  item,
  onEdit,
  onDelete,
}: {
  item: Tables<"vendor_additionals">;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border bg-card px-3 py-2.5 hover:bg-muted/30 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <p className="text-sm font-medium truncate">{item.name}</p>
          <span className="text-xs text-muted-foreground shrink-0">/ {item.unit}</span>
        </div>
        {item.description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.description}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="font-number text-sm font-semibold text-primary whitespace-nowrap">
          {item.price === 0 ? "Gratis" : formatRupiah(item.price)}
        </span>
        <Button variant="ghost" size="icon-sm" onClick={onEdit}>
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <ConfirmDialog
          trigger={
            <Button variant="ghost" size="icon-sm">
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          }
          title="Hapus Add-on"
          description={`Yakin ingin menghapus add-on "${item.name}"?`}
          onConfirm={onDelete}
        />
      </div>
    </div>
  );
}
