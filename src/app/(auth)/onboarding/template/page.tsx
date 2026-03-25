"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const TEMPLATES = [
  {
    id: "simple",
    name: "Pernikahan Sederhana",
    description: "30+ checklist item — intimate, budget-friendly",
    tasks: 32,
  },
  {
    id: "standard",
    name: "Pernikahan Standard",
    description: "50+ checklist item — resepsi lengkap",
    tasks: 54,
  },
  {
    id: "grand",
    name: "Pernikahan Besar",
    description: "70+ checklist item — multi-venue, dekorasi mewah",
    tasks: 72,
  },
  {
    id: "empty",
    name: "Mulai dari Nol",
    description: "Buat checklist sendiri sesuai kebutuhan",
    tasks: 0,
  },
];

export default function OnboardingTemplatePage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!selectedTemplate) return;

    setLoading(true);

    try {
      const supabase = createClient();

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast.error("Sesi login berakhir. Silakan login ulang.");
        router.push("/login");
        return;
      }

      // Collect data from previous steps
      const weddingData = JSON.parse(sessionStorage.getItem("onboarding_wedding") ?? "{}");
      const budgetData = JSON.parse(sessionStorage.getItem("onboarding_budget") ?? "{}");

      if (!weddingData.partnerName1 || !weddingData.partnerName2 || !weddingData.weddingDate) {
        toast.error("Data pernikahan tidak lengkap. Mulai ulang dari langkah 1.");
        router.push("/onboarding");
        return;
      }

      // 1. Create wedding
      const { data: weddingRaw, error: weddingError } = await supabase
        .from("weddings")
        .insert({
          user_id: user.id,
          partner_1_name: weddingData.partnerName1,
          partner_2_name: weddingData.partnerName2,
          wedding_date: weddingData.weddingDate,
          venue_city: weddingData.city || null,
        } as never)
        .select()
        .single();
      const wedding = weddingRaw as unknown as { id: string } | null;

      if (weddingError) {
        // If wedding already exists for this user, go to dashboard
        if (weddingError.code === "23505") {
          toast.info("Kamu sudah punya data pernikahan");
          router.push("/dashboard");
          return;
        }
        throw weddingError;
      }

      // 2. Create budget (if set)
      if (wedding && budgetData.budget && budgetData.budget > 0) {
        await supabase
          .from("budgets")
          .insert({
            wedding_id: wedding.id,
            total_amount: budgetData.budget,
          } as never);
      }

      // 3. Clear sessionStorage
      sessionStorage.removeItem("onboarding_wedding");
      sessionStorage.removeItem("onboarding_budget");
      sessionStorage.removeItem("onboarding_template");

      toast.success("Selamat! Pernikahan berhasil dibuat 🎉");
      router.push("/dashboard");
    } catch (err) {
      console.error("Onboarding error:", err);
      toast.error("Gagal menyimpan data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="text-sm text-muted-foreground mb-2">Langkah 3 dari 3</div>
          <CardTitle className="text-2xl font-heading">Pilih Template</CardTitle>
          <CardDescription>
            Pilih template checklist pernikahan untuk memulai
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => setSelectedTemplate(template.id)}
                className={`w-full flex items-start gap-3 rounded-lg border p-4 text-left transition-colors ${
                  selectedTemplate === template.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <CheckCircle2
                  className={`mt-0.5 h-5 w-5 shrink-0 ${
                    selectedTemplate === template.id
                      ? "text-primary"
                      : "text-muted-foreground/30"
                  }`}
                />
                <div>
                  <div className="font-medium">{template.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {template.description}
                  </div>
                  {template.tasks > 0 && (
                    <div className="mt-1 text-xs font-number text-muted-foreground">
                      {template.tasks} tasks
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
            >
              Kembali
            </Button>
            <Button
              className="flex-1"
              disabled={!selectedTemplate || loading}
              onClick={handleSubmit}
            >
              {loading ? "Menyiapkan..." : "Mulai Merencanakan"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
