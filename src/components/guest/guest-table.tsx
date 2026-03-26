"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { GuestFormDialog } from "./guest-form-dialog";
import { useDeleteGuest } from "@/lib/hooks/use-guests";
import { RSVP_STATUSES } from "@/lib/constants/rsvp-statuses";
import { Pencil, Trash2, Phone, Mail } from "lucide-react";
import type { Tables } from "@/lib/supabase/database.types";
import { toast } from "sonner";

type GuestRow = Tables<"guests"> & Record<string, unknown>;

interface GuestTableProps {
  guests: Tables<"guests">[];
  weddingId: string;
}

export function GuestTable({ guests, weddingId }: GuestTableProps) {
  const deleteGuest = useDeleteGuest();
  const [editGuest, setEditGuest] = useState<Tables<"guests"> | undefined>();
  const [editOpen, setEditOpen] = useState(false);

  async function handleDelete(id: string) {
    try {
      await deleteGuest.mutateAsync({ id, weddingId });
      toast.success("Tamu berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus tamu");
    }
  }

  const columns: Column<GuestRow>[] = [
    {
      key: "name",
      header: "Nama",
      sortable: true,
      render: (guest) => (
        <span className="font-medium">{guest.name}</span>
      ),
    },
    {
      key: "category",
      header: "Kategori",
      render: (guest) => (
        <span className="text-sm capitalize">{guest.category}</span>
      ),
    },
    {
      key: "pax_count",
      header: "Pax",
      sortable: true,
      render: (guest) => (
        <span className="font-number text-sm">{guest.pax_count}</span>
      ),
    },
    {
      key: "rsvp_status",
      header: "Status RSVP",
      render: (guest) => {
        const status = RSVP_STATUSES[guest.rsvp_status];
        return <StatusBadge {...status} />;
      },
    },
    {
      key: "contact",
      header: "Kontak",
      render: (guest) => (
        <div className="flex flex-col gap-0.5">
          {guest.phone && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {guest.phone}
            </span>
          )}
          {guest.email && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {guest.email}
            </span>
          )}
          {!guest.phone && !guest.email && (
            <span className="text-xs text-muted-foreground">-</span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-20",
      render: (guest) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setEditGuest(guest as Tables<"guests">);
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
            title="Hapus Tamu"
            description={`Yakin ingin menghapus "${guest.name}"?`}
            onConfirm={() => handleDelete(guest.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={guests as GuestRow[]}
        columns={columns}
        searchable
        searchPlaceholder="Cari tamu..."
        searchKeys={["name", "category"]}
        emptyMessage="Tidak ada tamu"
      />

      <GuestFormDialog
        weddingId={weddingId}
        guest={editGuest}
        open={editOpen}
        onOpenChange={(o) => {
          setEditOpen(o);
          if (!o) setEditGuest(undefined);
        }}
      />
    </>
  );
}
