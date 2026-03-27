"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Tables, InsertTables, UpdateTables } from "@/lib/supabase/database.types";

export function useSeserahan(weddingId: string | undefined) {
  return useQuery({
    queryKey: ["seserahan", weddingId],
    queryFn: async () => {
      if (!weddingId) return [];
      const supabase = createClient();

      const { data, error } = await supabase
        .from("seserahan")
        .select("*")
        .eq("wedding_id", weddingId)
        .order("sort_order");

      if (error) throw error;
      return (data ?? []) as Tables<"seserahan">[];
    },
    enabled: !!weddingId,
  });
}

export function useCreateSeserahan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: InsertTables<"seserahan">) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("seserahan")
        .insert(item as never)
        .select()
        .single();

      if (error) throw error;
      return data as Tables<"seserahan">;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["seserahan", variables.wedding_id] });
    },
  });
}

export function useUpdateSeserahan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateTables<"seserahan"> & { id: string }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("seserahan")
        .update(updates as never)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Tables<"seserahan">;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["seserahan", data.wedding_id] });
      queryClient.invalidateQueries({ queryKey: ["budget", data.wedding_id] });
    },
  });
}

export function useReorderSeserahan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      weddingId,
      items,
    }: {
      weddingId: string;
      items: { id: string; sort_order: number }[];
    }) => {
      const supabase = createClient();
      await Promise.all(
        items.map(({ id, sort_order }) =>
          supabase.from("seserahan").update({ sort_order } as never).eq("id", id)
        )
      );
      return { weddingId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["seserahan", data.weddingId] });
    },
  });
}

export function useDeleteSeserahan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, weddingId }: { id: string; weddingId: string }) => {
      const supabase = createClient();
      const { error } = await supabase.from("seserahan").delete().eq("id", id);
      if (error) throw error;
      return { weddingId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["seserahan", data.weddingId] });
      queryClient.invalidateQueries({ queryKey: ["budget", data.weddingId] });
    },
  });
}
