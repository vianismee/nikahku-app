"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useBulkCreateVendorPackages, useBulkCreateVendorAdditionals } from "@/lib/hooks/use-vendors";
import { formatRupiah } from "@/lib/utils/format-currency";
import {
  FileJson,
  AlertCircle,
  CheckCircle2,
  Package,
  ShoppingBag,
  Copy,
  Check,
  Bot,
} from "lucide-react";
import { toast } from "sonner";
import { copyToClipboard } from "@/lib/utils/clipboard";

// ─── Types ─────────────────────────────────────────────────────────────────

interface PackageJSON {
  name: string;
  price: number;
  description?: string | null;
  includes?: string[];
  excludes?: string[];
  notes?: string | null;
}

interface AdditionalJSON {
  name: string;
  price: number;
  unit?: string;
  description?: string | null;
}

interface ParsedData {
  packages: PackageJSON[];
  additionals: AdditionalJSON[];
}

// ─── Validation ─────────────────────────────────────────────────────────────

const VALID_UNITS = ["item", "orang", "set", "jam", "meja", "sesi", "km"];

function validateImport(data: unknown): { result: ParsedData; errors: string[] } {
  const errors: string[] = [];
  const result: ParsedData = { packages: [], additionals: [] };

  // Accept both old format (array = packages only) and new format ({ packages, additionals })
  let rawPackages: unknown[] = [];
  let rawAdditionals: unknown[] = [];

  if (Array.isArray(data)) {
    // Legacy: plain array → treat as packages
    rawPackages = data;
  } else if (data && typeof data === "object" && !Array.isArray(data)) {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.packages)) rawPackages = obj.packages;
    if (Array.isArray(obj.additionals)) rawAdditionals = obj.additionals;
    if (rawPackages.length === 0 && rawAdditionals.length === 0) {
      errors.push('JSON harus berupa array paket atau objek dengan field "packages" dan/atau "additionals"');
      return { result, errors };
    }
  } else {
    errors.push('JSON tidak valid. Harus array atau objek { "packages": [...], "additionals": [...] }');
    return { result, errors };
  }

  // Validate packages
  rawPackages.slice(0, 30).forEach((item, i) => {
    const idx = i + 1;
    if (typeof item !== "object" || item === null) { errors.push(`Paket #${idx}: bukan object`); return; }
    const obj = item as Record<string, unknown>;
    if (!obj.name || typeof obj.name !== "string") { errors.push(`Paket #${idx}: "name" wajib (string)`); return; }
    if (obj.price === undefined || typeof obj.price !== "number") { errors.push(`Paket #${idx} (${obj.name}): "price" wajib (angka)`); return; }
    const pkg: PackageJSON = { name: (obj.name as string).trim(), price: obj.price as number };
    if (obj.description && typeof obj.description === "string") pkg.description = obj.description.trim();
    if (Array.isArray(obj.includes)) pkg.includes = (obj.includes as unknown[]).filter((x): x is string => typeof x === "string").map((x) => x.trim()).filter(Boolean);
    if (Array.isArray(obj.excludes)) pkg.excludes = (obj.excludes as unknown[]).filter((x): x is string => typeof x === "string").map((x) => x.trim()).filter(Boolean);
    if (obj.notes && typeof obj.notes === "string") pkg.notes = obj.notes.trim();
    result.packages.push(pkg);
  });

  // Validate additionals
  rawAdditionals.slice(0, 50).forEach((item, i) => {
    const idx = i + 1;
    if (typeof item !== "object" || item === null) { errors.push(`Add-on #${idx}: bukan object`); return; }
    const obj = item as Record<string, unknown>;
    if (!obj.name || typeof obj.name !== "string") { errors.push(`Add-on #${idx}: "name" wajib (string)`); return; }
    if (obj.price === undefined || typeof obj.price !== "number") { errors.push(`Add-on #${idx} (${obj.name}): "price" wajib (angka)`); return; }
    const unit = typeof obj.unit === "string" && VALID_UNITS.includes(obj.unit) ? obj.unit : "item";
    const a: AdditionalJSON = { name: (obj.name as string).trim(), price: obj.price as number, unit };
    if (obj.description && typeof obj.description === "string") a.description = obj.description.trim();
    result.additionals.push(a);
  });

  return { result, errors };
}

// ─── AI Prompt ──────────────────────────────────────────────────────────────

const AI_PROMPT = `Ekstrak data price list vendor pernikahan dari dokumen/foto yang aku lampirkan.
Output HARUS berupa JSON murni — tidak ada teks penjelasan sebelum atau sesudah JSON.

ATURAN WAJIB (jangan dilanggar):
1. Hanya tulis data yang BENAR-BENAR ADA di dokumen. Jangan mengarang, jangan mengisi field yang tidak ada informasinya dengan asumsi.
2. Jika suatu informasi tidak ada di dokumen, isi dengan null — jangan mengarang nilai.
3. Semua harga dalam angka integer IDR tanpa titik/koma (contoh: 750000, bukan "Rp 750.000").
4. Jika harga bertipe "mulai dari" / "start from", gunakan angka minimumnya dan tulis keterangan "mulai dari Rp X" di field "description".
5. Jika item gratis (free / free charge / Rp 0), tulis price: 0 dan tulis "Gratis" di field "description".
6. Jangan duplikasi: item yang sudah masuk di packages[].includes JANGAN dimasukkan lagi ke additionals.
7. Satuan (unit) harus salah satu dari: "item", "orang", "set", "jam", "meja", "sesi", "km". Jika tidak ada satuan eksplisit di dokumen, gunakan "item".
8. Untuk additionals: TIDAK ADA field "notes". Semua keterangan tambahan (syarat, kondisi, info "mulai dari", dsb.) ditulis di field "description".

CARA MEMBEDAKAN packages vs additionals:
- packages  → bundling layanan dengan daftar isi (termasuk/tidak termasuk), dijual sebagai satu kesatuan
- additionals → item satuan yang dijual terpisah / bisa ditambahkan di luar paket

FORMAT JSON OUTPUT:
{
  "packages": [
    {
      "name": "string",
      "description": null,
      "price": 0,
      "includes": ["string", "..."],
      "excludes": ["string", "..."],
      "notes": null
    }
  ],
  "additionals": [
    {
      "name": "string",
      "description": null,
      "price": 0,
      "unit": "item"
    }
  ]
}

Lampirkan dokumen/foto price list vendor sekarang.`;

const EXAMPLE_JSON = `{
  "packages": [
    {
      "name": "Paket Gold",
      "price": 8500000,
      "includes": ["Make-up pengantin", "2 set baju wanita"],
      "excludes": ["Hairdo"],
      "notes": null
    }
  ],
  "additionals": [
    {
      "name": "Hairdo Modern",
      "price": 750000,
      "unit": "item",
      "description": null
    },
    {
      "name": "Cucuk Lampah",
      "price": 550000,
      "unit": "item",
      "description": "mulai dari Rp 550.000"
    },
    {
      "name": "Rias Tamu",
      "price": 200000,
      "unit": "orang",
      "description": "Tambahan hairdo +Rp 175.000/orang"
    }
  ]
}`;

// ─── Component ───────────────────────────────────────────────────────────────

interface VendorPackageImportDialogProps {
  vendorId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VendorPackageImportDialog({ vendorId, open, onOpenChange }: VendorPackageImportDialogProps) {
  const [jsonInput, setJsonInput] = useState("");
  const [preview, setPreview] = useState<ParsedData | null>(null);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedExample, setCopiedExample] = useState(false);
  const [tab, setTab] = useState<"json" | "prompt">("json");

  const bulkCreatePackages = useBulkCreateVendorPackages();
  const bulkCreateAdditionals = useBulkCreateVendorAdditionals();

  async function handleCopy(text: string, type: "prompt" | "example") {
    try {
      await copyToClipboard(text);
    } catch {
      toast.error("Gagal menyalin");
      return;
    }
    if (type === "prompt") {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } else {
      setCopiedExample(true);
      setTimeout(() => setCopiedExample(false), 2000);
    }
  }

  function handleParse() {
    setPreview(null);
    setParseErrors([]);
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonInput);
    } catch {
      setParseErrors(["JSON tidak valid. Pastikan format JSON sudah benar."]);
      return;
    }
    const { result, errors } = validateImport(parsed);
    setParseErrors(errors);
    if (result.packages.length > 0 || result.additionals.length > 0) {
      setPreview(result);
    }
  }

  async function handleImport() {
    if (!preview) return;
    const total = preview.packages.length + preview.additionals.length;
    try {
      if (preview.packages.length > 0) {
        await bulkCreatePackages.mutateAsync({
          vendorId,
          packages: preview.packages.map((pkg) => ({
            name: pkg.name,
            price: pkg.price,
            description: pkg.description ?? null,
            includes: pkg.includes && pkg.includes.length > 0 ? pkg.includes : null,
            excludes: pkg.excludes && pkg.excludes.length > 0 ? pkg.excludes : null,
            notes: pkg.notes ?? null,
          })),
        });
      }
      if (preview.additionals.length > 0) {
        await bulkCreateAdditionals.mutateAsync({
          vendorId,
          additionals: preview.additionals.map((a) => ({
            name: a.name,
            price: a.price,
            unit: a.unit ?? "item",
            description: a.description ?? null,
          })),
        });
      }
      toast.success(`${total} item berhasil diimport (${preview.packages.length} paket, ${preview.additionals.length} add-on)`);
      setJsonInput("");
      setPreview(null);
      setParseErrors([]);
      onOpenChange(false);
    } catch {
      toast.error("Gagal mengimport data");
    }
  }

  function handleReset() {
    setJsonInput("");
    setPreview(null);
    setParseErrors([]);
  }

  const isPending = bulkCreatePackages.isPending || bulkCreateAdditionals.isPending;
  const totalItems = (preview?.packages.length ?? 0) + (preview?.additionals.length ?? 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileJson className="h-5 w-5" />
            Import dari JSON (AI)
          </DialogTitle>
          <DialogDescription>
            Gunakan prompt AI untuk mengekstrak price list, lalu paste JSON-nya di sini
          </DialogDescription>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex border-b shrink-0">
          <button
            onClick={() => setTab("json")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === "json"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Paste JSON
          </button>
          <button
            onClick={() => setTab("prompt")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              tab === "prompt"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bot className="h-3.5 w-3.5" />
            Prompt AI
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">

          {/* ── Tab: Prompt AI ── */}
          {tab === "prompt" && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/50 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium">Prompt untuk Claude.ai / ChatGPT</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1.5"
                    onClick={() => handleCopy(AI_PROMPT, "prompt")}
                  >
                    {copiedPrompt ? (
                      <><Check className="h-3 w-3" />Tersalin</>
                    ) : (
                      <><Copy className="h-3 w-3" />Copy Prompt</>
                    )}
                  </Button>
                </div>
                <pre className="text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {AI_PROMPT}
                </pre>
              </div>
              <div className="rounded-lg border bg-muted/20 p-3 space-y-1.5">
                <p className="text-xs font-medium">Cara Pakai</p>
                <ol className="text-xs text-muted-foreground space-y-1 list-decimal pl-4">
                  <li>Copy prompt di atas</li>
                  <li>Buka Claude.ai atau ChatGPT</li>
                  <li>Paste prompt + lampirkan foto / PDF price list vendor</li>
                  <li>Copy output JSON dari AI</li>
                  <li>Kembali ke tab <strong>Paste JSON</strong> dan paste hasilnya</li>
                </ol>
              </div>
            </div>
          )}

          {/* ── Tab: Paste JSON ── */}
          {tab === "json" && (
            <>
              {!preview && (
                <>
                  <div className="space-y-1.5">
                    <Label>JSON dari AI</Label>
                    <Textarea
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      placeholder={EXAMPLE_JSON}
                      rows={10}
                      className="font-mono text-xs"
                    />
                  </div>

                  {/* Example */}
                  <div className="rounded-lg border bg-muted/50 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium">Contoh Format JSON</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs gap-1.5"
                        onClick={() => handleCopy(EXAMPLE_JSON, "example")}
                      >
                        {copiedExample ? (
                          <><Check className="h-3 w-3" />Tersalin</>
                        ) : (
                          <><Copy className="h-3 w-3" />Copy</>
                        )}
                      </Button>
                    </div>
                    <pre className="text-xs text-muted-foreground overflow-x-auto whitespace-pre">
{EXAMPLE_JSON}
                    </pre>
                    <div className="text-xs text-muted-foreground space-y-0.5 border-t pt-2">
                      <p>Paket: <code className="bg-muted px-1 rounded">name</code> &amp; <code className="bg-muted px-1 rounded">price</code> wajib, <code className="bg-muted px-1 rounded">notes</code> opsional</p>
                    <p>Add-on: <code className="bg-muted px-1 rounded">name</code> &amp; <code className="bg-muted px-1 rounded">price</code> wajib, keterangan tambahan di <code className="bg-muted px-1 rounded">description</code> (tidak ada field notes)</p>
                    </div>
                  </div>
                </>
              )}

              {/* Errors */}
              {parseErrors.length > 0 && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {preview ? "Beberapa item dilewati:" : "Error:"}
                  </div>
                  {parseErrors.map((err, i) => (
                    <p key={i} className="text-xs text-destructive/80 pl-6">{err}</p>
                  ))}
                </div>
              )}

              {/* Preview */}
              {preview && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    {preview.packages.length} paket + {preview.additionals.length} add-on siap diimport
                  </div>

                  {/* Packages preview */}
                  {preview.packages.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                        <Package className="h-3.5 w-3.5" /> Paket
                      </p>
                      {preview.packages.map((pkg, i) => (
                        <div key={i} className="rounded-lg border p-3 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-medium text-sm">{pkg.name}</span>
                            <span className="font-number font-bold text-sm shrink-0">
                              {formatRupiah(pkg.price)}
                            </span>
                          </div>
                          {pkg.description && (
                            <p className="text-xs text-muted-foreground">{pkg.description}</p>
                          )}
                          {pkg.includes && pkg.includes.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {pkg.includes.slice(0, 5).map((item, j) => (
                                <Badge key={j} variant="secondary" className="text-xs">{item}</Badge>
                              ))}
                              {pkg.includes.length > 5 && (
                                <Badge variant="outline" className="text-xs">+{pkg.includes.length - 5} lainnya</Badge>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Additionals preview */}
                  {preview.additionals.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                        <ShoppingBag className="h-3.5 w-3.5" /> Add-on
                      </p>
                      {preview.additionals.map((a, i) => (
                        <div key={i} className="rounded-lg border px-3 py-2 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-sm font-medium truncate block">{a.name}</span>
                            {a.description && (
                              <span className="text-xs text-muted-foreground">{a.description}</span>
                            )}
                          </div>
                          <div className="shrink-0 text-right">
                            <span className="font-number text-sm font-bold block">
                              {a.price === 0 ? "Gratis" : formatRupiah(a.price)}
                            </span>
                            <span className="text-xs text-muted-foreground">/ {a.unit ?? "item"}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          {preview ? (
            <>
              <Button variant="outline" onClick={handleReset}>
                Kembali
              </Button>
              <Button onClick={handleImport} disabled={isPending}>
                {isPending ? "Mengimport..." : `Import ${totalItems} Item`}
              </Button>
            </>
          ) : tab === "json" ? (
            <>
              <DialogClose render={<Button variant="outline">Batal</Button>} />
              <Button onClick={handleParse} disabled={!jsonInput.trim()}>
                Validasi &amp; Preview
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setTab("json")}>
              Lanjut ke Paste JSON
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
