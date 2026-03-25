"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Tables, InsertTables, UpdateTables } from "@/lib/supabase/database.types";

export function useWedding() {
  return useQuery({
    queryKey: ["wedding"],
    queryFn: async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("weddings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data as Tables<"weddings"> | null;
    },
  });
}

export function useCreateWedding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (wedding: Omit<InsertTables<"weddings">, "user_id">) => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("weddings")
        .insert({ ...wedding, user_id: user.id } as never)
        .select()
        .single();

      if (error) throw error;
      return data as Tables<"weddings">;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wedding"] });
    },
  });
}

export function useUpdateWedding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateTables<"weddings"> & { id: string }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("weddings")
        .update(updates as never)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Tables<"weddings">;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wedding"] });
    },
  });
}
