import { NextRequest, NextResponse } from "next/server";
import { updateGuestRsvpPublic } from "@/app/actions/rsvp";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let body: { gCode?: string; rsvp_status?: string; pax_count?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const { gCode, rsvp_status, pax_count } = body;

  if (!gCode || (rsvp_status !== "hadir" && rsvp_status !== "tidak_hadir")) {
    return NextResponse.json({ error: "Parameter tidak lengkap" }, { status: 400 });
  }

  const res = await updateGuestRsvpPublic(slug, gCode.toUpperCase(), {
    rsvp_status,
    pax_count: pax_count ?? 1,
  });

  if (!res.success) {
    return NextResponse.json({ error: res.error }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
