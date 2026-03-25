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
import { useBulkCreateVendorPackages } from "@/lib/hooks/use-vendors";
import { formatRupiah } from "@/lib/utils/format-currency";
import { FileJson, AlertCircle, CheckCircle2, Package, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface PackageJSON {
  name: string;
  price: number;
  description?: string;
  includes?: string[];
  excludes?: string[];
  notes?: string;
}

interface VendorPackageImportDialogProps {
  vendorId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function validatePackages(data: unknown): { valid: PackageJSON[]; errors: string[] } {
  const errors: string[] = [];

  if (!Array.isArray(data)) {
    return { valid: [], errors: ["JSON harus berupa array. Contoh: [{ ... }, { ... }]"] };
  }

  if (data.length === 0) {
    return { valid: [], errors: ["Array kosong, tidak ada paket untuk diimport"] };
  }

  if (data.length > 20) {
    return { valid: [], errors: ["Maksimal 20 paket dalam sekali import"] };
  }

  const valid: PackageJSON[] = [];

  data.forEach((item, i) => {
    const idx = i + 1;

    if (typeof item !== "object" || item === null) {
      errors.push(`Paket #${idx}: bukan object`);
      return;
    }

    const obj = item as Record<string, unknown>;

    if (!obj.name || typeof obj.name !== "string") {
      errors.push(`Paket #${idx}: "name" wajib diisi (string)`);
      return;
    }

    if (obj.price === undefined || typeof obj.price !== "number" || obj.price <= 0) {
      errors.push(`Paket #${idx} (${obj.name}): "price" wajib diisi (angka > 0)`);
      return;
    }

    const pkg: PackageJSON = {
      name: obj.name.trim(),
      price: obj.price,
    };

    if (obj.description && typeof obj.description === "string") {
      pkg.description = obj.description.trim();
    }

    if (Array.isArray(obj.includes)) {
      pkg.includes = obj.includes.filter((x): x is string => typeof x === "string" && x.trim() !== "").map((x) => x.trim());
    }

    if (Array.isArray(obj.excludes)) {
      pkg.excludes = obj.excludes.filter((x): x is string => typeof x === "string" && x.trim() !== "").map((x) => x.trim());
    }

    if (obj.notes && typeof obj.notes === "string") {
      pkg.notes = obj.notes.trim();
    }

    valid.push(pkg);
  });

  return { valid, errors };
}

const EXAMPLE_JSON = `[
  {
    "name": "Paket Silver",
    "price": 5000000,
    "description": "Paket dasar",
    "includes": ["Foto 100 edit", "1 Fotografer"],
    "excludes": ["Album", "Video"]
  },
  {
    "name": "Paket Gold",
    "price": 8500000,
    "includes": ["Foto 200 edit", "2 Fotografer", "Album"],
    "excludes": ["Video"]
  }
]`;

export function VendorPackageImportDialog({ vendorId, open, onOpenChange }: VendorPackageImportDialogProps) {
  const [jsonInput, setJsonInput] = useState("");
  const [preview, setPreview] = useState<PackageJSON[] | null>(null);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const bulkCreate = useBulkCreateVendorPackages();

  async function handleCopyTemplate() {
    await navigator.clipboard.writeText(EXAMPLE_JSON);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

    const { valid, errors } = validatePackages(parsed);
    setParseErrors(errors);

    if (valid.length > 0) {
      setPreview(valid);
    }
  }

  async function handleImport() {
    if (!preview || preview.length === 0) return;

    try {
      const packages = preview.map((pkg) => ({
        name: pkg.name,
        price: pkg.price,
        description: pkg.description ?? null,
        includes: pkg.includes && pkg.includes.length > 0 ? pkg.includes : null,
        excludes: pkg.excludes && pkg.excludes.length > 0 ? pkg.excludes : null,
        notes: pkg.notes ?? null,
      }));

      await bulkCreate.mutateAsync({ vendorId, packages });
      toast.success(`${packages.length} paket berhasil diimport`);
      setJsonInput("");
      setPreview(null);
      setParseErrors([]);
      onOpenChange(false);
    } catch {
      toast.error("Gagal mengimport paket");
    }
  }

  function handleReset() {
    setJsonInput("");
    setPreview(null);
    setParseErrors([]);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileJson className="h-5 w-5" />
            Import Paket dari JSON
          </DialogTitle>
          <DialogDescription>
            Paste JSON dari AI untuk menambahkan banyak paket sekaligus
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {/* JSON Input */}
          {!preview && (
            <>
              <div className="space-y-1.5">
                <Label>JSON Paket</Label>
                <Textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder={EXAMPLE_JSON}
                  rows={10}
                  className="font-mono text-xs"
                />
              </div>

              {/* Template JSON */}
              <div className="rounded-lg border border-border bg-muted/50 p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium">Template JSON</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1.5"
                    onClick={handleCopyTemplate}
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3" />
                        Tersalin
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy Template
                      </>
                    )}
                  </Button>
                </div>
                <pre className="text-xs text-muted-foreground overflow-x-auto whitespace-pre">
{EXAMPLE_JSON}
                </pre>
                <div className="text-xs text-muted-foreground space-y-0.5 border-t border-border pt-2">
                  <p><code className="bg-muted px-1 rounded">name</code> &amp; <code className="bg-muted px-1 rounded">price</code> wajib, sisanya opsional</p>
                  <p><code className="bg-muted px-1 rounded">price</code> dalam angka bulat (tanpa titik/koma)</p>
                </div>
              </div>
            </>
          )}

          {/* Errors */}
          {parseErrors.length > 0 && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                <AlertCircle className="h-4 w-4" />
                {preview ? "Beberapa paket dilewati:" : "Error:"}
              </div>
              {parseErrors.map((err, i) => (
                <p key={i} className="text-xs text-destructive/80 pl-6">
                  {err}
                </p>
              ))}
            </div>
          )}

          {/* Preview */}
          {preview && preview.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                {preview.length} paket siap diimport
              </div>

              <div className="space-y-2">
                {preview.map((pkg, i) => (
                  <div key={i} className="rounded-lg border p-3 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{pkg.name}</span>
                      </div>
                      <span className="font-number font-bold text-sm">
                        {formatRupiah(pkg.price)}
                      </span>
                    </div>
                    {pkg.description && (
                      <p className="text-xs text-muted-foreground">{pkg.description}</p>
                    )}
                    {pkg.includes && pkg.includes.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {pkg.includes.map((item, j) => (
                          <Badge key={j} variant="secondary" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {pkg.excludes && pkg.excludes.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {pkg.excludes.map((item, j) => (
                          <Badge key={j} variant="outline" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {preview ? (
            <>
              <Button variant="outline" onClick={handleReset}>
                Kembali
              </Button>
              <Button onClick={handleImport} disabled={bulkCreate.isPending}>
                {bulkCreate.isPending
                  ? "Mengimport..."
                  : `Import ${preview.length} Paket`}
              </Button>
            </>
          ) : (
            <>
              <DialogClose render={<Button variant="outline">Batal</Button>} />
              <Button onClick={handleParse} disabled={!jsonInput.trim()}>
                Validasi & Preview
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
