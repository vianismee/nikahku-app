import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
        // If explicit next param provided, use it
        if (next) {
          return NextResponse.redirect(`${origin}${next}`);
        }

        // Check if user already has a wedding profile
        const { data: wedding } = await supabase
          .from("weddings")
          .select("id")
          .eq("user_id", user.id)
          .single();

        const destination = wedding ? "/dashboard" : "/onboarding";
        return NextResponse.redirect(`${origin}${destination}`);
      }
    }
  }

  // Auth code error — redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
