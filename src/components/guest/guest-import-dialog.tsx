"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCreateGuest } from "@/lib/hooks/use-guests";
import { normalizePhone } from "@/lib/utils/normalize-phone";
import { Upload, Download, AlertCircle, CheckCircle2, FileText } from "lucide-react";
import { toast } from "sonner";

type RsvpStatus =
  | "belum_diundang"
  | "undangan_terkirim"
  | "hadir"
  | "tidak_hadir"
  | "belum_konfirmasi";

const VALID_RSVP: RsvpStatus[] = [
  "belum_diundang",
  "undangan_terkirim",
  "hadir",
  "tidak_hadir",
  "belum_konfirmasi",
];

interface ParsedRow {
  nama: string;
  kategori: string;
  telepon: string;
  email: string;
  jumlah_pax: number;
  rsvp_status: RsvpStatus;
  catatan: string;
  error?: string;
}

interface GuestImportDialogProps {
  weddingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Parse a single CSV line respecting quoted fields */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCsv(text: string): ParsedRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  // Header row (normalize to lowercase, strip BOM)
  const headers = parseCsvLine(lines[0].replace(/^\uFEFF/, "")).map((h) =>
    h.toLowerCase().replace(/\s+/g, "_")
  );

  const nameIdx = headers.findIndex((h) => h === "nama");
  const catIdx = headers.findIndex((h) => h.startsWith("kategori"));
  const phoneIdx = headers.findIndex((h) => h.startsWith("telepon") || h === "no._telepon");
  const emailIdx = headers.findIndex((h) => h === "email");
  const paxIdx = headers.findIndex((h) => h.startsWith("jumlah"));
  const rsvpIdx = headers.findIndex((h) => h.startsWith("rsvp"));
  const noteIdx = headers.findIndex((h) => h.startsWith("catatan"));

  return lines.slice(1).map((line) => {
    const cols = parseCsvLine(line);
    const get = (idx: number) => (idx >= 0 ? cols[idx] ?? "" : "");

    const nama = get(nameIdx);
    if (!nama) return { nama: "", kategori: "", telepon: "", email: "", jumlah_pax: 1, rsvp_status: "belum_diundang", catatan: "", error: "Nama kosong" };

    const rawRsvp = get(rsvpIdx).toLowerCase();
    const rsvp_status: RsvpStatus = VALID_RSVP.includes(rawRsvp as RsvpStatus)
      ? (rawRsvp as RsvpStatus)
      : "belum_diundang";

    const rawPax = parseInt(get(paxIdx)) || 1;

    return {
      nama,
      kategori: get(catIdx) || "Lainnya",
      telepon: get(phoneIdx),
      email: get(emailIdx),
      jumlah_pax: Math.max(1, rawPax),
      rsvp_status,
      catatan: get(noteIdx),
    };
  });
}

const TEMPLATE_CSV = `nama,kategori,telepon,email,jumlah_pax,rsvp_status,catatan
Budi Santoso,Keluarga,081234567890,budi@email.com,2,belum_diundang,
Sari Dewi,Teman,082345678901,,1,belum_diundang,Teman SMA
Andi Rahman,Kantor,083456789012,andi@kantor.com,2,belum_diundang,
Rina Kusuma,Tetangga,,,1,belum_diundang,RT 03
`;

export function GuestImportDialog({
  weddingId,
  open,
  onOpenChange,
}: GuestImportDialogProps) {
  const createGuest = useCreateGuest();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [parsed, setParsed] = useState<ParsedRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [fileName, setFileName] = useState("");

  function downloadTemplate() {
    const blob = new Blob([TEMPLATE_CSV], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template-tamu-nikahku.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const rows = parseCsv(text);
      setParsed(rows);
    };
    reader.readAsText(file, "UTF-8");
  }

  async function handleImport() {
    const validRows = parsed.filter((r) => !r.error && r.nama);
    if (validRows.length === 0) {
      toast.error("Tidak ada data valid untuk diimport");
      return;
    }

    setImporting(true);
    let successCount = 0;
    let errorCount = 0;

    for (const row of validRows) {
      try {
        await createGuest.mutateAsync({
          wedding_id: weddingId,
          name: row.nama,
          category: row.kategori || "Lainnya",
          phone: row.telepon ? normalizePhone(row.telepon) : null,
          email: row.email || null,
          pax_count: row.jumlah_pax,
          rsvp_status: row.rsvp_status,
          notes: row.catatan || null,
        });
        successCount++;
      } catch {
        errorCount++;
      }
    }

    setImporting(false);
    if (successCount > 0) {
      toast.success(`${successCount} tamu berhasil diimport${errorCount > 0 ? `, ${errorCount} gagal` : ""}`);
      onOpenChange(false);
      setParsed([]);
      setFileName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      toast.error("Semua data gagal diimport");
    }
  }

  const validCount = parsed.filter((r) => !r.error && r.nama).length;
  const errorCount = parsed.filter((r) => !!r.error).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Tamu dari CSV</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Download template */}
          <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Template CSV</p>
                <p className="text-xs text-muted-foreground">
                  Download template lalu isi data tamu
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-1.5" />
              Download
            </Button>
          </div>

          {/* File upload */}
          <div
            className="border-2 border-dashed rounded-lg px-4 py-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm font-medium">
              {fileName ? fileName : "Klik untuk pilih file CSV"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Format: .csv (kolom: nama, kategori, telepon, email, jumlah_pax, rsvp_status, catatan)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Preview */}
          {parsed.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <p className="text-sm font-medium">Preview ({parsed.length} baris)</p>
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1 text-green-600" />
                  {validCount} valid
                </Badge>
                {errorCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errorCount} error
                  </Badge>
                )}
              </div>

              <div className="rounded-lg border overflow-hidden max-h-56 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-muted/40 sticky top-0">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium">Nama</th>
                      <th className="text-left px-3 py-2 font-medium">Kategori</th>
                      <th className="text-left px-3 py-2 font-medium">Telepon</th>
                      <th className="text-left px-3 py-2 font-medium">Pax</th>
                      <th className="text-left px-3 py-2 font-medium">Status</th>
                      <th className="text-left px-3 py-2 font-medium" />
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.map((row, i) => (
                      <tr
                        key={i}
                        className={`border-t ${row.error ? "bg-destructive/5" : ""}`}
                      >
                        <td className="px-3 py-2">{row.nama || <em className="text-muted-foreground">kosong</em>}</td>
                        <td className="px-3 py-2">{row.kategori}</td>
                        <td className="px-3 py-2 font-number">{row.telepon || "-"}</td>
                        <td className="px-3 py-2 font-number">{row.jumlah_pax}</td>
                        <td className="px-3 py-2">{row.rsvp_status}</td>
                        <td className="px-3 py-2">
                          {row.error ? (
                            <span className="text-destructive flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {row.error}
                            </span>
                          ) : (
                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline">Batal</Button>} />
          <Button
            onClick={handleImport}
            disabled={validCount === 0 || importing}
          >
            {importing ? "Mengimport..." : `Import ${validCount} Tamu`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
