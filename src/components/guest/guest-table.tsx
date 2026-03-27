"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable, type Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { GuestFormDialog } from "./guest-form-dialog";
import { useDeleteGuest, useBulkUpdateRsvp } from "@/lib/hooks/use-guests";
import { RSVP_STATUSES, type RsvpStatus } from "@/lib/constants/rsvp-statuses";
import { downloadCsv } from "@/lib/utils/export-csv";
import { Pencil, Trash2, Phone, Mail, Download, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Tables } from "@/lib/supabase/database.types";
import { toast } from "sonner";

type GuestWithSessions = Tables<"guests"> & {
  guest_sessions?: { session_id: string }[];
};
type GuestRow = GuestWithSessions & Record<string, unknown>;

interface GuestTableProps {
  guests: GuestWithSessions[];
  weddingId: string;
  sessions?: Tables<"sessions">[];
}

export function GuestTable({ guests, weddingId, sessions }: GuestTableProps) {
  const deleteGuest = useDeleteGuest();
  const bulkUpdateRsvp = useBulkUpdateRsvp();
  const [editGuest, setEditGuest] = useState<GuestWithSessions | undefined>();
  const [editOpen, setEditOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<RsvpStatus>("belum_diundang");

  async function handleDelete(id: string) {
    try {
      await deleteGuest.mutateAsync({ id, weddingId });
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      toast.success("Tamu berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus tamu");
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selectedIds.size === guests.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(guests.map((g) => g.id)));
    }
  }

  async function applyBulkRsvp() {
    if (selectedIds.size === 0) return;
    try {
      await bulkUpdateRsvp.mutateAsync({
        ids: Array.from(selectedIds),
        rsvp_status: bulkStatus,
        weddingId,
      });
      toast.success(`${selectedIds.size} tamu diperbarui`);
      setSelectedIds(new Set());
    } catch {
      toast.error("Gagal memperbarui status");
    }
  }

  function handleExport() {
    const headers = ["Nama", "Kategori", "Telepon", "Email", "Pax", "Status RSVP", "Catatan"];
    const rows = guests.map((g) => [
      g.name,
      g.category,
      g.phone ?? "",
      g.email ?? "",
      g.pax_count,
      RSVP_STATUSES[g.rsvp_status as RsvpStatus]?.label ?? g.rsvp_status,
      g.notes ?? "",
    ]);
    downloadCsv("daftar-tamu.csv", headers, rows);
  }

  const sessionMap = Object.fromEntries((sessions ?? []).map((s) => [s.id, s.name]));
  const allSelected = guests.length > 0 && selectedIds.size === guests.length;

  const columns: Column<GuestRow>[] = [
    {
      key: "select",
      header: (
        <Checkbox
          checked={allSelected}
          onCheckedChange={toggleAll}
          aria-label="Pilih semua"
        />
      ),
      className: "w-10",
      render: (guest) => (
        <Checkbox
          checked={selectedIds.has(guest.id)}
          onCheckedChange={() => toggleSelect(guest.id)}
          aria-label={`Pilih ${guest.name}`}
        />
      ),
    },
    {
      key: "name",
      header: "Nama",
      sortable: true,
      render: (guest) => <span className="font-medium">{guest.name}</span>,
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
        const status = RSVP_STATUSES[guest.rsvp_status as RsvpStatus];
        return <StatusBadge {...status} />;
      },
    },
    // Session column — only rendered when sessions exist
    ...(sessions && sessions.length > 0
      ? [
          {
            key: "sessions",
            header: "Sesi",
            render: (guest: GuestRow) => {
              const assignedIds = guest.guest_sessions?.map((gs) => gs.session_id) ?? [];
              if (assignedIds.length === 0)
                return <span className="text-xs text-muted-foreground">-</span>;
              return (
                <div className="flex flex-wrap gap-1">
                  {assignedIds.map((id) => (
                    <Badge key={id} variant="secondary" className="text-xs">
                      {sessionMap[id] ?? id}
                    </Badge>
                  ))}
                </div>
              );
            },
          } as Column<GuestRow>,
        ]
      : []),
    {
      key: "contact",
      header: "Kontak",
      render: (guest) => (
        <div className="flex flex-col gap-0.5">
          {guest.phone && (
            <a
              href={`https://wa.me/${guest.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
            >
              <Phone className="h-3 w-3" />
              {guest.phone}
            </a>
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
              setEditGuest(guest as GuestWithSessions);
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
      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border bg-muted/50 px-4 py-2.5 flex-wrap">
          <span className="text-sm font-medium shrink-0">
            {selectedIds.size} tamu dipilih
          </span>
          <div className="flex items-center gap-2 flex-1 flex-wrap">
            <Select
              value={bulkStatus}
              onValueChange={(v) => setBulkStatus(v as RsvpStatus)}
            >
              <SelectTrigger className="h-8 w-auto text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(RSVP_STATUSES) as [RsvpStatus, { label: string }][]).map(
                  ([key, val]) => (
                    <SelectItem key={key} value={key} className="text-xs">
                      {val.label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              className="h-8 text-xs"
              onClick={applyBulkRsvp}
              disabled={bulkUpdateRsvp.isPending}
            >
              {bulkUpdateRsvp.isPending ? "Memperbarui..." : "Terapkan"}
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setSelectedIds(new Set())}
            aria-label="Batal pilih"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Export button */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4 mr-1.5" />
          Export CSV
        </Button>
      </div>

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
