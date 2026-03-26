"use client";

import { Heart, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePendingInvites, useAcceptInvite, useRejectInvite } from "@/lib/hooks/use-partner-invite";
import { toast } from "sonner";

export function PendingInviteBanner() {
  const { data: invites, isLoading } = usePendingInvites();
  const acceptInvite = useAcceptInvite();
  const rejectInvite = useRejectInvite();

  if (isLoading || !invites || invites.length === 0) return null;

  async function handleAccept(weddingId: string) {
    try {
      await acceptInvite.mutateAsync(weddingId);
      toast.success("Undangan diterima! Kamu sekarang bisa mengakses dashboard pernikahan.");
    } catch {
      toast.error("Gagal menerima undangan");
    }
  }

  async function handleReject(weddingId: string) {
    try {
      await rejectInvite.mutateAsync(weddingId);
      toast.success("Undangan ditolak");
    } catch {
      toast.error("Gagal menolak undangan");
    }
  }

  return (
    <div className="space-y-3">
      {invites.map((invite) => (
        <Card key={invite.id} className="border-primary/30 bg-primary/5">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                <Heart className="h-4 w-4 text-primary fill-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">
                  Undangan Pernikahan
                </p>
                <p className="text-sm text-muted-foreground">
                  Kamu diundang untuk bergabung di dashboard pernikahan
                  {invite.partner_1_name && (
                    <span className="font-medium text-foreground">
                      {" "}{invite.partner_1_name} & {invite.partner_2_name}
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Button
                    size="sm"
                    onClick={() => handleAccept(invite.wedding_id)}
                    disabled={acceptInvite.isPending || rejectInvite.isPending}
                  >
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Terima
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReject(invite.wedding_id)}
                    disabled={acceptInvite.isPending || rejectInvite.isPending}
                  >
                    <X className="h-3.5 w-3.5 mr-1" />
                    Tolak
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
