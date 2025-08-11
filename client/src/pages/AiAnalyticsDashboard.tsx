import React from "react";

const sampleInsights = [
  { label: "Sentiment Score", value: "+0.82", description: "Overall positive sentiment across recent capsules." },
  { label: "Anomaly Detection", value: "1 flagged", description: "1 capsule flagged for unusual activity." },
  { label: "Engagement Index", value: "87%", description: "High engagement with shared capsules." },
  { label: "AI Summary", value: "Most capsules reflect optimism and resilience." }
];

export default function AiAnalyticsDashboard() {
  return (
    <div className="max-w-3xl mx-auto p-8 mt-10">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">AI Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {sampleInsights.map((insight, idx) => (
          <div key={idx} className="bg-white/90 rounded-xl shadow-lg p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">{insight.label}</h2>
              <div className="text-2xl font-bold text-indigo-600 mb-2">{insight.value}</div>
              <p className="text-gray-700 mb-2">{insight.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white/90 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Custom AI Report</h2>
        <textarea className="w-full border rounded p-2 mb-4" rows={4} placeholder="Ask the AI for a custom report (e.g., 'Show capsules with negative sentiment last 30 days')" />
        <button className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">Generate Report</button>
      </div>
    </div>
  );
}
