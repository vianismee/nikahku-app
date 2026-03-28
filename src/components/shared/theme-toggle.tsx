"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThemeToggleProps {
  size?: "sm" | "default";
}

export function ThemeToggle({ size = "default" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      className={size === "sm" ? "h-8 w-8" : "h-9 w-9"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
    >
      {isDark ? (
        <Sun className={size === "sm" ? "h-4 w-4" : "h-4 w-4"} />
      ) : (
        <Moon className={size === "sm" ? "h-4 w-4" : "h-4 w-4"} />
      )}
    </Button>
  );
}
