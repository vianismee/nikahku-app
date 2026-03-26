"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useWedding, useUpdateWedding } from "@/lib/hooks/use-wedding";
import { useAuth } from "@/providers/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  Loader2,
  Save,
  Calendar,
  MapPin,
  Users,
  Mail,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export function WeddingSettings() {
  const { user } = useAuth();
  const { data: wedding, isLoading } = useWedding();
  const updateWedding = useUpdateWedding();

  const [partner1, setPartner1] = useState("");
  const [partner2, setPartner2] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [venueCity, setVenueCity] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  const isOwner = wedding?.user_id === user?.id;

  useEffect(() => {
    if (wedding) {
      setPartner1(wedding.partner_1_name ?? "");
      setPartner2(wedding.partner_2_name ?? "");
      setWeddingDate(wedding.wedding_date ?? "");
      setVenueCity(wedding.venue_city ?? "");
    }
  }, [wedding]);

  const handleSaveWedding = async () => {
    if (!wedding) return;
    try {
      await updateWedding.mutateAsync({
        id: wedding.id,
        partner_1_name: partner1.trim(),
        partner_2_name: partner2.trim(),
        wedding_date: weddingDate,
        venue_city: venueCity.trim() || null,
      });
      toast.success("Detail pernikahan berhasil diperbarui");
    } catch {
      toast.error("Gagal memperbarui detail pernikahan");
    }
  };

  const handleInvitePartner = async () => {
    if (!wedding || !partnerEmail.trim()) return;
    setInviting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("weddings")
        .update({
          partner_email: partnerEmail.trim().toLowerCase(),
          partner_status: "pending",
        } as never)
        .eq("id", wedding.id);

      if (error) throw error;
      toast.success(`Undangan dikirim ke ${partnerEmail.trim()}`);
      setPartnerEmail("");
    } catch {
      toast.error("Gagal mengirim undangan partner");
    } finally {
      setInviting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (!wedding) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Belum ada data pernikahan. Silakan selesaikan onboarding terlebih
            dahulu.
          </p>
        </CardContent>
      </Card>
    );
  }

  const partnerStatusBadge = () => {
    if (!wedding.partner_email) return null;
    switch (wedding.partner_status) {
      case "accepted":
        return (
          <Badge
            variant="outline"
            className="gap-1 text-green-600 border-green-200 bg-green-50"
          >
            <CheckCircle2 className="h-3 w-3" />
            Diterima
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="gap-1 text-red-600 border-red-200 bg-red-50"
          >
            <XCircle className="h-3 w-3" />
            Ditolak
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="gap-1 text-yellow-600 border-yellow-200 bg-yellow-50"
          >
            <Clock className="h-3 w-3" />
            Menunggu
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Wedding Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Pernikahan</CardTitle>
          <CardDescription>
            Informasi dasar tentang acara pernikahan Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="partner1">
                <Users className="h-3.5 w-3.5 inline mr-1.5" />
                Nama Mempelai 1
              </Label>
              <Input
                id="partner1"
                value={partner1}
                onChange={(e) => setPartner1(e.target.value)}
                placeholder="Nama mempelai pertama"
                disabled={!isOwner}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partner2">
                <Users className="h-3.5 w-3.5 inline mr-1.5" />
                Nama Mempelai 2
              </Label>
              <Input
                id="partner2"
                value={partner2}
                onChange={(e) => setPartner2(e.target.value)}
                placeholder="Nama mempelai kedua"
                disabled={!isOwner}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weddingDate">
                <Calendar className="h-3.5 w-3.5 inline mr-1.5" />
                Tanggal Pernikahan
              </Label>
              <Input
                id="weddingDate"
                type="date"
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                disabled={!isOwner}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venueCity">
                <MapPin className="h-3.5 w-3.5 inline mr-1.5" />
                Kota Acara
              </Label>
              <Input
                id="venueCity"
                value={venueCity}
                onChange={(e) => setVenueCity(e.target.value)}
                placeholder="Jakarta, Bandung, dll."
                disabled={!isOwner}
              />
            </div>
          </div>

          {!isOwner && (
            <p className="text-xs text-muted-foreground">
              Hanya pemilik akun yang dapat mengubah detail pernikahan
            </p>
          )}

          {isOwner && (
            <Button
              onClick={handleSaveWedding}
              disabled={updateWedding.isPending}
              className="gap-1.5"
            >
              {updateWedding.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Simpan Perubahan
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Partner Invite */}
      {isOwner && (
        <Card>
          <CardHeader>
            <CardTitle>Undang Partner</CardTitle>
            <CardDescription>
              Undang pasangan Anda untuk mengelola pernikahan bersama
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {wedding.partner_email ? (
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {wedding.partner_email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Partner yang diundang
                    </p>
                  </div>
                </div>
                {partnerStatusBadge()}
              </div>
            ) : null}

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="partnerEmail">Email Partner</Label>
              <div className="flex gap-2">
                <Input
                  id="partnerEmail"
                  type="email"
                  value={partnerEmail}
                  onChange={(e) => setPartnerEmail(e.target.value)}
                  placeholder="email@pasangan.com"
                  className="flex-1"
                />
                <Button
                  onClick={handleInvitePartner}
                  disabled={inviting || !partnerEmail.trim()}
                  className="gap-1.5"
                >
                  {inviting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Undang
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Partner akan dapat mengakses dan mengelola data pernikahan Anda
                setelah menerima undangan
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
