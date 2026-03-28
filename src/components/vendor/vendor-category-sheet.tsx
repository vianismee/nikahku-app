"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  useVendorCategories,
  useCreateVendorCategory,
  useUpdateVendorCategory,
  useDeleteVendorCategory,
} from "@/lib/hooks/use-vendors";
import { toast } from "sonner";
import { Pencil, Trash2, Check, X, Plus, Lock } from "lucide-react";
import type { Tables } from "@/lib/supabase/database.types";

const PRESET_COLORS = [
  "#E07A5F", "#3D405B", "#C9917A", "#81B29A", "#F2CC8F",
  "#8B6F4E", "#D4A574", "#6B8DAE", "#5B8C5A", "#9C8E7E",
  "#C75C5C", "#2C2418",
];

interface VendorCategorySheetProps {
  weddingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {PRESET_COLORS.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className={`h-7 w-7 rounded-full border-2 transition-transform ${
            value === c ? "border-foreground scale-110" : "border-transparent hover:scale-105"
          }`}
          style={{ backgroundColor: c }}
        />
      ))}
    </div>
  );
}

interface EditRowProps {
  category: Tables<"vendor_categories">;
  onCancel: () => void;
}

function EditRow({ category, onCancel }: EditRowProps) {
  const [name, setName] = useState(category.name);
  const [icon, setIcon] = useState(category.icon);
  const [color, setColor] = useState(category.color);
  const updateCategory = useUpdateVendorCategory();

  async function handleSave() {
    if (!name.trim()) {
      toast.error("Nama kategori wajib diisi");
      return;
    }
    try {
      await updateCategory.mutateAsync({ id: category.id, name: name.trim(), icon, color });
      toast.success("Kategori berhasil diperbarui");
      onCancel();
    } catch {
      toast.error("Gagal memperbarui kategori");
    }
  }

  return (
    <div className="rounded-xl border border-primary/50 bg-primary/5 p-4 space-y-4">
      <p className="text-xs font-medium text-primary uppercase tracking-wide">Edit Kategori</p>
      {/* Icon preview */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
          style={{ backgroundColor: `${color}25` }}
        >
          {icon || "📌"}
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <Label className="text-xs text-muted-foreground">Ikon & Nama</Label>
          <div className="flex items-center gap-2">
            <Input
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-14 text-center text-lg px-1"
              maxLength={2}
            />
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama kategori"
              className="flex-1"
            />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Warna</Label>
        <ColorPicker value={color} onChange={setColor} />
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="outline" size="sm" onClick={onCancel}>
          <X className="h-3.5 w-3.5 mr-1.5" />
          Batal
        </Button>
        <Button size="sm" onClick={handleSave} disabled={updateCategory.isPending}>
          <Check className="h-3.5 w-3.5 mr-1.5" />
          {updateCategory.isPending ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </div>
  );
}

function AddForm({ weddingId }: { weddingId: string }) {
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

  if (!open) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="w-full border-dashed"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4 mr-1.5" />
        Tambah Kategori Baru
      </Button>
    );
  }

  return (
    <div className="rounded-xl border border-dashed border-primary/50 bg-primary/5 p-4 space-y-4">
      <p className="text-xs font-medium text-primary uppercase tracking-wide">Kategori Baru</p>
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
          style={{ backgroundColor: `${color}25` }}
        >
          {icon || "📌"}
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <Label className="text-xs text-muted-foreground">Ikon & Nama *</Label>
          <div className="flex items-center gap-2">
            <Input
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-14 text-center text-lg px-1"
              maxLength={2}
            />
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Wedding Organizer"
              className="flex-1"
            />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Warna</Label>
        <ColorPicker value={color} onChange={setColor} />
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
          <X className="h-3.5 w-3.5 mr-1.5" />
          Batal
        </Button>
        <Button size="sm" onClick={handleSubmit} disabled={createCategory.isPending}>
          <Check className="h-3.5 w-3.5 mr-1.5" />
          {createCategory.isPending ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </div>
  );
}

export function VendorCategorySheet({ weddingId, open, onOpenChange }: VendorCategorySheetProps) {
  const { data: categories, isLoading } = useVendorCategories();
  const deleteCategory = useDeleteVendorCategory();
  const [editingId, setEditingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    try {
      await deleteCategory.mutateAsync(id);
      toast.success("Kategori berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus kategori");
    }
  }

  const defaultCategories = (categories ?? []).filter((c) => c.is_default);
  const customCategories = (categories ?? []).filter((c) => !c.is_default);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col p-0 sm:max-w-md">
        <SheetHeader className="px-4 pt-5 pb-4 border-b shrink-0">
          <SheetTitle>Kelola Kategori Vendor</SheetTitle>
          <SheetDescription>
            Atur kategori untuk mengelompokkan vendor pernikahan
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-4 space-y-5">
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-14 rounded-xl bg-muted/50 animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                {/* Custom categories */}
                {customCategories.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
                      Kategori Kustom
                    </p>
                    <div className="space-y-2">
                      {customCategories.map((cat) =>
                        editingId === cat.id ? (
                          <EditRow
                            key={cat.id}
                            category={cat}
                            onCancel={() => setEditingId(null)}
                          />
                        ) : (
                          <CategoryRow
                            key={cat.id}
                            cat={cat}
                            onEdit={() => setEditingId(cat.id)}
                            onDelete={() => handleDelete(cat.id)}
                          />
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Default categories */}
                {defaultCategories.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
                      Kategori Bawaan
                    </p>
                    <div className="space-y-2">
                      {defaultCategories.map((cat) =>
                        editingId === cat.id ? (
                          <EditRow
                            key={cat.id}
                            category={cat}
                            onCancel={() => setEditingId(null)}
                          />
                        ) : (
                          <CategoryRow
                            key={cat.id}
                            cat={cat}
                            onEdit={() => setEditingId(cat.id)}
                            onDelete={() => handleDelete(cat.id)}
                          />
                        )
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Pinned footer: add form */}
        <div className="border-t px-4 py-4 shrink-0">
          <AddForm weddingId={weddingId} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function CategoryRow({
  cat,
  onEdit,
  onDelete,
}: {
  cat: Tables<"vendor_categories">;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card px-3 py-2.5 hover:bg-muted/30 transition-colors">
      {/* Color accent bar */}
      <div
        className="w-1 self-stretch rounded-full shrink-0"
        style={{ backgroundColor: cat.color }}
      />
      {/* Icon */}
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg"
        style={{ backgroundColor: `${cat.color}20` }}
      >
        {cat.icon}
      </div>
      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{cat.name}</p>
        {cat.is_default && (
          <div className="flex items-center gap-1 mt-0.5">
            <Lock className="h-3 w-3 text-muted-foreground/60" />
            <p className="text-xs text-muted-foreground">Tidak bisa dihapus</p>
          </div>
        )}
      </div>
      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="icon-sm" onClick={onEdit}>
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        {cat.is_default ? (
          <Button variant="ghost" size="icon-sm" disabled>
            <Trash2 className="h-3.5 w-3.5 text-muted-foreground/30" />
          </Button>
        ) : (
          <ConfirmDialog
            trigger={
              <Button variant="ghost" size="icon-sm">
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            }
            title="Hapus Kategori"
            description={`Yakin ingin menghapus kategori "${cat.name}"? Vendor yang sudah menggunakan kategori ini tidak akan terhapus.`}
            onConfirm={onDelete}
          />
        )}
      </div>
    </div>
  );
}
