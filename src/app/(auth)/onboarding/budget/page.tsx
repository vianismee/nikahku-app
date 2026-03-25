"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const BUDGET_PRESETS = [
  { label: "< Rp 50 juta", value: 50_000_000 },
  { label: "Rp 50–100 juta", value: 100_000_000 },
  { label: "Rp 100–200 juta", value: 200_000_000 },
  { label: "Rp 200–500 juta", value: 500_000_000 },
  { label: "> Rp 500 juta", value: 750_000_000 },
];

export default function OnboardingBudgetPage() {
  const router = useRouter();
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [customBudget, setCustomBudget] = useState("");
  const [loading, setLoading] = useState(false);

  const budget = selectedPreset ?? (customBudget ? parseInt(customBudget.replace(/\D/g, ""), 10) : 0);

  function formatRupiah(value: string) {
    const number = value.replace(/\D/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!budget) return;

    setLoading(true);

    // TODO: Save budget to Supabase
    sessionStorage.setItem("onboarding_budget", JSON.stringify({ budget }));

    router.push("/onboarding/template");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="text-sm text-muted-foreground mb-2">Langkah 2 dari 3</div>
          <CardTitle className="text-2xl font-heading">Budget Pernikahan</CardTitle>
          <CardDescription>
            Tentukan estimasi budget untuk pernikahan kalian
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {BUDGET_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => {
                    setSelectedPreset(preset.value);
                    setCustomBudget("");
                  }}
                  className={`rounded-lg border p-3 text-sm transition-colors ${
                    selectedPreset === preset.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">atau input manual</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom">Budget Custom (Rp)</Label>
              <Input
                id="custom"
                placeholder="Contoh: 150.000.000"
                value={customBudget}
                onChange={(e) => {
                  setCustomBudget(formatRupiah(e.target.value));
                  setSelectedPreset(null);
                }}
                className="font-number"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                Kembali
              </Button>
              <Button type="submit" className="flex-1" disabled={!budget || loading}>
                {loading ? "Menyimpan..." : "Lanjut"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
