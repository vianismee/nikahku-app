"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/shared/data-table";
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

type SeserahanRow = Tables<"seserahan"> & Record<string, unknown>;

interface SeserahanTableProps {
  items: Tables<"seserahan">[];
  weddingId: string;
}

export function SeserahanTable({ items, weddingId }: SeserahanTableProps) {
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

  const columns: Column<SeserahanRow>[] = [
    {
      key: "item_name",
      header: "Item",
      sortable: true,
      render: (item) => (
        <div>
          <span className="font-medium">{item.item_name}</span>
          {item.brand && (
            <span className="text-xs text-muted-foreground ml-1.5">({item.brand})</span>
          )}
          {item.sub_category && (
            <p className="text-xs text-muted-foreground">{item.sub_category}</p>
          )}
        </div>
      ),
    },
    {
      key: "category",
      header: "Kategori",
      render: (item) => (
        <span className="text-sm">{SESERAHAN_CATEGORIES[item.category]}</span>
      ),
    },
    {
      key: "priority",
      header: "Prioritas",
      sortable: true,
      render: (item) => <StatusBadge {...PRIORITIES[item.priority]} />,
    },
    {
      key: "price_range",
      header: "Estimasi Harga",
      render: (item) => (
        <span className="font-number text-sm">
          {item.price_min > 0 || item.price_max > 0
            ? item.price_min === item.price_max
              ? formatRupiah(item.price_max)
              : `${formatRupiah(item.price_min)} - ${formatRupiah(item.price_max)}`
            : "-"}
        </span>
      ),
    },
    {
      key: "purchase_status",
      header: "Status",
      render: (item) => (
        <PurchaseStatusToggle
          itemId={item.id}
          currentStatus={item.purchase_status as PurchaseStatus}
          actualPrice={item.actual_price}
          purchaseDate={item.purchase_date}
        />
      ),
    },
    {
      key: "actual_price",
      header: "Harga Aktual",
      render: (item) => (
        <span className="font-number text-sm">
          {item.actual_price ? formatRupiah(item.actual_price) : "-"}
        </span>
      ),
    },
    {
      key: "shop_url",
      header: "Toko",
      render: (item) => <PlatformIcon url={item.shop_url} showLabel />,
    },
    {
      key: "actions",
      header: "",
      className: "w-20",
      render: (item) => (
        <div className="flex items-center gap-1">
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
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={items}
        columns={columns}
        searchable
        searchPlaceholder="Cari item..."
        searchKeys={["item_name", "brand", "sub_category"]}
        emptyMessage="Tidak ada item"
      />

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
