"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
import { getInvitation, type InvitationWithSessions } from "@/app/actions/invitation";
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
} from "lucide-react";
import QRCode from "qrcode";
import { useTheme } from "next-themes";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: "long",
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

// ─── QR Card Component ────────────────────────────────────────────────────────

function GuestQRCard({ guest, weddingSlug }: { guest: GuestPublic; weddingSlug: string }) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    QRCode.toDataURL(guest.nano_id, {
      width: 200,
      margin: 1,
      color: { dark: "#1a1a1a", light: "#ffffff" },
    }).then(setQrDataUrl);
  }, [guest.nano_id]);

  return (
    <Card className="p-6 flex flex-col items-center gap-4 text-center">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <QrCode className="w-4 h-4" />
        <span>Kode Undangan Anda</span>
      </div>

      {qrDataUrl ? (
        <img src={qrDataUrl} alt="QR Code" className="w-40 h-40 rounded-lg" />
      ) : (
        <Skeleton className="w-40 h-40 rounded-lg" />
      )}

      <div className="font-mono text-2xl font-bold tracking-[0.3em] text-foreground">
        {guest.nano_id}
      </div>

      <div className="text-base font-semibold">{guest.name}</div>

      <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          {guest.pax_count} orang
        </span>
        {guest.sessions.map((s) => (
          <span key={s.id} className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {s.name}
          </span>
        ))}
      </div>

      {guest.souvenir_taken && (
        <Badge variant="outline" className="text-green-600 border-green-600 gap-1">
          <CheckCircle className="w-3.5 h-3.5" />
          Souvenir sudah diambil
        </Badge>
      )}

      <p className="text-xs text-muted-foreground">
        Simpan QR ini untuk pengambilan souvenir di venue
      </p>

      {qrDataUrl && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const a = document.createElement("a");
            a.href = qrDataUrl;
            a.download = `undangan_${guest.nano_id}.png`;
            a.click();
          }}
        >
          Download QR
        </Button>
      )}
    </Card>
  );
}

// ─── RSVP Section ─────────────────────────────────────────────────────────────

function RsvpSection({
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

  async function handleSubmit() {
    setLoading(true);
    const res = await updateGuestRsvpPublic(weddingSlug, guest.nano_id, {
      rsvp_status: status,
      pax_count: pax,
    });
    setLoading(false);
    if (res.success) {
      toast.success("Konfirmasi kehadiran berhasil disimpan");
      onUpdated({ rsvp_status: status, pax_count: pax });
      setEditing(false);
    } else {
      toast.error(res.error ?? "Gagal menyimpan");
    }
  }

  const statusLabel =
    guest.rsvp_status === "hadir"
      ? "Hadir"
      : guest.rsvp_status === "tidak_hadir"
      ? "Tidak Hadir"
      : "Belum Konfirmasi";

  return (
    <Card className="p-6 space-y-4">
      <h3 className="font-semibold text-base">Konfirmasi Kehadiran</h3>

      {!editing ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {guest.rsvp_status === "hadir" ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : guest.rsvp_status === "tidak_hadir" ? (
              <XCircle className="w-5 h-5 text-red-500" />
            ) : (
              <Clock className="w-5 h-5 text-amber-500" />
            )}
            <span className="font-medium">{statusLabel}</span>
            {guest.rsvp_status === "hadir" && (
              <span className="text-muted-foreground text-sm">· {guest.pax_count} orang</span>
            )}
          </div>

          {guest.sessions.length > 0 && (
            <div className="space-y-1.5 text-sm text-muted-foreground">
              {guest.sessions.map((s) => (
                <div key={s.id} className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium text-foreground">{s.name}</span>
                    {s.session_date && <span> · {formatDate(s.session_date)}</span>}
                    {s.time_start && (
                      <span>
                        {" "}
                        · {formatTime(s.time_start)}
                        {s.time_end && `–${formatTime(s.time_end)}`} WIB
                      </span>
                    )}
                    {s.venue && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {s.venue}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            <Pencil className="w-3.5 h-3.5 mr-1.5" />
            Ubah Konfirmasi
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-3">
            <button
              onClick={() => setStatus("hadir")}
              className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                status === "hadir"
                  ? "bg-green-50 border-green-600 text-green-700 dark:bg-green-950 dark:text-green-400"
                  : "border-border hover:bg-muted"
              }`}
            >
              ✓ Hadir
            </button>
            <button
              onClick={() => { setStatus("tidak_hadir"); setPax(1); }}
              className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                status === "tidak_hadir"
                  ? "bg-red-50 border-red-500 text-red-700 dark:bg-red-950 dark:text-red-400"
                  : "border-border hover:bg-muted"
              }`}
            >
              ✗ Tidak Hadir
            </button>
          </div>

          {status === "hadir" && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Jumlah orang (termasuk Anda)</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPax((p) => Math.max(1, p - 1))}
                >
                  −
                </Button>
                <span className="w-8 text-center font-semibold">{pax}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPax((p) => Math.min(maxPax, p + 1))}
                >
                  +
                </Button>
                <span className="text-xs text-muted-foreground">maks. {maxPax}</span>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={loading} className="flex-1">
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
            <Button variant="outline" onClick={() => setEditing(false)}>
              Batal
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

// ─── Wishes Feed ──────────────────────────────────────────────────────────────

function WishesFeed({
  weddingId,
  initialWishes,
  guest,
  existingWish,
}: {
  weddingId: string;
  initialWishes: WishPublic[];
  guest: GuestPublic | null;
  existingWish: WishPublic | null;
}) {
  const [wishes, setWishes] = useState<WishPublic[]>(initialWishes);
  const [message, setMessage] = useState(existingWish?.message ?? "");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [myWish, setMyWish] = useState<WishPublic | null>(existingWish);
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null);

  // Realtime subscription
  useEffect(() => {
    const supabase = createClient();
    channelRef.current = supabase
      .channel(`wishes:${weddingId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "wishes", filter: `wedding_id=eq.${weddingId}` },
        (payload) => {
          const w = payload.new as WishPublic;
          if (w.is_visible !== false) {
            setWishes((prev) => [w, ...prev]);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "wishes", filter: `wedding_id=eq.${weddingId}` },
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
      <h3 className="font-semibold text-base flex items-center gap-2">
        <Heart className="w-4 h-4 text-rose-500" />
        Ucapan & Doa
      </h3>

      {/* Form ucapan — hanya jika sudah unlock NanoID */}
      {guest && (
        <Card className="p-4 space-y-3">
          {myWish && !editMode ? (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Ucapan Anda:</div>
              <p className="text-sm">{myWish.message}</p>
              <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                <Pencil className="w-3.5 h-3.5 mr-1.5" />
                Edit Ucapan
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm font-medium">
                {myWish ? "Edit ucapan Anda" : `Kirim ucapan sebagai ${guest.name}`}
              </div>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                placeholder="Tulis ucapan dan doa untuk pengantin..."
                rows={3}
                className="resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{message.length}/500</span>
                <div className="flex gap-2">
                  {myWish && (
                    <Button variant="outline" size="sm" onClick={() => { setEditMode(false); setMessage(myWish.message); }}>
                      Batal
                    </Button>
                  )}
                  <Button size="sm" onClick={handleSubmit} disabled={loading || !message.trim()}>
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    {loading ? "Mengirim..." : myWish ? "Simpan" : "Kirim Ucapan"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {!guest && (
        <p className="text-sm text-muted-foreground text-center py-2">
          Masukkan kode undangan di atas untuk mengirim ucapan
        </p>
      )}

      {/* Feed ucapan */}
      <div className="space-y-3">
        {wishes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Belum ada ucapan. Jadilah yang pertama!
          </p>
        ) : (
          wishes.map((w) => (
            <Card key={w.id} className="p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{w.guest_name}</span>
                <span className="text-xs text-muted-foreground">{timeAgo(w.created_at)}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{w.message}</p>
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
}: {
  onFound: (guest: GuestPublic) => void;
  weddingSlug: string;
}) {
  const [chars, setChars] = useState(["", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(idx: number, val: string) {
    const char = val.toUpperCase().replace(/[^0-9A-Z]/g, "").slice(-1);
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
    if (nanoId.length < 5) { setError("Masukkan 5 karakter kode undangan"); return; }
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
      <div className="space-y-1.5">
        <h3 className="font-semibold text-base">Masukkan Kode Undangan</h3>
        <p className="text-sm text-muted-foreground">
          Kode 5 karakter ada di undangan Anda
        </p>
      </div>

      <div className="flex gap-2 justify-center">
        {chars.map((c, i) => (
          <Input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            value={c}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-12 h-12 text-center text-lg font-mono font-bold uppercase"
            maxLength={1}
          />
        ))}
      </div>

      {error && <p className="text-sm text-destructive text-center">{error}</p>}

      <Button onClick={handleLookup} disabled={loading} className="w-full">
        {loading ? "Mencari..." : "Cari Data Saya"}
      </Button>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

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

export default function InvitationPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState("");
  const [invitation, setInvitation] = useState<InvitationWithSessions | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [guest, setGuest] = useState<GuestPublic | null>(null);
  const [existingWish, setExistingWish] = useState<WishPublic | null>(null);
  const [wishes, setWishes] = useState<WishPublic[]>([]);

  useEffect(() => {
    params.then(async ({ slug: s }) => {
      setSlug(s);
      const inv = await getInvitation(s);
      if (!inv) { setNotFound(true); setLoading(false); return; }
      setInvitation(inv);

      let guestLoaded = false;

      // Restore guest dari sessionStorage jika ada
      const stored = sessionStorage.getItem(`guest_${s}`);
      if (stored) {
        try {
          const g = JSON.parse(stored) as GuestPublic;
          setGuest(g);
          guestLoaded = true;
          const w = await getExistingWish(inv.wedding.id, g.id);
          setExistingWish(w);
        } catch { /* ignore */ }
      }

      // Auto-lookup dari ?id=NANOID di URL
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

  const { wedding } = invitation;
  const coupleName = `${wedding.partner_1_name} & ${wedding.partner_2_name}`;

  return (
    <main className="min-h-screen bg-background">
      <ThemeToggle />
      <div className="max-w-md mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-1 py-6">
          <p className="text-sm text-muted-foreground">Undangan Pernikahan</p>
          <h1 className="text-2xl font-bold">{coupleName}</h1>
          {wedding.wedding_date && (
            <p className="text-sm text-muted-foreground">{formatDate(wedding.wedding_date)}</p>
          )}
          {wedding.venue_city && (
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {wedding.venue_city}
            </p>
          )}
        </div>

        {/* Guest card (after unlock) */}
        {guest && (
          <GuestQRCard guest={guest} weddingSlug={slug} />
        )}

        {/* NanoID input (sebelum unlock) */}
        {!guest && wedding.rsvp_enabled && (
          <NanoIdInput onFound={handleGuestFound} weddingSlug={slug} />
        )}

        {/* RSVP section (setelah unlock) */}
        {guest && wedding.rsvp_enabled && (
          <RsvpSection
            guest={guest}
            weddingSlug={slug}
            maxPax={wedding.rsvp_max_pax_per_guest}
            onUpdated={(updated) => setGuest((g) => g ? { ...g, ...updated } : g)}
          />
        )}

        {/* Jadwal acara */}
        {invitation.sessions.length > 0 && (
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-base">Jadwal Acara</h3>
            <div className="space-y-3">
              {invitation.sessions.map((s) => (
                <div key={s.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-medium text-sm">{s.name}</div>
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
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Wishes feed */}
        {invitation.show_wishes && (
          <WishesFeed
            weddingId={wedding.id}
            initialWishes={wishes}
            guest={guest}
            existingWish={existingWish}
          />
        )}

        {/* Footer */}
        <div className="text-center py-4 text-xs text-muted-foreground">
          {invitation.hashtag && <p className="font-medium text-sm mb-1">#{invitation.hashtag}</p>}
          <p>Dibuat dengan NIKAHKU</p>
        </div>
      </div>
    </main>
  );
}
