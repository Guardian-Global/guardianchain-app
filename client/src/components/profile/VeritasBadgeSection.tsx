// client/src/components/profile/VeritasBadgeSection.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type BadgeData = {
  id: string;
  label: string;
  icon: string;
  value: number;
  tier: "bronze" | "silver" | "gold" | "platinum";
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function VeritasBadgeSection({ wallet }: { wallet: string }) {
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBadges();
  }, [wallet]);

  async function loadBadges() {
    const { data, error } = await supabase
      .from("veritas_badges")
      .select("*")
      .eq("owner_wallet", wallet);

    if (error) {
      console.error("Badge fetch error", error);
      return;
    }

    setBadges(data || []);
    setLoading(false);
  }

  if (loading) return <p className="text-gray-500">Loading badges...</p>;

  if (badges.length === 0)
    return <p className="text-gray-400">No Veritas badges found yet.</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className={`p-4 rounded shadow-md bg-gradient-to-br ${
            tierColors[badge.tier]
          } text-white`}
        >
          <div className="text-xl mb-2">{badge.icon}</div>
          <div className="text-sm uppercase tracking-wide">{badge.label}</div>
          <div className="text-2xl font-bold">{badge.value}</div>
          <div className="text-xs opacity-80 mt-1">{badge.tier.toUpperCase()}</div>
        </div>
      ))}
    </div>
  );
}

const tierColors: Record<string, string> = {
  bronze: "from-yellow-700 to-yellow-500",
  silver: "from-gray-400 to-gray-200",
  gold: "from-amber-400 to-yellow-300",
  platinum: "from-blue-400 to-cyan-300"
};
