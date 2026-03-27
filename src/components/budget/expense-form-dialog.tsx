"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CurrencyInput } from "@/components/shared/currency-input";
import { VendorPicker } from "./vendor-picker";
import { useCreateExpense, useUpdateExpense } from "@/lib/hooks/use-budget";
import { useVendors, useVendorCategories } from "@/lib/hooks/use-vendors";
import type { Tables } from "@/lib/supabase/database.types";
import { toast } from "sonner";

interface ExpenseFormDialogProps {
  weddingId: string;
  expense?: Tables<"expenses">;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ExpenseFormDialog({ weddingId, expense, trigger, open: controlledOpen, onOpenChange }: ExpenseFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = (v: boolean) => {
    setInternalOpen(v);
    onOpenChange?.(v);
  };
  const [category, setCategory] = useState(expense?.category ?? "");
  const [description, setDescription] = useState(expense?.description ?? "");
  const [amount, setAmount] = useState(expense?.amount ?? 0);
  const [expenseDate, setExpenseDate] = useState(
    expense?.expense_date ?? new Date().toISOString().split("T")[0]
  );
  const [vendorId, setVendorId] = useState(expense?.vendor_id ?? "");
  const [notes, setNotes] = useState(expense?.notes ?? "");

  const { data: categories } = useVendorCategories();
  const { data: vendors } = useVendors(weddingId);
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();

  useEffect(() => {
    if (open && expense) {
      setCategory(expense.category);
      setDescription(expense.description);
      setAmount(expense.amount);
      setExpenseDate(expense.expense_date);
      setVendorId(expense.vendor_id ?? "");
      setNotes(expense.notes ?? "");
    }
  }, [open, expense]);

  function resetForm() {
    if (!expense) {
      setCategory("");
      setDescription("");
      setAmount(0);
      setExpenseDate(new Date().toISOString().split("T")[0]);
      setVendorId("");
      setNotes("");
    }
  }

  async function handleSubmit() {
    if (!category || !description || amount <= 0) {
      toast.error("Kategori, deskripsi, dan jumlah wajib diisi");
      return;
    }

    try {
      if (expense) {
        await updateExpense.mutateAsync({
          id: expense.id,
          category,
          description,
          amount,
          expense_date: expenseDate,
          vendor_id: vendorId || null,
          notes: notes || null,
        });
        toast.success("Pengeluaran berhasil diperbarui");
      } else {
        await createExpense.mutateAsync({
          wedding_id: weddingId,
          category,
          description,
          amount,
          expense_date: expenseDate,
          vendor_id: vendorId || null,
          notes: notes || null,
        });
        toast.success("Pengeluaran berhasil ditambahkan");
        resetForm();
      }
      setOpen(false);
    } catch {
      toast.error("Gagal menyimpan pengeluaran");
    }
  }

  const isPending = createExpense.isPending || updateExpense.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger render={trigger as React.ReactElement} />}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{expense ? "Edit Pengeluaran" : "Tambah Pengeluaran"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Kategori *</Label>
            <Select value={category} onValueChange={(v) => setCategory(v ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Deskripsi *</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: DP Catering"
            />
          </div>
          <div className="space-y-2">
            <Label>Jumlah *</Label>
            <CurrencyInput value={amount} onValueChange={setAmount} />
          </div>
          <div className="space-y-2">
            <Label>Tanggal</Label>
            <Input
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Vendor (opsional)</Label>
            <VendorPicker
              vendors={vendors ?? []}
              value={vendorId}
              onValueChange={setVendorId}
            />
          </div>
          <div className="space-y-2">
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
