import { useEffect, useState } from "react";

export default function GriefAnalyticsDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/stats/grief")
      .then((res) => res.json())
      .then(setStats);
  }, []);

  if (!stats) return <p className="p-4">Loading analytics...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📊 Grief Capsule Analytics</h1>
      <ul className="grid grid-cols-2 gap-4 text-sm">
        <li className="p-4 bg-gray-100 rounded">🧠 Avg GriefScore: <strong>{stats.avgScore}</strong></li>
        <li className="p-4 bg-gray-100 rounded">🔢 Total Capsules: <strong>{stats.total}</strong></li>
        <li className="p-4 bg-gray-100 rounded">🌍 Chains Used: <strong>{stats.chains.join(", ")}</strong></li>
        <li className="p-4 bg-gray-100 rounded">👁️ Witness Validated: <strong>{stats.approved}</strong></li>
      </ul>
    </div>
  );
}
