"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useUploadVendorImage } from "@/lib/hooks/use-vendors";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface VendorImageUploadProps {
  vendorId: string;
  currentCount: number;
  maxImages?: number;
}

export function VendorImageUpload({ vendorId, currentCount, maxImages = 10 }: VendorImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadImage = useUploadVendorImage();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remaining = maxImages - currentCount;
    if (remaining <= 0) {
      toast.error(`Maksimal ${maxImages} gambar per vendor`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remaining);

    for (const file of filesToUpload) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} terlalu besar (maks 5MB)`);
        continue;
      }

      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} bukan file gambar`);
        continue;
      }

      try {
        await uploadImage.mutateAsync({ vendorId, file });
      } catch {
        toast.error(`Gagal upload ${file.name}`);
      }
    }

    toast.success("Upload selesai");
    if (inputRef.current) inputRef.current.value = "";
  }

  const canUpload = currentCount < maxImages;

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={!canUpload || uploadImage.isPending}
      >
        {uploadImage.isPending ? (
          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
        ) : (
          <Upload className="h-4 w-4 mr-1" />
        )}
        Upload Gambar
      </Button>
      <p className="text-xs text-muted-foreground mt-1">
        {currentCount}/{maxImages} gambar (maks 5MB per file)
      </p>
    </div>
  );
}
