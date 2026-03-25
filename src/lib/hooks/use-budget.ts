"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Tables, InsertTables, UpdateTables } from "@/lib/supabase/database.types";

export type BudgetAllocationWithCategory = Tables<"budget_allocations"> & {
  vendor_categories: { name: string; icon: string; color: string } | null;
};

export function useBudget(weddingId: string | undefined) {
  return useQuery({
    queryKey: ["budget", weddingId],
    queryFn: async () => {
      if (!weddingId) return null;
      const supabase = createClient();

      const { data, error } = await supabase
        .from("budgets")
        .select("*")
        .eq("wedding_id", weddingId)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data as Tables<"budgets"> | null;
    },
    enabled: !!weddingId,
  });
}

export function useExpenses(weddingId: string | undefined) {
  return useQuery({
    queryKey: ["expenses", weddingId],
    queryFn: async () => {
      if (!weddingId) return [];
      const supabase = createClient();

      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("wedding_id", weddingId)
        .order("expense_date", { ascending: false });

      if (error) throw error;
      return (data ?? []) as Tables<"expenses">[];
    },
    enabled: !!weddingId,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expense: InsertTables<"expenses">) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("expenses")
        .insert(expense as never)
        .select()
        .single();

      if (error) throw error;
      return data as Tables<"expenses">;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["expenses", variables.wedding_id] });
      queryClient.invalidateQueries({ queryKey: ["budget", variables.wedding_id] });
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateTables<"expenses"> & { id: string }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("expenses")
        .update(updates as never)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Tables<"expenses">;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["expenses", data.wedding_id] });
      queryClient.invalidateQueries({ queryKey: ["budget", data.wedding_id] });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, weddingId }: { id: string; weddingId: string }) => {
      const supabase = createClient();
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) throw error;
      return { weddingId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["expenses", data.weddingId] });
      queryClient.invalidateQueries({ queryKey: ["budget", data.weddingId] });
    },
  });
}

export function useBudgetAllocations(weddingId: string | undefined) {
  return useQuery({
    queryKey: ["budget-allocations", weddingId],
    queryFn: async () => {
      if (!weddingId) return [];
      const supabase = createClient();

      const { data, error } = await supabase
        .from("budget_allocations")
        .select("*, vendor_categories(name, icon, color)")
        .eq("wedding_id", weddingId);

      if (error) throw error;
      return (data ?? []) as unknown as BudgetAllocationWithCategory[];
    },
    enabled: !!weddingId,
  });
}

export function useUpsertAllocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (allocation: InsertTables<"budget_allocations">) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("budget_allocations")
        .upsert(allocation as never, {
          onConflict: "wedding_id,category_id",
        })
        .select()
        .single();

      if (error) throw error;
      return data as Tables<"budget_allocations">;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["budget-allocations", variables.wedding_id] });
      queryClient.invalidateQueries({ queryKey: ["budget", variables.wedding_id] });
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ weddingId, totalAmount }: { weddingId: string; totalAmount: number }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("budgets")
        .upsert(
          { wedding_id: weddingId, total_amount: totalAmount } as never,
          { onConflict: "wedding_id" }
        )
        .select()
        .single();

      if (error) throw error;
      return data as Tables<"budgets">;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["budget", data.wedding_id] });
    },
  });
}
