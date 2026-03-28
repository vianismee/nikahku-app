"use server";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type WhatsappTemplate = Tables<"whatsapp_templates">;

export async function getWhatsappTemplates(weddingId: string): Promise<WhatsappTemplate[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("whatsapp_templates")
    .select("*")
    .eq("wedding_id", weddingId)
    .order("sort_order")
    .order("created_at") as unknown as { data: WhatsappTemplate[] | null };
  return data ?? [];
}

export async function createWhatsappTemplate(
  weddingId: string,
  input: { name: string; body: string; is_default?: boolean }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("whatsapp_templates")
    .insert({ ...input, wedding_id: weddingId } as never);
  if (error) return { success: false, error: (error as { message: string }).message };
  return { success: true };
}

export async function updateWhatsappTemplate(
  id: string,
  input: { name?: string; body?: string; is_default?: boolean }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("whatsapp_templates")
    .update(input as never)
    .eq("id", id);
  if (error) return { success: false, error: (error as { message: string }).message };
  return { success: true };
}

export async function deleteWhatsappTemplate(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("whatsapp_templates").delete().eq("id", id);
  if (error) return { success: false, error: (error as { message: string }).message };
  return { success: true };
}

export async function setDefaultTemplate(
  weddingId: string,
  templateId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  // unset all
  await supabase.from("whatsapp_templates").update({ is_default: false } as never).eq("wedding_id", weddingId);
  // set chosen
  const { error } = await supabase.from("whatsapp_templates").update({ is_default: true } as never).eq("id", templateId);
  if (error) return { success: false, error: (error as { message: string }).message };
  return { success: true };
}
