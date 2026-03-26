"use client";

import { Users, UserCheck, UserX, UsersRound } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import type { Tables } from "@/lib/supabase/database.types";

interface GuestStatsProps {
  guests: Tables<"guests">[];
}

export function GuestStats({ guests }: GuestStatsProps) {
  const totalGuests = guests.length;
  const totalPax = guests.reduce((sum, g) => sum + g.pax_count, 0);
  const hadirGuests = guests.filter((g) => g.rsvp_status === "hadir");
  const hadirCount = hadirGuests.length;
  const hadirPax = hadirGuests.reduce((sum, g) => sum + g.pax_count, 0);
  const belumKonfirmasi = guests.filter(
    (g) => g.rsvp_status === "belum_konfirmasi" || g.rsvp_status === "undangan_terkirim"
  ).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Tamu"
        value={String(totalGuests)}
        icon={Users}
      />
      <StatCard
        label="Total Pax"
        value={String(totalPax)}
        icon={UsersRound}
        description="Jumlah kehadiran"
      />
      <StatCard
        label="Hadir"
        value={String(hadirCount)}
        icon={UserCheck}
        description={hadirCount > 0 ? `${hadirPax} pax` : undefined}
      />
      <StatCard
        label="Belum Konfirmasi"
        value={String(belumKonfirmasi)}
        icon={UserX}
        description="Terkirim + belum konfirmasi"
      />
    </div>
  );
}
