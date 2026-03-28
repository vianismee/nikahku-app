"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { toast } from "sonner";
import {
  useWhatsappTemplates,
  useCreateWhatsappTemplate,
  useUpdateWhatsappTemplate,
  useDeleteWhatsappTemplate,
  useSetDefaultTemplate,
} from "@/lib/hooks/use-whatsapp-templates";
import { TEMPLATE_VARIABLES, TEMPLATE_SUGGESTIONS, type TemplateSuggestion } from "@/lib/utils/whatsapp";
import { Plus, Pencil, Trash2, Check, X, Star, MessageCircle, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

interface WhatsappTemplateManagerProps {
  weddingId: string;
}

const CATEGORY_META: Record<TemplateSuggestion["category"], { label: string; color: string }> = {
  formal:   { label: "Formal",    color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  kasual:   { label: "Kasual",    color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300" },
  fun:      { label: "Fun",       color: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300" },
  islami:   { label: "Islami",    color: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" },
  singkat:  { label: "Singkat",   color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  keluarga: { label: "Keluarga",  color: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300" },
  vip:      { label: "VIP",       color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
};

export function WhatsappTemplateManager({ weddingId }: WhatsappTemplateManagerProps) {
  const { data: templates = [], isLoading } = useWhatsappTemplates(weddingId);
  const createTemplate = useCreateWhatsappTemplate();
  const updateTemplate = useUpdateWhatsappTemplate(weddingId);
  const deleteTemplate = useDeleteWhatsappTemplate(weddingId);
  const setDefault = useSetDefaultTemplate(weddingId);

  const [addOpen, setAddOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", body: "" });
  const [activeCat, setActiveCat] = useState<TemplateSuggestion["category"] | "semua">("semua");
  const [previewId, setPreviewId] = useState<string | null>(null);

  const categories = Array.from(new Set(TEMPLATE_SUGGESTIONS.map((t) => t.category)));

  const filteredSuggestions = activeCat === "semua"
    ? TEMPLATE_SUGGESTIONS
    : TEMPLATE_SUGGESTIONS.filter((t) => t.category === activeCat);

  function openAdd() {
    setForm({ name: "", body: "" });
    setEditId(null);
    setAddOpen(true);
    setSuggestOpen(false);
  }

  function openEdit(id: string, name: string, body: string) {
    setForm({ name, body });
    setEditId(id);
    setAddOpen(true);
    setSuggestOpen(false);
  }

  function closeForm() {
    setAddOpen(false);
    setEditId(null);
    setForm({ name: "", body: "" });
  }

  async function handleSave() {
    if (!form.name.trim() || !form.body.trim()) {
      toast.error("Nama dan isi template wajib diisi");
      return;
    }
    if (editId) {
      const res = await updateTemplate.mutateAsync({ id: editId, name: form.name.trim(), body: form.body.trim() });
      if (res.success) { toast.success("Template diperbarui"); closeForm(); }
      else toast.error(res.error ?? "Gagal memperbarui");
    } else {
      const res = await createTemplate.mutateAsync({ weddingId, name: form.name.trim(), body: form.body.trim() });
      if (res.success) { toast.success("Template ditambahkan"); closeForm(); }
      else toast.error(res.error ?? "Gagal menambahkan");
    }
  }

  async function handleDelete(id: string) {
    const res = await deleteTemplate.mutateAsync(id);
    if (!res.success) toast.error(res.error ?? "Gagal menghapus");
  }

  async function handleSetDefault(id: string) {
    const res = await setDefault.mutateAsync(id);
    if (res.success) toast.success("Template utama diperbarui");
    else toast.error(res.error ?? "Gagal");
  }

  async function handleUseSuggestion(suggestion: TemplateSuggestion) {
    const res = await createTemplate.mutateAsync({
      weddingId,
      name: suggestion.name,
      body: suggestion.body,
    });
    if (res.success) toast.success(`Template "${suggestion.name}" ditambahkan`);
    else toast.error(res.error ?? "Gagal menambahkan");
  }

  function insertVariable(key: string) {
    setForm((f) => ({ ...f, body: f.body + key }));
  }

  if (isLoading) return <div className="h-12 animate-pulse bg-muted rounded-lg" />;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-green-600" />
          <h3 className="text-sm font-semibold">Template WhatsApp</h3>
        </div>
        <div className="flex gap-2">
          {!addOpen && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => { setSuggestOpen((v) => !v); setAddOpen(false); }}
                className="gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Saran
                {suggestOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </Button>
              <Button size="sm" variant="outline" onClick={openAdd}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                Buat
              </Button>
            </>
          )}
        </div>
      </div>

      {/* ── Suggestion Panel ──────────────────────────────────────── */}
      {suggestOpen && (
        <Card className="p-4 space-y-3 border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Pilih template siap pakai
            </p>
            <Button variant="ghost" size="icon-sm" onClick={() => setSuggestOpen(false)}>
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveCat("semua")}
              className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                activeCat === "semua"
                  ? "bg-foreground text-background border-foreground"
                  : "border-border hover:bg-muted"
              }`}
            >
              Semua
            </button>
            {categories.map((cat) => {
              const meta = CATEGORY_META[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                    activeCat === cat
                      ? "bg-foreground text-background border-foreground"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  {meta.label}
                </button>
              );
            })}
          </div>

          {/* Suggestion cards */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {filteredSuggestions.map((s) => {
              const meta = CATEGORY_META[s.category];
              const isPreviewing = previewId === s.name;
              return (
                <div
                  key={s.name}
                  className="rounded-lg border bg-background p-3 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">{s.name}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${meta.color}`}>
                          {meta.label}
                        </span>
                      </div>
                      {isPreviewing ? (
                        <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                          {s.body}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {s.body}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewId(isPreviewing ? null : s.name)}
                      className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
                    >
                      {isPreviewing ? "Tutup" : "Lihat penuh"}
                    </button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-auto h-7 text-xs gap-1"
                      onClick={() => handleUseSuggestion(s)}
                      disabled={createTemplate.isPending}
                    >
                      <Plus className="w-3 h-3" />
                      Pakai
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ── Form ─────────────────────────────────────────────────── */}
      {addOpen && (
        <Card className="p-4 space-y-3 border-primary/30 bg-primary/5">
          <p className="text-xs font-medium text-primary uppercase tracking-wide">
            {editId ? "Edit Template" : "Template Baru"}
          </p>
          <div className="space-y-1.5">
            <Label className="text-xs">Nama Template</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Contoh: Undangan Formal"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Isi Pesan</Label>
            <div className="flex flex-wrap gap-1 mb-1.5">
              {TEMPLATE_VARIABLES.map((v) => (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => insertVariable(v.key)}
                  className="text-xs font-mono px-1.5 py-0.5 rounded border border-primary/40 text-primary bg-primary/5 hover:bg-primary/15 transition-colors"
                  title={v.desc}
                >
                  {v.key}
                </button>
              ))}
            </div>
            <Textarea
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              rows={7}
              placeholder="Tulis pesan di sini. Klik variabel di atas untuk menyisipkan."
              className="font-mono text-xs resize-none"
            />
            <p className="text-xs text-muted-foreground">{form.body.length} karakter</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={closeForm}>
              <X className="w-3.5 h-3.5 mr-1" /> Batal
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={createTemplate.isPending || updateTemplate.isPending}
            >
              <Check className="w-3.5 h-3.5 mr-1" />
              {editId ? "Simpan Perubahan" : "Tambah Template"}
            </Button>
          </div>
        </Card>
      )}

      {/* ── Template list ─────────────────────────────────────────── */}
      {templates.length === 0 && !addOpen && !suggestOpen ? (
        <div className="rounded-lg border border-dashed p-6 text-center space-y-2">
          <MessageCircle className="w-8 h-8 mx-auto text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Belum ada template.</p>
          <div className="flex items-center justify-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setSuggestOpen(true)}>
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500" />
              Pilih dari saran
            </Button>
            <Button size="sm" variant="outline" onClick={openAdd}>
              <Plus className="w-3.5 h-3.5 mr-1" />
              Buat sendiri
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {templates.map((t) => (
            <Card
              key={t.id}
              className={`p-3 space-y-2 transition-colors ${t.is_default ? "border-green-500/50 bg-green-500/5" : ""}`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-medium truncate">{t.name}</span>
                  {t.is_default && (
                    <Badge variant="outline" className="text-xs text-green-600 border-green-600 shrink-0">
                      <Star className="w-2.5 h-2.5 mr-1" />Utama
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  {!t.is_default && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Jadikan template utama"
                      onClick={() => handleSetDefault(t.id)}
                      disabled={setDefault.isPending}
                    >
                      <Star className="w-3.5 h-3.5" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon-sm" onClick={() => openEdit(t.id, t.name, t.body)}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <ConfirmDialog
                    trigger={
                      <Button variant="ghost" size="icon-sm">
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </Button>
                    }
                    title="Hapus Template"
                    description={`Yakin ingin menghapus template "${t.name}"?`}
                    onConfirm={() => handleDelete(t.id)}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground whitespace-pre-line line-clamp-2">{t.body}</p>
            </Card>
          ))}
        </div>
      )}

      <Separator />
      <div className="rounded-lg bg-muted/50 p-3 space-y-1">
        <p className="text-xs font-medium">Variabel yang tersedia:</p>
        <div className="flex flex-wrap gap-x-4 gap-y-0.5">
          {TEMPLATE_VARIABLES.map((v) => (
            <p key={v.key} className="text-xs text-muted-foreground">
              <span className="font-mono text-foreground">{v.key}</span> — {v.desc}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
