// File: client/src/components/analytics/CapsuleAnalyticsBlock.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type CapsuleStats = {
  capsule_id: string;
  views: number;
  unlocks: number;
  total_yield: number;
  grief_score_avg: number;
  created_at: string;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CapsuleAnalyticsBlock() {
  const [stats, setStats] = useState<CapsuleStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    const { data, error } = await supabase
      .from("capsule_analytics")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error loading analytics:", error);
      setLoading(false);
    }

    if (data) {
      setStats(data);
      setLoading(false);
    }
  }

  if (loading) return <p className="p-4 text-gray-500">Loading capsule analytics...</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">📊 Capsule Analytics</h2>
      <table className="w-full text-sm text-left border border-gray-200">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-2">Capsule ID</th>
            <th className="p-2">Views</th>
            <th className="p-2">Unlocks</th>
            <th className="p-2">Yield ($)</th>
            <th className="p-2">Avg. Grief Score</th>
            <th className="p-2">Created</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat) => (
            <tr key={stat.capsule_id} className="border-t">
              <td className="p-2 text-blue-600">{stat.capsule_id.slice(0, 8)}...</td>
              <td className="p-2">{stat.views}</td>
              <td className="p-2">{stat.unlocks}</td>
              <td className="p-2">${stat.total_yield.toFixed(2)}</td>
              <td className="p-2">{stat.grief_score_avg.toFixed(1)}</td>
              <td className="p-2">{new Date(stat.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
