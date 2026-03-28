import { createClient } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/utils/format-currency";
import type { EstimatedAdditionals } from "@/lib/supabase/database.types";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calculator, Package, ShoppingBag, CheckCircle2, Heart } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";

interface ShareData {
  vendor_name: string;
  category_name: string | null;
  category_icon: string | null;
  estimated_additionals: EstimatedAdditionals;
}

async function getEstimate(token: string): Promise<ShareData | null> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).rpc(
    "get_estimate_by_share_token",
    { p_token: token }
  );
  if (error || !data) return null;
  return data as ShareData;
}

export default async function ShareEstimatePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const shareData = await getEstimate(token);

  if (!shareData) {
    notFound();
  }

  const { vendor_name, category_name, category_icon, estimated_additionals: est } = shareData;

  const savedAt = new Date(est.saved_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Calculator className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Estimasi Biaya dari</p>
            <p className="font-semibold text-sm leading-tight">NIKAHKU</p>
          </div>
          <ThemeToggle size="sm" />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shrink-0"
          >
            <Heart className="h-3 w-3 text-primary fill-primary" />
            Coba NIKAHKU
          </Link>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Vendor info */}
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-start gap-3">
            {category_icon && (
              <span className="text-2xl">{category_icon}</span>
            )}
            <div>
              <p className="font-semibold text-lg leading-tight">{vendor_name}</p>
              {category_name && (
                <p className="text-sm text-muted-foreground">{category_name}</p>
              )}
            </div>
          </div>
        </div>

        {/* Estimate breakdown */}
        <div className="rounded-xl border bg-card divide-y overflow-hidden">
          {/* Package */}
          {est.package_name && (
            <div className="px-4 py-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                <Package className="h-3.5 w-3.5" />
                Paket Dasar
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium">{est.package_name}</span>
                <span className="font-number font-semibold text-sm">
                  {formatRupiah(est.package_price)}
                </span>
              </div>
            </div>
          )}

          {/* Add-ons */}
          {est.items.length > 0 && (
            <div className="px-4 py-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                <ShoppingBag className="h-3.5 w-3.5" />
                Add-on
              </div>
              <div className="space-y-1.5">
                {est.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-baseline gap-2">
                    <span className="text-sm text-muted-foreground truncate">
                      {item.name}
                      {item.qty > 1 && (
                        <span className="text-xs ml-1 text-muted-foreground/70">
                          × {item.qty} {item.unit}
                        </span>
                      )}
                    </span>
                    <span className="font-number text-sm shrink-0">
                      {formatRupiah(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grand Total */}
          <div className="px-4 py-3 bg-primary/5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="font-semibold">Estimasi Total</span>
              </div>
              <span className="font-number font-bold text-lg text-primary">
                {formatRupiah(est.grand_total)}
              </span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="rounded-lg bg-muted/50 px-3 py-2.5">
          <p className="text-xs text-muted-foreground italic text-center">
            Estimasi ini bersifat kalkulasi awal dan tidak mengikat. Harga final
            ditentukan berdasarkan kesepakatan antara customer dan vendor.
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground/60">
          Dibuat pada {savedAt}
        </p>
      </div>
    </div>
  );
}
