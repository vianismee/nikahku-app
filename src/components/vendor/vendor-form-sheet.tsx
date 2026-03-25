"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVendorCategories, useCreateVendor, useUpdateVendor } from "@/lib/hooks/use-vendors";
import type { VendorDetail } from "@/lib/hooks/use-vendors";
import { Star, Phone, MessageCircle, Mail, AtSign, Globe, MapPin } from "lucide-react";
import { toast } from "sonner";

interface VendorFormSheetProps {
  weddingId: string;
  vendor?: VendorDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VendorFormSheet({ weddingId, vendor, open, onOpenChange }: VendorFormSheetProps) {
  const { data: categories } = useVendorCategories();
  const createVendor = useCreateVendor();
  const updateVendor = useUpdateVendor();
  const isEdit = !!vendor;

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [city, setCity] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactWa, setContactWa] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [rating, setRating] = useState(0);
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open && vendor) {
      setName(vendor.name);
      setCategoryId(vendor.category_id);
      setCity(vendor.city ?? "");
      setContactPhone(vendor.contact_phone ?? "");
      setContactWa(vendor.contact_wa ?? "");
      setEmail(vendor.email ?? "");
      setInstagram(vendor.instagram ?? "");
      setWebsite(vendor.website ?? "");
      setAddress(vendor.address ?? "");
      setRating(vendor.rating ?? 0);
      setPros(vendor.pros ?? "");
      setCons(vendor.cons ?? "");
      setNotes(vendor.notes ?? "");
    } else if (open && !vendor) {
      setName("");
      setCategoryId("");
      setCity("");
      setContactPhone("");
      setContactWa("");
      setEmail("");
      setInstagram("");
      setWebsite("");
      setAddress("");
      setRating(0);
      setPros("");
      setCons("");
      setNotes("");
    }
  }, [open, vendor]);

  async function handleSubmit() {
    if (!name || !categoryId) {
      toast.error("Nama dan kategori wajib diisi");
      return;
    }

    const payload = {
      name,
      category_id: categoryId,
      city: city || null,
      contact_phone: contactPhone || null,
      contact_wa: contactWa || null,
      email: email || null,
      instagram: instagram || null,
      website: website || null,
      address: address || null,
      rating: rating || null,
      pros: pros || null,
      cons: cons || null,
      notes: notes || null,
    };

    try {
      if (isEdit) {
        await updateVendor.mutateAsync({ id: vendor.id, ...payload });
        toast.success("Vendor berhasil diperbarui");
      } else {
        await createVendor.mutateAsync({ ...payload, wedding_id: weddingId });
        toast.success("Vendor berhasil ditambahkan");
      }
      onOpenChange(false);
    } catch {
      toast.error("Gagal menyimpan vendor");
    }
  }

  const isPending = createVendor.isPending || updateVendor.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col p-0 sm:max-w-lg">
        {/* Fixed Header */}
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle className="text-lg">{isEdit ? "Edit Vendor" : "Tambah Vendor"}</SheetTitle>
          <SheetDescription>
            {isEdit ? "Perbarui informasi vendor" : "Masukkan detail vendor baru"}
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-5 px-5 py-5">
            {/* Section: Info Dasar */}
            <fieldset className="space-y-4">
              <legend className="text-sm font-heading font-semibold text-foreground">
                Info Dasar
              </legend>
              <div className="space-y-1.5">
                <Label htmlFor="vendor-name">Nama Vendor <span className="text-destructive">*</span></Label>
                <Input
                  id="vendor-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Studio Foto ABC"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vendor-category">Kategori <span className="text-destructive">*</span></Label>
                <Select
                  value={categoryId}
                  onValueChange={(v) => setCategoryId(v ?? "")}
                  items={categories?.map((cat) => ({ value: cat.id, label: `${cat.icon} ${cat.name}` })) ?? []}
                >
                  <SelectTrigger id="vendor-category" className="w-full">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vendor-city">Kota</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="vendor-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Kota"
                    className="pl-9"
                  />
                </div>
              </div>
            </fieldset>

            <hr className="border-border" />

            {/* Section: Kontak */}
            <fieldset className="space-y-4">
              <legend className="text-sm font-heading font-semibold text-foreground">
                Kontak
              </legend>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="vendor-phone">Telepon</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="vendor-phone"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="08..."
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="vendor-wa">WhatsApp</Label>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="vendor-wa"
                      value={contactWa}
                      onChange={(e) => setContactWa(e.target.value)}
                      placeholder="08..."
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vendor-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="vendor-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@contoh.com"
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="vendor-ig">Instagram</Label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="vendor-ig"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="username"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="vendor-web">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="vendor-web"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://..."
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vendor-address">Alamat</Label>
                <Textarea
                  id="vendor-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Alamat lengkap"
                  rows={2}
                />
              </div>
            </fieldset>

            <hr className="border-border" />

            {/* Section: Penilaian */}
            <fieldset className="space-y-4">
              <legend className="text-sm font-heading font-semibold text-foreground">
                Penilaian
              </legend>
              <div className="space-y-1.5">
                <Label>Rating</Label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star === rating ? 0 : star)}
                      className="rounded-md p-1 transition-colors hover:bg-accent"
                    >
                      <Star
                        className={`h-6 w-6 transition-colors ${
                          star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 text-sm font-number text-muted-foreground">
                      {rating}/5
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vendor-pros">Kelebihan</Label>
                <Textarea
                  id="vendor-pros"
                  value={pros}
                  onChange={(e) => setPros(e.target.value)}
                  placeholder="Kelebihan vendor..."
                  rows={2}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vendor-cons">Kekurangan</Label>
                <Textarea
                  id="vendor-cons"
                  value={cons}
                  onChange={(e) => setCons(e.target.value)}
                  placeholder="Kekurangan vendor..."
                  rows={2}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vendor-notes">Catatan</Label>
                <Textarea
                  id="vendor-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Catatan lainnya..."
                  rows={2}
                />
              </div>
            </fieldset>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="border-t px-5 py-4 flex items-center gap-3">
          <SheetClose render={<Button variant="outline" className="flex-1">Batal</Button>} />
          <Button className="flex-1" onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
