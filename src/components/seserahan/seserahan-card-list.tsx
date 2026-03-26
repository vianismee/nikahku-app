"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { PlatformIcon } from "@/components/shared/platform-icon";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { PurchaseStatusToggle } from "./purchase-status-toggle";
import { SeserahanFormDialog } from "./seserahan-form-dialog";
import { useDeleteSeserahan } from "@/lib/hooks/use-seserahan";
import { PRIORITIES, SESERAHAN_CATEGORIES, type PurchaseStatus } from "@/lib/constants/seserahan-statuses";
import { formatRupiah } from "@/lib/utils/format-currency";
import { Pencil, Trash2 } from "lucide-react";
import type { Tables } from "@/lib/supabase/database.types";
import { toast } from "sonner";

interface SeserahanCardListProps {
  items: Tables<"seserahan">[];
  weddingId: string;
}

export function SeserahanCardList({ items, weddingId }: SeserahanCardListProps) {
  const deleteItem = useDeleteSeserahan();
  const [editItem, setEditItem] = useState<Tables<"seserahan"> | undefined>();
  const [editOpen, setEditOpen] = useState(false);

  async function handleDelete(id: string) {
    try {
      await deleteItem.mutateAsync({ id, weddingId });
      toast.success("Item berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus item");
    }
  }

  return (
    <>
      <div className="space-y-3">
        {items.map((item) => {
          const prioInfo = PRIORITIES[item.priority];
          const hasPrice = item.price_min > 0 || item.price_max > 0;

          return (
            <Card key={item.id}>
              <CardContent className="pt-4 space-y-3">
                {/* Header: Name + Actions */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.item_name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      {item.brand && (
                        <span className="text-xs text-muted-foreground">{item.brand}</span>
                      )}
                      {item.sub_category && (
                        <span className="text-xs text-muted-foreground">· {item.sub_category}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setEditItem(item);
                        setEditOpen(true);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <ConfirmDialog
                      trigger={
                        <Button variant="ghost" size="icon-sm">
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      }
                      title="Hapus Item"
                      description={`Yakin ingin menghapus "${item.item_name}"?`}
                      onConfirm={() => handleDelete(item.id)}
                    />
                  </div>
                </div>

                {/* Badges Row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-full border border-border">
                    {SESERAHAN_CATEGORIES[item.category]}
                  </span>
                  <StatusBadge {...prioInfo} />
                  <PurchaseStatusToggle
                    itemId={item.id}
                    currentStatus={item.purchase_status as PurchaseStatus}
                    actualPrice={item.actual_price}
                    purchaseDate={item.purchase_date}
                  />
                </div>

                {/* Price + Shop */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-sm">
                  <div className="min-w-0">
                    {hasPrice && (
                      <span className="font-number text-xs sm:text-sm text-muted-foreground">
                        {item.price_min === item.price_max
                          ? formatRupiah(item.price_max)
                          : `${formatRupiah(item.price_min)} - ${formatRupiah(item.price_max)}`}
                      </span>
                    )}
                    {item.actual_price && (
                      <span className="font-number text-xs sm:text-sm font-medium ml-1 sm:ml-2">
                        → {formatRupiah(item.actual_price)}
                      </span>
                    )}
                  </div>
                  <div className="shrink-0">
                    <PlatformIcon url={item.shop_url} showLabel />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <SeserahanFormDialog
        weddingId={weddingId}
        item={editItem}
        open={editOpen}
        onOpenChange={(o) => {
          setEditOpen(o);
          if (!o) setEditItem(undefined);
        }}
      />
    </>
  );
}
