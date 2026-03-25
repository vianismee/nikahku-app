"use client";

import { Toaster } from "@/components/ui/sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          borderRadius: "var(--radius)",
          border: "1px solid var(--border)",
          boxShadow: "none",
        },
      }}
    />
  );
}
