"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { TASK_TEMPLATES, calculateDueDate } from "@/lib/constants/task-templates";
import { toast } from "sonner";

const TEMPLATE_OPTIONS = [
  ...TASK_TEMPLATES.map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    tasks: t.tasks.length,
  })),
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

      // 3. Create tasks from template
      if (wedding && selectedTemplate !== "empty") {
        const template = TASK_TEMPLATES.find((t) => t.id === selectedTemplate);
        if (template) {
          const taskRows = template.tasks.map((t, i) => ({
            wedding_id: wedding.id,
            title: t.title,
            category: t.category,
            priority: t.priority,
            status: "todo",
            column_id: "todo",
            due_date: calculateDueDate(weddingData.weddingDate, t.monthsBefore),
            sort_order: i,
          }));

          // Insert in batches of 50
          const batchSize = 50;
          for (let i = 0; i < taskRows.length; i += batchSize) {
            const batch = taskRows.slice(i, i + batchSize);
            await supabase.from("tasks").insert(batch as never[]);
          }
        }
      }

      // 4. Clear sessionStorage
      sessionStorage.removeItem("onboarding_wedding");
      sessionStorage.removeItem("onboarding_budget");
      sessionStorage.removeItem("onboarding_template");

      const template = TASK_TEMPLATES.find((t) => t.id === selectedTemplate);
      const taskMsg = template ? ` dengan ${template.tasks.length} task` : "";
      toast.success(`Selamat! Pernikahan berhasil dibuat${taskMsg} 🎉`);
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
            {TEMPLATE_OPTIONS.map((template) => (
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
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{template.name}</span>
                    {template.tasks > 0 && (
                      <Badge variant="secondary" className="shrink-0 text-xs">
                        {template.tasks} task
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">
                    {template.description}
                  </div>
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
              className="flex-1 gap-1.5"
              disabled={!selectedTemplate || loading}
              onClick={handleSubmit}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Menyiapkan..." : "Mulai Merencanakan"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
