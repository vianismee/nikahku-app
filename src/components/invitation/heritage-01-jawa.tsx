"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { InvitationPageProps } from "./types";
import { loadGoogleFont } from "@/lib/utils/google-fonts";
import "./heritage-01-jawa.css";

// ═══════════════════════════════════════════════════════════════════════════════
// SVG ORNAMENTS — pure inline, no external assets required
// ═══════════════════════════════════════════════════════════════════════════════

/** Traditional Javanese Gunungan (Kayon/Tree of Life) */
function GununganSvg({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 100 160" className={className} style={style} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Outer body — flame/mountain/leaf */}
      <path d="M50 4 C50 4 93 72 93 116 C93 143 73 156 50 156 C27 156 7 143 7 116 C7 72 50 4 50 4 Z" fill="currentColor" opacity="0.12"/>
      <path d="M50 4 C50 4 93 72 93 116 C93 143 73 156 50 156 C27 156 7 143 7 116 C7 72 50 4 50 4 Z" fill="none" stroke="currentColor" strokeWidth="1.4"/>
      {/* Inner dashed border */}
      <path d="M50 16 C50 16 82 76 82 114 C82 136 68 148 50 148 C32 148 18 136 18 114 C18 76 50 16 50 16 Z" fill="none" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 2.5"/>
      {/* Center circle medallion */}
      <circle cx="50" cy="102" r="20" fill="none" stroke="currentColor" strokeWidth="1"/>
      <circle cx="50" cy="102" r="12" fill="none" stroke="currentColor" strokeWidth="0.7"/>
      <circle cx="50" cy="102" r="4.5" fill="currentColor" opacity="0.55"/>
      {/* Lotus petals around center */}
      <ellipse cx="50" cy="79"  rx="4" ry="9" fill="currentColor" opacity="0.3"/>
      <ellipse cx="68" cy="91"  rx="4" ry="9" fill="currentColor" opacity="0.3" transform="rotate(60 68 91)"/>
      <ellipse cx="64" cy="115" rx="4" ry="9" fill="currentColor" opacity="0.3" transform="rotate(120 64 115)"/>
      <ellipse cx="50" cy="124" rx="4" ry="9" fill="currentColor" opacity="0.3"/>
      <ellipse cx="36" cy="115" rx="4" ry="9" fill="currentColor" opacity="0.3" transform="rotate(-120 36 115)"/>
      <ellipse cx="32" cy="91"  rx="4" ry="9" fill="currentColor" opacity="0.3" transform="rotate(-60 32 91)"/>
      {/* Tree of life trunk */}
      <line x1="50" y1="55" x2="50" y2="83" stroke="currentColor" strokeWidth="1.2"/>
      {/* Branches */}
      <line x1="50" y1="63" x2="37" y2="50" stroke="currentColor" strokeWidth="0.9"/>
      <line x1="50" y1="63" x2="63" y2="50" stroke="currentColor" strokeWidth="0.9"/>
      <line x1="50" y1="70" x2="31" y2="57" stroke="currentColor" strokeWidth="0.7"/>
      <line x1="50" y1="70" x2="69" y2="57" stroke="currentColor" strokeWidth="0.7"/>
      {/* Leaf nodes */}
      <circle cx="37" cy="50" r="3.5" fill="currentColor" opacity="0.65"/>
      <circle cx="63" cy="50" r="3.5" fill="currentColor" opacity="0.65"/>
      <circle cx="31" cy="57" r="2.5" fill="currentColor" opacity="0.5"/>
      <circle cx="69" cy="57" r="2.5" fill="currentColor" opacity="0.5"/>
      <circle cx="50" cy="42" r="4.5" fill="currentColor" opacity="0.7"/>
      {/* Top crown tip */}
      <circle cx="50" cy="30" r="2" fill="currentColor" opacity="0.4"/>
      <line x1="50" y1="8" x2="50" y2="28" stroke="currentColor" strokeWidth="0.8" opacity="0.4"/>
      {/* Base / throne */}
      <rect x="33" y="156" width="34" height="9"  rx="2.5" fill="currentColor" opacity="0.7"/>
      <rect x="26" y="148" width="48" height="10" rx="2"   fill="currentColor" opacity="0.45"/>
      <rect x="31" y="140" width="38" height="9"  rx="2"   fill="currentColor" opacity="0.35"/>
    </svg>
  );
}

/** Javanese-style corner ornament (top-left orientation) */
function CornerSvg({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 52 52" className={className} style={style} fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 2 L50 2" strokeWidth="1.2"/>
      <path d="M2 2 L2 50" strokeWidth="1.2"/>
      <circle cx="2" cy="2" r="4" fill="currentColor" strokeWidth="0" opacity="0.6"/>
      {/* Floral along top */}
      <path d="M14 2 Q18 -4 22 2" strokeWidth="0.8"/>
      <path d="M28 2 Q32 -4 36 2" strokeWidth="0.8"/>
      <circle cx="18" cy="-2" r="1.5" fill="currentColor" opacity="0" strokeWidth="0"/>
      {/* Floral along left */}
      <path d="M2 14 Q-4 18 2 22" strokeWidth="0.8"/>
      <path d="M2 28 Q-4 32 2 36" strokeWidth="0.8"/>
      {/* Inner L */}
      <path d="M8 8 L44 8" strokeWidth="0.5" opacity="0.5"/>
      <path d="M8 8 L8 44" strokeWidth="0.5" opacity="0.5"/>
      {/* Small diamond */}
      <polygon points="22,22 28,17 34,22 28,27" strokeWidth="0.7" opacity="0.6"/>
      <circle cx="28" cy="22" r="2" fill="currentColor" strokeWidth="0" opacity="0.4"/>
    </svg>
  );
}

/** Center medallion divider */
function MedallionSvg({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 180 28" className={className} style={style} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <line x1="0"   y1="14" x2="68"  y2="14" stroke="currentColor" strokeWidth="0.8"/>
      <line x1="112" y1="14" x2="180" y2="14" stroke="currentColor" strokeWidth="0.8"/>
      <polygon points="32,14 37,10 42,14 37,18" fill="currentColor" opacity="0.45" stroke="none"/>
      <polygon points="138,14 143,10 148,14 143,18" fill="currentColor" opacity="0.45" stroke="none"/>
      {/* Center lotus */}
      <polygon points="90,4 98,14 90,24 82,14" fill="none" stroke="currentColor" strokeWidth="1"/>
      <polygon points="90,7 95,14 90,21 85,14" fill="currentColor" opacity="0.18" stroke="none"/>
      <circle cx="90" cy="14" r="3" fill="currentColor" opacity="0.65" stroke="none"/>
      {/* Small dots */}
      <circle cx="75" cy="14" r="1.5" fill="currentColor" opacity="0.4"/>
      <circle cx="105" cy="14" r="1.5" fill="currentColor" opacity="0.4"/>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

function useCountdown(targetDate: string) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, new Date(targetDate).getTime() - Date.now());
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return t;
}

/** Scroll-reveal using IntersectionObserver */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// ═══════════════════════════════════════════════════════════════════════════════
// COVER / GATE SECTION
// ═══════════════════════════════════════════════════════════════════════════════

function CoverSection({
  data, guestName, onOpen,
}: { data: InvitationPageProps; guestName: string; onOpen: () => void }) {
  return (
    <div className="hj-cover">
      {data.heroPhotoUrl && (
        <div className="hj-cover__bg" style={{ backgroundImage: `url(${data.heroPhotoUrl})` }} />
      )}
      <div className="hj-cover__vignette" />
      <div className="hj-cover__pattern" />

      {/* Double-rule border frame */}
      <div className="hj-cover__border" />

      {/* Corner ornaments */}
      <CornerSvg className="hj-cover__corner hj-cover__corner--tl" />
      <CornerSvg className="hj-cover__corner hj-cover__corner--tr" />
      <CornerSvg className="hj-cover__corner hj-cover__corner--bl" />
      <CornerSvg className="hj-cover__corner hj-cover__corner--br" />

      <div className="hj-cover__content">
        <GununganSvg className="hj-cover__gunungan" />

        <span className="hj-cover__label">Undangan Pernikahan</span>

        <div className="hj-cover__divider-line" />

        <div className="hj-cover__names">
          {data.namaPriaPanggil}
          <span className="hj-cover__amp">&amp;</span>
          {data.namaWanitaPanggil}
        </div>

        <div className="hj-cover__divider-line" />

        {data.tanggalSingkat && (
          <span className="hj-cover__date">{data.tanggalSingkat}</span>
        )}

        {guestName && (
          <p className="hj-cover__guest-wrap">
            Kepada Yth.
            <span className="hj-cover__guest-name">{guestName}</span>
          </p>
        )}

        <button className="hj-cover__btn" onClick={onOpen}>
          Buka Undangan
        </button>
      </div>

      <div className="hj-cover__scroll-hint">
        <span className="hj-cover__scroll-txt">Geser ke Bawah</span>
        <div className="hj-cover__scroll-bar" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// OPENING / REVEAL SECTION
// ═══════════════════════════════════════════════════════════════════════════════

function OpeningSection({ data }: { data: InvitationPageProps }) {
  const { ref, visible } = useReveal();
  const cls = `hj-reveal${visible ? " hj-visible" : ""}`;

  const ayat = data.openingText || "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu cenderung dan merasa tentram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.";
  const source = data.ayatSource || "QS. Ar-Rum: 21";

  return (
    <div className="hj-section hj-section--cream">
      <div className="hj-bat-kawung" />
      <div className="hj-section__inner" ref={ref}>
        <div className="hj-opening">

          {/* Hero photo */}
          {data.heroPhotoUrl && (
            <div className={`hj-opening__hero ${cls}`}>
              <img src={data.heroPhotoUrl} alt="Foto Utama" />
              <div className="hj-opening__hero-overlay" />
            </div>
          )}

          {/* Verse */}
          <div className={`${cls} hj-d1 hj-text-c`} style={{ maxWidth: 340 }}>
            <GununganSvg className="hj-sec-icon" />
            <p className="hj-opening__verse">
              &ldquo;{ayat}&rdquo;
            </p>
            <span className="hj-opening__verse-src">{source}</span>
          </div>

          {/* Medallion divider */}
          <MedallionSvg className={`${cls} hj-d2`} style={{ width: "100%", maxWidth: 280, color: "var(--hj-gold)", opacity: 0.65 }} />

          {/* Couple names */}
          <div className={`hj-opening__names-wrap ${cls} hj-d3`}>
            <span className="hj-opening__name">{data.namaPriaLengkap}</span>
            <span className="hj-opening__amp">&amp;</span>
            <span className="hj-opening__name">{data.namaWanitaLengkap}</span>
          </div>

          {/* Date badge */}
          {data.tanggalHeader && (
            <div className={`hj-opening__date-badge ${cls} hj-d4`}>
              {data.tanggalHeader}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COUPLE PROFILES
// ═══════════════════════════════════════════════════════════════════════════════

function CoupleSection({ data }: { data: InvitationPageProps }) {
  const { ref, visible } = useReveal();
  const cls = (d?: string) => `hj-reveal${visible ? " hj-visible" : ""}${d ? ` ${d}` : ""}`;

  return (
    <div className="hj-section hj-section--cream-alt">
      <div className="hj-bat-gringsing" />
      <div className="hj-section__inner" ref={ref}>

        <div className={`hj-sec-header ${cls()}`}>
          <span className="hj-eyebrow">Mempelai</span>
          <h2 className="hj-sec-title">Kedua Mempelai</h2>
          <MedallionSvg style={{ width: 160, color: "var(--hj-gold)", opacity: 0.5 }} />
        </div>

        <div className="hj-couple-wrap">
          {/* Groom */}
          <div className={`hj-person ${cls("hj-d1")}`}>
            <div className="hj-person__frame">
              <div className="hj-person__frame-border-1" />
              <div className="hj-person__frame-border-2" />
              {data.groomPhotoUrl ? (
                <img className="hj-person__photo" src={data.groomPhotoUrl} alt={data.namaPriaPanggil} />
              ) : (
                <div className="hj-person__photo-placeholder">
                  <span className="hj-person__initial">{data.inisialPria}</span>
                </div>
              )}
            </div>
            <span className="hj-person__nickname">{data.namaPriaPanggil}</span>
            <span className="hj-person__fullname">{data.namaPriaLengkap}</span>
            {data.ortuPria && (
              <p className="hj-person__parents">
                Putra dari<br />
                <span>{data.ortuPria}</span>
              </p>
            )}
            {data.igPria && (
              <a href={data.igPriaUrl} target="_blank" rel="noopener noreferrer" className="hj-person__ig">
                <IgIcon /> {data.igPria}
              </a>
            )}
          </div>

          {/* Separator */}
          <div className={`hj-couple-sep ${cls("hj-d2")}`}>
            <div className="hj-couple-sep__line" />
            <span>&amp;</span>
            <div className="hj-couple-sep__line" />
          </div>

          {/* Bride */}
          <div className={`hj-person ${cls("hj-d3")}`}>
            <div className="hj-person__frame">
              <div className="hj-person__frame-border-1" />
              <div className="hj-person__frame-border-2" />
              {data.bridePhotoUrl ? (
                <img className="hj-person__photo" src={data.bridePhotoUrl} alt={data.namaWanitaPanggil} />
              ) : (
                <div className="hj-person__photo-placeholder">
                  <span className="hj-person__initial">{data.inisialWanita}</span>
                </div>
              )}
            </div>
            <span className="hj-person__nickname">{data.namaWanitaPanggil}</span>
            <span className="hj-person__fullname">{data.namaWanitaLengkap}</span>
            {data.ortuWanita && (
              <p className="hj-person__parents">
                Putri dari<br />
                <span>{data.ortuWanita}</span>
              </p>
            )}
            {data.igWanita && (
              <a href={data.igWanitaUrl} target="_blank" rel="noopener noreferrer" className="hj-person__ig">
                <IgIcon /> {data.igWanita}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COUNTDOWN
// ═══════════════════════════════════════════════════════════════════════════════

function CountdownSection({ data }: { data: InvitationPageProps }) {
  const { ref, visible } = useReveal();
  const cls = `hj-reveal${visible ? " hj-visible" : ""}`;
  const t = useCountdown(data.countdownDate || "");

  return (
    <div className="hj-section hj-section--dark">
      <div className="hj-bat-parang" />
      <div className="hj-section__inner" ref={ref}>

        <div className={`hj-sec-header ${cls}`}>
          <GununganSvg className="hj-sec-icon hj-sec-icon--light" />
          <span className="hj-eyebrow" style={{ color: "var(--hj-gold-soft)" }}>Menuju Hari Bahagia</span>
          <h2 className="hj-sec-title hj-sec-title--light">Hitung Mundur</h2>
        </div>

        <div className={`hj-countdown ${cls} hj-d1`}>
          {data.tanggalHeader && (
            <span className="hj-countdown__date">{data.tanggalHeader}</span>
          )}

          <div className="hj-countdown__grid">
            {[
              { val: String(t.d).padStart(2, "0"), lbl: "Hari" },
              { val: String(t.h).padStart(2, "0"), lbl: "Jam" },
              { val: String(t.m).padStart(2, "0"), lbl: "Menit" },
              { val: String(t.s).padStart(2, "0"), lbl: "Detik" },
            ].map(({ val, lbl }, i) => (
              <div key={i} className="hj-countdown__cell">
                <span className="hj-countdown__num">{val}</span>
                <span className="hj-countdown__lbl">{lbl}</span>
              </div>
            ))}
          </div>

          <MedallionSvg style={{ width: 160, color: "var(--hj-gold-soft)", opacity: 0.35 }} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EVENTS (AKAD & RESEPSI)
// ═══════════════════════════════════════════════════════════════════════════════

function fmtTime(start: string | null, end: string | null) {
  if (!start) return "";
  const s = start.slice(0, 5);
  if (!end || end === "00:00:00") return `${s} WIB`;
  const e = end.slice(0, 5);
  return `${s} – ${e} WIB`;
}

function EventsSection({ data }: { data: InvitationPageProps }) {
  const { ref, visible } = useReveal();
  const cls = (d?: string) => `hj-reveal${visible ? " hj-visible" : ""}${d ? ` ${d}` : ""}`;

  const events = [
    data.akad    && { ...data.akad,   label: "Akad Nikah",           color: "var(--hj-gold)" },
    data.resepsi && { ...data.resepsi, label: "Resepsi Pernikahan",   color: "var(--hj-gold)" },
  ].filter(Boolean) as (NonNullable<typeof data.akad> & { label: string; color: string })[];

  if (events.length === 0) return null;

  return (
    <div className="hj-section hj-section--cream">
      <div className="hj-bat-kawung" />
      <div className="hj-section__inner" ref={ref}>

        <div className={`hj-sec-header ${cls()}`}>
          <span className="hj-eyebrow">Rangkaian Acara</span>
          <h2 className="hj-sec-title">Waktu &amp; Tempat</h2>
          <MedallionSvg style={{ width: 160, color: "var(--hj-gold)", opacity: 0.5 }} />
        </div>

        <div className="hj-events-wrap">
          {events.map((ev, i) => (
            <div key={ev.id} className={`hj-event-card ${cls(`hj-d${i + 1}`)}`}>
              <span className="hj-event-card__badge">{ev.label}</span>
              <h3 className="hj-event-card__title">{ev.name}</h3>

              <div className="hj-event-card__rows">
                {ev.session_date && (
                  <div className="hj-event-card__row">
                    <CalIcon className="hj-event-card__ic" />
                    <span className="hj-event-card__txt">
                      {new Date(ev.session_date).toLocaleDateString("id-ID", {
                        weekday: "long", day: "numeric",
                        month: "long", year: "numeric",
                      })}
                    </span>
                  </div>
                )}
                {ev.time_start && (
                  <div className="hj-event-card__row">
                    <ClockIcon className="hj-event-card__ic" />
                    <span className="hj-event-card__txt">
                      {fmtTime(ev.time_start, ev.time_end)}
                    </span>
                  </div>
                )}
                {ev.venue && (
                  <div className="hj-event-card__row">
                    <PinIcon className="hj-event-card__ic" />
                    <span className="hj-event-card__txt">{ev.venue}</span>
                  </div>
                )}
              </div>

              {ev.venue_maps_url && (
                <a
                  href={ev.venue_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hj-event-card__maps"
                >
                  <PinIcon style={{ width: 12, height: 12 }} />
                  Buka di Maps
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GALLERY
// ═══════════════════════════════════════════════════════════════════════════════

function GallerySection({ data }: { data: InvitationPageProps }) {
  const { ref, visible } = useReveal();
  const cls = `hj-reveal${visible ? " hj-visible" : ""}`;

  const [lightbox, setLightbox] = useState<number | null>(null);
  const urls = data.galleryUrls.filter(Boolean);

  if (urls.length === 0) return null;

  const prev = () => setLightbox((i) => (i == null ? 0 : (i - 1 + urls.length) % urls.length));
  const next = () => setLightbox((i) => (i == null ? 0 : (i + 1) % urls.length));

  return (
    <div className="hj-section hj-section--dark" style={{ padding: "80px 0" }}>
      <div className="hj-bat-parang" />
      <div style={{ position: "relative", zIndex: 1, padding: "0 24px", maxWidth: 480, margin: "0 auto" }}>

        <div className={`hj-sec-header ${cls}`} style={{ color: "var(--hj-cream)" }}>
          <GununganSvg className="hj-sec-icon hj-sec-icon--light" />
          <span className="hj-eyebrow" style={{ color: "var(--hj-gold-soft)" }}>Foto Kenangan</span>
          <h2 className="hj-sec-title hj-sec-title--light">Galeri</h2>
        </div>
      </div>

      <div ref={ref} className={`hj-gallery-grid ${cls} hj-d1`} style={{ maxWidth: 480, margin: "0 auto" }}>
        {urls.slice(0, 7).map((url, i) => (
          <div key={i} className="hj-g-item" onClick={() => setLightbox(i)}>
            <img src={url} alt={`Foto ${i + 1}`} loading="lazy" />
            <div className="hj-g-item__overlay">
              <ExpandIcon style={{ width: 24, height: 24, opacity: 0.9 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="hj-lightbox" onClick={() => setLightbox(null)}>
          <img
            className="hj-lightbox__img"
            src={urls[lightbox]}
            alt={`Foto ${lightbox + 1}`}
            onClick={(e) => e.stopPropagation()}
          />
          <button className="hj-lightbox__close" onClick={() => setLightbox(null)}>×</button>

          {urls.length > 1 && (
            <>
              <button
                className="hj-lightbox__nav hj-lightbox__nav--prev"
                onClick={(e) => { e.stopPropagation(); prev(); }}
              >
                <ChevronLeftIcon style={{ width: 18, height: 18 }} />
              </button>
              <button
                className="hj-lightbox__nav hj-lightbox__nav--next"
                onClick={(e) => { e.stopPropagation(); next(); }}
              >
                <ChevronRightIcon style={{ width: 18, height: 18 }} />
              </button>
            </>
          )}

          <span className="hj-lightbox__counter">
            {lightbox + 1} / {urls.length}
          </span>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOVE STORY
// ═══════════════════════════════════════════════════════════════════════════════

const DEFAULT_LOVE_STORY = [
  { tahun: "Awal Mula", cerita: "Pertemuan pertama yang mengubah segalanya. Sebuah kebetulan yang terasa sudah direncanakan oleh semesta." },
  { tahun: "Semakin Dekat", cerita: "Hari-hari dilalui bersama, berbagi cerita dan tawa, hingga satu sama lain menjadi bagian tak tergantikan." },
  { tahun: "Berkomitmen", cerita: "Dari persahabatan tumbuh cinta, dan dari cinta lahirlah janji untuk saling menjaga selamanya." },
  { tahun: "Lamaran", cerita: "Dengan keberanian dan cinta tulus, sebuah janji diucapkan: mari melangkah bersama menuju kehidupan baru." },
];

function LoveStorySection({ data }: { data: InvitationPageProps }) {
  const { ref, visible } = useReveal();
  const cls = (d?: string) => `hj-reveal${visible ? " hj-visible" : ""}${d ? ` ${d}` : ""}`;

  const entries = data.loveStory?.length ? data.loveStory : DEFAULT_LOVE_STORY;

  return (
    <div className="hj-section hj-section--cream-alt">
      <div className="hj-bat-gringsing" />
      <div className="hj-section__inner" ref={ref}>

        <div className={`hj-sec-header ${cls()}`}>
          <GununganSvg className="hj-sec-icon" />
          <span className="hj-eyebrow">Perjalanan Cinta</span>
          <h2 className="hj-sec-title">Love Story</h2>
          <MedallionSvg style={{ width: 160, color: "var(--hj-gold)", opacity: 0.5 }} />
        </div>

        <div className="hj-timeline">
          {entries.map((e, i) => (
            <div key={i} className={`hj-timeline__entry ${cls(`hj-d${Math.min(i + 1, 6)}`)}`}>
              <div className="hj-timeline__dot" />
              <div className="hj-timeline__year">{e.tahun}</div>
              <p className="hj-timeline__story">{e.cerita}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// WISHES / UCAPAN & DOA
// ═══════════════════════════════════════════════════════════════════════════════

type Wish = { id: string; guest_name: string; message: string; created_at: string };

function WishesSection({
  data, guestId, guestName,
}: { data: InvitationPageProps; guestId: string | null; guestName: string }) {
  const { ref, visible } = useReveal();
  const cls = `hj-reveal${visible ? " hj-visible" : ""}`;

  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName]     = useState(guestName);
  const [msg, setMsg]       = useState("");
  const [busy, setBusy]     = useState(false);
  const [sent, setSent]     = useState(false);

  const fetchWishes = useCallback(async () => {
    try {
      const r = await fetch(`/api/i/${data.slug}/wishes`);
      if (r.ok) {
        const j = await r.json();
        setWishes(j.wishes ?? j ?? []);
      }
    } catch { /* ignore */ }
  }, [data.slug]);

  useEffect(() => {
    fetchWishes();
    const id = setInterval(fetchWishes, 30000);
    return () => clearInterval(id);
  }, [fetchWishes]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!msg.trim()) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/i/${data.slug}/wishes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guest_id: guestId, name: name || guestName || "Tamu", message: msg.trim() }),
      });
      if (r.ok) { setMsg(""); setSent(true); fetchWishes(); }
    } catch { /* ignore */ }
    setBusy(false);
  }

  return (
    <div className="hj-section hj-section--cream">
      <div className="hj-bat-kawung" />
      <div className="hj-section__inner" ref={ref}>

        <div className={`hj-sec-header ${cls}`}>
          <span className="hj-eyebrow">Ucapan &amp; Doa</span>
          <h2 className="hj-sec-title">Tamu Undangan</h2>
          <MedallionSvg style={{ width: 160, color: "var(--hj-gold)", opacity: 0.5 }} />
        </div>

        <div className={`hj-wishes-wrap ${cls} hj-d1`}>
          {!sent ? (
            <form className="hj-wishes-form" onSubmit={handleSubmit}>
              <input
                className="hj-w-input"
                type="text"
                placeholder="Nama Anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
                readOnly={!!guestName}
              />
              <textarea
                className="hj-w-textarea"
                placeholder="Tulis ucapan &amp; doa terbaik..."
                rows={4}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                required
              />
              <button
                type="submit"
                className="hj-w-submit"
                disabled={busy || !msg.trim()}
              >
                {busy ? "Mengirim…" : "Kirim Ucapan"}
              </button>
            </form>
          ) : (
            <p style={{ fontFamily: "var(--hj-font-serif)", fontStyle: "italic", fontSize: 16, color: "var(--hj-muted)", textAlign: "center", padding: "16px 0" }}>
              Terima kasih atas ucapan &amp; doa Anda ✦
            </p>
          )}

          {wishes.length > 0 && (
            <div className="hj-wishes-feed">
              {wishes.map((w) => (
                <div key={w.id} className="hj-wish-card">
                  <div className="hj-wish-card__head">
                    <div className="hj-wish-card__av">
                      <span className="hj-wish-card__av-init">
                        {(w.guest_name || "T")[0].toUpperCase()}
                      </span>
                    </div>
                    <span className="hj-wish-card__name">{w.guest_name || "Tamu"}</span>
                    <span className="hj-wish-card__date">
                      {new Date(w.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                  <p className="hj-wish-card__msg">{w.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GIFT / HADIAH
// ═══════════════════════════════════════════════════════════════════════════════

function GiftSection({ data }: { data: InvitationPageProps }) {
  const { ref, visible } = useReveal();
  const cls = `hj-reveal${visible ? " hj-visible" : ""}`;
  const [copied, setCopied] = useState(false);

  function copyNorek() {
    navigator.clipboard.writeText(data.bankNorek).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const hasBank = data.bankNama && data.bankNorek;
  const hasKado = data.kadoAlamat;
  if (!hasBank && !hasKado) return null;

  return (
    <div className="hj-section hj-section--cream-alt">
      <div className="hj-bat-gringsing" />
      <div className="hj-section__inner" ref={ref}>

        <div className={`hj-sec-header ${cls}`}>
          <GununganSvg className="hj-sec-icon" />
          <span className="hj-eyebrow">Hadiah Pernikahan</span>
          <h2 className="hj-sec-title">Kirim Kado</h2>
          <MedallionSvg style={{ width: 160, color: "var(--hj-gold)", opacity: 0.5 }} />
        </div>

        <div className={`hj-gift-wrap ${cls} hj-d1`}>
          {hasBank && (
            <div className="hj-gift-card">
              <span className="hj-gift-card__badge">Transfer Bank</span>
              <div className="hj-gift-card__bank">{data.bankNama}</div>
              <div className="hj-gift-card__norek-row">
                <span className="hj-gift-card__norek">{data.bankNorek}</span>
                <button
                  className={`hj-gift-card__copy${copied ? " hj-gift-card__copy--done" : ""}`}
                  onClick={copyNorek}
                >
                  {copied ? "Tersalin ✓" : "Salin"}
                </button>
              </div>
              <span className="hj-gift-card__atasnama">a.n. {data.bankAtasnama}</span>
            </div>
          )}

          {hasKado && (
            <div className="hj-gift-card">
              <span className="hj-gift-card__badge">Kirim Kado Fisik</span>
              <div className="hj-gift-card__bank">{data.kadoNama}</div>
              <p style={{ fontFamily: "var(--hj-font-serif)", fontSize: 14, color: "var(--hj-text-mid)", lineHeight: 1.6, fontStyle: "italic" }}>
                {data.kadoAlamat}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════════════════════════

function FooterSection({ data }: { data: InvitationPageProps }) {
  const { ref, visible } = useReveal();
  const cls = `hj-reveal${visible ? " hj-visible" : ""}`;

  const closing = data.closingText || "Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu. Atas kehadiran dan doa restunya, kami mengucapkan terima kasih.";

  return (
    <div className="hj-section hj-section--dark" style={{ padding: 0 }}>
      <div className="hj-bat-parang" />

      {/* Top ornamental border */}
      <div style={{ position: "relative", zIndex: 1, overflow: "hidden", height: 40 }}>
        <MedallionSvg style={{ width: "100%", maxWidth: 480, margin: "10px auto 0", display: "block", color: "var(--hj-gold)", opacity: 0.3 }} />
      </div>

      <div className="hj-footer" ref={ref}>

        <div className={`${cls} hj-text-c`}>
          <GununganSvg style={{ width: 60, height: 96, color: "var(--hj-gold)", opacity: 0.35, margin: "0 auto" }} />
        </div>

        <p className={`hj-footer__closing ${cls} hj-d1`}>{closing}</p>

        <MedallionSvg className={`${cls} hj-d2`} style={{ width: 160, color: "var(--hj-gold)", opacity: 0.3 }} />

        <div className={`hj-footer__names ${cls} hj-d3`}>
          {data.namaPriaPanggil}
          <span className="hj-footer__amp">&amp;</span>
          {data.namaWanitaPanggil}
        </div>

        {data.hashtag && (
          <span className={`hj-footer__hashtag ${cls} hj-d4`}>#{data.hashtag}</span>
        )}

        <div className={`hj-footer__brand ${cls} hj-d5`}>
          Made with ♥ by NIKAHKU
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MUSIC PLAYER (FAB)
// ═══════════════════════════════════════════════════════════════════════════════

function MusicPlayer({ src, playing, onToggle }: { src: string; playing: boolean; onToggle: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.play().catch(() => {});
    else audio.pause();
  }, [playing]);

  if (!src) return null;

  return (
    <div className="hj-music">
      <audio ref={audioRef} src={src} loop preload="none" />
      <button
        className={`hj-music__btn${playing ? " hj-music__btn--playing" : ""}`}
        onClick={onToggle}
        aria-label={playing ? "Pause musik" : "Putar musik"}
      >
        {playing ? <PauseIcon style={{ width: 20, height: 20 }} /> : <PlayIcon style={{ width: 20, height: 20 }} />}
      </button>
      <span className="hj-music__lbl">{playing ? "Playing" : "Music"}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// INLINE SVG ICONS (no FontAwesome dependency)
// ═══════════════════════════════════════════════════════════════════════════════

function IgIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5"/>
      <circle cx="12" cy="12" r="5"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}
function CalIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8"  y1="2" x2="8"  y2="6"/>
      <line x1="3"  y1="10" x2="21" y2="10"/>
    </svg>
  );
}
function ClockIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
function PinIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function PlayIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  );
}
function PauseIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="6"  y="4" width="4" height="16"/>
      <rect x="14" y="4" width="4" height="16"/>
    </svg>
  );
}
function ExpandIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
    </svg>
  );
}
function ChevronLeftIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  );
}
function ChevronRightIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function Heritage01Jawa({ data }: { data: InvitationPageProps }) {
  const isPreview = !!data.preview;

  const [opened,       setOpened]       = useState(isPreview);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [guestName,    setGuestName]    = useState("");
  const [guestId,      setGuestId]      = useState<string | null>(null);

  // ── Dynamic font loading ──────────────────────────────────────────────────
  useEffect(() => {
    if (data.fontHeadingName) loadGoogleFont(data.fontHeadingName);
    if (data.fontBodyName)    loadGoogleFont(data.fontBodyName);
  }, [data.fontHeadingName, data.fontBodyName]);

  // ── Guest lookup ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (isPreview) return;
    const p = new URLSearchParams(window.location.search);
    const to = p.get("to");
    if (to) { setGuestName(decodeURIComponent(to)); return; }
    const g = p.get("g");
    if (g) {
      fetch(`/api/i/${data.slug}/guest?g=${encodeURIComponent(g)}`)
        .then((r) => r.ok ? r.json() : null)
        .then((d) => {
          if (d?.name) setGuestName(d.name);
          if (d?.id)   setGuestId(d.id);
        })
        .catch(() => {});
    }
  }, [data.slug, isPreview]);

  // ── Scroll lock when cover is visible ────────────────────────────────────
  useEffect(() => {
    if (isPreview) return;
    document.body.style.overflow = opened ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [opened, isPreview]);

  function handleOpen() {
    setOpened(true);
    document.body.style.overflow = "";
    if (data.musicUrl) setMusicPlaying(true);
  }

  // ── Build CSS variables for theme color + custom fonts ──────────────────
  const containerStyle: React.CSSProperties = {
    "--hj-accent":     data.themeColor ?? "#8B6F4E",
    ...(data.fontHeadingName ? {
      "--hj-font-heading": `'${data.fontHeadingName}', serif`,
      "--hj-font-display": `'${data.fontHeadingName}', serif`,
    } : {}),
    ...(data.fontBodyName ? {
      "--hj-font-body": `'${data.fontBodyName}', sans-serif`,
    } : {}),
  } as React.CSSProperties;

  return (
    <div className="hj" style={containerStyle}>
      {!opened && (
        <CoverSection data={data} guestName={guestName} onOpen={handleOpen} />
      )}

      {opened && (
        <>
          <OpeningSection   data={data} />
          <CoupleSection    data={data} />
          <CountdownSection data={data} />
          <EventsSection    data={data} />
          <GallerySection   data={data} />
          <LoveStorySection data={data} />
          {data.showWishes && (
            <WishesSection data={data} guestId={guestId} guestName={guestName} />
          )}
          <GiftSection   data={data} />
          <FooterSection data={data} />
        </>
      )}

      <MusicPlayer
        src={data.musicUrl}
        playing={musicPlaying}
        onToggle={() => setMusicPlaying((p) => !p)}
      />
    </div>
  );
}
