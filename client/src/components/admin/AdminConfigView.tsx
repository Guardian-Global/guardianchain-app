// client/src/components/admin/AdminConfigView.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type ConfigItem = {
  id: number;
  key: string;
  value: string;
  updated_at: string;
};

export default function AdminConfigView() {
  const [configItems, setConfigItems] = useState<ConfigItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    const { data, error } = await supabase
      .from("admin_config")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching config:", error);
      return;
    }

    setConfigItems(data || []);
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">🛠 Admin Config Panel</h2>
      {loading ? (
        <p className="text-gray-500">Loading config data...</p>
      ) : (
        <table className="w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2">Key</th>
              <th className="p-2">Value</th>
              <th className="p-2">Updated</th>
            </tr>
          </thead>
          <tbody>
            {configItems.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-2">{item.key}</td>
                <td className="p-2">{item.value}</td>
                <td className="p-2">
                  {new Date(item.updated_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
