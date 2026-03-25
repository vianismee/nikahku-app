"use client";

import { useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";

type TableName = keyof Database["public"]["Tables"];

interface UseRealtimeOptions {
  table: TableName;
  queryKey: string[];
  filter?: string;
  enabled?: boolean;
}

/**
 * Subscribe to Supabase Realtime changes and auto-invalidate TanStack Query cache.
 *
 * @example
 * useRealtime({
 *   table: "vendors",
 *   queryKey: ["vendors", weddingId],
 *   filter: `wedding_id=eq.${weddingId}`,
 *   enabled: !!weddingId,
 * });
 */
export function useRealtime({ table, queryKey, filter, enabled = true }: UseRealtimeOptions) {
  const queryClient = useQueryClient();
  const queryKeyStr = useMemo(() => JSON.stringify(queryKey), [queryKey]);

  useEffect(() => {
    if (!enabled) return;

    const supabase = createClient();
    const channelName = `realtime-${table}-${queryKeyStr}`;

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: table as string,
          ...(filter ? { filter } : {}),
        },
        () => {
          queryClient.invalidateQueries({ queryKey: JSON.parse(queryKeyStr) });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter, enabled, queryClient, queryKeyStr]);
}
