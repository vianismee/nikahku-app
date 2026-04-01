"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";
import type { InvitationPageProps, SessionData } from "./types";
import { loadGoogleFont, getFontStack } from "@/lib/utils/google-fonts";
import "./basic.css";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSessionDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

function formatTime(t: string | null) {
  if (!t) return "";
  return t.slice(0, 5);
}

function padZero(n: number) {
  return String(n).padStart(2, "0");
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function Divider({ label }: { label?: string }) {
  return (
    <div className="inv-divider my-2 text-xs" style={{ color: "var(--inv-accent)", letterSpacing: "0.15em" }}>
      {label ? <span className="px-3 uppercase">{label}</span> : <span style={{ color: "var(--inv-accent)", fontSize: 18 }}>✦</span>}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center mb-6">
      <Divider />
      <h2 className="inv-heading text-2xl font-semibold mt-2" style={{ color: "var(--inv-accent)" }}>
        {children}
      </h2>
      <Divider />
    </div>
  );
}

function SessionCard({ session }: { session: SessionData }) {
  return (
    <div className="inv-card p-5 space-y-3">
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "var(--inv-accent-light)", color: "var(--inv-accent)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <h3 className="inv-heading font-semibold text-lg" style={{ color: "var(--inv-accent)" }}>{session.name}</h3>
      </div>
      {session.session_date && (
        <p className="text-sm" style={{ color: "var(--inv-text)" }}>{formatSessionDate(session.session_date)}</p>
      )}
      {(session.time_start || session.time_end) && (
        <p className="text-sm flex items-center gap-1.5" style={{ color: "var(--inv-muted)" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {formatTime(session.time_start)}{session.time_end ? ` — ${formatTime(session.time_end)}` : " WIB"}
        </p>
      )}
      {session.venue && (
        <p className="text-sm flex items-center gap-1.5" style={{ color: "var(--inv-muted)" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {session.venue}
        </p>
      )}
      {session.venue_maps_url && (
        <a
          href={session.venue_maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
          style={{ background: "var(--inv-accent-light)", color: "var(--inv-accent)" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          Buka Google Maps
        </a>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function Basic({ data }: { data: InvitationPageProps }) {
  type Phase = "gate" | "cover" | "open";
  const isPreview = !!data.preview;
  const [phase, setPhase] = useState<Phase>(isPreview ? "open" : "gate");
  const [guestName, setGuestName] = useState("");
  const [guestCode, setGuestCode] = useState("");

  // Code gate state
  const [codeInputs, setCodeInputs] = useState(["", "", "", "", ""]);
  const [codeError, setCodeError] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);
  const codeRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Countdown
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });

  // RSVP
  const [rsvpStatus, setRsvpStatus] = useState<"hadir" | "tidak_hadir" | null>(null);
  const [rsvpPax, setRsvpPax] = useState(1);
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpDone, setRsvpDone] = useState(false);

  // Wishes
  const [wishes, setWishes] = useState<{ id: string; guest_name: string; message: string; created_at: string }[]>([]);
  const [wishMsg, setWishMsg] = useState("");
  const [wishSubmitting, setWishSubmitting] = useState(false);
  const [wishDone, setWishDone] = useState(false);

  // QR Code
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  // ── Detect ?g= or ?to= on mount ──────────────────────────────────────────
  useEffect(() => {
    if (isPreview) return;
    const params = new URLSearchParams(window.location.search);
    const to = params.get("to");
    const g = params.get("g");

    if (to) {
      setGuestName(decodeURIComponent(to));
      setPhase("cover");
      return;
    }
    if (g) {
      const code = g.toUpperCase().slice(0, 5);
      setGuestCode(code);
      // Lookup in background to get name, but skip gate regardless
      fetch(`/api/i/${data.slug}/guest?g=${encodeURIComponent(code)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d?.guest?.name) setGuestName(d.guest.name);
        })
        .catch(() => {});
      setPhase("cover");
    }
    // else: stay on gate
  }, [data.slug, isPreview]);

  // ── Countdown timer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!data.countdownDate) return;
    function tick() {
      const target = new Date(data.countdownDate).getTime();
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) { setCountdown({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setCountdown({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [data.countdownDate]);

  // ── Generate QR code ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!guestCode) return;
    QRCode.toDataURL(guestCode, {
      width: 240,
      margin: 1,
      color: { dark: data.themeColor || "#8b6f4e", light: "#FAFAF8" },
    }).then(setQrDataUrl).catch(() => {});
  }, [guestCode, data.themeColor]);

  // ── Load wishes ───────────────────────────────────────────────────────────
  const loadWishes = useCallback(() => {
    if (!data.showWishes) return;
    fetch(`/api/i/${data.slug}/wishes`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.wishes) setWishes(d.wishes); })
      .catch(() => {});
  }, [data.slug, data.showWishes]);

  useEffect(() => {
    if (isPreview) return;
    if (phase === "open") loadWishes();
  }, [phase, loadWishes, isPreview]);

  // ── Code gate submit ──────────────────────────────────────────────────────
  async function handleCodeSubmit() {
    const code = codeInputs.join("").toUpperCase();
    if (code.length !== 5) { setCodeError("Masukkan 5 karakter kode undanganmu"); return; }
    setCodeLoading(true);
    setCodeError("");
    try {
      const res = await fetch(`/api/i/${data.slug}/guest?g=${encodeURIComponent(code)}`);
      if (!res.ok) { setCodeError("Kode tidak valid. Periksa kembali undanganmu."); return; }
      const d = await res.json();
      if (d?.guest?.name) setGuestName(d.guest.name);
      setGuestCode(code);
      setPhase("cover");
    } catch {
      setCodeError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setCodeLoading(false);
    }
  }

  // ── Code input key handler ────────────────────────────────────────────────
  function handleCodeKey(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") { handleCodeSubmit(); return; }
    if (e.key === "Backspace" && !codeInputs[idx] && idx > 0) {
      codeRefs[idx - 1].current?.focus();
    }
  }
  function handleCodeChange(idx: number, val: string) {
    const char = val.replace(/[^a-zA-Z0-9]/g, "").slice(-1).toUpperCase();
    const next = [...codeInputs];
    next[idx] = char;
    setCodeInputs(next);
    setCodeError("");
    if (char && idx < 4) codeRefs[idx + 1].current?.focus();
  }

  // ── RSVP submit ───────────────────────────────────────────────────────────
  async function handleRsvp() {
    if (!rsvpStatus || !guestCode) return;
    setRsvpSubmitting(true);
    try {
      const res = await fetch(`/api/i/${data.slug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gCode: guestCode, rsvp_status: rsvpStatus, pax_count: rsvpPax }),
      });
      if (res.ok) setRsvpDone(true);
    } catch { /* ignore */ }
    setRsvpSubmitting(false);
  }

  // ── Wish submit ───────────────────────────────────────────────────────────
  async function handleWish() {
    if (!wishMsg.trim() || !guestCode) return;
    setWishSubmitting(true);
    try {
      const res = await fetch(`/api/i/${data.slug}/wishes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gCode: guestCode, message: wishMsg.trim() }),
      });
      if (res.ok) {
        setWishDone(true);
        setWishMsg("");
        setTimeout(loadWishes, 500);
      }
    } catch { /* ignore */ }
    setWishSubmitting(false);
  }

  const accent = data.themeColor || "#8b6f4e";

  // Resolve heading font: custom Google Font name takes priority over preset enum
  const headingFont = data.fontHeadingName
    ? getFontStack(data.fontHeadingName)
    : data.fontHeading === "cormorant" ? "'Cormorant Garamond', serif"
    : data.fontHeading === "montserrat" ? "'Montserrat', sans-serif"
    : "'Playfair Display', serif";

  const bodyFont = data.fontBodyName
    ? getFontStack(data.fontBodyName)
    : "'DM Sans', sans-serif";

  const cssVars = {
    "--inv-accent": accent,
    "--inv-accent-light": `color-mix(in srgb, ${accent} 12%, white)`,
    "--inv-accent-mid": `color-mix(in srgb, ${accent} 30%, white)`,
    "--inv-border": `color-mix(in srgb, ${accent} 20%, white)`,
    "--inv-font-heading": headingFont,
    "--inv-font-body": bodyFont,
  } as React.CSSProperties;

  // Load custom Google Fonts dynamically
  useEffect(() => {
    if (data.fontHeadingName) loadGoogleFont(data.fontHeadingName);
    if (data.fontBodyName) loadGoogleFont(data.fontBodyName);
  }, [data.fontHeadingName, data.fontBodyName]);

  const hasGallery = data.galleryUrls.some(Boolean);
  const hasLoveStory = data.loveStory.length > 0;
  const hasGift = data.bankNama;

  // ── PHASE: Code Gate ──────────────────────────────────────────────────────
  if (phase === "gate") {
    return (
      <div className="inv-basic" style={cssVars}>
        <div className="inv-cover flex flex-col items-center justify-center px-6 py-12 text-center">
          {/* Decorative ring */}
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{ background: "var(--inv-accent-light)", border: "2px solid var(--inv-border)" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: accent }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>

          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "var(--inv-muted)" }}>
            Undangan Pernikahan
          </p>
          <h1 className="inv-heading text-3xl font-bold mb-1" style={{ color: accent }}>
            {data.namaPriaPanggil}
          </h1>
          <p className="inv-heading text-xl mb-1" style={{ color: "var(--inv-muted)" }}>&amp;</p>
          <h1 className="inv-heading text-3xl font-bold mb-6" style={{ color: accent }}>
            {data.namaWanitaPanggil}
          </h1>

          <div className="w-full max-w-xs">
            <p className="text-sm mb-4" style={{ color: "var(--inv-muted)" }}>
              Masukkan kode undangan yang kamu terima
            </p>

            {/* 5-char OTP input */}
            <div className="flex gap-2 justify-center mb-4">
              {codeInputs.map((val, idx) => (
                <input
                  key={idx}
                  ref={codeRefs[idx]}
                  value={val}
                  maxLength={1}
                  className="inv-code-input"
                  onChange={(e) => handleCodeChange(idx, e.target.value)}
                  onKeyDown={(e) => handleCodeKey(idx, e)}
                  onFocus={(e) => e.target.select()}
                  autoComplete="off"
                />
              ))}
            </div>

            {codeError && (
              <p className="text-sm mb-3" style={{ color: "#ef4444" }}>{codeError}</p>
            )}

            <button
              onClick={handleCodeSubmit}
              disabled={codeLoading}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-60"
              style={{ background: accent, color: "white" }}
            >
              {codeLoading ? "Memverifikasi..." : "Buka Undangan"}
            </button>
          </div>

          <p className="text-xs mt-6" style={{ color: "var(--inv-muted)" }}>
            {data.tanggalHeader}
          </p>
        </div>
      </div>
    );
  }

  // ── PHASE: Cover ──────────────────────────────────────────────────────────
  if (phase === "cover") {
    return (
      <div className="inv-basic" style={cssVars}>
        <div className="inv-cover" style={{ background: data.heroPhotoUrl ? undefined : `linear-gradient(135deg, color-mix(in srgb, ${accent} 8%, white), color-mix(in srgb, ${accent} 18%, white))` }}>
          {data.heroPhotoUrl && (
            <>
              <img src={data.heroPhotoUrl} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
              <div className="inv-cover-overlay absolute inset-0" />
            </>
          )}

          <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 py-16 w-full">
            <p className="text-xs uppercase tracking-widest mb-6"
              style={{ color: data.heroPhotoUrl ? "rgba(255,255,255,0.85)" : "var(--inv-muted)" }}>
              Undangan Pernikahan
            </p>

            {/* Couple names */}
            <h1 className="inv-heading font-bold" style={{
              fontSize: "clamp(2.2rem, 10vw, 3.5rem)",
              lineHeight: 1.1,
              color: data.heroPhotoUrl ? "white" : accent,
              textShadow: data.heroPhotoUrl ? "0 2px 12px rgba(0,0,0,0.3)" : "none",
            }}>
              {data.namaPriaPanggil}
            </h1>
            <p className="inv-heading my-1" style={{
              fontSize: "clamp(1.2rem, 5vw, 1.8rem)",
              color: data.heroPhotoUrl ? "rgba(255,255,255,0.8)" : "var(--inv-muted)",
            }}>&amp;</p>
            <h1 className="inv-heading font-bold" style={{
              fontSize: "clamp(2.2rem, 10vw, 3.5rem)",
              lineHeight: 1.1,
              color: data.heroPhotoUrl ? "white" : accent,
              textShadow: data.heroPhotoUrl ? "0 2px 12px rgba(0,0,0,0.3)" : "none",
            }}>
              {data.namaWanitaPanggil}
            </h1>

            {/* Date */}
            <p className="mt-4 text-base font-medium tracking-wider"
              style={{ color: data.heroPhotoUrl ? "rgba(255,255,255,0.85)" : "var(--inv-muted)" }}>
              {data.tanggalSingkat}
            </p>

            {/* Guest greeting */}
            {guestName && (
              <div className="mt-4 px-4 py-2 rounded-full text-sm"
                style={{
                  background: data.heroPhotoUrl ? "rgba(255,255,255,0.15)" : "var(--inv-accent-light)",
                  color: data.heroPhotoUrl ? "white" : accent,
                  backdropFilter: "blur(8px)",
                }}>
                Kepada Yth. <strong>{guestName}</strong>
              </div>
            )}

            {/* Open button */}
            <button
              onClick={() => setPhase("open")}
              className="mt-8 flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold shadow-lg transition-transform active:scale-95"
              style={{ background: accent, color: "white" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor" stroke="none"/>
              </svg>
              Buka Undangan
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── PHASE: Open (full invitation) ─────────────────────────────────────────
  return (
    <div className="inv-basic" style={cssVars}>

      {/* ── 1. Pembuka / Bismillah ── */}
      {(data.openingText || data.ayatSource) && (
        <section className="inv-section px-6 py-14 text-center max-w-lg mx-auto">
          <Divider />
          {data.openingText && (
            <p className="inv-heading text-base italic leading-relaxed mt-4" style={{ color: "var(--inv-text)" }}>
              &ldquo;{data.openingText}&rdquo;
            </p>
          )}
          {data.ayatSource && (
            <p className="text-xs mt-2" style={{ color: "var(--inv-muted)" }}>
              — {data.ayatSource}
            </p>
          )}
        </section>
      )}

      {/* ── 2. Couple Profile ── */}
      <section className="inv-section px-4 py-12 max-w-lg mx-auto">
        <SectionTitle>Mempelai</SectionTitle>

        <div className="flex gap-4">
          {/* Groom */}
          <div className="flex-1 inv-card p-4 text-center space-y-3">
            {data.groomPhotoUrl ? (
              <div className="mx-auto w-24 h-24 rounded-full overflow-hidden border-4"
                style={{ borderColor: "var(--inv-accent-light)" }}>
                <img src={data.groomPhotoUrl} alt={data.namaPriaPanggil} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center inv-heading text-3xl font-bold"
                style={{ background: "var(--inv-accent-light)", color: accent }}>
                {data.inisialPria}
              </div>
            )}
            <div>
              <p className="inv-heading font-bold text-lg leading-tight" style={{ color: accent }}>{data.namaPriaLengkap}</p>
              {data.ortuPria && (
                <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--inv-muted)" }}>{data.ortuPria}</p>
              )}
              {data.igPria && (
                <a href={data.igPriaUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs mt-1.5"
                  style={{ color: accent }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  {data.igPria}
                </a>
              )}
            </div>
          </div>

          {/* Divider between couple */}
          <div className="flex flex-col items-center justify-center gap-1 py-4">
            <div className="w-px flex-1" style={{ background: "var(--inv-border)" }} />
            <span className="inv-heading text-lg font-semibold" style={{ color: accent }}>&</span>
            <div className="w-px flex-1" style={{ background: "var(--inv-border)" }} />
          </div>

          {/* Bride */}
          <div className="flex-1 inv-card p-4 text-center space-y-3">
            {data.bridePhotoUrl ? (
              <div className="mx-auto w-24 h-24 rounded-full overflow-hidden border-4"
                style={{ borderColor: "var(--inv-accent-light)" }}>
                <img src={data.bridePhotoUrl} alt={data.namaWanitaPanggil} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center inv-heading text-3xl font-bold"
                style={{ background: "var(--inv-accent-light)", color: accent }}>
                {data.inisialWanita}
              </div>
            )}
            <div>
              <p className="inv-heading font-bold text-lg leading-tight" style={{ color: accent }}>{data.namaWanitaLengkap}</p>
              {data.ortuWanita && (
                <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--inv-muted)" }}>{data.ortuWanita}</p>
              )}
              {data.igWanita && (
                <a href={data.igWanitaUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs mt-1.5"
                  style={{ color: accent }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  {data.igWanita}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Sesi Acara ── */}
      {data.sessions.length > 0 && (
        <section className="inv-section px-4 py-12" style={{ background: "var(--inv-accent-light)" }}>
          <div className="max-w-lg mx-auto">
            <SectionTitle>Acara</SectionTitle>
            <div className="space-y-4">
              {data.sessions.map((s) => <SessionCard key={s.id} session={s} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── 4. Countdown ── */}
      {data.countdownDate && (
        <section className="inv-section px-4 py-12 max-w-lg mx-auto text-center">
          <SectionTitle>Menuju Hari Istimewa</SectionTitle>
          <div className="flex gap-3 justify-center">
            {[
              { val: countdown.d, label: "Hari" },
              { val: countdown.h, label: "Jam" },
              { val: countdown.m, label: "Menit" },
              { val: countdown.s, label: "Detik" },
            ].map(({ val, label }) => (
              <div key={label} className="inv-countdown-box">
                <p className="inv-heading text-2xl font-bold" style={{ color: accent }}>{padZero(val)}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--inv-muted)" }}>{label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 5. Gallery ── */}
      {hasGallery && (
        <section className="inv-section py-12" style={{ background: "var(--inv-accent-light)" }}>
          <div className="max-w-lg mx-auto px-4">
            <SectionTitle>Galeri</SectionTitle>
          </div>
          <div className="inv-gallery px-3 max-w-lg mx-auto">
            {/* Portrait row: slots 0-1 */}
            {data.galleryUrls.slice(0, 2).some(Boolean) && (
              <div className="inv-gallery-main">
                {data.galleryUrls.slice(0, 2).map((url, i) => url ? (
                  <div key={i} className="aspect-[2/3] rounded-xl overflow-hidden">
                    <img src={url} alt={`Galeri ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ) : <div key={i} />)}
              </div>
            )}
            {/* Square row: slots 2-4 */}
            {data.galleryUrls.slice(2, 5).some(Boolean) && (
              <div className="inv-gallery-sub mt-2">
                {data.galleryUrls.slice(2, 5).map((url, i) => url ? (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden">
                    <img src={url} alt={`Galeri ${i + 3}`} className="w-full h-full object-cover" />
                  </div>
                ) : <div key={i} />)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── 6. Love Story ── */}
      {hasLoveStory && (
        <section className="inv-section px-4 py-12 max-w-lg mx-auto">
          <SectionTitle>Love Story</SectionTitle>
          <div className="inv-timeline space-y-8">
            {data.loveStory.map((entry, idx) => (
              <div key={idx} className="relative pl-2">
                <div className="inv-timeline-dot" />
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: accent }}>
                  {entry.tahun}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--inv-text)" }}>
                  {entry.cerita}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 7. Hadiah Digital ── */}
      {hasGift && (
        <section className="inv-section px-4 py-12" style={{ background: "var(--inv-accent-light)" }}>
          <div className="max-w-lg mx-auto">
            <SectionTitle>Hadiah Digital</SectionTitle>
            <p className="text-sm text-center mb-6" style={{ color: "var(--inv-muted)" }}>
              Tanpa mengurangi rasa hormat, bagi yang ingin memberikan hadiah
            </p>
            <div className="space-y-3">
              {[
                { bank: data.bankNama, norek: data.bankNorek, atas: data.bankAtasnama },
              ].filter(g => g.bank).map((g, i) => (
                <div key={i} className="inv-card p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "var(--inv-text)" }}>{g.bank}</p>
                    <p className="text-lg font-bold tracking-wider mt-0.5" style={{ color: accent }}>{g.norek}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--inv-muted)" }}>a.n. {g.atas}</p>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(g.norek)}
                    className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ background: "var(--inv-accent-light)", color: accent }}
                  >
                    Salin
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 8 & 9. Tiket Undangan — RSVP + Ucapan dalam satu card ── */}
      {guestCode && !isPreview && (
        <section className="inv-section px-4 py-12" style={{ background: "var(--inv-accent-light)" }}>
          <div className="max-w-lg mx-auto">
            <SectionTitle>Tiket Undangan</SectionTitle>

            {/* ── Ticket card ── */}
            <div className="inv-card overflow-hidden">

              {/* Top stripe */}
              <div className="h-2" style={{ background: `linear-gradient(90deg, ${accent}, color-mix(in srgb, ${accent} 60%, white))` }} />

              <div className="p-6 space-y-6">

                {/* QR Code + Guest Name */}
                <div className="flex flex-col items-center gap-3 pb-6"
                  style={{ borderBottom: "1px dashed var(--inv-border)" }}>
                  <div className="p-3 rounded-2xl" style={{ background: "#FAFAF8", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
                    {qrDataUrl ? (
                      <img src={qrDataUrl} alt="QR Souvenir" width={160} height={160} className="block" />
                    ) : (
                      <div className="w-40 h-40 flex items-center justify-center" style={{ color: "var(--inv-muted)" }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3"/></svg>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--inv-muted)" }}>
                      QR Souvenir
                    </p>
                    <p className="inv-heading font-bold text-xl" style={{ color: accent }}>
                      {guestName || "Tamu Undangan"}
                    </p>
                    <p className="text-xs mt-0.5 font-mono tracking-widest" style={{ color: "var(--inv-muted)" }}>
                      {guestCode}
                    </p>
                  </div>
                </div>

                {/* RSVP — Konfirmasi Kehadiran */}
                {data.showRsvp && data.rsvpEnabled && (
                  <div className="space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--inv-muted)" }}>
                      Konfirmasi Kehadiran
                    </p>

                    {rsvpDone ? (
                      <div className="flex items-center gap-3 p-3 rounded-xl"
                        style={{ background: "var(--inv-accent-light)" }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: accent }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </div>
                        <p className="text-sm font-medium" style={{ color: "var(--inv-text)" }}>
                          {rsvpStatus === "hadir"
                            ? "Terima kasih! Kami menantikan kehadiranmu 🎉"
                            : "Kami mengerti. Terima kasih atas doanya 🙏"}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Button group */}
                        <div className="grid grid-cols-2 gap-3">
                          {/* Hadir */}
                          <button
                            onClick={() => setRsvpStatus("hadir")}
                            className="relative flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border-2 transition-all duration-200"
                            style={{
                              borderColor: rsvpStatus === "hadir" ? accent : "var(--inv-border)",
                              background: rsvpStatus === "hadir" ? accent : "white",
                            }}
                          >
                            <span className="text-2xl leading-none">🎊</span>
                            <span className="text-sm font-semibold"
                              style={{ color: rsvpStatus === "hadir" ? "white" : "var(--inv-text)" }}>
                              Hadir
                            </span>
                            {rsvpStatus === "hadir" && (
                              <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-white/30 flex items-center justify-center">
                                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                              </span>
                            )}
                          </button>

                          {/* Tidak Hadir */}
                          <button
                            onClick={() => setRsvpStatus("tidak_hadir")}
                            className="relative flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border-2 transition-all duration-200"
                            style={{
                              borderColor: rsvpStatus === "tidak_hadir" ? "#94a3b8" : "var(--inv-border)",
                              background: rsvpStatus === "tidak_hadir" ? "#94a3b8" : "white",
                            }}
                          >
                            <span className="text-2xl leading-none">🙏</span>
                            <span className="text-sm font-semibold"
                              style={{ color: rsvpStatus === "tidak_hadir" ? "white" : "var(--inv-text)" }}>
                              Tidak Hadir
                            </span>
                            {rsvpStatus === "tidak_hadir" && (
                              <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-white/30 flex items-center justify-center">
                                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                              </span>
                            )}
                          </button>
                        </div>

                        {/* Pax selector */}
                        {rsvpStatus === "hadir" && data.rsvpMaxPax > 1 && (
                          <div className="flex items-center justify-between p-3 rounded-xl"
                            style={{ background: "var(--inv-accent-light)" }}>
                            <p className="text-sm" style={{ color: "var(--inv-text)" }}>Jumlah tamu</p>
                            <div className="flex items-center gap-3">
                              <button className="inv-pax-btn" onClick={() => setRsvpPax(Math.max(1, rsvpPax - 1))}>−</button>
                              <span className="w-6 text-center font-bold" style={{ color: accent }}>{rsvpPax}</span>
                              <button className="inv-pax-btn" onClick={() => setRsvpPax(Math.min(data.rsvpMaxPax, rsvpPax + 1))}>+</button>
                            </div>
                          </div>
                        )}

                        {/* Confirm button */}
                        <button
                          onClick={handleRsvp}
                          disabled={!rsvpStatus || rsvpSubmitting}
                          className="w-full py-3 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-40"
                          style={{ background: accent, color: "white" }}
                        >
                          {rsvpSubmitting ? "Mengirim..." : "Konfirmasi"}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Divider */}
                {data.showWishes && (
                  <div style={{ borderTop: "1px dashed var(--inv-border)" }} />
                )}

                {/* Ucapan & Doa */}
                {data.showWishes && (
                  <div className="space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--inv-muted)" }}>
                      Ucapan &amp; Doa
                    </p>

                    {wishDone ? (
                      <div className="flex items-center gap-3 p-3 rounded-xl"
                        style={{ background: "var(--inv-accent-light)" }}>
                        <span className="text-xl">💌</span>
                        <p className="text-sm font-medium" style={{ color: accent }}>
                          Ucapanmu sudah tersampaikan!
                        </p>
                      </div>
                    ) : (
                      <>
                        <textarea
                          value={wishMsg}
                          onChange={(e) => setWishMsg(e.target.value)}
                          placeholder="Tuliskan ucapan & doa terbaik untuk mempelai..."
                          rows={4}
                          className="w-full text-sm p-4 rounded-xl border-2 resize-none outline-none transition-colors"
                          style={{
                            borderColor: "var(--inv-border)",
                            background: "#FAFAF8",
                            color: "var(--inv-text)",
                          }}
                          onFocus={(e) => (e.target.style.borderColor = accent)}
                          onBlur={(e) => (e.target.style.borderColor = "var(--inv-border)")}
                        />
                        <button
                          onClick={handleWish}
                          disabled={!wishMsg.trim() || wishSubmitting}
                          className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-opacity disabled:opacity-40"
                          style={{ background: accent, color: "white" }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                          </svg>
                          {wishSubmitting ? "Mengirim..." : "Kirim Ucapan"}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Wishes list — tampil di bawah card tiket */}
            {wishes.length > 0 && (
              <div className="mt-6 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest px-1" style={{ color: "var(--inv-muted)" }}>
                  {wishes.length} Ucapan
                </p>
                <div className="inv-wishes-list space-y-2">
                  {wishes.map((w) => (
                    <div key={w.id} className="inv-card p-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ background: "var(--inv-accent-light)", color: accent }}>
                          {w.guest_name.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-sm font-semibold" style={{ color: "var(--inv-text)" }}>{w.guest_name}</p>
                      </div>
                      <p className="text-sm leading-relaxed pl-9" style={{ color: "var(--inv-muted)" }}>
                        &ldquo;{w.message}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── 10. Closing / Footer ── */}
      <section className="inv-section px-6 py-14 text-center max-w-lg mx-auto">
        {data.closingText && (
          <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--inv-muted)" }}>
            {data.closingText}
          </p>
        )}
        <Divider />
        <p className="inv-heading text-2xl font-semibold mt-4 mb-1" style={{ color: accent }}>
          {data.namaPriaPanggil} &amp; {data.namaWanitaPanggil}
        </p>
        <p className="text-xs" style={{ color: "var(--inv-muted)" }}>{data.tanggalHeader}</p>
        {data.hashtag && (
          <p className="mt-3 text-sm font-semibold" style={{ color: accent }}>#{data.hashtag}</p>
        )}
        <Divider />
        <p className="text-[10px] mt-6" style={{ color: "var(--inv-muted)" }}>
          Dibuat dengan ❤ oleh NIKAHKU
        </p>
      </section>

    </div>
  );
}
