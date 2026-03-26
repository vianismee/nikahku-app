"use client";

import { useState } from "react";
import { UserPlus, UserCheck, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PartnerInviteDialog } from "@/components/shared/partner-invite-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { usePartnerInvite, useRemovePartner } from "@/lib/hooks/use-partner-invite";
import { toast } from "sonner";

interface PartnerStatusCardProps {
  weddingId: string;
  isOwner: boolean;
}

export function PartnerStatusCard({ weddingId, isOwner }: PartnerStatusCardProps) {
  const { data: invite, isLoading } = usePartnerInvite(weddingId);
  const removePartner = useRemovePartner();
  const [dialogOpen, setDialogOpen] = useState(false);

  if (isLoading) return null;

  if (!isOwner) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <UserCheck className="h-3.5 w-3.5 text-primary" />
        <span>Bergabung sebagai pasangan</span>
      </div>
    );
  }

  if (!invite) {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => setDialogOpen(true)}
        >
          <UserPlus className="h-4 w-4" />
          Undang Pasangan
        </Button>

        <PartnerInviteDialog
          weddingId={weddingId}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </>
    );
  }

  const statusConfig = {
    pending: {
      icon: Clock,
      label: "Undangan Terkirim",
      description: `Menunggu ${invite.email} untuk menerima undangan`,
      color: "text-amber-600",
    },
    accepted: {
      icon: UserCheck,
      label: "Pasangan Bergabung",
      description: `${invite.email} sudah bisa mengakses dashboard`,
      color: "text-green-600",
    },
    rejected: {
      icon: UserPlus,
      label: "Undangan Ditolak",
      description: `${invite.email} menolak undangan`,
      color: "text-muted-foreground",
    },
  }[invite.status as "pending" | "accepted" | "rejected"];

  const StatusIcon = statusConfig.icon;

  async function handleRemove() {
    try {
      await removePartner.mutateAsync({ weddingId });
      toast.success("Undangan dihapus");
    } catch {
      toast.error("Gagal menghapus undangan");
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs">
        <StatusIcon className={`h-3.5 w-3.5 ${statusConfig.color}`} />
        <span className="text-muted-foreground truncate max-w-[200px] sm:max-w-none">
          {statusConfig.description}
        </span>
      </div>
      <ConfirmDialog
        trigger={
          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
            <Trash2 className="h-3 w-3 text-muted-foreground" />
          </Button>
        }
        title="Hapus Undangan"
        description={`Hapus undangan untuk ${invite.email}? Pasangan tidak bisa lagi mengakses dashboard ini.`}
        confirmLabel="Hapus"
        onConfirm={handleRemove}
      />
    </div>
  );
}
