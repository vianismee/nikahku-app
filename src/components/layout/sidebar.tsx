"use client";

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
  Settings,
  LogOut,
  Heart,
  ScrollText,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/providers/auth-provider";
import { useWedding } from "@/lib/hooks/use-wedding";
import { useTasks } from "@/lib/hooks/use-tasks";
import { daysUntilWedding } from "@/lib/utils/date-utils";
import { logout } from "@/app/actions/auth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/budget", label: "Budget", icon: Wallet },
  { href: "/vendor", label: "Vendor", icon: Store },
  { href: "/seserahan", label: "Mahar & Seserahan", icon: Gift },
  { href: "/guest", label: "Tamu", icon: Users },
  { href: "/planning", label: "Planning", icon: ClipboardList },
  { href: "/rundown", label: "Rundown Acara", icon: ScrollText },
  { href: "/dokumen", label: "Dokumen KUA", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { data: wedding } = useWedding();

  const { data: tasks } = useTasks(wedding?.id);

  const countdown = wedding?.wedding_date
    ? daysUntilWedding(wedding.wedding_date)
    : null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const in7Days = new Date(today);
  in7Days.setDate(today.getDate() + 7);
  const taskAlertCount = (tasks ?? []).filter((t) => {
    if (t.status === "done" || t.status === "cancelled") return false;
    if (!t.due_date) return false;
    const due = new Date(t.due_date);
    return due <= in7Days;
  }).length;

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "NK";

  return (
    <aside className="flex flex-col w-60 border-r border-border bg-sidebar h-screen">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5">
        <Heart className="h-6 w-6 text-primary fill-primary" />
        <span className="text-xl font-heading font-bold text-foreground">
          NIKAHKU
        </span>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
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
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {badge && (
                <span className="ml-auto min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold px-1">
                  {badge > 99 ? "99+" : badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Wedding Countdown */}
      <div className="px-4 py-3">
        <div className="rounded-lg border border-border p-3 text-center">
          <p className="text-xs text-muted-foreground">Hari Pernikahan</p>
          <p className="text-2xl font-heading font-bold text-primary font-number">
            {countdown === null
              ? "--"
              : countdown > 0
                ? countdown
                : countdown === 0
                  ? "Hari ini!"
                  : "Sudah lewat"}
          </p>
          {(countdown === null || countdown > 0) && (
            <p className="text-xs text-muted-foreground">hari lagi</p>
          )}
        </div>
      </div>

      <Separator />

      {/* User Section */}
      <div className="flex items-center gap-3 px-4 py-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            {user?.user_metadata?.full_name || "User"}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {user?.email}
          </p>
        </div>
        <form action={logout}>
          <Button variant="ghost" size="icon" className="h-8 w-8" type="submit">
            <LogOut className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* Settings link */}
      <div className="px-3 pb-3">
        <Link
          href="/settings"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
            pathname === "/settings"
              ? "bg-sidebar-accent text-sidebar-primary font-medium"
              : "text-muted-foreground hover:bg-sidebar-accent/50"
          }`}
        >
          <Settings className="h-4 w-4" />
          Pengaturan
        </Link>
      </div>
    </aside>
  );
}
