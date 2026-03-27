"use client";

import { useState, useCallback } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { useWedding } from "@/lib/hooks/use-wedding";
import { useDocuments, useUpsertDocument } from "@/lib/hooks/use-documents";
import { FileText, Link as LinkIcon, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

// ──────────────────────────────────────────────
// Static document list (displayed client-side)
// State (is_checked, drive_url) stored in DB
// ──────────────────────────────────────────────
const DOC_CATEGORIES = [
  {
    category: "Identitas Diri",
    emoji: "🪪",
    docs: [
      { key: "ktp_pria", name: "KTP Calon Pengantin Pria" },
      { key: "ktp_wanita", name: "KTP Calon Pengantin Wanita" },
      { key: "kk_pria", name: "Kartu Keluarga (KK) — Pihak Pria" },
      { key: "kk_wanita", name: "Kartu Keluarga (KK) — Pihak Wanita" },
      { key: "akta_pria", name: "Akta Kelahiran — Pihak Pria" },
      { key: "akta_wanita", name: "Akta Kelahiran — Pihak Wanita" },
    ],
  },
  {
    category: "Surat Pengantar & Formulir KUA",
    emoji: "📄",
    docs: [
      { key: "pengantar_rt_pria", name: "Surat Pengantar RT/RW — Pihak Pria" },
      { key: "pengantar_rt_wanita", name: "Surat Pengantar RT/RW — Pihak Wanita" },
      { key: "n1", name: "N1 — Surat Keterangan Hendak Menikah" },
      { key: "n2_pria", name: "N2 — Asal Usul Calon Pengantin Pria" },
      { key: "n2_wanita", name: "N2 — Asal Usul Calon Pengantin Wanita" },
      { key: "n4_pria", name: "N4 — Keterangan Orang Tua Pria" },
      { key: "n4_wanita", name: "N4 — Keterangan Orang Tua Wanita" },
    ],
  },
  {
    category: "Foto",
    emoji: "📸",
    docs: [
      { key: "foto_2x3_pria", name: "Pas Foto 2×3 (6 lembar) — Pihak Pria" },
      { key: "foto_2x3_wanita", name: "Pas Foto 2×3 (6 lembar) — Pihak Wanita" },
      { key: "foto_4x6_bersama", name: "Pas Foto 4×6 berdampingan (2 lembar)" },
    ],
  },
  {
    category: "Kesehatan",
    emoji: "🏥",
    docs: [
      { key: "surat_sehat_pria", name: "Surat Keterangan Sehat — Pihak Pria" },
      { key: "surat_sehat_wanita", name: "Surat Keterangan Sehat — Pihak Wanita" },
      { key: "imunisasi_tt", name: "Sertifikat Imunisasi TT (Tetanus Toxoid)" },
    ],
  },
  {
    category: "Saksi & Wali",
    emoji: "🤝",
    docs: [
      { key: "ktp_wali", name: "KTP Wali Nikah" },
      { key: "ktp_saksi_1", name: "KTP Saksi Nikah 1" },
      { key: "ktp_saksi_2", name: "KTP Saksi Nikah 2" },
    ],
  },
  {
    category: "Dokumen Pendukung",
    emoji: "📎",
    docs: [
      { key: "sertif_pranikah", name: "Sertifikat Bimbingan Perkawinan / Kursus Pranikah" },
      { key: "izin_ortu", name: "Surat Izin Orang Tua (jika usia di bawah 21 tahun)" },
      { key: "akta_cerai", name: "Akta Cerai / Keterangan Kematian (jika pernah menikah)" },
      { key: "pnbp", name: "Bukti Pembayaran PNBP NR (jika nikah di luar kantor KUA)" },
    ],
  },
];

const ALL_DOCS = DOC_CATEGORIES.flatMap((c) => c.docs);

export default function DokumenPage() {
  const { data: wedding, isLoading: weddingLoading } = useWedding();
  const weddingId = wedding?.id;
  const { data: docStates, isLoading: docsLoading } = useDocuments(weddingId);
  const upsert = useUpsertDocument();

  // Track which drive-url inputs are in edit mode (debounced save)
  const [driveInputs, setDriveInputs] = useState<Record<string, string>>({});

  // Build lookup map from DB state
  const stateMap: Record<string, { is_checked: boolean; drive_url: string | null }> = {};
  for (const s of docStates ?? []) {
    stateMap[s.doc_key] = { is_checked: s.is_checked, drive_url: s.drive_url };
  }

  const totalDocs = ALL_DOCS.length;
  const checkedDocs = ALL_DOCS.filter((d) => stateMap[d.key]?.is_checked).length;
  const pct = totalDocs > 0 ? Math.round((checkedDocs / totalDocs) * 100) : 0;
  const hasDriveLinks = ALL_DOCS.filter((d) => stateMap[d.key]?.drive_url).length;

  async function handleCheck(docKey: string, checked: boolean) {
    if (!weddingId) return;
    try {
      await upsert.mutateAsync({ weddingId, docKey, isChecked: checked });
    } catch {
      toast.error("Gagal menyimpan");
    }
  }

  const saveDriveUrl = useCallback(
    async (docKey: string, url: string) => {
      if (!weddingId) return;
      try {
        await upsert.mutateAsync({ weddingId, docKey, driveUrl: url });
      } catch {
        toast.error("Gagal menyimpan link");
      }
    },
    [weddingId, upsert]
  );

  if (weddingLoading || docsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-16 w-full" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  if (!weddingId) {
    return (
      <EmptyState
        icon={FileText}
        title="Belum ada pernikahan"
        description="Buat pernikahan terlebih dahulu"
        actionLabel="Ke Dashboard"
        actionHref="/dashboard"
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dokumen KUA & Penunjang"
        description="Checklist kelengkapan dokumen pernikahan"
      />

      {/* Progress summary */}
      <div className="rounded-lg border p-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Kelengkapan Dokumen</span>
          <span className="font-number text-muted-foreground">
            {checkedDocs} / {totalDocs} dokumen
          </span>
        </div>
        <Progress value={pct} className="h-2" />
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
            {checkedDocs} siap
          </span>
          <span className="flex items-center gap-1">
            <LinkIcon className="h-3.5 w-3.5 text-blue-500" />
            {hasDriveLinks} ada link Drive
          </span>
          <span>{totalDocs - checkedDocs} belum siap</span>
        </div>
      </div>

      {/* Document categories */}
      <div className="space-y-4">
        {DOC_CATEGORIES.map((cat) => {
          const catChecked = cat.docs.filter((d) => stateMap[d.key]?.is_checked).length;
          return (
            <div key={cat.category} className="rounded-lg border overflow-hidden">
              {/* Category header */}
              <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <span>{cat.emoji}</span>
                  {cat.category}
                </h3>
                <span className="text-xs text-muted-foreground font-number">
                  {catChecked}/{cat.docs.length}
                </span>
              </div>

              {/* Documents */}
              <div className="divide-y">
                {cat.docs.map((doc) => {
                  const state = stateMap[doc.key];
                  const isChecked = state?.is_checked ?? false;
                  const driveUrl = driveInputs[doc.key] ?? state?.drive_url ?? "";

                  return (
                    <div
                      key={doc.key}
                      className={`px-4 py-3 space-y-2 transition-colors ${
                        isChecked ? "bg-green-50/40 dark:bg-green-950/10" : ""
                      }`}
                    >
                      {/* Checkbox + name */}
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(v) => handleCheck(doc.key, !!v)}
                          className="mt-0.5 shrink-0"
                        />
                        <span
                          className={`text-sm leading-snug ${
                            isChecked ? "line-through text-muted-foreground" : ""
                          }`}
                        >
                          {doc.name}
                        </span>
                      </div>

                      {/* Drive link input */}
                      <div className="pl-7">
                        <div className="relative">
                          <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                          <Input
                            value={driveUrl}
                            onChange={(e) =>
                              setDriveInputs((prev) => ({
                                ...prev,
                                [doc.key]: e.target.value,
                              }))
                            }
                            onBlur={() => saveDriveUrl(doc.key, driveUrl)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveDriveUrl(doc.key, driveUrl);
                            }}
                            placeholder="Link Google Drive / cloud storage (opsional)"
                            className="h-7 pl-8 text-xs"
                          />
                          {driveUrl && (
                            <a
                              href={driveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-primary hover:underline"
                            >
                              Buka
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground text-center pb-4">
        * Persyaratan dokumen dapat berbeda per KUA. Konfirmasi ke KUA setempat untuk kepastian.
      </p>
    </div>
  );
}
