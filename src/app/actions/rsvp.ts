"use server";

import { createClient } from "@/lib/supabase/server";

// ─── Types ────────────────────────────────────────────────────────────────────

export type GuestPublic = {
  id: string;
  name: string;
  pax_count: number;
  rsvp_status: "belum_diundang" | "undangan_terkirim" | "hadir" | "tidak_hadir" | "belum_konfirmasi";
  nano_id: string;
  souvenir_taken: boolean;
  souvenir_taken_at: string | null;
  sessions: {
    id: string;
    name: string;
    session_date: string | null;
    time_start: string | null;
    time_end: string | null;
    venue: string | null;
  }[];
};

export type WishPublic = {
  id: string;
  guest_id: string | null;
  guest_name: string;
  message: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
};

export type GuestScanResult = {
  id: string;
  name: string;
  pax_count: number;
  nano_id: string;
  souvenir_taken: boolean;
  souvenir_taken_at: string | null;
  souvenir_taken_by: string | null;
  sessions: string[];
};

type WeddingRsvpConfig = {
  id: string;
  rsvp_enabled: boolean;
  rsvp_closes_at: string | null;
  rsvp_max_pax_per_guest: number;
  scanner_pin: string | null;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getWeddingBySlug(slug: string): Promise<WeddingRsvpConfig | null> {
  const supabase = await createClient();
  const { data } = await (supabase as ReturnType<typeof supabase.from> extends never
    ? never
    : typeof supabase)
    .from("weddings")
    .select("id, rsvp_enabled, rsvp_closes_at, rsvp_max_pax_per_guest, scanner_pin")
    .eq("rsvp_slug", slug)
    .single() as unknown as { data: WeddingRsvpConfig | null };
  return data;
}

// ─── RSVP ─────────────────────────────────────────────────────────────────────

export async function lookupGuestByNanoId(
  slug: string,
  nanoId: string
): Promise<GuestPublic | null> {
  const wedding = await getWeddingBySlug(slug);
  if (!wedding?.rsvp_enabled) return null;
  if (wedding.rsvp_closes_at && new Date(wedding.rsvp_closes_at) < new Date()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("guests")
    .select("id, name, pax_count, rsvp_status, nano_id, souvenir_taken, souvenir_taken_at, guest_sessions(sessions(id, name, session_date, time_start, time_end, venue))")
    .eq("wedding_id", wedding.id)
    .eq("nano_id", nanoId.toUpperCase())
    .single() as unknown as {
      data: {
        id: string; name: string; pax_count: number;
        rsvp_status: GuestPublic["rsvp_status"];
        nano_id: string; souvenir_taken: boolean; souvenir_taken_at: string | null;
        guest_sessions: { sessions: GuestPublic["sessions"][number] | null }[];
      } | null;
      error: unknown;
    };

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.name,
    pax_count: data.pax_count,
    rsvp_status: data.rsvp_status,
    nano_id: data.nano_id,
    souvenir_taken: data.souvenir_taken,
    souvenir_taken_at: data.souvenir_taken_at,
    sessions: data.guest_sessions
      .map((gs) => gs.sessions)
      .filter((s): s is GuestPublic["sessions"][number] => s !== null),
  };
}

export async function updateGuestRsvpPublic(
  slug: string,
  nanoId: string,
  data: { rsvp_status: "hadir" | "tidak_hadir"; pax_count: number }
): Promise<{ success: boolean; error?: string }> {
  const wedding = await getWeddingBySlug(slug);
  if (!wedding?.rsvp_enabled) return { success: false, error: "RSVP tidak aktif" };
  if (wedding.rsvp_closes_at && new Date(wedding.rsvp_closes_at) < new Date()) {
    return { success: false, error: "Batas waktu RSVP sudah berakhir" };
  }

  const pax = Math.min(Math.max(1, data.pax_count), wedding.rsvp_max_pax_per_guest);
  const supabase = await createClient();
  const { error } = await supabase
    .from("guests")
    .update({ rsvp_status: data.rsvp_status, pax_count: pax } as never)
    .eq("wedding_id", wedding.id)
    .eq("nano_id", nanoId.toUpperCase());

  if (error) return { success: false, error: (error as { message: string }).message };
  return { success: true };
}

// ─── Wishes ───────────────────────────────────────────────────────────────────

export async function getExistingWish(
  weddingId: string,
  guestId: string
): Promise<WishPublic | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("wishes")
    .select("id, guest_id, guest_name, message, is_visible, created_at, updated_at")
    .eq("wedding_id", weddingId)
    .eq("guest_id", guestId)
    .single() as unknown as { data: WishPublic | null };
  return data;
}

export async function submitWish(
  weddingId: string,
  guestId: string,
  guestName: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  if (!message.trim() || message.length > 500) {
    return { success: false, error: "Pesan tidak valid (maks. 500 karakter)" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("wishes")
    .insert({
      wedding_id: weddingId,
      guest_id: guestId,
      guest_name: guestName.trim(),
      message: message.trim(),
    } as never);

  if (error) {
    const err = error as { code?: string; message: string };
    if (err.code === "23505") {
      return { success: false, error: "Anda sudah mengirimkan ucapan sebelumnya" };
    }
    return { success: false, error: err.message };
  }
  return { success: true };
}

export async function updateWish(
  wishId: string,
  guestId: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  if (!message.trim() || message.length > 500) {
    return { success: false, error: "Pesan tidak valid (maks. 500 karakter)" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("wishes")
    .update({ message: message.trim() } as never)
    .eq("id", wishId)
    .eq("guest_id", guestId);

  if (error) return { success: false, error: (error as { message: string }).message };
  return { success: true };
}

export async function getWishes(weddingId: string, limit = 50): Promise<WishPublic[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("wishes")
    .select("id, guest_id, guest_name, message, is_visible, created_at, updated_at")
    .eq("wedding_id", weddingId)
    .eq("is_visible", true)
    .order("created_at", { ascending: false })
    .limit(limit) as unknown as { data: WishPublic[] | null };
  return data ?? [];
}

// ─── QR Scanner ───────────────────────────────────────────────────────────────

export async function getGuestForScanner(
  slug: string,
  nanoId: string
): Promise<GuestScanResult | null> {
  const wedding = await getWeddingBySlug(slug);
  if (!wedding) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("guests")
    .select("id, name, pax_count, nano_id, souvenir_taken, souvenir_taken_at, souvenir_taken_by, guest_sessions(sessions(name))")
    .eq("wedding_id", wedding.id)
    .eq("nano_id", nanoId.toUpperCase())
    .single() as unknown as {
      data: {
        id: string; name: string; pax_count: number; nano_id: string;
        souvenir_taken: boolean; souvenir_taken_at: string | null; souvenir_taken_by: string | null;
        guest_sessions: { sessions: { name: string } | null }[];
      } | null;
      error: unknown;
    };

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.name,
    pax_count: data.pax_count,
    nano_id: data.nano_id,
    souvenir_taken: data.souvenir_taken,
    souvenir_taken_at: data.souvenir_taken_at,
    souvenir_taken_by: data.souvenir_taken_by,
    sessions: data.guest_sessions.map((gs) => gs.sessions?.name).filter((n): n is string => !!n),
  };
}

export async function markSouvenirTaken(
  slug: string,
  nanoId: string,
  takenBy: string
): Promise<{ success: boolean; alreadyTaken: boolean; takenAt?: string }> {
  const wedding = await getWeddingBySlug(slug);
  if (!wedding) return { success: false, alreadyTaken: false };

  const supabase = await createClient();
  const { data: guest } = await supabase
    .from("guests")
    .select("souvenir_taken, souvenir_taken_at")
    .eq("wedding_id", wedding.id)
    .eq("nano_id", nanoId.toUpperCase())
    .single() as unknown as {
      data: { souvenir_taken: boolean; souvenir_taken_at: string | null } | null;
    };

  if (!guest) return { success: false, alreadyTaken: false };
  if (guest.souvenir_taken) {
    return { success: false, alreadyTaken: true, takenAt: guest.souvenir_taken_at ?? undefined };
  }

  const now = new Date().toISOString();
  const { error } = await supabase
    .from("guests")
    .update({
      souvenir_taken: true,
      souvenir_taken_at: now,
      souvenir_taken_by: takenBy.trim() || "Petugas",
    } as never)
    .eq("wedding_id", wedding.id)
    .eq("nano_id", nanoId.toUpperCase());

  if (error) return { success: false, alreadyTaken: false };
  return { success: true, alreadyTaken: false, takenAt: now };
}
