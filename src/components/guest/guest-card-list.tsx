"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { GuestFormDialog } from "./guest-form-dialog";
import { useDeleteGuest } from "@/lib/hooks/use-guests";
import { RSVP_STATUSES } from "@/lib/constants/rsvp-statuses";
import { Pencil, Trash2, Phone, Mail, Users } from "lucide-react";
import type { Tables } from "@/lib/supabase/database.types";
import { toast } from "sonner";

interface GuestCardListProps {
  guests: Tables<"guests">[];
  weddingId: string;
}

export function GuestCardList({ guests, weddingId }: GuestCardListProps) {
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

  return (
    <>
      <div className="space-y-3">
        {guests.map((guest) => {
          const statusInfo = RSVP_STATUSES[guest.rsvp_status];

          return (
            <Card key={guest.id}>
              <CardContent className="pt-4 space-y-3">
                {/* Header: Name + Actions */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{guest.name}</h4>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setEditGuest(guest);
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
                </div>

                {/* Badges Row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-full border border-border capitalize">
                    {guest.category}
                  </span>
                  <StatusBadge {...statusInfo} />
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {guest.pax_count} pax
                  </span>
                </div>

                {/* Contact Info */}
                {(guest.phone || guest.email) && (
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    {guest.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3 w-3" />
                        {guest.phone}
                      </span>
                    )}
                    {guest.email && (
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-3 w-3" />
                        {guest.email}
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

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
