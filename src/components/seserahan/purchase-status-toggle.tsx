"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/shared/currency-input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useUpdateSeserahan } from "@/lib/hooks/use-seserahan";
import { PURCHASE_STATUSES, type PurchaseStatus } from "@/lib/constants/seserahan-statuses";
import { toast } from "sonner";

interface PurchaseStatusToggleProps {
  itemId: string;
  currentStatus: PurchaseStatus;
  actualPrice: number | null;
  purchaseDate: string | null;
}

export function PurchaseStatusToggle({
  itemId,
  currentStatus,
  actualPrice,
  purchaseDate,
}: PurchaseStatusToggleProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [price, setPrice] = useState(actualPrice ?? 0);
  const [date, setDate] = useState(purchaseDate ?? new Date().toISOString().split("T")[0]);

  const updateItem = useUpdateSeserahan();
  const statusInfo = PURCHASE_STATUSES[currentStatus];

  async function handleMarkPurchased() {
    if (price <= 0) {
      toast.error("Harga aktual wajib diisi");
      return;
    }

    try {
      await updateItem.mutateAsync({
        id: itemId,
        purchase_status: "sudah_dibeli",
        actual_price: price,
        purchase_date: date,
      });
      toast.success("Status diperbarui");
      setPopoverOpen(false);
    } catch {
      toast.error("Gagal memperbarui status");
    }
  }

  async function handleMarkReceived() {
    try {
      await updateItem.mutateAsync({
        id: itemId,
        purchase_status: "sudah_diterima",
      });
      toast.success("Status diperbarui");
    } catch {
      toast.error("Gagal memperbarui status");
    }
  }

  async function handleRevert() {
    try {
      await updateItem.mutateAsync({
        id: itemId,
        purchase_status: "belum_dibeli",
        actual_price: null,
        purchase_date: null,
      });
      toast.success("Status dikembalikan");
    } catch {
      toast.error("Gagal memperbarui status");
    }
  }

  // belum_dibeli → popover to enter price & date → sudah_dibeli
  if (currentStatus === "belum_dibeli") {
    return (
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger
          render={
            <button type="button" className="cursor-pointer">
              <StatusBadge {...statusInfo} />
            </button>
          }
        />
        <PopoverContent className="w-64 space-y-3 p-3" align="start">
          <p className="text-sm font-medium">Tandai Sudah Dibeli</p>
          <div className="space-y-1.5">
            <Label className="text-xs">Harga Aktual *</Label>
            <CurrencyInput value={price} onValueChange={setPrice} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Tanggal Beli</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
          <Button
            size="sm"
            className="w-full"
            onClick={handleMarkPurchased}
            disabled={updateItem.isPending}
          >
            {updateItem.isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </PopoverContent>
      </Popover>
    );
  }

  // sudah_dibeli → click to mark received, or revert
  if (currentStatus === "sudah_dibeli") {
    return (
      <Popover>
        <PopoverTrigger
          render={
            <button type="button" className="cursor-pointer">
              <StatusBadge {...statusInfo} />
            </button>
          }
        />
        <PopoverContent className="w-48 space-y-2 p-2" align="start">
          <Button size="sm" className="w-full" onClick={handleMarkReceived} disabled={updateItem.isPending}>
            Sudah Diterima
          </Button>
          <Button size="sm" variant="outline" className="w-full" onClick={handleRevert} disabled={updateItem.isPending}>
            Batalkan Pembelian
          </Button>
        </PopoverContent>
      </Popover>
    );
  }

  // sudah_diterima → click to revert
  return (
    <Popover>
      <PopoverTrigger
        render={
          <button type="button" className="cursor-pointer">
            <StatusBadge {...statusInfo} />
          </button>
        }
      />
      <PopoverContent className="w-48 space-y-2 p-2" align="start">
        <Button size="sm" variant="outline" className="w-full" onClick={handleRevert} disabled={updateItem.isPending}>
          Batalkan Status
        </Button>
      </PopoverContent>
    </Popover>
  );
}
