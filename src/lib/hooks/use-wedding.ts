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

      // 1. Check if user owns a wedding
      const { data: owned, error: ownedErr } = await supabase
        .from("weddings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (owned && !ownedErr) return owned as Tables<"weddings">;
      if (ownedErr && ownedErr.code !== "PGRST116") throw ownedErr;

      // 2. Check if user is an accepted partner (by partner_user_id)
      //    Wrapped in try-catch: columns may not exist yet if migration hasn't run
      try {
        const { data: partnerByUid, error: uidErr } = await supabase
          .from("weddings")
          .select("*")
          .eq("partner_user_id", user.id)
          .eq("partner_status", "accepted")
          .single();

        if (partnerByUid && !uidErr) return partnerByUid as Tables<"weddings">;
        if (uidErr && uidErr.code !== "PGRST116") {
          // If column doesn't exist or permission error, skip gracefully
          const msg = uidErr.message ?? "";
          if (!msg.includes("column") && !msg.includes("does not exist") && !msg.includes("400")) {
            throw uidErr;
          }
        }
      } catch {
        // Partner columns not available yet — skip
      }

      // 3. Check if user has an accepted invite by email
      try {
        if (user.email) {
          const { data: partnerByEmail, error: emailErr } = await supabase
            .from("weddings")
            .select("*")
            .eq("partner_email", user.email)
            .eq("partner_status", "accepted")
            .single();

          if (partnerByEmail && !emailErr) return partnerByEmail as Tables<"weddings">;
          if (emailErr && emailErr.code !== "PGRST116") {
            const msg = emailErr.message ?? "";
            if (!msg.includes("column") && !msg.includes("does not exist") && !msg.includes("400")) {
              throw emailErr;
            }
          }
        }
      } catch {
        // Partner columns not available yet — skip
      }

      return null;
    },
  });
}

/** Check if current user is the owner of the wedding */
export function useIsWeddingOwner(weddingUserId: string | undefined) {
  return useQuery({
    queryKey: ["wedding-owner", weddingUserId],
    queryFn: async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      return user?.id === weddingUserId;
    },
    enabled: !!weddingUserId,
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
