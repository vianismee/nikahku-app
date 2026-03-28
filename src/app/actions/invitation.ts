"use server";

import { createClient } from "@/lib/supabase/server";
import type { Tables, InsertTables } from "@/lib/supabase/database.types";

export type InvitationWithSessions = Tables<"invitations"> & {
  wedding: {
    id: string;
    partner_1_name: string;
    partner_2_name: string;
    wedding_date: string;
    venue_city: string | null;
    rsvp_enabled: boolean;
    rsvp_slug: string | null;
    rsvp_closes_at: string | null;
    rsvp_max_pax_per_guest: number;
    scanner_pin: string | null;
  };
  sessions: {
    id: string;
    name: string;
    session_date: string | null;
    time_start: string | null;
    time_end: string | null;
    venue: string | null;
    max_capacity: number | null;
  }[];
};

/**
 * Ambil invitation beserta data wedding + sessions untuk halaman publik /i/[slug].
 * Lookup by weddings.rsvp_slug — tidak butuh invitations record.
 */
export async function getInvitation(
  slug: string
): Promise<InvitationWithSessions | null> {
  const supabase = await createClient();

  // Lookup wedding by rsvp_slug
  const { data: wedding } = await supabase
    .from("weddings")
    .select(
      "id, partner_1_name, partner_2_name, wedding_date, venue_city, rsvp_enabled, rsvp_slug, rsvp_closes_at, rsvp_max_pax_per_guest, scanner_pin"
    )
    .eq("rsvp_slug", slug)
    .single() as unknown as { data: InvitationWithSessions["wedding"] | null };

  if (!wedding) return null;

  // Ambil invitation record jika ada (opsional — untuk template/hashtag/show_wishes)
  const { data: inv } = await supabase
    .from("invitations")
    .select("*")
    .eq("wedding_id", wedding.id)
    .single() as unknown as { data: Tables<"invitations"> | null };

  // Ambil sessions
  const { data: sessions } = await supabase
    .from("sessions")
    .select("id, name, session_date, time_start, time_end, venue, max_capacity")
    .eq("wedding_id", wedding.id)
    .order("sort_order") as unknown as {
      data: InvitationWithSessions["sessions"] | null;
    };

  const coupleName = `${wedding.partner_1_name} & ${wedding.partner_2_name}`;

  return {
    id: inv?.id ?? "",
    wedding_id: wedding.id,
    slug,
    published: true,
    headline: inv?.headline ?? coupleName,
    opening_text: inv?.opening_text ?? null,
    closing_text: inv?.closing_text ?? null,
    groom_full_name: inv?.groom_full_name ?? null,
    bride_full_name: inv?.bride_full_name ?? null,
    groom_nickname: inv?.groom_nickname ?? null,
    bride_nickname: inv?.bride_nickname ?? null,
    groom_parents: inv?.groom_parents ?? null,
    bride_parents: inv?.bride_parents ?? null,
    hero_photo_url: inv?.hero_photo_url ?? null,
    gallery_urls: inv?.gallery_urls ?? [],
    template: inv?.template ?? "classic",
    theme_color: inv?.theme_color ?? "#8B6F4E",
    font_heading: inv?.font_heading ?? "playfair",
    hashtag: inv?.hashtag ?? null,
    love_story_text: inv?.love_story_text ?? null,
    show_rsvp: inv?.show_rsvp ?? true,
    show_wishes: inv?.show_wishes ?? true,
    updated_at: inv?.updated_at ?? new Date().toISOString(),
    wedding,
    sessions: sessions ?? [],
  };
}

/**
 * Ambil invitation milik wedding yang sedang login (untuk dashboard).
 */
export async function getMyInvitation(
  weddingId: string
): Promise<Tables<"invitations"> | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("invitations")
    .select("*")
    .eq("wedding_id", weddingId)
    .single() as unknown as { data: Tables<"invitations"> | null };
  return data ?? null;
}

/**
 * Buat atau update invitation. Upsert by wedding_id.
 */
export async function upsertInvitation(
  weddingId: string,
  input: Omit<InsertTables<"invitations">, "wedding_id">
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // Pastikan user adalah owner wedding ini
  const { data: wedding } = await supabase
    .from("weddings")
    .select("id")
    .eq("id", weddingId)
    .single() as unknown as { data: { id: string } | null };

  if (!wedding) return { success: false, error: "Wedding tidak ditemukan" };

  const { error } = await supabase.from("invitations").upsert(
    { ...input, wedding_id: weddingId } as never,
    { onConflict: "wedding_id" }
  );

  if (error) return { success: false, error: (error as { message: string }).message };
  return { success: true };
}

/**
 * Toggle published status.
 */
export async function publishInvitation(
  weddingId: string,
  published: boolean
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("invitations")
    .update({ published } as never)
    .eq("wedding_id", weddingId);

  if (error) return { success: false, error: (error as { message: string }).message };
  return { success: true };
}

/**
 * Update RSVP config di tabel weddings.
 */
export async function updateRsvpConfig(
  weddingId: string,
  config: {
    rsvp_enabled?: boolean;
    rsvp_slug?: string;
    rsvp_closes_at?: string | null;
    rsvp_max_pax_per_guest?: number;
    scanner_pin?: string | null;
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("weddings")
    .update(config as never)
    .eq("id", weddingId);

  if (error) return { success: false, error: (error as { message: string }).message };
  return { success: true };
}
