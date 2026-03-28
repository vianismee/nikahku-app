"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { VENDOR_STATUSES } from "@/lib/constants/vendor-statuses";
import { formatRupiah, getVendorPriceInfo } from "@/lib/utils/format-currency";
import { useDeleteVendor } from "@/lib/hooks/use-vendors";
import { useUIStore } from "@/lib/stores/ui-store";
import { Eye, Trash2, Star } from "lucide-react";
import type { VendorWithRelations } from "@/lib/hooks/use-vendors";
import { toast } from "sonner";

type VendorRow = VendorWithRelations & Record<string, unknown>;

interface VendorListTableProps {
  vendors: VendorWithRelations[];
}

function CompareCheckbox({ vendor }: { vendor: VendorWithRelations }) {
  const {
    vendorCompareIds,
    vendorCompareCategoryId,
    addVendorCompare,
    removeVendorCompare,
  } = useUIStore();

  const isComparing = vendorCompareIds.includes(vendor.id);
  const isDifferentCategory =
    vendorCompareCategoryId !== null &&
    vendor.category_id !== vendorCompareCategoryId;
  const isMaxReached = vendorCompareIds.length >= 4 && !isComparing;
  const isDisabled = isDifferentCategory || isMaxReached;

  const tooltipText = isDifferentCategory
    ? "Hanya bisa membandingkan vendor dengan kategori yang sama"
    : isMaxReached
      ? "Maksimal 4 vendor"
      : "";

  const checkbox = (
    <Checkbox
      checked={isComparing}
      disabled={isDisabled}
      onCheckedChange={(checked) => {
        if (checked) addVendorCompare(vendor.id, vendor.category_id);
        else removeVendorCompare(vendor.id);
      }}
      aria-label="Bandingkan"
    />
  );

  if (isDisabled && tooltipText) {
    return (
      <Tooltip>
        <TooltipTrigger render={<span className="inline-flex" />}>
          {checkbox}
        </TooltipTrigger>
        <TooltipContent>{tooltipText}</TooltipContent>
      </Tooltip>
    );
  }

  return checkbox;
}

export function VendorListTable({ vendors }: VendorListTableProps) {
  const deleteVendor = useDeleteVendor();

  async function handleDelete(id: string, weddingId: string) {
    try {
      await deleteVendor.mutateAsync({ id, weddingId });
      toast.success("Vendor berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus vendor");
    }
  }

  const columns: Column<VendorRow>[] = [
    {
      key: "compare",
      header: "",
      className: "w-10",
      render: (item) => <CompareCheckbox vendor={item} />,
    },
    {
      key: "name",
      header: "Nama",
      sortable: true,
      render: (item) => (
        <Link href={`/vendor/${item.id}`} className="font-medium hover:text-primary">
          {item.name}
        </Link>
      ),
    },
    {
      key: "category",
      header: "Kategori",
      render: (item) => (
        <span>
          {item.vendor_categories?.icon} {item.vendor_categories?.name ?? "Lainnya"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (item) => {
        const info = VENDOR_STATUSES[item.status];
        return <StatusBadge {...info} />;
      },
    },
    {
      key: "price_deal",
      header: "Harga",
      sortable: true,
      render: (item) => {
        const info = getVendorPriceInfo(item);
        if (info.type === "deal") {
          return (
            <span className="font-number font-semibold whitespace-nowrap text-primary">
              {formatRupiah(info.deal)}
            </span>
          );
        }
        if (info.type === "range") {
          return info.min === info.max ? (
            <span className="font-number whitespace-nowrap">
              {formatRupiah(info.min)}
            </span>
          ) : (
            <span className="font-number text-xs whitespace-nowrap text-muted-foreground">
              {formatRupiah(info.min)} – {formatRupiah(info.max)}
            </span>
          );
        }
        return <span className="text-muted-foreground text-sm">—</span>;
      },
    },
    {
      key: "city",
      header: "Kota",
      sortable: true,
      render: (item) => item.city ?? "-",
    },
    {
      key: "rating",
      header: "Rating",
      render: (item) =>
        item.rating ? (
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-number">{item.rating}</span>
          </div>
        ) : (
          "-"
        ),
    },
    {
      key: "actions",
      header: "",
      className: "w-20",
      render: (item) => (
        <div className="flex items-center gap-1">
          <Link href={`/vendor/${item.id}`}>
            <Button variant="ghost" size="icon-sm">
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <ConfirmDialog
            trigger={
              <Button variant="ghost" size="icon-sm">
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            }
            title="Hapus Vendor"
            description={`Yakin ingin menghapus "${item.name}"?`}
            onConfirm={() => handleDelete(item.id, item.wedding_id)}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={vendors}
      columns={columns}
      emptyMessage="Tidak ada vendor"
    />
  );
}
