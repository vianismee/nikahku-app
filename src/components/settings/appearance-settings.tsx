"use client";

import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Sun, Moon, Monitor } from "lucide-react";

const THEMES = [
  {
    value: "light",
    label: "Terang",
    description: "Tampilan terang untuk penggunaan siang hari",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Gelap",
    description: "Tampilan gelap yang nyaman untuk mata",
    icon: Moon,
  },
  {
    value: "system",
    label: "Sistem",
    description: "Mengikuti pengaturan perangkat Anda",
    icon: Monitor,
  },
] as const;

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tema Tampilan</CardTitle>
          <CardDescription>
            Pilih tema tampilan yang Anda sukai
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {THEMES.map((t) => {
              const isActive = theme === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={`flex flex-col items-center gap-3 rounded-xl border-2 p-5 transition-all ${
                    isActive
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/40 hover:bg-muted/50"
                  }`}
                >
                  <div
                    className={`rounded-full p-3 ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <t.icon className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <p
                      className={`text-sm font-medium ${
                        isActive ? "text-primary" : ""
                      }`}
                    >
                      {t.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
