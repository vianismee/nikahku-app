import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// In-memory rate limiter for auth routes (Edge-compatible via globalThis)
// For multi-instance / serverless deployments, replace with Upstash Redis:
//   https://upstash.com/docs/redis/sdks/ratelimit-ts/overview
// ---------------------------------------------------------------------------
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const AUTH_RATE_LIMIT_MAX = 10; // max requests
const AUTH_RATE_LIMIT_WINDOW_MS = 60_000; // per 60 seconds

function checkRateLimit(ip: string): boolean {
  const store = (globalThis as Record<string, unknown>).__rateLimitStore as
    | Map<string, RateLimitEntry>
    | undefined;

  let map: Map<string, RateLimitEntry>;
  if (!store) {
    map = new Map();
    (globalThis as Record<string, unknown>).__rateLimitStore = map;
  } else {
    map = store;
  }

  const now = Date.now();
  const entry = map.get(ip);

  if (!entry || entry.resetAt < now) {
    map.set(ip, { count: 1, resetAt: now + AUTH_RATE_LIMIT_WINDOW_MS });
    return true; // allowed
  }

  if (entry.count >= AUTH_RATE_LIMIT_MAX) {
    return false; // blocked
  }

  entry.count++;
  return true; // allowed
}

// ---------------------------------------------------------------------------
// Security headers added to every response
// ---------------------------------------------------------------------------
const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-XSS-Protection": "1; mode=block",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=()",
};

function applySecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

// ---------------------------------------------------------------------------
// Auth routes that should be rate-limited
// ---------------------------------------------------------------------------
const RATE_LIMITED_PATHS = ["/login", "/register"];

export async function updateSession(request: NextRequest) {
  // --- Rate limit auth pages ---
  const pathname = request.nextUrl.pathname;
  if (RATE_LIMITED_PATHS.includes(pathname) && request.method === "POST") {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    if (!checkRateLimit(ip)) {
      const response = new NextResponse(
        JSON.stringify({ error: "Terlalu banyak percobaan, coba lagi nanti" }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
      applySecurityHeaders(response);
      response.headers.set("Retry-After", "60");
      return response;
    }
  }

  // --- Supabase session refresh ---
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session — important for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- Route protection ---
  const guestOnlyRoutes = ["/login", "/register"];
  const publicRoutes = ["/", "/offline"];
  const isGuestOnly = guestOnlyRoutes.includes(pathname);
  const isPublic =
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/callback") ||
    pathname.startsWith("/rsvp");

  if (!user && !isGuestOnly && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    const redirectResponse = NextResponse.redirect(url);
    applySecurityHeaders(redirectResponse);
    return redirectResponse;
  }

  if (user && isGuestOnly) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    const redirectResponse = NextResponse.redirect(url);
    applySecurityHeaders(redirectResponse);
    return redirectResponse;
  }

  applySecurityHeaders(supabaseResponse);
  return supabaseResponse;
}
