import { NextRequest, NextResponse } from "next/server";
import { lookupGuestByNanoId } from "@/app/actions/rsvp";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const gCode = req.nextUrl.searchParams.get("g")?.toUpperCase();

  if (!gCode || gCode.length !== 5) {
    return NextResponse.json({ error: "Kode tidak valid" }, { status: 400 });
  }

  const guest = await lookupGuestByNanoId(slug, gCode);

  if (!guest) {
    return NextResponse.json({ error: "Kode tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ guest });
}
