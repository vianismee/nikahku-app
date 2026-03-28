"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { formatRupiah } from "@/lib/utils/format-currency";
import { useUpdateVendor } from "@/lib/hooks/use-vendors";
import { useCreateExpense, useExpenses, useDeleteExpense } from "@/lib/hooks/use-budget";
import type { EstimatedAdditionals } from "@/lib/supabase/database.types";
import {
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Trash2,
  BarChart2,
  X,
} from "lucide-react";
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
    estimated_additionals: unknown | null;
  };
  categoryName: string;
}

export function VendorDetailPayments({ vendor, categoryName }: VendorDetailPaymentsProps) {
  const estimate = vendor.estimated_additionals as EstimatedAdditionals | null;
  const updateVendor = useUpdateVendor();
  const createExpense = useCreateExpense();
  const deleteExpense = useDeleteExpense();
  const { data: allExpenses } = useExpenses(vendor.wedding_id);

  const hasBookingInfo = vendor.price_deal || vendor.booking_date;

  const dpAmount = vendor.dp_amount ?? 0;
  const priceDeal = vendor.price_deal ?? 0;
  const remaining = priceDeal - dpAmount;

  const now = new Date();
  const in7Days = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
  const isDeadlineNear =
    vendor.payment_deadline && !vendor.full_paid_date
      ? new Date(vendor.payment_deadline) <= in7Days
      : false;
  const isOverdue =
    vendor.payment_deadline && !vendor.full_paid_date
      ? new Date(vendor.payment_deadline) < now
      : false;

  // Find vendor-specific expenses for deletion
  const vendorExpenses = (allExpenses ?? []).filter(
    (e) => (e as typeof e & { vendor_id?: string }).vendor_id === vendor.id
  );
  const dpExpense = vendorExpenses.find((e) =>
    e.description.startsWith(`DP ${vendor.name}`)
  );
  const pelunasanExpense = vendorExpenses.find(
    (e) =>
      e.description.startsWith(`Pelunasan ${vendor.name}`) ||
      e.description.startsWith(`Pembayaran ${vendor.name}`)
  );

  async function handlePayDP() {
    const today = new Date().toISOString().split("T")[0];
    try {
      await updateVendor.mutateAsync({
        id: vendor.id,
        status: "paid_dp" as const,
        dp_paid_date: today,
      });
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
    const pelunasanAmount = vendor.dp_paid_date ? remaining : priceDeal;
    try {
      await updateVendor.mutateAsync({
        id: vendor.id,
        status: "paid_full" as const,
        full_paid_date: today,
      });
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

  async function handleClearDP() {
    try {
      await updateVendor.mutateAsync({
        id: vendor.id,
        status: "booked" as const,
        dp_paid_date: null as unknown as string,
      });
      if (dpExpense) {
        await deleteExpense.mutateAsync({
          id: dpExpense.id,
          weddingId: vendor.wedding_id,
        });
      }
      toast.success("Record DP berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus record DP");
    }
  }

  async function handleClearFullPayment() {
    const prevStatus = vendor.dp_paid_date ? "paid_dp" : "booked";
    try {
      await updateVendor.mutateAsync({
        id: vendor.id,
        status: prevStatus as "paid_dp" | "booked",
        full_paid_date: null as unknown as string,
      });
      if (pelunasanExpense) {
        await deleteExpense.mutateAsync({
          id: pelunasanExpense.id,
          weddingId: vendor.wedding_id,
        });
      }
      toast.success("Record pembayaran berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus record pembayaran");
    }
  }

  async function handleResetEstimate() {
    try {
      await updateVendor.mutateAsync({
        id: vendor.id,
        estimated_additionals: null,
      });
    } catch {
      // silent
    }
  }

  if (!hasBookingInfo) {
    return (
      <>
        {estimate && <EstimateCard estimate={estimate} onReset={handleResetEstimate} />}
        <Card>
          <CardHeader>
            <CardTitle>Pembayaran</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Belum ada info booking</p>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      {estimate && <EstimateCard estimate={estimate} onReset={handleResetEstimate} />}
      <Card>
        <CardHeader>
          <CardTitle>Pembayaran</CardTitle>
        </CardHeader>
      <CardContent className="space-y-3">
        {/* Harga Deal */}
        {vendor.price_deal && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm min-w-0">
              <CreditCard className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>Harga Deal</span>
            </div>
            <span className="font-number font-bold whitespace-nowrap shrink-0">
              {formatRupiah(vendor.price_deal)}
            </span>
          </div>
        )}

        {/* Tanggal Booking */}
        {vendor.booking_date && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm min-w-0">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>Tanggal Booking</span>
            </div>
            <span className="font-number text-sm whitespace-nowrap shrink-0">
              {new Date(vendor.booking_date).toLocaleDateString("id-ID")}
            </span>
          </div>
        )}

        {/* DP */}
        {dpAmount > 0 && (
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 text-sm min-w-0">
              {vendor.dp_paid_date ? (
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
              ) : (
                <Clock className="h-4 w-4 text-yellow-500 shrink-0" />
              )}
              <span>DP</span>
            </div>
            <div className="text-right shrink-0 flex items-start gap-1.5">
              <div className="text-right">
                <p className="font-number text-sm whitespace-nowrap">
                  {formatRupiah(dpAmount)}
                </p>
                {vendor.dp_paid_date && (
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    Dibayar{" "}
                    {new Date(vendor.dp_paid_date).toLocaleDateString("id-ID")}
                  </p>
                )}
              </div>
              {/* Hapus Record DP */}
              {vendor.dp_paid_date && !vendor.full_paid_date && (
                <ConfirmDialog
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0"
                      aria-label="Hapus record DP"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  }
                  title="Hapus Record DP"
                  description={`Hapus record pembayaran DP sebesar ${formatRupiah(dpAmount)} untuk ${vendor.name}? Status akan kembali ke Booked.`}
                  confirmLabel="Hapus"
                  onConfirm={handleClearDP}
                />
              )}
            </div>
          </div>
        )}

        {/* Sisa Pembayaran */}
        {vendor.dp_paid_date && !vendor.full_paid_date && remaining > 0 && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm min-w-0">
              <Clock className="h-4 w-4 text-yellow-500 shrink-0" />
              <span>Sisa Pembayaran</span>
            </div>
            <span className="font-number text-sm font-medium whitespace-nowrap shrink-0">
              {formatRupiah(remaining)}
            </span>
          </div>
        )}

        {/* Lunas */}
        {vendor.full_paid_date && (
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 text-sm min-w-0">
              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
              <span>Lunas</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {new Date(vendor.full_paid_date).toLocaleDateString("id-ID")}
              </span>
              {/* Hapus Record Pelunasan */}
              <ConfirmDialog
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    aria-label="Hapus record pelunasan"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                }
                title="Hapus Record Pelunasan"
                description={`Hapus record pelunasan untuk ${vendor.name}? Status akan kembali ke ${vendor.dp_paid_date ? "Paid DP" : "Booked"}.`}
                confirmLabel="Hapus"
                onConfirm={handleClearFullPayment}
              />
            </div>
          </div>
        )}

        {/* Deadline Pelunasan */}
        {vendor.payment_deadline && !vendor.full_paid_date && (
          <div
            className={`flex items-center justify-between gap-2 ${
              isOverdue
                ? "text-red-500"
                : isDeadlineNear
                  ? "text-orange-500"
                  : ""
            }`}
          >
            <div className="flex items-center gap-2 text-sm min-w-0">
              {isOverdue || isDeadlineNear ? (
                <AlertTriangle className="h-4 w-4 shrink-0" />
              ) : (
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              <span>Deadline Pelunasan</span>
            </div>
            <span className="font-number text-sm whitespace-nowrap shrink-0">
              {new Date(vendor.payment_deadline).toLocaleDateString("id-ID")}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
          {vendor.status === "booked" && !vendor.dp_paid_date && dpAmount > 0 && (
            <ConfirmDialog
              trigger={
                <Button size="sm" className="text-xs">
                  Bayar DP{" "}
                  <span className="font-number whitespace-nowrap ml-1">
                    ({formatRupiah(dpAmount)})
                  </span>
                </Button>
              }
              title="Konfirmasi Pembayaran DP"
              description={`Catat pembayaran DP sebesar ${formatRupiah(dpAmount)} untuk ${vendor.name}?`}
              confirmLabel="Ya, Sudah Dibayar"
              variant="default"
              onConfirm={handlePayDP}
            />
          )}
          {!vendor.full_paid_date &&
            (vendor.dp_paid_date ? (
              <ConfirmDialog
                trigger={
                  <Button size="sm" className="text-xs">
                    Bayar Lunas{" "}
                    <span className="font-number whitespace-nowrap ml-1">
                      ({formatRupiah(remaining)})
                    </span>
                  </Button>
                }
                title="Konfirmasi Pelunasan"
                description={`Catat pelunasan sebesar ${formatRupiah(remaining)} untuk ${vendor.name}?`}
                confirmLabel="Ya, Sudah Lunas"
                variant="default"
                onConfirm={handlePayFull}
              />
            ) : vendor.status === "booked" && dpAmount === 0 ? (
              <ConfirmDialog
                trigger={
                  <Button size="sm" className="text-xs">
                    Bayar Lunas{" "}
                    <span className="font-number whitespace-nowrap ml-1">
                      ({formatRupiah(priceDeal)})
                    </span>
                  </Button>
                }
                title="Konfirmasi Pembayaran"
                description={`Catat pembayaran sebesar ${formatRupiah(priceDeal)} untuk ${vendor.name}?`}
                confirmLabel="Ya, Sudah Dibayar"
                variant="default"
                onConfirm={handlePayFull}
              />
            ) : null)}
        </div>
      </CardContent>
    </Card>
    </>
  );
}

function EstimateCard({
  estimate,
  onReset,
}: {
  estimate: EstimatedAdditionals;
  onReset: () => void;
}) {
  const savedDate = new Date(estimate.saved_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Estimasi Biaya</CardTitle>
            <span className="text-xs text-muted-foreground">({savedDate})</span>
          </div>
          <ConfirmDialog
            trigger={
              <Button variant="ghost" size="icon-sm">
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            }
            title="Reset Estimasi"
            description="Hapus estimasi yang tersimpan?"
            confirmLabel="Hapus"
            onConfirm={onReset}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5 pt-0">
        {estimate.package_name && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground truncate mr-2">{estimate.package_name}</span>
            <span className="font-number shrink-0">{formatRupiah(estimate.package_price)}</span>
          </div>
        )}
        {estimate.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-muted-foreground truncate mr-2">
              + {item.name} ({item.qty}× {item.unit})
            </span>
            <span className="font-number shrink-0">{formatRupiah(item.subtotal)}</span>
          </div>
        ))}
        <div className="flex justify-between text-sm font-semibold border-t pt-1.5">
          <span>Estimasi Total</span>
          <span className="font-number text-primary">{formatRupiah(estimate.grand_total)}</span>
        </div>
        <p className="text-xs text-muted-foreground italic mt-1">
          Estimasi ini tidak mempengaruhi harga deal final
        </p>
      </CardContent>
    </Card>
  );
}
