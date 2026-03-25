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
import { CurrencyInput } from "@/components/shared/currency-input";
import { useCreateSeserahan, useUpdateSeserahan } from "@/lib/hooks/use-seserahan";
import { SESERAHAN_CATEGORIES, PRIORITIES, type SeserahanCategory, type SeserahanPriority } from "@/lib/constants/seserahan-statuses";
import { detectPlatform, getPlatformName } from "@/lib/utils/platform-detect";
import type { Tables } from "@/lib/supabase/database.types";
import { toast } from "sonner";

interface SeserahanFormDialogProps {
  weddingId: string;
  item?: Tables<"seserahan">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCategory?: SeserahanCategory;
}

export function SeserahanFormDialog({ weddingId, item, open, onOpenChange, defaultCategory }: SeserahanFormDialogProps) {
  const isEdit = !!item;

  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState<SeserahanCategory>(defaultCategory ?? "seserahan");
  const [subCategory, setSubCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(0);
  const [shopUrl, setShopUrl] = useState("");
  const [priority, setPriority] = useState<SeserahanPriority>("sedang");
  const [notes, setNotes] = useState("");

  const createItem = useCreateSeserahan();
  const updateItem = useUpdateSeserahan();

  useEffect(() => {
    if (open && item) {
      setItemName(item.item_name);
      setCategory(item.category);
      setSubCategory(item.sub_category ?? "");
      setBrand(item.brand ?? "");
      setPriceMin(item.price_min);
      setPriceMax(item.price_max);
      setShopUrl(item.shop_url ?? "");
      setPriority(item.priority);
      setNotes(item.notes ?? "");
    } else if (open) {
      setItemName("");
      setCategory(defaultCategory ?? "seserahan");
      setSubCategory("");
      setBrand("");
      setPriceMin(0);
      setPriceMax(0);
      setShopUrl("");
      setPriority("sedang");
      setNotes("");
    }
  }, [open, item, defaultCategory]);

  async function handleSubmit() {
    if (!itemName.trim()) {
      toast.error("Nama item wajib diisi");
      return;
    }

    const platform = detectPlatform(shopUrl);

    const payload = {
      item_name: itemName.trim(),
      category,
      sub_category: subCategory || null,
      brand: brand || null,
      price_min: priceMin,
      price_max: priceMax || priceMin,
      shop_url: shopUrl || null,
      shop_platform: platform,
      priority,
      notes: notes || null,
    };

    try {
      if (isEdit) {
        await updateItem.mutateAsync({ id: item.id, ...payload });
        toast.success("Item berhasil diperbarui");
      } else {
        await createItem.mutateAsync({ ...payload, wedding_id: weddingId });
        toast.success("Item berhasil ditambahkan");
      }
      onOpenChange(false);
    } catch {
      toast.error("Gagal menyimpan item");
    }
  }

  const isPending = createItem.isPending || updateItem.isPending;
  const detectedPlatform = detectPlatform(shopUrl);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Item" : "Tambah Item"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nama Item <span className="text-destructive">*</span></Label>
            <Input
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Contoh: Al-Quran, Cincin Emas, dll"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Kategori</Label>
              <Select
                value={category}
                onValueChange={(v) => setCategory((v as SeserahanCategory) ?? "seserahan")}
                items={Object.entries(SESERAHAN_CATEGORIES).map(([k, v]) => ({ value: k, label: v }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(SESERAHAN_CATEGORIES) as [SeserahanCategory, string][]).map(
                    ([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Prioritas</Label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority((v as SeserahanPriority) ?? "sedang")}
                items={Object.entries(PRIORITIES).map(([k, v]) => ({ value: k, label: v.label }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.entries(PRIORITIES) as [SeserahanPriority, { label: string }][]).map(
                    ([key, { label }]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Sub Kategori</Label>
              <Input
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                placeholder="Contoh: Parfum, Tas"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Merek</Label>
              <Input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Contoh: Wardah"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Harga Min</Label>
              <CurrencyInput value={priceMin} onValueChange={setPriceMin} />
            </div>
            <div className="space-y-1.5">
              <Label>Harga Max</Label>
              <CurrencyInput value={priceMax} onValueChange={setPriceMax} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Link Toko</Label>
            <Input
              value={shopUrl}
              onChange={(e) => setShopUrl(e.target.value)}
              placeholder="https://shopee.co.id/..."
            />
            {shopUrl && detectedPlatform && (
              <p className="text-xs text-muted-foreground">
                Terdeteksi: {getPlatformName(detectedPlatform)}
              </p>
            )}
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
