"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Tables, InsertTables, UpdateTables } from "@/lib/supabase/database.types";

export type VendorWithRelations = Tables<"vendors"> & {
  vendor_categories: { name: string; icon: string; color: string } | null;
};

export type VendorDetail = Tables<"vendors"> & {
  vendor_categories: { name: string; icon: string; color: string } | null;
  vendor_packages: Tables<"vendor_packages">[];
  vendor_images: Tables<"vendor_images">[];
};

export function useVendors(weddingId: string | undefined) {
  return useQuery({
    queryKey: ["vendors", weddingId],
    queryFn: async () => {
      if (!weddingId) return [];
      const supabase = createClient();

      const { data, error } = await supabase
        .from("vendors")
        .select("*, vendor_categories(name, icon, color)")
        .eq("wedding_id", weddingId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as VendorWithRelations[];
    },
    enabled: !!weddingId,
  });
}

export function useVendor(vendorId: string | undefined) {
  return useQuery({
    queryKey: ["vendor", vendorId],
    queryFn: async () => {
      if (!vendorId) return null;
      const supabase = createClient();

      const { data, error } = await supabase
        .from("vendors")
        .select("*, vendor_categories(name, icon, color), vendor_packages(*), vendor_images(*)")
        .eq("id", vendorId)
        .single();

      if (error) throw error;
      return data as unknown as VendorDetail;
    },
    enabled: !!vendorId,
  });
}

export function useVendorCategories() {
  return useQuery({
    queryKey: ["vendor-categories"],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("vendor_categories")
        .select("*")
        .order("sort_order");

      if (error) throw error;
      return (data ?? []) as Tables<"vendor_categories">[];
    },
  });
}

export function useCreateVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vendor: InsertTables<"vendors">) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("vendors")
        .insert(vendor as never)
        .select()
        .single();

      if (error) throw error;
      return data as Tables<"vendors">;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vendors", variables.wedding_id] });
    },
  });
}

export function useUpdateVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateTables<"vendors"> & { id: string }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("vendors")
        .update(updates as never)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Tables<"vendors">;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vendors", data.wedding_id] });
      queryClient.invalidateQueries({ queryKey: ["vendor", data.id] });
      queryClient.invalidateQueries({ queryKey: ["budget", data.wedding_id] });
    },
  });
}

export function useDeleteVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, weddingId }: { id: string; weddingId: string }) => {
      const supabase = createClient();
      const { error } = await supabase.from("vendors").delete().eq("id", id);
      if (error) throw error;
      return { weddingId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vendors", data.weddingId] });
      queryClient.invalidateQueries({ queryKey: ["budget", data.weddingId] });
    },
  });
}

export function useVendorPackages(vendorId: string | undefined) {
  return useQuery({
    queryKey: ["vendor-packages", vendorId],
    queryFn: async () => {
      if (!vendorId) return [];
      const supabase = createClient();

      const { data, error } = await supabase
        .from("vendor_packages")
        .select("*")
        .eq("vendor_id", vendorId)
        .order("sort_order");

      if (error) throw error;
      return (data ?? []) as Tables<"vendor_packages">[];
    },
    enabled: !!vendorId,
  });
}

export function useCreateVendorPackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pkg: InsertTables<"vendor_packages">) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("vendor_packages")
        .insert(pkg as never)
        .select()
        .single();

      if (error) throw error;
      return data as Tables<"vendor_packages">;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vendor-packages", data.vendor_id] });
      queryClient.invalidateQueries({ queryKey: ["vendor", data.vendor_id] });
    },
  });
}

export function useBulkCreateVendorPackages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vendorId, packages }: { vendorId: string; packages: Omit<InsertTables<"vendor_packages">, "vendor_id">[] }) => {
      const supabase = createClient();
      const rows = packages.map((pkg, i) => ({
        ...pkg,
        vendor_id: vendorId,
        sort_order: i,
      }));
      const { data, error } = await supabase
        .from("vendor_packages")
        .insert(rows as never[])
        .select();

      if (error) throw error;
      return data as Tables<"vendor_packages">[];
    },
    onSuccess: (data) => {
      if (data.length > 0) {
        queryClient.invalidateQueries({ queryKey: ["vendor-packages", data[0].vendor_id] });
        queryClient.invalidateQueries({ queryKey: ["vendor", data[0].vendor_id] });
      }
    },
  });
}

export function useUpdateVendorPackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateTables<"vendor_packages"> & { id: string }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("vendor_packages")
        .update(updates as never)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Tables<"vendor_packages">;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vendor-packages", data.vendor_id] });
      queryClient.invalidateQueries({ queryKey: ["vendor", data.vendor_id] });
    },
  });
}

export function useDeleteVendorPackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, vendorId }: { id: string; vendorId: string }) => {
      const supabase = createClient();
      const { error } = await supabase.from("vendor_packages").delete().eq("id", id);
      if (error) throw error;
      return { vendorId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vendor-packages", data.vendorId] });
      queryClient.invalidateQueries({ queryKey: ["vendor", data.vendorId] });
    },
  });
}

export function useVendorImages(vendorId: string | undefined) {
  return useQuery({
    queryKey: ["vendor-images", vendorId],
    queryFn: async () => {
      if (!vendorId) return [];
      const supabase = createClient();

      const { data, error } = await supabase
        .from("vendor_images")
        .select("*")
        .eq("vendor_id", vendorId)
        .order("sort_order");

      if (error) throw error;
      return (data ?? []) as Tables<"vendor_images">[];
    },
    enabled: !!vendorId,
  });
}

export function useUploadVendorImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vendorId, file }: { vendorId: string; file: File }) => {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `${vendorId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("vendor-images")
        .upload(path, file);

      if (uploadError) throw uploadError;

      const { data, error } = await supabase
        .from("vendor_images")
        .insert({
          vendor_id: vendorId,
          storage_path: path,
          file_name: file.name,
          file_size: file.size,
        } as never)
        .select()
        .single();

      if (error) throw error;
      return data as Tables<"vendor_images">;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vendor-images", data.vendor_id] });
      queryClient.invalidateQueries({ queryKey: ["vendor", data.vendor_id] });
    },
  });
}

export function useDeleteVendorImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, vendorId, storagePath }: { id: string; vendorId: string; storagePath: string }) => {
      const supabase = createClient();

      await supabase.storage.from("vendor-images").remove([storagePath]);

      const { error } = await supabase.from("vendor_images").delete().eq("id", id);
      if (error) throw error;
      return { vendorId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vendor-images", data.vendorId] });
      queryClient.invalidateQueries({ queryKey: ["vendor", data.vendorId] });
    },
  });
}

export function useCreateVendorCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: InsertTables<"vendor_categories">) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("vendor_categories")
        .insert(category as never)
        .select()
        .single();

      if (error) throw error;
      return data as Tables<"vendor_categories">;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-categories"] });
    },
  });
}
