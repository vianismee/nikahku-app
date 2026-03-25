"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Tables, InsertTables, UpdateTables } from "@/lib/supabase/database.types";

export function useGuests(weddingId: string | undefined) {
  return useQuery({
    queryKey: ["guests", weddingId],
    queryFn: async () => {
      if (!weddingId) return [];
      const supabase = createClient();

      const { data, error } = await supabase
        .from("guests")
        .select("*, guest_sessions(session_id)")
        .eq("wedding_id", weddingId)
        .order("name");

      if (error) throw error;
      return data ?? [];
    },
    enabled: !!weddingId,
  });
}

export function useSessions(weddingId: string | undefined) {
  return useQuery({
    queryKey: ["sessions", weddingId],
    queryFn: async () => {
      if (!weddingId) return [];
      const supabase = createClient();

      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("wedding_id", weddingId)
        .order("sort_order");

      if (error) throw error;
      return (data ?? []) as Tables<"sessions">[];
    },
    enabled: !!weddingId,
  });
}

export function useCreateGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (guest: InsertTables<"guests">) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("guests")
        .insert(guest as never)
        .select()
        .single();

      if (error) throw error;
      return data as Tables<"guests">;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["guests", variables.wedding_id] });
    },
  });
}

export function useUpdateGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateTables<"guests"> & { id: string }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("guests")
        .update(updates as never)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Tables<"guests">;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["guests", data.wedding_id] });
    },
  });
}

export function useDeleteGuest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, weddingId }: { id: string; weddingId: string }) => {
      const supabase = createClient();
      const { error } = await supabase.from("guests").delete().eq("id", id);
      if (error) throw error;
      return { weddingId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["guests", data.weddingId] });
    },
  });
}
