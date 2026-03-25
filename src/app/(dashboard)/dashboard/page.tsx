"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, Wallet, Store, Users, ClipboardList, Gift } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWedding } from "@/lib/hooks/use-wedding";
import { useBudget } from "@/lib/hooks/use-budget";
import { useVendors } from "@/lib/hooks/use-vendors";
import { useGuests } from "@/lib/hooks/use-guests";
import { formatRupiah } from "@/lib/utils/format-currency";
import { daysUntilWedding } from "@/lib/utils/date-utils";

const QUICK_LINKS = [
  { href: "/budget", label: "Budget", icon: Wallet, description: "Kelola anggaran pernikahan" },
  { href: "/vendor", label: "Vendor", icon: Store, description: "Cari & bandingkan vendor" },
  { href: "/seserahan", label: "Mahar & Seserahan", icon: Gift, description: "Atur mahar dan seserahan" },
  { href: "/guest", label: "Daftar Tamu", icon: Users, description: "Kelola undangan tamu" },
  { href: "/planning", label: "Planning Board", icon: ClipboardList, description: "Checklist & jadwal" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { data: wedding, isLoading: weddingLoading } = useWedding();
  const weddingId = wedding?.id;
  const { data: budget } = useBudget(weddingId);
  const { data: vendors } = useVendors(weddingId);
  const { data: guestsRaw } = useGuests(weddingId);
  const guests = guestsRaw as unknown as { rsvp_status: string }[] | undefined;

  useEffect(() => {
    if (!weddingLoading && !wedding) {
      router.push("/onboarding");
    }
  }, [weddingLoading, wedding, router]);

  if (weddingLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  if (!wedding) return null;

  const countdown = daysUntilWedding(wedding.wedding_date);
  const totalBudget = budget?.total_amount ?? 0;
  const bookedVendors = vendors?.filter((v) => ["booked", "paid_dp", "paid_full", "completed"].includes(v.status)).length ?? 0;
  const totalVendors = vendors?.length ?? 0;
  const totalGuests = guests?.length ?? 0;
  const confirmedGuests = guests?.filter((g) => g.rsvp_status === "hadir").length ?? 0;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-1">
        <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary fill-primary" />
          {wedding.partner_1_name} & {wedding.partner_2_name}
        </h1>
        <p className="text-muted-foreground">
          Merencanakan pernikahan impian kalian
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Hari Pernikahan</p>
            <p className="text-3xl font-heading font-bold text-primary font-number mt-1">
              {countdown > 0 ? countdown : countdown === 0 ? "Hari ini!" : "Sudah lewat"}
            </p>
            {countdown > 0 && (
              <p className="text-xs text-muted-foreground mt-1">hari lagi</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Budget</p>
            <p className="text-3xl font-heading font-bold font-number mt-1">
              {totalBudget > 0 ? formatRupiah(totalBudget) : "Rp --"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {totalBudget > 0
                ? `Terpakai ${formatRupiah(budget?.spent_amount ?? 0)}`
                : "belum diatur"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Vendor Booked</p>
            <p className="text-3xl font-heading font-bold font-number mt-1">
              {bookedVendors}
            </p>
            <p className="text-xs text-muted-foreground mt-1">dari {totalVendors} vendor</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Tamu Undangan</p>
            <p className="text-3xl font-heading font-bold font-number mt-1">
              {totalGuests}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{confirmedGuests} konfirmasi hadir</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="space-y-3">
        <h2 className="text-lg font-heading font-semibold">Menu Utama</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              <Card className="hover:border-primary transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <div className="rounded-lg border border-border p-2">
                    <link.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{link.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
