"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWhatsappTemplates } from "@/lib/hooks/use-whatsapp-templates";
import { applyTemplateVariables, buildWhatsappUrl } from "@/lib/utils/whatsapp";
import type { Tables } from "@/lib/supabase/database.types";
import { MessageCircle, ExternalLink } from "lucide-react";

interface WhatsappSendDialogProps {
  guest: Tables<"guests">;
  weddingId: string;
  rsvpSlug: string;
  coupleName: string;
  weddingDate?: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WhatsappSendDialog({
  guest,
  weddingId,
  rsvpSlug,
  coupleName,
  weddingDate,
  open,
  onOpenChange,
}: WhatsappSendDialogProps) {
  const { data: templates = [] } = useWhatsappTemplates(weddingId);
  const defaultTemplate = templates.find((t) => t.is_default) ?? templates[0] ?? null;
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedTemplate = templates.find((t) => t.id === selectedId) ?? defaultTemplate;

  const invitationLink = `${typeof window !== "undefined" ? window.location.origin : ""}/i/${rsvpSlug}?id=${guest.nano_id}`;

  const previewText = selectedTemplate
    ? applyTemplateVariables(selectedTemplate.body, {
        nama: guest.name,
        kode: guest.nano_id ?? "",
        link: invitationLink,
        pasangan: coupleName,
        tanggal: weddingDate
          ? new Date(weddingDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
          : "",
      })
    : "";

  const waUrl = guest.phone
    ? buildWhatsappUrl(guest.phone, previewText)
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-green-600" />
            Kirim WhatsApp ke {guest.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* No phone warning */}
          {!guest.phone && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-400">
              Tamu ini belum memiliki nomor telepon. Tambahkan nomor di data tamu terlebih dahulu.
            </div>
          )}

          {/* Template selector */}
          {templates.length > 1 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium">Pilih Template</p>
              <div className="grid gap-1.5">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedId(t.id)}
                    className={`text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                      (selectedId ? selectedId === t.id : t.is_default || t.id === templates[0]?.id)
                        ? "border-green-500 bg-green-50 text-green-800 dark:bg-green-950/30 dark:text-green-300"
                        : "border-border hover:bg-muted/60"
                    }`}
                  >
                    <span className="font-medium">{t.name}</span>
                    {t.is_default && (
                      <Badge variant="outline" className="ml-2 text-xs text-green-600 border-green-500">Utama</Badge>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {templates.length === 0 && (
            <div className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              Belum ada template. Buat template di tab Pengaturan RSVP.
            </div>
          )}

          {/* Preview */}
          {selectedTemplate && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium">Preview Pesan</p>
              <div className="rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 p-3 max-h-52 overflow-y-auto">
                <p className="text-sm whitespace-pre-wrap leading-relaxed text-green-900 dark:text-green-200">
                  {previewText}
                </p>
              </div>
            </div>
          )}

          {/* Link info */}
          <div className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground space-y-0.5">
            <p><span className="font-medium text-foreground">Nomor:</span> {guest.phone ?? "-"}</p>
            <p className="truncate"><span className="font-medium text-foreground">Link:</span> {invitationLink}</p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2"
              disabled={!waUrl || !selectedTemplate}
              onClick={() => { if (waUrl) window.open(waUrl, "_blank"); }}
            >
              <MessageCircle className="w-4 h-4" />
              Buka WhatsApp
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
