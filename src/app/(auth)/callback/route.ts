import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Only allow redirects to internal paths (prevents open-redirect attacks)
function isSafeRedirectPath(path: string): boolean {
  return (
    typeof path === "string" &&
    path.startsWith("/") &&
    !path.startsWith("//") &&
    !path.includes("://")
  );
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Safe redirect to requested path (if valid internal path)
        if (next && isSafeRedirectPath(next)) {
          return NextResponse.redirect(`${origin}${next}`);
        }

        // Check if user already has a wedding profile
        const { data: wedding } = await supabase
          .from("weddings")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (wedding) {
          return NextResponse.redirect(`${origin}/dashboard`);
        }

        // Check if user has a pending/accepted partner invite
        if (user.email) {
          const { data: partnerWedding } = await supabase
            .from("weddings")
            .select("id, partner_status")
            .eq("partner_email", user.email)
            .in("partner_status", ["pending", "accepted"])
            .maybeSingle();

          if (partnerWedding) {
            return NextResponse.redirect(`${origin}/dashboard`);
          }
        }

        // No wedding and no invite — go to onboarding
        return NextResponse.redirect(`${origin}/onboarding`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
