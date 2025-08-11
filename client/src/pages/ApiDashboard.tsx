import React, { useState } from "react";

export default function ApiDashboard() {
  // Placeholder state
  const [apiKey, setApiKey] = useState("sk_live_1234abcd5678efgh");
  const [usage, setUsage] = useState({
    requests: 1200,
    limit: 5000,
    period: "month"
  });
  const [showKey, setShowKey] = useState(false);

  const handleRegenerate = () => {
    setApiKey("sk_live_" + Math.random().toString(36).slice(2, 14));
  };

  return (
    <div className="max-w-2xl mx-auto p-8 mt-10 bg-white/90 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-indigo-700">API Access Dashboard</h1>
      <div className="mb-6 p-4 bg-indigo-50 rounded">
        <div className="flex items-center gap-4 mb-2">
          <span className="font-semibold">API Key:</span>
          <span className="font-mono bg-gray-100 px-2 py-1 rounded select-all">
            {showKey ? apiKey : "••••••••••••••••"}
          </span>
          <button className="text-xs text-indigo-600 underline" onClick={() => setShowKey(!showKey)}>
            {showKey ? "Hide" : "Show"}
          </button>
          <button className="ml-2 px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-xs" onClick={handleRegenerate}>
            Regenerate
          </button>
        </div>
        <div className="text-gray-700 text-sm">Keep your API key secret. Regenerate if you suspect compromise.</div>
      </div>
      <div className="mb-6 p-4 bg-white rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Usage</h2>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xl text-indigo-700">{usage.requests}</span>
          <span className="text-gray-500">/ {usage.limit} requests this {usage.period}</span>
        </div>
        <div className="w-full bg-gray-200 rounded h-2 mt-2">
          <div className="bg-indigo-500 h-2 rounded" style={{ width: `${(usage.requests / usage.limit) * 100}%` }} />
        </div>
      </div>
      <div className="flex gap-4">
        <button className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
          Upgrade Plan
        </button>
        <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition">
          View API Docs
        </button>
      </div>
    </div>
  );
}
