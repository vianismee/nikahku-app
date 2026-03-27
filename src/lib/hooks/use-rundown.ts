"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Tables, InsertTables, UpdateTables } from "@/lib/supabase/database.types";

export function useRundownEvents(weddingId: string | undefined) {
  return useQuery({
    queryKey: ["rundown_events", weddingId],
    queryFn: async () => {
      if (!weddingId) return [];
      const supabase = createClient();
      const { data, error } = await supabase
        .from("rundown_events")
        .select("*")
        .eq("wedding_id", weddingId)
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as Tables<"rundown_events">[];
    },
    enabled: !!weddingId,
  });
}

export function useCreateRundownEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (event: InsertTables<"rundown_events">) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("rundown_events")
        .insert(event as never)
        .select()
        .single();
      if (error) throw error;
      return data as Tables<"rundown_events">;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["rundown_events", variables.wedding_id] });
    },
  });
}

export function useUpdateRundownEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateTables<"rundown_events"> & { id: string }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("rundown_events")
        .update(updates as never)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Tables<"rundown_events">;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["rundown_events", data.wedding_id] });
    },
  });
}

export function useDeleteRundownEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, weddingId }: { id: string; weddingId: string }) => {
      const supabase = createClient();
      const { error } = await supabase.from("rundown_events").delete().eq("id", id);
      if (error) throw error;
      return { weddingId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["rundown_events", data.weddingId] });
    },
  });
}

export function useBulkCreateRundownEvents() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      weddingId,
      events,
    }: {
      weddingId: string;
      events: Omit<InsertTables<"rundown_events">, "wedding_id">[];
    }) => {
      const supabase = createClient();
      const rows = events.map((event, i) => ({
        ...event,
        wedding_id: weddingId,
        sort_order: i,
      }));
      const { error } = await supabase.from("rundown_events").insert(rows as never[]);
      if (error) throw error;
      return { weddingId, count: rows.length };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["rundown_events", data.weddingId] });
    },
  });
}

export function useDeleteAllRundownEvents() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ weddingId }: { weddingId: string }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("rundown_events")
        .delete()
        .eq("wedding_id", weddingId);
      if (error) throw error;
      return { weddingId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["rundown_events", data.weddingId] });
    },
  });
}

export function useReorderRundownEvents() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      weddingId,
      orderedIds,
    }: {
      weddingId: string;
      orderedIds: string[];
    }) => {
      const supabase = createClient();
      const updates = orderedIds.map((id, i) => ({ id, sort_order: i }));
      for (const update of updates) {
        const { error } = await supabase
          .from("rundown_events")
          .update({ sort_order: update.sort_order } as never)
          .eq("id", update.id);
        if (error) throw error;
      }
      return { weddingId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["rundown_events", data.weddingId] });
    },
  });
}
