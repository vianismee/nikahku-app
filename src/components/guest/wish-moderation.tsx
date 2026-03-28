"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { EyeOff, Trash2, Heart } from "lucide-react";
import type { Tables } from "@/lib/supabase/database.types";

type Wish = Tables<"wishes">;

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam lalu`;
  return `${Math.floor(hrs / 24)} hari lalu`;
}

export function WishModeration({ weddingId }: { weddingId: string }) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null);

  async function loadWishes() {
    const supabase = createClient();
    const { data } = await supabase
      .from("wishes")
      .select("*")
      .eq("wedding_id", weddingId)
      .order("created_at", { ascending: false });
    setWishes(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadWishes();

    const supabase = createClient();
    channelRef.current = supabase
      .channel(`wishes-mod:${weddingId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wishes", filter: `wedding_id=eq.${weddingId}` },
        () => loadWishes()
      )
      .subscribe();

    return () => { channelRef.current?.unsubscribe(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weddingId]);

  async function handleToggleVisible(wish: Wish) {
    const supabase = createClient();
    const { error } = await supabase
      .from("wishes")
      .update({ is_visible: !wish.is_visible } as never)
      .eq("id", wish.id);
    if (error) { toast.error("Gagal memperbarui ucapan"); return; }
    setWishes((prev) => prev.map((w) => w.id === wish.id ? { ...w, is_visible: !w.is_visible } : w));
    toast.success(wish.is_visible ? "Ucapan disembunyikan" : "Ucapan ditampilkan kembali");
  }

  async function handleDelete(wish: Wish) {
    const supabase = createClient();
    const { error } = await supabase.from("wishes").delete().eq("id", wish.id);
    if (error) { toast.error("Gagal menghapus ucapan"); return; }
    setWishes((prev) => prev.filter((w) => w.id !== wish.id));
    toast.success("Ucapan dihapus");
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
      </div>
    );
  }

  if (wishes.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Heart className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p className="text-sm">Belum ada ucapan dari tamu</p>
      </div>
    );
  }

  const visible = wishes.filter((w) => w.is_visible).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{wishes.length} ucapan total · {visible} ditampilkan</span>
      </div>

      <div className="space-y-3">
        {wishes.map((w) => (
          <Card
            key={w.id}
            className={`p-4 space-y-2 transition-opacity ${!w.is_visible ? "opacity-50" : ""}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{w.guest_name}</span>
                  <span className="text-xs text-muted-foreground">{timeAgo(w.created_at)}</span>
                  {!w.is_visible && (
                    <Badge variant="outline" className="text-xs">Disembunyikan</Badge>
                  )}
                  {w.updated_at !== w.created_at && (
                    <Badge variant="outline" className="text-xs">Diedit</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed break-words">
                  {w.message}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleToggleVisible(w)}
                  title={w.is_visible ? "Sembunyikan" : "Tampilkan"}
                >
                  <EyeOff className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(w)}
                  title="Hapus"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
