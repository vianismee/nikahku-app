"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell, Plus, Home } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useAuth } from "@/providers/auth-provider";
import { logout } from "@/app/actions/auth";

const BREADCRUMB_MAP: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/budget": "Budget",
  "/vendor": "Vendor",
  "/seserahan": "Mahar & Seserahan",
  "/guest": "Daftar Tamu",
  "/planning": "Planning Board",
  "/settings": "Pengaturan",
};

export function Header() {
  const pathname = usePathname();
  const { user } = useAuth();

  const pageTitle =
    Object.entries(BREADCRUMB_MAP).find(([path]) =>
      pathname.startsWith(path)
    )?.[1] ?? "NIKAHKU";

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "NK";

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm px-4 py-3 lg:px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-heading font-semibold">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Quick action */}
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>

        {/* Landing page link */}
        <Link href="/">
          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Ke Landing Page">
            <Home className="h-4 w-4" />
          </Button>
        </Link>

        {/* Theme toggle */}
        <ThemeToggle size="sm" />

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="h-8 w-8 relative">
          <Bell className="h-4 w-4" />
        </Button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">
                {user?.user_metadata?.full_name || "User"}
              </p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <a href="/settings" className="w-full">Pengaturan</a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <form action={logout} className="w-full">
                <button type="submit" className="w-full text-left">
                  Keluar
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
