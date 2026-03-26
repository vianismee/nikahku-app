"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

function translateAuthError(message: string): string {
  if (message.includes("Invalid login credentials")) return "Email atau password salah";
  if (message.includes("Email not confirmed")) return "Email belum dikonfirmasi, cek inbox kamu";
  if (message.includes("Too many requests")) return "Terlalu banyak percobaan, coba lagi nanti";
  if (message.includes("User not found")) return "Akun tidak ditemukan";
  if (message.includes("network") || message.includes("fetch")) return "Koneksi gagal, periksa internet kamu";
  return message;
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const supabase = useRef(createClient()).current;
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  // Show error from OAuth callback redirect
  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "auth_callback_error") {
      toast.error("Login gagal, silakan coba lagi");
    }
  }, [searchParams]);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        toast.error(translateAuthError(error.message));
        setLoading(false);
        return;
      }

      toast.success("Berhasil masuk! Mengalihkan...");

      // Use router-based navigation with timeout fallback for mobile
      const redirectTimeout = setTimeout(() => {
        setLoading(false);
        toast.error("Pengalihan gagal, silakan coba lagi");
      }, 8000);

      window.addEventListener(
        "beforeunload",
        () => clearTimeout(redirectTimeout),
        { once: true }
      );

      window.location.replace("/dashboard");
    } catch {
      toast.error("Koneksi gagal, periksa internet kamu");
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/callback` },
      });
      if (error) toast.error(translateAuthError(error.message));
    } catch {
      toast.error("Koneksi gagal, periksa internet kamu");
    }
  }

  async function handleMagicLink() {
    if (!email) {
      toast.error("Masukkan email terlebih dahulu");
      return;
    }
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/callback` },
      });

      if (error) {
        toast.error(translateAuthError(error.message));
      } else {
        setMagicLinkSent(true);
      }
    } catch {
      toast.error("Koneksi gagal, periksa internet kamu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-heading">NIKAHKU</CardTitle>
          <CardDescription>Masuk ke akun wedding planner kamu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {magicLinkSent ? (
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Link login sudah dikirim ke <strong>{email}</strong>
              </p>
              <p className="text-xs text-muted-foreground">
                Cek inbox atau folder spam kamu
              </p>
              <Button
                variant="ghost"
                onClick={() => setMagicLinkSent(false)}
                className="mt-2"
              >
                Kembali
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Masuk dengan Google
              </Button>

              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                  atau
                </span>
              </div>

              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Memproses..." : "Masuk"}
                </Button>
              </form>

              <Button
                variant="ghost"
                className="w-full text-sm"
                onClick={handleMagicLink}
                disabled={loading}
              >
                Kirim Magic Link ke email
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Belum punya akun?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Daftar sekarang
                </Link>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
