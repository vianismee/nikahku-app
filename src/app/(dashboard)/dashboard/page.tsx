"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Wallet, Store, Users, ClipboardList, Gift, Plus, CalendarClock, CheckCircle2, AlertCircle, ShoppingBag, Settings2, GripVertical, Eye, EyeOff, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PendingInviteBanner } from "@/components/shared/pending-invite-banner";
import { PartnerStatusCard } from "@/components/shared/partner-status-card";
import { QuickActionsFab } from "@/components/dashboard/quick-actions-fab";
import { useWedding } from "@/lib/hooks/use-wedding";
import { useBudget } from "@/lib/hooks/use-budget";
import { useVendors } from "@/lib/hooks/use-vendors";
import { useGuests } from "@/lib/hooks/use-guests";
import { useTasks } from "@/lib/hooks/use-tasks";
import { useSeserahan } from "@/lib/hooks/use-seserahan";
import { useAuth } from "@/providers/auth-provider";
import { useUIStore, DASHBOARD_WIDGETS } from "@/lib/stores/ui-store";
import { formatRupiah } from "@/lib/utils/format-currency";
import { daysUntilWedding } from "@/lib/utils/date-utils";

const QUICK_LINKS = [
  { href: "/budget", label: "Budget", icon: Wallet, description: "Kelola anggaran pernikahan" },
  { href: "/vendor", label: "Vendor", icon: Store, description: "Cari & bandingkan vendor" },
  { href: "/seserahan", label: "Mahar & Seserahan", icon: Gift, description: "Atur mahar dan seserahan" },
  { href: "/guest", label: "Daftar Tamu", icon: Users, description: "Kelola undangan tamu" },
  { href: "/planning", label: "Planning Board", icon: ClipboardList, description: "Checklist & jadwal" },
];

const PRIORITY_LABELS: Record<string, { label: string; className: string }> = {
  urgent: { label: "Urgent", className: "bg-red-100 text-red-700 border-red-200" },
  high: { label: "Tinggi", className: "bg-orange-100 text-orange-700 border-orange-200" },
  medium: { label: "Sedang", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  low: { label: "Rendah", className: "bg-blue-100 text-blue-700 border-blue-200" },
};

const VENDOR_STATUS_LABELS: Record<string, string> = {
  booked: "Booked",
  paid_dp: "DP Terbayar",
  paid_full: "Lunas",
  completed: "Selesai",
};

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: wedding, isLoading: weddingLoading, error: weddingError } = useWedding();
  const weddingId = wedding?.id;
  const isOwner = wedding?.user_id === user?.id;
  const { data: budget } = useBudget(weddingId);
  const { data: vendors } = useVendors(weddingId);
  const { data: guestsRaw } = useGuests(weddingId);
  const { data: tasks } = useTasks(weddingId);
  const { data: seserahanItems } = useSeserahan(weddingId);
  const guests = guestsRaw as unknown as { rsvp_status: string }[] | undefined;

  const {
    dashboardWidgetOrder,
    dashboardHiddenWidgets,
    setDashboardWidgetOrder,
    toggleDashboardWidget,
    resetDashboardLayout,
  } = useUIStore();

  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  if (weddingLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  if (weddingError) {
    return (
      <div className="p-4 border border-destructive rounded-lg bg-destructive/10 space-y-2">
        <p className="font-medium text-destructive">Error loading wedding data:</p>
        <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(weddingError, null, 2)}</pre>
      </div>
    );
  }

  if (!wedding) {
    return (
      <NoWeddingView onCreateNew={() => router.push("/onboarding")} />
    );
  }

  const countdown = daysUntilWedding(wedding.wedding_date);
  const totalBudget = budget?.total_amount ?? 0;
  const bookedVendors = vendors?.filter((v) =>
    ["booked", "paid_dp", "paid_full", "completed"].includes(v.status)
  ) ?? [];
  const totalVendors = vendors?.length ?? 0;
  const totalGuests = guests?.length ?? 0;
  const confirmedGuests = guests?.filter((g) => g.rsvp_status === "hadir").length ?? 0;

  const upcomingTasks = (tasks ?? [])
    .filter((t) => t.status !== "done" && t.status !== "cancelled")
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5);

  const totalSeserahan = seserahanItems?.length ?? 0;
  const boughtSeserahan =
    seserahanItems?.filter((s) => s.purchase_status !== "belum_dibeli").length ?? 0;
  const seserahanPct = totalSeserahan > 0 ? Math.round((boughtSeserahan / totalSeserahan) * 100) : 0;

  // Ensure all widget IDs are in the order list (handles new widgets added later)
  const allIds = DASHBOARD_WIDGETS.map((w) => w.id) as string[];
  const orderedIds = [
    ...dashboardWidgetOrder.filter((id) => allIds.includes(id)),
    ...allIds.filter((id) => !dashboardWidgetOrder.includes(id)),
  ];

  function handleDragStart(id: string) {
    setDragId(id);
  }

  function handleDragOver(e: React.DragEvent, targetId: string) {
    e.preventDefault();
    if (!dragId || dragId === targetId) return;
    const next = [...orderedIds];
    const fromIdx = next.indexOf(dragId);
    const toIdx = next.indexOf(targetId);
    next.splice(fromIdx, 1);
    next.splice(toIdx, 0, dragId);
    setDashboardWidgetOrder(next);
  }

  function handleDragEnd() {
    setDragId(null);
  }

  const isHidden = (id: string) => dashboardHiddenWidgets.includes(id);

  function renderWidget(id: string) {
    if (isHidden(id)) return null;

    if (id === "tasks") {
      return (
        <Card key="tasks">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-primary" />
              Task Mendatang
            </CardTitle>
            <Link href="/planning" className="text-xs text-primary hover:underline">
              Lihat semua
            </Link>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {upcomingTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Tidak ada task yang pending
              </p>
            ) : (
              upcomingTasks.map((task) => {
                const isOverdue =
                  task.status !== "done" &&
                  new Date(task.due_date) < new Date(new Date().toDateString());
                const prio = PRIORITY_LABELS[task.priority];
                return (
                  <div key={task.id} className="flex items-start gap-3 py-2 border-b last:border-0">
                    {isOverdue ? (
                      <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-muted-foreground/40 mt-0.5 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isOverdue ? "text-destructive" : ""}`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Due:{" "}
                        {new Date(task.due_date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    {prio && (
                      <span className={`text-[10px] border rounded px-1.5 py-0.5 font-medium shrink-0 ${prio.className}`}>
                        {prio.label}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      );
    }

    if (id === "seserahan") {
      return (
        <Card key="seserahan">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-primary" />
              Progress Seserahan
            </CardTitle>
            <Link href="/seserahan" className="text-xs text-primary hover:underline">
              Lihat semua
            </Link>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {totalSeserahan === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Belum ada item seserahan
              </p>
            ) : (
              <>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sudah dibeli</span>
                    <span className="font-number font-medium">
                      {boughtSeserahan}/{totalSeserahan} item
                    </span>
                  </div>
                  <Progress value={seserahanPct} className="h-2" />
                  <p className="text-xs text-muted-foreground text-right">{seserahanPct}% selesai</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Belum dibeli
                  </p>
                  {(seserahanItems ?? [])
                    .filter((s) => s.purchase_status === "belum_dibeli")
                    .sort((a, b) => {
                      const pOrder = { tinggi: 0, sedang: 1, rendah: 2 };
                      return pOrder[a.priority] - pOrder[b.priority];
                    })
                    .slice(0, 5)
                    .map((s) => (
                      <div key={s.id} className="flex items-center justify-between gap-2 text-sm">
                        <span className="truncate">{s.item_name}</span>
                        <span className="font-number text-xs text-muted-foreground whitespace-nowrap">
                          {s.price_max > 0 ? formatRupiah(s.price_max) : "-"}
                        </span>
                      </div>
                    ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      );
    }

    if (id === "booked_vendors") {
      if (bookedVendors.length === 0) return null;
      return (
        <Card key="booked_vendors" className="lg:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Store className="h-4 w-4 text-primary" />
              Vendor Booked
            </CardTitle>
            <Link href="/vendor" className="text-xs text-primary hover:underline">
              Lihat semua
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium text-muted-foreground">Vendor</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Deal</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {bookedVendors.slice(0, 6).map((v) => (
                    <tr key={v.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="py-2.5 font-medium">
                        <Link href={`/vendor/${v.id}`} className="hover:text-primary hover:underline">
                          {v.name}
                        </Link>
                      </td>
                      <td className="py-2.5">
                        <Badge variant="outline" className="text-xs">
                          {VENDOR_STATUS_LABELS[v.status] ?? v.status}
                        </Badge>
                      </td>
                      <td className="py-2.5 font-number text-xs text-muted-foreground">
                        {v.price_deal ? formatRupiah(v.price_deal) : "-"}
                      </td>
                      <td className="py-2.5 text-xs text-muted-foreground">
                        {v.payment_deadline
                          ? new Date(v.payment_deadline).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (id === "quick_links") {
      return (
        <div key="quick_links" className="space-y-3 lg:col-span-2">
          <h2 className="text-lg font-heading font-semibold">Menu Utama</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUICK_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
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
              </Link>
            ))}
          </div>
        </div>
      );
    }

    return null;
  }

  // Group widgets into pairs for the 2-column layout (tasks + seserahan side by side, booked_vendors full, quick_links full)
  const pairedWidgets = ["tasks", "seserahan"];
  const fullWidgets = ["booked_vendors", "quick_links"];

  return (
    <div className="space-y-6">
      <PendingInviteBanner />

      {/* Welcome */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary fill-primary" />
            {wedding.partner_1_name} & {wedding.partner_2_name}
          </h1>
          <div className="flex items-center gap-2">
            <PartnerStatusCard weddingId={weddingId!} isOwner={isOwner} />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCustomizeOpen(true)}
              title="Kustomisasi widget"
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">Merencanakan pernikahan impian kalian</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="pt-4 pb-4 sm:pt-6 sm:pb-6">
            <p className="text-xs sm:text-sm text-muted-foreground">Hari Pernikahan</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-primary font-number mt-0.5 sm:mt-1">
              {countdown > 0 ? countdown : countdown === 0 ? "Hari ini!" : "Sudah lewat"}
            </p>
            {countdown > 0 && (
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">hari lagi</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 sm:pt-6 sm:pb-6">
            <p className="text-xs sm:text-sm text-muted-foreground">Total Budget</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold font-number mt-0.5 sm:mt-1 truncate">
              {totalBudget > 0 ? formatRupiah(totalBudget) : "Rp --"}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 truncate">
              {totalBudget > 0
                ? `Terpakai ${formatRupiah(budget?.spent_amount ?? 0)}`
                : "belum diatur"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 sm:pt-6 sm:pb-6">
            <p className="text-xs sm:text-sm text-muted-foreground">Vendor Booked</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold font-number mt-0.5 sm:mt-1">
              {bookedVendors.length}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
              dari {totalVendors} vendor
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4 sm:pt-6 sm:pb-6">
            <p className="text-xs sm:text-sm text-muted-foreground">Tamu Undangan</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold font-number mt-0.5 sm:mt-1">
              {totalGuests}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
              {confirmedGuests} konfirmasi hadir
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Widgets — rendered by order */}
      {(() => {
        const rendered: React.ReactNode[] = [];
        let pairBuf: string[] = [];

        for (const id of orderedIds) {
          if (pairedWidgets.includes(id)) {
            pairBuf.push(id);
            if (pairBuf.length === 2) {
              const visiblePair = pairBuf.filter((w) => !isHidden(w));
              if (visiblePair.length > 0) {
                rendered.push(
                  <div key={`pair-${pairBuf.join("-")}`} className={`grid grid-cols-1 lg:grid-cols-2 gap-4`}>
                    {pairBuf.map((w) => renderWidget(w))}
                  </div>
                );
              }
              pairBuf = [];
            }
          } else if (fullWidgets.includes(id)) {
            // flush remaining pair
            if (pairBuf.length > 0) {
              const visiblePair = pairBuf.filter((w) => !isHidden(w));
              if (visiblePair.length > 0) {
                rendered.push(
                  <div key={`pair-${pairBuf.join("-")}`} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {pairBuf.map((w) => renderWidget(w))}
                  </div>
                );
              }
              pairBuf = [];
            }
            const widget = renderWidget(id);
            if (widget) rendered.push(widget);
          }
        }
        // flush remaining
        if (pairBuf.length > 0) {
          const visiblePair = pairBuf.filter((w) => !isHidden(w));
          if (visiblePair.length > 0) {
            rendered.push(
              <div key={`pair-${pairBuf.join("-")}-end`} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pairBuf.map((w) => renderWidget(w))}
              </div>
            );
          }
        }
        return rendered;
      })()}

      {/* Customize Widget Sheet */}
      <Sheet open={customizeOpen} onOpenChange={setCustomizeOpen}>
        <SheetContent side="right" className="flex flex-col p-0 gap-0">
          <SheetHeader className="px-4 pt-5 pb-3 border-b shrink-0">
            <SheetTitle>Kustomisasi Dashboard</SheetTitle>
            <p className="text-xs text-muted-foreground">
              Seret untuk mengubah urutan, atau klik ikon mata untuk menyembunyikan.
            </p>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            {orderedIds.map((id) => {
              const widget = DASHBOARD_WIDGETS.find((w) => w.id === id);
              if (!widget) return null;
              const hidden = isHidden(id);
              return (
                <div
                  key={id}
                  draggable
                  onDragStart={() => handleDragStart(id)}
                  onDragOver={(e) => handleDragOver(e, id)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-3 select-none transition-all ${
                    hidden
                      ? "opacity-40 bg-muted/30"
                      : "bg-background"
                  } ${dragId === id ? "scale-[0.98] opacity-60 shadow-inner" : "shadow-sm"}`}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground/50 shrink-0 cursor-grab" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{widget.label}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {hidden ? "Disembunyikan" : "Ditampilkan"}
                    </p>
                  </div>
                  <Button
                    variant={hidden ? "ghost" : "secondary"}
                    size="icon"
                    className="h-8 w-8 rounded-lg shrink-0"
                    onClick={() => toggleDashboardWidget(id)}
                    title={hidden ? "Tampilkan" : "Sembunyikan"}
                  >
                    {hidden ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="shrink-0 px-4 py-4 border-t space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1.5"
              onClick={resetDashboardLayout}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset ke Default
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Quick Actions FAB */}
      <QuickActionsFab weddingId={weddingId!} />
    </div>
  );
}

function NoWeddingView({ onCreateNew }: { onCreateNew: () => void }) {
  return (
    <div className="space-y-6">
      <PendingInviteBanner />
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="mx-auto w-14 h-14 rounded-full border-2 border-muted flex items-center justify-center mb-4">
          <Heart className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-heading font-semibold mb-1">Selamat Datang di NIKAHKU</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-4">
          Belum ada pernikahan yang terhubung. Buat baru atau terima undangan dari pasangan kamu.
        </p>
        <Button onClick={onCreateNew}>
          <Plus className="h-4 w-4 mr-1" />
          Buat Pernikahan Baru
        </Button>
      </div>
    </div>
  );
}
