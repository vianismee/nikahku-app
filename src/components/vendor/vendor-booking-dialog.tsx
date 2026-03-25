"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/shared/currency-input";
import { useUpdateVendor } from "@/lib/hooks/use-vendors";
import { toast } from "sonner";

interface VendorBookingDialogProps {
  vendorId: string;
  weddingId: string;
  vendorName: string;
  categoryName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VendorBookingDialog({
  vendorId,
  weddingId,
  vendorName,
  categoryName,
  open,
  onOpenChange,
}: VendorBookingDialogProps) {
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split("T")[0]);
  const [priceDeal, setPriceDeal] = useState(0);
  const [dpAmount, setDpAmount] = useState(0);
  const [paymentDeadline, setPaymentDeadline] = useState("");

  const updateVendor = useUpdateVendor();

  async function handleSubmit() {
    if (priceDeal <= 0) {
      toast.error("Harga deal wajib diisi");
      return;
    }

    if (dpAmount > priceDeal) {
      toast.error("Jumlah DP tidak boleh lebih besar dari harga deal");
      return;
    }

    try {
      await updateVendor.mutateAsync({
        id: vendorId,
        status: "booked" as const,
        booking_date: bookingDate,
        price_deal: priceDeal,
        dp_amount: dpAmount || null,
        payment_deadline: paymentDeadline || null,
      });

      // NOTE: Tidak membuat expense di sini.
      // DB trigger `recalculate_budget` sudah otomatis menghitung
      // vendors.price_deal ke spent_amount saat status = booked.
      // Expense hanya dibuat saat pembayaran aktual (DP / pelunasan).

      toast.success("Vendor berhasil di-book");
      onOpenChange(false);
    } catch {
      toast.error("Gagal booking vendor");
    }
  }

  const isPending = updateVendor.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book Vendor</DialogTitle>
          <DialogDescription>
            Masukkan detail booking untuk {vendorName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Tanggal Booking</Label>
            <Input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Harga Deal *</Label>
            <CurrencyInput value={priceDeal} onValueChange={setPriceDeal} />
          </div>
          <div className="space-y-2">
            <Label>Jumlah DP</Label>
            <CurrencyInput value={dpAmount} onValueChange={setDpAmount} />
          </div>
          <div className="space-y-2">
            <Label>Deadline Pelunasan</Label>
            <Input
              type="date"
              value={paymentDeadline}
              onChange={(e) => setPaymentDeadline(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Batal</Button>} />
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Menyimpan..." : "Book Vendor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
