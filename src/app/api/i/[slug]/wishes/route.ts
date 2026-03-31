import { NextRequest, NextResponse } from "next/server";
import {
  getWishes,
  submitWish,
  updateWish,
  getExistingWish,
  lookupGuestByNanoId,
} from "@/app/actions/rsvp";
import { getInvitation } from "@/app/actions/invitation";

// slug = rsvp_slug (sama dengan yang dipakai di /i/[slug] dan /rsvp/[slug])

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const inv = await getInvitation(slug);
  if (!inv) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });

  const wishes = await getWishes(inv.wedding_id);
  return NextResponse.json({ wishes });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let body: { gCode?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const { gCode, message } = body;

  if (!gCode || !message?.trim()) {
    return NextResponse.json({ error: "Parameter tidak lengkap" }, { status: 400 });
  }

  const inv = await getInvitation(slug);
  if (!inv) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });

  const guest = await lookupGuestByNanoId(slug, gCode.toUpperCase());
  if (!guest) return NextResponse.json({ error: "Tamu tidak ditemukan" }, { status: 404 });

  const existing = await getExistingWish(inv.wedding_id, guest.id);

  const res = existing
    ? await updateWish(existing.id, guest.id, message.trim())
    : await submitWish(inv.wedding_id, guest.id, guest.name, message.trim());

  if (!res.success) {
    return NextResponse.json({ error: res.error }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
