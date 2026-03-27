"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  Store,
  Gift,
  Users,
  ClipboardList,
  FileText,
  ScrollText,
  SlidersHorizontal,
  GripVertical,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useWedding } from "@/lib/hooks/use-wedding";
import { useTasks } from "@/lib/hooks/use-tasks";
import { useUIStore, DEFAULT_MOBILE_NAV_ITEMS } from "@/lib/stores/ui-store";

export const ALL_MOBILE_NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/budget", label: "Budget", icon: Wallet },
  { href: "/vendor", label: "Vendor", icon: Store },
  { href: "/seserahan", label: "Mahar", icon: Gift },
  { href: "/guest", label: "Tamu", icon: Users },
  { href: "/planning", label: "Planning", icon: ClipboardList },
  { href: "/rundown", label: "Rundown", icon: ScrollText },
  { href: "/dokumen", label: "Dokumen", icon: FileText },
] as const;

const MAX_NAV_ITEMS = 5;

export function MobileNav() {
  const pathname = usePathname();
  const { data: wedding } = useWedding();
  const { data: tasks } = useTasks(wedding?.id);
  const { mobileNavItems, setMobileNavItems, resetMobileNav } = useUIStore();
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const in7Days = new Date(today);
  in7Days.setDate(today.getDate() + 7);
  const taskAlertCount = (tasks ?? []).filter((t) => {
    if (t.status === "done" || t.status === "cancelled") return false;
    if (!t.due_date) return false;
    return new Date(t.due_date) <= in7Days;
  }).length;

  // Build ordered nav items from stored hrefs, falling back to defaults for unknown hrefs
  const activeNavItems = mobileNavItems
    .map((href) => ALL_MOBILE_NAV_ITEMS.find((n) => n.href === href))
    .filter(Boolean) as (typeof ALL_MOBILE_NAV_ITEMS)[number][];

  // All available hrefs (ordered: selected first, then rest)
  const allHrefs = ALL_MOBILE_NAV_ITEMS.map((n) => n.href) as string[];
  const orderedAllHrefs = [
    ...mobileNavItems.filter((h) => allHrefs.includes(h)),
    ...allHrefs.filter((h) => !mobileNavItems.includes(h)),
  ];

  function toggleNavItem(href: string) {
    if (mobileNavItems.includes(href)) {
      if (mobileNavItems.length <= 1) return; // keep at least 1
      setMobileNavItems(mobileNavItems.filter((h) => h !== href));
    } else {
      if (mobileNavItems.length >= MAX_NAV_ITEMS) return; // max 5
      setMobileNavItems([...mobileNavItems, href]);
    }
  }

  function handleDragStart(href: string) {
    setDragId(href);
  }

  function handleDragOver(e: React.DragEvent, targetHref: string) {
    e.preventDefault();
    if (!dragId || dragId === targetHref) return;
    const next = [...orderedAllHrefs];
    const fromIdx = next.indexOf(dragId);
    const toIdx = next.indexOf(targetHref);
    next.splice(fromIdx, 1);
    next.splice(toIdx, 0, dragId);
    // Only update if dragging within the selected items
    const selectedInOrder = next.filter((h) => mobileNavItems.includes(h));
    setMobileNavItems(selectedInOrder);
  }

  function handleDragEnd() {
    setDragId(null);
  }

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center py-1.5">
          {/* Nav items */}
          <div className="flex-1 flex items-center justify-around">
            {activeNavItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const badge =
                item.href === "/planning" && taskAlertCount > 0
                  ? taskAlertCount
                  : null;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div className="relative">
                    <item.icon className="h-5 w-5" />
                    {badge && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[8px] font-bold px-0.5">
                        {badge > 9 ? "9+" : badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium">{item.label}</span>
                  {isActive && (
                    <span className="h-0.5 w-4 rounded-full bg-primary mt-0.5" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Customize button */}
          <button
            className="flex flex-col items-center gap-0.5 pr-3 pl-1 py-1.5 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            onClick={() => setCustomizeOpen(true)}
            aria-label="Kustomisasi navigasi"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span className="text-[8px]">Edit</span>
          </button>
        </div>
      </nav>

      {/* Customize Sheet */}
      <Sheet open={customizeOpen} onOpenChange={setCustomizeOpen}>
        <SheetContent side="bottom" className="flex flex-col p-0 gap-0 max-h-[85vh] rounded-t-2xl">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-10 h-1 rounded-full bg-border" />
          </div>

          <SheetHeader className="px-4 pt-2 pb-3 border-b shrink-0">
            <SheetTitle>Kustomisasi Navigasi</SheetTitle>
            <p className="text-xs text-muted-foreground">
              Pilih hingga {MAX_NAV_ITEMS} item. Seret untuk mengubah urutan.
            </p>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            {/* Selected items (draggable to reorder) */}
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1 mb-1">
              Aktif ({mobileNavItems.length}/{MAX_NAV_ITEMS})
            </p>
            {orderedAllHrefs
              .filter((href) => mobileNavItems.includes(href))
              .map((href) => {
                const item = ALL_MOBILE_NAV_ITEMS.find((n) => n.href === href);
                if (!item) return null;
                return (
                  <div
                    key={href}
                    draggable
                    onDragStart={() => handleDragStart(href)}
                    onDragOver={(e) => handleDragOver(e, href)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-3 rounded-xl border bg-background px-3 py-3 select-none transition-all shadow-sm ${
                      dragId === href ? "scale-[0.98] opacity-60" : ""
                    }`}
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0 cursor-grab" />
                    <div className="rounded-lg bg-primary/10 p-1.5 shrink-0">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="flex-1 text-sm font-medium">{item.label}</span>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-7 text-xs rounded-lg shrink-0"
                      onClick={() => toggleNavItem(href)}
                    >
                      Hapus
                    </Button>
                  </div>
                );
              })}

            {/* Available (not selected) items */}
            {orderedAllHrefs.some((href) => !mobileNavItems.includes(href)) && (
              <>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1 mt-4 mb-1">
                  Tersedia
                </p>
                {orderedAllHrefs
                  .filter((href) => !mobileNavItems.includes(href))
                  .map((href) => {
                    const item = ALL_MOBILE_NAV_ITEMS.find((n) => n.href === href);
                    if (!item) return null;
                    const atMax = mobileNavItems.length >= MAX_NAV_ITEMS;
                    return (
                      <div
                        key={href}
                        className="flex items-center gap-3 rounded-xl border border-dashed bg-muted/20 px-3 py-3 opacity-60"
                      >
                        <div className="w-4 shrink-0" /> {/* spacer for grip alignment */}
                        <div className="rounded-lg bg-muted p-1.5 shrink-0">
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="flex-1 text-sm font-medium text-muted-foreground">{item.label}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs rounded-lg shrink-0"
                          onClick={() => toggleNavItem(href)}
                          disabled={atMax}
                          title={atMax ? `Maksimal ${MAX_NAV_ITEMS} item` : undefined}
                        >
                          Tambah
                        </Button>
                      </div>
                    );
                  })}
              </>
            )}
          </div>

          <div className="shrink-0 px-4 py-4 border-t">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1.5"
              onClick={() => {
                resetMobileNav();
              }}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset ke Default
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
