"use client";

import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/shared/data-table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { formatRupiah } from "@/lib/utils/format-currency";
import { useExpenses, useDeleteExpense } from "@/lib/hooks/use-budget";
import { ExpenseFormDialog } from "./expense-form-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Tables } from "@/lib/supabase/database.types";
import { toast } from "sonner";

interface ExpenseTableProps {
  weddingId: string;
}

export function ExpenseTable({ weddingId }: ExpenseTableProps) {
  const { data: expenses } = useExpenses(weddingId);
  const deleteExpense = useDeleteExpense();

  async function handleDelete(id: string) {
    try {
      await deleteExpense.mutateAsync({ id, weddingId });
      toast.success("Pengeluaran berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus pengeluaran");
    }
  }

  const columns: Column<Tables<"expenses"> & Record<string, unknown>>[] = [
    {
      key: "expense_date",
      header: "Tanggal",
      sortable: true,
      render: (item) => (
        <span className="font-number text-sm">
          {new Date(item.expense_date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "category",
      header: "Kategori",
      sortable: true,
    },
    {
      key: "description",
      header: "Deskripsi",
    },
    {
      key: "amount",
      header: "Jumlah",
      sortable: true,
      render: (item) => (
        <span className="font-number font-medium">{formatRupiah(item.amount)}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-20",
      render: (item) => (
        <div className="flex items-center gap-1">
          <ExpenseFormDialog
            weddingId={weddingId}
            expense={item as Tables<"expenses">}
            trigger={
              <Button variant="ghost" size="icon-sm">
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            }
          />
          <ConfirmDialog
            trigger={
              <Button variant="ghost" size="icon-sm">
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            }
            title="Hapus Pengeluaran"
            description={`Yakin ingin menghapus "${item.description}"?`}
            onConfirm={() => handleDelete(item.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={(expenses as (Tables<"expenses"> & Record<string, unknown>)[]) ?? []}
      columns={columns}
      searchable
      searchPlaceholder="Cari pengeluaran..."
      searchKeys={["description", "category"]}
      emptyMessage="Belum ada pengeluaran"
      actions={
        <ExpenseFormDialog
          weddingId={weddingId}
          trigger={
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Tambah Pengeluaran
            </Button>
          }
        />
      }
    />
  );
}
