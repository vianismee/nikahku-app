"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { customAlphabet } from "nanoid";
import type { Tables, InsertTables, UpdateTables } from "@/lib/supabase/database.types";

const generateNanoId = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 5);

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

      // Auto-generate NanoID — retry hingga 5x jika collision
      let nanoId = generateNanoId();
      for (let attempt = 0; attempt < 5; attempt++) {
        const { data, error } = await supabase
          .from("guests")
          .insert({ ...guest, nano_id: nanoId } as never)
          .select()
          .single();

        if (!error) return data as Tables<"guests">;

        // 23505 = unique_violation di PostgreSQL
        if ((error as { code?: string }).code === "23505" && attempt < 4) {
          nanoId = generateNanoId();
          continue;
        }
        throw error;
      }
      throw new Error("Gagal generate NanoID unik");
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

// ---- Session CRUD ----

export function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (session: InsertTables<"sessions">) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("sessions")
        .insert(session as never)
        .select()
        .single();
      if (error) throw error;
      return data as Tables<"sessions">;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sessions", data.wedding_id] });
    },
  });
}

export function useUpdateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateTables<"sessions"> & { id: string }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("sessions")
        .update(updates as never)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Tables<"sessions">;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sessions", data.wedding_id] });
    },
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, weddingId }: { id: string; weddingId: string }) => {
      const supabase = createClient();
      const { error } = await supabase.from("sessions").delete().eq("id", id);
      if (error) throw error;
      return { weddingId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sessions", data.weddingId] });
      queryClient.invalidateQueries({ queryKey: ["guests", data.weddingId] });
    },
  });
}

// ---- Guest ↔ Session assignment ----

export function useAssignGuestSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      guestId,
      sessionId,
      weddingId,
    }: {
      guestId: string;
      sessionId: string;
      weddingId: string;
    }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("guest_sessions")
        .upsert({ guest_id: guestId, session_id: sessionId } as never);
      if (error) throw error;
      return { weddingId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["guests", data.weddingId] });
    },
  });
}

export function useRemoveGuestSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      guestId,
      sessionId,
      weddingId,
    }: {
      guestId: string;
      sessionId: string;
      weddingId: string;
    }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("guest_sessions")
        .delete()
        .eq("guest_id", guestId)
        .eq("session_id", sessionId);
      if (error) throw error;
      return { weddingId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["guests", data.weddingId] });
    },
  });
}

export function useBulkUpdateRsvp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ids,
      rsvp_status,
      weddingId,
    }: {
      ids: string[];
      rsvp_status: string;
      weddingId: string;
    }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("guests")
        .update({ rsvp_status } as never)
        .in("id", ids);
      if (error) throw error;
      return { weddingId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["guests", data.weddingId] });
    },
  });
}

export function useSetGuestSessions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      guestId,
      sessionIds,
      weddingId,
    }: {
      guestId: string;
      sessionIds: string[];
      weddingId: string;
    }) => {
      const supabase = createClient();
      // Delete all existing session assignments for this guest
      const { error: deleteError } = await supabase
        .from("guest_sessions")
        .delete()
        .eq("guest_id", guestId);
      if (deleteError) throw deleteError;

      // Insert new ones
      if (sessionIds.length > 0) {
        const rows = sessionIds.map((session_id) => ({ guest_id: guestId, session_id }));
        const { error: insertError } = await supabase
          .from("guest_sessions")
          .insert(rows as never[]);
        if (insertError) throw insertError;
      }
      return { weddingId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["guests", data.weddingId] });
    },
  });
}
