"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import {
  lookupGuestByNanoId,
  updateGuestRsvpPublic,
  getExistingWish,
  submitWish,
  updateWish,
  getWishes,
  type GuestPublic,
  type WishPublic,
} from "@/app/actions/rsvp";
import {
  getInvitation,
  type InvitationWithSessions,
} from "@/app/actions/invitation";
import { loadGoogleFont, getFontStack } from "@/lib/utils/google-fonts";
import {
  QrCode,
  Users,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Heart,
  Pencil,
  Send,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  Copy,
  AtSign,
  ExternalLink,
} from "lucide-react";
import QRCode from "qrcode";
import { useTheme } from "next-themes";

// ─── Types ────────────────────────────────────────────────────────────────────

interface InvitationExtra {
  groom_instagram?: string;
  bride_instagram?: string;
  venue_name?: string;
  venue_address?: string;
  venue_maps_url?: string;
  gift_accounts?: Array<{
    id: string;
    bank: string;
    account_number: string;
    account_name: string;
  }>;
  font_body?: "dmsans" | "serif";
  ayat_source?: string;
  font_heading_name?: string; // custom Google Font for heading
  font_body_name?: string;    // custom Google Font for body
}

interface TemplateConfig {
  bg: string;
  coverBg: string;
  coverTextColor: string;
  sectionBg: string;
  altSectionBg: string;
  headingFont: string;
  bodyFont: string;
  accentColor: string;
  ornamentStyle: "classic" | "modern" | "rustic";
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateShort(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(t: string | null) {
  if (!t) return "";
  return t.slice(0, 5);
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam lalu`;
  return `${Math.floor(hrs / 24)} hari lalu`;
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

function buildTemplateConfig(
  template: string,
  themeColor: string,
  fontHeading: string,
  extra: InvitationExtra
): TemplateConfig {
  const headingFontMap: Record<string, string> = {
    playfair: "var(--font-playfair-display)",
    cormorant: "var(--font-instrument-serif)",
    montserrat: "var(--font-dm-sans)",
  };
  // Prefer custom Google Font name if set, otherwise fall back to legacy mapping
  const headingFont = extra.font_heading_name
    ? getFontStack(extra.font_heading_name)
    : (headingFontMap[fontHeading] ?? "var(--font-playfair-display)");
  const bodyFont = extra.font_body_name
    ? getFontStack(extra.font_body_name)
    : extra.font_body === "serif"
    ? "var(--font-instrument-serif)"
    : "var(--font-dm-sans)";

  if (template === "modern") {
    return {
      bg: "#0D0D0D",
      coverBg: "#0D0D0D",
      coverTextColor: "#FFFFFF",
      sectionBg: "#141414",
      altSectionBg: "#1A1A1A",
      headingFont,
      bodyFont,
      accentColor: themeColor,
      ornamentStyle: "modern",
    };
  }

  if (template === "rustic") {
    return {
      bg: "#F4EFE6",
      coverBg: "#E8DFD0",
      coverTextColor: "#3D2B1F",
      sectionBg: "#F4EFE6",
      altSectionBg: "#EDE5D8",
      headingFont,
      bodyFont,
      accentColor: themeColor,
      ornamentStyle: "rustic",
    };
  }

  // classic (default)
  return {
    bg: "#FAF7F2",
    coverBg: `linear-gradient(to bottom, ${themeColor}CC, ${themeColor}88)`,
    coverTextColor: "#FFFFFF",
    sectionBg: "#FAF7F2",
    altSectionBg: "#F0EBE3",
    headingFont,
    bodyFont,
    accentColor: themeColor,
    ornamentStyle: "classic",
  };
}

// ─── Ornament ─────────────────────────────────────────────────────────────────

function Ornament({
  style,
  color,
}: {
  style: "classic" | "modern" | "rustic";
  color: string;
}) {
  if (style === "modern") {
    return (
      <div className="flex items-center justify-center gap-3 py-2">
        <div className="h-px w-16" style={{ backgroundColor: `${color}60` }} />
        <div className="h-px w-16" style={{ backgroundColor: `${color}60` }} />
      </div>
    );
  }

  if (style === "rustic") {
    return (
      <div className="flex items-center justify-center gap-2 py-2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2C8 6 4 10 4 14c0 3 2 5 4 6M12 2c4 4 8 8 8 12 0 3-2 5-4 6M12 2v20"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <div className="h-px w-8" style={{ backgroundColor: `${color}50` }} />
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: `${color}80` }}
        />
        <div className="h-px w-8" style={{ backgroundColor: `${color}50` }} />
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className="scale-x-[-1]"
        >
          <path
            d="M12 2C8 6 4 10 4 14c0 3 2 5 4 6M12 2c4 4 8 8 8 12 0 3-2 5-4 6M12 2v20"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  // classic
  return (
    <div className="flex items-center justify-center gap-2 py-2">
      <div className="h-px w-10" style={{ backgroundColor: `${color}50` }} />
      <div
        className="w-1 h-1 rounded-full"
        style={{ backgroundColor: `${color}80` }}
      />
      <div
        className="w-1.5 h-1.5 rotate-45"
        style={{ backgroundColor: color }}
      />
      <div
        className="w-1 h-1 rounded-full"
        style={{ backgroundColor: `${color}80` }}
      />
      <div className="h-px w-10" style={{ backgroundColor: `${color}50` }} />
    </div>
  );
}

// ─── Countdown ────────────────────────────────────────────────────────────────

function useCountdown(targetDate: string) {
  const calc = () => {
    const now = Date.now();
    const target = new Date(targetDate).getTime();
    const diff = target - now;
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return { days, hours, minutes, seconds, done: false };
  };

  const [countdown, setCountdown] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setCountdown(calc()), 1000);
    return () => clearInterval(id);
  }, [targetDate]); // eslint-disable-line react-hooks/exhaustive-deps

  return countdown;
}

// ─── QR Section ───────────────────────────────────────────────────────────────

function QrSection({ nanoId }: { nanoId: string }) {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(nanoId, {
      width: 200,
      margin: 1,
      color: { dark: "#1a1a1a", light: "#ffffff" },
    }).then(setQrDataUrl);
  }, [nanoId]);

  return (
    <div className="border-t border-border pt-4 mt-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
      >
        <QrCode className="w-4 h-4 shrink-0" />
        <span className="flex-1 text-left">Kode QR Souvenir</span>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {open && (
        <div className="mt-4 flex flex-col items-center gap-3">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR Code" className="w-36 h-36 rounded-lg" />
          ) : (
            <Skeleton className="w-36 h-36 rounded-lg" />
          )}
          <div className="font-mono text-xl font-bold tracking-[0.3em] text-foreground">
            {nanoId}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Tunjukkan QR ini di venue untuk pengambilan souvenir
          </p>
          {qrDataUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const a = document.createElement("a");
                a.href = qrDataUrl;
                a.download = `undangan_${nanoId}.png`;
                a.click();
              }}
            >
              Download QR
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Guest Detail Card ────────────────────────────────────────────────────────

function GuestDetailCard({
  guest,
  weddingSlug,
  maxPax,
  onUpdated,
}: {
  guest: GuestPublic;
  weddingSlug: string;
  maxPax: number;
  onUpdated: (updated: Partial<GuestPublic>) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<"hadir" | "tidak_hadir">(
    guest.rsvp_status === "hadir" ? "hadir" : "tidak_hadir"
  );
  const [pax, setPax] = useState(guest.pax_count);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    const res = await updateGuestRsvpPublic(weddingSlug, guest.nano_id, {
      rsvp_status: status,
      pax_count: pax,
    });
    setLoading(false);
    if (res.success) {
      toast.success("Konfirmasi berhasil disimpan");
      onUpdated({ rsvp_status: status, pax_count: pax });
      setEditing(false);
    } else {
      toast.error(res.error ?? "Gagal menyimpan");
    }
  }

  const rsvpLabel =
    guest.rsvp_status === "hadir"
      ? "Hadir"
      : guest.rsvp_status === "tidak_hadir"
      ? "Tidak Hadir"
      : "Belum Konfirmasi";

  return (
    <Card className="overflow-hidden">
      <div className="bg-primary/8 dark:bg-primary/12 px-5 py-4 border-b border-border">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Detail Tamu</p>
            <h2 className="text-lg font-semibold leading-tight">{guest.name}</h2>
          </div>
          {guest.souvenir_taken && (
            <Badge
              variant="outline"
              className="text-green-600 border-green-600 gap-1 shrink-0 text-xs"
            >
              <CheckCircle className="w-3 h-3" />
              Souvenir
            </Badge>
          )}
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        {guest.sessions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Sesi Undangan
            </p>
            <div className="space-y-2">
              {guest.sessions.map((s) => (
                <div
                  key={s.id}
                  className="flex items-start gap-3 rounded-lg bg-muted/40 px-3 py-2.5"
                >
                  <Calendar className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div className="text-sm space-y-0.5">
                    <p className="font-medium leading-snug">{s.name}</p>
                    {s.session_date && (
                      <p className="text-muted-foreground text-xs">
                        {formatDate(s.session_date)}
                      </p>
                    )}
                    {s.time_start && (
                      <p className="text-muted-foreground text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(s.time_start)}
                        {s.time_end && `–${formatTime(s.time_end)}`} WIB
                      </p>
                    )}
                    {s.venue && (
                      <p className="text-muted-foreground text-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {s.venue}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Konfirmasi Kehadiran
            </p>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <Pencil className="w-3 h-3" />
                Ubah
              </button>
            )}
          </div>

          {!editing ? (
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                  guest.rsvp_status === "hadir"
                    ? "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                    : guest.rsvp_status === "tidak_hadir"
                    ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                    : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                }`}
              >
                {guest.rsvp_status === "hadir" ? (
                  <CheckCircle className="w-4 h-4" />
                ) : guest.rsvp_status === "tidak_hadir" ? (
                  <XCircle className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
                {rsvpLabel}
              </div>
              {guest.rsvp_status === "hadir" && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {guest.pax_count} orang
                </span>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-3">
                <button
                  onClick={() => setStatus("hadir")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    status === "hadir"
                      ? "bg-green-50 border-green-600 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  Hadir
                </button>
                <button
                  onClick={() => {
                    setStatus("tidak_hadir");
                    setPax(1);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    status === "tidak_hadir"
                      ? "bg-red-50 border-red-500 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  <XCircle className="w-4 h-4" />
                  Tidak Hadir
                </button>
              </div>

              {status === "hadir" && (
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Jumlah Tamu (termasuk Anda)
                  </p>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-9 h-9 p-0 text-base"
                      onClick={() => setPax((p) => Math.max(1, p - 1))}
                    >
                      −
                    </Button>
                    <span className="w-8 text-center text-lg font-bold tabular-nums">
                      {pax}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-9 h-9 p-0 text-base"
                      onClick={() => setPax((p) => Math.min(maxPax, p + 1))}
                    >
                      +
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      maks. {maxPax} orang
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1"
                  size="sm"
                >
                  {loading ? "Menyimpan..." : "Simpan Konfirmasi"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditing(false);
                    setStatus(guest.rsvp_status === "hadir" ? "hadir" : "tidak_hadir");
                    setPax(guest.pax_count);
                  }}
                >
                  Batal
                </Button>
              </div>
            </div>
          )}
        </div>

        <QrSection nanoId={guest.nano_id} />
      </div>
    </Card>
  );
}

// ─── Wishes Feed ─────────────────────────────────────────────────────────────

function WishesFeed({
  weddingId,
  initialWishes,
  guest,
  existingWish,
  accentColor,
}: {
  weddingId: string;
  initialWishes: WishPublic[];
  guest: GuestPublic | null;
  existingWish: WishPublic | null;
  accentColor: string;
}) {
  const [wishes, setWishes] = useState<WishPublic[]>(initialWishes);
  const [message, setMessage] = useState(existingWish?.message ?? "");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [myWish, setMyWish] = useState<WishPublic | null>(existingWish);
  const channelRef = useRef<ReturnType<
    ReturnType<typeof createClient>["channel"]
  > | null>(null);

  useEffect(() => {
    const supabase = createClient();
    channelRef.current = supabase
      .channel(`wishes:${weddingId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "wishes",
          filter: `wedding_id=eq.${weddingId}`,
        },
        (payload) => {
          const w = payload.new as WishPublic;
          if (w.is_visible !== false) {
            setWishes((prev) => [w, ...prev]);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "wishes",
          filter: `wedding_id=eq.${weddingId}`,
        },
        (payload) => {
          const w = payload.new as WishPublic;
          setWishes((prev) =>
            prev.map((x) => (x.id === w.id ? (w.is_visible ? w : x) : x))
          );
          if (myWish?.id === w.id) setMyWish(w);
        }
      )
      .subscribe();

    return () => {
      channelRef.current?.unsubscribe();
    };
  }, [weddingId, myWish?.id]);

  async function handleSubmit() {
    if (!guest || !message.trim()) return;
    setLoading(true);

    if (myWish) {
      const res = await updateWish(myWish.id, guest.id, message);
      if (res.success) {
        toast.success("Ucapan berhasil diperbarui");
        setMyWish({ ...myWish, message, updated_at: new Date().toISOString() });
        setEditMode(false);
      } else {
        toast.error(res.error ?? "Gagal memperbarui ucapan");
      }
    } else {
      const res = await submitWish(weddingId, guest.id, guest.name, message);
      if (res.success) {
        toast.success("Ucapan terkirim!");
        setEditMode(false);
      } else {
        toast.error(res.error ?? "Gagal mengirim ucapan");
      }
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <h3
        className="font-semibold text-lg flex items-center gap-2"
        style={{ color: accentColor }}
      >
        <Heart className="w-5 h-5" />
        Ucapan &amp; Doa
      </h3>

      {guest ? (
        <Card className="p-4 space-y-3">
          {myWish && !editMode ? (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Ucapan Anda:</p>
              <p className="text-sm">{myWish.message}</p>
              <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                <Pencil className="w-3.5 h-3.5 mr-1.5" />
                Edit Ucapan
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium">
                {myWish
                  ? "Edit ucapan Anda"
                  : `Kirim ucapan sebagai ${guest.name}`}
              </p>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                placeholder="Tulis ucapan dan doa untuk pengantin..."
                rows={3}
                className="resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {message.length}/500
                </span>
                <div className="flex gap-2">
                  {myWish && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditMode(false);
                        setMessage(myWish.message);
                      }}
                    >
                      Batal
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={loading || !message.trim()}
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    {loading ? "Mengirim..." : myWish ? "Simpan" : "Kirim Ucapan"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-2">
          Masukkan kode undangan di atas untuk mengirim ucapan
        </p>
      )}

      <div className="space-y-3">
        {wishes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Belum ada ucapan. Jadilah yang pertama!
          </p>
        ) : (
          wishes.map((w) => (
            <Card key={w.id} className="p-4 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold">{w.guest_name}</span>
                <span className="text-xs text-muted-foreground">
                  {timeAgo(w.created_at)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {w.message}
              </p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// ─── NanoID Input ─────────────────────────────────────────────────────────────

function NanoIdInput({
  onFound,
  weddingSlug,
  accentColor,
}: {
  onFound: (guest: GuestPublic) => void;
  weddingSlug: string;
  accentColor: string;
}) {
  const [chars, setChars] = useState(["", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(idx: number, val: string) {
    const char = val
      .toUpperCase()
      .replace(/[^0-9A-Z]/g, "")
      .slice(-1);
    const next = [...chars];
    next[idx] = char;
    setChars(next);
    setError("");
    if (char && idx < 4) inputRefs.current[idx + 1]?.focus();
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !chars[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  }

  async function handleLookup() {
    const nanoId = chars.join("");
    if (nanoId.length < 5) {
      setError("Masukkan 5 karakter kode undangan");
      return;
    }
    setLoading(true);
    setError("");
    const guest = await lookupGuestByNanoId(weddingSlug, nanoId);
    setLoading(false);
    if (guest) {
      onFound(guest);
    } else {
      setError("Kode tidak ditemukan. Periksa kembali atau hubungi pengantin.");
    }
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-1">
        <h3 className="font-semibold text-base">Masukkan Kode Undangan</h3>
        <p className="text-sm text-muted-foreground">
          Kode 5 karakter tercantum di undangan Anda
        </p>
      </div>

      <div className="flex gap-2 justify-center">
        {chars.map((c, i) => (
          <Input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            value={c}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-12 h-12 text-center text-lg font-mono font-bold uppercase"
            maxLength={1}
          />
        ))}
      </div>

      {error && <p className="text-sm text-destructive text-center">{error}</p>}

      <Button
        onClick={handleLookup}
        disabled={loading}
        className="w-full"
        style={{ backgroundColor: accentColor, borderColor: accentColor }}
      >
        {loading ? "Mencari..." : "Cari Data Saya"}
      </Button>
    </Card>
  );
}

// ─── Theme Toggle ─────────────────────────────────────────────────────────────

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="fixed top-4 right-4 z-50 rounded-full w-9 h-9 flex items-center justify-center bg-background/80 backdrop-blur border border-border shadow-sm hover:bg-muted transition-colors"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-slate-600" />
      )}
    </button>
  );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────

function Section({
  children,
  bg,
  className = "",
}: {
  children: React.ReactNode;
  bg?: string;
  className?: string;
}) {
  return (
    <section
      className={`w-full py-16 px-4 ${className}`}
      style={bg ? { backgroundColor: bg } : undefined}
    >
      <div className="max-w-md mx-auto">{children}</div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [slug, setSlug] = useState("");
  const [invitation, setInvitation] = useState<InvitationWithSessions | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [guest, setGuest] = useState<GuestPublic | null>(null);
  const [existingWish, setExistingWish] = useState<WishPublic | null>(null);
  const [wishes, setWishes] = useState<WishPublic[]>([]);

  // Load custom Google Fonts when invitation data is available
  useEffect(() => {
    if (!invitation) return;
    let extra: InvitationExtra = {};
    try {
      extra = JSON.parse(invitation.love_story_text || "{}");
    } catch { /* ignore */ }
    if (extra.font_heading_name) loadGoogleFont(extra.font_heading_name);
    if (extra.font_body_name) loadGoogleFont(extra.font_body_name);
  }, [invitation]);

  useEffect(() => {
    params.then(async ({ slug: s }) => {
      setSlug(s);
      const inv = await getInvitation(s);
      if (!inv) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setInvitation(inv);

      let guestLoaded = false;

      const stored = sessionStorage.getItem(`guest_${s}`);
      if (stored) {
        try {
          const g = JSON.parse(stored) as GuestPublic;
          setGuest(g);
          guestLoaded = true;
          const w = await getExistingWish(inv.wedding.id, g.id);
          setExistingWish(w);
        } catch {
          /* ignore */
        }
      }

      if (!guestLoaded) {
        const urlId = new URLSearchParams(window.location.search).get("id");
        if (urlId && urlId.length === 5) {
          const g = await lookupGuestByNanoId(s, urlId.toUpperCase());
          if (g) {
            setGuest(g);
            sessionStorage.setItem(`guest_${s}`, JSON.stringify(g));
            const w = await getExistingWish(inv.wedding.id, g.id);
            setExistingWish(w);
          }
        }
      }

      const ws = await getWishes(inv.wedding.id);
      setWishes(ws);
      setLoading(false);
    });
  }, [params]);

  async function handleGuestFound(g: GuestPublic) {
    setGuest(g);
    sessionStorage.setItem(`guest_${slug}`, JSON.stringify(g));
    if (invitation) {
      const w = await getExistingWish(invitation.wedding.id, g.id);
      setExistingWish(w);
    }
    toast.success(`Halo, ${g.name}! Data Anda ditemukan.`);
  }

  // ─── Loading ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-3 w-full max-w-md px-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (notFound || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-center">
        <div className="space-y-2">
          <p className="text-lg font-semibold">Undangan tidak ditemukan</p>
          <p className="text-sm text-muted-foreground">
            Periksa kembali link undangan Anda
          </p>
        </div>
      </div>
    );
  }

  // ─── Compute config ────────────────────────────────────────────────────────

  let extra: InvitationExtra = {};
  try {
    extra = JSON.parse(invitation.love_story_text || "{}");
  } catch {
    extra = {};
  }

  const { wedding } = invitation;
  const themeColor = invitation.theme_color ?? "#8B6F4E";
  const cfg = buildTemplateConfig(
    invitation.template ?? "classic",
    themeColor,
    invitation.font_heading ?? "playfair",
    extra
  );

  const groomName =
    invitation.groom_nickname ||
    wedding.partner_1_name;
  const brideName =
    invitation.bride_nickname ||
    wedding.partner_2_name;

  const hasGallery = invitation.gallery_urls && invitation.gallery_urls.length > 0;
  const hasGift = (extra.gift_accounts?.length ?? 0) > 0;

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      data-inv-template={invitation.template ?? "classic"}
      style={{
        fontFamily: cfg.bodyFont,
        backgroundColor: cfg.bg,
      }}
    >
      <ThemeToggle />

      {/* ══════════════════════════ 1. COVER ════════════════════════════════ */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
        style={{
          background: cfg.coverBg,
          color: cfg.coverTextColor,
        }}
      >
        {/* Subtle dot pattern overlay */}
        {(invitation.template ?? "classic") === "classic" && (
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle, ${cfg.coverTextColor} 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />
        )}

        <div className="relative z-10 space-y-4 max-w-sm">
          {/* Bismillah */}
          <p
            className="text-lg"
            style={{
              fontFamily: "var(--font-instrument-serif)",
              direction: "rtl",
              opacity: 0.9,
            }}
          >
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
          </p>

          <Ornament style={cfg.ornamentStyle} color={cfg.coverTextColor} />

          <p
            className="text-xs uppercase tracking-[0.3em] mt-3"
            style={{ opacity: 0.75 }}
          >
            Undangan Pernikahan
          </p>

          {/* Couple names */}
          <div>
            <h1
              className="text-4xl sm:text-5xl leading-tight"
              style={{ fontFamily: cfg.headingFont }}
            >
              {groomName}
            </h1>
            <p
              className="text-2xl my-1"
              style={{ fontFamily: cfg.headingFont, color: `rgba(${hexToRgb(cfg.coverTextColor)}, 0.7)` }}
            >
              &amp;
            </p>
            <h1
              className="text-4xl sm:text-5xl leading-tight"
              style={{ fontFamily: cfg.headingFont }}
            >
              {brideName}
            </h1>
          </div>

          <Ornament style={cfg.ornamentStyle} color={cfg.coverTextColor} />

          {wedding.wedding_date && (
            <p
              className="text-sm tracking-wider"
              style={{ opacity: 0.85 }}
            >
              {formatDate(wedding.wedding_date)}
            </p>
          )}

          {wedding.venue_city && (
            <p
              className="text-xs flex items-center justify-center gap-1"
              style={{ opacity: 0.7 }}
            >
              <MapPin className="w-3 h-3" />
              {wedding.venue_city}
            </p>
          )}
        </div>

        {/* Scroll chevron */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown
            className="w-6 h-6"
            style={{ color: cfg.coverTextColor, opacity: 0.6 }}
          />
        </div>
      </section>

      {/* ══════════════════════════ 2. AYAT ═════════════════════════════════ */}
      {invitation.opening_text && (
        <section
          className="py-20 px-6 text-center"
          style={{ backgroundColor: cfg.altSectionBg }}
        >
          <div className="max-w-md mx-auto space-y-6">
            <Ornament style={cfg.ornamentStyle} color={themeColor} />
            <p
              className="text-5xl leading-none select-none"
              style={{ color: themeColor, opacity: 0.3 }}
            >
              &ldquo;
            </p>
            <p
              className="text-base sm:text-lg leading-relaxed italic"
              style={{
                fontFamily: cfg.headingFont,
                color: cfg.ornamentStyle === "modern" ? "#FFFFFF" : "#3D2B1F",
              }}
            >
              {invitation.opening_text}
            </p>
            {extra.ayat_source && (
              <p
                className="text-sm"
                style={{ color: themeColor, opacity: 0.8 }}
              >
                &mdash; {extra.ayat_source}
              </p>
            )}
            <Ornament style={cfg.ornamentStyle} color={themeColor} />
          </div>
        </section>
      )}

      {/* ══════════════════════════ 3. COUPLE INFO ══════════════════════════ */}
      <section
        className="py-20 px-6"
        style={{ backgroundColor: cfg.sectionBg }}
      >
        <div className="max-w-md mx-auto">
          <p
            className="text-center text-xs uppercase tracking-[0.25em] mb-10"
            style={{ color: themeColor }}
          >
            Mempelai
          </p>

          <div className="grid grid-cols-1 gap-8">
            {/* Groom */}
            <div className="text-center space-y-2">
              <h2
                className="text-2xl sm:text-3xl"
                style={{ fontFamily: cfg.headingFont, color: themeColor }}
              >
                {invitation.groom_full_name || groomName}
              </h2>
              {invitation.groom_parents && (
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color:
                      cfg.ornamentStyle === "modern"
                        ? "rgba(255,255,255,0.65)"
                        : "#6B5C3E",
                  }}
                >
                  {invitation.groom_parents}
                </p>
              )}
              {extra.groom_instagram && (
                <a
                  href={`https://instagram.com/${extra.groom_instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs hover:underline"
                  style={{ color: themeColor }}
                >
                  <AtSign className="w-3.5 h-3.5" />
                  {extra.groom_instagram.startsWith("@")
                    ? extra.groom_instagram
                    : `@${extra.groom_instagram}`}
                </a>
              )}
            </div>

            {/* Separator */}
            <div className="flex items-center justify-center">
              <p
                className="text-4xl"
                style={{
                  fontFamily: cfg.headingFont,
                  color: themeColor,
                  opacity: 0.5,
                }}
              >
                &amp;
              </p>
            </div>

            {/* Bride */}
            <div className="text-center space-y-2">
              <h2
                className="text-2xl sm:text-3xl"
                style={{ fontFamily: cfg.headingFont, color: themeColor }}
              >
                {invitation.bride_full_name || brideName}
              </h2>
              {invitation.bride_parents && (
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color:
                      cfg.ornamentStyle === "modern"
                        ? "rgba(255,255,255,0.65)"
                        : "#6B5C3E",
                  }}
                >
                  {invitation.bride_parents}
                </p>
              )}
              {extra.bride_instagram && (
                <a
                  href={`https://instagram.com/${extra.bride_instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs hover:underline"
                  style={{ color: themeColor }}
                >
                  <AtSign className="w-3.5 h-3.5" />
                  {extra.bride_instagram.startsWith("@")
                    ? extra.bride_instagram
                    : `@${extra.bride_instagram}`}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ 4. COUNTDOWN ════════════════════════════ */}
      <CountdownSection
        weddingDate={wedding.wedding_date}
        themeColor={themeColor}
        cfg={cfg}
      />

      {/* ══════════════════════════ 5. ACARA ════════════════════════════════ */}
      {invitation.sessions.length > 0 && (
        <section
          className="py-20 px-6"
          style={{ backgroundColor: cfg.altSectionBg }}
        >
          <div className="max-w-md mx-auto space-y-8">
            <div className="text-center space-y-2">
              <p
                className="text-xs uppercase tracking-[0.25em]"
                style={{ color: themeColor }}
              >
                Rangkaian Acara
              </p>
              <Ornament style={cfg.ornamentStyle} color={themeColor} />
            </div>

            <div className="relative space-y-6 pl-8">
              {/* Timeline line */}
              <div
                className="absolute left-3 top-2 bottom-2 w-px"
                style={{ backgroundColor: `${themeColor}30` }}
              />

              {invitation.sessions.map((s) => (
                <div key={s.id} className="relative">
                  {/* Timeline dot */}
                  <div
                    className="absolute -left-8 top-1 w-3 h-3 rounded-full border-2 bg-white"
                    style={{ borderColor: themeColor }}
                  />
                  <div className="space-y-1">
                    <h3
                      className="text-base font-semibold"
                      style={{
                        fontFamily: cfg.headingFont,
                        color:
                          cfg.ornamentStyle === "modern" ? "#FFFFFF" : "#2D1F14",
                      }}
                    >
                      {s.name}
                    </h3>
                    {s.session_date && (
                      <p
                        className="text-sm flex items-center gap-1.5"
                        style={{
                          color:
                            cfg.ornamentStyle === "modern"
                              ? "rgba(255,255,255,0.6)"
                              : "#6B5C3E",
                        }}
                      >
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        {formatDateShort(s.session_date)}
                      </p>
                    )}
                    {s.time_start && (
                      <p
                        className="text-sm flex items-center gap-1.5"
                        style={{
                          color:
                            cfg.ornamentStyle === "modern"
                              ? "rgba(255,255,255,0.6)"
                              : "#6B5C3E",
                        }}
                      >
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        {formatTime(s.time_start)}
                        {s.time_end ? ` – ${formatTime(s.time_end)}` : ""} WIB
                      </p>
                    )}
                    {s.venue && (
                      <p
                        className="text-sm flex items-center gap-1.5"
                        style={{
                          color:
                            cfg.ornamentStyle === "modern"
                              ? "rgba(255,255,255,0.6)"
                              : "#6B5C3E",
                        }}
                      >
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        {s.venue}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════ 6. LOCATION ═════════════════════════════ */}
      {(extra.venue_name || extra.venue_address) && (
        <section
          className="py-20 px-6"
          style={{ backgroundColor: cfg.sectionBg }}
        >
          <div className="max-w-md mx-auto space-y-6 text-center">
            <div className="space-y-2">
              <p
                className="text-xs uppercase tracking-[0.25em]"
                style={{ color: themeColor }}
              >
                Lokasi
              </p>
              <Ornament style={cfg.ornamentStyle} color={themeColor} />
            </div>

            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto"
              style={{ backgroundColor: `${themeColor}20` }}
            >
              <MapPin className="w-7 h-7" style={{ color: themeColor }} />
            </div>

            {extra.venue_name && (
              <h2
                className="text-2xl sm:text-3xl"
                style={{
                  fontFamily: cfg.headingFont,
                  color:
                    cfg.ornamentStyle === "modern" ? "#FFFFFF" : "#2D1F14",
                }}
              >
                {extra.venue_name}
              </h2>
            )}
            {extra.venue_address && (
              <p
                className="text-sm leading-relaxed"
                style={{
                  color:
                    cfg.ornamentStyle === "modern"
                      ? "rgba(255,255,255,0.65)"
                      : "#6B5C3E",
                }}
              >
                {extra.venue_address}
              </p>
            )}
            {wedding.venue_city && (
              <p
                className="text-sm font-medium"
                style={{
                  color:
                    cfg.ornamentStyle === "modern"
                      ? "rgba(255,255,255,0.5)"
                      : "#8B7355",
                }}
              >
                {wedding.venue_city}
              </p>
            )}

            <a
              href={
                extra.venue_maps_url ||
                `https://maps.google.com/?q=${encodeURIComponent(
                  [extra.venue_name, extra.venue_address, wedding.venue_city]
                    .filter(Boolean)
                    .join(", ")
                )}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-opacity hover:opacity-80"
              style={{
                backgroundColor: themeColor,
                color: "#FFFFFF",
              }}
            >
              <ExternalLink className="w-4 h-4" />
              Buka Google Maps
            </a>
          </div>
        </section>
      )}

      {/* ══════════════════════════ 7. GALLERY ══════════════════════════════ */}
      {hasGallery && (
        <section
          className="py-16 px-4"
          style={{ backgroundColor: cfg.altSectionBg }}
        >
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center space-y-2">
              <p
                className="text-xs uppercase tracking-[0.25em]"
                style={{ color: themeColor }}
              >
                Galeri
              </p>
              <Ornament style={cfg.ornamentStyle} color={themeColor} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {invitation.gallery_urls.map((url, i) => (
                <div
                  key={i}
                  className="aspect-square overflow-hidden rounded-lg"
                >
                  <img
                    src={url}
                    alt={`Galeri ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════ 8. RSVP ═════════════════════════════════ */}
      {invitation.show_rsvp && wedding.rsvp_enabled && (
        <section
          className="py-16 px-4"
          style={{ backgroundColor: cfg.sectionBg }}
        >
          <div className="max-w-md mx-auto space-y-4">
            <div className="text-center space-y-2 mb-6">
              <p
                className="text-xs uppercase tracking-[0.25em]"
                style={{ color: themeColor }}
              >
                Konfirmasi Kehadiran
              </p>
              <Ornament style={cfg.ornamentStyle} color={themeColor} />
            </div>

            {guest ? (
              <GuestDetailCard
                guest={guest}
                weddingSlug={slug}
                maxPax={wedding.rsvp_max_pax_per_guest}
                onUpdated={(updated) =>
                  setGuest((g) => (g ? { ...g, ...updated } : g))
                }
              />
            ) : (
              <NanoIdInput
                onFound={handleGuestFound}
                weddingSlug={slug}
                accentColor={themeColor}
              />
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════════ 9. WISHES ═══════════════════════════════ */}
      {invitation.show_wishes && (
        <section
          className="py-16 px-4"
          style={{ backgroundColor: cfg.altSectionBg }}
        >
          <div className="max-w-md mx-auto">
            <div className="text-center space-y-2 mb-6">
              <Ornament style={cfg.ornamentStyle} color={themeColor} />
            </div>
            <WishesFeed
              weddingId={wedding.id}
              initialWishes={wishes}
              guest={guest}
              existingWish={existingWish}
              accentColor={themeColor}
            />
          </div>
        </section>
      )}

      {/* ══════════════════════════ 10. GIFT ════════════════════════════════ */}
      {hasGift && (
        <section
          className="py-16 px-4"
          style={{ backgroundColor: cfg.sectionBg }}
        >
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center space-y-2">
              <p
                className="text-xs uppercase tracking-[0.25em]"
                style={{ color: themeColor }}
              >
                Hadiah Digital
              </p>
              <Ornament style={cfg.ornamentStyle} color={themeColor} />
            </div>

            <p
              className="text-sm text-center leading-relaxed"
              style={{
                color:
                  cfg.ornamentStyle === "modern"
                    ? "rgba(255,255,255,0.6)"
                    : "#7A6553",
              }}
            >
              Doa restu Anda merupakan karunia yang terindah bagi kami. Namun
              jika ingin memberikan hadiah, berikut informasi rekeningnya.
            </p>

            <div className="space-y-3">
              {extra.gift_accounts!.map((account) => (
                <div
                  key={account.id}
                  className="rounded-xl p-5 border"
                  style={{
                    borderColor: `${themeColor}30`,
                    backgroundColor:
                      cfg.ornamentStyle === "modern" ? "#1A1A1A" : "#FFFDF8",
                  }}
                >
                  <p
                    className="text-xs font-semibold uppercase tracking-wider mb-3"
                    style={{ color: themeColor }}
                  >
                    {account.bank}
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <p
                      className="font-mono text-2xl font-bold tracking-widest"
                      style={{
                        color:
                          cfg.ornamentStyle === "modern" ? "#FFFFFF" : "#2D1F14",
                      }}
                    >
                      {account.account_number}
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(account.account_number);
                        toast.success("Nomor rekening disalin!");
                      }}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-opacity hover:opacity-70"
                      style={{
                        borderColor: `${themeColor}50`,
                        color: themeColor,
                      }}
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Salin
                    </button>
                  </div>
                  <p
                    className="text-sm mt-1"
                    style={{
                      color:
                        cfg.ornamentStyle === "modern"
                          ? "rgba(255,255,255,0.5)"
                          : "#8B7355",
                    }}
                  >
                    a.n. {account.account_name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════ 11. CLOSING ═════════════════════════════ */}
      <section
        className="py-20 px-6 text-center"
        style={{
          backgroundColor: cfg.altSectionBg,
        }}
      >
        <div className="max-w-md mx-auto space-y-6">
          <Ornament style={cfg.ornamentStyle} color={themeColor} />

          <p
            className="text-sm leading-relaxed"
            style={{
              color:
                cfg.ornamentStyle === "modern"
                  ? "rgba(255,255,255,0.65)"
                  : "#7A6553",
            }}
          >
            {invitation.closing_text ||
              "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu. Atas kehadiran dan doa restunya, kami mengucapkan terima kasih."}
          </p>

          <div>
            <p
              className="text-sm mb-2"
              style={{
                color:
                  cfg.ornamentStyle === "modern"
                    ? "rgba(255,255,255,0.5)"
                    : "#8B7355",
              }}
            >
              Dengan penuh cinta,
            </p>
            <h2
              className="text-2xl"
              style={{ fontFamily: cfg.headingFont, color: themeColor }}
            >
              {groomName} &amp; {brideName}
            </h2>
          </div>

          {invitation.hashtag && (
            <p
              className="text-sm font-medium"
              style={{ color: themeColor }}
            >
              #{invitation.hashtag}
            </p>
          )}

          <Ornament style={cfg.ornamentStyle} color={themeColor} />

          <p
            className="text-xs"
            style={{
              color:
                cfg.ornamentStyle === "modern"
                  ? "rgba(255,255,255,0.3)"
                  : "#B8A898",
            }}
          >
            Dibuat dengan NIKAHKU
          </p>
        </div>
      </section>
    </div>
  );
}

// ─── Countdown Section (separated to use hook cleanly) ────────────────────────

function CountdownSection({
  weddingDate,
  themeColor,
  cfg,
}: {
  weddingDate: string;
  themeColor: string;
  cfg: TemplateConfig;
}) {
  const { days, hours, minutes, seconds, done } = useCountdown(weddingDate);

  const textColor =
    cfg.ornamentStyle === "modern" ? "#FFFFFF" : "#2D1F14";
  const mutedColor =
    cfg.ornamentStyle === "modern" ? "rgba(255,255,255,0.5)" : "#8B7355";

  return (
    <section
      className="py-20 px-6 text-center"
      style={{ backgroundColor: cfg.altSectionBg }}
    >
      <div className="max-w-md mx-auto space-y-8">
        <div className="space-y-2">
          <p
            className="text-xs uppercase tracking-[0.25em]"
            style={{ color: themeColor }}
          >
            Menuju Hari Bahagia
          </p>
          <Ornament style={cfg.ornamentStyle} color={themeColor} />
        </div>

        {done ? (
          <div className="space-y-2">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
              style={{ backgroundColor: `${themeColor}20` }}
            >
              <Heart className="w-8 h-8" style={{ color: themeColor }} />
            </div>
            <h2
              className="text-xl font-semibold"
              style={{ fontFamily: cfg.headingFont, color: themeColor }}
            >
              Hari Bahagia Telah Tiba!
            </h2>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {[
              { value: days, label: "Hari" },
              { value: hours, label: "Jam" },
              { value: minutes, label: "Menit" },
              { value: seconds, label: "Detik" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="rounded-xl py-4 px-2"
                style={{
                  backgroundColor:
                    cfg.ornamentStyle === "modern" ? "#1A1A1A" : "#FFFDF8",
                  border: `1px solid ${themeColor}20`,
                }}
              >
                <p
                  className="text-3xl font-bold tabular-nums"
                  style={{
                    fontFamily: cfg.headingFont,
                    color: themeColor,
                  }}
                >
                  {String(value).padStart(2, "0")}
                </p>
                <p className="text-xs mt-1" style={{ color: mutedColor }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        )}

        <p
          className="text-sm"
          style={{ color: mutedColor }}
        >
          {formatDate(weddingDate)}
        </p>
      </div>
    </section>
  );
}
