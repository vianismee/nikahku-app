"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/status-badge";
import { PlatformIcon } from "@/components/shared/platform-icon";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { PurchaseStatusToggle } from "./purchase-status-toggle";
import { SeserahanFormDialog } from "./seserahan-form-dialog";
import { useUpdateSeserahan, useDeleteSeserahan, useReorderSeserahan } from "@/lib/hooks/use-seserahan";
import {
  PRIORITIES,
  SESERAHAN_CATEGORIES,
  type PurchaseStatus,
  type SeserahanPriority,
} from "@/lib/constants/seserahan-statuses";
import { formatRupiah } from "@/lib/utils/format-currency";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import type { Tables } from "@/lib/supabase/database.types";
import { toast } from "sonner";

interface SeserahanTableProps {
  items: Tables<"seserahan">[];
  weddingId: string;
}

export function SeserahanTable({ items, weddingId }: SeserahanTableProps) {
  const updateItem = useUpdateSeserahan();
  const deleteItem = useDeleteSeserahan();
  const reorderItems = useReorderSeserahan();

  const [editItem, setEditItem] = useState<Tables<"seserahan"> | undefined>();
  const [editOpen, setEditOpen] = useState(false);

  // Inline editing state
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);
  const [inlineEditValue, setInlineEditValue] = useState("");

  // DnD state (native HTML5)
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [localItems, setLocalItems] = useState<Tables<"seserahan">[]>(items);
  const prevItemsPropRef = useRef<Tables<"seserahan">[]>(items);

  // Sync localItems when items prop changes (after mutation)
  useEffect(() => {
    if (items !== prevItemsPropRef.current) {
      prevItemsPropRef.current = items;
      setLocalItems(items);
    }
  }, [items]);

  // --- Inline editing helpers ---
  function startInlineEdit(item: Tables<"seserahan">) {
    setInlineEditId(item.id);
    setInlineEditValue(item.item_name);
  }

  async function commitInlineEdit(id: string) {
    const trimmed = inlineEditValue.trim();
    if (!trimmed) {
      setInlineEditId(null);
      return;
    }
    setInlineEditId(null);
    try {
      await updateItem.mutateAsync({ id, item_name: trimmed });
    } catch {
      toast.error("Gagal menyimpan nama item");
    }
  }

  async function handlePriorityChange(id: string, priority: SeserahanPriority) {
    try {
      await updateItem.mutateAsync({ id, priority });
    } catch {
      toast.error("Gagal menyimpan prioritas");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteItem.mutateAsync({ id, weddingId });
      toast.success("Item berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus item");
    }
  }

  // --- DnD handlers ---
  const handleDragStart = useCallback((id: string) => {
    setDraggedId(id);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, id: string) => {
      e.preventDefault();
      if (id !== draggedId) setDragOverId(id);
    },
    [draggedId]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, targetId: string) => {
      e.preventDefault();
      if (!draggedId || draggedId === targetId) {
        setDraggedId(null);
        setDragOverId(null);
        return;
      }

      const newItems = [...localItems];
      const fromIdx = newItems.findIndex((i) => i.id === draggedId);
      const toIdx = newItems.findIndex((i) => i.id === targetId);
      if (fromIdx === -1 || toIdx === -1) return;

      const [moved] = newItems.splice(fromIdx, 1);
      newItems.splice(toIdx, 0, moved);

      setLocalItems(newItems);
      setDraggedId(null);
      setDragOverId(null);

      // Persist new sort_order
      reorderItems.mutate({
        weddingId,
        items: newItems.map((item, idx) => ({ id: item.id, sort_order: idx })),
      });
    },
    [draggedId, localItems, reorderItems, weddingId]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
    setDragOverId(null);
  }, []);

  return (
    <>
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="w-8 px-2 py-3" />
                <th className="px-3 py-3 text-left font-medium text-muted-foreground">Item</th>
                <th className="px-3 py-3 text-left font-medium text-muted-foreground">Kategori</th>
                <th className="px-3 py-3 text-left font-medium text-muted-foreground">Prioritas</th>
                <th className="px-3 py-3 text-left font-medium text-muted-foreground">Estimasi Harga</th>
                <th className="px-3 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-3 py-3 text-left font-medium text-muted-foreground">Harga Aktual</th>
                <th className="px-3 py-3 text-left font-medium text-muted-foreground">Toko</th>
                <th className="w-20 px-3 py-3" />
              </tr>
            </thead>
            <tbody>
              {localItems.map((item) => (
                <tr
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(item.id)}
                  onDragOver={(e) => handleDragOver(e, item.id)}
                  onDrop={(e) => handleDrop(e, item.id)}
                  onDragEnd={handleDragEnd}
                  className={[
                    "border-b transition-colors last:border-0",
                    draggedId === item.id ? "opacity-40" : "",
                    dragOverId === item.id ? "bg-primary/5 border-t-2 border-t-primary" : "hover:bg-muted/30",
                  ].join(" ")}
                >
                  {/* Drag handle */}
                  <td className="px-2 py-3 cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground">
                    <GripVertical className="h-4 w-4 mx-auto" />
                  </td>

                  {/* Item name — double-click to inline edit */}
                  <td className="px-3 py-3 min-w-[160px]">
                    {inlineEditId === item.id ? (
                      <Input
                        autoFocus
                        value={inlineEditValue}
                        onChange={(e) => setInlineEditValue(e.target.value)}
                        onBlur={() => commitInlineEdit(item.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitInlineEdit(item.id);
                          if (e.key === "Escape") setInlineEditId(null);
                        }}
                        className="h-7 text-sm px-2 py-0"
                      />
                    ) : (
                      <div
                        className="group cursor-text"
                        onDoubleClick={() => startInlineEdit(item)}
                        title="Double-click untuk edit"
                      >
                        <span className="font-medium group-hover:underline decoration-dotted">
                          {item.item_name}
                        </span>
                        {item.brand && (
                          <span className="text-xs text-muted-foreground ml-1.5">({item.brand})</span>
                        )}
                        {item.sub_category && (
                          <p className="text-xs text-muted-foreground">{item.sub_category}</p>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Kategori */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    {SESERAHAN_CATEGORIES[item.category]}
                  </td>

                  {/* Prioritas — click to change */}
                  <td className="px-3 py-3">
                    <Select
                      value={item.priority}
                      onValueChange={(v) => handlePriorityChange(item.id, v as SeserahanPriority)}
                      items={Object.entries(PRIORITIES).map(([k, v]) => ({ value: k, label: v.label }))}
                    >
                      <SelectTrigger className="h-auto border-0 shadow-none p-0 w-auto bg-transparent hover:bg-transparent focus:ring-0 [&>svg]:hidden">
                        <StatusBadge {...PRIORITIES[item.priority]} />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.entries(PRIORITIES) as [SeserahanPriority, { label: string; color: string }][]).map(
                          ([key, val]) => (
                            <SelectItem key={key} value={key}>
                              {val.label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </td>

                  {/* Estimasi harga */}
                  <td className="px-3 py-3 font-number whitespace-nowrap text-sm">
                    {item.price_min > 0 || item.price_max > 0
                      ? item.price_min === item.price_max
                        ? formatRupiah(item.price_max)
                        : `${formatRupiah(item.price_min)} – ${formatRupiah(item.price_max)}`
                      : "-"}
                  </td>

                  {/* Purchase status */}
                  <td className="px-3 py-3">
                    <PurchaseStatusToggle
                      itemId={item.id}
                      currentStatus={item.purchase_status as PurchaseStatus}
                      actualPrice={item.actual_price}
                      purchaseDate={item.purchase_date}
                    />
                  </td>

                  {/* Harga aktual */}
                  <td className="px-3 py-3 font-number whitespace-nowrap text-sm">
                    {item.actual_price ? formatRupiah(item.actual_price) : "-"}
                  </td>

                  {/* Toko */}
                  <td className="px-3 py-3">
                    <PlatformIcon url={item.shop_url} showLabel />
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          setEditItem(item);
                          setEditOpen(true);
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <ConfirmDialog
                        trigger={
                          <Button variant="ghost" size="icon-sm">
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        }
                        title="Hapus Item"
                        description={`Yakin ingin menghapus "${item.item_name}"?`}
                        onConfirm={() => handleDelete(item.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}

              {localItems.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-3 py-8 text-center text-sm text-muted-foreground">
                    Tidak ada item
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SeserahanFormDialog
        weddingId={weddingId}
        item={editItem}
        open={editOpen}
        onOpenChange={(o) => {
          setEditOpen(o);
          if (!o) setEditItem(undefined);
        }}
      />
    </>
  );
}
