"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { formatRupiah } from "@/lib/utils/format-currency";
import { useUpdateVendor } from "@/lib/hooks/use-vendors";
import { useCreateExpense } from "@/lib/hooks/use-budget";
import { Calendar, CreditCard, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface VendorDetailPaymentsProps {
  vendor: {
    id: string;
    wedding_id: string;
    name: string;
    status: string;
    price_deal: number | null;
    dp_amount: number | null;
    dp_paid_date: string | null;
    full_paid_date: string | null;
    payment_deadline: string | null;
    booking_date: string | null;
  };
  categoryName: string;
}

export function VendorDetailPayments({ vendor, categoryName }: VendorDetailPaymentsProps) {
  const updateVendor = useUpdateVendor();
  const createExpense = useCreateExpense();
  const hasBookingInfo = vendor.price_deal || vendor.booking_date;

  const dpAmount = vendor.dp_amount ?? 0;
  const priceDeal = vendor.price_deal ?? 0;
  const remaining = priceDeal - dpAmount;
  const isDeadlineNear = vendor.payment_deadline && !vendor.full_paid_date
    ? new Date(vendor.payment_deadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    : false;
  const isOverdue = vendor.payment_deadline && !vendor.full_paid_date
    ? new Date(vendor.payment_deadline) < new Date()
    : false;

  async function handlePayDP() {
    const today = new Date().toISOString().split("T")[0];

    try {
      // 1. Update vendor status
      await updateVendor.mutateAsync({
        id: vendor.id,
        status: "paid_dp" as const,
        dp_paid_date: today,
      });

      // 2. Record actual DP payment as expense
      if (dpAmount > 0) {
        await createExpense.mutateAsync({
          wedding_id: vendor.wedding_id,
          category: categoryName,
          description: `DP ${vendor.name}`,
          amount: dpAmount,
          expense_date: today,
          vendor_id: vendor.id,
        });
      }

      toast.success("DP berhasil dicatat");
    } catch {
      toast.error("Gagal mencatat DP");
    }
  }

  async function handlePayFull() {
    const today = new Date().toISOString().split("T")[0];
    // Pelunasan amount = sisa setelah DP (or full price if no DP)
    const pelunasanAmount = vendor.dp_paid_date ? remaining : priceDeal;

    try {
      // 1. Update vendor status
      await updateVendor.mutateAsync({
        id: vendor.id,
        status: "paid_full" as const,
        full_paid_date: today,
      });

      // 2. Record pelunasan as expense
      if (pelunasanAmount > 0) {
        await createExpense.mutateAsync({
          wedding_id: vendor.wedding_id,
          category: categoryName,
          description: vendor.dp_paid_date
            ? `Pelunasan ${vendor.name}`
            : `Pembayaran ${vendor.name}`,
          amount: pelunasanAmount,
          expense_date: today,
          vendor_id: vendor.id,
        });
      }

      toast.success("Pelunasan berhasil dicatat");
    } catch {
      toast.error("Gagal mencatat pelunasan");
    }
  }

  if (!hasBookingInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pembayaran</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Belum ada info booking</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pembayaran</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {vendor.price_deal && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span>Harga Deal</span>
            </div>
            <span className="font-number font-bold">{formatRupiah(vendor.price_deal)}</span>
          </div>
        )}

        {vendor.booking_date && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Tanggal Booking</span>
            </div>
            <span className="font-number text-sm">
              {new Date(vendor.booking_date).toLocaleDateString("id-ID")}
            </span>
          </div>
        )}

        {dpAmount > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              {vendor.dp_paid_date ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <Clock className="h-4 w-4 text-yellow-500" />
              )}
              <span>DP</span>
            </div>
            <div className="text-right">
              <span className="font-number text-sm">{formatRupiah(dpAmount)}</span>
              {vendor.dp_paid_date && (
                <p className="text-xs text-muted-foreground">
                  Dibayar {new Date(vendor.dp_paid_date).toLocaleDateString("id-ID")}
                </p>
              )}
            </div>
          </div>
        )}

        {vendor.dp_paid_date && !vendor.full_paid_date && remaining > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span>Sisa Pembayaran</span>
            </div>
            <span className="font-number text-sm font-medium">{formatRupiah(remaining)}</span>
          </div>
        )}

        {vendor.full_paid_date && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Lunas</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(vendor.full_paid_date).toLocaleDateString("id-ID")}
            </span>
          </div>
        )}

        {vendor.payment_deadline && !vendor.full_paid_date && (
          <div className={`flex items-center justify-between ${isOverdue ? "text-red-500" : isDeadlineNear ? "text-orange-500" : ""}`}>
            <div className="flex items-center gap-2 text-sm">
              {isOverdue || isDeadlineNear ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <Calendar className="h-4 w-4 text-muted-foreground" />
              )}
              <span>Deadline Pelunasan</span>
            </div>
            <span className="font-number text-sm">
              {new Date(vendor.payment_deadline).toLocaleDateString("id-ID")}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2 border-t">
          {vendor.status === "booked" && !vendor.dp_paid_date && dpAmount > 0 && (
            <ConfirmDialog
              trigger={<Button size="sm">Bayar DP ({formatRupiah(dpAmount)})</Button>}
              title="Konfirmasi Pembayaran DP"
              description={`Catat pembayaran DP sebesar ${formatRupiah(dpAmount)} untuk ${vendor.name}?`}
              confirmLabel="Ya, Sudah Dibayar"
              variant="default"
              onConfirm={handlePayDP}
            />
          )}
          {/* Bayar Lunas: shown when DP already paid, or when no DP was set */}
          {!vendor.full_paid_date && (
            vendor.dp_paid_date ? (
              <ConfirmDialog
                trigger={<Button size="sm">Bayar Lunas ({formatRupiah(remaining)})</Button>}
                title="Konfirmasi Pelunasan"
                description={`Catat pelunasan sebesar ${formatRupiah(remaining)} untuk ${vendor.name}?`}
                confirmLabel="Ya, Sudah Lunas"
                variant="default"
                onConfirm={handlePayFull}
              />
            ) : vendor.status === "booked" && dpAmount === 0 ? (
              <ConfirmDialog
                trigger={<Button size="sm">Bayar Lunas ({formatRupiah(priceDeal)})</Button>}
                title="Konfirmasi Pembayaran"
                description={`Catat pembayaran sebesar ${formatRupiah(priceDeal)} untuk ${vendor.name}?`}
                confirmLabel="Ya, Sudah Dibayar"
                variant="default"
                onConfirm={handlePayFull}
              />
            ) : null
          )}
        </div>
      </CardContent>
    </Card>
  );
}
