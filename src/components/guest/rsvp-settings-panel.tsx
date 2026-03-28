"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { updateRsvpConfig } from "@/app/actions/invitation";
import { copyToClipboard } from "@/lib/utils/clipboard";
import { Copy, ExternalLink, QrCode, Package, BarChart2 } from "lucide-react";
import { WhatsappTemplateManager } from "./whatsapp-template-manager";
import type { Tables } from "@/lib/supabase/database.types";

interface RsvpSettingsPanelProps {
  wedding: Tables<"weddings">;
}

export function RsvpSettingsPanel({ wedding }: RsvpSettingsPanelProps) {
  const [enabled, setEnabled] = useState(wedding.rsvp_enabled ?? false);
  const [slug, setSlug] = useState(wedding.rsvp_slug ?? "");
  const [maxPax, setMaxPax] = useState(wedding.rsvp_max_pax_per_guest ?? 5);
  const [pin, setPin] = useState(wedding.scanner_pin ?? "");
  const [saving, setSaving] = useState(false);

  // Slugify helper
  function makeSlug(name1: string, name2: string) {
    const clean = (s: string) =>
      s.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    return `${clean(name1)}-${clean(name2)}`;
  }

  useEffect(() => {
    if (!slug && wedding.partner_1_name && wedding.partner_2_name) {
      setSlug(makeSlug(wedding.partner_1_name, wedding.partner_2_name));
    }
  }, [wedding.partner_1_name, wedding.partner_2_name, slug]);

  async function handleSave() {
    if (!slug.trim()) { toast.error("Slug tidak boleh kosong"); return; }
    setSaving(true);
    const res = await updateRsvpConfig(wedding.id, {
      rsvp_enabled: enabled,
      rsvp_slug: slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      rsvp_max_pax_per_guest: Math.max(1, maxPax),
      scanner_pin: pin.length === 4 ? pin : null,
    });
    setSaving(false);
    if (res.success) toast.success("Pengaturan RSVP disimpan");
    else toast.error(res.error ?? "Gagal menyimpan");
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://nikahku.app";
  const invitationUrl = `${baseUrl}/i/${slug}`;
  const rsvpUrl = `${baseUrl}/rsvp/${slug}`;
  const scannerUrl = `${baseUrl}/rsvp/${slug}/scanner`;
  const wishesDisplayUrl = `${baseUrl}/rsvp/${slug}/wishes-display`;
  const iframeSnippet = `<iframe\n  src="${rsvpUrl}?embed=true"\n  width="100%" height="560"\n  frameborder="0"\n  style="border-radius:12px"\n  allow="camera"\n></iframe>`;

  async function handleCopy(text: string, label: string) {
    try {
      await copyToClipboard(text);
      toast.success(`${label} disalin`);
    } catch {
      toast.error("Gagal menyalin, coba salin manual");
    }
  }

  return (
    <div className="space-y-6">
      {/* Toggle RSVP */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-semibold">Aktifkan RSVP Publik</Label>
            <p className="text-xs text-muted-foreground">
              Tamu dapat konfirmasi kehadiran via kode undangan
            </p>
          </div>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="slug" className="text-sm">Slug URL</Label>
            <div className="flex gap-2">
              <span className="text-sm text-muted-foreground self-center shrink-0">/i/</span>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                placeholder="nama-pengantin"
                className="font-mono text-sm"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Hanya huruf kecil, angka, dan tanda hubung
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="maxpax" className="text-sm">Maks. orang per tamu</Label>
            <Input
              id="maxpax"
              type="number"
              min={1}
              max={20}
              value={maxPax}
              onChange={(e) => setMaxPax(parseInt(e.target.value) || 1)}
              className="w-24"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pin" className="text-sm">PIN Scanner (opsional, 4 digit)</Label>
            <Input
              id="pin"
              type="text"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
              className="w-24 font-mono"
              placeholder="0000"
            />
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} size="sm">
          {saving ? "Menyimpan..." : "Simpan Pengaturan"}
        </Button>

        <Separator />
        <WhatsappTemplateManager weddingId={wedding.id} />
      </Card>

      {/* Links */}
      {slug && (
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-semibold">Link & Embed</h3>

          {[
            { label: "Halaman Kartu Tamu", url: invitationUrl, icon: QrCode },
            { label: "RSVP Standalone", url: rsvpUrl, icon: ExternalLink },
            { label: "Venue Screen (Ucapan)", url: wishesDisplayUrl, icon: BarChart2 },
            { label: "Scanner Souvenir", url: scannerUrl, icon: Package },
          ].map(({ label, url, icon: Icon }) => (
            <div key={url} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground truncate">{label}</span>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleCopy(url, label)}
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-7 w-7 rounded-md hover:bg-accent hover:text-accent-foreground"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}

          <Separator />

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Embed Snippet (iframe)</Label>
            <div className="relative">
              <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto whitespace-pre-wrap break-all">
                {iframeSnippet}
              </pre>
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => handleCopy(iframeSnippet, "Snippet iframe")}
              >
                <Copy className="w-3 h-3 mr-1" />
                Salin
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
