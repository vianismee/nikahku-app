"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/shared/currency-input";
import { Label } from "@/components/ui/label";
import { useUpdateBudget } from "@/lib/hooks/use-budget";
import { toast } from "sonner";

interface TotalBudgetDialogProps {
  weddingId: string;
  currentAmount: number;
  trigger: React.ReactNode;
}

export function TotalBudgetDialog({ weddingId, currentAmount, trigger }: TotalBudgetDialogProps) {
  const [amount, setAmount] = useState(currentAmount);
  const [open, setOpen] = useState(false);
  const updateBudget = useUpdateBudget();

  async function handleSubmit() {
    if (amount <= 0) {
      toast.error("Total budget harus lebih dari 0");
      return;
    }

    try {
      await updateBudget.mutateAsync({ weddingId, totalAmount: amount });
      toast.success("Total budget berhasil diperbarui");
      setOpen(false);
    } catch {
      toast.error("Gagal memperbarui budget");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atur Total Budget</DialogTitle>
          <DialogDescription>
            Masukkan total anggaran untuk pernikahan Anda
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label>Total Budget</Label>
          <CurrencyInput value={amount} onValueChange={setAmount} />
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Batal</Button>} />
          <Button onClick={handleSubmit} disabled={updateBudget.isPending}>
            {updateBudget.isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
