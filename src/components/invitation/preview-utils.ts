import type { InvitationPageProps, SessionData } from "./types";
import type { Tables } from "@/lib/supabase/database.types";

// ─── Color Swatches (shared with dashboard) ────────────────────────────────────

export const COLOR_SWATCHES = [
  { label: "Warm Gold", hex: "#8B6F4E" },
  { label: "Dusty Rose", hex: "#C4837A" },
  { label: "Sage", hex: "#6B7C5C" },
  { label: "Navy", hex: "#2C4A7C" },
  { label: "Blush", hex: "#D4928A" },
  { label: "Terracotta", hex: "#C07858" },
  { label: "Mauve", hex: "#9E7D9E" },
  { label: "Slate", hex: "#5A7A8A" },
];

// ─── Date helpers (mirrors /i/[slug]/page.tsx) ──────────────────────────────────

function formatDateShort(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd} . ${mm} . ${yy}`;
}

function formatDateLong(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateCountdown(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return (
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
    " 0:00:00"
  );
}

// ─── Form Data Types (mirrors dashboard page) ───────────────────────────────────

export interface GiftAccount {
  id: string;
  bank: string;
  account_number: string;
  account_name: string;
}

export interface LoveStoryEntry {
  id: string;
  tahun: string;
  cerita: string;
}

export interface PreviewFormData {
  template: string;
  groom_full_name: string;
  groom_nickname: string;
  groom_parents: string;
  groom_instagram: string;
  bride_full_name: string;
  bride_nickname: string;
  bride_parents: string;
  bride_instagram: string;
  opening_text: string;
  ayat_source: string;
  love_story: LoveStoryEntry[];
  gift_accounts: GiftAccount[];
  closing_text: string;
  hashtag: string;
  groom_photo_url: string;
  bride_photo_url: string;
  gallery_urls: string[];
  font_heading: string;
  font_body: string;
  font_heading_name: string;
  font_body_name: string;
  theme_color: string;
  show_rsvp: boolean;
  show_wishes: boolean;
}

// ─── Conversion function ────────────────────────────────────────────────────────

export function formDataToPreviewProps(
  formData: PreviewFormData,
  wedding: Tables<"weddings">,
  sessions: SessionData[],
): InvitationPageProps {
  const akad = sessions[0] ?? null;
  const resepsi = sessions[1] ?? null;

  const namaWanitaPanggil = formData.bride_nickname || wedding.partner_1_name || "";
  const namaWanitaLengkap = formData.bride_full_name || wedding.partner_1_name || "";
  const namaPriaPanggil = formData.groom_nickname || wedding.partner_2_name || "";
  const namaPriaLengkap = formData.groom_full_name || wedding.partner_2_name || "";

  const tanggalRef = akad?.session_date ?? wedding.wedding_date ?? null;

  const firstGift = formData.gift_accounts[0];

  return {
    preview: true,

    namaWanitaPanggil,
    namaWanitaLengkap,
    inisialWanita: namaWanitaPanggil.charAt(0).toUpperCase(),
    ortuWanita: formData.bride_parents ?? "",
    igWanita: formData.bride_instagram ?? "",
    igWanitaUrl: formData.bride_instagram
      ? `https://www.instagram.com/${formData.bride_instagram.replace(/^@/, "")}`
      : "",

    namaPriaPanggil,
    namaPriaLengkap,
    inisialPria: namaPriaPanggil.charAt(0).toUpperCase(),
    ortuPria: formData.groom_parents ?? "",
    igPria: formData.groom_instagram ?? "",
    igPriaUrl: formData.groom_instagram
      ? `https://www.instagram.com/${formData.groom_instagram.replace(/^@/, "")}`
      : "",

    tanggalSingkat: formatDateShort(tanggalRef),
    tanggalHeader: formatDateLong(tanggalRef),
    countdownDate: formatDateCountdown(tanggalRef),

    akad,
    resepsi,

    themeColor: formData.theme_color || "#8B6F4E",
    fontHeading: formData.font_heading || "playfair",
    fontBody: formData.font_body || "dmsans",
    fontHeadingName: formData.font_heading_name || undefined,
    fontBodyName: formData.font_body_name || undefined,

    openingText: formData.opening_text ?? "",
    ayatSource: formData.ayat_source ?? "",
    closingText: formData.closing_text ?? "",

    galleryUrls: formData.gallery_urls ?? [],
    musicUrl: "",
    heroPhotoUrl: null,
    groomPhotoUrl: formData.groom_photo_url || null,
    bridePhotoUrl: formData.bride_photo_url || null,
    hashtag:
      formData.hashtag ||
      `${namaPriaPanggil}${namaWanitaPanggil}`.replace(/\s/g, ""),

    loveStory: formData.love_story.map((e) => ({
      tahun: e.tahun,
      cerita: e.cerita,
    })),

    bankNama: firstGift?.bank ?? "",
    bankNorek: firstGift?.account_number ?? "",
    bankAtasnama: firstGift?.account_name ?? namaWanitaLengkap,
    kadoNama: namaWanitaLengkap,
    kadoAlamat: "",

    slug: "",
    weddingId: wedding.id,
    rsvpMaxPax: wedding.rsvp_max_pax_per_guest ?? 2,
    rsvpEnabled: wedding.rsvp_enabled,
    showRsvp: formData.show_rsvp,
    showWishes: formData.show_wishes,
    sessions,
  };
}
