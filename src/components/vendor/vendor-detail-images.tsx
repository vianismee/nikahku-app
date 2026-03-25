"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { VendorImageUpload } from "./vendor-image-upload";
import { useVendorImages, useDeleteVendorImage } from "@/lib/hooks/use-vendors";
import { createClient } from "@/lib/supabase/client";
import { Trash2, ImageIcon, Expand } from "lucide-react";
import { toast } from "sonner";

interface VendorDetailImagesProps {
  vendorId: string;
}

export function VendorDetailImages({ vendorId }: VendorDetailImagesProps) {
  const { data: images } = useVendorImages(vendorId);
  const deleteImage = useDeleteVendorImage();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function getPublicUrl(storagePath: string) {
    const supabase = createClient();
    const { data } = supabase.storage.from("vendor-images").getPublicUrl(storagePath);
    return data.publicUrl;
  }

  async function handleDelete(id: string, storagePath: string) {
    try {
      await deleteImage.mutateAsync({ id, vendorId, storagePath });
      toast.success("Gambar berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus gambar");
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gambar</CardTitle>
          <VendorImageUpload vendorId={vendorId} currentCount={images?.length ?? 0} />
        </CardHeader>
        <CardContent>
          {!images || images.length === 0 ? (
            <div className="text-center py-8">
              <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Belum ada gambar</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((img) => {
                const url = getPublicUrl(img.storage_path);
                return (
                  <div key={img.id} className="group relative aspect-square rounded-lg overflow-hidden border">
                    <img
                      src={url}
                      alt={img.file_name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <Button
                        size="icon-sm"
                        variant="secondary"
                        onClick={() => setPreviewUrl(url)}
                      >
                        <Expand className="h-3.5 w-3.5" />
                      </Button>
                      <ConfirmDialog
                        trigger={
                          <Button size="icon-sm" variant="destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        }
                        title="Hapus Gambar"
                        description="Yakin ingin menghapus gambar ini?"
                        onConfirm={() => handleDelete(img.id, img.storage_path)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
          {previewUrl && (
            <img src={previewUrl} alt="Preview" className="w-full h-auto" />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
