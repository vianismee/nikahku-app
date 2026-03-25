import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/onboarding";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if user has completed onboarding
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // TODO: Check if wedding profile exists, redirect to dashboard if so
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Auth code error — redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
