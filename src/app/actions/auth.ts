"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginRateLimit, registerRateLimit, otpRateLimit } from "@/lib/rate-limit";
import { loginSchema, registerSchema, otpRequestSchema } from "@/lib/validation/auth";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getClientIp(): Promise<string> {
  const headersList = await headers();
  return (
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown"
  );
}

// ---------------------------------------------------------------------------
// Auth actions
// ---------------------------------------------------------------------------

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function loginWithEmail(formData: { email: string; password: string }) {
  const ip = await getClientIp();

  // Rate limit: 5 attempts per minute per IP
  const rl = loginRateLimit(ip);
  if (!rl.success) {
    return { error: "Terlalu banyak percobaan login, coba lagi nanti" };
  }

  // Validate input
  const parsed = loginSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Email atau password salah" };
    }
    if (error.message.includes("Email not confirmed")) {
      return { error: "Email belum dikonfirmasi, cek inbox kamu" };
    }
    return { error: "Login gagal, coba lagi" };
  }

  return { success: true };
}

export async function registerWithEmail(formData: {
  fullName: string;
  email: string;
  password: string;
}) {
  const ip = await getClientIp();

  // Rate limit: 3 registrations per hour per IP
  const rl = registerRateLimit(ip);
  if (!rl.success) {
    return { error: "Terlalu banyak percobaan pendaftaran, coba lagi dalam 1 jam" };
  }

  // Validate input
  const parsed = registerSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
    },
  });

  if (error) {
    if (error.message.includes("User already registered")) {
      return { error: "Email sudah terdaftar, silakan login" };
    }
    return { error: "Pendaftaran gagal, coba lagi" };
  }

  return { success: true };
}

export async function requestOtp(formData: { email: string }) {
  // Rate limit: 3 OTP requests per 10 minutes per email
  const parsed = otpRequestSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Input tidak valid" };
  }

  const rl = otpRateLimit(parsed.data.email);
  if (!rl.success) {
    return { error: "Terlalu banyak permintaan magic link, coba lagi dalam 10 menit" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
  });

  if (error) {
    return { error: "Gagal mengirim magic link, coba lagi" };
  }

  return { success: true };
}
