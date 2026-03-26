"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/database.types";

/** Get partner info from the wedding itself (no separate table) */
export function usePartnerInvite(weddingId: string | undefined) {
  return useQuery({
    queryKey: ["partner-invite", weddingId],
    queryFn: async () => {
      if (!weddingId) return null;
      const supabase = createClient();

      const { data, error } = await supabase
        .from("weddings")
        .select("*")
        .eq("id", weddingId)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null;
        throw error;
      }

      // Access partner columns safely (may not exist if migration not run)
      const wedding = data as Record<string, unknown>;
      const partnerEmail = wedding.partner_email as string | null;
      if (!partnerEmail) return null;

      return {
        id: wedding.id as string,
        email: partnerEmail,
        status: (wedding.partner_status as string) ?? "pending",
        user_id: wedding.partner_user_id as string | null,
      };
    },
    enabled: !!weddingId,
    retry: false,
  });
}

export interface PendingInvite {
  id: string;
  wedding_id: string;
  email: string;
  status: string;
  partner_1_name: string;
  partner_2_name: string;
  wedding_date: string;
}

/** Get pending invites for current user (by email on weddings table) */
export function usePendingInvites() {
  return useQuery({
    queryKey: ["pending-invites"],
    queryFn: async (): Promise<PendingInvite[]> => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) return [];

      const { data: weddings, error } = await supabase
        .from("weddings")
        .select("id, partner_email, partner_status, partner_1_name, partner_2_name, wedding_date")
        .eq("partner_email", user.email)
        .eq("partner_status", "pending");

      // Gracefully handle column not existing yet
      if (error) {
        const msg = error.message ?? "";
        if (msg.includes("column") || msg.includes("does not exist") || msg.includes("400")) {
          return [];
        }
        throw error;
      }
      if (!weddings || weddings.length === 0) return [];

      return (weddings as (Tables<"weddings">)[]).map((w) => ({
        id: w.id,
        wedding_id: w.id,
        email: w.partner_email!,
        status: w.partner_status!,
        partner_1_name: w.partner_1_name,
        partner_2_name: w.partner_2_name,
        wedding_date: w.wedding_date,
      }));
    },
    retry: false,
  });
}

/** Invite partner by email — sets partner_email on the wedding */
export function useInvitePartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ weddingId, email }: { weddingId: string; email: string }) => {
      const supabase = createClient();

      // Check if user is trying to invite themselves
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email === email) {
        throw new Error("Tidak bisa mengundang diri sendiri");
      }

      const { data, error } = await supabase
        .from("weddings")
        .update({
          partner_email: email.toLowerCase().trim(),
          partner_status: "pending",
          partner_user_id: null,
        } as never)
        .eq("id", weddingId)
        .select()
        .single();

      if (error) throw error;
      return data as Tables<"weddings">;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["partner-invite", variables.weddingId] });
      queryClient.invalidateQueries({ queryKey: ["wedding"] });
    },
  });
}

/** Accept an invitation — sets partner_user_id and status to accepted */
export function useAcceptInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (weddingId: string) => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("weddings")
        .update({
          partner_status: "accepted",
          partner_user_id: user.id,
        } as never)
        .eq("id", weddingId)
        .select()
        .single();

      if (error) throw error;
      return data as Tables<"weddings">;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wedding"] });
      queryClient.invalidateQueries({ queryKey: ["pending-invites"] });
    },
  });
}

/** Reject an invitation */
export function useRejectInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (weddingId: string) => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("weddings")
        .update({ partner_status: "rejected" } as never)
        .eq("id", weddingId)
        .select()
        .single();

      if (error) throw error;
      return data as Tables<"weddings">;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-invites"] });
    },
  });
}

/** Remove partner invitation (by owner) — clears partner columns */
export function useRemovePartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ weddingId }: { id?: string; weddingId: string }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("weddings")
        .update({
          partner_email: null,
          partner_user_id: null,
          partner_status: null,
        } as never)
        .eq("id", weddingId);

      if (error) throw error;
      return { weddingId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["partner-invite", data.weddingId] });
      queryClient.invalidateQueries({ queryKey: ["wedding"] });
    },
  });
}
