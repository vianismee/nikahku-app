"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  lookupGuestByNanoId,
  updateGuestRsvpPublic,
  type GuestPublic,
} from "@/app/actions/rsvp";
import { CheckCircle, XCircle, Calendar, MapPin, Clock, Users } from "lucide-react";

function formatDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function formatTime(t: string | null) {
  if (!t) return "";
  return t.slice(0, 5);
}

type Step = "input" | "confirm" | "done";

export default function RsvpPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ embed?: string }>;
}) {
  const [slug, setSlug] = useState("");
  const [isEmbed, setIsEmbed] = useState(false);
  const [step, setStep] = useState<Step>("input");
  const [chars, setChars] = useState(["", "", "", "", ""]);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [guest, setGuest] = useState<GuestPublic | null>(null);
  const [rsvpStatus, setRsvpStatus] = useState<"hadir" | "tidak_hadir">("hadir");
  const [pax, setPax] = useState(1);
  const [maxPax, setMaxPax] = useState(5);
  const [submitLoading, setSubmitLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    Promise.all([params, searchParams]).then(([p, sp]) => {
      setSlug(p.slug);
      setIsEmbed(sp.embed === "true");
    });
  }, [params, searchParams]);

  function handleCharChange(idx: number, val: string) {
    const char = val.toUpperCase().replace(/[^0-9A-Z]/g, "").slice(-1);
    const next = [...chars];
    next[idx] = char;
    setChars(next);
    setLookupError("");
    if (char && idx < 4) inputRefs.current[idx + 1]?.focus();
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !chars[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  }

  async function handleLookup() {
    const nanoId = chars.join("");
    if (nanoId.length < 5) { setLookupError("Masukkan 5 karakter kode undangan"); return; }
    setLookupLoading(true);
    setLookupError("");
    const found = await lookupGuestByNanoId(slug, nanoId);
    setLookupLoading(false);
    if (!found) {
      setLookupError("Kode tidak ditemukan. Periksa kembali atau hubungi pengantin.");
      return;
    }
    setGuest(found);
    setRsvpStatus(found.rsvp_status === "hadir" ? "hadir" : "tidak_hadir");
    setPax(found.pax_count);
    setMaxPax(5); // will use from wedding config if needed
    setStep("confirm");
  }

  async function handleConfirm() {
    if (!guest) return;
    setSubmitLoading(true);
    const res = await updateGuestRsvpPublic(slug, guest.nano_id, {
      rsvp_status: rsvpStatus,
      pax_count: rsvpStatus === "hadir" ? pax : 1,
    });
    setSubmitLoading(false);
    if (res.success) {
      setGuest({ ...guest, rsvp_status: rsvpStatus, pax_count: pax });
      setStep("done");
    } else {
      toast.error(res.error ?? "Gagal menyimpan");
    }
  }

  const embedClass = isEmbed ? "py-4 px-3" : "min-h-screen py-10 px-4";

  return (
    <main className={`bg-background ${embedClass}`}>
      <div className="max-w-sm mx-auto space-y-5">
        {!isEmbed && (
          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold">Konfirmasi Kehadiran</h1>
            <p className="text-sm text-muted-foreground">
              Masukkan kode undangan Anda untuk konfirmasi
            </p>
          </div>
        )}

        {/* Step 1: Input NanoID */}
        {step === "input" && (
          <Card className="p-5 space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Kode Undangan Anda</p>
              <p className="text-xs text-muted-foreground">
                5 karakter dari undangan Anda
              </p>
            </div>

            <div className="flex gap-2 justify-center">
              {chars.map((c, i) => (
                <Input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  value={c}
                  onChange={(e) => handleCharChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-11 h-11 text-center text-base font-mono font-bold uppercase"
                  maxLength={1}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            {lookupError && (
              <p className="text-xs text-destructive text-center">{lookupError}</p>
            )}

            <Button onClick={handleLookup} disabled={lookupLoading} className="w-full">
              {lookupLoading ? "Mencari..." : "Cari Data Saya"}
            </Button>
          </Card>
        )}

        {/* Step 2: Konfirmasi */}
        {step === "confirm" && guest && (
          <Card className="p-5 space-y-4">
            <div className="space-y-0.5">
              <p className="text-sm text-muted-foreground">Halo,</p>
              <p className="text-lg font-bold">{guest.name}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Apakah Anda bisa hadir?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setRsvpStatus("hadir")}
                  className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    rsvpStatus === "hadir"
                      ? "bg-green-50 border-green-600 text-green-700 dark:bg-green-950 dark:text-green-400"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  ✓ Hadir
                </button>
                <button
                  onClick={() => { setRsvpStatus("tidak_hadir"); setPax(1); }}
                  className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    rsvpStatus === "tidak_hadir"
                      ? "bg-red-50 border-red-500 text-red-700 dark:bg-red-950 dark:text-red-400"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  ✗ Tidak Hadir
                </button>
              </div>
            </div>

            {rsvpStatus === "hadir" && (
              <div className="space-y-1.5">
                <p className="text-sm font-medium">Jumlah orang (termasuk Anda)</p>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={() => setPax((p) => Math.max(1, p - 1))}>−</Button>
                  <span className="w-8 text-center font-semibold">{pax}</span>
                  <Button variant="outline" size="sm" onClick={() => setPax((p) => Math.min(maxPax, p + 1))}>+</Button>
                  <span className="text-xs text-muted-foreground">maks. {maxPax}</span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleConfirm} disabled={submitLoading} className="flex-1">
                {submitLoading ? "Menyimpan..." : "Konfirmasi"}
              </Button>
              <Button variant="outline" onClick={() => { setStep("input"); setChars(["","","","",""]); }}>
                Kembali
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Sukses + Info Sesi */}
        {step === "done" && guest && (
          <Card className="p-5 space-y-4">
            <div className="text-center space-y-2">
              {rsvpStatus === "hadir" ? (
                <CheckCircle className="w-10 h-10 text-green-600 mx-auto" />
              ) : (
                <XCircle className="w-10 h-10 text-muted-foreground mx-auto" />
              )}
              <div>
                <p className="font-bold">Terima kasih, {guest.name}!</p>
                <p className="text-sm text-muted-foreground">
                  {rsvpStatus === "hadir"
                    ? `Kami catat kehadiran Anda untuk ${pax} orang.`
                    : "Konfirmasi ketidakhadiran Anda telah kami catat."}
                </p>
              </div>
            </div>

            {rsvpStatus === "hadir" && guest.sessions.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Detail Acara Anda
                </p>
                {guest.sessions.map((s) => (
                  <div key={s.id} className="bg-muted/50 rounded-lg p-3 space-y-1 text-sm">
                    <div className="font-medium flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {s.name}
                    </div>
                    {s.session_date && (
                      <div className="text-xs text-muted-foreground">{formatDate(s.session_date)}</div>
                    )}
                    {s.time_start && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(s.time_start)}{s.time_end ? `–${formatTime(s.time_end)}` : ""} WIB
                      </div>
                    )}
                    {s.venue && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {s.venue}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <Button variant="outline" size="sm" className="w-full" onClick={() => setStep("input")}>
              Kode Lain
            </Button>
          </Card>
        )}

        {!isEmbed && (
          <p className="text-center text-xs text-muted-foreground">
            Powered by NIKAHKU
          </p>
        )}
      </div>
    </main>
  );
}
