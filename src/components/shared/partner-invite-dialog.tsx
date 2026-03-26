"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInvitePartner } from "@/lib/hooks/use-partner-invite";
import { toast } from "sonner";

interface PartnerInviteDialogProps {
  weddingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PartnerInviteDialog({ weddingId, open, onOpenChange }: PartnerInviteDialogProps) {
  const [email, setEmail] = useState("");
  const invitePartner = useInvitePartner();

  async function handleSubmit() {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      toast.error("Email wajib diisi");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Format email tidak valid");
      return;
    }

    try {
      await invitePartner.mutateAsync({ weddingId, email: trimmed });
      toast.success("Undangan terkirim! Pasangan kamu bisa login dan menerima undangan.");
      setEmail("");
      onOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal mengirim undangan";
      toast.error(message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Undang Pasangan</DialogTitle>
          <DialogDescription>
            Masukkan email pasangan kamu agar bisa mengakses dashboard pernikahan yang sama.
            Pastikan mereka sudah punya akun NIKAHKU dengan email tersebut.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Email Pasangan <span className="text-destructive">*</span></Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="pasangan@email.com"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Batal</Button>} />
          <Button onClick={handleSubmit} disabled={invitePartner.isPending}>
            {invitePartner.isPending ? "Mengirim..." : "Kirim Undangan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
