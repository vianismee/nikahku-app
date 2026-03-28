"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { getWishes, type WishPublic } from "@/app/actions/rsvp";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} jam lalu`;
  return `${Math.floor(hrs / 24)} hari lalu`;
}

export default function WishesDisplayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [weddingId, setWeddingId] = useState<string | null>(null);
  const [coupleName, setCoupleName] = useState("Ahmad & Siti");
  const [wishes, setWishes] = useState<WishPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null);

  useEffect(() => {
    params.then(async ({ slug }) => {
      const supabase = createClient();

      // Lookup wedding by rsvp_slug (sama dengan getInvitation)
      const { data: wedding } = await supabase
        .from("weddings")
        .select("id, partner_1_name, partner_2_name")
        .eq("rsvp_slug", slug)
        .single() as unknown as {
          data: { id: string; partner_1_name: string; partner_2_name: string } | null;
        };

      if (!wedding) { setLoading(false); return; }

      const wId = wedding.id;
      setWeddingId(wId);
      setCoupleName(`${wedding.partner_1_name} & ${wedding.partner_2_name}`);

      const ws = await getWishes(wId, 100);
      setWishes(ws);
      setLoading(false);

      // Realtime subscription
      channelRef.current = supabase
        .channel(`wishes-display:${wId}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "wishes", filter: `wedding_id=eq.${wId}` },
          (payload) => {
            const w = payload.new as WishPublic;
            if (w.is_visible !== false) {
              setWishes((prev) => [w, ...prev]);
            }
          }
        )
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "wishes", filter: `wedding_id=eq.${wId}` },
          (payload) => {
            const w = payload.new as WishPublic;
            setWishes((prev) =>
              prev.map((x) => (x.id === w.id ? w : x)).filter((x) => x.is_visible)
            );
          }
        )
        .subscribe();
    });

    return () => {
      channelRef.current?.unsubscribe();
    };
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1208] flex items-center justify-center">
        <div className="text-amber-200 text-lg animate-pulse">Memuat...</div>
      </div>
    );
  }

  return (
    <main
      className="min-h-screen bg-[#1a1208] text-amber-50 overflow-hidden"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      {/* Header */}
      <div className="text-center py-8 px-6">
        <div className="text-amber-400/60 text-sm tracking-widest uppercase mb-2">
          Ucapan & Doa
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-amber-100">{coupleName}</h1>
        <div className="mt-2 h-px bg-amber-800/50 max-w-xs mx-auto" />
      </div>

      {/* Wishes */}
      <div className="px-6 pb-8 max-w-3xl mx-auto space-y-4">
        {wishes.length === 0 ? (
          <div className="text-center py-16 text-amber-400/60">
            <p className="text-lg">Belum ada ucapan</p>
            <p className="text-sm mt-1">Ucapan akan tampil di sini secara real-time</p>
          </div>
        ) : (
          wishes.map((w, i) => (
            <div
              key={w.id}
              className="bg-amber-950/40 border border-amber-800/30 rounded-xl p-5 space-y-2"
              style={{
                animation: i === 0 ? "slideIn 0.4s ease-out" : undefined,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-200 text-base">
                  🌸 {w.guest_name}
                </span>
                <span className="text-xs text-amber-600">{timeAgo(w.created_at)}</span>
              </div>
              <p className="text-amber-100/90 leading-relaxed text-sm md:text-base">
                {w.message}
              </p>
            </div>
          ))
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
