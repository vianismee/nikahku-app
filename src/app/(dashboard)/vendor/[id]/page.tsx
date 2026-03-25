"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VendorStatusPipeline } from "@/components/vendor/vendor-status-pipeline";
import { VendorDetailInfo } from "@/components/vendor/vendor-detail-info";
import { VendorDetailPackages } from "@/components/vendor/vendor-detail-packages";
import { VendorDetailImages } from "@/components/vendor/vendor-detail-images";
import { VendorDetailPayments } from "@/components/vendor/vendor-detail-payments";
import { VendorFormSheet } from "@/components/vendor/vendor-form-sheet";
import { VendorBookingDialog } from "@/components/vendor/vendor-booking-dialog";
import { useVendor, useDeleteVendor } from "@/lib/hooks/use-vendors";
import { VENDOR_STATUSES, type VendorStatus } from "@/lib/constants/vendor-statuses";
import { ArrowLeft, Pencil, Trash2, MessageCircle, AtSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function VendorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params.id as string;
  const { data: vendor, isLoading } = useVendor(vendorId);
  const deleteVendor = useDeleteVendor();
  const [editOpen, setEditOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="space-y-4">
        <Link href="/vendor" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>
        <p className="text-muted-foreground">Vendor tidak ditemukan</p>
      </div>
    );
  }

  const category = vendor.vendor_categories;
  const packages = vendor.vendor_packages ?? [];
  const statusInfo = VENDOR_STATUSES[vendor.status as VendorStatus];

  async function handleDelete() {
    try {
      await deleteVendor.mutateAsync({ id: vendor!.id, weddingId: vendor!.wedding_id });
      toast.success("Vendor berhasil dihapus");
      router.push("/vendor");
    } catch {
      toast.error("Gagal menghapus vendor");
    }
  }

  const canBook = ["shortlisted", "contacted", "negotiating"].includes(vendor.status);

  return (
    <div className="space-y-6">
      <Link href="/vendor" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Vendor
      </Link>

      <PageHeader
        title={vendor.name}
        description={
          <span className="flex items-center gap-2">
            {category && (
              <span>
                {category.icon} {category.name}
              </span>
            )}
            <StatusBadge {...statusInfo} />
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            {canBook && (
              <Button size="sm" onClick={() => setBookingOpen(true)}>
                Book Vendor
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <ConfirmDialog
              trigger={
                <Button size="sm" variant="outline">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Hapus
                </Button>
              }
              title="Hapus Vendor"
              description={`Yakin ingin menghapus "${vendor.name}"? Semua data terkait akan ikut terhapus.`}
              onConfirm={handleDelete}
            />
          </div>
        }
      />

      <VendorStatusPipeline vendorId={vendor.id} currentStatus={vendor.status as VendorStatus} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <VendorDetailInfo vendor={vendor} />
          <VendorDetailPackages
            vendorId={vendor.id}
            selectedPackageId={vendor.selected_package_id}
            packages={packages}
          />
          <VendorDetailImages vendorId={vendor.id} />
        </div>

        <div className="space-y-6">
          <VendorDetailPayments vendor={vendor} categoryName={category?.name ?? "Lainnya"} />

          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {vendor.contact_wa && (
                <a
                  href={`https://wa.me/${vendor.contact_wa.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Hubungi via WhatsApp
                  </Button>
                </a>
              )}
              {vendor.instagram && (
                <a
                  href={`https://instagram.com/${vendor.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <AtSign className="h-4 w-4 mr-2" />
                    Lihat Instagram
                  </Button>
                </a>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <VendorFormSheet
        weddingId={vendor.wedding_id}
        vendor={vendor}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <VendorBookingDialog
        vendorId={vendor.id}
        weddingId={vendor.wedding_id}
        vendorName={vendor.name}
        categoryName={category?.name ?? "Lainnya"}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </div>
  );
}
