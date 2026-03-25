"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Tables, InsertTables, UpdateTables } from "@/lib/supabase/database.types";

export function useTasks(weddingId: string | undefined) {
  return useQuery({
    queryKey: ["tasks", weddingId],
    queryFn: async () => {
      if (!weddingId) return [];
      const supabase = createClient();

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("wedding_id", weddingId)
        .order("sort_order");

      if (error) throw error;
      return (data ?? []) as Tables<"tasks">[];
    },
    enabled: !!weddingId,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: InsertTables<"tasks">) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("tasks")
        .insert(task as never)
        .select()
        .single();

      if (error) throw error;
      return data as Tables<"tasks">;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.wedding_id] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateTables<"tasks"> & { id: string }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("tasks")
        .update(updates as never)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Tables<"tasks">;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", data.wedding_id] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, weddingId }: { id: string; weddingId: string }) => {
      const supabase = createClient();
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
      return { weddingId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", data.weddingId] });
    },
  });
}
