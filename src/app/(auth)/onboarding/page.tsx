"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingPage() {
  const router = useRouter();
  const [partnerName1, setPartnerName1] = useState("");
  const [partnerName2, setPartnerName2] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // TODO: Save wedding info to Supabase
    // For now, store in sessionStorage and proceed
    sessionStorage.setItem(
      "onboarding_wedding",
      JSON.stringify({ partnerName1, partnerName2, weddingDate, city })
    );

    router.push("/onboarding/budget");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="text-sm text-muted-foreground mb-2">Langkah 1 dari 3</div>
          <CardTitle className="text-2xl font-heading">Info Pernikahan</CardTitle>
          <CardDescription>
            Ceritakan tentang rencana pernikahan kalian
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="partner1">Nama Mempelai 1</Label>
                <Input
                  id="partner1"
                  placeholder="Contoh: Ahmad"
                  value={partnerName1}
                  onChange={(e) => setPartnerName1(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partner2">Nama Mempelai 2</Label>
                <Input
                  id="partner2"
                  placeholder="Contoh: Aisyah"
                  value={partnerName2}
                  onChange={(e) => setPartnerName2(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Tanggal Pernikahan</Label>
              <Input
                id="date"
                type="date"
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Kota</Label>
              <Input
                id="city"
                placeholder="Contoh: Jakarta"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Menyimpan..." : "Lanjut"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
