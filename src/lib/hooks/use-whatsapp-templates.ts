"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWhatsappTemplates,
  createWhatsappTemplate,
  updateWhatsappTemplate,
  deleteWhatsappTemplate,
  setDefaultTemplate,
} from "@/app/actions/whatsapp";

export function useWhatsappTemplates(weddingId: string | undefined) {
  return useQuery({
    queryKey: ["whatsapp_templates", weddingId],
    queryFn: () => getWhatsappTemplates(weddingId!),
    enabled: !!weddingId,
  });
}

export function useCreateWhatsappTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ weddingId, ...input }: { weddingId: string; name: string; body: string }) =>
      createWhatsappTemplate(weddingId, input),
    onSuccess: (_, v) => qc.invalidateQueries({ queryKey: ["whatsapp_templates", v.weddingId] }),
  });
}

export function useUpdateWhatsappTemplate(weddingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: { id: string; name?: string; body?: string }) =>
      updateWhatsappTemplate(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["whatsapp_templates", weddingId] }),
  });
}

export function useDeleteWhatsappTemplate(weddingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteWhatsappTemplate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["whatsapp_templates", weddingId] }),
  });
}

export function useSetDefaultTemplate(weddingId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (templateId: string) => setDefaultTemplate(weddingId, templateId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["whatsapp_templates", weddingId] }),
  });
}
