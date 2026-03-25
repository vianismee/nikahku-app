"use client";

import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-4 max-w-sm">
        <div className="mx-auto w-16 h-16 rounded-full border-2 border-muted flex items-center justify-center">
          <WifiOff className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-heading font-bold">Kamu Offline</h1>
        <p className="text-muted-foreground">
          Sepertinya koneksi internet kamu terputus. Beberapa fitur mungkin tidak tersedia.
        </p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Coba Lagi
        </Button>
      </div>
    </div>
  );
}
