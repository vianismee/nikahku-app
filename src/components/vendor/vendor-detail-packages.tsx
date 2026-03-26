"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { VendorPackageDialog } from "./vendor-package-dialog";
import { VendorPackageImportDialog } from "./vendor-package-import-dialog";
import { useUpdateVendor, useDeleteVendorPackage } from "@/lib/hooks/use-vendors";
import { formatRupiah } from "@/lib/utils/format-currency";
import type { Tables } from "@/lib/supabase/database.types";
import { Plus, Pencil, Trash2, Check, Package, FileJson, CheckCircle2, XCircle, StickyNote } from "lucide-react";
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
            <Accordion defaultValue={selectedPackageId ? [selectedPackageId] : []}>
              {packages.map((pkg) => {
                const isSelected = pkg.id === selectedPackageId;
                return (
                  <AccordionItem
                    key={pkg.id}
                    value={pkg.id}
                    className={`rounded-lg border mb-2 last:mb-0 overflow-hidden ${
                      isSelected
                        ? "border-primary/50 bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50 transition-colors">
                      <div className="flex flex-1 items-center justify-between mr-2 min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-medium truncate">{pkg.name}</span>
                          {isSelected && (
                            <Badge variant="default" className="text-xs shrink-0">
                              <Check className="h-3 w-3 mr-0.5" /> Dipilih
                            </Badge>
                          )}
                        </div>
                        <span className="font-number font-bold text-primary shrink-0 ml-3">
                          {formatRupiah(pkg.price)}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-3 pt-1">
                        {/* Deskripsi */}
                        {pkg.description && (
                          <p className="text-sm text-muted-foreground">
                            {pkg.description}
                          </p>
                        )}

                        {/* Termasuk */}
                        {pkg.includes && pkg.includes.length > 0 && (
                          <div>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                              <span className="text-xs font-medium text-green-600">Termasuk</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {pkg.includes.map((item, i) => (
                                <Badge key={i} variant="secondary" className="text-xs font-normal">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tidak Termasuk */}
                        {pkg.excludes && pkg.excludes.length > 0 && (
                          <div>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <XCircle className="h-3.5 w-3.5 text-destructive" />
                              <span className="text-xs font-medium text-destructive">Tidak Termasuk</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {pkg.excludes.map((item, i) => (
                                <Badge key={i} variant="outline" className="text-xs font-normal text-muted-foreground">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        {pkg.notes && (
                          <div className="flex items-start gap-1.5 rounded-md bg-muted/50 p-2.5">
                            <StickyNote className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                            <p className="text-xs text-muted-foreground">{pkg.notes}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-1 border-t">
                          {!isSelected && (
                            <Button size="sm" onClick={() => handleSelect(pkg.id)}>
                              <Check className="h-3.5 w-3.5 mr-1" />
                              Pilih Paket
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditPkg(pkg);
                              setDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>
                          <ConfirmDialog
                            trigger={
                              <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-3.5 w-3.5 mr-1" />
                                Hapus
                              </Button>
                            }
                            title="Hapus Paket"
                            description={`Yakin ingin menghapus paket "${pkg.name}"?`}
                            onConfirm={() => handleDelete(pkg.id)}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
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
