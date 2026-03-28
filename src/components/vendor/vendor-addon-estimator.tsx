"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateVendor } from "@/lib/hooks/use-vendors";
import { formatRupiah } from "@/lib/utils/format-currency";
import type { Tables } from "@/lib/supabase/database.types";
import type { EstimatedAdditionals } from "@/lib/supabase/database.types";
import { Calculator, Info, Minus, Plus, Save, RotateCcw, Share2 } from "lucide-react";
import { copyToClipboard } from "@/lib/utils/clipboard";
import { toast } from "sonner";

interface VendorAddonEstimatorProps {
  vendorId: string;
  packages: Tables<"vendor_packages">[];
  additionals: Tables<"vendor_additionals">[];
  initialEstimate: EstimatedAdditionals | null;
  initialShareToken?: string | null;
}

type ItemState = { checked: boolean; qty: number };

const NO_PACKAGE = "__none__";

export function VendorAddonEstimator({
  vendorId,
  packages,
  additionals,
  initialEstimate,
  initialShareToken,
}: VendorAddonEstimatorProps) {
  const updateVendor = useUpdateVendor();
  const [shareToken, setShareToken] = useState<string | null>(initialShareToken ?? null);

  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    initialEstimate?.package_id ?? packages[0]?.id ?? NO_PACKAGE
  );

  const [items, setItems] = useState<Record<string, ItemState>>(() => {
    const init: Record<string, ItemState> = {};
    additionals.forEach((a) => {
      const saved = initialEstimate?.items.find((i) => i.id === a.id);
      init[a.id] = { checked: !!saved, qty: saved?.qty ?? 1 };
    });
    return init;
  });

  const selectedPackage = packages.find((p) => p.id === selectedPackageId) ?? null;

  const selectedItems = useMemo(() => {
    return additionals.filter((a) => items[a.id]?.checked);
  }, [additionals, items]);

  const additionalsTotal = useMemo(() => {
    return selectedItems.reduce((sum, a) => {
      const qty = items[a.id]?.qty ?? 1;
      return sum + a.price * qty;
    }, 0);
  }, [selectedItems, items]);

  const grandTotal = (selectedPackage?.price ?? 0) + additionalsTotal;

  function toggleItem(id: string) {
    setItems((prev) => ({
      ...prev,
      [id]: { checked: !prev[id]?.checked, qty: prev[id]?.qty ?? 1 },
    }));
  }

  function changeQty(id: string, delta: number) {
    setItems((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        qty: Math.max(1, (prev[id]?.qty ?? 1) + delta),
      },
    }));
  }

  function setQtyDirect(id: string, value: number) {
    const qty = Math.max(1, Math.min(999, value || 1));
    setItems((prev) => ({ ...prev, [id]: { ...prev[id], qty } }));
  }

  function handleReset() {
    setSelectedPackageId(packages[0]?.id ?? NO_PACKAGE);
    const reset: Record<string, ItemState> = {};
    additionals.forEach((a) => {
      reset[a.id] = { checked: false, qty: 1 };
    });
    setItems(reset);
  }

  function buildEstimate(): EstimatedAdditionals {
    return {
      package_id: selectedPackage?.id ?? null,
      package_name: selectedPackage?.name ?? null,
      package_price: selectedPackage?.price ?? 0,
      items: selectedItems.map((a) => ({
        id: a.id,
        name: a.name,
        price: a.price,
        unit: a.unit,
        qty: items[a.id]?.qty ?? 1,
        subtotal: a.price * (items[a.id]?.qty ?? 1),
      })),
      additionals_total: additionalsTotal,
      grand_total: grandTotal,
      saved_at: new Date().toISOString(),
    };
  }

  async function handleSave() {
    try {
      await updateVendor.mutateAsync({
        id: vendorId,
        estimated_additionals: buildEstimate() as unknown as never,
      });
      toast.success("Estimasi berhasil disimpan");
    } catch {
      toast.error("Gagal menyimpan estimasi");
    }
  }

  async function handleShare() {
    const token = shareToken ?? crypto.randomUUID();
    const estimate = buildEstimate();
    try {
      await updateVendor.mutateAsync({
        id: vendorId,
        estimated_additionals: estimate as unknown as never,
        estimate_share_token: token,
      });
      setShareToken(token);
    } catch {
      toast.error("Gagal membuat link share");
      return;
    }
    const url = `${window.location.origin}/share/estimate/${token}`;
    try {
      await copyToClipboard(url);
      toast.success("Link estimasi disalin ke clipboard!");
    } catch {
      toast.error(`Salin link ini: ${url}`);
    }
  }

  if (packages.length === 0 && additionals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Kalkulator Estimasi Biaya
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-6">
            Tambahkan paket atau add-on terlebih dahulu untuk menggunakan kalkulator
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Kalkulator Estimasi Biaya
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Info banner */}
        <div className="flex items-start gap-2 rounded-lg bg-muted/60 px-3 py-2.5">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">
            Estimasi ini tidak mempengaruhi harga deal final. Harga deal tetap diinput manual sesuai kesepakatan.
          </p>
        </div>

        {/* Package selector */}
        {packages.length > 0 && (
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Paket Dasar</label>
            <Select value={selectedPackageId} onValueChange={(v) => setSelectedPackageId(v ?? NO_PACKAGE)}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {selectedPackageId === NO_PACKAGE
                    ? <span className="text-muted-foreground">Tanpa paket</span>
                    : (packages.find((p) => p.id === selectedPackageId)?.name ?? "Pilih paket...")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_PACKAGE}>Tanpa paket</SelectItem>
                {packages.map((pkg) => (
                  <SelectItem key={pkg.id} value={pkg.id}>
                    {pkg.name} — {formatRupiah(pkg.price)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Additionals checklist */}
        {additionals.length > 0 && (
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Add-on</label>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {additionals.map((a) => {
                const state = items[a.id] ?? { checked: false, qty: 1 };
                return (
                  <div key={a.id} className="rounded-lg border bg-card px-3 py-2.5 space-y-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={state.checked}
                        onChange={() => toggleItem(a.id)}
                        className="mt-0.5 h-4 w-4 cursor-pointer accent-primary"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-medium truncate">{a.name}</span>
                          <Badge variant="outline" className="text-xs shrink-0">
                            {formatRupiah(a.price)} / {a.unit}
                          </Badge>
                        </div>
                        {a.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {a.description}
                          </p>
                        )}
                      </div>
                    </label>

                    {state.checked && (
                      <div className="flex items-center justify-between pl-7">
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => changeQty(a.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <input
                            type="number"
                            min={1}
                            max={999}
                            value={state.qty}
                            onChange={(e) => setQtyDirect(a.id, parseInt(e.target.value))}
                            className="w-12 text-center text-sm border rounded px-1 py-0.5 bg-background"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => changeQty(a.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <span className="text-xs text-muted-foreground">{a.unit}</span>
                        </div>
                        <span className="font-number text-sm font-semibold text-primary">
                          {formatRupiah(a.price * state.qty)}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="rounded-xl border bg-muted/40 p-4 space-y-2">
          {selectedPackage && (
            <div className="flex justify-between text-sm">
              <span className="truncate mr-2">{selectedPackage.name}</span>
              <span className="font-number font-medium shrink-0">
                {formatRupiah(selectedPackage.price)}
              </span>
            </div>
          )}

          {selectedItems.map((a) => (
            <div key={a.id} className="flex justify-between text-sm text-muted-foreground">
              <span className="truncate mr-2">
                + {a.name} ({items[a.id]?.qty ?? 1}× {a.unit})
              </span>
              <span className="font-number shrink-0">
                {formatRupiah(a.price * (items[a.id]?.qty ?? 1))}
              </span>
            </div>
          ))}

          {(selectedPackage || selectedItems.length > 0) && (
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Estimasi Total</span>
              <span className="font-number text-primary">{formatRupiah(grandTotal)}</span>
            </div>
          )}

          {!selectedPackage && selectedItems.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-1">
              Pilih paket atau add-on untuk melihat estimasi
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={updateVendor.isPending || (!selectedPackage && selectedItems.length === 0)}
            className="gap-1.5"
          >
            <Save className="h-3.5 w-3.5" />
            {updateVendor.isPending ? "Menyimpan..." : "Simpan Estimasi"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleShare}
            disabled={updateVendor.isPending || (!selectedPackage && selectedItems.length === 0)}
            className="gap-1.5 ml-auto"
          >
            <Share2 className="h-3.5 w-3.5" />
            {shareToken ? "Salin Link" : "Share ke Vendor"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
