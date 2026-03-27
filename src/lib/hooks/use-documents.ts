"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/database.types";

export function useDocuments(weddingId: string | undefined) {
  return useQuery({
    queryKey: ["documents", weddingId],
    queryFn: async () => {
      if (!weddingId) return [];
      const supabase = createClient();
      const { data, error } = await supabase
        .from("wedding_documents")
        .select("*")
        .eq("wedding_id", weddingId);
      if (error) throw error;
      return (data ?? []) as Tables<"wedding_documents">[];
    },
    enabled: !!weddingId,
  });
}

export function useUpsertDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      weddingId,
      docKey,
      isChecked,
      driveUrl,
      notes,
    }: {
      weddingId: string;
      docKey: string;
      isChecked?: boolean;
      driveUrl?: string | null;
      notes?: string | null;
    }) => {
      const supabase = createClient();
      const { error } = await supabase.from("wedding_documents").upsert(
        {
          wedding_id: weddingId,
          doc_key: docKey,
          ...(isChecked !== undefined ? { is_checked: isChecked } : {}),
          ...(driveUrl !== undefined ? { drive_url: driveUrl || null } : {}),
          ...(notes !== undefined ? { notes: notes || null } : {}),
        } as never,
        { onConflict: "wedding_id,doc_key" }
      );
      if (error) throw error;
      return { weddingId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["documents", data.weddingId] });
    },
  });
}
