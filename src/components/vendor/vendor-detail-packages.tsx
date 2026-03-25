"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { VendorPackageDialog } from "./vendor-package-dialog";
import { VendorPackageImportDialog } from "./vendor-package-import-dialog";
import { useUpdateVendor, useDeleteVendorPackage } from "@/lib/hooks/use-vendors";
import { formatRupiah } from "@/lib/utils/format-currency";
import type { Tables } from "@/lib/supabase/database.types";
import { Plus, Pencil, Trash2, Check, Package, FileJson } from "lucide-react";
import { toast } from "sonner";

interface VendorDetailPackagesProps {
  vendorId: string;
  selectedPackageId: string | null;
  packages: Tables<"vendor_packages">[];
}

export function VendorDetailPackages({ vendorId, selectedPackageId, packages }: VendorDetailPackagesProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [editPkg, setEditPkg] = useState<Tables<"vendor_packages"> | undefined>();
  const updateVendor = useUpdateVendor();
  const deletePackage = useDeleteVendorPackage();

  async function handleSelect(pkgId: string) {
    try {
      await updateVendor.mutateAsync({ id: vendorId, selected_package_id: pkgId });
      toast.success("Paket dipilih");
    } catch {
      toast.error("Gagal memilih paket");
    }
  }

  async function handleDelete(pkgId: string) {
    try {
      await deletePackage.mutateAsync({ id: pkgId, vendorId });
      toast.success("Paket berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus paket");
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Paket Harga</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setImportOpen(true)}
            >
              <FileJson className="h-4 w-4 mr-1" />
              Import JSON
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEditPkg(undefined);
                setDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Tambah
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {packages.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Belum ada paket</p>
            </div>
          ) : (
            <div className="space-y-3">
              {packages.map((pkg) => {
                const isSelected = pkg.id === selectedPackageId;
                return (
                  <div
                    key={pkg.id}
                    className={`rounded-lg border p-4 ${isSelected ? "border-primary bg-primary/5" : ""}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{pkg.name}</h4>
                          {isSelected && (
                            <Badge variant="default" className="text-xs">
                              <Check className="h-3 w-3 mr-1" /> Dipilih
                            </Badge>
                          )}
                        </div>
                        {pkg.description && (
                          <p className="text-sm text-muted-foreground mt-1">{pkg.description}</p>
                        )}
                      </div>
                      <span className="font-number font-bold text-lg">{formatRupiah(pkg.price)}</span>
                    </div>

                    {pkg.includes && pkg.includes.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Termasuk:</p>
                        <div className="flex flex-wrap gap-1">
                          {pkg.includes.map((item, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {pkg.excludes && pkg.excludes.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Tidak termasuk:</p>
                        <div className="flex flex-wrap gap-1">
                          {pkg.excludes.map((item, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-3">
                      {!isSelected && (
                        <Button size="sm" variant="outline" onClick={() => handleSelect(pkg.id)}>
                          Pilih Paket
                        </Button>
                      )}
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => {
                          setEditPkg(pkg);
                          setDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <ConfirmDialog
                        trigger={
                          <Button size="icon-sm" variant="ghost">
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        }
                        title="Hapus Paket"
                        description={`Yakin ingin menghapus paket "${pkg.name}"?`}
                        onConfirm={() => handleDelete(pkg.id)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <VendorPackageDialog
        vendorId={vendorId}
        pkg={editPkg}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <VendorPackageImportDialog
        vendorId={vendorId}
        open={importOpen}
        onOpenChange={setImportOpen}
      />
    </>
  );
}
