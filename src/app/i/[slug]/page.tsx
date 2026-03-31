import { getInvitation, type InvitationWithSessions } from "@/app/actions/invitation";
import Heritage01Jawa from "@/components/invitation/heritage-01-jawa";
import type { Metadata } from "next";

// ─── Types ──────────────────────────────────────────────────────────────────────

export type { InvitationPageProps } from "@/components/invitation/types";
import type { InvitationPageProps } from "@/components/invitation/types";

// ─── Date helpers ───────────────────────────────────────────────────────────────

function formatDateLong(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateShort(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd} . ${mm} . ${yy}`;
}

function formatDateCountdown(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return (
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) + " 0:00:00"
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const inv = await getInvitation(slug);
  if (!inv) return { title: "Undangan Tidak Ditemukan" };

  const bride = inv.bride_nickname ?? inv.bride_full_name ?? inv.wedding.partner_1_name;
  const groom = inv.groom_nickname ?? inv.groom_full_name ?? inv.wedding.partner_2_name;

  return {
    title: `${bride} & ${groom} - Undangan Pernikahan`,
    description: `Undangan Pernikahan ${bride} & ${groom}`,
  };
}

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const inv = await getInvitation(slug);

  if (!inv) {
    return (
      <html lang="id">
        <body
          style={{
            fontFamily: "sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            margin: 0,
            background: "#faf9f7",
          }}
        >
          <div style={{ textAlign: "center", padding: 32 }}>
            <p style={{ fontSize: "1.2rem", fontWeight: 600, color: "#1a1a1a", marginBottom: 8 }}>
              Undangan tidak ditemukan
            </p>
            <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
              Periksa kembali link undangan Anda
            </p>
          </div>
        </body>
      </html>
    );
  }

  const { wedding, sessions } = inv;
  const akad = sessions[0] ?? null;
  const resepsi = sessions[1] ?? null;

  const namaWanitaPanggil =
    inv.bride_nickname ?? inv.bride_full_name ?? wedding.partner_1_name;
  const namaWanitaLengkap = inv.bride_full_name ?? wedding.partner_1_name;
  const namaPriaPanggil =
    inv.groom_nickname ?? inv.groom_full_name ?? wedding.partner_2_name;
  const namaPriaLengkap = inv.groom_full_name ?? wedding.partner_2_name;

  const tanggalRef = akad?.session_date ?? wedding.wedding_date ?? null;

  // Gallery
  const galleryUrls = inv.gallery_urls ?? [];

  // Love story
  type LSEntry = { tahun: string; cerita: string };
  let loveStory: LSEntry[] = [];
  try {
    if (inv.love_story_text) {
      loveStory = JSON.parse(inv.love_story_text) as LSEntry[];
    }
  } catch {
    /* use default */
  }

  const pageData: InvitationPageProps = {
    namaWanitaPanggil,
    namaWanitaLengkap,
    inisialWanita: namaWanitaPanggil.charAt(0).toUpperCase(),
    ortuWanita: inv.bride_parents ?? "",
    igWanita: "",
    igWanitaUrl: "https://www.instagram.com/",

    namaPriaPanggil,
    namaPriaLengkap,
    inisialPria: namaPriaPanggil.charAt(0).toUpperCase(),
    ortuPria: inv.groom_parents ?? "",
    igPria: "",
    igPriaUrl: "https://www.instagram.com/",

    tanggalSingkat: formatDateShort(tanggalRef),
    tanggalHeader: formatDateLong(tanggalRef),
    countdownDate: formatDateCountdown(tanggalRef),

    akad,
    resepsi,

    galleryUrls,
    musicUrl: "",
    heroPhotoUrl: inv.hero_photo_url ?? null,
    hashtag: inv.hashtag ?? `${namaPriaPanggil}${namaWanitaPanggil}`.replace(/\s/g, ""),

    loveStory,

    bankNama: "",
    bankNorek: "",
    bankAtasnama: namaWanitaLengkap,
    kadoNama: namaWanitaLengkap,
    kadoAlamat: "",

    slug,
    weddingId: wedding.id,
    rsvpMaxPax: wedding.rsvp_max_pax_per_guest ?? 2,
    rsvpEnabled: wedding.rsvp_enabled,
    showRsvp: inv.show_rsvp,
    showWishes: inv.show_wishes,
    sessions,
  };

  return <Heritage01Jawa data={pageData} />;
}
