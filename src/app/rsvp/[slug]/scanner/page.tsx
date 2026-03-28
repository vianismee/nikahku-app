"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getGuestForScanner, markSouvenirTaken, type GuestScanResult } from "@/app/actions/rsvp";
import { CheckCircle, XCircle, Camera, CameraOff, Users, Calendar, Package } from "lucide-react";

type ScanState = "idle" | "found" | "taken" | "error";

function formatDateTime(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function ScannerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [slug, setSlug] = useState("");
  const [staffName, setStaffName] = useState("");
  const [staffInput, setStaffInput] = useState("");
  const [staffSet, setStaffSet] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [guest, setGuest] = useState<GuestScanResult | null>(null);
  const [marking, setMarking] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const scannerRef = useRef<HTMLDivElement>(null);
  const scannerInstanceRef = useRef<{ stop: () => void } | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ slug: s }) => setSlug(s));
    const stored = localStorage.getItem("scanner_staff");
    if (stored) { setStaffName(stored); setStaffSet(true); }
  }, [params]);

  function handleSetStaff() {
    const name = staffInput.trim();
    if (!name) return;
    setStaffName(name);
    localStorage.setItem("scanner_staff", name);
    setStaffSet(true);
  }

  async function processNanoId(nanoId: string) {
    const clean = nanoId.trim().toUpperCase();
    if (clean.length !== 5) return;

    const result = await getGuestForScanner(slug, clean);
    if (!result) {
      setScanState("error");
      setGuest(null);
      return;
    }
    setGuest(result);
    setScanState(result.souvenir_taken ? "taken" : "found");
  }

  async function startScanner() {
    if (!scannerRef.current) return;

    // Cek getUserMedia support
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Browser ini tidak mendukung akses kamera. Gunakan input manual.");
      return;
    }

    setCameraError(null);
    setScanning(true);
    setScanState("idle");

    // Dynamic import — hindari SSR crash
    const { Html5Qrcode } = await import("html5-qrcode");

    // Pastikan container sudah punya ukuran sebelum inisialisasi
    const containerW = scannerRef.current.offsetWidth || 300;
    const qrboxSize = Math.min(Math.floor(containerW * 0.75), 250);

    const scanner = new Html5Qrcode("qr-reader", { verbose: false });
    scannerInstanceRef.current = scanner;

    const onSuccess = async (decodedText: string) => {
      try { await scanner.stop(); } catch { /* ignore */ }
      setScanning(false);
      await processNanoId(decodedText);
    };

    const config = { fps: 10, qrbox: { width: qrboxSize, height: qrboxSize } };

    // Coba kamera belakang dulu, fallback ke kamera manapun
    try {
      await scanner.start({ facingMode: "environment" }, config, onSuccess, undefined);
    } catch {
      try {
        await scanner.start({ facingMode: "user" }, config, onSuccess, undefined);
      } catch (err) {
        setScanning(false);
        const msg = err instanceof Error ? err.message : "";
        if (msg.toLowerCase().includes("permission") || msg.toLowerCase().includes("denied")) {
          setCameraError("Izin kamera ditolak. Aktifkan izin kamera di pengaturan browser.");
        } else {
          setCameraError("Tidak dapat mengakses kamera. Gunakan input manual di bawah.");
        }
        toast.error("Kamera tidak dapat dibuka");
      }
    }
  }

  function stopScanner() {
    try { scannerInstanceRef.current?.stop(); } catch { /* ignore */ }
    setScanning(false);
  }

  async function handleMarkTaken() {
    if (!guest) return;
    setMarking(true);
    const res = await markSouvenirTaken(slug, guest.nano_id, staffName);
    setMarking(false);

    if (res.alreadyTaken) {
      setScanState("taken");
      setGuest((g) => g ? { ...g, souvenir_taken: true, souvenir_taken_at: res.takenAt ?? null } : g);
      toast.warning("Souvenir sudah diambil sebelumnya");
    } else if (res.success) {
      setGuest((g) =>
        g ? { ...g, souvenir_taken: true, souvenir_taken_at: res.takenAt ?? null, souvenir_taken_by: staffName } : g
      );
      setScanState("taken");
      toast.success("Souvenir berhasil ditandai sudah diambil");
    } else {
      toast.error("Gagal memperbarui status souvenir");
    }
  }

  function handleReset() {
    setScanState("idle");
    setGuest(null);
    setManualInput("");
  }

  // ── Setup staff name ──────────────────────────────────────────────────────

  if (!staffSet) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-sm p-6 space-y-4">
          <div className="text-center space-y-1">
            <h1 className="text-lg font-bold">Scanner Souvenir</h1>
            <p className="text-sm text-muted-foreground">Masukkan nama petugas</p>
          </div>
          <Input
            placeholder="Nama petugas..."
            value={staffInput}
            onChange={(e) => setStaffInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSetStaff()}
            autoFocus
          />
          <Button onClick={handleSetStaff} className="w-full" disabled={!staffInput.trim()}>
            Mulai Scan
          </Button>
        </Card>
      </main>
    );
  }

  // ── Main scanner UI ───────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-sm mx-auto px-4 py-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-base">Scan Souvenir</h1>
            <p className="text-xs text-muted-foreground">Petugas: {staffName}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setStaffSet(false); setStaffInput(staffName); }}
          >
            Ganti
          </Button>
        </div>

        {/* Camera area */}
        <Card className="overflow-hidden">
          {/* Container harus punya height eksplisit sebelum html5-qrcode init */}
          <div
            ref={scannerRef}
            id="qr-reader"
            className="w-full bg-muted"
            style={{ minHeight: scanning ? 300 : 0 }}
          />

          {cameraError && (
            <div className="px-4 pt-3 pb-1">
              <p className="text-xs text-destructive leading-relaxed">{cameraError}</p>
            </div>
          )}

          <div className="p-4">
            {!scanning ? (
              <Button onClick={startScanner} className="w-full gap-2">
                <Camera className="w-4 h-4" />
                Buka Kamera Scan
              </Button>
            ) : (
              <Button variant="outline" onClick={stopScanner} className="w-full gap-2">
                <CameraOff className="w-4 h-4" />
                Tutup Kamera
              </Button>
            )}
          </div>
        </Card>

        {/* Manual input fallback */}
        <div className="flex gap-2">
          <Input
            placeholder="Atau ketik NanoID manual..."
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value.toUpperCase().slice(0, 5))}
            onKeyDown={(e) => e.key === "Enter" && processNanoId(manualInput)}
            className="font-mono uppercase"
            maxLength={5}
          />
          <Button
            variant="outline"
            onClick={() => processNanoId(manualInput)}
            disabled={manualInput.length < 5}
          >
            Cari
          </Button>
        </div>

        {/* Error state */}
        {scanState === "error" && (
          <Card className="p-4 border-destructive/50 bg-destructive/5 space-y-2">
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="w-5 h-5" />
              <span className="font-medium">Kode tidak ditemukan</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Pastikan NanoID valid dan RSVP aktif.
            </p>
            <Button variant="outline" size="sm" onClick={handleReset}>Scan Lagi</Button>
          </Card>
        )}

        {/* Guest card */}
        {(scanState === "found" || scanState === "taken") && guest && (
          <Card className="p-5 space-y-4">
            {/* Guest info */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-base">{guest.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">{guest.nano_id}</p>
                </div>
                <Badge variant="outline" className="shrink-0">
                  <Users className="w-3 h-3 mr-1" />
                  {guest.pax_count} orang
                </Badge>
              </div>

              {guest.sessions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {guest.sessions.map((s) => (
                    <Badge key={s} variant="secondary" className="gap-1 text-xs">
                      <Calendar className="w-3 h-3" />
                      {s}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="h-px bg-border" />

            {/* Souvenir status */}
            {scanState === "found" ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-amber-600">
                  <Package className="w-5 h-5" />
                  <span className="font-medium">Belum Ambil Souvenir</span>
                </div>
                <Button
                  onClick={handleMarkTaken}
                  disabled={marking}
                  className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
                  size="lg"
                >
                  <CheckCircle className="w-4 h-4" />
                  {marking ? "Memproses..." : "Tandai Sudah Ambil"}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Souvenir Sudah Diambil</span>
                </div>
                {guest.souvenir_taken_at && (
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(guest.souvenir_taken_at)}
                    {guest.souvenir_taken_by && ` · oleh ${guest.souvenir_taken_by}`}
                  </p>
                )}
                <Button variant="outline" size="sm" disabled className="w-full opacity-50">
                  Tandai Sudah Ambil (sudah dilakukan)
                </Button>
              </div>
            )}

            <Button variant="ghost" size="sm" onClick={handleReset} className="w-full">
              Scan Berikutnya
            </Button>
          </Card>
        )}
      </div>
    </main>
  );
}
